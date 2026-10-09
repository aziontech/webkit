For years, post-quantum cryptography was treated as a topic for researchers and long-term forecasts. The debate always centered on the same question: when will a quantum computer be able to break algorithms like RSA and ECC?

The new Executive Order 14412, published by the White House in June 2026, changes that conversation. An Executive Order is a presidential directive with binding force for US federal government agencies. And this one, in particular, shows that for the United States, waiting for the answer is no longer an option.

When a government sets legal deadlines to migrate its most critical systems to post-quantum cryptography, it is not trying to predict the future. It is managing a risk it considers large enough to justify immediate action.

Faced with the severity and inevitability of this risk, the US government formalized a mandatory timeline for migrating its most critical civilian systems to post-quantum cryptography.

The order applies directly to federal agencies, but its meaning is broader: a known risk now drives concrete action, with defined owners, steps, and deadlines.

For organizations that store information with long-term value, waiting for quantum computers to move from hypothesis to reality before starting the migration may mean acting too late.

---

## What the Executive Order requires

The order establishes a progressive transition plan for systems classified as High Value Assets (HVAs) and other high-impact environments of the US government.

| Date | Requirement |
|---|---|
| **July 2026** | Each federal agency must designate an official responsible for leading its post-quantum cryptography (PQC) migration. |
| **September 2026** | Agencies must complete an inventory of critical systems and develop a formal transition plan for PQC adoption. |
| **December 2027** | NIST must complete its pilot project for migrating a subset of its systems to post-quantum cryptography. |
| **December 2030** | All High Value Assets (HVAs) and other high-impact systems must use post-quantum algorithms for **key establishment**. Government contractors supporting these systems must also comply with NIST PQC standards. |
| **December 2031** | The same systems must transition to **post-quantum digital signatures**, completing the migration process. |

Governments typically avoid setting deadlines for immature technologies. By establishing mandatory dates, the US administration signals that preparation is more urgent than waiting for certainty about Q-Day.

The debate has shifted from “when will the quantum computer arrive” to “how long will your organization take to migrate.”

## Why the dates matter

The two main milestones are separated by just one year: 2030 for key establishment, 2031 for digital signatures.

That proximity is not accidental. The US government is not projecting a gradual adoption over the next decade. It is saying that preparation must start now for the transition to finish before the risk materializes.

Even if a Cryptographically Relevant Quantum Computer (CRQC) takes longer than expected to exist, organizations take years to complete a cryptographic migration. Inventories, library updates, HSM replacements, application compatibility, recertification, and testing consume multiple development cycles. That is the time the order is trying to get ahead of.

## The risk exists before Q-Day

Attacks known as Harvest Now, Decrypt Later (HNDL) follow a direct logic: intercept today communications protected by classical cryptography and store them to be decrypted when quantum computers become available.

Information transmitted today may be exposed ten years from now. This includes assets whose value remains relevant for many years:

- Financial data

- Medical records

- Intellectual property

- Internal system communications

- Artificial intelligence models

There is an important point here: HNDL protection only applies to data protected from the moment of implementation. Information that has already traveled using only classical cryptography may have been intercepted and stored by adversaries for a future decryption attempt.

In other words, migration does not protect the past. It protects data generated from the moment post-quantum cryptography is in use. Every additional period without PQC protection expands the exposure window for information that will still need to remain confidential in the future.

The risk depends less on the Q-Day date and more on the shelf life of the information. If data needs to remain confidential for ten or fifteen years, protection must start now.

## Why there are two different deadlines

The order splits the migration into two phases because they solve different problems.

The 2030 deadline covers key establishment: the mechanism used during the TLS handshake to negotiate the keys that will protect a session. Algorithms already standardized by NIST, such as ML-KEM (FIPS 203), allow this phase to be protected with hybrid approaches compatible with modern infrastructures.

The 2031 deadline covers digital signatures: certificates, server authentication, code signing, corporate PKIs. This transition requires coordination across browsers, operating systems, certificate authorities, hardware manufacturers, and software vendors. Hence the additional year.

In practice, both migrations must start in parallel. Waiting to finish one before starting the other makes the timeline unworkable.

## The impact goes well beyond the US government

The Executive Order has direct effect on federal agencies, but its consequences reach companies worldwide through two paths.

The first is contractual: companies that supply products or services to the US government will need to meet the new NIST requirements by 2030, including international organizations in that supply chain.

The second is market-driven. This is not the first time the US government has acted as a catalyst for a global security standard. It happened with IPv6, with DNSSEC, and with TLS requirements for federal systems — all of which became industry baselines years later.

