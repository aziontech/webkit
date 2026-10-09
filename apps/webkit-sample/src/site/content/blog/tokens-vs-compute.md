On July 1, 2026, Palantir CEO Alex Karp went on CNBC and said that [“something has gone completely wrong” with how AI is sold](https://www.cnbc.com/2026/07/01/palantir-karp-open-ai-anthropic-tokens.html). His target was the token-based business model used by frontier AI providers. The interview was theatrical. Still, it exposed a practical problem: AI inference pricing often uses a technical unit that finance teams struggle to connect to requests, users, or business outcomes.

The concern extends beyond Palantir. Palo Alto Networks CEO Nikesh Arora has argued that [AI token costs may need to fall by as much as 90%](https://qz.com/palo-alto-networks-ceo-ai-token-costs-enterprise-adoption-071026) for broad enterprise adoption. Uber reportedly introduced a [$1,500 monthly cap per employee and per agentic coding tool](https://techcrunch.com/2026/06/02/uber-caps-employee-ai-spending-after-blowing-through-budget-in-four-months/) after consuming its annual AI budget in four months.

Lower token prices would help, but price alone does not solve the metering problem. Tokens remain useful engineering telemetry. They are less effective as the universal commercial unit for inference because token counts change across models, tokenizers, languages, context strategies, and reasoning modes.

A compute-based model offers another path. Billing by request and GB-hour connects the invoice to workload volume, memory, and execution time, the same operational dimensions platform teams already monitor.

## Why AI inference pricing has become a governance problem

Token pricing appears straightforward on a rate card. A provider publishes one price per million input tokens and another for output tokens, allowing teams to multiply those rates by expected usage and produce a budget estimate.

That approach works well when prompts are stable, responses are bounded, and applications follow predictable request patterns. In practice, however, modern AI systems rarely behave that way. Retrieval-augmented generation changes input size based on the context retrieved, while agentic workflows can generate multiple model calls, invoke tools, retry failed steps, and reason before returning a single response.

Although the business sees only one request, the invoice may reflect several categories of token consumption. As a result, three basic FinOps questions become much harder to answer:

- What will one customer action cost?
- What caused the cost per request to change?
- Will a model upgrade change the bill even if traffic stays flat?

Token telemetry can help answer those questions with enough instrumentation. Even then, the commercial meter still forces teams to translate application behavior into model-specific units before they can forecast spend.

## Understanding how token-based pricing works

A token is a segment of text represented as a numeric identifier. Depending on the tokenizer, it can represent a word, part of a word, punctuation, or another text fragment, as the tokenizer determines how text is split before the model processes it.

Providers usually charge different rates for several token classes:

- **Input tokens:** prompts, system instructions, conversation history, and retrieved context.
- **Cached input tokens:** repeated prompt content served at a discounted rate when the provider supports prompt caching.
- **Output tokens:** visible responses plus, for some models and APIs, reasoning or formatting tokens that do not appear in the final answer.

Current pricing shows how much these categories can diverge. In July 2026, [OpenAI lists GPT-5.5](https://developers.openai.com/api/docs/pricing) at $5 per million input tokens and $30 per million output tokens on its standard short-context tier. Priority processing raises those rates to $12.50 and $75.

[Claude Sonnet 5](https://platform.claude.com/docs/en/about-claude/pricing) has introductory pricing of $2 per million input tokens and $10 per million output tokens through August 31, 2026. Its standard $3 and $15 rates begin September 1.

Customers are not powerless under this model. OpenAI, for example, documents that `max_output_tokens` and `max_completion_tokens` limit visible and non-visible output.

## Where token-based AI inference pricing breaks down

The central weakness of token pricing is not that tokens are imaginary or impossible to measure. The weakness is that they are model-dependent. A million tokens does not represent a fixed amount of language, work, latency, or business value.

### A tokenizer change can alter cost without changing the task

Each model family chooses a tokenizer and vocabulary. Moving to a different model can change the token count for the same prompt, even when the application behavior stays constant.

Anthropic provides a current example. Its documentation says the newer tokenizer used by Claude Sonnet 5 produces approximately [30% more tokens for the same text](https://platform.claude.com/docs/en/about-claude/pricing) than its previous tokenizer.

Long-context tiers, cache-write rates, cache-read discounts, batch pricing, priority processing, and data-residency uplifts add more variables. A rate-card comparison rarely reduces to one input price and one output price.

### Output is bounded, but not fully predictable

Developers can set output limits and instruct a model to be concise. Actual consumption still depends on the task, model behavior, reasoning effort, tool calls, and response structure.

This matters because output tokens often cost five or six times more than input tokens. Reasoning models may also generate billable tokens that never appear in the visible response. [OpenAI’s token-counting documentation](https://developers.openai.com/api/docs/guides/token-counting) notes that reported output can include reasoning, formatting, delimiter, and tool-call tokens.

### Tokenization can create a language premium

The same meaning can produce different token counts across languages. A peer-reviewed study found differences of up to 15× depending on the tokenizer. Even with improved multilingual tokenizers, billing by token count can introduce inconsistent costs across global applications.

### Agentic workflows amplify every source of variation

A conventional chat request may produce one model call. An agent can plan, retrieve context, call tools, evaluate a result, and retry. Each step adds input, output, or both. Two user requests that look identical at the product layer may generate very different token bills.

This is the environment that produced “tokenmaxxing”: teams treating token consumption as a proxy for AI adoption or productivity.

## What Cloudflare Neurons changed, and what they did not

Cloudflare Workers AI introduced Neurons as one unit for text, image, and audio inference. The current service price is [$0.011 per 1,000 Neurons](https://developers.cloudflare.com/workers-ai/platform/pricing/), with 10,000 Neurons included each day.

The idea was understandable: translate several AI modalities into one billing currency. In practice, customers still needed a model-specific conversion table. Cloudflare’s current documentation lists, for example, 2,457 Neurons per million input tokens and 18,252 per million output tokens for Llama 3.2 1B Instruct. Llama 3.1 70B FP8 uses 26,668 and 204,805 Neurons for the same categories.

Cloudflare acknowledged the usability problem in 2024. The company said customers found Neurons [difficult to understand and compare](https://blog.cloudflare.com/workers-ai-bigger-better-faster/) and announced a move toward unit-based pricing. In 2025, it clarified that usage would appear in familiar units such as tokens, audio seconds, image size, and steps, [while backend billing would remain in Neurons](https://blog.cloudflare.com/workers-ai-improvements/).

Displaying tokens improves comparison, but it does not eliminate the proprietary conversion layer. A universal label is not a universal commercial unit when every model requires a different conversion rate.

## The practical value of compute-based pricing

A GB-hour meter ties charges to two observable resource dimensions: memory and execution time. Adding a per-request charge accounts for the workload volume and platform overhead around each execution.

Serverless platforms popularized this model by billing for requests and the resources consumed during execution. It gives engineering and finance teams a shared operational vocabulary based on request volume, execution time, and memory usage.

The incentive also shifts. Under compute-based pricing, faster execution and smaller resource footprints reduce the customer’s bill. Quantization, model compression, and serving improvements can translate into measurable savings instead of remaining hidden behind a per-token rate.

## Token pricing vs. compute-based pricing

Neither meter removes every variable. The more useful question is whether a pricing model reflects metrics engineering and finance teams already monitor.

| Decision criterion | Token-based pricing | Requests plus GB-hours |
|---|---|---|
| Primary units | Input, cached input, and output tokens | Request volume, memory, and duration |
| Model comparison | Requires tokenizer and rate-card normalization | Uses one rate structure; larger models may consume more time or memory |
| Pre-deployment estimate | Strong when prompt and response shapes are stable | Strong after benchmarking memory and execution time |
| Multilingual consistency | Can vary with tokenizer efficiency | Language affects runtime only when it changes execution behavior |
| Agentic workflows | Each loop, tool call, and retry adds token categories | Additional work appears as more requests and compute time |
| Cost controls | Token caps, caching, routing, and batch discounts | Timeouts, memory sizing, concurrency, model choice, and request limits |
| Best fit | Managed APIs with stable request shapes | Teams that want infrastructure-style forecasting and model portability |

Token pricing can still be a reasonable choice for managed APIs with predictable request patterns. It gives developers direct visibility into model input and output, requires no resource sizing, and can become even more economical through provider-managed caching and batch discounts.

Compute-based pricing, by contrast, supports model comparisons under a single commercial framework and better suits teams running open models or optimizing complete AI applications. The trade-off is that costs depend on measured execution time and memory, so larger or slower models may consume more GB-hours even when the unit rate stays the same.

## How Azion approaches AI inference pricing

[Azion AI Inference](https://www.azion.com/en/documentation/products/ai/ai-inference/) runs a catalog of open models on Azion Runtime. The catalog covers language generation, vision-language models, embeddings, rerankers, and OCR. AI Inference uses two billing meters across the catalog:

| Meter | Price |
|---|---|
| Requests | $0.60 per million |
| Compute Time | $0.22 per GB-hour |

[LoRA Fine-Tune](https://www.azion.com/en/documentation/products/pricing/) follows the same structure at $0.36 per million requests and $0.14 per GB-hour.

There is no token exchange rate or per-model price matrix. The rate structure stays the same when a team changes models. Total cost can still change because a larger model may use more memory or run longer. That difference appears in GB-hours, where teams can measure it against latency and quality.

Consider a simplified workload that averages one second of execution with 1 GB of memory:

1. One million requests consume 1,000,000 GB-seconds.
2. Divide by 3,600 to get 277.78 GB-hours.
3. At $0.22 per GB-hour, compute costs about $61.11.
4. Add $0.60 for one million requests.
5. Estimated inference cost: **$61.71**.

This example excludes data transfer, storage, and other products used by the application. It also assumes that the measured one-second duration and 1 GB footprint hold at production scale. Those are benchmarkable assumptions, which makes the estimate useful before a full rollout.

The same structure extends into the application architecture. AI Inference integrates with Functions, Applications, and SQL Database vector search. Teams can build RAG pipelines and agents on one platform while retaining documented meters for each service.

## Practical examples for forecasting compute-based AI inference costs

A useful forecast starts with production-like benchmarks, not a model’s parameter count. Test representative prompts, context sizes, output limits, and concurrency. Then capture three inputs:

- Monthly request volume.
- Average and percentile execution duration.
- Memory consumed or allocated per execution.

The base calculation is:

`monthly cost = request fees + (requests × average duration in hours × memory in GB × GB-hour rate)`

Agentic and RAG workloads often have a long tail. Model p50, p95, and worst-case execution time, then add scenarios for traffic growth, retries, and larger retrieval contexts.

Compare cost per successful task alongside accuracy, latency, and completion rate. A smaller model that retries twice may cost more than a larger model that completes the task once. The meter should support that analysis instead of replacing it.

## Choose an AI inference pricing model your teams can audit

Karp’s criticism connected because many companies adopted AI faster than they built the governance needed to manage its costs. Token-based pricing is not inherently opaque, but its biggest limitation is portability. Every model brings its own tokenizer, pricing, context rules, and output behavior.

For teams running open models and optimizing AI applications, requests and GB-hours provide a clearer operational contract by tying costs directly to workload volume, memory, and execution time.

Azion prices AI Inference at $0.60 per million requests and $0.22 per GB-hour, across its model catalog and without token conversion tables. Review the [AI Inference documentation](https://www.azion.com/en/documentation/products/ai/ai-inference/), explore the [available models](https://www.azion.com/en/documentation/products/ai/ai-inference/models/), or [create a free account](https://console.azion.com/signup) to benchmark your own workload.
