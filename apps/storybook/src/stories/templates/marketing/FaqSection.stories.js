import Faq from '@aziontech/webkit/faq'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'

import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import Faq from '@aziontech/webkit/faq'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'"
]

const components = {
  Faq,
  SectionContainer,
  SectionGap,
  SectionModule
}

const RETAIL = [
  {
    value: 'q1',
    question: 'What types of storefronts can I build and deploy on Azion?',
    answer:
      'You can build and deploy storefronts, marketplaces, campaign pages, and supporting retail apps. Any web app or website runs on Azion. The platform also covers much of the backend, for static and dynamic workloads on a distributed architecture.'
  },
  {
    value: 'q2',
    question: 'Which frameworks are compatible?',
    answer:
      'Azion is compatible with modern frameworks such as Next.js, React, Vue, Astro, Angular, Nuxt, Svelte, and others, so you can reuse your current stack without a full rewrite. See the full ',
    link: {
      label: 'frameworks compatibility list',
      href: 'https://www.azion.com/en/documentation/products/devtools/azion-edge-runtime/frameworks-compatibility/'
    },
    answerAfter: '.'
  },
  {
    value: 'q3',
    question: 'How do preview deployments work?',
    answer:
      'You can validate storefront changes in preview environments before release, share results across teams, and promote approved versions to production with a controlled workflow.'
  },
  {
    value: 'q4',
    question: 'Can I personalize pages without hurting performance?',
    answer:
      'Yes. You can run request-time logic for personalization by route, headers, cookies, and geography while maintaining fast page delivery through integrated caching and runtime controls.'
  },
  {
    value: 'q5',
    question: 'Can I integrate my existing commerce platform, CMS, and APIs?',
    answer:
      'Yes. Azion integrates with modern headless commerce, CMS, and API-based architectures, so teams keep their existing workflows while performance and reliability improve.'
  },
  {
    value: 'q6',
    question: 'How does Azion help with SEO and Core Web Vitals?',
    answer:
      'Azion reduces latency, optimizes content delivery, and improves responsiveness. Those improve the user experience signals behind Core Web Vitals and search performance.'
  },
  {
    value: 'q7',
    question: 'What happens during peak shopping events like Black Friday?',
    answer:
      'Scaling is automatic. Azion handles traffic surges without manual provisioning, so availability and performance hold during launches, campaigns, and seasonal peaks.'
  },
  {
    value: 'q8',
    question: 'Can I migrate gradually from my current cloud or CDN setup?',
    answer:
      'Yes. You can modernize incrementally by routing selected paths and workloads through Azion first, then expanding over time without disrupting your existing storefronts.'
  },
  {
    value: 'q9',
    question: 'Is Azion ready for enterprise compliance requirements?',
    answer:
      'Yes. Azion supports enterprise requirements with certifications such as SOC 2 Type 2, SOC 3, and PCI DSS, in addition to privacy commitments aligned with major regulations.'
  },
  {
    value: 'q10',
    question: 'How do I get started quickly?',
    answer:
      'Start with the Azion CLI and templates. A simple workflow like `azion init`, `azion build`, and `azion deploy` takes your storefront from a local project to global deployment.'
  }
]

