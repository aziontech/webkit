const learnMore = (href) => ({ label: 'Learn more', href })

export const SOLUTIONS_SECTION = {
  _id: 'media-split-stack',
  props: {
    kind: 'media-end',
    bands: [
      {
        image: '/marketing-components/illustrations/quick-start-with-templates.svg',
        title: 'Modern applications',
        description:
          'Build static sites, run serverless applications, or modernize legacy systems.',
        action: learnMore('/en/solutions/web-apps/')
      },
      {
        illustration: 'improve-application-performance-and-reliability',
        title: 'Optimized workloads',
        description:
          'Speed up applications, deliver content through the CDN, and process images on demand.',
        action: learnMore('/en/solutions/performance/')
      },
      {
        illustration: 'ai-applications',
        title: 'AI applications',
        description:
          'Build and deploy AI agents and AI-powered applications on a distributed platform, with inference close to users.',
        action: learnMore('/en/solutions/ai/')
      },
      {
        illustration: 'automate-threat-mitigation',
        title: 'Protected applications and APIs',
        description:
          'Protect web applications and APIs (WAAP), manage bots, and enforce programmable security policies at scale.',
        action: learnMore('/en/solutions/security/')
      },
      {
        illustration: 'content-and-media-delivery',
        title: 'Media and streaming content',
        description:
          'Stream video and deliver large files at low latency to audiences of any size, with media processed close to viewers.',
        action: learnMore('/en/solutions/streaming/')
      }
    ]
  }
}

export const ALTERNATING_SECTION = {
  _id: 'media-split-stack',
  props: {
    kind: 'alternating',
    eyebrow: 'Managed Infrastructure',
    title: 'Stop managing regions and capacity by hand',
    bands: [
      {
        title: 'Run closer to users',
        description:
          'Handle requests close to users instead of sending everything back to a few central regions. That cuts latency, absorbs spikes automatically, and reduces backhaul.',
        illustration: 'fastest-path-to-live-website',
        illustrationLabel: 'Requests served from the data center nearest the user',
        action: learnMore('/en/products/application-accelerator/')
      },
      {
        title: 'Keep delivery, logic, and data in one place',
        description:
          'Run delivery, execution, and data on one platform. APIs and dynamic applications get real-time request handling, origin protection, and state kept next to the code with KV Store.',
        illustration: 'runtime',
        illustrationLabel: 'Delivery, execution and data served from one platform',
        action: learnMore('/en/products/kv-store/')
      },
      {
        title: 'Get better routes and more stable delivery',
        description:
          'Traffic enters inside ISP last-mile networks and connects through IXPs, peering, and Tier 1 transit. Fewer hops mean better routes and stable delivery during traffic spikes, upstream issues, and regional incidents.',
        illustration: 'distributed-apis',
        illustrationLabel: 'Entry points inside ISP networks, connected through IXPs and transit',
        action: learnMore('/en/products/load-balancer/')
      },
      {
        title: 'Stop attack traffic earlier',
        description:
          'Block attack traffic in the delivery path, before it reaches your origin. Deploy code and policies and let the platform handle scaling, execution, and traffic steering. Your team manages fewer regions, less capacity, and fewer scaling rules.',
        illustration: 'automate-threat-mitigation',
        illustrationLabel: 'Attack traffic stopped in the delivery path, before the origin',
        action: learnMore('/en/products/ddos-protection/')
      }
    ]
  }
}
