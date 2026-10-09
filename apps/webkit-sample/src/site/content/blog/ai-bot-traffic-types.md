An AI crawler can visit your site tens of thousands of times and send back a single visitor. WIRED documented how a single crawler swept across Condé Nast properties thousands of times without generating proportional return traffic — massive crawl, minimal referral. For a site that runs on pageviews and ad revenue, that is silent bleeding: infrastructure consumed, content extracted, no conversions generated.

The contract that held the web together for thirty years was simple: you let them crawl, they sent traffic back. That contract is gone. What replaced it has no consolidated rules yet, and most engineering and security teams still treat AI bots as if they were all the same. They are not.

---

## The three types of AI bots you need to know

The distinction between AI bots is a distinction of intent. Different intents require different responses.

### Search bots: indexing to answer later

Search bots collect and index content to answer questions later. They do not act in real time: they build a database of your site that will be queried when a user asks a question in an assistant or search engine.

The mechanism is the same as traditional crawlers, but the destination of the content has changed. Instead of appearing as a link on a results page, your text appears as a direct answer in a chat — no click, no visit, no ad impression.

Search bots can still generate traffic back to your site. They are the most ambiguous type: blocking them indiscriminately can cost you visibility. The right call is to monitor, not block by default.

### Agent bots: real-time action on behalf of a human

Agent bots act in the moment, on behalf of a human user waiting on the other end. An agent might be reading a product page to compare prices, filling out a form, or pulling information to answer a question right now. There is a person somewhere waiting for the result of that automation.

Agents consume resources like a real user (bandwidth, processing, database connections), but they do not generate revenue. They do not click on ads. They do not buy. In APIs and authentication endpoints, the risk is more direct: sophisticated agents can saturate rate limits, test credentials at scale, and generate infrastructure costs with no return.

### Training bots: permanent capture to train models

Training bots capture content to train or fine-tune language models. The extracted data is not queried later: it is permanently incorporated into the architecture of the model. It shapes how the model answers questions, without attribution and without compensation.

Without an explicit commercial agreement, there is no justification for allowing access. For e-commerce sites the risk is concrete: product catalogs, descriptions, and customer reviews can become free training datasets for competitors.

## Differences between Search bots, Agent bots, and Training bots

| Type | What it does | Is a human user waiting? | Can it generate traffic back? | Main risk |
|---|---|---|---|---|
| Search | Indexes to answer later | No | Yes (sometimes) | Answer without click, without visit |
| Agent | Acts in real time | Yes | No | Infrastructure consumption without revenue |
| Training | Captures to train model | No | No | Intellectual property extraction without compensation |

## When a single AI bot has multiple purposes

Some bots do more than one thing at the same time. A crawler can index content for search and use that same content for training. A broad “block Training” rule can inadvertently block legitimate indexing, depending on how the bot is configured and how your protection identifies it.

“Block AI bots: yes or no” is not a policy. A real policy needs to consider three layers:

- What the bot declares it does (via User-Agent and the operator’s public documentation)
- What the bot actually does (behavior patterns, access frequency, endpoints visited, volume over time)
- Your position for each purpose, because Search, Agent, and Training can and should have different responses

The difficulty is not blocking clearly malicious bots. The problem is making precise decisions about bots with mixed behavior, legitimate User-Agents, and operators that combine purposes without transparency.

## Why User-Agent is not enough

Protection based on a list of known User-Agents only works against bots that identify themselves honestly.

Sophisticated bots spoof User-Agent. A training bot can present itself as a regular browser. An agent can simulate organic traffic. The list needs continuous updates, and evasive bots simply do not appear on it until someone identifies and documents them.

Automated traffic does not reveal itself through the string declared in the request header. It reveals itself through behavior across an entire session. Humans make mistakes, go back, hesitate, open tabs. Bots follow optimized paths without deviation. Between a page load and the next action, humans have natural variation; automation has precision no real user would reproduce. Page scrolling, focus on form fields, and variation in reading speed are all signals that are difficult to simulate at scale. Training bots tend to sweep URLs in logical sequence — sitemap, categories, products in order — a pattern no organic user would generate.

Each signal in isolation can seem plausible. Evaluated together, across an entire session, they form a pattern that is expensive to fake consistently.