const FUNCTIONS = [
  {
    value: 'what-is',
    question: 'What are Functions?',
    answer:
      'Azion Functions runs JavaScript and TypeScript in the request flow of an application or a firewall, across 100+ data centers, with no cold starts. A Rules Engine rule calls the function, and it answers with a Response. There is no server to provision or scale.'
  },
  {
    value: 'languages',
    question: 'Which languages and frameworks are supported?',
    answer:
      'JavaScript and TypeScript, plus WebAssembly through the WebAssembly API. The runtime follows web standards such as fetch, Streams and Web Crypto, and can import 68 Node.js modules. azion init ships 25 presets, including Next.js, Nuxt, React, Vue, Astro, Angular, Svelte, Qwik and Hono.'
  },
  {
    value: 'cold-starts',
    question: 'Are there cold starts?',
    answer:
      'No. Each function runs in a V8 isolate, so the first request performs like every request after it. That matters most for user-facing APIs, authentication and inference.'
  },
  {
    value: 'limits',
    question: 'What are the execution limits?',
    answer:
      'Each invocation gets 2 seconds of CPU time and up to 5 minutes of wall-clock time, so waiting on I/O does not count against the CPU budget. An isolate has 512 MB of memory, and code can be up to 6 MB from the Console or 20 MB through the API.'
  },
  {
    value: 'application-or-firewall',
    question: 'Should a function run on an application or a firewall?',
    answer:
      'On an application, a function runs in the request or response phase, after routing, to rewrite requests or build responses. On a firewall, it runs before the request reaches an application, and it can refuse the request with ctx.deny().'
  },
  {
    value: 'data-access',
    question: 'Can Functions access databases and storage?',
    answer:
      'Yes, through runtime globals that need no keys: Azion.KV for KV Store, Azion.Sql for SQL Database and Azion.AI for AI Inference, plus the azion/storage library for Object Storage. A SQL Database connection opened from a function is read-only; writes go through the Azion API.'
  },
  {
    value: 'deploy',
    question: 'How do I deploy Functions?',
    answer:
      'From the terminal, azion init scaffolds a project, azion dev serves it on localhost:3333, and azion deploy puts it on a live domain. In the Console, create the function, instance it on an application, and add a rule that runs it. A coding agent can do the same through the Azion MCP servers.'
  },
  {
    value: 'variables',
    question: 'How do environment variables and secrets work?',
    answer:
      'Create them with azion create variables or in the Console, and read them with Azion.env.get(). Keys that name a token, a key, a secret or auth are stored as secrets by default. A change takes effect on the next deploy.'
  },
  {
    value: 'observability',
    question: 'How do I monitor and debug Functions?',
    answer:
      'Every console.log lands in Real-Time Events, in the Functions Console tab, with its level and request id. Stream the same events out with Data Stream, or follow them live with azion logs cells --tail.'
  },
  {
    value: 'pricing',
    question: 'How are Functions priced?',
    answer:
      'By requests and compute time. Hobby is free, with 3M function requests and 8 hours of compute time a month. Pro is $25 a month, with 10M requests and 10 hours. Enterprise plans are custom.'
  },
  {
    value: 'migrate',
    question: 'How do I migrate from Cloudflare Workers?',
    answer:
      'Both run JavaScript in V8 isolates behind a fetch handler, so most handlers move with small changes. Keep the handler, swap the platform bindings for KV Store, SQL Database and Object Storage, and deploy with azion deploy.'
  }
]

const GDPR = [
  {
    value: 'what-is-gdpr',
    question: 'What is GDPR?',
    answer: '',
    body: [
      {
        type: 'p',
        segments: [
          {
            text: "The General Data Protection Regulation (GDPR) is a data privacy law implemented by the European Union. It went into effect on May 25, 2018, and is considered one of the world's leading data privacy legislations."
          }
        ]
      },
      {
        type: 'p',
        segments: [
          {
            text: 'The goal of GDPR is to honor the privacy of persons residing in the EU, by protecting their:'
          }
        ]
      },
      {
        type: 'ul',
        items: [
          [{ text: 'Right to be informed' }],
          [{ text: 'Right of access' }],
          [{ text: 'Right to rectification' }],
          [{ text: 'Right to erasure' }],
          [{ text: 'Right to restriction of processing' }],
          [{ text: 'Right to data portability' }],
          [{ text: 'Right to object' }],
          [{ text: 'Right to avoid automated decision-making' }]
        ]
      }
    ]
  },
  {
    value: 'why-is-gdpr-necessary',
    question: 'Why is GDPR necessary?',
    answer: '',
    body: [
      {
        type: 'p',
        segments: [
          {
            text: 'A majority of the businesses using Azion either reside in the EU or have customers there. We are honoring our responsibility to comply with the rights of the recipients living in the EU.'
          }
        ]
      },
      {
        type: 'p',
        segments: [
          {
            text: "GDPR compliance is not only an obligation for Azion, but also for many of the businesses using Azion. Azion's compliance allows even more businesses to build their operations on top of Azion's infrastructure without compromises to privacy or compliance."
          }
        ]
      }
    ]
  },
  {
    value: 'who-audited-azion',
    question: 'Who audited Azion?',
    answer: '',
    body: [
      {
        type: 'p',
        segments: [
          {
            text: 'Unlike SOC 2 or ISO 27001, GDPR is not a best practice standard but rather a law. Because of this, most companies self-audit to align their operations and technology with the GDPR controls. Azion followed this approach.'
          }
        ]
      },
      {
        type: 'p',
        segments: [
          { text: 'Azion also uses ' },
          { text: 'Vanta', href: 'https://vanta.com', external: true },
          { text: ' to monitor all GDPR controls and organize evidence for compliance.' }
        ]
      }
    ]
  },
  {
    value: 'how-do-i-get-a-signed-dpa',
    question: 'How do I get a signed DPA?',
    answer: '',
    body: [
      {
        type: 'p',
        segments: [
          {
            text: 'A GDPR Article 28 Data Processing Addendum is in force for every Azion account. It is pre-signed by Azion and fully executed once you sign up, so there is no separate counter-signature step.'
          }
        ]
      },
      {
        type: 'p',
        segments: [
          { text: 'You can download the signed copy from the ' },
          { text: 'Documents' },
          { text: ' page (login required). The unsigned reference version is our public ' },
          { text: 'DPA' },
          { text: '.' }
        ]
      }
    ]
  }
]

