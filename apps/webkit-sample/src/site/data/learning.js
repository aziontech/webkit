// The Learning Center's subjects — a verbatim transcription of
// https://www.azion.com/en/learning/, read mechanically on 2026-09-24 with the
// /site-design-translate extractor (16 subjects, 78 articles).
//
// TRANSCRIPTION RULES, the same ones every other page's data module follows:
//
//   • Every `title`, `description` and article `label` is the source's string, character
//     for character. No paraphrase, no sentence case imposed, no missing full stop added —
//     the CDN subject's description genuinely ends without one, and it stays that way.
//   • `href` is the source's own relative path, absolutized onto azion.com: these articles
//     live on the real site, and a demo that linked them at its own origin would 404.
//   • `slug` is the only field this file adds. It is derived from the title and exists so
//     the carousel above the grid can jump to a subject; nothing in it is content.
//   • The order is the source's reading order, which is neither alphabetical nor by size.
//
// The page renders this list twice — once as the carousel's jump row, once as the grid of
// cards — so both readings come from one array and cannot drift apart.

/** One subject of the Learning Center: its name, what it covers, and its articles. */
export const LEARNING_SUBJECTS = [
  {
    slug: 'api-security',
    title: 'API Security',
    description:
      'Understand threat risks, implement a robust API Security checklist, and learn architecture best practices to protect your applications with maximum performance.',
    articles: [
      { label: 'What is API Security?', href: 'https://www.azion.com/en/learning/api/what-is-api-security/' },
      { label: 'API Gateway vs. API Security', href: 'https://www.azion.com/en/learning/api/api-gateway-vs-api-security/' },
      { label: 'OWASP API Security Top 10', href: 'https://www.azion.com/en/learning/api/owasp-api-security-top-10/' },
      { label: 'OWASP Top 10 for LLMs', href: 'https://www.azion.com/en/learning/api/owasp-top-10-for-llms/' },
      { label: 'REST vs. GraphQL Security', href: 'https://www.azion.com/en/learning/api/rest-vs-graphql-security/' },
      { label: 'API Security Checklist', href: 'https://www.azion.com/en/learning/api/api-security-checklist/' },
      { label: 'API Security Best Practices', href: 'https://www.azion.com/en/learning/api/api-security-best-practices/' }
    ]
  },
  {
    slug: 'ai',
    title: 'AI',
    description:
      'Discover the transformative power of Artificial Intelligence (AI), a field at the forefront of innovation and technology.',
    articles: [
      { label: 'What is Artificial Intelligence (AI)?', href: 'https://www.azion.com/en/learning/ai/what-is-artificial-intelligence/' },
      { label: 'What is Machine Learning?', href: 'https://www.azion.com/en/learning/ai/what-is-machine-learning/' },
      { label: 'What is RAG?', href: 'https://www.azion.com/en/learning/ai/what-is-rag/' },
      { label: 'What is Vector Search?', href: 'https://www.azion.com/en/learning/ai/what-is-vector-search/' },
      { label: 'What are AI Agents?', href: 'https://www.azion.com/en/learning/ai/what-are-ai-agents/' },
      { label: 'Model Context Protocol (MCP)', href: 'https://www.azion.com/en/learning/ai/model-context-protocol-mcp/' },
      { label: 'What is AI Inference?', href: 'https://www.azion.com/en/learning/ai/what-is-ai-inference/' }
    ]
  },
  {
    slug: 'bots',
    title: 'Bots',
    description:
      'Bots are automated software programs that perform repetitive tasks on websites and applications. While some bots like search engine crawlers are beneficial, malicious bots can cause significant harm to businesses in multiple ways.',
    articles: [
      { label: 'What is a Bot?', href: 'https://www.azion.com/en/learning/bots/what-is-a-bot/' },
      { label: 'What is a Bot Attack?', href: 'https://www.azion.com/en/learning/bots/what-is-a-bot-attack/' },
      { label: 'What is Bot Management?', href: 'https://www.azion.com/en/learning/bots/what-is-bot-management/' },
      { label: 'What is Credential Stuffing?', href: 'https://www.azion.com/en/learning/bots/what-is-credential-stuffing/' }
    ]
  },
  {
    slug: 'cdn',
    title: 'CDN',
    description:
      'The primary goal of a CDN is to reduce latency and improve the speed at which static content is delivered by caching it on servers closer to the end-users',
    articles: [
      { label: 'What is a CDN?', href: 'https://www.azion.com/en/learning/cdn/what-is-a-cdn/' },
      { label: 'What is Caching?', href: 'https://www.azion.com/en/learning/cdn/what-is-caching/' },
      { label: 'What is Micro Caching?', href: 'https://www.azion.com/en/learning/cdn/what-is-micro-caching/' },
      { label: 'What is Tiered Caching?', href: 'https://www.azion.com/en/learning/cdn/what-is-tiered-caching/' }
    ]
  },
  {
    slug: 'dns',
    title: 'DNS',
    description:
      'Understand the Domain Name System (DNS), a fundamental technology that enables internet connectivity by translating domain names into IP addresses.',
    articles: [
      { label: 'What is DNS?', href: 'https://www.azion.com/en/learning/dns/what-is-dns/' },
      { label: 'How DNS cache works?', href: 'https://www.azion.com/en/learning/dns/how-dns-cache-works/' },
      { label: 'What is DNSSEC?', href: 'https://www.azion.com/en/learning/dns/what-is-dnssec/' },
      { label: 'What is DNS resolution | DNS troubleshooting', href: 'https://www.azion.com/en/learning/dns/dns-troubleshooting-queries-and-analysis/' }
    ]
  },
  {
    slug: 'ddos-attacks',
    title: 'DDoS Attacks',
    description:
      'Get precious insights into DDoS attacks: what they are, the motivation behind them, their many kinds and the protective measures available to fortify your defenses today.',
    articles: [
      { label: 'What is a DDoS Attack?', href: 'https://www.azion.com/en/learning/ddos/what-is-ddos-attack/' },
      { label: 'What is a Botnet?', href: 'https://www.azion.com/en/learning/ddos/what-is-a-ddos-botnet/' },
      { label: 'What are Application Layer Attacks?', href: 'https://www.azion.com/en/learning/ddos/application-layer-attack/' },
      { label: 'What is DDoS Protection and Mitigation?', href: 'https://www.azion.com/en/learning/ddos/what-is-ddos-protection-and-mitigation/' }
    ]
  },
  {
    slug: 'jamstack',
    title: 'Jamstack',
    description:
      'With Jamstack you decouple the frontend and backend of a website, allowing for faster performance, better scalability, and improved security.',
    articles: [
      { label: 'What is Jamstack?', href: 'https://www.azion.com/en/learning/jamstack/what-is-jamstack/' },
      { label: 'Why use Jamstack?', href: 'https://www.azion.com/en/learning/jamstack/why-use-jamstack/' },
      { label: 'Jamstack and Ecommerce', href: 'https://www.azion.com/en/learning/jamstack/jamstack-and-ecommerce/' },
      { label: 'Top Jamstack Frameworks', href: 'https://www.azion.com/en/learning/jamstack/top-jamstack-frameworks/' }
    ]
  },
  {
    slug: 'http-status-and-error-troubleshooting',
    title: 'HTTP Status & Error Troubleshooting',
    description:
      'Understand HTTP status codes, troubleshoot common errors like 403 Forbidden, 502 Bad Gateway, 503 Service Unavailable, and 504 Gateway Timeout. Learn causes, solutions, and best practices for handling HTTP errors.',
    articles: [
      { label: 'HTTP Status Codes Explained', href: 'https://www.azion.com/en/learning/http-errors/http-status-codes-explained/' },
      { label: '403 Forbidden: Causes and How to Fix', href: 'https://www.azion.com/en/learning/http-errors/http-403-forbidden-error/' },
      { label: '502 Bad Gateway: Causes and Solutions', href: 'https://www.azion.com/en/learning/http-errors/http-502-bad-gateway/' },
      { label: '503 Service Unavailable: Causes and Troubleshooting', href: 'https://www.azion.com/en/learning/http-errors/http-503-service-unavailable/' },
      { label: '504 Gateway Timeout: Causes and How to Fix', href: 'https://www.azion.com/en/learning/http-errors/http-504-gateway-timeout/' },
      { label: 'HTTP 413 Payload Too Large: Causes and Solutions', href: 'https://www.azion.com/en/learning/http-errors/http-413-payload-too-large/' }
    ]
  },
  {
    slug: 'microservices',
    title: 'Microservices',
    description:
      'Microservices architecture involves independent, deployable services, offering modularity and scalability.',
    articles: [
      { label: 'What are Microservices?', href: 'https://www.azion.com/en/learning/microservices/what-are-microservices/' },
      { label: 'Designing Microservices Applications', href: 'https://www.azion.com/en/learning/microservices/designing-microservices-applications/' },
      { label: 'Monolithic Applications vs. Microservices', href: 'https://www.azion.com/en/learning/microservices/monolithic-applications-vs-microservices/' }
    ]
  },
  {
    slug: 'network-layer',
    title: 'Network Layer',
    description:
      'Discover how the network layer enables data packet routing and delivery between networks, ensuring efficient communication through addressing, packet forwarding, and optimal path selection.',
    articles: [
      { label: 'What is the Network Layer?', href: 'https://www.azion.com/en/learning/network-layer/what-is-the-network-layer/' },
      { label: 'What is Network Security?', href: 'https://www.azion.com/en/learning/network-layer/what-is-network-security/' },
      { label: 'What is Routing?', href: 'https://www.azion.com/en/learning/network-layer/what-is-routing/' },
      { label: 'What is GRE Tunneling?', href: 'https://www.azion.com/en/learning/network-layer/what-is-gre-tunneling/' }
    ]
  },
  {
    slug: 'observability',
    title: 'Observability',
    description:
      'Observability is the ability to understand the internal state of a system by examining its external outputs. Learn about metrics, logs, traces, and how to implement modern monitoring in distributed architectures.',
    articles: [
      { label: 'What is Observability?', href: 'https://www.azion.com/en/learning/observability/what-is-observability/' },
      { label: 'Observability Three Pillars', href: 'https://www.azion.com/en/learning/observability/observability-three-pillars/' },
      { label: 'Monitoring vs Observability', href: 'https://www.azion.com/en/learning/observability/monitoring-vs-observability/' },
      { label: 'What is Telemetry?', href: 'https://www.azion.com/en/learning/observability/what-is-telemetry/' },
      { label: 'What are Metrics?', href: 'https://www.azion.com/en/learning/observability/what-are-metrics/' },
      { label: 'What is Real-Time Monitoring?', href: 'https://www.azion.com/en/learning/observability/what-is-real-time-monitoring/' }
    ]
  },
  {
    slug: 'performance',
    title: 'Performance',
    description:
      'Optimizing site speed can outsize the user experience, SEO rankings, and conversion rates. Website performance provides a competitive advantage over slower sites.',
    articles: [
      { label: 'What is Site Speed?', href: 'https://www.azion.com/en/learning/performance/what-is-site-speed/' },
      { label: 'Why Website Performance Impact Conversion Rates?', href: 'https://www.azion.com/en/learning/performance/website-performance-and-conversion-rates/' },
      { label: 'What is Latency?', href: 'https://www.azion.com/en/learning/performance/what-is-latency/' },
      { label: 'What is Load Balancing?', href: 'https://www.azion.com/en/learning/performance/what-is-load-balancing/' }
    ]
  },
  {
    slug: 'storage-and-database',
    title: 'Storage and Database',
    description:
      'Master the complete landscape of data storage and databases for modern applications. Learn when to use SQL vs NoSQL, how Object Storage reduces costs, why vector databases power AI applications, and how distributed architectures deliver low-latency data access globally.',
    articles: [
      { label: 'What is Storage and Database?', href: 'https://www.azion.com/en/learning/storage-database/what-is-storage-and-database/' },
      { label: 'What is a Relational Database?', href: 'https://www.azion.com/en/learning/storage-database/what-is-relational-database/' },
      { label: 'What is Object Storage and Blob Storage?', href: 'https://www.azion.com/en/learning/storage-database/what-is-object-storage-blob/' },
      { label: 'What is NoSQL and Key-Value Store?', href: 'https://www.azion.com/en/learning/storage-database/what-is-nosql-key-value-store/' },
      { label: 'What is a Vector Database?', href: 'https://www.azion.com/en/learning/storage-database/what-is-vector-database/' },
      { label: 'What is Database Security?', href: 'https://www.azion.com/en/learning/storage-database/what-is-database-security-breaches/' }
    ]
  },
  {
    slug: 'serverless',
    title: 'Serverless',
    description:
      'Serverless computing is transforming the way applications are developed, deployed, and scaled. Developers can abstract the underlying infrastructure and focus on write code and deliver value to their users.',
    articles: [
      { label: 'What is Serverless?', href: 'https://www.azion.com/en/learning/serverless/what-is-serverless/' },
      { label: 'Serverless vs. Containers', href: 'https://www.azion.com/en/learning/serverless/serverless-vs-containers/' },
      { label: 'What is Function-as-a-Service (FasS)?', href: 'https://www.azion.com/en/learning/serverless/what-is-function-as-a-service-faas/' },
      { label: 'What is Platform-as-a-Service (PaaS)?', href: 'https://www.azion.com/en/learning/serverless/what-is-platform-as-a-service-paas/' }
    ]
  },
  {
    slug: 'tls',
    title: 'TLS',
    description:
      'Explore the world of TLS. Master TLS 1.3 and mTLS to strengthen machine identity with Zero Trust, eliminating handshake latencies and ensuring the cryptographic resilience of your applications at the Edge.',
    articles: [
      { label: 'What is TLS?', href: 'https://www.azion.com/en/learning/tls/what-is-tls/' },
      { label: 'TLS vs. mTLS', href: 'https://www.azion.com/en/learning/tls/mtls-vs-tls/' },
      { label: 'TLS Ciphers - Security and Performance in the Handshake', href: 'https://www.azion.com/en/learning/tls/cipher-suites-tls' },
      { label: 'Post-Quantum Cryptography (PQC)', href: 'https://www.azion.com/en/learning/tls/post-quantum-cryptography-pqc-tls-kyber/' },
      { label: 'Security for AI Agents', href: 'https://www.azion.com/en/learning/tls/security-for-ai-agents-mtls-tls13/' },
      { label: 'TLS Handshake Troubleshooting', href: 'https://www.azion.com/en/learning/tls/troubleshooting-handshake-tls/' }
    ]
  },
  {
    slug: 'web-application-security',
    title: 'Web Application Security',
    description:
      'Get to know the processes, practices, and technologies designed to protect web applications from threats and vulnerabilities that could compromise their integrity, availability, or confidentiality.',
    articles: [
      { label: 'What is Web Application Security?', href: 'https://www.azion.com/en/learning/websec/what-is-web-application-security/' },
      { label: 'What is the OWASP Top 10 List of Threats?', href: 'https://www.azion.com/en/learning/websec/what-is-the-owasp-top-10-list-of-web-application-security-threats/' },
      { label: 'What is a Web Application Firewall (WAF)?', href: 'https://www.azion.com/en/learning/websec/what-is-web-application-firewall/' },
      { label: 'How Does a WAF Protect Against Threats?', href: 'https://www.azion.com/en/learning/websec/how-does-waf-protect-against-cyberthreats/' },
      { label: 'Zero Trust vs. Traditional Security', href: 'https://www.azion.com/en/learning/websec/zero-trust/zero-trust-vs-traditional-security/' }
    ]
  }
]
