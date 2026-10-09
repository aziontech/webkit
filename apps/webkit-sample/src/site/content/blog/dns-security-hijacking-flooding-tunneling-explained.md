Three ways attackers use DNS against production infrastructure. Most security teams defend against zero of them.

DNS is the resolution layer underneath everything else. You configure firewalls, deploy WAFs, monitor HTTP traffic, and DNS runs trusted and unwatched underneath all of it. Attackers figured that out years ago. Most security tooling logs application-layer events. DNS query logs are either not collected or not reviewed.

Three attack classes exploit that gap. Each one works differently, targets a different part of the DNS stack, and requires a different defense. What they share is that they work because DNS is treated as plumbing: infrastructure assumed to be fine until it fails.

> **The short version:** DNS hijacking redirects a domain to attacker infrastructure with a valid TLS certificate. DNS flooding takes a domain offline without touching the application stack. DNS tunneling moves data out of the network through port 53, a channel most firewalls pass without inspection. All three are preventable. None require rebuilding existing infrastructure.

---

## How DNS resolution works before it gets attacked

Every attack in this article targets a specific point in the DNS resolution chain. Understanding the chain makes the attacks legible.

When a browser resolves a domain, it asks a recursive resolver. The resolver checks its cache. If the record is not cached, it queries the root nameservers, which direct it to the TLD nameserver (the server responsible for `.com`, `.io`, and so on), which directs it to the authoritative nameserver for the specific domain. The authoritative server returns the IP. The resolver caches it for the TTL duration and returns it to the client.

Four distinct hops. Each one is an attack surface.

---

## Attack 1: DNS hijacking

The goal of DNS hijacking is to make a legitimate domain resolve to an IP address the attacker controls.

The most common vector targets the domain registrar. An attacker gains access to the registrar account, through credential stuffing, phishing, or a compromised support channel, and changes the nameserver records. From that point, every DNS query for the domain routes to infrastructure the attacker controls.

The detail that makes this attack dangerous is the TLS certificate. Certificate issuance is DNS-based. Once an attacker controls the DNS records for a domain, they can request and receive a valid TLS certificate from a public certificate authority. The padlock in the browser is green. The URL is correct. The page looks right. The credentials go to the attacker. Users have no signal that anything is wrong, because by every visible sign, nothing is.

A second variant targets the resolver cache rather than the registrar. Cache poisoning works by sending a forged DNS response to a resolver before the legitimate response arrives. If the forged response wins the race, the resolver stores the wrong record and serves it to every client on that resolver until the TTL expires. The attack does not require registrar access. It requires speed and a vulnerable resolver.