const quoted = (value) => `'${value.replace(/'/g, "\\'").replace(/"/g, '&quot;')}'`

const faqLiteral = (item, index, list) => {
  const fields = [
    `  value: ${quoted(item.value)}`,
    `  question: ${quoted(item.question)}`,
    `  answer: ${quoted(item.answer)}`,
    ...(item.link
      ? [
          `  link: { label: ${quoted(item.link.label)}, href: ${quoted(item.link.href)} }`,
          `  answerAfter: ${quoted(item.answerAfter)}`
        ]
      : [])
  ]
  return ['{', fields.join(',\n'), `}${index < list.length - 1 ? ',' : ''}`].join('\n')
}

const segmentLiteral = (segment) =>
  `{ ${[
    `text: ${quoted(segment.text)}`,
    ...(segment.href ? [`href: ${quoted(segment.href)}`] : []),
    ...(segment.external ? ['external: true'] : [])
  ].join(', ')} }`

const segmentsLiteral = (segments) => `[\n${indent(segments.map(segmentLiteral).join(',\n'))}\n]`

const blockLiteral = (block) =>
  block.type === 'p'
    ? `{\n  type: 'p',\n  segments: ${indent(segmentsLiteral(block.segments)).trimStart()}\n}`
    : `{\n  type: 'ul',\n  items: [\n${indent(
        block.items.map((entry) => `[${entry.map(segmentLiteral).join(', ')}]`).join(',\n'),
        2
      )}\n  ]\n}`

const richLiteral = (item, index, list) =>
  [
    '{',
    [
      `  value: ${quoted(item.value)}`,
      `  question: ${quoted(item.question)}`,
      `  answer: ''`,
      `  body: [\n${indent(item.body.map(blockLiteral).join(',\n'), 2)}\n  ]`
    ].join(',\n'),
    `}${index < list.length - 1 ? ',' : ''}`
  ].join('\n')

const SEGMENTS = (list) => `<template
  v-for="(segment, segmentIndex) in ${list}"
  :key="segmentIndex"
>
  <a
    v-if="segment.href"
    :href="segment.href"
    :target="segment.external ? '_blank' : undefined"
    :rel="segment.external ? 'noopener noreferrer' : undefined"
    class="text-link"
    >{{ segment.text }}</a
  >
  <template v-else>{{ segment.text }}</template>
</template>`

const RICH_ANSWER_SLOT = `<template #answer="{ item }">
  <span class="flex flex-col gap-(--spacing-sm)">
    <template
      v-for="(block, blockIndex) in item.body"
      :key="blockIndex"
    >
      <span
        v-if="block.type === 'p'"
        class="block"
      >
${indent(SEGMENTS('block.segments'), 4)}
      </span>
      <span
        v-else
        role="list"
        class="block space-y-(--spacing-xxs) pl-(--spacing-lg)"
      >
        <span
          v-for="(entry, entryIndex) in block.items"
          :key="entryIndex"
          role="listitem"
          class="list-item list-disc"
        >
${indent(SEGMENTS('entry'), 5)}
        </span>
      </span>
    </template>
  </span>
</template>`

