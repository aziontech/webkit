Agentic AI infrastructure is the execution, orchestration, data, security, and observability layer required to run AI agents reliably in production. Unlike traditional request-based applications, agents need persistent state, durable execution, controlled access to tools, inference cost limits, and step-level tracing.

This post covers the execution side of the stack. For the full layer model and the vocabulary, start with [Understanding Agentic AI Infrastructure](/site/blog/understanding-agentic-ai-infrastructure).

## What infrastructure do AI agents need in production?

Three properties shift once an agent leaves the prototype.

**Sessions replace requests**. A user goal becomes a chain of model calls, tool calls, and decisions. The unit of work is measured in steps, not milliseconds.

**Working memory becomes infrastructure**. The agent needs its goal, its step history, and its intermediate results available across those steps. In a notebook, that lives in a Python variable. In production, it needs somewhere durable.

**Inference volume is generated, not received**. One inbound request can produce thirty model calls. Capacity planning based on request rate stops predicting anything useful.

Everything below follows from those three. This post covers the layers that decide whether an agent survives its first bad Tuesday: execution, inference, and observability.

## Why traditional serverless is not enough for long-running AI agents

Request-scoped compute makes three assumptions that agent sessions violate: work finishes quickly, work is stateless, and work produces one response.

Research on stateful serverless formalizes the same limitation: conventional function-as-a-service models do not persist execution progress across invocations [(Burckhardt et al., OOPSLA 2021)](https://www.microsoft.com/en-us/research/publication/durable-functions-semantics-for-stateful-serverless/).

Durable execution adds workflows, state persistence, and recovery mechanisms so that a process can pause, resume, and survive infrastructure failures. These capabilities become essential when an agent operates across multiple steps rather than completing its work within a single request.

The concrete failures follow a pattern:

- **Timeout mid-loop.** The function limit expires at step nine. Steps one through eight already had side effects. There is no record of where to resume.
- **Lost working memory on retry.** The retry starts from the original goal with no memory of what it already tried, so it repeats the same tool calls and the same spend.
- **No pause point for approval.** An agent that must wait for a human has nowhere to park. Teams work around this by polling, which burns inference on checks that change nothing.

Concurrency makes it worse. State management is typically the first thing to degrade as scale increases, and agent-to-agent communication logs are frequently absent — which makes multi-agent incidents the hardest to reconstruct.

## How durable execution works in agentic infrastructure

The pattern that solves this separates the loop from the steps.

The loop controller owns the session: what the goal is, which step comes next, what has already happened, and how much budget remains. It holds no business logic and does no reasoning.

The steps are ordinary stateless executions. A step takes explicit input, calls a model or a tool, returns a result, and exits. It knows nothing about the session.

Between every step, the controller writes a checkpoint. A checkpoint holds the goal, the ordered step history with results, the accumulated token spend, and the next planned action. Recovery becomes a read: load the last checkpoint, resume from the next step.

This buys three properties:

- **Resumability**: a crashed session restarts from step nine rather than step one.
- **Pausability**: waiting for human approval is a checkpoint that does not advance, so nothing burns compute while it waits.
- **Idempotency**: give every side-effecting tool call a key derived from the session ID and step index, and a replayed step reuses the original result instead of creating a second record or sending a second payment.

Store checkpoints in a low-latency key-value store rather than a relational database. The access pattern is a read and a write per step, keyed by session ID, and the write is on the critical path of every step the agent takes.

### Isolating code the agent writes

Sandboxed execution applies the moment an agent generates code rather than only calling predefined tools. That code arrives untrusted twice over: the model wrote it, and a prompt injection may have shaped what the model wrote.

Treat a generated-code step as hostile input with execution privileges. Three boundaries carry most of the weight:

- Process isolation per session, so one agent’s generated code cannot read another session’s memory or checkpoints.
- No ambient credentials. Pass the specific token a step needs as explicit input. An environment variable inherited by generated code becomes whatever the code decides to do with it.
- Egress control. Generated code that can reach arbitrary hosts can exfiltrate whatever it was given. Restrict outbound destinations to the ones the task requires.

The same boundaries apply to tool calls that shell out or evaluate expressions. Any step that turns model output into execution belongs inside them.

## How to control AI agent inference costs

The most common source of unexpected cost spikes in production is unbounded reasoning loops. Nothing in the request path caps how many times an agent decides to think again.

Four controls handle most of it.

**Hard step and token ceilings.** Every session gets a maximum step count and a maximum token budget. Hitting either ends the session and escalates. Treat these as limits rather than targets. A session that keeps reaching them signals a task the agent cannot complete.

**No-progress termination.** Track whether each step changed the session state. Three consecutive steps that produce no new information usually mean the agent is looping over the same reasoning. Stop it there instead of at the ceiling.

**Model tiering.** Routing, classification, and extraction rarely need the largest model available. Reserve the expensive model for the reasoning steps and run the mechanical steps on a smaller one. In a fourteen-step session, this often moves the majority of calls to the cheaper tier.

**Retrieval caching.** Agents re-fetch the same context repeatedly within a session. Cache retrieval results against the session and the query, and the redundant calls disappear.

The economics deserve attention now rather than later. McKinsey projects IT infrastructure costs rising two to three times by 2030 while budgets remain constrained. A [PwC survey](https://www.pwc.com/us/en/tech-effect/ai-analytics/ai-agent-survey.html) reinforces the pressure created by agent adoption: 88% of executives said their organizations planned to increase AI-related budgets because of agentic AI, with more than a quarter expecting increases of 26% or more.

As agents turn a single goal into multiple model and tool calls, controlling inference volume becomes an infrastructure requirement rather than a later optimization.

## Observability for reasoning paths and tool calls

An agent’s decision path is not inspectable the way a function call stack is. The log shows the action; the chain that produced it usually goes unrecorded. Tool calls that emit no telemetry become blind spots where root cause analysis stops.

Fix this at the emission point. Treat the session as a trace and every step as a span, then record per span:

- Session ID, step index, and parent step
- Model name and prompt or template version
- Input and output token counts
- Tool name, an argument hash, and the result status
- Latency, split between inference and tool execution
- The termination reason when the session ends

Argument hashes rather than raw arguments keep sensitive values out of telemetry while still letting you spot a step repeating an identical call.

Two derived signals belong on every dashboard. Steps per session shows behavioral drift long before cost does — an agent that averaged six steps last week and averages eleven this week has changed, even if the bill hasn’t caught up. Tokens per completed goal is the unit economic that matters, because sessions that fail late are the expensive ones.

Export these traces to the same stream as application telemetry. Agent incidents rarely stay inside the agent.

## Benefits of co-locating inference, logic, and data

Latency inside an agent loop compounds. A step that calls retrieval and then inference pays both round trips, and the session pays that sum once per step. Fourteen steps at 700 ms of combined network and inference overhead is roughly ten seconds before any real work is counted.

Co-locating the model call, the tool logic, and the retrieval store on the same distributed platform attacks the multiplier rather than a single term.

- **Lower per-step overhead**, which multiplies across the session instead of adding once.
- **Predictable spend**, because token telemetry, budgets, and the execution that enforces them sit in one place.
- **Faster incident response**, since traces cover reasoning, tool calls, and results without stitching across providers.
- **Fewer cross-region hops**, which removes a class of partial failure from multi-step sessions.

## Agentic infrastructure in production compared to traditional serverless

| Dimension | Traditional serverless | Agent execution layer |
|---|---|---|
| Lifetime | Milliseconds to seconds | Seconds to hours |
| State | Externalized, often absent | Checkpointed every step |
| Retry semantics | Replay the whole invocation | Resume from last checkpoint |
| Side effects | Usually idempotent by design | Require explicit idempotency keys |
| Cost driver | Invocation count | Token spend per goal |
| Failure signal | Error rate and latency | Reasoning trace and termination reason |
| Scaling trigger | Request rate | Concurrent sessions |

These are complementary rather than competing. Most production designs use durable orchestration for the session and fast request-scoped execution for the individual steps inside it. The controller is long-lived; the steps stay short, stateless, and cheap.

The mistake worth avoiding is running the whole loop inside one long-lived process. That reintroduces the problems checkpointing solved: a crash loses the session, and nothing can pause for approval.

## Reference architectures and real-world use cases

Three shapes cover most production deployments.

**Synchronous assistant.** A person waits for the answer. The session is short, the step budget is tight, and latency dominates every design choice. Co-location of retrieval and inference matters most here. Cap steps aggressively and degrade to a partial answer rather than making the user wait.

**Background agent.** The work is submitted and the result arrives later. Sessions run minutes to hours, checkpointing carries the weight, and approval gates are practical because nothing is blocked on a response. Most operational and data-processing agents fit here.

**Event-driven verification agent.** A stream of items arrives, the agent evaluates each against a model, and matches escalate. Throughput and per-item cost dominate; sessions are short but continuous. Azion customer Axur runs this pattern for brand-abuse detection. It reduced time from detection to takedown request to five minutes, automating more than 30,000 takedowns monthly and adding 450 million new websites to verification each month.

## How Azion runs agentic infrastructure in production

Azion runs execution, inference, and data on one distributed platform. For agent workloads, that means the per-step overhead described above doesn’t compound across service boundaries.

**AI Inference** runs LLMs, VLMs, embeddings, reranking, and multimodal models with serverless scaling, so inference capacity follows session concurrency without GPU cluster provisioning. The OpenAI-compatible API means existing agent frameworks connect through a base URL and credentials rather than a rewrite.

**Functions** runs step logic close to the inference call, keeping per-step overhead low where it multiplies.

**KV Store** holds session checkpoints and working memory, matching the read-write-per-step access pattern that checkpointing creates.

**SQL Database** provides vector search for retrieval, so RAG context comes from the same platform serving the model.

**Object Storage** keeps larger artifacts an agent produces or consumes, without pushing them through the checkpoint.

**LoRA Fine-Tune** adapts a model to a domain without full retraining, which reduces the step count agents need to reach a correct answer on specialized material.

**Real-Time Events** gives request-level visibility for investigation, and **Data Stream** exports traces to the observability tooling a team already runs.

## Conclusion and next steps for agentic infrastructure in production

Running agentic infrastructure in production requires three things: checkpoint every step so failure costs one step instead of a session; cap the loop so cost stays a line item; trace the reasoning so an agent that misbehaves leaves evidence.

Teams that get this right stop treating each agent as a bespoke system. The controls live in the platform. Shipping the next agent is a matter of defining its goal, its tools, and its budget.

The next post in this series covers securing agentic infrastructure: per-agent identity, least-privilege scopes, and the tool-call attack surface.

[Read the AI Inference documentation](https://www.azion.com/en/documentation/products/ai/ai-inference/) to see how distributed inference and serverless scaling fit an agent execution layer.
