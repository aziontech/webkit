// The azion.com/en/blog index, read on 2026-10-08 from the page's own listing payload (the
// island props the live page ships), verbatim. Authors are deliberately not carried: this
// Site's blog cards name no author and show no author photo. Images and links stay on azion.com.

export const BLOG_ORIGIN = 'https://www.azion.com'

// The featured band the source opens with; it is not part of the listing payload.
export const BLOG_FEATURED = {
  key: 'azion-leader-g2-fall-reports-2026',
  title: 'Azion Named Leader in Four Categories — G2 Fall 2026 Reports',
  description:
    'Azion earned Leader status in CDN, Web Security, DDoS Protection, and Bot Detection and Mitigation (Enterprise) in the G2 Fall 2026 Reports, plus High Performer recognition in five more categories.',
  href: 'https://www.azion.com/en/blog/azion-leader-g2-fall-reports-2026/',
  image: 'https://www.azion.com/assets/g2fallreports.png',
  date: 'AUG 28, 2026',
  readTime: '5 min read'
}

// The source's category tabs, in its order; `All Articles` is the reset.
export const BLOG_ALL = 'All Articles'
export const BLOG_CATEGORIES = ['Developers', 'Security', 'Company News', 'Market Trends', 'Serverless', 'Caching', 'Observability', 'Routing & Networking']

export const BLOG_LABELS = {
  search: 'Search articles',
  loadMore: 'Show more'
}

// The source's newsletter band, in its own words.
export const BLOG_NEWSLETTER = {
  eyebrow: 'Stay up to date',
  title: 'Subscribe to our Newsletter',
  description:
    'Get the latest product updates, event highlights, and tech industry insights delivered to your inbox.',
  placeholder: 'Your e-mail',
  submit: 'Subscribe',
  success: 'Thanks for subscribing to Azion newsletter'
}

