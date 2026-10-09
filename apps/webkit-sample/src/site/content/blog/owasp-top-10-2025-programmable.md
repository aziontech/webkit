The traditional security perimeter has dissolved. Not only because attackers got “smarter”, but because software changed shape. Modern applications are not just written; they are assembled from APIs, third-party services, dependencies, and event-driven components. The OWASP Top 10:2025 reinforces what architects already feel in production: the biggest risks are not typos and missing escapes — they are systemic failures arising from design choices, supply chains, and operational complexity.

That is why security can no longer live only at the origin. To meet the reality of 2026, teams need a programmable layer capable of enforcing policies, validating intent, and absorbing uncertainty before it becomes an incident.

Azion was built for this shift: a web platform that enables companies to build, protect, and scale modern applications on a fully managed global infrastructure — combining distributed compute, serverless capabilities, and real-time observability ([Real-Time Metrics](https://www.azion.com/en/products/real-time-metrics/) & [Events](https://www.azion.com/en/products/real-time-events/)) as a unified approach, not as disconnected tools.

> The OWASP Top 10:2025 consolidates the ten most critical risk categories for modern web applications. Compared to the 2021 edition, the new version expands its focus to architectural risks, supply chain, insecure design, and mishandling of exceptional conditions — reflecting the growing complexity of distributed applications. [WAFs](https://www.azion.com/en/products/web-application-firewall/) based on static rules do not cover this surface. A distributed security architecture is what consistently mitigates modern threats.

---

## What are the main changes in the OWASP Top 10:2025?

The 2025 edition is not an incremental update. It is a conceptual revision: the OWASP Top 10:2025 recognizes that the greatest risks to modern applications are not typos or missing escapes — they are systemic failures arising from design choices, supply chains, and operational complexity.

The three most relevant changes compared to OWASP Top 10:2021:

SSRF incorporated into A01 — Server-Side Request Forgery, which in the 2021 version was the isolated A10 category, has been consolidated into Broken Access Control. The consolidation recognizes that SSRF is fundamentally an access control failure: the application makes requests to destinations it should not access.

Supply Chain as an explicit category in A03 — Previously limited to “components with known vulnerabilities”, the 2025 category covers the full software lifecycle: dependencies, build pipelines, and unsigned artifacts.

A10 is a brand-new category — Mishandling of Exceptional Conditions appears for the first time, recognizing that poor error handling is not just a UX problem — it is a resource exhaustion vector actively exploited by attackers.

What this means in practice: security can no longer live only at the origin. Teams need a distributed security architecture capable of enforcing policies, validating intent, and absorbing threats before they become incidents — which includes serverless compute for authorization logic at the perimeter, a [WAF](https://www.azion.com/en/products/web-application-firewall/) with multi-layer heuristic analysis, and real-time observability.

A distributed security architecture enforces policies before requests reach the origin application, using distributed rules, serverless compute, and real-time observability.

## A01: Broken Access Control — enforce policy before requests reach the origin

Broken Access Control, now consolidated to include SSRF, remains the most prevalent vulnerability in real-world systems — especially when authorization logic is spread across multiple services and endpoints. Traditional defenses block obvious structural patterns like directory traversal (../../etc/passwd), but do not detect logical failures: whether *this* user should access *that* object.

A distributed architecture changes the model: it is possible to validate identity context, normalize requests, and enforce deterministic rules for sensitive routes before any traffic reaches the origin.

The [Azion WAF](https://www.azion.com/en/products/web-application-firewall/) uses the *Directory Traversal* and *Unwanted Access* threat families to deterministically block forced browsing and file system violations. For logical risks such as Insecure Direct Object References (IDOR), [Azion Functions](https://www.azion.com/en/products/functions/) provide stateless interception at the perimeter — decoding JWTs and verifying that the sub claim matches the user_id in the request path, without requiring backend changes.

If access control is still “best effort” inside each microservice, it is not access control — it is hope.

## A02: Security Misconfiguration — compensating controls for inevitable config drift

Cloud-native velocity creates config drift. The risk is not carelessness — it is that complexity makes “perfect configuration” unviable at scale. A wrong header, an overly verbose error response, or an accidentally exposed admin path becomes an attack primitive.

The practical answer is the compensating control: enforce security posture at the perimeter so internal services can evolve without repeatedly reintroducing known bad states.

The Azion Firewall acts as a security wrapper over internal infrastructure. With the Rules Engine, mandatory headers such as HSTS and CSP can be injected into all responses — regardless of the state of each origin service. The platform intercepts 4xx and 5xx codes and replaces verbose stack traces (CWE-209) with sanitized, custom HTML, preventing attackers from fingerprinting the underlying tech stack through error responses.

## A03: Supply Chain — virtual patching when fixing fast is not realistic

Supply chain risk is not theoretical. A vulnerable dependency can become a global incident before a change management process even schedules a meeting. In enterprises with hundreds of services, manual remediation of zero-days can take weeks — as demonstrated by Log4Shell (CVE-2021-44228) and the Apache HTTP Server exploit (CVE-2021-41773).

The OWASP Top 10:2025 update to this category makes it clear: the problem is not just having outdated components. It is the inability to respond fast enough when a critical vulnerability is published.

Virtual patching is the answer: enforcing blocking rules at the perimeter while the underlying code is still being fixed. The [Azion WAF](https://www.azion.com/en/products/web-application-firewall/) inspects incoming requests for JNDI strings, OGNL expressions, and other patterns associated with known exploits. Rule updates are applied globally with no maintenance window or deploy required. This turns “Shift Left” into “Shield Right”: protecting in production while the fix happens in the code.

## A04: Cryptographic Failures — TLS is not an origin problem, it is a perimeter problem

Cryptographic failures rarely happen because teams do not know TLS. They happen because legacy origins, inconsistent configurations, and multi-service architectures create an uneven security posture. The enforcement point needs to be centralized.

Azion terminates TLS at the perimeter as a secure reverse proxy, ensuring cryptographic compliance regardless of the state of the origin server. Administrators configure minimum TLS version (1.2 or 1.3) and disable weak ciphers such as RC4 and DES at a single point that covers the entire entry surface.

The Log Scrubbing feature masks PII and card numbers (CWE-532) before logs are sent to external SIEMs — ensuring observability systems do not become a source of cleartext data exposure.

## A05: Injection — payload evasion is the real problem

Injection still works because inputs still reach interpreters. What changed is the shape of payloads: more JSON, multi-layer encoding, distributed parsing. Defenses based only on regex fall apart under evasion or generate operationally expensive false positives.

The [Azion WAF](https://www.azion.com/en/products/web-application-firewall/) uses libinjection (Rule IDs 17 and 18) to tokenize input and understand the logic of injection — recognizing tautologies instead of comparing strings — which significantly reduces false positives. This is complemented by multi-layer heuristic analysis:

- Rule 1000: SQL keyword detection in body, path, and cookies
- Rules 1009 and 1010: identification of special character patterns indicative of injection ((, ), =)
- Rules 13 and 15: strict validation of POST formats and JSON structures to defeat encoding-based evasion techniques

If injection defense is still string matching, the posture is 2012 with 2026 traffic.

## A06: Insecure Design — business logic needs to be defended like infrastructure

Insecure Design is not a bug: it is when the system allows abuse by design — scraping, inventory monopolization, resource draining, valid requests with malicious intent. These gaps are hard to fix in code because the abuse is distributed, adaptive, and often indistinguishable from legitimate traffic without additional context.

The [Azion Bot Manager](https://www.azion.com/en/products/bot-manager/) differentiates legitimate users from automated scripts via intent-based behavioral analysis and device fingerprinting. Combined with context-aware rate limiting — restricting requests based on specific cookies or headers, not just IP — the platform prevents bots from exploiting design gaps without requiring the application to be rewritten.

## A07: Identification and Authentication Failures — IP-based rate limiting does not stop credential stuffing

Credential stuffing works not because attackers are sophisticated — it works because most defenses are simplistic: IP-based limits, fixed thresholds, and isolated logs. Modern attacks distribute attempts across thousands of IPs and calibrate the rate to stay below standard limits.

Azion detects anomalous authentication patterns by analyzing login success and failure rates alongside global threat intelligence — identifying automated injection of leaked credentials even when each individual request appears legitimate. This protects critical endpoints such as /api/login against high-volume abuse that IP-based limits would miss.

Without real-time observability over authentication attempts, attacks are investigated after they have already happened. [Real-Time Events](https://www.azion.com/en/products/real-time-events/) provides a forensic window of the last 168 hours for querying during active incidents.

## A08: Software and Data Integrity Failures — assume the payload wants to execute

Integrity failures appear when systems accept data they should not trust: unsigned artifacts, tampered inputs, or unsafe deserialization patterns that trigger unintended execution paths. Attackers use *gadget chains* in serialized objects to trigger remote code execution without needing credentials.

The [WAF](https://www.azion.com/en/products/web-application-firewall/) identifies malicious signatures in request bodies — Java rO0 signatures and PHP-specific serialization formats. Rule 13 enforces strict validation of POST bodies, ensuring malformed data does not reach the application runtime.

## A09: Security Logging and Monitoring Failures — if you cannot see it, you cannot control it

Logging and monitoring failures are the primary cause of breach invisibility. Without visibility into what is being attempted in production, detection depends on side effects — and the exposure window extends for weeks.

[Azion Data Stream](https://www.azion.com/en/products/data-stream/) transmits detailed WAF and access logs in real time to SIEMs such as Splunk and Datadog, eliminating the latency between event and analysis. [Real-Time Events](https://www.azion.com/en/products/real-time-events/) provides forensic querying of the last 168 hours directly in the platform — allowing security teams to follow attacks as they happen.

## A10: Mishandling of Exceptional Conditions — new category in OWASP 2025

A10:2025 is one of the main OWASP Top 10 updates: mishandling of exceptional conditions. Attackers intentionally send malformed data to trigger unhandled exceptions that hold database connections, consume memory, or stall threads — turning errors into resource exhaustion vectors.

Azion acts as a proactive buffer on two fronts: Rule 31 enforces strict input validation to prevent malformed data from triggering backend exceptions; when exceptions escape, the platform replaces verbose error responses with sanitized HTML before reaching the client. The [WAF](https://www.azion.com/en/products/web-application-firewall/) and DDoS Protection block malformed requests at the perimeter before they affect application availability.

If the system treats exceptions as rare events, attackers will make them the default traffic pattern.

## How to protect applications against the OWASP Top 10:2025

The OWASP Top 10:2025 makes clear that protecting modern applications requires more than fixing code. It requires enforcing security policies consistently, responding quickly to new threats, and maintaining continuous visibility over application behavior.

The Azion Web Platform delivers this as a unified platform: [WAF](https://www.azion.com/en/products/web-application-firewall/) with multi-layer heuristic analysis, [Functions](https://www.azion.com/en/products/functions/) for authorization logic at the perimeter, [Bot Manager](https://www.azion.com/en/products/bot-manager/) for behavioral abuse, and active observability via [Data Stream](https://www.azion.com/en/products/data-stream/) and [Real-Time Events](https://www.azion.com/en/products/real-time-events/) — all in a distributed security architecture aligned to OWASP categories.

Explore the Azion Web Platform and see how to implement a distributed security architecture aligned with OWASP recommendations, or [talk to our team](https://www.azion.com/en/contact/).

**Read also**: [What is the OWASP Top 10 list of web application security threats?](https://www.azion.com/en/learning/websec/what-is-the-owasp-top-10-list-of-web-application-security-threats/)

---

## Frequently asked questions

**What is the difference between OWASP Top 10:2021 and OWASP Top 10:2025?** The 2025 version consolidates SSRF into A01 (previously an isolated A10), expands the supply chain scope to the full software lifecycle in A03, and introduces A10 as a brand-new category for mishandling of exceptional conditions. The central conceptual shift is the focus on architectural and systemic risks, not just coding errors.

**What is virtual patching in the context of the OWASP Top 10:2025?** Virtual patching is the application of blocking rules at the network perimeter while the underlying code fix is still in progress. Instead of waiting for the vulnerable dependency’s patch cycle, the [WAF](https://www.azion.com/en/products/web-application-firewall/) inspects requests for exploit signatures and blocks attempts in real time, globally.

**How does a WAF mitigate supply chain failures (A03)?** By inspecting incoming request content for strings associated with known exploits — such as JNDI strings for Log4Shell or OGNL expressions for other CVEs. When a new vulnerability is published, blocking rules are applied to the [WAF](https://www.azion.com/en/products/web-application-firewall/) without requiring application code changes or service restarts.

**What is config drift and why does it create vulnerabilities?** Config drift is the gradual deviation of infrastructure configurations from a secure baseline state. A single missing header or accidentally exposed admin endpoint can be enough for an attacker to gain initial access.

**What is the new A10 category in OWASP 2025?** Mishandling of Exceptional Conditions — a brand-new category that recognizes how poor error handling leads to resource exhaustion: attackers send malformed data to trigger unhandled exceptions that hold connections or consume memory deliberately.
