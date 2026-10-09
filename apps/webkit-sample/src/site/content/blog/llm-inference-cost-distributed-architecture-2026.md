Every team optimizing AI inference costs eventually runs into the same wall: the model gets cheaper, but the bill stays the same.

In the past six months, Hacker News has been full of projects doing extraordinary things on minimal hardware: AirLLM running 70B-parameter models on a single 4GB GPU, Kimi K3 serving tokens at $0.50/tok from 29GB of RAM, DeepSeek V4 Flash redefining price-performance benchmarks for production workloads. The common thread is engineers figuring out that the biggest cost driver in inference isn’t compute.

It’s distance.

> **TL;DR:** Centralized inference adds 100–180ms of network round-trip latency per request and forces over-provisioning to maintain p95. A distributed preprocessing layer — running auth, semantic caching, and response streaming close to users — cuts inference origin load by 40–60% and global p50 latency by 75%. This doesn’t require changing your inference provider. It requires inserting the right layer in front of what you already have.

---

## Why centralized LLM inference is structurally expensive

The standard deployment looks like this: model runs in one region (us-east-1, or wherever your GPU cluster lives), requests come in from everywhere, responses go back. Simple to set up, familiar to operate, and increasingly hard to justify at scale.

Cost per token keeps dropping. Everything around it doesn’t.

**Network latency compounds.** A user in Jakarta making requests to an inference endpoint in Virginia adds 100–180ms of round-trip overhead before a single token generates. For streaming responses, that’s a dead pause before anything appears on screen. For agent loops making dozens of sequential calls, it stacks into seconds.

**Regional failures have global blast radius.** When your inference endpoint sits in one region and that region has a degraded network path (or a power event like the nuclear plant shutdown Hungary experienced this summer when drought dropped the Danube to record lows), every user globally is affected.

**Over-provisioning is the hidden line item.** To handle traffic spikes without cold starts killing p95, teams keep warm capacity running at all times. With centralized infrastructure, you pay for that idle capacity whether it’s serving requests or not. At volume across multiple geographies, this cost exceeds the inference spend itself.

---

## The three-layer split: where distributed inference actually helps

Modern inference workloads have three distinct layers with different compute profiles:

1. **Request handling and preprocessing:** auth, rate limiting, prompt assembly, context injection
2. **Token generation:** the compute-heavy step that needs GPU or accelerated hardware
3. **Response streaming and post-processing:** formatting, filtering, caching, logging

The mistake most teams make is treating all three as one unit and deploying them together in a centralized region. That’s why you pay latency costs for operations that have nothing to do with token generation.

**The distributed preprocessing principle:** Layers 1 and 3 (request handling and response processing) can run on a distributed architecture with no cold starts, under 10ms from users, for a fraction of the cost of keeping that logic in a centralized service. Only layer 2, actual model compute, needs to stay where the hardware is.

Split the stack at that boundary and you get:

- Sub-10ms preprocessing for auth, context injection, and prompt assembly before the request reaches the model
- Response streaming from the closest point of presence, delivering tokens without an extra round-trip to origin
- Distributed semantic caching: common completion patterns handled at the network layer, no model call required
- Regional failover without re-architecting: route around degraded inference regions transparently

---

## A concrete implementation

Here’s what this looks like in practice using Azion Functions with an upstream inference provider or self-hosted model:

```javascript
// Function: auth, rate limiting, cache lookup, proxy to inference origin

export default async function handler(request) {
  const authResult = await validateRequest(request);
  if (!authResult.ok) return new Response("Unauthorized", { status: 401 });

  const cacheKey = await buildSemanticCacheKey(request);
  const cached = await azion.cache.get(cacheKey);
  if (cached) return streamFromCache(cached);

  // Only reaches inference origin on cache miss
  const inferenceResponse = await fetch(INFERENCE_ORIGIN, {
    method: "POST",
    body: await request.arrayBuffer(),
    headers: buildInferenceHeaders(authResult.token),
  });

  // Stream tokens to user while writing to cache
  return streamWithCacheWrite(inferenceResponse, cacheKey);
}
```

This function runs across 300+ global points of presence with no cold starts. Auth, rate limiting, and cache lookups happen at the same location as the user. The inference origin only sees requests that need token generation. Everything else is handled before it arrives.

The throughput impact is real. Teams running this pattern report 40–60% reductions in requests that reach the inference origin, because semantic caching absorbs repeated or near-identical queries. For most production AI features (customer support, search, content generation), query distributions cluster around common intents far more than they appear to.

---

## The numbers that matter

A production AI feature serving 10 million requests per month from a global user base:

| Architecture | Global p50 latency | Inference origin load | Monthly infra cost (est.) |
|---|---|---|---|
| Centralized (single region) | ~340ms | 100% of requests | $12,000–18,000 |
| Distributed preprocessing + central inference | ~85ms | 40–60% of requests | $5,000–8,000 |
| Distributed preprocessing + regional inference | ~28ms | 40–60% of requests | $7,000–11,000 |

The distributed preprocessing model, achievable today without changing your inference provider, cuts global p50 latency 75% and inference origin load up to 60%. That’s a different class of user experience.

Cost savings come from two places: fewer requests hitting paid inference endpoints (cache hits are cheap), and right-sized origin infrastructure because you’re no longer over-provisioning to compensate for latency.

