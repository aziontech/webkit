A single LLM call has a fairly small operational footprint. Your application sends a prompt, waits for a response, and either uses the result or retries the request. Most of the state and failure handling still belongs to the application code around the model, not to the call itself.

An agentic workflow changes that. Instead of one request and one response, the model reasons about what to do, calls a tool, reads the result, and decides on the next step, sometimes several times before it produces a final answer. Each of those steps can fail on its own, and each one needs somewhere to keep track of what already happened.

Most teams don’t plan for that jump. They build a prototype around one API call, it works, and then someone asks: can it also check the database, call two more APIs, and remember what happened last time? That’s the moment a chatbot demo turns into a distributed systems problem.

This guide covers what changes in your infrastructure requirements when you move from single calls to agentic workflows, and how to architect around it.

---

## What changes when a workflow becomes agentic

An agentic workflow typically adds requirements a single call doesn’t have:

- **State across steps**. The agent needs to know what it already did and what came back before deciding the next action.
- **Multi-step orchestration**. Instead of one request-response, you get a loop: reason, act, observe, repeat, until a stopping condition is met.
- **Tool calls and data access**. The agent reaches out to APIs, databases, or vector stores mid-conversation, and each call is a new place things can fail.
- **Longer-lived execution**. A workflow can run for seconds or minutes across several round trips, not milliseconds for one call.

Distributed applications have dealt with these problems for years, independent of AI: where state lives, how to keep latency down when work is split across services, how to fail gracefully when one step breaks. Agentic AI adds an LLM as one more moving part in that same chain.

## Where prototypes break in production

A prototype calling one model endpoint feels instant. An agent that calls the model, then a tool, then the model again, then a database, adds up fast if each hop round-trips to a centralized region.

Session context, conversation history, and intermediate results often end up in ad hoc places, a global variable, a local cache, sometimes nothing at all, so the agent forgets context between calls.

Running inference reliably at scale means provisioning, scaling, and monitoring GPU capacity, which is a second project most application teams didn’t sign up for.

And RAG lookups, memory retrieval, and application data frequently live in separate services with different latency profiles, so the workflow ends up only as fast as its slowest step. None of this shows up in a demo with one user and no load; it shows up once real traffic hits the workflow.

## The five layers of an agentic workflow

Before mapping this to any specific product, it helps to name the pieces an agentic workflow actually needs, independent of vendor:

1. **Orchestration** – the control flow that decides what happens next: call the model, call a tool, check memory, stop.
2. **Inference** – the model calls themselves: chat completions, embeddings, reranking.
3. **Working state** – short-lived data the loop needs between steps, such as the current conversation turn, counters, or flags.
4. **Durable and semantic memory** – longer-lived structured data and vector-searchable context used for retrieval and RAG.
5. **Policy and access control** – rules that govern what the agent is allowed to do, which tools it can call, and with what permissions.

When these systems get slow or unreliable in production, it’s usually because one of these layers is missing, centralized somewhere it shouldn’t be, or disconnected from the others.

## Mapping the layers onto Azion Platform

