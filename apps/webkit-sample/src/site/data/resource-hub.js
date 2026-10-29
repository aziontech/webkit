// azion.com/en/resource-hub, read on 2026-10-23 from the page's own listing payload (the filter
// island's props), verbatim and in its order. Images and links stay on azion.com; a success story's
// cover is the client's logo, drawn from this app's client registry instead.

export const RESOURCE_HUB_HERO = {
  eyebrow: 'Resource hub',
  title: 'Articles, ebooks, and customer stories',
  description:
    'Practical guides on performance, security, and scale, and the results teams get running on the Azion Platform.'
}

export const RESOURCE_HUB_LISTING = {
  title: 'Explore all resources',
  moreLabel: 'Load more',
  empty: {
    title: 'No resources match these filters',
    description: 'Try another content type, category, or industry.',
    action: 'View all resources'
  }
}

// The source's three pickers, in its order; each option list leads with its reset.
export const RESOURCE_HUB_FACETS = [
  {
    key: 'contentType',
    label: 'Content type',
    allLabel: 'All content types',
    options: ['E-books', 'Blog', 'Comparisons', 'Success stories']
  },
  {
    key: 'categories',
    label: 'Category',
    allLabel: 'All categories',
    options: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ]
  },
  {
    key: 'industry',
    label: 'Industry',
    allLabel: 'All industries',
    options: ['Financial', 'Fintech', 'EdTech', 'Retail', 'Tech', 'Education', 'Media']
  }
]

export const RESOURCE_HUB_NEWSLETTER = {
  eyebrow: 'Stay up to date',
  title: 'Subscribe to our newsletter',
  description: 'Product updates, event highlights, and industry insights, delivered to your inbox.',
  placeholder: 'Your email',
  submit: 'Subscribe',
  success: 'Thanks for subscribing to the Azion newsletter'
}