---

## Why agent workloads make this urgent

Single-shot inference (user asks, model answers) is the easy case. Agents are harder, and the distance problem stacks.

An agent making 15 sequential tool calls, each with 150ms of network overhead to a centralized endpoint, accumulates 2.25 seconds of pure network latency per agent loop. Before any model compute. For agents running multiple loops, you’re at 10–20 seconds of overhead from network alone.

Distributed preprocessing solves the outer loop: orchestration logic, tool call routing, context management, and inter-step caching can all run close to the user. Model calls still go to where the hardware is, but the agent loop overhead drops sharply.

Teams building production agents focused on responsiveness are already splitting their stacks this way. The ones who aren’t are hitting a ceiling where user experience degrades faster than model improvements compensate.

---

## Why cheaper models widen the architecture gap

As models get smaller and more efficient (Qwen3.8B, DeepSeek Flash, Kimi K3), the case for distributed architecture gets more urgent, not less.

Smaller models drop cost per token. Which means network overhead and preprocessing cost become a larger share of your total cost structure. A $0.001/1K token model running behind 180ms of avoidable network latency has a worse effective cost profile than a $0.003/1K token model running with 20ms overhead, because latency shows up as user churn and over-provisioning rather than as a line item on your inference bill.

Model efficiency improvements don’t fix architectural inefficiency. The two curves are independent, and ignoring the infrastructure curve while celebrating the model curve is how teams end up with fast models delivering slow products.

---

## Getting started without replacing your inference setup

The migration doesn’t require touching your inference provider. It requires inserting a distributed layer in front of it.

Three changes to start:

**1. Move auth and rate limiting to the distributed layer.** Every inference request hitting your origin for auth pays unnecessary latency. [Azion Functions](https://www.azion.com/en/products/functions/) handle this in under 1ms, globally, with no cold starts.

**2. Add semantic caching at the network layer.** You don’t need a sophisticated similarity model. Normalizing and hashing prompts captures 20–40% cache hit rates in most production workloads.

**3. Route by geography.** If you have inference capacity in multiple regions, routing requests to the closest region rather than round-robining to a single origin is a one-line change with measurable latency impact.

None of these require changing your model, your inference provider, or your application code. They require putting the right layer in front of what you already have.

---

The [AI inference](https://www.azion.com/en/products/ai-inference/) cost conversation is mostly focused on the model layer: smaller models, quantization, efficient kernels. That work matters. But the engineers shipping production AI features at scale keep running into the same discovery: the model layer is only half the problem.

The other half is everything between the model and the user. That half is already solved, if you build the architecture to take advantage of it.

---

*Azion Web Platform runs distributed, cold-start-free execution across 300+ global points of presence. Azion Functions handle request preprocessing, caching, and response streaming without touching your inference infrastructure.* [See the docs →](https://www.azion.com/en/documentation/)

---

## Frequently asked questions

**Why is LLM inference still expensive even with cheaper models?** Cheaper models reduce cost per token, but network round-trip latency and over-provisioning stay constant regardless of model price. A user in São Paulo calling an inference endpoint in Virginia adds 100–180ms before a single token generates. To compensate, teams over-provision warm capacity, paying for idle compute around the clock. These infrastructure costs don’t appear on your inference bill but can exceed it at scale.

**What is distributed AI inference?** Distributed AI inference separates request handling and response streaming from token generation. Auth, rate limiting, prompt assembly, and semantic caching run at global points of presence close to users, adding under 10ms of overhead. Only requests that miss the cache reach the inference origin for token generation. This cuts origin load by 40–60% and global p50 latency by up to 75% without changing the underlying model or inference provider.

**How much does semantic caching reduce LLM inference costs?** Semantic caching at the network layer captures 20–40% cache hit rates in most production AI workloads. Customer support, search, and content generation applications see higher rates because query distributions cluster around common intents. Each cache hit eliminates one inference call entirely, cutting paid token generation proportionally.

**Why does inference latency compound inside AI agent pipelines?** AI agents chain multiple function calls per task. A four-step tool call chain where each function adds 150ms of network round-trip overhead accumulates 600ms of pure network latency per agent loop, before any model compute runs. For agents running multiple loops, this becomes seconds. Distributed request handling eliminates most of this overhead by running orchestration logic close to the user.

**What is the infrastructure cost difference between centralized and distributed inference?** For a production AI feature serving 10 million requests per month from a global user base, centralized inference in a single region costs an estimated $12,000–18,000/month including over-provisioning for p95. Adding a distributed preprocessing layer drops that to $5,000–8,000/month while cutting p50 global latency from ~340ms to ~85ms.

**Does distributed inference require changing my inference provider?** No. The distributed layer sits in front of your existing inference endpoint. Auth, rate limiting, semantic caching, and response streaming run at global points of presence. The inference origin stays unchanged. It just receives fewer requests because the cache absorbs repeat queries before they reach it.

**How does smaller model size affect the case for distributed inference?** As cost per token drops with smaller models, network overhead and over-provisioning become a larger share of total inference cost. A $0.001/1K token model running behind 180ms of avoidable network latency has a worse effective cost profile than a $0.003/1K token model with 20ms of overhead, because latency shows up as user churn and over-provisioning rather than as a line item on the inference bill. Model efficiency gains accelerate the case for fixing infrastructure inefficiency.