On [Azion Platform](https://www.azion.com/en/), these layers map onto services that already run in the same operating model instead of five separately managed systems.

[Azion Functions](https://www.azion.com/en/products/functions/) handles orchestration. It’s the loop that decides what the agent does next. However many steps that loop takes, it runs inside a single function invocation with no cold start, and calling the function again for the next user turn doesn’t pay a startup cost either.

[Azion AI Inference](https://www.azion.com/en/products/ai-inference/) handles the model layer. It supports LLMs, VLMs, embeddings, reranking, and agent workflows through an OpenAI-compatible API, and scales automatically from the first request to peak load without your team provisioning GPU clusters.

[Azion KV Store](https://www.azion.com/en/products/kv-store/) handles working state: session context, counters, flags, and intermediate results the loop needs between steps, read with low latency close to where Functions execute.

[Azion SQL Database](https://www.azion.com/en/products/sql-database/) handles durable and semantic memory. It adds vector search on top of a SQLite and libSQL model, so RAG lookups and longer-term memory queries run against the same data layer as the rest of the application, with global read replicas keeping reads close to users.

Policy and access control stay in the orchestration layer, where tool calls are validated before execution. Running orchestration, inference, and state on the same distributed platform reduces latency and operational overhead.

## A basic agent loop

Below is a simplified agent loop written as an Azion Function in JavaScript. It’s illustrative pseudocode: the endpoint, model ID, and KV Store method calls are placeholders, not exact production syntax, so check current Azion docs before copying this directly.

It also omits secrets loading, retries, and full error handling to keep the control flow visible.

```javascript
// Illustrative pseudocode. Endpoint, model ID, and KV Store method names
// are placeholders — check current Azion docs for exact syntax.
export default async function handler(request) {
  const { sessionId, message } = await request.json();

  // Conversation history: persisted across turns.
  const history = JSON.parse((await KV.get(`session:${sessionId}`)) || "[]");
  history.push({ role: "user", content: message });

  // Semantic memory: retrieved fresh each turn from SQL Database vector search.
  const memory = await queryVectorMemory(message);

  // Working messages: history plus retrieved context, scoped to this run.
  // Tool-calling steps below stay in `messages` and are not written back
  // to `history`, so long-term memory doesn't grow with every intermediate step.
  let messages = [{ role: "system", content: memory }, ...history];

  const MAX_STEPS = 4;
  let finalMessage = null;

  for (let step = 0; step < MAX_STEPS; step++) {
    const completion = await fetch("https://<your-ai-inference-endpoint>/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_INFERENCE_TOKEN}`,
      },
      body: JSON.stringify({
        model: "<your-model-id>",
        messages,
        tools: [checkOrderStatusTool, searchDocsTool],
      }),
    }).then((r) => r.json());

    const assistantMessage = completion.choices[0].message;
    messages.push(assistantMessage);

    if (!assistantMessage.tool_calls) {
      finalMessage = assistantMessage;
      break;
    }

    // Tool calls returned in the same message can run in parallel.
    const results = await Promise.all(
      assistantMessage.tool_calls.map((call) => runAuthorizedTool(call, sessionId))
    );

    assistantMessage.tool_calls.forEach((call, i) => {
      messages.push({ role: "tool", tool_call_id: call.id, content: results[i] });
    });
  }

  // If the step limit is hit without a final answer, fail safely
  // instead of returning an empty response.
  if (!finalMessage) {
    finalMessage = {
      role: "assistant",
      content: "I wasn't able to finish that request. Please try again.",
    };
  }

  history.push(finalMessage);
  await KV.put(`session:${sessionId}`, JSON.stringify(history), { ttl: 3600 });

  return new Response(JSON.stringify(finalMessage));
}
```

The loop keeps calling the model until it returns a message with no further tool calls or until it hits a step limit, which is what keeps a runaway agent from looping indefinitely. **runAuthorizedTool** is doing real work in this design: it’s where permission checks happen before a tool call executes, not just where the call gets dispatched.

Session history, retrieved memory, and tool results all live in the same distributed architecture as the Function orchestrating the loop, instead of forcing a round trip to a centralized backend for each one. It doesn’t make four model calls as fast as one, but it keeps everything around those calls, the state, from adding its own latency on top.

## Tool permissions and request-time controls

Inbound protection and tool-call authorization solve different problems.[Azion Firewall](https://www.azion.com/en/documentation/products/secure/overview/) and [Web Application Firewall](https://www.azion.com/en/products/web-application-firewall/) inspect requests before they reach the agent, but they don’t automatically govern the tool calls it makes.

Those controls belong in the orchestration layer. Tool arguments, user permissions, and execution limits should be validated before each action, as represented by **runAuthorizedTool** in the example above. A wrong decision inside a multi-step workflow can trigger a real action, so each tool call needs explicit boundaries.

Moving from a single LLM call to an agentic workflow is ultimately a shift in application architecture. The model may drive the loop, but the system around it determines whether that loop can maintain state, recover from failures, and act within defined boundaries. Treating those concerns as infrastructure decisions from the start is what separates a working prototype from a workflow that can operate reliably in production.

**Next step**: See how [Azion Functions](https://www.azion.com/en/products/functions/), [AI Inference](https://www.azion.com/en/products/ai-inference/), and [SQL Database](https://www.azion.com/en/products/sql-database/) work together for agent workflows in the [Azion documentation](https://www.azion.com/en/documentation/products/ai/ai-inference/), or [talk to an expert](https://www.azion.com/en/contact/) about moving a prototype agent into production.

---

## Frequently asked questions

**What’s the difference between a single LLM call and an agentic workflow?** A single LLM call sends one prompt and returns one completion in one round trip. An agentic workflow runs a loop: the model decides on an action, calls a tool or queries data, reads the result, and decides again, until it reaches a stopping condition. That loop is what introduces state, multi-step orchestration, and multiple failure points a single call doesn’t have.

**What kinds of state does an agentic workflow need to manage?** At minimum: conversation history (what’s been said so far), working memory (intermediate results and flags used only within the current run), tool call results (outputs from APIs or databases the agent queried), durable application state (data that persists across sessions), and semantic memory (vector-searchable context used for retrieval). Conversation history and working memory usually fit a key-value store; durable and semantic memory usually need a database with vector search.

**Why does an agentic workflow need a dedicated data layer instead of calling an API for memory?** Every extra network hop adds latency, and an agent loop can make several of those hops per turn. Keeping working state and durable memory close to the orchestration logic, in a key-value store and a database with vector search, avoids stacking round trips to a centralized service for every step.

**Do I need to manage GPU infrastructure to run an agentic workflow?** Not if the inference layer scales for you. Azion AI Inference runs LLMs, VLMs, embeddings, reranking, and agent workflows through an OpenAI-compatible API and scales automatically from the first request to peak load, so your team doesn’t provision or monitor GPU clusters directly.

**Does a firewall protect against unsafe actions an agent takes?** A web application firewall and rules engine protect the inbound request that triggers your application, including an agent. They don’t automatically govern what the agent does with its own tool calls once it’s running. Validating and scoping tool calls is logic your orchestration code has to enforce.

**Can I run this architecture with an existing OpenAI-compatible client?** Yes. Azion AI Inference exposes an OpenAI-compatible API, so an existing client typically needs a base URL and credentials change rather than a full integration rewrite.