export const BLOG_POSTS = [
  {
    key: 'bringing-application-security-into-the-deployment-process',
    title: 'Bringing application security into the deployment process',
    description: 'Integrate application, API, and AI agent protection into deployment with reusable policies, security reviews, and validation in Real-Time Events.',
    href: 'https://www.azion.com/en/blog/bringing-application-security-into-the-deployment-process/',
    image: 'https://www.azion.com/assets/content/blog/uploads/Rich%20contentsdark.png',
    categories: ['Security'],
    date: 'OCT 7, 2026',
    readTime: '8 min read'
  },
  {
    key: 'coding-agent-suggests-security-policy',
    title: 'The agent that writes your code also suggests your security policy',
    description: 'See how the open-source Azion MCP Server lets coding agents like Claude Code and Codex query Azion docs and propose security policies (WAF, Firewall, rate limiting) via Terraform, for team review before deploy.',
    href: 'https://www.azion.com/en/blog/coding-agent-suggests-security-policy/',
    image: 'https://www.azion.com/assets/content/blog/uploads/Azion_Productsdark.png',
    categories: ['Developers'],
    date: 'OCT 5, 2026',
    readTime: '9 min read'
  },
  {
    key: 'ship-portfolio-two-commands-azion-cli',
    title: 'How I Shipped My Portfolio in Just Two Commands',
    description: 'See how a portfolio site went from template to live URL with just azion init and azion deploy, running free on Azion\'s Hobby plan.',
    href: 'https://www.azion.com/en/blog/ship-portfolio-two-commands-azion-cli/',
    image: 'https://www.azion.com/assets/screenshot-2026-09-25-at-10-47-14.png',
    categories: ['Developers'],
    date: 'SEP 25, 2026',
    readTime: '9 min read'
  },
  {
    key: 'how-to-reduce-ai-agent-latency',
    title: 'How Do You Reduce AI Agent Latency?',
    description: 'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state with distributed architecture, caching, and observability.',
    href: 'https://www.azion.com/en/blog/how-to-reduce-ai-agent-latency/',
    image: 'https://www.azion.com/assets/content/blog/uploads/Programmingdark.jpg',
    categories: ['Serverless'],
    date: 'SEP 23, 2026',
    readTime: '8 min read'
  },
  {
    key: 'cloudflare-alternatives-and-competitors',
    title: 'Best Cloudflare Alternatives and Competitors',
    description: 'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting. Assess trade-offs, operating costs, and migration paths with Azion.',
    href: 'https://www.azion.com/en/blog/cloudflare-alternatives-and-competitors/',
    image: 'https://www.azion.com/assets/content/blog/uploads/best-cloudflare-alternatives/best-cloudflare-alternatives.png',
    categories: ['Security'],
    date: 'SEP 22, 2026',
    readTime: '13 min read'
  },
  {
    key: 'which-azion-plan-is-right-for-your-project',
    title: 'Which Azion Plan Is Right for Your Project?',
    description: 'Compare Azion’s Hobby, Pro, and Enterprise plans for personal projects, production applications, and operations that need customized terms.',
    href: 'https://www.azion.com/en/blog/which-azion-plan-is-right-for-your-project/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumblinkedin-4templatesimproveexperience-1280x720px.png',
    categories: ['Company News'],
    date: 'SEP 22, 2026',
    readTime: '7 min read'
  },
  {
    key: 'optimize-operations-at-scale-azion-enterprise-plan',
    title: 'How to Optimize Operations at Scale with the Azion Enterprise Plan',
    description: 'Learn how the Azion Enterprise Plan helps optimize costs, plan capacity, and address governance, compliance, and support requirements.',
    href: 'https://www.azion.com/en/blog/optimize-operations-at-scale-azion-enterprise-plan/',
    image: 'https://www.azion.com/assets/content/blog/uploads/Rich%20contentsdark.png',
    categories: ['Developers'],
    date: 'SEP 14, 2026',
    readTime: '7 min read'
  },
  {
    key: 'azion-pro-plan-personal-project-to-product',
    title: 'Azion Pro Plan: When Your Personal Project Becomes a Product',
    description: 'Learn when to move from Hobby to Azion’s Pro plan, with higher included limits, on-demand usage, and spend controls for production applications.',
    href: 'https://www.azion.com/en/blog/azion-pro-plan-personal-project-to-product/',
    image: 'https://www.azion.com/assets/content/blog/uploads/Azion_Productsdark.png',
    categories: ['Developers'],
    date: 'SEP 10, 2026',
    readTime: '4 min read'
  },
  {
    key: 'what-you-can-build-with-azion-hobby-plan',
    title: 'What You Can Build with Azion’s Hobby Plan',
    description: 'Explore free templates for resumes, blogs, portfolios, AI agents, and e-commerce prototypes with Azion’s Hobby plan.',
    href: 'https://www.azion.com/en/blog/what-you-can-build-with-azion-hobby-plan/',
    image: 'https://www.azion.com/assets/content/blog/uploads/Programmingdark.jpg',
    categories: ['Developers'],
    date: 'SEP 10, 2026',
    readTime: '8 min read'
  },
  {
    key: 'how-to-run-agentic-infrastructure-in-production',
    title: 'How to Run Agentic Infrastructure in Production',
    description: 'Learn how to run agentic AI infrastructure in production with durable execution, checkpointing, inference cost controls, and step-level observability.',
    href: 'https://www.azion.com/en/blog/how-to-run-agentic-infrastructure-in-production/',
    image: 'https://www.azion.com/assets/content/blog/uploads/agentic-infra-prod/og-image-agentic-infra-prod.png',
    categories: ['Developers'],
    date: 'SEP 9, 2026',
    readTime: '12 min read'
  },
  {
    key: 'agentic-workflows-infrastructure-guide',
    title: 'From Single LLM Calls to Agentic Workflows: An Infrastructure Guide',
    description: 'Learn how infrastructure requirements change from single LLM calls to agentic workflows, including orchestration, inference, memory, tool calling, and access control.',
    href: 'https://www.azion.com/en/blog/agentic-workflows-infrastructure-guide/',
    image: 'https://www.azion.com/assets/edge-computing.png',
    categories: ['Serverless'],
    date: 'SEP 3, 2026',
    readTime: '11 min read'
  },
  {
    key: 'why-next-wave-ai-apps-wont-run-centralized-cloud',
    title: 'Why the Next Wave of AI Apps Won\'t Run in Centralized Cloud',
    description: 'Distributed AI inference is the practice of handling AI requests close to the user instead of routing every one to a centralized cloud region. Learn why AI-native apps are moving away from centralized inference and how the Azion Platform supports it today.',
    href: 'https://www.azion.com/en/blog/why-next-wave-ai-apps-wont-run-centralized-cloud/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog_440x343px_livemap.png',
    categories: ['Serverless'],
    date: 'AUG 28, 2026',
    readTime: '13 min read'
  },
  {
    key: 'ai-agents-financial-services',
    title: 'AI agents in financial services: control in production',
    description: 'AI agents can access data, recommend decisions, and execute actions across financial systems. Learn how to structure identity, authorization, enforcement, observability, and API protection controls for production environments.',
    href: 'https://www.azion.com/en/blog/ai-agents-financial-services/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbblogzerotrustjourney-planning.png',
    categories: ['Market Trends'],
    date: 'AUG 24, 2026',
    readTime: '11 min read'
  },
  {
    key: 'how-many-vendors-does-a-bank-need-secure-infrastructure',
    title: 'How many vendors does a bank need for secure infrastructure?',
    description: 'Learn why fragmented security and delivery vendors drive up the real cost of running banking infrastructure — and how to consolidate WAF, Bot Manager, DDoS Protection, and AI Inference on a single platform.',
    href: 'https://www.azion.com/en/blog/how-many-vendors-does-a-bank-need-secure-infrastructure/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-4templatesimproveexperience-440x343px-1.png',
    categories: ['Market Trends'],
    date: 'AUG 24, 2026',
    readTime: '9 min read'
  },
  {
    key: 'financial-api-security',
    title: 'Financial API Security: How to Protect Each Type of API',
    description: 'Learn how to protect financial APIs against credential stuffing, business logic abuse, scraping, and unauthorized access with Bot Manager, WAF, rate limiting, mTLS, and real-time observability.',
    href: 'https://www.azion.com/en/blog/financial-api-security/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbblogfivecybersecuritytrends2023.png',
    categories: ['Security'],
    date: 'AUG 19, 2026',
    readTime: '8 min read'
  },
  {
    key: 'understanding-agentic-ai-infrastructure',
    title: 'Understanding Agentic AI Infrastructure',
    description: 'Learn what agentic AI infrastructure is, why agent workloads break traditional assumptions, and which layers you need before agents reach production.',
    href: 'https://www.azion.com/en/blog/understanding-agentic-ai-infrastructure/',
    image: 'https://www.azion.com/assets/content/blog/uploads/agentic-infrastructure/og-image-agentic-infrastructure.png',
    categories: ['Developers'],
    date: 'AUG 13, 2026',
    readTime: '12 min read'
  },
  {
    key: 'ecommerce-security-threat-response-time',
    title: 'E-commerce security: how fast can your store stop threats?',
    description: 'Learn how to reduce the time between detecting and blocking threats by enforcing security policies before traffic reaches the origin.',
    href: 'https://www.azion.com/en/blog/ecommerce-security-threat-response-time/',
    image: 'https://www.azion.com/assets/content/blog/uploads/Ecommerce_BlackFridaydark.png',
    categories: ['Security'],
    date: 'AUG 11, 2026',
    readTime: '10 min read'
  },
  {
    key: 'ai-bot-traffic-types',
    title: 'AI bots explained: Search vs Agent vs Training bots',
    description: 'Learn how to identify Search, Agent, and Training bots, why User-Agent alone is not enough to classify them, and how to build an effective AI bot management policy with Azion Bot Manager.',
    href: 'https://www.azion.com/en/blog/ai-bot-traffic-types/',
    image: 'https://www.azion.com/assets/content/blog/uploads/Botsdark.jpg',
    categories: ['Security'],
    date: 'AUG 5, 2026',
    readTime: '11 min read'
  },
  {
    key: 'llm-inference-cost-distributed-architecture-2026',
    title: 'Distributed AI inference: cut latency 75%, keep your model',
    description: 'LLM inference cost is a model problem and an architecture problem. Centralized inference adds 100–180ms of network latency per request and forces over-provisioning to maintain p95. Learn how distributed execution cuts inference origin load by up to 60% and global p50 latency by 75%.',
    href: 'https://www.azion.com/en/blog/llm-inference-cost-distributed-architecture-2026/',
    image: 'https://www.azion.com/assets/edge-computing.png',
    categories: ['Developers', 'Routing & Networking', 'Serverless'],
    date: 'AUG 3, 2026',
    readTime: '11 min read'
  },
  {
    key: 'vlm-domain-adaptation-for-fraud-detection',
    title: 'VLM Domain Adaptation with LoRa for Fraud Detection',
    description: 'Learn how AI Inference, along with domain adaptation techniques like LoRa, can be leveraged to deploy AI models optimized for specific fraud scenarios, ensuring real-time detection and prevention capabilities.',
    href: 'https://www.azion.com/en/blog/vlm-domain-adaptation-for-fraud-detection/',
    image: 'https://www.azion.com/assets/content/blog/uploads/launch-week-edge-ai/edge-ai-blogpost-dark.png',
    categories: ['Developers'],
    date: 'AUG 2, 2026',
    readTime: '10 min read'
  },
  {
    key: 'enumeration-attacks-exposed-identifiers-security',
    title: 'Enumeration Attacks: How Exposed Identifiers Enable Abuse',
    description: 'Why enumeration attacks remain a blind spot in modern security strategies, and how exposed identifiers trigger failures that traditional monitoring misses. A critical analysis of detection gaps and practical defenses.',
    href: 'https://www.azion.com/en/blog/enumeration-attacks-exposed-identifiers-security/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbblogfivecybersecuritytrends2023.png',
    categories: ['Security'],
    date: 'JUL 29, 2026',
    readTime: '12 min read'
  },
  {
    key: 'cold-starts-killing-ai-application-performance',
    title: 'Eliminating cold starts in AI and serverless applications',
    description: 'Serverless cold starts add 200ms to over 1 second of latency to affected requests and compound inside AI inference pipelines that chain multiple function calls. Learn what causes cold starts, why they are especially damaging for AI workloads, and what architectures eliminate them entirely.',
    href: 'https://www.azion.com/en/blog/cold-starts-killing-ai-application-performance/',
    image: 'https://www.azion.com/assets/100-uptimedark.png',
    categories: ['Serverless', 'Market Trends'],
    date: 'JUL 28, 2026',
    readTime: '11 min read'
  },
  {
    key: 'digital-sovereignty-ai-inference',
    title: 'Digital Sovereignty and AI: Why Where Inference Happens Matters',
    description: 'Discover why inference location is a strategic architectural decision for AI applications. Learn how to reduce provider dependency, strengthen governance, meet regulatory requirements, and build resilient AI workloads with distributed inference.',
    href: 'https://www.azion.com/en/blog/digital-sovereignty-ai-inference/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog_440x343px_livemap.png',
    categories: ['Market Trends'],
    date: 'JUL 24, 2026',
    readTime: '12 min read'
  },
  {
    key: 'dns-security-hijacking-flooding-tunneling-explained',
    title: 'How to Protect Your DNS Against Hijacking, Flooding, and Tunneling',
    description: 'DNS hijacking redirects users to attacker infrastructure with a valid TLS cert. DNS flooding takes a domain offline without touching the app. DNS tunneling exfiltrates data through port 53 past most firewalls. Learn how each attack works and the specific defenses that stop them.',
    href: 'https://www.azion.com/en/blog/dns-security-hijacking-flooding-tunneling-explained/',
    image: 'https://www.azion.com/assets/protection.png',
    categories: ['Security', 'Developers'],
    date: 'JUL 21, 2026',
    readTime: '11 min read'
  },
  {
    key: 'identify-io-bottlenecks-cicd-pipelines',
    title: 'How to Identify I/O Bottlenecks in CI/CD Pipelines',
    description: 'Understand the difference between CPU-bound and I/O-bound workloads in CI/CD pipelines, interpret performance metrics, and apply techniques such as parallel uploads and S3-based storage to dramatically reduce deployment time.',
    href: 'https://www.azion.com/en/blog/identify-io-bottlenecks-cicd-pipelines/',
    image: 'https://www.azion.com/assets/content/blog/uploads/CLI_keyillustration3%201.jpg',
    categories: ['Developers'],
    date: 'JUL 20, 2026',
    readTime: '7 min read'
  },
  {
    key: 'tokens-vs-compute',
    title: 'Why Tokens Are the Wrong Meter for AI Inference Pricing',
    description: 'AI inference pricing based on tokens complicates forecasting and model comparisons. See why requests and GB-hours offer a clearer compute-based alternative.',
    href: 'https://www.azion.com/en/blog/tokens-vs-compute/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog_440x343px_livemap.png',
    categories: ['AI'],
    date: 'JUL 14, 2026',
    readTime: '13 min read'
  },
  {
    key: 'post-quantum-cryptography-us-executive-order',
    title: 'What the U.S. Executive Order Means for Post-Quantum Cryptography',
    description: 'Executive Order 14412 establishes a roadmap for post-quantum cryptography adoption by 2030. Learn how it impacts global businesses, the risks of Harvest Now, Decrypt Later attacks, and the first steps toward PQC readiness.',
    href: 'https://www.azion.com/en/blog/post-quantum-cryptography-us-executive-order/',
    image: 'https://www.azion.com/assets/content/blog/uploads/kv-webinar-securityrisk%201.png',
    categories: ['Security'],
    date: 'JUL 14, 2026',
    readTime: '10 min read'
  },
  {
    key: 'ai-agents-hitting-your-api-what-breaks-first',
    title: 'API Security for AI Agents: Rate Limits, Auth, and Observability',
    description: 'AI agent traffic bypasses per-IP rate limits, breaks human-redirect auth flows, causes retry loops from malformed status codes, and produces traffic patterns no standard dashboard surfaces. Learn the five fixes that cover agent traffic without disrupting human users or legitimate integrations.',
    href: 'https://www.azion.com/en/blog/ai-agents-hitting-your-api-what-breaks-first/',
    image: 'https://www.azion.com/assets/apidark.png',
    categories: ['Security', 'Developers'],
    date: 'JUL 14, 2026',
    readTime: '13 min read'
  },
  {
    key: 'unified-waf-bot-ddos-protection-closes-gaps-coordinated-attacks-exploit',
    title: 'WAF, Bot, and DDoS Security: The Case for a Shared Control Plane',
    description: 'Fragmented WAF, bot, and DDoS stacks add 30–50 minutes to incident investigation, create policy drift across three consoles, and leave seams that coordinated attacks are built to exploit. Learn what a unified security architecture changes — and how to make the consolidation case to finance.',
    href: 'https://www.azion.com/en/blog/unified-waf-bot-ddos-protection-closes-gaps-coordinated-attacks-exploit/',
    image: 'https://www.azion.com/assets/azion-productsdark.png',
    categories: ['Security'],
    date: 'JUL 7, 2026',
    readTime: '12 min read'
  },
  {
    key: 'cloud-egress-costs-2026-why-the-math-stopped-working',
    title: 'Cloud Egress Costs in 2026: Why the Math Stopped Working',
    description: 'Cloud egress costs are compounding for most teams even though per-GB prices haven\'t changed. Learn how to calculate your egress cost per user, identify the stateless/stateful split, and reduce cloud bandwidth spend by 60–80% without rebuilding your architecture.',
    href: 'https://www.azion.com/en/blog/cloud-egress-costs-2026-why-the-math-stopped-working/',
    image: 'https://www.azion.com/assets/cloud-test-1.png',
    categories: ['Market Trends', 'Serverless'],
    date: 'JUL 6, 2026',
    readTime: '10 min read'
  },
  {
    key: 'api-security-beyond-the-waf',
    title: 'API Security Beyond the WAF',
    description: 'Discover the limitations of WAF-only API protection and how a layered security architecture combining API Gateway controls, bot mitigation, DDoS protection, rate limiting, and observability improves security and operational visibility.',
    href: 'https://www.azion.com/en/blog/api-security-beyond-the-waf/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumblinkedin-7perguntaswaf-1280x720px.png',
    categories: ['Security'],
    date: 'JUN 19, 2026',
    readTime: '9 min read'
  },
  {
    key: 'malicious-automation-defense-ai-inference',
    title: 'Malicious Automation Defense with AI Inference',
    description: 'Discover how malicious automation defense combines AI Inference, bot management, programmable security controls, and real-time observability to identify, classify, and respond to automated abuse earlier in the request lifecycle.',
    href: 'https://www.azion.com/en/blog/malicious-automation-defense-ai-inference/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog_440x343px_livemap.png',
    categories: ['Security'],
    date: 'JUN 19, 2026',
    readTime: '7 min read'
  },
  {
    key: 'how-a-unified-waap-platform-reduces-soc-risk',
    title: 'Why a Unified WAAP Platform Reduces SOC Risk',
    description: 'Discover how unified WAAP platforms help security teams investigate threats faster, reduce operational complexity, and improve visibility across WAF, DDoS protection, bot mitigation, and API security.',
    href: 'https://www.azion.com/en/blog/how-a-unified-waap-platform-reduces-soc-risk/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbblogfivecybersecuritytrends2023-1.png',
    categories: ['Security'],
    date: 'JUN 17, 2026',
    readTime: '10 min read'
  },
  {
    key: 'how-to-mitigate-ddos-attacks-and-protect-applications-with-waf',
    title: 'DDoS Mitigation and WAF Protection Without Performance Loss',
    description: 'Understand how hairpinning, backhauling, and centralized scrubbing centers affect application performance and discover how distributed architectures mitigate DDoS attacks and enforce WAF policies without adding latency.',
    href: 'https://www.azion.com/en/blog/how-to-mitigate-ddos-attacks-and-protect-applications-with-waf/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumblinkedin-whatiswaf-1280x720px.png',
    categories: ['Security'],
    date: 'JUN 12, 2026',
    readTime: '8 min read'
  },
  {
    key: 'how-mtls-strengthens-api-security',
    title: 'How mTLS Secures APIs, Apps, and B2B Integrations',
    description: 'Learn how it helps organizations implement Zero Trust architectures, secure Open Banking environments, reduce unauthorized access risks, and simplify identity management at scale.',
    href: 'https://www.azion.com/en/blog/how-mtls-strengthens-api-security/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbblogzerotrustjourney-planning.png',
    categories: ['Security'],
    date: 'JUN 11, 2026',
    readTime: '8 min read'
  },
  {
    key: 'compare-centralized-cloud-and-serverless-edge',
    title: 'Total Cost of Ownership: Centralized Cloud vs Serverless Edge',
    description: 'Compare the total cost of ownership (TCO) of centralized cloud and serverless edge architectures. Explore how infrastructure, operational overhead, and development effort impact long-term cloud economics.',
    href: 'https://www.azion.com/en/blog/compare-centralized-cloud-and-serverless-edge/',
    image: 'https://www.azion.com/assets/content/blog/uploads/edgecomputingcloudcomputing_thumblinkedin_1280x720px.png',
    categories: ['Serverless'],
    date: 'JUN 1, 2026',
    readTime: '11 min read'
  },
  {
    key: 'azion-leader-g2-summer-reports-2026',
    title: 'Azion Leader in CDN & High Performer - G2 Summer 2026',
    description: 'Azion earned recognition across nine categories in the G2 Summer 2026 Reports, including Leader in Content Delivery Network (CDN) and High Performer in Web Security, Cloud Security, Load Balancing, DDoS Protection, Bot Detection and Mitigation, WAF, SSL & TLS Certificate Tools, and API Security Tools.',
    href: 'https://www.azion.com/en/blog/azion-leader-g2-summer-reports-2026/',
    image: 'https://www.azion.com/assets/g2-leaders-badget-linkedin-formato-1-91-1-horizontal-3.png',
    categories: ['Company News', 'Market Trends'],
    date: 'MAY 26, 2026',
    readTime: '5 min read'
  },
  {
    key: 'azion-console-data-layer-rebuild',
    title: 'Rebuilding the Azion Console Data Layer for Faster Navigation',
    description: 'Learn how Azion rebuilt the Console data layer to improve navigation consistency and reduce unnecessary reloads — covering cache hydration, persistence, and cross-tab synchronization patterns for large-scale SPAs.',
    href: 'https://www.azion.com/en/blog/azion-console-data-layer-rebuild/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog_440x343px_livemap.png',
    categories: ['Developers'],
    date: 'MAY 25, 2026',
    readTime: '10 min read'
  },
  {
    key: 'azion-cli-static-uploads-90-percent-faster',
    title: 'Faster Deploys Across Azion Console and CLI: 90% Less Upload Time',
    description: 'Learn how Azion accelerated application deploys across the Console and CLI with S3-based uploads and dynamic parallelism, reducing static file upload times by 73% in the Console and up to 90% in CLI 4.21+.',
    href: 'https://www.azion.com/en/blog/azion-cli-static-uploads-90-percent-faster/',
    image: 'https://www.azion.com/assets/cli-keyillustration3-1.png',
    categories: ['Developers', 'Company News'],
    date: 'MAY 6, 2026',
    readTime: '6 min read'
  },
  {
    key: 'why-azion-is-migrating-to-individual-npm-packages-distributed-monorepo',
    title: 'Why Azion Moved to Individual npm Packages in a Monorepo',
    description: 'Learn why Azion is moving from a monolithic library to individual npm packages in a distributed monorepo, improving versioning, performance, security, CI/CD, tree-shaking, and developer experience.',
    href: 'https://www.azion.com/en/blog/why-azion-is-migrating-to-individual-npm-packages-distributed-monorepo/',
    image: 'https://www.azion.com/assets/monolithic-vs-microservicesdark.png',
    categories: ['Developers'],
    date: 'MAY 4, 2026',
    readTime: '8 min read'
  },
  {
    key: 'pqc-quantum-cryptography',
    title: 'Post-Quantum Cryptography: How Azion Protects Your Data',
    description: 'Discover how post-quantum cryptography (PQC) protects against future quantum threats and how Azion already delivers quantum-safe security in production with minimal performance impact.',
    href: 'https://www.azion.com/en/blog/pqc-quantum-cryptography/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbblogfivecybersecuritytrends2023.png',
    categories: ['Security'],
    date: 'APR 27, 2026',
    readTime: '6 min read'
  },
  {
    key: 'terraform-provider-v4-ai-powered',
    title: 'Azion Terraform Provider v4: AI-Powered Infrastructure as Code',
    description: 'Discover how Azion Terraform Provider v4 revolutionizes Infrastructure as Code with AI-driven automation, eliminating provider lag and delivering Day-0 support for all APIs. Learn about our design-first pipeline that keeps your infrastructure in perfect sync. ',
    href: 'https://www.azion.com/en/blog/terraform-provider-v4-ai-powered/',
    image: 'https://www.azion.com/assets/content/blog/uploads/terraform/terraformcover.png',
    categories: ['Developers'],
    date: 'APR 16, 2026',
    readTime: '5 min read'
  },
  {
    key: 'azion-leader-g2-spring-reports-2026',
    title: 'Azion Named Leader in G2 Spring 2026 Reports',
    description: 'In the G2 Spring 2026 Reports, Azion earned Leader rankings in Content Delivery Network (CDN), Web Security, and DDoS Protection, along with High Performer recognition in Cloud Security, API Security Tools, SSL & TLS Certificate Tools, and top placements for WAF and Bot Detection across Enterprise and Product grids.',
    href: 'https://www.azion.com/en/blog/azion-leader-g2-spring-reports-2026/',
    image: 'https://www.azion.com/assets/content/blog/uploads/g2spring/G2spring.jpg',
    categories: ['Company News', 'Market Trends'],
    date: 'MAR 17, 2026',
    readTime: '5 min read'
  },
  {
    key: 'best-ddos-protection-2026-azion-vs-cloudflare-akamai-aws-fastly-imperva',
    title: 'Best DDoS Protection 2026: Azion vs. Cloudflare & More',
    description: 'DDoS attacks now routinely combine volumetric floods (L3/L4) with application-layer attacks (L7) and DNS disruption. The “best” DDoS protection isn’t a universal winner—it’s the provider whose documented capabilities and commercial terms match your risk profile, architecture, and uptime requirements.',
    href: 'https://www.azion.com/en/blog/best-ddos-protection-2026-azion-vs-cloudflare-akamai-aws-fastly-imperva/',
    image: 'https://www.azion.com/assets/content/blog/uploads/ddos-compare/Screenshot%202026-03-10%20at%2011.51.09.png',
    categories: ['Developers', 'Market Trends', 'Security'],
    date: 'MAR 10, 2026',
    readTime: '6 min read'
  },
  {
    key: 'invisible-tax-of-latency',
    title: 'The Invisible Tax of Latency: How Small Delays Cost Millions',
    description: 'Learn how tail latency during high-traffic events silently reduces e-commerce conversion rates and why distributed infrastructure is critical to protect checkout performance and revenue.',
    href: 'https://www.azion.com/en/blog/invisible-tax-of-latency/',
    image: 'https://www.azion.com/assets/content/blog/uploads/latency.png',
    categories: ['Developers'],
    date: 'MAR 9, 2026',
    readTime: '11 min read'
  },
  {
    key: 'prevent-checkout-failures-high-traffic-ecommerce-events',
    title: 'How to Prevent Checkout Failures in High-Traffic Events',
    description: 'Learn how to prevent checkout failures during high-traffic events like Black Friday. Discover how distributed architecture protects revenue, stabilizes performance, and eliminates backend overload.',
    href: 'https://www.azion.com/en/blog/prevent-checkout-failures-high-traffic-ecommerce-events/',
    image: 'https://www.azion.com/assets/content/blog/uploads/transformtheonlineshopping_2022_blogpost_v2.png',
    categories: ['Developers'],
    date: 'MAR 3, 2026',
    readTime: '7 min read'
  },
  {
    key: 'why-traditional-caching-fails-ecommerce',
    title: 'Why Traditional Caching Fails When Customers Want to Buy',
    description: 'Discover why traditional caching strategies fail during high-traffic commerce events and how programmable caching on distributed infrastructure improves checkout performance, reduces latency, and protects revenue during critical buying moments.',
    href: 'https://www.azion.com/en/blog/why-traditional-caching-fails-ecommerce/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-4templatesimproveexperience-440x343px-1.png',
    categories: ['Developers', 'Caching'],
    date: 'FEB 23, 2026',
    readTime: '9 min read'
  },
  {
    key: 'ai-load-balancing-beyond-round-robin',
    title: 'How AI Improves Load Balancing to Cut p95/p99 Latency',
    description: 'Round-robin isn’t real load balancing. See 9 algorithms plus AI traffic steering to reduce tail latency, isolate slow AZs, and improve global reliability.',
    href: 'https://www.azion.com/en/blog/ai-load-balancing-beyond-round-robin/',
    image: 'https://www.azion.com/assets/content/blog/uploads/load-balancer-ai/load-balancer-ai.png',
    categories: ['Security', 'Developers'],
    date: 'FEB 10, 2026',
    readTime: '26 min read'
  },
  {
    key: 'object-storage-general-availability',
    title: 'Azion Object Storage: how to store and deliver data at global scale',
    description: 'Discover how Azion Object Storage enables global-scale data storage and delivery with low latency, S3 compatibility, and predictable costs, all integrated into a distributed infrastructure for modern workloads.',
    href: 'https://www.azion.com/en/blog/object-storage-general-availability/',
    image: 'https://www.azion.com/assets/content/blog/uploads/storage-image.png',
    categories: ['Developers', 'Caching'],
    date: 'JAN 29, 2026',
    readTime: '8 min read'
  },
  {
    key: 'from-cloud-training-to-global-scale-ai-inference-lora-serverless',
    title: 'Global-Scale AI Inference with LoRA & Serverless GPU',
    description: 'Centralized cloud inference breaks down for generative AI: latency spikes, inconsistent UX, and fragile failover. This article explains how LoRA enables lightweight adaptation and how serverless GPU at the edge (Azion) delivers global-scale, low-latency inference with automation, standardization, and real-time observability.',
    href: 'https://www.azion.com/en/blog/from-cloud-training-to-global-scale-ai-inference-lora-serverless/',
    image: 'https://www.azion.com/assets/content/blog/uploads/cloud-to-lora/cloudtolora.png',
    categories: ['Developers', 'Serverless', 'Market Trends'],
    date: 'JAN 22, 2026',
    readTime: '5 min read'
  },
  {
    key: 'owasp-top-10-2025-programmable',
    title: 'OWASP Top 10:2025 – Move Security to Programmable Infra',
    description: 'OWASP Top 10:2025 shifts AppSec from code-level mistakes to architectural and supply-chain risks. Learn why legacy WAFs fall short and how a programmable infrastructure approach (WAF + Functions + bot and rate controls) mitigates modern threats from access control to zero-days.',
    href: 'https://www.azion.com/en/blog/owasp-top-10-2025-programmable/',
    image: 'https://www.azion.com/assets/content/blog/uploads/owasp-2025/owasp2025.png',
    categories: ['Developers', 'Routing & Networking', 'Security'],
    date: 'JAN 21, 2026',
    readTime: '14 min read'
  },
  {
    key: 'new-templates-solutions-and-support',
    title: 'New AI Templates, E-commerce Tools & Nuxt/SvelteKit Support',
    description: 'Accelerate software delivery with Azion\'s latest platform updates featuring 11 new AI and e-commerce templates, native SSR adapters for Nuxt and SvelteKit, and crucial security/stability improvements. Build high-performance chatbots, fast Shopify stores, and modern SaaS applications at the edge with enhanced control, reduced latency, and faster time-to-market.',
    href: 'https://www.azion.com/en/blog/new-templates-solutions-and-support/',
    image: 'https://www.azion.com/assets/content/blog/og-images/templatesnew.png',
    categories: ['Developers'],
    date: 'DEC 15, 2025',
    readTime: '5 min read'
  },
  {
    key: 'real-time-events-general-availability',
    title: 'Azion Real-Time Events: Observability for Modern Apps',
    description: 'Azion Real-Time Events (RTE) delivers real-time observability with full data access, no sampling, low latency, and flexible querying. Learn how RTE enhances security, performance, and operational efficiency for modern applications.',
    href: 'https://www.azion.com/en/blog/real-time-events-general-availability/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumb-real-time-events.png',
    categories: ['Observability'],
    date: 'DEC 11, 2025',
    readTime: '5 min read'
  },
  {
    key: 'azion-leader-g2-winter-reports-2026',
    title: 'Azion Named a Leader in G2 Winter 2026 Reports',
    description: 'Azion is a Leader in CDN & High Performer in 6 security categories in the G2 Winter 2026 Reports. With 100% user satisfaction, see how our web platform delivers ultra-fast performance & enterprise-grade security. Try free.',
    href: 'https://www.azion.com/en/blog/azion-leader-g2-winter-reports-2026/',
    image: 'https://www.azion.com/assets/content/blog/uploads/g2award/G2Leaders.png',
    categories: ['Company News', 'Market Trends'],
    date: 'DEC 8, 2025',
    readTime: '5 min read'
  },
  {
    key: 'mcp-security-high-performance',
    title: 'Deploying Secure High-Performance MCP Servers for AI',
    description: 'Go beyond the traditional cloud. This guide details how to deploy secure, high-performance MCP servers for real-time AI applications.',
    href: 'https://www.azion.com/en/blog/mcp-security-high-performance/',
    image: 'https://www.azion.com/assets/content/blog/uploads/cloudvsedge/edgecloud.png',
    categories: ['Developers', 'Serverless', 'Market Trends'],
    date: 'DEC 1, 2025',
    readTime: '21 min read'
  },
  {
    key: 'cloud-cost-reduction-with-distributed-architecture',
    title: 'How Azion Cuts Cloud Bills and Slashes Egress Costs',
    description: 'Learn how distributed architectures dramatically reduce egress, latency, and observability costs by moving compute, caching, and compression closer to users. This article combines benchmarks, real-world transformations, and practical patterns to show how Azion helps teams optimize traffic, lower TCO, and build faster, more efficient applications.',
    href: 'https://www.azion.com/en/blog/cloud-cost-reduction-with-distributed-architecture/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog_wasm.png',
    categories: ['Routing & Networking', 'Caching', 'Serverless', 'Security', 'Observability'],
    date: 'NOV 17, 2025',
    readTime: '10 min read'
  },
  {
    key: 'distributed-object-storage-economics',
    title: 'How Distributed Object Storage Rewrites Cloud Economics',
    description: 'How distributed storage changes the physics of delivery — slashing egress and replication fees, offloading origin compute, and turning unpredictable cloud bills into predictable,',
    href: 'https://www.azion.com/en/blog/distributed-object-storage-economics/',
    image: 'https://www.azion.com/assets/content/blog/og-images/og-default.png',
    categories: ['Serverless', 'Developers'],
    date: 'NOV 17, 2025',
    readTime: '8 min read'
  },
  {
    key: 'reduce-egress-with-distributed-finops',
    title: 'The Hidden Cloud Tax: How Distributed Web Rewrites FinOps',
    description: 'Learn how moving compute and assets closer to users via a distributed architecture can reduce cloud egress by up to 80% and backend compute by 60%. This article explores the concept of "computational gravity" and provides a technical roadmap for shifting FinOps from reactive cost management to an architectural discipline for predictable TCO and competitive advantage.',
    href: 'https://www.azion.com/en/blog/reduce-egress-with-distributed-finops/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog_440x343px_livemap.png',
    categories: ['Caching', 'Serverless'],
    date: 'NOV 17, 2025',
    readTime: '8 min read'
  },
  {
    key: 'descentralized-evolution-latin-america',
    title: 'How Latin America Can Close the Digital Gap',
    description: 'Bridge Latin America\'s Digital Divide with Decentralized Infrastructure. Learn how it cuts latency, costs, and enables vital digital services.',
    href: 'https://www.azion.com/en/blog/descentralized-evolution-latin-america/',
    image: 'https://www.azion.com/assets/content/blog/uploads/bridge-gap-latin-america/bridge-gap-latin-america.png',
    categories: ['Developers', 'Routing & Networking'],
    date: 'NOV 3, 2025',
    readTime: '10 min read'
  },
  {
    key: 'implement-hsts-application',
    title: 'How to Implement HSTS and CSP at the Edge with Azion Applications',
    description: 'Practical guide to apply HSTS and Content Security Policy (CSP) at the edge using Azion. Step by step with Rules Engine examples, rollout checklist, monitoring, and before/after metrics to improve security and reduce downgrade, MITM, and XSS risks.',
    href: 'https://www.azion.com/en/blog/implement-hsts-application/',
    image: 'https://www.azion.com/assets/content/blog/uploads/api_shield_thumbnail_blog.png',
    categories: ['Developers'],
    date: 'SEP 9, 2025',
    readTime: '7 min read'
  },
  {
    key: 'introducing-api-v4',
    title: 'Introducing Workloads, Edge Connector, Custom Pages, and API v4',
    description: 'Discover Azion\'s latest innovations: Workloads, Edge Connector, and Custom Pages, along with API v4 - a platform change that transforms how you develop and scale applications at the edge.',
    href: 'https://www.azion.com/en/blog/introducing-api-v4/',
    image: 'https://www.azion.com/assets/content/blog/og-images/api-v4-og-image.svg',
    categories: ['Company News'],
    date: 'AUG 5, 2025',
    readTime: '4 min read'
  },
  {
    key: 'azion-vs-akamai-performance-advantage',
    title: 'Why Azion\'s 280% Performance Beats Fastly & Akamai',
    description: 'Fastly celebrates 57% TTFB improvements over Akamai while enterprises migrating to Azion achieve 280%. Discover why CDN comparisons have become obsolete and how modern web platforms are delivering 5x performance gains with real enterprise transformations.',
    href: 'https://www.azion.com/en/blog/azion-vs-akamai-performance-advantage/',
    image: 'https://www.azion.com/assets/content/blog/og-images/cdn-wars-thumbnail.svg',
    categories: ['Developers'],
    date: 'JUL 25, 2025',
    readTime: '13 min read'
  },
  {
    key: 'how-to-mitigate-vendor-outages',
    title: 'Building Resilient Applications: How to Mitigate Vendor Outages',
    description: 'Strategies to build resilient applications and mitigate the risks of vendor outages with end-to-end infrastructure and high availability.',
    href: 'https://www.azion.com/en/blog/how-to-mitigate-vendor-outages/',
    image: 'https://www.azion.com/assets/content/blog/uploads/api_shield_thumbnail_blog.png',
    categories: ['Security'],
    date: 'JUL 4, 2025',
    readTime: '12 min read'
  },
  {
    key: 'product-launch-h1-2025',
    title: 'Azion\'s Product Launch Week - May 2025',
    description: 'Azion announces a series of product launches and enhancements to its web platform.',
    href: 'https://www.azion.com/en/blog/product-launch-h1-2025/',
    image: 'https://www.azion.com/assets/content/blog/uploads/cloudtoedge.png',
    categories: ['Company News'],
    date: 'MAY 7, 2025',
    readTime: '10 min read'
  },
  {
    key: 'launch-week-developer-experience',
    title: 'What\'s New in Azion Dev Tools and Platform',
    description: 'Azion just launched new developer experience enhancements: cross-platform CLI, faster Bundler 5.1, Git templates with CI/CD, azion.app domain for applications, expanded integrations, and the powerful API v4.',
    href: 'https://www.azion.com/en/blog/launch-week-developer-experience/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-codeeditor-chatgpt-440x343px.png',
    categories: ['Developers'],
    date: 'MAY 7, 2025',
    readTime: '7 min read'
  },
  {
    key: 'launch-week-build-and-scale',
    title: 'Build and Scale Your Web Applications Right at the Data Source',
    description: 'Modern businesses demand new ways to build, secure, and scale applications. Azion is at the forefront of this compute technology with its suite of products: Edge Functions, Edge SQL, and Edge Storage.',
    href: 'https://www.azion.com/en/blog/launch-week-build-and-scale/',
    image: 'https://www.azion.com/assets/content/blog/uploads/launch-week-compute/build-and-scale-dark.png',
    categories: ['Developers'],
    date: 'MAY 6, 2025',
    readTime: '5 min read'
  },
  {
    key: 'introducing-edge-ai',
    title: 'Introducing Azion AI Inference for Scalable AI Solutions',
    description: 'AI Inference combines artificial intelligence with edge computing, allowing AI models to run directly on Azion\'s infrastructure—close to data sources and users—rather than in distant cloud data centers.',
    href: 'https://www.azion.com/en/blog/introducing-edge-ai/',
    image: 'https://www.azion.com/assets/content/blog/uploads/launch-week-edge-ai/edge-ai-blogpost-dark.png',
    categories: ['Company News'],
    date: 'MAY 5, 2025',
    readTime: '5 min read'
  },
  {
    key: 'polyfills-for-edge-compatibility',
    title: 'Using Polyfills to Bridge Gaps in Serverless Edge Environments',
    description: 'Polyfills ensure compatibility across serverless edge environments, enabling developers to use modern web features without sacrificing functionality.',
    href: 'https://www.azion.com/en/blog/polyfills-for-edge-compatibility/',
    image: 'https://www.azion.com/assets/content/blog/uploads/azion-cells-technical-approach-and-the-future-of-serverless-computing.png',
    categories: ['Developers'],
    date: 'MAR 7, 2025',
    readTime: '6 min read'
  },
  {
    key: 'building-modern-serverless-runtimes',
    title: 'Building Modern Serverless Runtimes',
    description: 'Discover how modern serverless runtimes built with Rust and V8 isolates outperform Node.js in performance and security, delivering faster execution times and enhanced memory safety through memory-safe architecture.',
    href: 'https://www.azion.com/en/blog/building-modern-serverless-runtimes/',
    image: 'https://www.azion.com/assets/content/blog/uploads/7-the-next-generation-in-serverless-compute-azion-cells-1.png',
    categories: ['Developers'],
    date: 'FEB 7, 2025',
    readTime: '8 min read'
  },
  {
    key: 'how-technology-can-help-comply-with-regulations-for-fintech',
    title: 'How Technology Can Help You Comply with Regulations for Fintech',
    description: 'Edge computing provides robust security, regulatory compliance, and intelligent monitoring for reliable, scalable operations.',
    href: 'https://www.azion.com/en/blog/how-technology-can-help-comply-with-regulations-for-fintech/',
    image: 'https://www.azion.com/assets/content/blog/uploads/regulacionmexicana_thumblinkedin_440x343px.png',
    categories: ['Security'],
    date: 'FEB 6, 2025',
    readTime: '8 min read'
  },
  {
    key: 'boost-software-quality-with-azion-cli-local-dev',
    title: 'Boost Software Quality: Local Development with Azion CLI',
    description: 'Master Edge Functions with Azion CLI for local development and testing. Enhance software security, optimize performance, and streamline debugging.',
    href: 'https://www.azion.com/en/blog/boost-software-quality-with-azion-cli-local-dev/',
    image: 'https://www.azion.com/assets/content/blog/uploads/local-dev.png',
    categories: ['Developers'],
    date: 'APR 19, 2024',
    readTime: '8 min read'
  },
  {
    key: 'console-kit-building-a-new-interface',
    title: 'Azion Console Kit: Building a new interface',
    description: 'Explore the Azion Console Kit, enhancing user interface for Edge Computing with innovative Azion Blocks and open source toolkits for robust app development.',
    href: 'https://www.azion.com/en/blog/console-kit-building-a-new-interface/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-codeeditor-chatgpt-440x343px.png',
    categories: ['Developers'],
    date: 'FEB 21, 2024',
    readTime: '6 min read'
  },
  {
    key: 'the-experts-speak-cybersecurity-quotes-about-zero-trust-waf-social-engineering',
    title: 'Experts Speak: Cybersecurity Quotes on Zero-Trust & WAF',
    description: 'Explore expert insights on cybersecurity, Zero Trust, social engineering, and WAF capabilities at Azion Edge.',
    href: 'https://www.azion.com/en/blog/the-experts-speak-cybersecurity-quotes-about-zero-trust-waf-social-engineering/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbblog-whatiswaf-440x343px-1.png',
    categories: ['Security'],
    date: 'FEB 1, 2024',
    readTime: '7 min read'
  },
  {
    key: 'azion-new-set-templates-dev',
    title: 'Leverage Edge Computing with Azion\'s New Templates',
    description: 'Discover Azion\'s Edge Computing templates to enhance web app development, streamline deployment, and optimize performance with tools like MongoDB, Hexo, and Fauna.',
    href: 'https://www.azion.com/en/blog/azion-new-set-templates-dev/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-4templatesimproveexperience-440x343px-1.png',
    categories: ['Company News'],
    date: 'JAN 29, 2024',
    readTime: '5 min read'
  },
  {
    key: 'azion-celebrates-achievements-2023',
    title: 'Azion Celebrates a 2023 Full of Achievements',
    description: 'Discover how Azion\'s accolades like the Frost & Sullivan Award and Great Place to Work recognition affirm its edge computing superiority in 2023.',
    href: 'https://www.azion.com/en/blog/azion-celebrates-achievements-2023/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-2023-conquistas-440x343px.png',
    categories: ['Company News'],
    date: 'DEC 21, 2023',
    readTime: '6 min read'
  },
  {
    key: 'azion-recognized-strong-performer-forrester-wave-2023',
    title: 'Forrester Names Azion a Strong Performer in Edge Dev',
    description: 'Discover why Azion is a strong performer in The Forrester Wave™ for Edge Development Platforms in Q4 2023, enhancing enterprise edge solutions.',
    href: 'https://www.azion.com/en/blog/azion-recognized-strong-performer-forrester-wave-2023/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-forrester-wave2023-440x343px.png',
    categories: ['Company News'],
    date: 'DEC 1, 2023',
    readTime: '3 min read'
  },
  {
    key: 'azion-awarded-at-santander-x-global-challenge',
    title: 'Azion Wins Award at Santander X Global Challenge',
    description: 'Azion wins at Santander X Global Challenge for innovative cybersecurity solutions, enhancing global security capabilities and fostering industry connections.',
    href: 'https://www.azion.com/en/blog/azion-awarded-at-santander-x-global-challenge/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-premio-santander-440x343px.png',
    categories: ['Company News'],
    date: 'NOV 29, 2023',
    readTime: '2 min read'
  },
  {
    key: 'remember-zero-day-attacks-blocked-by-azion-waf',
    title: 'Remember Zero-Day Attacks Blocked by Azion\'s WAF',
    description: 'Explore how Azion\'s Web Application Firewall provides robust defense against zero-day attacks, CVE-2021-41773 coverage, and WAF bypass prevention.',
    href: 'https://www.azion.com/en/blog/remember-zero-day-attacks-blocked-by-azion-waf/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-zero-day-waf-440x343px.png',
    categories: ['Security'],
    date: 'NOV 6, 2023',
    readTime: '4 min read'
  },
  {
    key: 'azion-frost-sullivan-award',
    title: 'Azion Earns Frost & Sullivan 2023 Innovation Award',
    description: 'Discover Azion\'s award-winning Edge Serverless platform, boosting developers\' capabilities in building rapid, resilient applications with superior performance and global scalability.',
    href: 'https://www.azion.com/en/blog/azion-frost-sullivan-award/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-f-s-440x343px-1.png',
    categories: ['Company News'],
    date: 'OCT 25, 2023',
    readTime: '3 min read'
  },
  {
    key: 'next-level-development-efficiency-azion-edge-functions',
    title: 'Azion Code Editor Adds ChatGPT Assistant for Faster Dev',
    description: 'Discover how Azion Edge Functions with ChatGPT Code Assistant and Preview Deployment revolutionize developer experience and agile development.',
    href: 'https://www.azion.com/en/blog/next-level-development-efficiency-azion-edge-functions/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-codeeditor-chatgpt-440x343px.png',
    categories: ['Developers'],
    date: 'OCT 23, 2023',
    readTime: '7 min read'
  },
  {
    key: 'fair-share-internet-toll',
    title: 'Fair Share or Network Fee: Pros and Cons of the Model',
    description: 'Explore the impact of Fair Share and network neutrality on digital infrastructure and the implications for major internet players and service quality.',
    href: 'https://www.azion.com/en/blog/fair-share-internet-toll/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-fairshare-440x343px.png',
    categories: ['Developers'],
    date: 'OCT 19, 2023',
    readTime: '12 min read'
  },
  {
    key: 'azion-named-leader-fast-mover-gigaom-report',
    title: 'Azion Named Leader & Fast Mover in GigaOm Radar',
    description: 'Azion hailed as a Leader and Fast Mover in the GigaOm Radar for Edge Platforms, emphasizing robust security and innovative edge computing solutions.',
    href: 'https://www.azion.com/en/blog/azion-named-leader-fast-mover-gigaom-report/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-gigaom-440x343px-1.png',
    categories: ['Company News'],
    date: 'AUG 29, 2023',
    readTime: '2 min read'
  },
  {
    key: 'control-access-to-your-platform-with-scheduled-blocking-function',
    title: 'Control Access to Your Platform With Scheduled Blocking Function',
    description: 'Discover how Azion\'s Scheduled Blocking function enhances application access control. Learn to implement time-based access solutions with edge functions.',
    href: 'https://www.azion.com/en/blog/control-access-to-your-platform-with-scheduled-blocking-function/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog_440x343px-2x.png',
    categories: ['Security'],
    date: 'JUN 21, 2023',
    readTime: '9 min read'
  },
  {
    key: 'protect-your-application-from-session-theft-with-azion',
    title: 'Protect Your Application From Session Theft With Azion',
    description: 'Protect your applications from cookie tampering attacks with Azion\'s Signed Cookies solution. Learn how to secure your edge applications now!',
    href: 'https://www.azion.com/en/blog/protect-your-application-from-session-theft-with-azion/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog.png',
    categories: ['Security'],
    date: 'JUN 21, 2023',
    readTime: '10 min read'
  },
  {
    key: 'azion-announces-solution-that-blocks-oversized-requests',
    title: 'Azion Announces Solution That Blocks Oversized Requests',
    description: 'Explore the Azion Marketplace for the Limit Payload Size solution to enhance application efficiency and secure data transfers with Edge Functions.',
    href: 'https://www.azion.com/en/blog/azion-announces-solution-that-blocks-oversized-requests/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbblog-limitpayloadsize.png',
    categories: ['Security'],
    date: 'MAY 29, 2023',
    readTime: '4 min read'
  },
  {
    key: 'azion-waf-not-affected-crlf-bypass',
    title: 'Azion\'s WAF Is Not Vulnerable to the CRLF Injection Bypass',
    description: 'Discover how Azion\'s Web Application Firewall (WAF) excels in preventing CRLF injection attacks and other cybersecurity threats, safeguarding web applications effectively.',
    href: 'https://www.azion.com/en/blog/azion-waf-not-affected-crlf-bypass/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbblogwaf-bypassakamai-2.png',
    categories: ['Security'],
    date: 'MAR 23, 2023',
    readTime: '6 min read'
  },
  {
    key: 'five-cases-of-it-transformation-with-edge-computing',
    title: 'Five Cases of IT Transformation with Edge Computing',
    description: 'Discover the transformative power of Edge Computing through success stories from diverse sectors. Explore its impacts on cost reduction, application performance, and user experience.',
    href: 'https://www.azion.com/en/blog/five-cases-of-it-transformation-with-edge-computing/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbblog-5truestories-mobile.png',
    categories: ['Developers'],
    date: 'FEB 15, 2023',
    readTime: '17 min read'
  },
  {
    key: 'how-justa-has-been-evolving-its-technology-to-meet-modern-digital-demands',
    title: 'How Justa Evolves Its Tech to Meet Modern Digital Demands',
    description: 'Explore how Justa enhances payment security and simplifies compliance using Azion\'s Edge solutions, improving performance and customer experience in Brazil.',
    href: 'https://www.azion.com/en/blog/how-justa-has-been-evolving-its-technology-to-meet-modern-digital-demands/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog_justa_440x343px.png',
    categories: ['Company News'],
    date: 'JAN 17, 2023',
    readTime: '4 min read'
  },
  {
    key: 'recent-waf-bypass-attack-does-not-affect-azion-web-application-firewall',
    title: 'Recent WAF Bypass Attack Doesn\'t Affect Azion\'s WAF',
    description: 'Discover how Azion\'s Web Application Firewall seamlessly blocks new SQL injection attacks using JSON syntax, ensuring robust cloud security.',
    href: 'https://www.azion.com/en/blog/recent-waf-bypass-attack-does-not-affect-azion-web-application-firewall/',
    image: 'https://www.azion.com/assets/content/blog/uploads/vulnerabilidadewaf_thumblinkedin_440x343px.png',
    categories: ['Security'],
    date: 'DEC 20, 2022',
    readTime: '5 min read'
  },
  {
    key: 'cloud-computing-or-edge-computing-cost',
    title: 'Cloud Computing or Edge Computing: Cost Comparison',
    description: 'Explore the cost benefits of Edge Computing vs. cloud computing, learn about infrastructure savings, and how Edge enhances operational efficiency.',
    href: 'https://www.azion.com/en/blog/cloud-computing-or-edge-computing-cost/',
    image: 'https://www.azion.com/assets/content/blog/uploads/edgecomputingcloudcomputing_thumblinkedin_440x343px.png',
    categories: ['Developers'],
    date: 'DEC 19, 2022',
    readTime: '6 min read'
  },
  {
    key: 'announcing-graphql-for-increased-observability',
    title: 'Azion Announces GraphQL API to Increase Observability',
    description: 'Explore Azion\'s GraphQL API for real-time metrics and enhanced data observability, featuring improved performance and cost savings. Learn to access advanced security data and performance insights.',
    href: 'https://www.azion.com/en/blog/announcing-graphql-for-increased-observability/',
    image: 'https://www.azion.com/assets/content/blog/uploads/graphql_metrics_api_thumblinkedin_440x343px.png',
    categories: ['Company News'],
    date: 'NOV 29, 2022',
    readTime: '5 min read'
  },
  {
    key: 'azion-achieves-soc-3-compliance',
    title: 'Azion Achieves SOC 3 Compliance',
    description: 'Explore Azion\'s SOC 3 compliance, ensuring our edge platform secures web applications and sites with top-tier data security and availability controls.',
    href: 'https://www.azion.com/en/blog/azion-achieves-soc-3-compliance/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnail-soc-2.png',
    categories: ['Company News'],
    date: 'NOV 14, 2022',
    readTime: '2 min read'
  },
  {
    key: 'azion-introduces-product-suite-for-comprehensive-edge-development',
    title: 'Azion Introduces Product Suite for Comprehensive Edge Development',
    description: 'Explore Azion Build for seamless edge app development with tools like Edge Functions, WebAssembly, and support for React frameworks.',
    href: 'https://www.azion.com/en/blog/azion-introduces-product-suite-for-comprehensive-edge-development/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblogpr_440x343px.png',
    categories: ['Company News'],
    date: 'NOV 9, 2022',
    readTime: '4 min read'
  },
  {
    key: 'webassembly-on-the-azion-platform-truly-embrace-the-edge',
    title: 'WebAssembly on the Azion Edge Computing Platform',
    description: 'Explore how WebAssembly enhances app modernization on Azion Web Platform, enabling secure, fast deployment and improved performance.',
    href: 'https://www.azion.com/en/blog/webassembly-on-the-azion-platform-truly-embrace-the-edge/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog_wasm.png',
    categories: ['Developers'],
    date: 'NOV 3, 2022',
    readTime: '6 min read'
  },
  {
    key: 'challenges-of-BGP-when-building-global-edge-network',
    title: 'Challenges of Using BGP when Building a Global Edge Network',
    description: 'Explore how Azion optimizes BGP for edge networks, enhancing security, performance, and reliability with intelligent routing solutions.',
    href: 'https://www.azion.com/en/blog/challenges-of-BGP-when-building-global-edge-network/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnail_bgp_mofu.png',
    categories: ['Developers'],
    date: 'NOV 2, 2022',
    readTime: '11 min read'
  },
  {
    key: 'simplifying-and-accelerating-deliveries-with-serverless-functions',
    title: 'Simplifying and Accelerating Deliveries with Serverless Functions',
    description: 'Explore how Azion Edge Functions streamline serverless JavaScript code execution for business, enhancing scalability, security, and efficiency.',
    href: 'https://www.azion.com/en/blog/simplifying-and-accelerating-deliveries-with-serverless-functions/',
    image: 'https://www.azion.com/assets/content/blog/uploads/data-communications-and-cloud-computing-network-concept-picture-id1175136826.jpg',
    categories: ['Developers'],
    date: 'NOV 1, 2022',
    readTime: '13 min read'
  },
  {
    key: 'how-azion-ddos-protection-mitigates-the-main-types-of-ddos-attacks',
    title: 'How Azion DDoS Protection Mitigates the Main Types of DDoS Attacks',
    description: 'Explore how Azion DDoS Protection leverages edge computing for advanced DDoS mitigation, ensuring high security with minimal latency and no service degradation.',
    href: 'https://www.azion.com/en/blog/how-azion-ddos-protection-mitigates-the-main-types-of-ddos-attacks/',
    image: 'https://www.azion.com/assets/content/blog/uploads/ddos-protection-blog-post-thumbnail.png',
    categories: ['Security'],
    date: 'MAR 9, 2022',
    readTime: '13 min read'
  },
  {
    key: 'edge-traffic-routing-for-extending-SDN-to-the-public-internet',
    title: 'Edge Traffic Routing: Extending SDN to the Public Internet',
    description: 'Explore how Azion\'s Edge Network leverages SDN for optimal routing and performance improvements in edge computing environments.',
    href: 'https://www.azion.com/en/blog/edge-traffic-routing-for-extending-SDN-to-the-public-internet/',
    image: 'https://www.azion.com/assets/content/blog/uploads/edge-traffic-routing-thumbnail.jpg',
    categories: ['Developers'],
    date: 'FEB 17, 2022',
    readTime: '12 min read'
  },
  {
    key: 'why-azion-chose-v8',
    title: 'Why Azion Chose the V8 Engine for Edge Functions',
    description: 'Explore how V8 Engine powers Azion\'s Edge Functions for enhanced security, efficiency, and speed in serverless computing at the network edge.',
    href: 'https://www.azion.com/en/blog/why-azion-chose-v8/',
    image: 'https://www.azion.com/assets/content/blog/uploads/why-azion-chose-the-v8-engine-for-edge-functions.png',
    categories: ['Developers'],
    date: 'AUG 10, 2021',
    readTime: '9 min read'
  },
  {
    key: 'how-lcp-performance-improved-with-jamstack',
    title: 'How JAMStack improved Azion\'s LCP performance',
    description: 'Discover how Azion\'s JAMStack integration enhances site performance, reduces resource use, and improves LCP for optimal loading times.',
    href: 'https://www.azion.com/en/blog/how-lcp-performance-improved-with-jamstack/',
    image: 'https://www.azion.com/assets/content/blog/uploads/overcoming-the-challenges-of-video-streaming-with-edge-application-ds-682-4.png',
    categories: ['Developers'],
    date: 'JUN 1, 2021',
    readTime: '5 min read'
  },
  {
    key: 'how-azion-started-using-jamstack',
    title: 'How Azion started using JAMStack',
    description: 'Explore how Azion adopted JAMStack for seamless content scaling, reducing dependency on developers and enhancing web development with SSGs.',
    href: 'https://www.azion.com/en/blog/how-azion-started-using-jamstack/',
    image: 'https://www.azion.com/assets/content/blog/uploads/group-4386.png',
    categories: ['Developers'],
    date: 'MAY 3, 2021',
    readTime: '4 min read'
  },
  {
    key: 'strengthening-routing-security',
    title: 'Strengthening Routing Security',
    description: 'Explore how Azion partners with MANRS by the Internet Society to enhance global internet security and BGP protocol stability.',
    href: 'https://www.azion.com/en/blog/strengthening-routing-security/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnail-strengthening-routing-security.png',
    categories: ['Security'],
    date: 'MAR 2, 2021',
    readTime: '5 min read'
  },
  {
    key: 'azion-introduces-edge-functions',
    title: 'Azion Introduces Edge Functions',
    description: 'Explore Azion Edge Functions: serverless, event-driven JavaScript solutions for low-latency, high-performance applications with enhanced security and monitoring.',
    href: 'https://www.azion.com/en/blog/azion-introduces-edge-functions/',
    image: 'https://www.azion.com/assets/content/blog/uploads/azion-introduces-edge-functions-thumb.png',
    categories: ['Company News'],
    date: 'JAN 15, 2021',
    readTime: '4 min read'
  },
  {
    key: 'azion-cells-future-serverless-computing',
    title: 'Azion Cells and the Future of Serverless Computing',
    description: 'Explore Azion Cells for ultra-low latency, edge-native applications, built with open standards for secure, high-performance serverless computing.',
    href: 'https://www.azion.com/en/blog/azion-cells-future-serverless-computing/',
    image: 'https://www.azion.com/assets/content/blog/uploads/azion-cells-technical-approach-and-the-future-of-serverless-computing.png',
    categories: ['Developers'],
    date: 'OCT 14, 2020',
    readTime: '7 min read'
  }
]