That is why modern protection platforms, like Azion’s [Bot Manager](https://www.azion.com/en/products/bot-manager/), work with a risk score per request: combining device fingerprint, browser signature, behavioral patterns, and network reputation. The score updates with each new action in the session, not just on the first request.

## How to control Search bots, Agent bots, and Training bots

The structure below is not a tool tutorial. It is a decision framework you can apply regardless of which solution you are using.

```
Is the bot declaring its identity?

│

├── No → Treat as suspicious.

│ Block or apply a verification challenge.

│

└── Yes → What is the declared purpose?

│

├── Training

│ ├── No commercial agreement → Block

│ └── With agreement → Allow + monitor volume and pattern

│

├── Agent

│ ├── Public API → Granular rate limiting per endpoint

│ ├── Content site → Check whether your terms of use

│ │ allow automated access

│ └── E-commerce → Protect product pages,

│ catalog, and checkout

│

└── Search → Monitor crawl-to-referral ratio

├── Reasonable ratio → Allow

└── Abusive ratio (e.g., >1,000:1) → Throttle or negotiate compensation
```

Blocking everything is simple but costly: you can lose legitimate indexing and visibility in AI assistants that generate referral. Allowing everything is risky: you subsidize training of competing models and consume infrastructure without revenue.

A good protection solution goes beyond blocking. It offers granular actions: rate limiting, redirect, custom responses, random delay to raise the bot’s operational cost without revealing it was detected, connection hold. Each action has a context where it fits better than a direct block.

## How to monitor AI bot traffic

Few teams look at this closely enough, and having a policy without measuring it is the same as not having one.

The metrics for AI bot management are not the same ones you track for human traffic. The most telling number is the crawl-to-referral ratio per operator: for each company whose bots visit your site, how many visits do you get back per crawl? A ratio of 2:1 is the historical benchmark for traditional search engines. Ratios in the hundreds or thousands indicate extraction without return.

Track the distribution of risk scores over time, too. What percentage of requests is classified as high suspicion? Does that number spike at certain hours or in certain regions? Search bots typically hit sitemaps and content pages. Training bots sweep more broadly. Agent bots concentrate access on specific endpoints. A bot behaving outside those patterns is worth investigating.

Azion Web Platform provides real-time visibility into this traffic profile through [Real-Time Metrics](https://www.azion.com/en/products/real-time-metrics/) and [Data Stream](https://www.azion.com/en/products/data-stream/): bot distribution by type, top attack origins, risk scores, and SIEM export.

## Does robots.txt still work?

Yes, as a preference signal. Not as active control. robots.txt tells the bot what the site owner wants. Well-behaved bots respect it. Evasive or malicious bots ignore it entirely. The instruction in the file executes nothing — it depends on the good faith of whoever reads it.

Some operators and standards groups are discussing extensions to robots.txt that would signal intended content use. The idea is for the file to declare not just “can or cannot crawl,” but what the operator is authorized to do: index for search, summarize and reproduce, or only interact without storing. Still under discussion.

robots.txt is necessary and insufficient. It is the equivalent of putting up a “private property” sign on unfenced land. Real control happens at the infrastructure layer, with the ability to evaluate actual behavior, not just declarations of intent.

## How to build an AI bot policy

The industry has not settled the rules here yet. The Search/Agent/Training taxonomy is a start, but bots keep changing: combining purposes, spoofing identity, becoming harder to classify by declaration alone.

Sites without an active policy are making a decision by default. The consequences show up in the revenue report before they show up in the access logs.

[Talk to the Azion team](https://www.azion.com/en/contact/) to understand how AI bot traffic is affecting your site.

---

## Frequently asked questions

**What is the difference between an AI Search bot, an AI Agent bot, and an AI Training bot?** Search bots index content to answer questions later, building a database of your site. Agent bots act in real time on behalf of a human user, navigating and extracting information in that moment. Training bots capture content to train or fine-tune language models, and the extracted data is permanently incorporated into the model.

**Should I block all AI bots on my site?** Not necessarily. Blocking Search bots indiscriminately can reduce your visibility in search engines and AI assistants that generate referral traffic. The right approach is different policies for each type: monitor Search with attention to the crawl-to-referral ratio, control Agents with per-endpoint rate limiting, and block Training unless there is an explicit commercial agreement.

**If I block Training bots, will I affect my Google indexing?** Potentially yes, depending on how the rules are configured. Some crawlers combine Search and Training in the same bot, and a broad blocking rule can impact indexing. Effective control requires granular identification by behavior, not a single rule applied to an entire category.

**What is the crawl-to-referral ratio and why does it matter?** It is the ratio between how many times a bot crawled your site and how many real visitors it sent back. Traditional search crawlers had ratios close to 2:1. WIRED documented cases of AI crawlers sweeping Condé Nast properties thousands of times without generating proportional return traffic. For sites that depend on traffic and ads, that number determines whether a bot operator is contributing or just consuming.

**Is robots.txt enough to block AI bots?** No. robots.txt signals a preference: well-behaved bots respect it, evasive bots ignore it. Effective control requires active rules at the infrastructure layer, with the ability to detect suspicious behavior beyond what the bot declares in the request header.

**How do I identify AI bots that spoof User-Agent?** By session behavior patterns. Evasive bots reveal themselves through linear navigation without deviation, millisecond-precise timing between actions, absence of human interaction signals like scroll variation and field focus, and systematic URL access patterns no real user would generate. A protection platform that works with risk scores per request — combining device fingerprint, network reputation, and behavioral analysis — detects those patterns even when the User-Agent looks legitimate.
