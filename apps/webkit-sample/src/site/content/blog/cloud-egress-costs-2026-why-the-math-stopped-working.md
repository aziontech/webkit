In 2020, moving to the cloud saved you money. In 2026, the math is different.

Cloud adoption peaked around 2021. Every CTO interview, every re:Invent keynote had the same pitch: migrate, modernize, save money. And for that window, it was true. Companies moving off aging on-prem hardware cut costs, sometimes dramatically.

But pricing didn’t stay flat. AWS S3 egress fees went up. GCP cut sustained-use discounts. Azure’s bandwidth pricing changed quietly. None of it made headlines. It just showed up in your bill every month, compounding.

We analyzed pricing data from AWS, GCP, and Azure, tested against three real architecture patterns: a SaaS platform, a team that had done everything FinOps right, and a global API. The same problem showed up in all three, just wearing different clothes.

> **The short version:** Cloud egress per-GB prices have barely moved since 2020, but application data volumes have grown 3–7x. A mid-market SaaS company moving 50 TB/month out of AWS pays $54,000/year in bandwidth alone. Routing stateless workloads through a distributed network instead cuts that bill 60–80% without touching the database or rebuilding the architecture.

---

## Why AWS egress costs have compounded since 2020

AWS charged $0.09/GB out of us-east-1 in 2020. In 2026, that number is still $0.09. That’s where “nothing changed” ends.

Data volumes grew. User bases went global. Apps got more real-time: more API calls, more WebSocket connections, more media delivery. **The egress multiplier on a modern app is 3 to 7 times what teams put in their 2020 migration plans.** The unit price stayed flat while the volume multiplied underneath it.

A SaaS company moving 50 terabytes out of AWS per month pays roughly $4,500 a month in egress. **That’s $54,000 a year. For bandwidth. Just bandwidth.** Run that same traffic through a distributed network with global points of presence and the bill drops 60 to 80 percent. Same 50 TB. Same users. Different path.

---

## Which cloud architectures are most exposed to egress fees

The SaaS case is the most common. App server in one region, database in the same region, CDN bolted on top. Multi-region was an afterthought, if it happened at all. It was the sensible architecture for 2020.

The latency problem is structural. A user in Buenos Aires hitting an API in us-east-1 has 120 to 180ms round-trip just from geography, before any application logic runs. For autocomplete, live dashboards, or collaborative editing, that’s a broken product. Moving the whole app doesn’t fix it; moving the stateless layer does. **The API cache, auth layer, and static asset delivery can respond in 30ms. The database stays put.**

The FinOps case is more frustrating because the team did everything right. Right-sizing, cutting idle resources, reserved instances: done consistently, that work pulls 15 to 25 percent off a raw cloud bill. But it has a ceiling, and most teams hit it inside 18 months. FinOps tools can show you where egress comes from. **They cannot change the unit price; the provider sets that.** A FinOps team staring at a $25,000 egress line can tag it, track it, and escalate it. At the end of that process, they’ll tell you the only real fix is an engineering decision. You can’t optimize your way out of an architecture that routes every byte through a cloud origin.

The global API case surprises teams the most. Internal APIs, microservices talking to each other, data pipelines, third-party integrations: all of it generates egress. Every response that leaves the region is billable bandwidth. **Teams on microservices underestimate cross-region traffic costs by about 40 percent in their first projections.** Over three years, that gap becomes a number the CFO asks about.

---

## Three reasons the bill doesn’t get fixed

Most engineering leaders I talk to already know something is off. They’ve seen the CloudWatch dashboards and had the finance conversation. The problem isn’t information.

**Sunk cost bias.** If you led the cloud migration, admitting the economics have shifted feels like admitting you were wrong. So teams wait. That wait costs real money every month.

**Complexity illusion.** Touching the architecture sounds like a 12-month project with a high chance of something breaking in production. That’s usually not true, but the vendors who benefit from your current setup have no reason to correct that assumption.

**Benchmark blindness.** Most teams compare their cloud bill to what they paid on-prem five years ago. That baseline is obsolete. The alternatives are not what they were in 2020.

None of these are technical problems.

---

## How to audit your cloud egress spend in under four hours

The audit takes two to four hours with dashboards you already have open.

**What percentage of your monthly bill is egress?** Above 15 percent and you have an immediate target. Above 25 percent and you’re losing money you don’t have to lose.