const ANSWER_SLOT = `<template #answer="{ item }">
  {{ item.answer
  }}<a
    v-if="item.link"
    :href="item.link.href"
    target="_blank"
    rel="noopener"
    class="text-link"
    >{{ item.link.label }}</a
  >{{ item.answerAfter }}
</template>`

const faqSection = (items, { slot = '', literal = faqLiteral } = {}) => {
  const list = `:items="[
${each(items, (item, index) => literal(item, index, items), 1)}
]"`
  const faq = slot
    ? `<Faq
  framed
  title="Frequently Asked Questions"
${indent(list)}
>
${indent(slot)}
</Faq>`
    : `<Faq
  framed
  title="Frequently Asked Questions"
${indent(list)}
/>`
  return inColumn(`<SectionModule
  id="faq"
  :divided="false"
  :padded="false"
>
${indent(faq)}
</SectionModule>`)
}

const WITH_LINK_TEMPLATE = faqSection(RETAIL, { slot: ANSWER_SLOT })
const PLAIN_TEMPLATE = faqSection(FUNCTIONS)
const RICH_ANSWERS_TEMPLATE = faqSection(GDPR, { slot: RICH_ANSWER_SLOT, literal: richLiteral })

const meta = {
  title: 'Templates/Marketing/Content/FaqSection',
  excludeStories: ['WITH_LINK_SECTION', 'PLAIN_SECTION'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const WithLink = {
  render: () => ({ components, template: WITH_LINK_TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, WITH_LINK_TEMPLATE) }
    }
  }
}

export const WITH_LINK_SECTION = {
  _id: 'faq-section',
  props: {
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'What types of storefronts can I build and deploy on Azion?',
        answer:
          'You can build and deploy storefronts, marketplaces, campaign pages, and supporting retail apps. Any web app or website runs on Azion. The platform also covers much of the backend, for static and dynamic workloads on a distributed architecture.'
      },
      {
        question: 'Which frameworks are compatible?',
        answer:
          'Azion is compatible with modern frameworks such as Next.js, React, Vue, Astro, Angular, Nuxt, Svelte, and others, so you can reuse your current stack without a full rewrite. See the full [frameworks compatibility list](/en/documentation/products/devtools/azion-edge-runtime/frameworks-compatibility/).'
      },
      {
        question: 'How do preview deployments work?',
        answer:
          'You can validate storefront changes in preview environments before release, share results across teams, and promote approved versions to production with a controlled workflow.'
      }
    ]
  }
}

export const WithLinkJson = {
  tags: ['!dev'],
  ...siteJsonStory(WITH_LINK_SECTION)
}

export const Plain = {
  render: () => ({ components, template: PLAIN_TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, PLAIN_TEMPLATE) }
    }
  }
}

export const PLAIN_SECTION = {
  _id: 'faq-section',
  props: {
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'What are Functions?',
        answer:
          'Azion Functions runs JavaScript and TypeScript in the request flow of an application or a firewall, across 100+ data centers, with no cold starts. A Rules Engine rule calls the function, and it answers with a Response. There is no server to provision or scale.'
      },
      {
        question: 'Are there cold starts?',
        answer:
          'No. Each function runs in a V8 isolate, so the first request performs like every request after it. That matters most for user-facing APIs, authentication and inference.'
      },
      {
        question: 'Which languages and frameworks are supported?',
        answer:
          'JavaScript and TypeScript, plus WebAssembly through the WebAssembly API. The runtime follows web standards such as fetch, Streams and Web Crypto, and can import 68 Node.js modules. azion init ships 25 presets, including Next.js, Nuxt, React, Vue, Astro, Angular, Svelte, Qwik and Hono.'
      }
    ]
  }
}

export const PlainJson = {
  tags: ['!dev'],
  ...siteJsonStory(PLAIN_SECTION)
}

export const RichAnswers = {
  render: () => ({ components, template: RICH_ANSWERS_TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, RICH_ANSWERS_TEMPLATE) }
    }
  }
}