export const RESOURCES = [
  {
    title: 'Security for applications, APIs, and AI agents',
    description:
      'Learn how to bring security policies into deployment, automate protection, and monitor traffic across applications, APIs, and AI agents.',
    contentType: 'E-books',
    categories: ['Security'],
    date: 'OCT 15, 2026',
    href: 'https://www.azion.com/en/lp/security-applications-apis-ai-agents/',
    image: 'https://www.azion.com/assets/content/blog/uploads/Rich%20contentsdark.png'
  },
  {
    title: 'Azion MCP servers: Connect Your Coding Agent to Azion',
    description:
      'Azion MCP servers connect Claude Code, Cursor, and other coding agents to the Azion documentation and API, with a dry_run preview before each write.',
    contentType: 'Blog',
    categories: ['Company news'],
    date: 'OCT 14, 2026',
    href: 'https://www.azion.com/en/blog/azion-mcp-servers-generally-available/',
    image: 'https://www.azion.com/assets/content/blog/uploads/mcp-ga/Azion-MCP.svg'
  },
  {
    title: 'Bringing application security into the deployment process',
    description:
      'Integrate application, API, and AI agent protection into deployment with reusable policies, security reviews, and validation in Real-Time Events.',
    contentType: 'Blog',
    categories: ['Security'],
    date: 'OCT 7, 2026',
    href: 'https://www.azion.com/en/blog/bringing-application-security-into-the-deployment-process/',
    image: 'https://www.azion.com/assets/content/blog/uploads/Rich%20contentsdark.png'
  },
  {
    title: 'The agent that writes your code also suggests your security policy',
    description:
      'See how the open-source Azion MCP Server lets coding agents like Claude Code and Codex query Azion docs and propose security policies (WAF, Firewall, rate limiting) via Terraform, for team review before deploy.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'OCT 5, 2026',
    href: 'https://www.azion.com/en/blog/coding-agent-suggests-security-policy/',
    image: 'https://www.azion.com/assets/content/blog/uploads/Azion_Productsdark.png'
  },
  {
    title: 'Cloudflare Alternative Comparison: Azion vs Cloudflare',
    description:
      'Azion vs Cloudflare: the same platform on every plan, more than one way to recover from failures, and Enterprise support that answers in minutes.',
    contentType: 'Comparisons',
    categories: ['Developers'],
    date: 'OCT 3, 2026',
    href: 'https://www.azion.com/en/lp/cloudflare-to-azion-alternative-guide/',
    image: 'https://www.azion.com/assets/content/lp/uploads/og-image/og-img-cf-to-azion.png'
  },
  {
    title: 'F5 Alternative Comparison: Azion vs F5',
    description:
      'Azion vs F5: one managed platform for every application. No appliances, no licensing matrix, and a path off BIG-IP one app at a time.',
    contentType: 'Comparisons',
    categories: ['Developers'],
    date: 'OCT 3, 2026',
    href: 'https://www.azion.com/en/lp/f5-to-azion-alternative-guide/',
    image: 'https://www.azion.com/assets/content/lp/uploads/og-image/og-img-f5-to-azion.png'
  },
  {
    title: 'Imperva Alternative Comparison: Azion vs Imperva',
    description:
      'Azion vs Imperva: run, protect, and observe applications on one platform, with published prices and every product on every plan.',
    contentType: 'Comparisons',
    categories: ['Developers'],
    date: 'OCT 3, 2026',
    href: 'https://www.azion.com/en/lp/imperva-to-azion-alternative-guide/',
    image: 'https://www.azion.com/assets/content/lp/uploads/og-image/og-img-imperva-to-azion.png'
  },
  {
    title: 'Akamai Alternative Comparison: Azion vs Akamai',
    description:
      'Azion vs Akamai: one platform instead of a portfolio you integrate, with every product on every plan and a clear path to switch.',
    contentType: 'Comparisons',
    categories: ['Developers'],
    date: 'OCT 2, 2026',
    href: 'https://www.azion.com/en/lp/akamai-to-azion-alternative-guide/',
    image: 'https://www.azion.com/assets/content/lp/uploads/og-image/og-img-akamai-to-azion.png'
  },
  {
    title: 'AWS Alternative Comparison: Azion vs AWS',
    description:
      'Azion vs AWS: one platform, distributed by default, instead of separate regional services. One bill, security included, and support in your language.',
    contentType: 'Comparisons',
    categories: ['Developers'],
    date: 'OCT 2, 2026',
    href: 'https://www.azion.com/en/lp/aws-to-azion-alternative-guide/',
    image: 'https://www.azion.com/assets/content/lp/uploads/og-image/og-img-aws-to-azion.png'
  },
  {
    title: 'Fastly Alternative Comparison: Azion vs Fastly',
    description:
      'Azion vs Fastly: a programmable platform for the entire application, not a CDN with separate products. More distribution, fewer SKUs to manage.',
    contentType: 'Comparisons',
    categories: ['Developers'],
    date: 'OCT 2, 2026',
    href: 'https://www.azion.com/en/lp/fastly-to-azion-alternative-guide/',
    image: 'https://www.azion.com/assets/content/lp/uploads/og-image/og-img-fastly-to-azion.png'
  },
  {
    title: 'Vercel Alternative Comparison: Azion vs Vercel',
    description:
      'Azion vs Vercel: compute, data, and security close to users by default. No regions to manage, with unlimited users and SSO on every plan.',
    contentType: 'Comparisons',
    categories: ['Developers'],
    date: 'OCT 2, 2026',
    href: 'https://www.azion.com/en/lp/vercel-to-azion-alternative-guide/',
    image: 'https://www.azion.com/assets/content/lp/uploads/og-image/og-img-vercel-to-azion.png'
  },
  {
    title: 'How I Shipped My Portfolio in Just Two Commands',
    description:
      "See how a portfolio site went from template to live URL with just azion init and azion deploy, running free on Azion's Hobby plan.",
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'SEP 25, 2026',
    href: 'https://www.azion.com/en/blog/ship-portfolio-two-commands-azion-cli/',
    image: 'https://www.azion.com/assets/screenshot-2026-09-25-at-10-47-14.png'
  },
  {
    title: 'How Do You Reduce AI Agent Latency?',
    description:
      'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state with distributed architecture, caching, and observability.',
    contentType: 'Blog',
    categories: ['Serverless'],
    date: 'SEP 23, 2026',
    href: 'https://www.azion.com/en/blog/how-to-reduce-ai-agent-latency/',
    image: 'https://www.azion.com/assets/content/blog/uploads/Programmingdark.jpg'
  },
  {
    title: 'Best Cloudflare Alternatives and Competitors',
    description:
      'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting. Assess trade-offs, operating costs, and migration paths with Azion.',
    contentType: 'Blog',
    categories: ['Security'],
    date: 'SEP 22, 2026',
    href: 'https://www.azion.com/en/blog/cloudflare-alternatives-and-competitors/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/best-cloudflare-alternatives/best-cloudflare-alternatives.png'
  },
  {
    title: 'Which Azion Plan Is Right for Your Project?',
    description:
      'Compare Azion’s Hobby, Pro, and Enterprise plans for personal projects, production applications, and operations that need customized terms.',
    contentType: 'Blog',
    categories: ['Company news'],
    date: 'SEP 22, 2026',
    href: 'https://www.azion.com/en/blog/which-azion-plan-is-right-for-your-project/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/thumblinkedin-4templatesimproveexperience-1280x720px.png'
  },
  {
    title: 'How to Optimize Operations at Scale with the Azion Enterprise Plan',
    description:
      'Learn how the Azion Enterprise Plan helps optimize costs, plan capacity, and address governance, compliance, and support requirements.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'SEP 14, 2026',
    href: 'https://www.azion.com/en/blog/optimize-operations-at-scale-azion-enterprise-plan/',
    image: 'https://www.azion.com/assets/content/blog/uploads/Rich%20contentsdark.png'
  },
  {
    title: 'Azion Pro Plan: When Your Personal Project Becomes a Product',
    description:
      'Learn when to move from Hobby to Azion’s Pro plan, with higher included limits, on-demand usage, and spend controls for production applications.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'SEP 10, 2026',
    href: 'https://www.azion.com/en/blog/azion-pro-plan-personal-project-to-product/',
    image: 'https://www.azion.com/assets/content/blog/uploads/Azion_Productsdark.png'
  },
  {
    title: 'What You Can Build with Azion’s Hobby Plan',
    description:
      'Explore free templates for resumes, blogs, portfolios, AI agents, and e-commerce prototypes with Azion’s Hobby plan.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'SEP 10, 2026',
    href: 'https://www.azion.com/en/blog/what-you-can-build-with-azion-hobby-plan/',
    image: 'https://www.azion.com/assets/content/blog/uploads/Programmingdark.jpg'
  },
  {
    title: 'How to Run Agentic Infrastructure in Production',
    description:
      'Learn how to run agentic AI infrastructure in production with durable execution, checkpointing, inference cost controls, and step-level observability.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'SEP 9, 2026',
    href: 'https://www.azion.com/en/blog/how-to-run-agentic-infrastructure-in-production/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/agentic-infra-prod/og-image-agentic-infra-prod.png'
  },
  {
    title: 'From Single LLM Calls to Agentic Workflows: An Infrastructure Guide',
    description:
      'Learn how infrastructure requirements change from single LLM calls to agentic workflows, including orchestration, inference, memory, tool calling, and access control.',
    contentType: 'Blog',
    categories: ['Serverless'],
    date: 'SEP 3, 2026',
    href: 'https://www.azion.com/en/blog/agentic-workflows-infrastructure-guide/',
    image: 'https://www.azion.com/assets/edge-computing.png'
  },
  {
    title: 'Azion Named Leader in Four Categories — G2 Fall 2026 Reports',
    description:
      'Azion earned Leader status in CDN, Web Security, DDoS Protection, and Bot Detection and Mitigation (Enterprise) in the G2 Fall 2026 Reports, plus High Performer recognition in five more categories.',
    contentType: 'Blog',
    categories: ['Company news', 'Market trends'],
    date: 'AUG 28, 2026',
    href: 'https://www.azion.com/en/blog/azion-leader-g2-fall-reports-2026/',
    image: 'https://www.azion.com/assets/g2fallreports.png'
  },
  {
    title: "Why the Next Wave of AI Apps Won't Run in Centralized Cloud",
    description:
      'Distributed AI inference is the practice of handling AI requests close to the user instead of routing every one to a centralized cloud region. Learn why AI-native apps are moving away from centralized inference and how the Azion Platform supports it today.',
    contentType: 'Blog',
    categories: ['Serverless'],
    date: 'AUG 28, 2026',
    href: 'https://www.azion.com/en/blog/why-next-wave-ai-apps-wont-run-centralized-cloud/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog_440x343px_livemap.png'
  },
  {
    title: 'AI agents in financial services: control in production',
    description:
      'AI agents can access data, recommend decisions, and execute actions across financial systems. Learn how to structure identity, authorization, enforcement, observability, and API protection controls for production environments.',
    contentType: 'Blog',
    categories: ['Market trends'],
    date: 'AUG 24, 2026',
    href: 'https://www.azion.com/en/blog/ai-agents-financial-services/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/thumbblogzerotrustjourney-planning.png'
  },
  {
    title: 'How many vendors does a bank need for secure infrastructure?',
    description:
      'Learn why fragmented security and delivery vendors drive up the real cost of running banking infrastructure — and how to consolidate WAF, Bot Manager, DDoS Protection, and AI Inference on a single platform.',
    contentType: 'Blog',
    categories: ['Market trends'],
    date: 'AUG 24, 2026',
    href: 'https://www.azion.com/en/blog/how-many-vendors-does-a-bank-need-secure-infrastructure/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-4templatesimproveexperience-440x343px-1.png'
  },
  {
    title: 'Financial API Security: How to Protect Each Type of API',
    description:
      'Learn how to protect financial APIs against credential stuffing, business logic abuse, scraping, and unauthorized access with Bot Manager, WAF, rate limiting, mTLS, and real-time observability.',
    contentType: 'Blog',
    categories: ['Security'],
    date: 'AUG 19, 2026',
    href: 'https://www.azion.com/en/blog/financial-api-security/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/thumbblogfivecybersecuritytrends2023.png'
  },
  {
    title: 'Understanding Agentic AI Infrastructure',
    description:
      'Learn what agentic AI infrastructure is, why agent workloads break traditional assumptions, and which layers you need before agents reach production.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'AUG 13, 2026',
    href: 'https://www.azion.com/en/blog/understanding-agentic-ai-infrastructure/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/agentic-infrastructure/og-image-agentic-infrastructure.png'
  },
  {
    title: 'E-commerce security: how fast can your store stop threats?',
    description:
      'Learn how to reduce the time between detecting and blocking threats by enforcing security policies before traffic reaches the origin.',
    contentType: 'Blog',
    categories: ['Security'],
    date: 'AUG 11, 2026',
    href: 'https://www.azion.com/en/blog/ecommerce-security-threat-response-time/',
    image: 'https://www.azion.com/assets/content/blog/uploads/Ecommerce_BlackFridaydark.png'
  },
  {
    title: 'AI bots explained: Search vs Agent vs Training bots',
    description:
      'Learn how to identify Search, Agent, and Training bots, why User-Agent alone is not enough to classify them, and how to build an effective AI bot management policy with Azion Bot Manager.',
    contentType: 'Blog',
    categories: ['Security'],
    date: 'AUG 5, 2026',
    href: 'https://www.azion.com/en/blog/ai-bot-traffic-types/',
    image: 'https://www.azion.com/assets/content/blog/uploads/Botsdark.jpg'
  },
  {
    title: 'Distributed AI inference: cut latency 75%, keep your model',
    description:
      'LLM inference cost is a model problem and an architecture problem. Centralized inference adds 100–180ms of network latency per request and forces over-provisioning to maintain p95. Learn how distributed execution cuts inference origin load by up to 60% and global p50 latency by 75%.',
    contentType: 'Blog',
    categories: ['Developers', 'Routing and networking', 'Serverless'],
    date: 'AUG 3, 2026',
    href: 'https://www.azion.com/en/blog/llm-inference-cost-distributed-architecture-2026/',
    image: 'https://www.azion.com/assets/edge-computing.png'
  },
  {
    title: 'Eliminating cold starts in AI and serverless applications',
    description:
      'Serverless cold starts add 200ms to over 1 second of latency to affected requests and compound inside AI inference pipelines that chain multiple function calls. Learn what causes cold starts, why they are especially damaging for AI workloads, and what architectures eliminate them entirely.',
    contentType: 'Blog',
    categories: ['Serverless', 'Market trends'],
    date: 'JUL 28, 2026',
    href: 'https://www.azion.com/en/blog/cold-starts-killing-ai-application-performance/',
    image: 'https://www.azion.com/assets/100-uptimedark.png'
  },
  {
    title: 'Digital Sovereignty and AI: Why Where Inference Happens Matters',
    description:
      'Discover why inference location is a strategic architectural decision for AI applications. Learn how to reduce provider dependency, strengthen governance, meet regulatory requirements, and build resilient AI workloads with distributed inference.',
    contentType: 'Blog',
    categories: ['Market trends'],
    date: 'JUL 24, 2026',
    href: 'https://www.azion.com/en/blog/digital-sovereignty-ai-inference/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog_440x343px_livemap.png'
  },
  {
    title: 'How to Protect Your DNS Against Hijacking, Flooding, and Tunneling',
    description:
      'DNS hijacking redirects users to attacker infrastructure with a valid TLS cert. DNS flooding takes a domain offline without touching the app. DNS tunneling exfiltrates data through port 53 past most firewalls. Learn how each attack works and the specific defenses that stop them.',
    contentType: 'Blog',
    categories: ['Security', 'Developers'],
    date: 'JUL 21, 2026',
    href: 'https://www.azion.com/en/blog/dns-security-hijacking-flooding-tunneling-explained/',
    image: 'https://www.azion.com/assets/protection.png'
  },
  {
    title: 'How to Identify I/O Bottlenecks in CI/CD Pipelines',
    description:
      'Understand the difference between CPU-bound and I/O-bound workloads in CI/CD pipelines, interpret performance metrics, and apply techniques such as parallel uploads and S3-based storage to dramatically reduce deployment time.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'JUL 20, 2026',
    href: 'https://www.azion.com/en/blog/identify-io-bottlenecks-cicd-pipelines/',
    image: 'https://www.azion.com/assets/content/blog/uploads/CLI_keyillustration3%201.jpg'
  },
  {
    title: 'Why Tokens Are the Wrong Meter for AI Inference Pricing',
    description:
      'AI inference pricing based on tokens complicates forecasting and model comparisons. See why requests and GB-hours offer a clearer compute-based alternative.',
    contentType: 'Blog',
    categories: ['AI'],
    date: 'JUL 14, 2026',
    href: 'https://www.azion.com/en/blog/tokens-vs-compute/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog_440x343px_livemap.png'
  },
  {
    title: 'What the U.S. Executive Order Means for Post-Quantum Cryptography',
    description:
      'Executive Order 14412 establishes a roadmap for post-quantum cryptography adoption by 2030. Learn how it impacts global businesses, the risks of Harvest Now, Decrypt Later attacks, and the first steps toward PQC readiness.',
    contentType: 'Blog',
    categories: ['Security'],
    date: 'JUL 14, 2026',
    href: 'https://www.azion.com/en/blog/post-quantum-cryptography-us-executive-order/',
    image: 'https://www.azion.com/assets/content/blog/uploads/kv-webinar-securityrisk%201.png'
  },
  {
    title: 'API Security for AI Agents: Rate Limits, Auth, and Observability',
    description:
      'AI agent traffic bypasses per-IP rate limits, breaks human-redirect auth flows, causes retry loops from malformed status codes, and produces traffic patterns no standard dashboard surfaces. Learn the five fixes that cover agent traffic without disrupting human users or legitimate integrations.',
    contentType: 'Blog',
    categories: ['Security', 'Developers'],
    date: 'JUL 14, 2026',
    href: 'https://www.azion.com/en/blog/ai-agents-hitting-your-api-what-breaks-first/',
    image: 'https://www.azion.com/assets/apidark.png'
  },
  {
    title: 'WAF, Bot, and DDoS Security: The Case for a Shared Control Plane',
    description:
      'Fragmented WAF, bot, and DDoS stacks add 30–50 minutes to incident investigation, create policy drift across three consoles, and leave seams that coordinated attacks are built to exploit. Learn what a unified security architecture changes — and how to make the consolidation case to finance.',
    contentType: 'Blog',
    categories: ['Security'],
    date: 'JUL 7, 2026',
    href: 'https://www.azion.com/en/blog/unified-waf-bot-ddos-protection-closes-gaps-coordinated-attacks-exploit/',
    image: 'https://www.azion.com/assets/azion-productsdark.png'
  },
  {
    title: 'Cloud Egress Costs in 2026: Why the Math Stopped Working',
    description:
      "Cloud egress costs are compounding for most teams even though per-GB prices haven't changed. Learn how to calculate your egress cost per user, identify the stateless/stateful split, and reduce cloud bandwidth spend by 60–80% without rebuilding your architecture.",
    contentType: 'Blog',
    categories: ['Market trends', 'Serverless'],
    date: 'JUL 6, 2026',
    href: 'https://www.azion.com/en/blog/cloud-egress-costs-2026-why-the-math-stopped-working/',
    image: 'https://www.azion.com/assets/cloud-test-1.png'
  },
  {
    title: 'API Security Beyond the WAF',
    description:
      'Discover the limitations of WAF-only API protection and how a layered security architecture combining API Gateway controls, bot mitigation, DDoS protection, rate limiting, and observability improves security and operational visibility.',
    contentType: 'Blog',
    categories: ['Security'],
    date: 'JUN 19, 2026',
    href: 'https://www.azion.com/en/blog/api-security-beyond-the-waf/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/thumblinkedin-7perguntaswaf-1280x720px.png'
  },
  {
    title: 'Malicious Automation Defense with AI Inference',
    description:
      'Discover how malicious automation defense combines AI Inference, bot management, programmable security controls, and real-time observability to identify, classify, and respond to automated abuse earlier in the request lifecycle.',
    contentType: 'Blog',
    categories: ['Security'],
    date: 'JUN 19, 2026',
    href: 'https://www.azion.com/en/blog/malicious-automation-defense-ai-inference/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog_440x343px_livemap.png'
  },
  {
    title: 'Why a Unified WAAP Platform Reduces SOC Risk',
    description:
      'Discover how unified WAAP platforms help security teams investigate threats faster, reduce operational complexity, and improve visibility across WAF, DDoS protection, bot mitigation, and API security.',
    contentType: 'Blog',
    categories: ['Security'],
    date: 'JUN 17, 2026',
    href: 'https://www.azion.com/en/blog/how-a-unified-waap-platform-reduces-soc-risk/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/thumbblogfivecybersecuritytrends2023-1.png'
  },
  {
    title: 'DDoS Mitigation and WAF Protection Without Performance Loss',
    description:
      'Understand how hairpinning, backhauling, and centralized scrubbing centers affect application performance and discover how distributed architectures mitigate DDoS attacks and enforce WAF policies without adding latency.',
    contentType: 'Blog',
    categories: ['Security'],
    date: 'JUN 12, 2026',
    href: 'https://www.azion.com/en/blog/how-to-mitigate-ddos-attacks-and-protect-applications-with-waf/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/thumblinkedin-whatiswaf-1280x720px.png'
  },
  {
    title: 'How mTLS Secures APIs, Apps, and B2B Integrations',
    description:
      'Learn how it helps organizations implement Zero Trust architectures, secure Open Banking environments, reduce unauthorized access risks, and simplify identity management at scale.',
    contentType: 'Blog',
    categories: ['Security'],
    date: 'JUN 11, 2026',
    href: 'https://www.azion.com/en/blog/how-mtls-strengthens-api-security/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/thumbblogzerotrustjourney-planning.png'
  },
  {
    title: 'Total Cost of Ownership: Centralized Cloud vs Serverless Edge',
    description:
      'Compare the total cost of ownership (TCO) of centralized cloud and serverless edge architectures. Explore how infrastructure, operational overhead, and development effort impact long-term cloud economics.',
    contentType: 'Blog',
    categories: ['Serverless'],
    date: 'JUN 1, 2026',
    href: 'https://www.azion.com/en/blog/compare-centralized-cloud-and-serverless-edge/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/edgecomputingcloudcomputing_thumblinkedin_1280x720px.png'
  },
  {
    title: 'Azion Leader in CDN & High Performer - G2 Summer 2026',
    description:
      'Azion earned recognition across nine categories in the G2 Summer 2026 Reports, including Leader in Content Delivery Network (CDN) and High Performer in Web Security, Cloud Security, Load Balancing, DDoS Protection, Bot Detection and Mitigation, WAF, SSL & TLS Certificate Tools, and API Security Tools.',
    contentType: 'Blog',
    categories: ['Company news', 'Market trends'],
    date: 'MAY 26, 2026',
    href: 'https://www.azion.com/en/blog/azion-leader-g2-summer-reports-2026/',
    image: 'https://www.azion.com/assets/g2-leaders-badget-linkedin-formato-1-91-1-horizontal-3.png'
  },
  {
    title: 'Rebuilding the Azion Console Data Layer for Faster Navigation',
    description:
      'Learn how Azion rebuilt the Console data layer to improve navigation consistency and reduce unnecessary reloads — covering cache hydration, persistence, and cross-tab synchronization patterns for large-scale SPAs.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'MAY 25, 2026',
    href: 'https://www.azion.com/en/blog/azion-console-data-layer-rebuild/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog_440x343px_livemap.png'
  },
  {
    title: 'The Real Economics of Serverless Edge Platforms',
    description:
      'Compare the economics of centralized cloud architectures and serverless edge platforms through a practical framework for modern workloads.',
    contentType: 'E-books',
    categories: ['Serverless'],
    date: 'MAY 19, 2026',
    href: 'https://www.azion.com/en/lp/tco-centralized-cloud-vs-serverless-edge-platforms/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/edgecomputingcloudcomputing_thumblinkedin_1280x720px.png'
  },
  {
    title: 'Faster Deploys Across Azion Console and CLI: 90% Less Upload Time',
    description:
      'Learn how Azion accelerated application deploys across the Console and CLI with S3-based uploads and dynamic parallelism, reducing static file upload times by 73% in the Console and up to 90% in CLI 4.21+.',
    contentType: 'Blog',
    categories: ['Developers', 'Company news'],
    date: 'MAY 6, 2026',
    href: 'https://www.azion.com/en/blog/azion-cli-static-uploads-90-percent-faster/',
    image: 'https://www.azion.com/assets/cli-keyillustration3-1.png'
  },
  {
    title: 'Why Azion Moved to Individual npm Packages in a Monorepo',
    description:
      'Learn why Azion is moving from a monolithic library to individual npm packages in a distributed monorepo, improving versioning, performance, security, CI/CD, tree-shaking, and developer experience.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'MAY 4, 2026',
    href: 'https://www.azion.com/en/blog/why-azion-is-migrating-to-individual-npm-packages-distributed-monorepo/',
    image: 'https://www.azion.com/assets/monolithic-vs-microservicesdark.png'
  },
  {
    title: 'Post-Quantum Cryptography: How Azion Protects Your Data',
    description:
      'Discover how post-quantum cryptography (PQC) protects against future quantum threats and how Azion already delivers quantum-safe security in production with minimal performance impact.',
    contentType: 'Blog',
    categories: ['Security'],
    date: 'APR 27, 2026',
    href: 'https://www.azion.com/en/blog/pqc-quantum-cryptography/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/thumbblogfivecybersecuritytrends2023.png'
  },
  {
    title: 'Azion Terraform Provider v4: AI-Powered Infrastructure as Code',
    description:
      'Discover how Azion Terraform Provider v4 revolutionizes Infrastructure as Code with AI-driven automation, eliminating provider lag and delivering Day-0 support for all APIs. Learn about our design-first pipeline that keeps your infrastructure in perfect sync.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'APR 16, 2026',
    href: 'https://www.azion.com/en/blog/terraform-provider-v4-ai-powered/',
    image: 'https://www.azion.com/assets/content/blog/uploads/terraform/terraformcover.png'
  },
  {
    title: 'Checkout Performance at Scale',
    description:
      'Learn how to maintain conversion and revenue under high traffic without relying on backend scaling.',
    contentType: 'E-books',
    categories: ['Caching'],
    date: 'APR 1, 2026',
    href: 'https://www.azion.com/en/lp/checkout-performance-scale/',
    image: 'https://www.azion.com/assets/content/blog/fallback-cards/card-empty-2.png'
  },
  {
    title: 'Azion Named Leader in G2 Spring 2026 Reports',
    description:
      'In the G2 Spring 2026 Reports, Azion earned Leader rankings in Content Delivery Network (CDN), Web Security, and DDoS Protection, along with High Performer recognition in Cloud Security, API Security Tools, SSL & TLS Certificate Tools, and top placements for WAF and Bot Detection across Enterprise and Product grids.',
    contentType: 'Blog',
    categories: ['Company news', 'Market trends'],
    date: 'MAR 17, 2026',
    href: 'https://www.azion.com/en/blog/azion-leader-g2-spring-reports-2026/',
    image: 'https://www.azion.com/assets/content/blog/uploads/g2spring/G2spring.jpg'
  },
  {
    title: 'Best DDoS Protection 2026: Azion vs. Cloudflare & More',
    description:
      'DDoS attacks now routinely combine volumetric floods (L3/L4) with application-layer attacks (L7) and DNS disruption. The “best” DDoS protection isn’t a universal winner—it’s the provider whose documented capabilities and commercial terms match your risk profile, architecture, and uptime requirements.',
    contentType: 'Blog',
    categories: ['Developers', 'Market trends', 'Security'],
    date: 'MAR 10, 2026',
    href: 'https://www.azion.com/en/blog/best-ddos-protection-2026-azion-vs-cloudflare-akamai-aws-fastly-imperva/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/ddos-compare/Screenshot%25202026-03-10%2520at%252011.51.09.png'
  },
  {
    title: 'The Invisible Tax of Latency: How Small Delays Cost Millions',
    description:
      'Learn how tail latency during high-traffic events silently reduces e-commerce conversion rates and why distributed infrastructure is critical to protect checkout performance and revenue.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'MAR 9, 2026',
    href: 'https://www.azion.com/en/blog/invisible-tax-of-latency/',
    image: 'https://www.azion.com/assets/content/blog/uploads/latency.png'
  },
  {
    title: 'How to Prevent Checkout Failures in High-Traffic Events',
    description:
      'Learn how to prevent checkout failures during high-traffic events like Black Friday. Discover how distributed architecture protects revenue, stabilizes performance, and eliminates backend overload.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'MAR 3, 2026',
    href: 'https://www.azion.com/en/blog/prevent-checkout-failures-high-traffic-ecommerce-events/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/transformtheonlineshopping_2022_blogpost_v2.png'
  },
  {
    title: 'Why Traditional Caching Fails When Customers Want to Buy',
    description:
      'Discover why traditional caching strategies fail during high-traffic commerce events and how programmable caching on distributed infrastructure improves checkout performance, reduces latency, and protects revenue during critical buying moments.',
    contentType: 'Blog',
    categories: ['Developers', 'Caching'],
    date: 'FEB 23, 2026',
    href: 'https://www.azion.com/en/blog/why-traditional-caching-fails-ecommerce/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-4templatesimproveexperience-440x343px-1.png'
  },
  {
    title: 'Global-Scale AI Inference with LoRA & Serverless GPU',
    description:
      'Centralized cloud inference breaks down for generative AI: latency spikes, inconsistent UX, and fragile failover. This article explains how LoRA enables lightweight adaptation and how serverless GPU at the edge (Azion) delivers global-scale, low-latency inference with automation, standardization, and real-time observability.',
    contentType: 'Blog',
    categories: ['Developers', 'Serverless', 'Market trends'],
    date: 'JAN 22, 2026',
    href: 'https://www.azion.com/en/blog/from-cloud-training-to-global-scale-ai-inference-lora-serverless/',
    image: 'https://www.azion.com/assets/content/blog/uploads/cloud-to-lora/cloudtolora.png'
  },
  {
    title: 'OWASP Top 10:2025 – Move Security to Programmable Infra',
    description:
      'OWASP Top 10:2025 shifts AppSec from code-level mistakes to architectural and supply-chain risks. Learn why legacy WAFs fall short and how a programmable infrastructure approach (WAF + Functions + bot and rate controls) mitigates modern threats from access control to zero-days.',
    contentType: 'Blog',
    categories: ['Developers', 'Routing and networking', 'Security'],
    date: 'JAN 21, 2026',
    href: 'https://www.azion.com/en/blog/owasp-top-10-2025-programmable/',
    image: 'https://www.azion.com/assets/content/blog/uploads/owasp-2025/owasp2025.png'
  },
  {
    title: 'Banco de la Nación: 97% Faster, 75% Lower Costs',
    description:
      'With Azion, Banco de la Nación achieved maximum performance efficiency, reducing latency and accelerating content delivery across Peru.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'JAN 5, 2026',
    href: 'https://www.azion.com/en/success-case/banco-de-la-nacion-achieves-speed-and-reduces-costs/',
    industry: 'Financial'
  },
  {
    title: 'Zoop Cuts Costs, Latency & Attacks with Azion',
    description:
      'To handle transaction spikes without compromising the checkout experience, Zoop, iFood’s fintech, adopted Azion’s platform, reducing costs and accelerating risk decisions with high performance.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'DEC 16, 2025',
    href: 'https://www.azion.com/en/success-case/zoop-case-performance-at-scale/',
    industry: 'Fintech'
  },
  {
    title: 'New AI Templates, E-commerce Tools & Nuxt/SvelteKit Support',
    description:
      "Accelerate software delivery with Azion's latest platform updates featuring 11 new AI and e-commerce templates, native SSR adapters for Nuxt and SvelteKit, and crucial security/stability improvements. Build high-performance chatbots, fast Shopify stores, and modern SaaS applications at the edge with enhanced control, reduced latency, and faster time-to-market.",
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'DEC 15, 2025',
    href: 'https://www.azion.com/en/blog/new-templates-solutions-and-support/',
    image: 'https://www.azion.com/assets/content/blog/og-images/templatesnew.png'
  },
  {
    title: 'Azion Named a Leader in G2 Winter 2026 Reports',
    description:
      'Azion is a Leader in CDN & High Performer in 6 security categories in the G2 Winter 2026 Reports. With 100% user satisfaction, see how our web platform delivers ultra-fast performance & enterprise-grade security. Try free.',
    contentType: 'Blog',
    categories: ['Company news', 'Market trends'],
    date: 'DEC 8, 2025',
    href: 'https://www.azion.com/en/blog/azion-leader-g2-winter-reports-2026/',
    image: 'https://www.azion.com/assets/content/blog/uploads/g2award/G2Leaders.png'
  },
  {
    title: 'Deploying Secure High-Performance MCP Servers for AI',
    description:
      'Go beyond the traditional cloud. This guide details how to deploy secure, high-performance MCP servers for real-time AI applications.',
    contentType: 'Blog',
    categories: ['Developers', 'Serverless', 'Market trends'],
    date: 'DEC 1, 2025',
    href: 'https://www.azion.com/en/blog/mcp-security-high-performance/',
    image: 'https://www.azion.com/assets/content/blog/uploads/cloudvsedge/edgecloud.png'
  },
  {
    title: 'How Azion Cuts Cloud Bills and Slashes Egress Costs',
    description:
      'Learn how distributed architectures dramatically reduce egress, latency, and observability costs by moving compute, caching, and compression closer to users. This article combines benchmarks, real-world transformations, and practical patterns to show how Azion helps teams optimize traffic, lower TCO, and build faster, more efficient applications.',
    contentType: 'Blog',
    categories: ['Routing and networking', 'Caching', 'Serverless', 'Security', 'Observability'],
    date: 'NOV 17, 2025',
    href: 'https://www.azion.com/en/blog/cloud-cost-reduction-with-distributed-architecture/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog_wasm.png'
  },
  {
    title: 'HeroSpark Accelerates Its Platform 30% with Azion',
    description:
      'HeroSpark accelerated access to its digital learning platform and scaled content delivery for thousands of students and creators using Azion’s distributed infrastructure.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'NOV 7, 2025',
    href: 'https://www.azion.com/en/success-case/herospark-30-percent-performance-azion/',
    industry: 'EdTech'
  },
  {
    title: 'HeroSpark Cuts Fraud & Attacks 99.5% with Azion',
    description:
      'With Azion, HeroSpark automated fraud prevention, sped up content delivery, and strengthened HeroPay’s infrastructure to scale globally.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'NOV 7, 2025',
    href: 'https://www.azion.com/en/success-case/herospark-fraud-prevention-azion/',
    industry: 'EdTech'
  },
  {
    title: 'How Latin America Can Close the Digital Gap',
    description:
      "Bridge Latin America's Digital Divide with Decentralized Infrastructure. Learn how it cuts latency, costs, and enables vital digital services.",
    contentType: 'Blog',
    categories: ['Developers', 'Routing and networking'],
    date: 'NOV 3, 2025',
    href: 'https://www.azion.com/en/blog/descentralized-evolution-latin-america/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/bridge-gap-latin-america/bridge-gap-latin-america.png'
  },
  {
    title: "Azion's Product Launch Week - May 2025",
    description:
      'Azion announces a series of product launches and enhancements to its web platform.',
    contentType: 'Blog',
    categories: ['Company news'],
    date: 'MAY 7, 2025',
    href: 'https://www.azion.com/en/blog/product-launch-h1-2025/',
    image: 'https://www.azion.com/assets/content/blog/uploads/cloudtoedge.png'
  },
  {
    title: 'GPA stopped a cyberattack and reduced costs by 30%',
    description:
      'Grupo Pão de Açúcar (GPA) stopped a targeted DNS attack, secured 100+ critical applications in 15 days, and reduced costs by 30%.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'MAY 6, 2025',
    href: 'https://www.azion.com/en/success-case/gpa-solved-cyberattack/',
    industry: 'Retail'
  },
  {
    title: 'Build and Scale Your Web Applications Right at the Data Source',
    description:
      'Modern businesses demand new ways to build, secure, and scale applications. Azion is at the forefront of this compute technology with its suite of products: Edge Functions, Edge SQL, and Edge Storage.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'MAY 6, 2025',
    href: 'https://www.azion.com/en/blog/launch-week-build-and-scale/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/launch-week-compute/build-and-scale-dark.png'
  },
  {
    title: 'Introducing Azion AI Inference for Scalable AI Solutions',
    description:
      "AI Inference combines artificial intelligence with edge computing, allowing AI models to run directly on Azion's infrastructure—close to data sources and users—rather than in distant cloud data centers.",
    contentType: 'Blog',
    categories: ['Company news'],
    date: 'MAY 5, 2025',
    href: 'https://www.azion.com/en/blog/introducing-edge-ai/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/launch-week-edge-ai/edge-ai-blogpost-dark.png'
  },
  {
    title: 'Axur Automates Billions of Page Checks with Azion AI',
    description:
      'Learn how moving AI inference from managed infrastructure unlocked the fastest automatic takedown in the market.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'MAY 5, 2025',
    href: 'https://www.azion.com/en/success-case/axur-reduced-time-to-takedown-with-ai/',
    industry: 'Tech'
  },
  {
    title: 'Using Polyfills to Bridge Gaps in Serverless Edge Environments',
    description:
      'Polyfills ensure compatibility across serverless edge environments, enabling developers to use modern web features without sacrificing functionality.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'MAR 7, 2025',
    href: 'https://www.azion.com/en/blog/polyfills-for-edge-compatibility/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/azion-cells-technical-approach-and-the-future-of-serverless-computing.png'
  },
  {
    title: 'Building Modern Serverless Runtimes',
    description:
      'Discover how modern serverless runtimes built with Rust and V8 isolates outperform Node.js in performance and security, delivering faster execution times and enhanced memory safety through memory-safe architecture.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'FEB 7, 2025',
    href: 'https://www.azion.com/en/blog/building-modern-serverless-runtimes/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/7-the-next-generation-in-serverless-compute-azion-cells-1.png'
  },
  {
    title: 'How Technology Can Help You Comply with Regulations for Fintech',
    description:
      'Edge computing provides robust security, regulatory compliance, and intelligent monitoring for reliable, scalable operations.',
    contentType: 'Blog',
    categories: ['Security'],
    date: 'FEB 6, 2025',
    href: 'https://www.azion.com/en/blog/how-technology-can-help-comply-with-regulations-for-fintech/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/regulacionmexicana_thumblinkedin_440x343px.png'
  },
  {
    title: 'Boost Software Quality: Local Development with Azion CLI',
    description:
      'Master Edge Functions with Azion CLI for local development and testing. Enhance software security, optimize performance, and streamline debugging.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'APR 19, 2024',
    href: 'https://www.azion.com/en/blog/boost-software-quality-with-azion-cli-local-dev/',
    image: 'https://www.azion.com/assets/content/blog/uploads/local-dev.png'
  },
  {
    title: 'Azion Console Kit: Building a new interface',
    description:
      'Explore the Azion Console Kit, enhancing user interface for Edge Computing with innovative Azion Blocks and open source toolkits for robust app development.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'FEB 21, 2024',
    href: 'https://www.azion.com/en/blog/console-kit-building-a-new-interface/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-codeeditor-chatgpt-440x343px.png'
  },
  {
    title: 'Experts Speak: Cybersecurity Quotes on Zero-Trust & WAF',
    description:
      'Explore expert insights on cybersecurity, Zero Trust, social engineering, and WAF capabilities at Azion Edge.',
    contentType: 'Blog',
    categories: ['Security'],
    date: 'FEB 1, 2024',
    href: 'https://www.azion.com/en/blog/the-experts-speak-cybersecurity-quotes-about-zero-trust-waf-social-engineering/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbblog-whatiswaf-440x343px-1.png'
  },
  {
    title: "Leverage Edge Computing with Azion's New Templates",
    description:
      "Discover Azion's Edge Computing templates to enhance web app development, streamline deployment, and optimize performance with tools like MongoDB, Hexo, and Fauna.",
    contentType: 'Blog',
    categories: ['Company news'],
    date: 'JAN 29, 2024',
    href: 'https://www.azion.com/en/blog/azion-new-set-templates-dev/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-4templatesimproveexperience-440x343px-1.png'
  },
  {
    title: 'Azion Celebrates a 2023 Full of Achievements',
    description:
      "Discover how Azion's accolades like the Frost & Sullivan Award and Great Place to Work recognition affirm its edge computing superiority in 2023.",
    contentType: 'Blog',
    categories: ['Company news'],
    date: 'DEC 21, 2023',
    href: 'https://www.azion.com/en/blog/azion-celebrates-achievements-2023/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-2023-conquistas-440x343px.png'
  },
  {
    title: 'Forrester Names Azion a Strong Performer in Edge Dev',
    description:
      'Discover why Azion is a strong performer in The Forrester Wave™ for Edge Development Platforms in Q4 2023, enhancing enterprise edge solutions.',
    contentType: 'Blog',
    categories: ['Company news'],
    date: 'DEC 1, 2023',
    href: 'https://www.azion.com/en/blog/azion-recognized-strong-performer-forrester-wave-2023/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-forrester-wave2023-440x343px.png'
  },
  {
    title: 'Azion Wins Award at Santander X Global Challenge',
    description:
      'Azion wins at Santander X Global Challenge for innovative cybersecurity solutions, enhancing global security capabilities and fostering industry connections.',
    contentType: 'Blog',
    categories: ['Company news'],
    date: 'NOV 29, 2023',
    href: 'https://www.azion.com/en/blog/azion-awarded-at-santander-x-global-challenge/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-premio-santander-440x343px.png'
  },
  {
    title: "Remember Zero-Day Attacks Blocked by Azion's WAF",
    description:
      "Explore how Azion's Web Application Firewall provides robust defense against zero-day attacks, CVE-2021-41773 coverage, and WAF bypass prevention.",
    contentType: 'Blog',
    categories: ['Security'],
    date: 'NOV 6, 2023',
    href: 'https://www.azion.com/en/blog/remember-zero-day-attacks-blocked-by-azion-waf/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-zero-day-waf-440x343px.png'
  },
  {
    title: 'Azion Earns Frost & Sullivan 2023 Innovation Award',
    description:
      "Discover Azion's award-winning Edge Serverless platform, boosting developers' capabilities in building rapid, resilient applications with superior performance and global scalability.",
    contentType: 'Blog',
    categories: ['Company news'],
    date: 'OCT 25, 2023',
    href: 'https://www.azion.com/en/blog/azion-frost-sullivan-award/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-f-s-440x343px-1.png'
  },
  {
    title: 'Azion Code Editor Adds ChatGPT Assistant for Faster Dev',
    description:
      'Discover how Azion Edge Functions with ChatGPT Code Assistant and Preview Deployment revolutionize developer experience and agile development.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'OCT 23, 2023',
    href: 'https://www.azion.com/en/blog/next-level-development-efficiency-azion-edge-functions/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-codeeditor-chatgpt-440x343px.png'
  },
  {
    title: 'Fair Share or Network Fee: Pros and Cons of the Model',
    description:
      'Explore the impact of Fair Share and network neutrality on digital infrastructure and the implications for major internet players and service quality.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'OCT 19, 2023',
    href: 'https://www.azion.com/en/blog/fair-share-internet-toll/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-fairshare-440x343px.png'
  },
  {
    title: 'Azion Named Leader & Fast Mover in GigaOm Radar',
    description:
      'Azion hailed as a Leader and Fast Mover in the GigaOm Radar for Edge Platforms, emphasizing robust security and innovative edge computing solutions.',
    contentType: 'Blog',
    categories: ['Company news'],
    date: 'AUG 29, 2023',
    href: 'https://www.azion.com/en/blog/azion-named-leader-fast-mover-gigaom-report/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog-gigaom-440x343px-1.png'
  },
  {
    title: 'Universidad Iberoamericana Optimizes UX with Edge DNS',
    description:
      'Universidad Iberoamericana strengthened digital security and improved user experience with resilient DNS and application protection using Azion’s distributed infrastructure.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'JUL 27, 2023',
    href: 'https://www.azion.com/en/success-case/ibero/',
    industry: 'Education'
  },
  {
    title: 'Control Access to Your Platform With Scheduled Blocking Function',
    description:
      "Discover how Azion's Scheduled Blocking function enhances application access control. Learn to implement time-based access solutions with edge functions.",
    contentType: 'Blog',
    categories: ['Security'],
    date: 'JUN 21, 2023',
    href: 'https://www.azion.com/en/blog/control-access-to-your-platform-with-scheduled-blocking-function/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog_440x343px-2x.png'
  },
  {
    title: 'Protect Your Application From Session Theft With Azion',
    description:
      "Protect your applications from cookie tampering attacks with Azion's Signed Cookies solution. Learn how to secure your edge applications now!",
    contentType: 'Blog',
    categories: ['Security'],
    date: 'JUN 21, 2023',
    href: 'https://www.azion.com/en/blog/protect-your-application-from-session-theft-with-azion/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog.png'
  },
  {
    title: 'Azion Announces Solution That Blocks Oversized Requests',
    description:
      'Explore the Azion Marketplace for the Limit Payload Size solution to enhance application efficiency and secure data transfers with Edge Functions.',
    contentType: 'Blog',
    categories: ['Security'],
    date: 'MAY 29, 2023',
    href: 'https://www.azion.com/en/blog/azion-announces-solution-that-blocks-oversized-requests/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbblog-limitpayloadsize.png'
  },
  {
    title: "Azion's WAF Is Not Vulnerable to the CRLF Injection Bypass",
    description:
      "Discover how Azion's Web Application Firewall (WAF) excels in preventing CRLF injection attacks and other cybersecurity threats, safeguarding web applications effectively.",
    contentType: 'Blog',
    categories: ['Security'],
    date: 'MAR 23, 2023',
    href: 'https://www.azion.com/en/blog/azion-waf-not-affected-crlf-bypass/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbblogwaf-bypassakamai-2.png'
  },
  {
    title: 'EXAME Scales Election Traffic 40x with Azion',
    description:
      'Faster content delivery and resilient infrastructure enabled Exame to handle large traffic spikes during major news events.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'MAR 23, 2023',
    href: 'https://www.azion.com/en/success-case/exame/',
    industry: 'Media'
  },
  {
    title: 'Five Cases of IT Transformation with Edge Computing',
    description:
      'Discover the transformative power of Edge Computing through success stories from diverse sectors. Explore its impacts on cost reduction, application performance, and user experience.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'FEB 15, 2023',
    href: 'https://www.azion.com/en/blog/five-cases-of-it-transformation-with-edge-computing/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbblog-5truestories-mobile.png'
  },
  {
    title: 'How Justa Evolves Its Tech to Meet Modern Digital Demands',
    description:
      "Explore how Justa enhances payment security and simplifies compliance using Azion's Edge solutions, improving performance and customer experience in Brazil.",
    contentType: 'Blog',
    categories: ['Company news'],
    date: 'JAN 17, 2023',
    href: 'https://www.azion.com/en/blog/how-justa-has-been-evolving-its-technology-to-meet-modern-digital-demands/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog_justa_440x343px.png'
  },
  {
    title: "Recent WAF Bypass Attack Doesn't Affect Azion's WAF",
    description:
      "Discover how Azion's Web Application Firewall seamlessly blocks new SQL injection attacks using JSON syntax, ensuring robust cloud security.",
    contentType: 'Blog',
    categories: ['Security'],
    date: 'DEC 20, 2022',
    href: 'https://www.azion.com/en/blog/recent-waf-bypass-attack-does-not-affect-azion-web-application-firewall/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/vulnerabilidadewaf_thumblinkedin_440x343px.png'
  },
  {
    title: 'Cloud Computing or Edge Computing: Cost Comparison',
    description:
      'Explore the cost benefits of Edge Computing vs. cloud computing, learn about infrastructure savings, and how Edge enhances operational efficiency.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'DEC 19, 2022',
    href: 'https://www.azion.com/en/blog/cloud-computing-or-edge-computing-cost/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/edgecomputingcloudcomputing_thumblinkedin_440x343px.png'
  },
  {
    title: 'Azion Announces GraphQL API to Increase Observability',
    description:
      "Explore Azion's GraphQL API for real-time metrics and enhanced data observability, featuring improved performance and cost savings. Learn to access advanced security data and performance insights.",
    contentType: 'Blog',
    categories: ['Company news'],
    date: 'NOV 29, 2022',
    href: 'https://www.azion.com/en/blog/announcing-graphql-for-increased-observability/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/graphql_metrics_api_thumblinkedin_440x343px.png'
  },
  {
    title: 'Azion Achieves SOC 3 Compliance',
    description:
      "Explore Azion's SOC 3 compliance, ensuring our edge platform secures web applications and sites with top-tier data security and availability controls.",
    contentType: 'Blog',
    categories: ['Company news'],
    date: 'NOV 14, 2022',
    href: 'https://www.azion.com/en/blog/azion-achieves-soc-3-compliance/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnail-soc-2.png'
  },
  {
    title: 'Azion Introduces Product Suite for Comprehensive Edge Development',
    description:
      'Explore Azion Build for seamless edge app development with tools like Edge Functions, WebAssembly, and support for React frameworks.',
    contentType: 'Blog',
    categories: ['Company news'],
    date: 'NOV 9, 2022',
    href: 'https://www.azion.com/en/blog/azion-introduces-product-suite-for-comprehensive-edge-development/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblogpr_440x343px.png'
  },
  {
    title: 'WebAssembly on the Azion Edge Computing Platform',
    description:
      'Explore how WebAssembly enhances app modernization on Azion Web Platform, enabling secure, fast deployment and improved performance.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'NOV 3, 2022',
    href: 'https://www.azion.com/en/blog/webassembly-on-the-azion-platform-truly-embrace-the-edge/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnailblog_wasm.png'
  },
  {
    title: 'Challenges of Using BGP when Building a Global Edge Network',
    description:
      'Explore how Azion optimizes BGP for edge networks, enhancing security, performance, and reliability with intelligent routing solutions.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'NOV 2, 2022',
    href: 'https://www.azion.com/en/blog/challenges-of-BGP-when-building-global-edge-network/',
    image: 'https://www.azion.com/assets/content/blog/uploads/thumbnail_bgp_mofu.png'
  },
  {
    title: 'Simplifying and Accelerating Deliveries with Serverless Functions',
    description:
      'Explore how Azion Edge Functions streamline serverless JavaScript code execution for business, enhancing scalability, security, and efficiency.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'NOV 1, 2022',
    href: 'https://www.azion.com/en/blog/simplifying-and-accelerating-deliveries-with-serverless-functions/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/data-communications-and-cloud-computing-network-concept-picture-id1175136826.jpg'
  },
  {
    title: 'FourBank Protects Apps & APIs from DDoS with Azion',
    description:
      'FourBank strengthened the security of its financial services and increased resilience against DDoS attacks using the security capabilities of the Azion Platform.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'JUN 24, 2022',
    href: 'https://www.azion.com/en/success-case/fourbank/',
    industry: 'Tech'
  },
  {
    title: 'Todo Cartões Stops Gift Card Fraud with Azion',
    description:
      'Todo Cartões strengthened digital payment security and reduced fraud risks in gift cards using Azion’s distributed security infrastructure.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'MAY 16, 2022',
    href: 'https://www.azion.com/en/success-case/todo/',
    industry: 'Tech'
  },
  {
    title: 'Panvel Boosts E-commerce & Ensures 100% Uptime with Azion',
    description:
      'Over 60% faster applications and 86% offloaded traffic allowed Panvel to scale its e-commerce using Azion’s distributed platform.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'APR 18, 2022',
    href: 'https://www.azion.com/en/success-case/panvel/',
    industry: 'Retail'
  },
  {
    title: 'Contabilizei Boosts Performance 73% with Azion Caching',
    description:
      'Scalable infrastructure and optimized application performance enabled Contabilizei to support rapid growth of its digital accounting platform.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'APR 14, 2022',
    href: 'https://www.azion.com/en/success-case/contabilizei/',
    industry: 'Tech'
  },
  {
    title: 'Mobiauto Boosts Content Delivery 70% with Azion',
    description:
      'Mobiauto strengthened application scalability and sustained 500,000 simultaneous users during nationwide campaigns using Azion’s distributed infrastructure.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'APR 13, 2022',
    href: 'https://www.azion.com/en/success-case/mobiauto/',
    industry: 'Tech'
  },
  {
    title: 'Quero-Quero Protects APIs with Azion Firewall',
    description:
      'Explore how Quero-Quero protects its e-commerce platform with Azion Firewall, strengthening API security and ensuring high availability.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'APR 4, 2022',
    href: 'https://www.azion.com/en/success-case/quero-quero/',
    industry: 'Retail'
  },
  {
    title: 'Digimais Safeguards Its Digital Bank with Azion Firewall',
    description:
      'Digi+ increased the security and resilience of its digital banking services while scaling access for a growing customer base.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'APR 4, 2022',
    href: 'https://www.azion.com/en/success-case/digimais/',
    industry: 'Financial'
  },
  {
    title: 'Marisa Accelerates E-commerce, Delivers 85% of Traffic via Azion',
    description:
      'Discover how Marisa improved e-commerce performance with the Azion Platform, delivering 85% of traffic through distributed infrastructure, reducing origin costs, and supporting 96% online sales growth.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'APR 1, 2022',
    href: 'https://www.azion.com/en/success-case/marisa/',
    industry: 'Retail'
  },
  {
    title: 'FAM strengthens application and network protection with Azion Firewall capabilities',
    description:
      'Discover how FAM uses the security capabilities of the Azion Platform to implement a zero-trust model and protect academic applications with Firewall, WAF, and DDoS Protection.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'MAR 31, 2022',
    href: 'https://www.azion.com/en/success-case/fam/',
    industry: 'Education'
  },
  {
    title: 'How Azion DDoS Protection Mitigates the Main Types of DDoS Attacks',
    description:
      'Explore how Azion DDoS Protection leverages edge computing for advanced DDoS mitigation, ensuring high security with minimal latency and no service degradation.',
    contentType: 'Blog',
    categories: ['Security'],
    date: 'MAR 9, 2022',
    href: 'https://www.azion.com/en/blog/how-azion-ddos-protection-mitigates-the-main-types-of-ddos-attacks/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/ddos-protection-blog-post-thumbnail.png'
  },
  {
    title: 'Crefisa Accelerates Digital Transformation with Azion',
    description:
      'Discover how Crefisa modernized its digital infrastructure and reinforced application and API security using the security capabilities of Azion Platform.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'MAR 4, 2022',
    href: 'https://www.azion.com/en/success-case/crefisa/',
    industry: 'Financial'
  },
  {
    title: 'Pernambucanas Speeds E-commerce & CX with Azion',
    description:
      'Faster checkout performance and improved platform reliability helped Pernambucanas deliver better e-commerce experiences to millions of customers.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'FEB 21, 2022',
    href: 'https://www.azion.com/en/success-case/pernambucanas/pernambucanas-relies-on-azion-to-speed-up-its-e-commerce-platform-and-innovate-customer-experience-through-edge-applications/',
    industry: 'Retail'
  },
  {
    title: 'Pernambucanas Enhances Digital Security Model with Azion Platform',
    description:
      'Pernambucanas increased visibility into security events and strengthened e-commerce protection with automated mitigation and observability capabilities.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'FEB 21, 2022',
    href: 'https://www.azion.com/en/success-case/pernambucanas-built-a-robust-zero-trust-security-model-with-azions-platform/',
    industry: 'Retail'
  },
  {
    title: 'Edge Traffic Routing: Extending SDN to the Public Internet',
    description:
      "Explore how Azion's Edge Network leverages SDN for optimal routing and performance improvements in edge computing environments.",
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'FEB 17, 2022',
    href: 'https://www.azion.com/en/blog/edge-traffic-routing-for-extending-SDN-to-the-public-internet/',
    image: 'https://www.azion.com/assets/content/blog/uploads/edge-traffic-routing-thumbnail.jpg'
  },
  {
    title: 'MadeiraMadeira Cuts Cloud Costs 90% with Azion',
    description:
      'Faster product delivery and scalable infrastructure allowed MadeiraMadeira to support massive traffic growth during major e-commerce campaigns.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'FEB 16, 2022',
    href: 'https://www.azion.com/en/success-case/madeiramadeira/',
    industry: 'Retail'
  },
  {
    title: 'B2W Automates E-commerce Security with Azion Firewall',
    description:
      'B2W Digital strengthened e-commerce security by automating protection rules and increasing visibility into security events.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'FEB 9, 2022',
    href: 'https://www.azion.com/en/success-case/b2w/',
    industry: 'Retail'
  },
  {
    title: 'Dafiti Speeds E-commerce 86%, Cuts Costs 45% with Azion',
    description:
      'Dafiti modernized its digital architecture to deliver faster, scalable, and resilient experiences for millions of consumers across Latin America.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'FEB 7, 2022',
    href: 'https://www.azion.com/en/success-case/dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application/',
    industry: 'Retail'
  },
  {
    title: 'Dafiti Protects Payment Data with Azion Firewall',
    description:
      'Dafiti strengthened its e-commerce security by automatically blocking threats and ensuring compliance with standards such as PCI DSS.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'FEB 7, 2022',
    href: 'https://www.azion.com/en/success-case/dafiti/dafiti-azion-edge-firewall/',
    industry: 'Retail'
  },
  {
    title: 'Magalu Ensures High Availability at Scale with Azion',
    description:
      "Explore how Magalu enhances cybersecurity with Azion's Firewall and WAF, improving threat intelligence and bot management in retail.",
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'FEB 4, 2022',
    href: 'https://www.azion.com/en/success-case/magalu/',
    industry: 'Retail'
  },
  {
    title: 'Netshoes Blocks 4M+ Threats in 6 Months with Azion WAF',
    description:
      'Netshoes strengthened its e-commerce security and improved the shopping experience by blocking threats such as SQL Injection and XSS.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'FEB 4, 2022',
    href: 'https://www.azion.com/en/success-case/netshoes/',
    industry: 'Retail'
  },
  {
    title:
      "Azion's Edge DNS helps NZN increase the performance, security and reliability of its applications and improve the experience of millions of Internet users",
    description:
      'Explore how NZN enhances user experiences with Azion Edge DNS for improved content delivery, performance, and security against DNS attacks.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'NOV 3, 2021',
    href: 'https://www.azion.com/en/success-case/nzn/azion-intelligent-dns-helps-nzn-to-increase-performance-security-and-reliability-of-its-applications-and-delight-millions-of-users-in-brazil/',
    industry: 'Media'
  },
  {
    title: 'VTEX Builds Low-Latency Serverless Apps with Azion',
    description:
      'High-performance serverless applications enabled VTEX to accelerate global e-commerce experiences while maintaining low latency and high availability.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'AUG 12, 2021',
    href: 'https://www.azion.com/en/success-case/vtex/',
    industry: 'Tech'
  },
  {
    title: 'Why Azion Chose the V8 Engine for Edge Functions',
    description:
      "Explore how V8 Engine powers Azion's Edge Functions for enhanced security, efficiency, and speed in serverless computing at the network edge.",
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'AUG 10, 2021',
    href: 'https://www.azion.com/en/blog/why-azion-chose-v8/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/why-azion-chose-the-v8-engine-for-edge-functions.png'
  },
  {
    title: 'GetNinjas Improves Data Analysis with Azion',
    description:
      "GetNinjas now delivers about 70% of requests through Azion's infrastructure, reaching a hit rate of up to 80% and collecting over 3 TB of data to optimize performance, SEO, and security.",
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'AUG 10, 2021',
    href: 'https://www.azion.com/en/success-case/getninjas/',
    industry: 'Tech'
  },
  {
    title: 'NZN Builds 100+ Apps, Cuts Load Time 50% with Azion',
    description:
      'Discover how NZN leverages Azion’s distributed infrastructure to improve performance, optimize content delivery, and enhance user experience in Brazil.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'AUG 10, 2021',
    href: 'https://www.azion.com/en/success-case/nzn/nzn-creates-more-than-100-edge-applications-and-reduces-their-websites-loading-time-by-50-using-the-azion-platform/',
    industry: 'Media'
  },
  {
    title: 'Lojas Renner Optimizes Online Shopping Journey with Azion',
    description:
      'Faster product pages and more resilient digital shopping experiences allowed Renner to scale its e-commerce platform using Azion’s distributed infrastructure.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'AUG 10, 2021',
    href: 'https://www.azion.com/en/success-case/renner/',
    industry: 'Retail'
  },
  {
    title: 'UniCesumar Improves Distance Learning 70% with Azion',
    description:
      'Scalable infrastructure and faster application delivery allowed UniCesumar to improve digital education experiences for thousands of online students.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'AUG 10, 2021',
    href: 'https://www.azion.com/en/success-case/unicesumar/',
    industry: 'Education'
  },
  {
    title: 'UNINTER Delivers Low-Latency Video Lessons with Azion',
    description:
      'Reliable digital learning experiences enabled Uninter to scale its online education platform and support thousands of students accessing classes simultaneously.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'AUG 10, 2021',
    href: 'https://www.azion.com/en/success-case/uninter/',
    industry: 'Education'
  },
  {
    title: 'Agi Blocks Threats & Boosts Observability with Azion',
    description:
      'Explore how Agi leverages Firewall and Data Stream on the Azion Platform to enhance cybersecurity and ensure continuous service availability.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'AUG 10, 2021',
    href: 'https://www.azion.com/en/success-case/agibank/',
    industry: 'Financial'
  },
  {
    title: 'Omelete Builds Dozens of Apps on Azion to Scale Content',
    description:
      'High-traffic media experiences became faster and more reliable as Omelete scaled its entertainment platform to millions of users.',
    contentType: 'Success stories',
    categories: [
      'Developers',
      'Security',
      'Company news',
      'Market trends',
      'Routing',
      'Serverless',
      'Caching',
      'Orchestration',
      'Observability',
      'Routing and networking'
    ],
    date: 'AUG 6, 2021',
    href: 'https://www.azion.com/en/success-case/omelete/',
    industry: 'Media'
  },
  {
    title: "How JAMStack improved Azion's LCP performance",
    description:
      "Discover how Azion's JAMStack integration enhances site performance, reduces resource use, and improves LCP for optimal loading times.",
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'JUN 1, 2021',
    href: 'https://www.azion.com/en/blog/how-lcp-performance-improved-with-jamstack/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/overcoming-the-challenges-of-video-streaming-with-edge-application-ds-682-4.png'
  },
  {
    title: 'How Azion started using JAMStack',
    description:
      'Explore how Azion adopted JAMStack for seamless content scaling, reducing dependency on developers and enhancing web development with SSGs.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'MAY 3, 2021',
    href: 'https://www.azion.com/en/blog/how-azion-started-using-jamstack/',
    image: 'https://www.azion.com/assets/content/blog/uploads/group-4386.png'
  },
  {
    title: 'Strengthening Routing Security',
    description:
      'Explore how Azion partners with MANRS by the Internet Society to enhance global internet security and BGP protocol stability.',
    contentType: 'Blog',
    categories: ['Security'],
    date: 'MAR 2, 2021',
    href: 'https://www.azion.com/en/blog/strengthening-routing-security/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/thumbnail-strengthening-routing-security.png'
  },
  {
    title: 'Azion Introduces Edge Functions',
    description:
      'Explore Azion Edge Functions: serverless, event-driven JavaScript solutions for low-latency, high-performance applications with enhanced security and monitoring.',
    contentType: 'Blog',
    categories: ['Company news'],
    date: 'JAN 15, 2021',
    href: 'https://www.azion.com/en/blog/azion-introduces-edge-functions/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/azion-introduces-edge-functions-thumb.png'
  },
  {
    title: 'Azion Cells and the Future of Serverless Computing',
    description:
      'Explore Azion Cells for ultra-low latency, edge-native applications, built with open standards for secure, high-performance serverless computing.',
    contentType: 'Blog',
    categories: ['Developers'],
    date: 'OCT 14, 2020',
    href: 'https://www.azion.com/en/blog/azion-cells-future-serverless-computing/',
    image:
      'https://www.azion.com/assets/content/blog/uploads/azion-cells-technical-approach-and-the-future-of-serverless-computing.png'
  }
]