The logic is straightforward: when the world’s largest technology buyers require a standard, vendors implement it. And when vendors implement it, the requirement reaches all customers regardless of country or local regulation. Support for post-quantum cryptography tends to shift from differentiator to baseline.

This already affects procurement decisions. Every technology renewal now requires concrete questions:

- Does the vendor have a PQC roadmap?

- When will it be available?

- Does migration require a platform change?

- Is there support for crypto agility?

These answers influence architectural decisions long before regulatory deadlines arrive.

## What about organizations outside the US?

The Executive Order creates no obligations for companies outside the United States. But organizations in regulated sectors have their own reasons to pay attention — and the financial sector is the clearest example.

Many countries require mutual TLS authentication, digital certificates, and cipher suites based on RSA and elliptic curves for connections between financial institutions. These requirements are correct for the current threat model. They do not protect against HNDL.

An institution that rigorously complies with all current regulation — mTLS, RSA-2048 certificates, classical cipher suites — is still exposed to HNDL attacks. Channels that comply with today’s standards will remain vulnerable to retroactive decryption when quantum computers exist. Regulatory protection and quantum protection are two different problems, and only one of them is addressed by current standards.

This matters because financial data, transaction records, medical records, and consent data are not ephemeral. They have strategic relevance that extends for years — sometimes decades. They are exactly the type of asset that adversaries collect today to decrypt later.

The path forward does not require breaking existing compliance. Hybrid architectures add post-quantum algorithms such as ML-KEM-768 to the existing mTLS handshake, while maintaining the classical authentication required by current regulation. Compliance remains intact. Exposure to retroactive quantum risk does not.

## What organizations should do now

The Executive Order offers a roadmap applicable to any organization, not just federal agencies.

The first step is defining who will lead this transition internally. Then, map which systems store data whose value will remain relevant for many years — those are the most exposed to HNDL risk.

Before setting a migration timeline, build an inventory of the organization’s connections. Knowing which systems use TLS is not enough. It is necessary to understand which ones can already negotiate post-quantum algorithms and which still depend on broader ecosystem support — browsers, APIs, libraries, proxies, load balancers.

The bottleneck is rarely in the edge infrastructure. In many cases, it already supports ML-KEM. What determines whether a connection will actually negotiate post-quantum cryptography is support across the entire TLS chain.

That is where observability comes in. Features like [Real-Time Events](https://www.azion.com/en/products/real-time-events/) and [Data Stream](https://www.azion.com/en/products/data-stream/) from Azion show which TLS versions and key exchange algorithms are being negotiated on each connection. This allows teams to prioritize where migration can happen now and where technical dependencies still need to be resolved.

A full migration takes years. Starting now means being able to test, validate compatibility, and update systems progressively. Waiting for absolute certainty about Q-Day consumes the one resource that cannot be recovered: time.

## Cryptography’s future is already in strategic planning

The most relevant point of the Executive Order is not any specific algorithm. Nor is it the choice between ML-KEM or ML-DSA.

It is that one of the world’s largest governments decided the risk is already large enough to become public policy with a timeline, budget, and formal obligations.

When that happens, the question changes. It is no longer “do we need to think about post-quantum cryptography?” It is “how long will our organization need to complete this migration?” For most companies, the answer is measured in years. And 2030 is already on the planning horizon.

## How Azion approaches this

Azion already operates with PQC in production. The hybrid algorithm X25519MLKEM768 — combining the classical security of X25519 with the quantum resistance of ML-KEM, in compliance with NIST FIPS 203 — is active by default on the platform.

For a connection to negotiate post-quantum cryptography, the TLS client must also support the algorithm. This includes browsers, applications, SDKs, APIs, and other consumers that establish TLS 1.3 connections with ML-KEM support. Whenever possible, these connections should be negotiated using the available post-quantum algorithms.

The hybrid model is the right approach for this moment. It protects against future quantum attacks without giving up compatibility with systems that have not yet migrated. For traffic flowing through Azion, HNDL protection is already active — no additional configuration, no platform change.

To check whether your domains are already negotiating post-quantum connections, open the domain in Chrome 131+, go to DevTools → Security, and look at the Key Exchange field. In environments protected by Azion, the presence of the hybrid group X25519MLKEM768 indicates that PQC protection is active.

If your organization is starting this assessment, consult the [PQC configuration documentation](https://www.azion.com/en/documentation/products/guides/secure/post-quantum-cryptography/) or [talk to an Azion specialist](https://www.azion.com/en/contact/).
