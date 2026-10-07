import Faq from '@aziontech/webkit/faq'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'

import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
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
      'You can build and deploy storefronts, marketplaces, marketing campaign pages, and supporting retail apps, but in fact any web app or website runs on Azion. The platform also provides the primitives to build not only the storefront but much of the backend, with support for static and dynamic workloads on a distributed architecture.'
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
      'Yes. Azion integrates with modern headless commerce, CMS, and API-based architectures, enabling teams to keep existing workflows while improving performance and reliability.'
  },
  {
    value: 'q6',
    question: 'How does Azion help with SEO and Core Web Vitals?',
    answer:
      'By reducing latency, optimizing content delivery, and improving responsiveness, Azion helps improve user experience signals that affect Core Web Vitals and search performance.'
  },
  {
    value: 'q7',
    question: 'What happens during peak shopping events like Black Friday?',
    answer:
      'Scaling is automatic. Azion handles traffic surges without manual provisioning, helping teams maintain availability and performance during launches, campaigns, and seasonal peaks.'
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
      'Azion Functions is a serverless platform for running code on distributed infrastructure with up to 5 minutes of CPU time per execution. Key features include: zero cold starts, 20MB bundle size, TypeScript/JavaScript support, WebAssembly runtime, and native framework support for Next.js, React, Vue, and Astro. Deploy API handlers, authentication, data pipelines, and browser automation without managing servers.'
  },
  {
    value: 'vs-workers',
    question: 'How does Functions compare to Cloudflare Workers?',
    answer:
      'Both platforms offer serverless compute with zero cold starts. The key difference is CPU time: Azion Functions supports extended execution, while Cloudflare Workers is optimized for lightweight request handlers. This makes Azion suitable for longer-running workloads like data transformation and browser automation. Cloudflare offers broader global distribution and multi-language support (Python, Rust, etc.). Choose Azion for compute-intensive jobs; choose Cloudflare for maximum global distribution.'
  },
  {
    value: 'languages',
    question: 'Which languages and frameworks are supported?',
    answer:
      'Functions supports TypeScript and JavaScript natively, plus WebAssembly for compiled extensions. Frameworks with native CLI support include Next.js, Vue, React, Angular, Gatsby, and Astro. The runtime provides web-standard APIs, extended Node.js APIs, and WebAssembly support.'
  },
  {
    value: 'cold-starts',
    question: 'Are there cold starts?',
    answer:
      'No. Functions are designed for consistent first-request performance with zero cold starts on the Azion Web Platform. Initial requests perform as fast as subsequent requests—critical for user-facing APIs and authentication flows.'
  },
  {
    value: 'cpu-time',
    question: 'What can I do with 5 minutes of CPU time?',
    answer:
      "Extended CPU time enables workloads that traditional serverless platforms can't handle: browser automation with Puppeteer, complex data transformation pipelines, image and video processing, AI inference jobs, and multi-step API orchestration. You don't need to architect around execution limits or set up external orchestration services."
  },
  {
    value: 'limits',
    question: 'What are the execution limits?',
    answer:
      'Functions support up to 5 minutes of CPU time per execution and bundle sizes up to 20 MB. These limits are designed for production workloads requiring extended processing time.'
  },
  {
    value: 'deploy',
    question: 'How do I deploy Functions?',
    answer:
      'Deploy from Git repositories with continuous deployment or use the Azion CLI (`azion init`, `azion build`, `azion deploy`). Functions integrate with Applications and Firewall via Rules Engine for request-time execution.'
  },
  {
    value: 'observability',
    question: 'How do I monitor and debug Functions?',
    answer:
      'Functions include built-in observability with metrics, logs, and per-request execution traces. You can troubleshoot issues directly in the console or stream data to external tools via Data Stream.'
  },
  {
    value: 'data-access',
    question: 'Can Functions access databases and storage?',
    answer:
      'Yes. Functions can connect to SQL Database, KV Store, and Object Storage using native APIs in the runtime. This enables building complete applications with data persistence on a single platform.'
  },
  {
    value: 'migrate',
    question: 'How do I migrate from Cloudflare Workers?',
    answer:
      "Both platforms use JavaScript/TypeScript, so code migration is straightforward for most functions. Export your Worker code, initialize an Azion Function, adapt runtime APIs, and deploy. If using Cloudflare KV/R2/D1, migrate data to Azion SQL Database, KV Store, or Object Storage. Lightweight request handlers can work on both platforms; longer-running functions benefit from Azion's extended execution time."
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
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The frequently-asked-questions band near the foot of a landing page: a framed panel with the heading on the left and the questions as a single-open disclosure list on the right, every answer closed until the reader opens it. The section carries the `faq` id so a page can link straight to it. Retail, Web Apps, AI Workloads, Security, Performance and Streaming render it through the solution template; the Functions, Cache and Application Accelerator product pages, Pricing and Vercel Alternative render the plain form. GDPR’s answers run to several paragraphs and bullet lists with links inside them, so its questions take the rich form. Built from `SectionModule` and `Faq`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const WithLink = {
  render: () => ({ components, template: WITH_LINK_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Retail page’s ten questions, rendered through the `answer` slot so an answer can continue into a link and the text after it: the second question ends on a link to the frameworks compatibility list, opened in a new tab, followed by its closing full stop. The link sits inside the answer’s sentence, so it is a plain anchor styled with the `text-link` class: it takes the answer’s size and line height and the link colour, with the underline and focus ring on hover and focus. Answers without a link render as plain text.'
      },
      source: { code: toSfc(IMPORTS, WITH_LINK_TEMPLATE) }
    }
  }
}

export const Plain = {
  render: () => ({ components, template: PLAIN_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Functions product page’s ten questions, every answer plain text, so the band passes its items and leaves the `answer` slot out.'
      },
      source: { code: toSfc(IMPORTS, PLAIN_TEMPLATE) }
    }
  }
}

export const RichAnswers = {
  render: () => ({ components, template: RICH_ANSWERS_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The GDPR page’s first four questions, whose answers are more than one sentence: each item carries a `body` of blocks, paragraphs and bullet lists, and each block a run of text and link segments, so a link can sit anywhere inside a sentence. The `answer` slot walks the blocks; external links open in a new tab, and a segment with no destination renders as plain text. `Faq` sets every answer inside a paragraph, so the blocks are spans (`display: block` for a paragraph, `role="list"` with `list-item` children for a bullet list) to stay valid inside it. Each item’s `value` is its question’s slug on the GDPR page.'
      },
      source: { code: toSfc(IMPORTS, RICH_ANSWERS_TEMPLATE) }
    }
  }
}
