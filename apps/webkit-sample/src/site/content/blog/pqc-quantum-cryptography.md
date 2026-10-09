Digital security is facing its biggest challenge in 50 years. While quantum computers promise breakthroughs in medicine, logistics, and science, they also threaten to break the entire cryptographic foundation the internet runs on today.

The good news: the transition to post-quantum cryptography is already underway — and Azion already supports PQC in production, in step with the world’s leading infrastructure and security players.

## The Quantum Threat: How Big Is It?

### What are quantum computers?

Quantum computers process information using qubits instead of traditional bits (0 or 1). Thanks to quantum phenomena like superposition and entanglement, they can perform calculations in parallel at a scale impossible for conventional processors — solving in minutes what would take classical silicon millennia.

That’s great for science and medicine. It’s catastrophic for digital security.

### The algorithm that could break modern cryptography

In 1994, mathematician Peter Shor proved that a sufficiently powerful quantum computer could break RSA and Elliptic Curve Cryptography (ECC) — the foundation of virtually all modern encryption. That means everything protecting banking transactions, encrypted communications, and sensitive data could become vulnerable.

### The algorithm that could crack modern cryptography

In late 2022, a team of Chinese researchers led by Bao Yan published a [paper](https://arxiv.org/abs/2212.12372) suggesting that 2048-bit RSA could be broken using a quantum computer with far fewer qubits than previously thought, by combining Schor’s algorithm with quantum techniques.

For context:

- RSA-2048 secures more than 90% of global HTTPS traffic
- Earlier estimates put the required threshold at 20 million qubits
- Newer research suggests sub-linear resources may be enough
- IBM, Google, and Microsoft are already running quantum processors with 100–1,000+ qubits (2024–2025)

While the scientific debate continues, the consensus is clear: the vulnerability is real and may be closer than we assumed.

## What is post-quantum cryptography (PQC)?

Post-Quantum Cryptography (PQC) is a family of cryptographic algorithms designed to remain secure against quantum computer attacks, standardized by NIST in 2024 through ML-KEM (FIPS 203).

In 2024, NIST standardized the first PQC algorithm for key exchange: ML-KEM (Module-Lattice-Based Key-Encapsulation Mechanism).

### What is Harvest Now, Decrypt Later (HNDL) — and why it already matters

HNDL is an attack strategy where bad actors capture and store encrypted data today, planning to decrypt it later once quantum computers are available.

This means you don’t need to wait for quantum computers to exist before you’re affected. Your data could be getting harvested right now, ready to be decrypted 5, 10, or 20 years down the line.

### Why the Hybrid Model Matters

The hybrid model pairs proven classical security (like X25519) with the quantum resistance of ML-KEM. The result:

- Protection against quantum attacks
- Protection against classical attacks
- Compatibility with existing systems during the transition.

## PQC at Azion: Already Active for You

Azion already supports Post-Quantum Cryptography in production. Protection is native through the hybrid key exchange algorithm **X25519MLKEM768**, combining proven classical security with quantum resistance — aligned with NIST standards (ML-KEM/FIPS 203).

One important note: PQC activation depends on the client (browser or application) initiating the connection also having support for it.

The connection journey is split into two segments, with the same mechanism applied to both:

**First step — Client → Azion Platform:** The client establishes the connection to the Azion Platform. If the client is compatible (Chrome 131+, Edge 131+, Firefox 135+, recent Safari versions), it automatically negotiates the hybrid key.

**Second step — Azion Platform → Origin:** The Azion Platform keeps the communication protected when connecting to the destination server (Origin), applying the same post-quantum encryption.

End-to-end confidentiality is critical, a gap at any point would open the door to HNDL attacks, exposing sensitive data in the future.

## Why this matters for your business

Adopting PQC today is no longer a purely technical decision, it’s a risk and business continuity decision.

While most organizations are still evaluating the transition, operating with PQC in production already represents a concrete competitive advantage, alongside reduced exposure to future threats.

### Compliance, regulatory risk, and data protection

Governments worldwide are beginning to mandate post-quantum cryptography adoption for critical systems. Organizations like the NSA, CISA, and ENISA are calling for transition inventories and plans.

Getting ahead of this curve means less rework once mandates kick in — and the stakes are even higher if your organization handles:

- Medical records
- Financial data
- Intellectual property
- Government information
- Sensitive personal data

## How to Check Whether Your Domains Are Already Protected

### Method 1: In the browser (quickest)

1. Open your domain in Chrome 131+ or Edge 131+
2. Open Developer Tools (F12)
3. Go to the **Security** tab
4. Look for the **Key Exchange** field
5. If it shows **X25519MLKEM768**, PQC is active

### Method 2: Via command line

Run:

*Terminal window*

Terminal window

```shell
echo "Q" | openssl s_client -connect yourdomain.com:443 -tls1_3 2>&1 | grep "group"
```

You should see something like:

*Terminal window*

Terminal window

```shell
Negotiated TLS1.3 group: X25519MLKEM768
```

Check our documentation to learn how to configure cipher settings for your application:

→ [How to configure post-quantum cryptography on Azion](https://www.azion.com/en/documentation/products/guides/secure/post-quantum-cryptography/)

→ [Cipher settings in Applications](https://www.azion.com/en/documentation/products/build/edge-application/main-settings/v3/)

## The future of digital security starts now

Quantum computing isn’t a distant threat. Organizations that start this transition today will be ready when the landscape shifts.

Azion has already built this evolution into its infrastructure, so protection is on by default — automatic, with no added complexity.

If you want to understand your infrastructure’s exposure, the first step is to look at how your connections are being established today and assess the risk associated with your data.

Or, more simply: switch to a platform where that transition has already happened.

→ [Talk to an Azion specialist](https://www.azion.com/en/contact/)

→ [Create your free account](https://console.azion.com/login)