**What’s your average API latency for users outside your primary region?** If you don’t know the number off the top of your head, that’s already an answer. Pull it from New Relic, Datadog, or whatever observability tool you’re running.

**Which workloads are stateless versus stateful?** Stateless workloads (API responses, authentication, asset delivery, serverless functions) are candidates to move. Stateful workloads (databases, job queues, persistent storage) stay. That’s the decision boundary.

**What’s your egress cost per active user per month?** Your cloud provider won’t surface this number in the console. Divide total egress cost by monthly active users. If that number is growing faster than revenue per user, the architecture is working against the business.

---

## Stateless vs. stateful: where cloud egress cost reduction actually happens

| Workload type | Examples | Where it runs | Egress impact |
|---|---|---|---|
| Stateless | API responses, auth, asset delivery, edge functions | Distributed edge network | Low — traffic stops hitting the cloud origin per request |
| Stateful | Databases, job queues, persistent storage | Cloud (unchanged) | Contained — no architectural change needed |

**The principle is simple: stateless workloads belong at the edge, stateful workloads belong in the cloud.** Most teams are running both layers in the cloud by default, which is why the egress bill keeps growing.

Azion’s distributed network runs [Functions](https://www.azion.com/en/products/functions/), [WAF](https://www.azion.com/en/products/web-application-firewall/), and application security controls across 100+ locations globally. A user in Buenos Aires hits 15ms instead of 180ms. Egress drops because traffic stops routing through your cloud origin for every request. The database doesn’t move. The team doesn’t rebuild the architecture from scratch.

Teams running this split are seeing **60 to 80 percent egress cost reductions** and **40 to 60 percent latency improvements** outside their primary region. The change isn’t a rip-and-replace. It’s moving the 20 percent of workloads that drive 80 percent of the egress bill.

---

In 2020, the default answer was: put it in the cloud. In 2026, that default is completely outdated.

Cloud is still the right call for stateful workloads. For everything stateless, egress-heavy, and globally distributed, the math stopped working a while ago. Most teams just haven’t looked at it lately.

Start with egress as a percentage of your total bill. Pull your latency data for users outside your primary region. Draw the stateless/stateful line across your architecture. Those three numbers will tell you whether you have a structural problem or a right-sizing problem — and only one of them is fixable with a FinOps tool.

[Talk to an Azion specialist](https://www.azion.com/en/contact/) to see how moving stateless workloads to a distributed network affects your egress bill.

---

## Frequently asked questions

**What is cloud egress cost?** Cloud egress cost is the fee cloud providers charge for data transferred out of their network. AWS charges $0.09 per GB out of us-east-1. For a company moving 50 TB per month, that is $4,500 per month or $54,000 per year in bandwidth fees alone — before any compute or storage costs.

**Why are cloud egress fees so high in 2026?** The per-GB price has not changed significantly since 2020, but application data volumes have grown 3 to 7 times what teams modeled in their original migration plans. Real-time features, global user bases, and microservices architectures all multiply egress far beyond initial projections.

**What is the difference between stateless and stateful cloud workloads?** Stateless workloads — API responses, authentication, asset delivery, and serverless functions — do not depend on stored session state and can run anywhere. Stateful workloads — databases, job queues, and persistent storage — need to stay in a consistent location. This distinction determines which workloads can move to a distributed edge network to reduce egress costs without disrupting the rest of the architecture.

**Can FinOps reduce cloud egress costs?** FinOps can identify and track egress spend, but it cannot change the per-GB price set by the provider. Right-sizing and reserved instances typically reduce cloud bills by 15 to 25 percent, but egress reduction requires an architectural change: moving stateless, egress-heavy workloads to a distributed network closer to users.

**How do I calculate egress cost per active user?** Divide your total monthly egress cost by your monthly active users. If that number is growing faster than revenue per user, your infrastructure costs are scaling faster than your business. That is a structural problem, not a right-sizing problem, and it cannot be fixed with a FinOps tool alone.

**What does a stateless/stateful architecture split look like in practice?** API caches, authentication layers, static asset delivery, and edge functions move to a distributed network with global points of presence. Databases, job queues, and persistent storage stay in the cloud unchanged. The result is that user requests are served closer to where users actually are, egress from the cloud origin drops significantly, and the core application infrastructure does not need to be rebuilt.
