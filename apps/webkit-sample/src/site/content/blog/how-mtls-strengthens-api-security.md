HTTPS has become the standard for protecting data in transit. However, as APIs and distributed applications increasingly support critical business processes, encryption alone is no longer enough.

In many scenarios, the challenge is not only protecting information exchanged between systems but also ensuring that the entity initiating the connection is actually who it claims to be.

This challenge is especially relevant for B2B integrations, financial services, digital identity platforms, and APIs exposed to external partners. In these environments, authenticating only the server creates a security gap that can be exploited by unauthorized actors.

Mutual TLS (mTLS) addresses this challenge by requiring both the client and the server to present valid certificates before communication is established. This adds a layer of strong, cryptographic identity-based authentication, validating identities before any data is exchanged.

## What Is mTLS and How Does It Work?

Mutual TLS (mTLS) is an extension of the TLS protocol that requires authentication from both parties involved in a connection.

In traditional TLS, only the server presents a digital certificate to prove its identity to the client.

With mTLS, the client must also present a valid certificate before the connection can be established.

In practice, this means communication only occurs when both parties can prove their identities using certificates issued by trusted certificate authorities.

The mutual authentication process takes place during the TLS handshake:

1. The client initiates the connection.
2. The server presents its digital certificate.
3. The client validates the server’s certificate.
4. The server requests a certificate from the client.
5. The client presents its certificate and proves possession of the corresponding private key.
6. The server validates the client’s identity against a trusted certificate authority.
7. The connection is established only after both validations are completed.

If either party fails to present a valid certificate, the connection is terminated before any data is exchanged, preventing unauthorized access in real time.

## Why Isn’t HTTPS Enough?

HTTPS protects data in transit against interception and tampering. However, it does not guarantee that the client initiating the connection is an authorized entity.

In modern architectures, organizations need to:

- Ensure that only authorized clients can access critical APIs.
- Validate the identity of external partners and B2B integrations.
- Restrict access to sensitive applications.
- Reduce the risks associated with compromised credentials and tokens.
- Strengthen Zero Trust strategies.

Without additional authentication mechanisms, a connection may use valid HTTPS and still originate from an unauthorized client.

mTLS addresses this problem by adding identity validation before any communication takes place.

## How Azion Implements mTLS

At Azion, mTLS operates between the client and the platform’s distributed infrastructure, configured at the workload level.

During the TLS handshake, the Firewall validates the certificate presented by the client against a Trusted Certificate Authority (Trusted CA) configured by the customer. This special certificate can be managed by the customer and is used to generate client certificates distributed to authorized users. Only connections using these certificates and meeting the defined policies are allowed to proceed.

This model ensures authentication occurs before requests reach applications and APIs, reducing the exposure of critical systems and strengthening access control. As a result, it provides a robust security layer that is difficult to bypass while avoiding reliance on generic control mechanisms such as IP allowlists and similar approaches.

In addition, the platform supports both enforcement mode and hybrid mode. Hybrid mode allows Firewall rules to define when mTLS is required and when connections may be accepted even without mTLS, facilitating validation processes and gradual adoption in production environments.

## Forwarding Verified Identities to Origin Applications

After validating the certificate presented by the client, Azion can forward authenticated identity information to origin applications through configurable headers.

This allows downstream systems to use previously verified identities for authentication, authorization, auditing, and traceability purposes without having to validate certificates directly.

In practice, applications and APIs can make decisions based on cryptographically verified identity information provided by Azion’s distributed infrastructure, simplifying integrations and reducing operational complexity.

## Why Is mTLS Widely Used in Open Banking?

Brazilian Open Banking is one of the most significant examples of large-scale mTLS adoption.

In this model, financial institutions must exchange information through APIs without compromising security, privacy, or regulatory compliance.

To achieve this, encrypting communications is not enough. The identity of every participant involved in the exchange must also be validated.

mTLS meets this requirement by requiring both parties to present valid certificates before communication is established.

The logic is straightforward. Every participant in the Brazilian Open Banking ecosystem is required to possess a client mTLS certificate managed by entities associated with ICP-Brasil. These certificates are used for all connections within the Open Finance infrastructure. Since the mTLS negotiation is terminated by an intermediary layer, that intermediary must forward an authenticated representation of the received certificate to the system behind the CDN, using rules that vary depending on the connected Open Finance provider.

## Attacks That mTLS Helps Mitigate

Although mTLS does not replace technologies such as WAF, DDoS protection, or Bot Management, it adds an important layer of security.

| **Attack Type** | **How mTLS Helps** |
|---|---|
| Service Impersonation | Prevents malicious services from impersonating legitimate entities without valid certificates |
| API Abuse | Blocks unauthorized access before requests reach the application |
| Credential Theft | Reduces the impact of compromised credentials |
| Man-in-the-Middle | Prevents communication between unauthenticated parties |
| Unauthorized Access | Blocks clients that cannot present a valid identity |

## Protecting the Origin: mTLS + Origin Shield

While mTLS protects the connection between the client and Azion’s infrastructure, origin protection is complemented by Origin Shield.

In this model:

- Azion provides infrastructure IP addresses that organizations can use to restrict origin access exclusively to authorized connections.
- Customers configure their firewalls to accept traffic only from those addresses.
- Direct access attempts are blocked before reaching the application.
- All traffic is forced through Azion’s infrastructure, where security and authentication policies are enforced.

This combination creates multiple layers of protection and significantly reduces the exposure of origin infrastructure.

## How mTLS Helps Reduce MTTR

Beyond strengthening prevention, mTLS also improves incident investigation and response capabilities.

Without mutual authentication, many teams can identify only IP addresses or tokens associated with a connection.

With mTLS, each connection is associated with a verifiable identity. This enables teams to:

- Quickly identify the source of suspicious activity.
- Correlate events across applications and services.
- Revoke compromised access immediately.
- Reduce investigation and response times.

## How to Implement mTLS Without Increasing Operational Complexity

Despite its benefits, many organizations avoid implementing mTLS because of the complexity associated with certificate management.

The challenge becomes even greater when security, observability, and identity tools operate in isolation.

According to the GigaOm Radar for Application and API Security 2026, the market has evolved from point solutions to integrated platforms that unify application protection, API security, bot mitigation, and observability.

With the Azion Platform, organizations can implement mTLS as part of an integrated security strategy by combining:

- Certificate Manager for centralized certificate management.
- Firewall for consistent access policy enforcement.
- DDoS protection and automated threat mitigation.
- Unified observability for monitoring and investigations.
- Centralized controls for applications and APIs.

## Conclusion

As APIs and applications become increasingly distributed, protecting communications alone is no longer sufficient. The question shifts from *“Are the data encrypted?”* to *“Who is communicating?”*

mTLS addresses this challenge by adding strong certificate-based authentication, allowing identities to be validated before information is exchanged and blocking unauthorized access in real time.

When combined with WAF, DDoS protection, Bot Management, Origin Shield, and integrated observability, mTLS becomes a foundational component of Zero Trust architectures and modern threat mitigation strategies.

## Next Steps

- [Learn more about Azion Certificate Manager](https://www.azion.com/en/documentation/products/secure/firewall/certificate-manager/).
- [See how to configure mTLS for applications and APIs](https://www.azion.com/en/documentation/products/guides/secure/mtls/).
- [Discover how to strengthen your Zero Trust strategy with mutual authentication](https://www.azion.com/en/learning/websec/zero-trust/zero-trust-vs-traditional-security/).