**Defense:** MFA on the registrar account with alerts configured for nameserver changes stops the registrar compromise vector. [DNSSEC](https://www.azion.com/en/documentation/products/guides/secure/activate-dnssec/) closes the cache poisoning vector: it cryptographically signs zone records so a forged response fails validation before it reaches the client.

---

## Attack 2: DNS flooding

The goal of DNS flooding is availability. Take the authoritative server offline and the domain goes dark: NXDOMAIN for every query, regardless of whether the application behind it is running normally.

Authoritative DNS servers have a throughput limit. Send more queries per second than the server can process and it stops responding. From the user perspective: the website is unreachable, email bounces, API calls time out. From the operations team: the application stack is healthy, dashboards are green, and nothing explains why the domain is not resolving.

DNS amplification multiplies the attack volume. An attacker spoofs the victim’s IP address and sends small DNS queries to open resolvers across the internet. Those resolvers send large responses to the spoofed address. The amplification ratio can reach 50 to 1, meaning a small botnet generates hundreds of gigabits per second of inbound traffic against a single target.

**Defense:** Anycast routing distributes authoritative DNS across many locations simultaneously. When flood traffic arrives, it hits the nearest node rather than concentrating on a single server. That node absorbs what it can; the rest of the network keeps serving. [Azion’s Edge DNS](https://www.azion.com/en/documentation/products/secure/edge-dns/)runs authoritative resolution across Azion’s distributed network with [DDoS protection](https://www.azion.com/en/documentation/products/secure/firewall/ddos-protection/) built into the network layer, so flood traffic never reaches a single point of failure.

---

## Attack 3: DNS tunneling

DNS tunneling is the attack most security teams have not considered. It uses the DNS protocol itself to move data, not through HTTP or HTTPS, but through DNS queries and responses carrying encoded payloads.

The setup requires an attacker who controls a domain and its authoritative nameserver. Malware on a machine inside the target network encodes data into DNS query strings: something structured like `d3a1f2b.chunk04.exfil.attacker.com`. That query leaves on port 53. Most firewalls allow port 53 outbound without inspecting the content. The query reaches the attacker’s authoritative server. The server decodes the data from the subdomain string and sends the next instruction back in the DNS response. The exchange continues, back and forth, over DNS, through the network perimeter.

The firewall logged a DNS query. The SIEM ignored it. The data left.

What makes this difficult to catch is that the traffic looks legitimate at the protocol level. DNS queries on port 53 are expected and allowed. The difference is in the pattern: tunneling traffic has unusually long subdomain strings, high query volume to a single domain, and character distributions that do not match real hostnames. Normal DNS traffic is short, goes to a small set of known domains, and subdomains look like real hostnames.

**Defense:** Log port 53 traffic and look for anomalies in query length, frequency, and subdomain entropy. [Azion’s Real-Time Events](https://www.azion.com/en/documentation/products/observe/real-time-events/) captures DNS query data at the network edge, giving visibility into what is leaving the network before requests reach origin infrastructure. Blocking or rate-limiting outbound DNS to unknown resolvers reduces the channel’s availability for exfiltration entirely.

---

## The common thread

All three attacks exploit the same condition: DNS runs trusted and unwatched.

Hijacking works because nobody monitors nameserver changes at the registrar. Flooding works because authoritative servers are single points of failure. Tunneling works because port 53 outbound traffic gets a free pass through most perimeter controls.

| Attack | Target | Blind spot | Defense |
|---|---|---|---|
| Hijacking | Registrar account or resolver cache | No alerts on nameserver changes | Registrar MFA, [DNSSEC](https://www.azion.com/en/documentation/products/guides/secure/activate-dnssec/) |
| Flooding | Authoritative server throughput | Domain goes dark with app stack healthy | Anycast routing, [DDoS protection](https://www.azion.com/en/documentation/products/secure/firewall/ddos-protection/) |
| Tunneling | Port 53 outbound channel | DNS query content not inspected | Port 53 logging, query anomaly detection |

MFA and [DNSSEC](https://www.azion.com/en/documentation/products/guides/secure/activate-dnssec/)for hijacking. Anycast distribution for flooding. Query logging for tunneling. None require rebuilding existing infrastructure. The three-check audit, registrar MFA, [DNSSEC](https://www.azion.com/en/documentation/products/guides/secure/activate-dnssec/) enabled, port 53 logging active, takes under an hour.

---

## What Edge DNS covers

[Azion’s Edge DNS](https://www.azion.com/en/documentation/products/secure/edge-dns/) runs authoritative DNS on Azion’s distributed network. DNSSEC is built in. DDoS protection absorbs flood traffic at the network layer before it concentrates on any single node. DNS query logs flow into [Real-Time Events](https://www.azion.com/en/documentation/products/observe/real-time-events/), so query volume, subdomain patterns, and resolution behavior are visible without additional tooling.

All three attack surfaces, hijacking, flooding, and tunneling, are addressed from a single configuration.

[Talk to an Azion specialist](https://www.azion.com/en/contact/) to see how Edge DNS handles authoritative resolution, DNSSEC, and DNS query visibility at scale.

---

DNS sits under everything else, and most teams treat it that way: set it up once, never look at it again. Attackers count on that.

Registrar MFA. DNSSEC on. Port 53 logging active. Three checks, under an hour. Not doing it is a choice.

---

## Frequently asked questions

**What is DNS hijacking?** DNS hijacking is an attack where an attacker gains control of a domain’s DNS records, typically by compromising the registrar account, and redirects resolution to infrastructure they control. Because TLS certificate issuance is DNS-based, attackers can obtain a valid certificate for the hijacked domain. Users see a green padlock and a correct URL while interacting with attacker-controlled infrastructure.

**What is DNS cache poisoning?** DNS cache poisoning is a variant of DNS hijacking that targets resolver caches rather than registrar accounts. An attacker sends a forged DNS response to a recursive resolver before the legitimate response arrives. If the forged response is accepted, the resolver stores and serves the wrong IP to all clients on that resolver until the TTL expires. DNSSEC prevents this by cryptographically signing zone records so forged responses fail validation.

**How does a DNS flood attack work?** A DNS flood sends more queries per second to an authoritative server than it can process, causing it to stop responding. From the user perspective the domain becomes unreachable: NXDOMAIN on every query, even though the application running behind it is healthy. DNS amplification exploits open resolvers: an attacker spoofs the victim’s IP, sends small queries to open resolvers, and those resolvers return large responses to the spoofed address, multiplying the traffic volume by up to 50 to 1.

**What is DNS tunneling and why is it hard to detect?** DNS tunneling encodes data into DNS query strings and sends it to an attacker-controlled authoritative server on port 53. Most firewalls allow outbound port 53 traffic without inspecting query content. The data is decoded from the subdomain string at the attacker’s server. Because the traffic uses the legitimate DNS protocol on the expected port, it passes through perimeter controls that would block other exfiltration channels. Detection requires logging port 53 traffic and analyzing query length, frequency, and subdomain entropy for anomalies.

**What is DNSSEC and what does it protect against?** DNSSEC is a set of DNS extensions that cryptographically sign zone records. When a resolver receives a DNS response, it validates the signature against the public key published in the DNS chain of trust. A forged or tampered response fails signature validation and is rejected. DNSSEC protects against cache poisoning and response-forgery attacks but does not protect against registrar account compromise. That requires MFA and access controls at the registrar level.

**What is anycast DNS and why does it matter for DDoS protection?** Anycast routing announces the same IP address from multiple geographic locations simultaneously. A DNS query routes to the nearest available node. Under a flood attack, traffic concentrates on the closest node rather than on a single origin server. That node absorbs what it can; other nodes continue serving normally. For authoritative DNS, anycast means a volumetric flood cannot take down the entire resolution infrastructure. It can only affect the portion of the network closest to the attack source.
