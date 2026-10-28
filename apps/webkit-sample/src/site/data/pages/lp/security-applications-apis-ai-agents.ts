import type { LandingPage } from '.'

export default {
  lang: 'en',
  source: 'https://www.azion.com/en/lp/security-applications-apis-ai-agents/',
  sections: [
    {
      section: 'HeroForm',
      title: 'Security for applications, APIs, and AI agents',
      paragraphs: [
        {
          lead: 'AI brings new applications, routes, and integrations into production faster.',
          text: 'How can security keep pace? In this ebook, discover how to bring protection policies into deployment, automate their application, and monitor traffic across applications, APIs, and AI agents from the moment they go live.'
        }
      ],
      carouselMarks: [],
      labels: { email: 'Work email', submit: 'Download the ebook' }
    },
    {
      section: 'CapabilityGrid',
      items: [
        {
          title: "What you'll learn",
          description:
            'How to incorporate protection into deployment and apply reusable policies to AI-built applications, agent endpoints, and APIs using WAF, rate limiting, and controls against automated abuse.'
        },
        {
          title: 'Who it’s for',
          description:
            'CISOs, security architects, DevSecOps teams, platform engineers, and teams responsible for deploying applications and AI agents to production.'
        },
        {
          title: 'Why it matters',
          description:
            'AI accelerates delivery, but protection doesn’t always keep pace. Beyond reviewing code, teams need to control traffic after deployment.'
        },
        {
          title: 'What changes',
          description:
            'New applications go live with protection policies in place. Security teams maintain governance, while engineering teams automate the application of controls.'
        }
      ]
    },
    {
      section: 'ClosingCallToAction',
      kind: 'split',
      title: 'Build modern applications',
      description: 'Access to all features.',
      actions: [{ label: 'Start Free', href: '/site/pricing', kind: 'secondary' }]
    }
  ]
} satisfies LandingPage
