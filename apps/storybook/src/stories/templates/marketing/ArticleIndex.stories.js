import Avatar from '@aziontech/webkit/avatar'
import Button from '@aziontech/webkit/button'
import FrameBox from '@aziontech/webkit/frame-box'
import InputText from '@aziontech/webkit/input-text'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import Select, { SelectContent, SelectOption, SelectTrigger } from '@aziontech/webkit/select'
import { ref } from 'vue'

import { editable } from '../../_shared/editable-content'
import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
import { noMatches, quoted, searchScript, searchSlot, searchState } from '../../_shared/select-search'
import { toSfc } from '../../_shared/story-source'

const ALL = 'All articles'

const CATEGORIES = [
  ALL,
  'Developers',
  'Security',
  'Company news',
  'Market trends',
  'Serverless',
  'Caching',
  'Observability',
  'Routing and networking'
].map((category) => ({ label: category, value: category }))

const ROWS = [
  {
    href: '/blog/ship-portfolio-two-commands-azion-cli',
    image: '/media/blog/ship-portfolio-two-commands.png',
    meta: 'Developers • SEP 25, 2026',
    title: 'How I Shipped My Portfolio in Just Two Commands',
    description:
      "See how a portfolio site went from template to live URL with just azion init and azion deploy, running free on Azion's Hobby plan.",
    authors: ['Patrick Menoti'],
    byline: 'Patrick Menoti · 9 min read'
  },
  {
    href: '/blog/how-to-reduce-ai-agent-latency',
    image: '/media/blog/reduce-ai-agent-latency.png',
    meta: 'Serverless • SEP 23, 2026',
    title: 'How Do You Reduce AI Agent Latency?',
    description:
      'Learn where latency builds up in AI agents and how to reduce delays across inference, tools, memory, and state with distributed architecture, caching, and observability.',
    authors: ['Marilia Bafutto Costa'],
    byline: 'Marilia Bafutto Costa · 8 min read'
  },
  {
    href: '/blog/cloudflare-alternatives-and-competitors',
    image: '/media/blog/best-cloudflare-alternatives.png',
    meta: 'Security • SEP 22, 2026',
    title: 'Best Cloudflare Alternatives and Competitors',
    description:
      'Compare six Cloudflare alternatives for CDN delivery, security, and application hosting. Assess trade-offs, operating costs, and migration paths with Azion.',
    authors: ['Vitor Eltz'],
    byline: 'Vitor Eltz · 13 min read'
  },
  {
    href: '/blog/which-azion-plan-is-right-for-your-project',
    image: '/media/blog/which-azion-plan.png',
    meta: 'Company news • SEP 22, 2026',
    title: 'Which Azion Plan Is Right for Your Project?',
    description:
      'Compare Azion’s Hobby, Pro, and Enterprise plans for personal projects, production applications, and operations that need customized terms.',
    authors: ['Marilia Bafutto Costa'],
    byline: 'Marilia Bafutto Costa · 7 min read'
  }
]

const FACETS = [
  {
    key: 'contentType',
    label: 'Content type',
    options: ['All content types', 'E-books', 'Blog', 'Comparisons', 'Success stories']
  },
  {
    key: 'category',
    label: 'Category',
    options: [
      'All categories',
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
    options: ['All industries', 'Financial', 'Fintech', 'EdTech', 'Retail', 'Tech', 'Education', 'Media']
  }
]

const RESOURCES = [
  {
    href: 'https://www.azion.com/en/lp/security-applications-apis-ai-agents/',
    image: 'https://www.azion.com/assets/content/blog/uploads/Rich%20contentsdark.png',
    meta: 'E-books • OCT 15, 2026',
    title: 'Security for applications, APIs, and AI agents',
    description:
      'Learn how to bring security policies into deployment, automate protection, and monitor traffic across applications, APIs, and AI agents.'
  },
  {
    href: 'https://www.azion.com/en/blog/azion-mcp-servers-generally-available/',
    image: 'https://www.azion.com/assets/content/blog/uploads/mcp-ga/Azion-MCP.svg',
    meta: 'Blog • OCT 14, 2026',
    title: 'Azion MCP servers: Connect Your Coding Agent to Azion',
    description:
      'Azion MCP servers connect Claude Code, Cursor, and other coding agents to the Azion documentation and API, with a dry_run preview before each write.'
  },
  {
    href: 'https://www.azion.com/en/lp/cloudflare-to-azion-alternative-guide/',
    image: 'https://www.azion.com/assets/content/lp/uploads/og-image/og-img-cf-to-azion.png',
    meta: 'Comparisons • OCT 3, 2026',
    title: 'Cloudflare Alternative Comparison: Azion vs Cloudflare',
    description:
      'Azion vs Cloudflare: the same platform on every plan, more than one way to recover from failures, and Enterprise support that answers in minutes.'
  },
  {
    href: 'https://www.azion.com/en/lp/f5-to-azion-alternative-guide/',
    image: 'https://www.azion.com/assets/content/lp/uploads/og-image/og-img-f5-to-azion.png',
    meta: 'Comparisons • OCT 3, 2026',
    title: 'F5 Alternative Comparison: Azion vs F5',
    description:
      'Azion vs F5: one managed platform for every application. No appliances, no licensing matrix, and a path off BIG-IP one app at a time.'
  }
]


const BASE_IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'"
]

const BLOG_IMPORTS = [
  "import Avatar from '@aziontech/webkit/avatar'",
  ...BASE_IMPORTS,
  "import InputText from '@aziontech/webkit/input-text'",
  "import SegmentedButton from '@aziontech/webkit/segmented-button'",
  "import { ref } from 'vue'",
  '',
  `const categories = [\n${CATEGORIES.map(({ label, value }) => `  { label: ${quoted(label)}, value: ${quoted(value)} }`).join(',\n')}\n]`,
  '',
  `const category = ref(${quoted(ALL)})`,
  '',
  "const query = ref('')"
]

const narrowing = (facet) => facet.options.slice(1)

const HUB_IMPORTS = [
  ...BASE_IMPORTS,
  "import InputText from '@aziontech/webkit/input-text'",
  "import Select from '@aziontech/webkit/select'",
  "import { computed, ref } from 'vue'",
  '',
  ...FACETS.flatMap((facet) => [
    `const ${facet.key}Options = [${facet.options.map(quoted).join(', ')}]`,
    ''
  ]),
  ...FACETS.map((facet) => `const ${facet.key} = ref(${quoted(facet.options[0])})`),
  ...FACETS.flatMap((facet) => ['', ...searchScript(facet.key, `${facet.key}Options.slice(1)`)])
]

const components = {
  Avatar,
  Button,
  FrameBox,
  InputText,
  SectionContainer,
  SectionGap,
  SectionModule,
  SegmentedButton,
  Select,
  'Select.Trigger': SelectTrigger,
  'Select.Content': SelectContent,
  'Select.Option': SelectOption
}

const blogSetup = () => ({ categories: CATEGORIES, category: ref(ALL), query: ref('') })

const hubSetup = () =>
  Object.fromEntries(
    FACETS.flatMap((facet) => [
      [`${facet.key}Options`, facet.options],
      [facet.key, ref(facet.options[0])],
      ...Object.entries(searchState(facet.key, narrowing(facet)))
    ])
  )

const toolbar = (controls) => `<FrameBox flush borders="y" marks="none">
  <div
    role="search"
    class="flex flex-col gap-(--spacing-md) px-(--spacing-xl) py-(--spacing-lg) lg:flex-row lg:items-center lg:justify-between"
  >
${indent(controls, 2)}
  </div>
</FrameBox>`

const BLOG_CONTROLS = `<div class="min-w-0 overflow-x-auto">
  <SegmentedButton
    v-model="category"
    :options="categories"
    aria-label="Category"
    size="medium"
  />
</div>

<div class="w-full shrink-0 lg:w-(--container-3xs)">
  <InputText
    v-model="query"
    size="medium"
    type="text"
    placeholder="Search articles"
    aria-label="Search articles"
  >
    <template #iconLeft>
      <i class="pi pi-search text-(--text-muted)" />
    </template>
  </InputText>
</div>`

const searchedSelect = (facet) => `<Select
  v-model="${facet.key}"
  size="medium"
  class="w-full sm:w-56"
  @update:open="${facet.key}Query = ''"
>
  <Select.Trigger aria-label="${facet.label}" />
  <Select.Content>
${indent(searchSlot(facet.key, facet.label), 2)}
    <Select.Option :value="${facet.key}Options[0]">
      {{ ${facet.key}Options[0] }}
    </Select.Option>
    <Select.Option
      v-for="option in ${facet.key}Matches"
      :key="option"
      :value="option"
    >
      {{ option }}
    </Select.Option>
${indent(noMatches(facet.key), 2)}
  </Select.Content>
</Select>`

const HUB_CONTROLS = `<h2 class="m-0 text-heading-md text-(--text-default)">
  Explore all resources
</h2>

<div class="flex flex-col gap-(--spacing-sm) sm:flex-row">
${each(FACETS, searchedSelect, 1)}
</div>`

const author = (name) => `<Avatar
  kind="circle"
  size="small"
  label="${name}"
  alt="${name}"
  class="ring-2 ring-(--bg-canvas)"
/>`

const byline = (article) =>
  article.byline
    ? `
<span class="flex items-center gap-(--spacing-sm) text-body-sm text-(--text-muted)">
  <span class="flex shrink-0 -space-x-(--spacing-xs)">
${each(article.authors, author, 2)}
  </span>
  <span>${article.byline}</span>
</span>`
    : ''

const row = (article, index) => `<li>${
  index > 0
    ? `
  <div
    aria-hidden="true"
    class="h-(--spacing-lg) border-y border-(--border-default)"
  />`
    : ''
}
  <article
    class="group/row relative grid transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none lg:grid-cols-[minmax(0,2fr)_minmax(0,5fr)]"
  >
    <div
      class="flex aspect-40/21 items-center justify-center overflow-hidden border-b border-(--border-default) bg-(--bg-surface) lg:border-r lg:border-b-0"
    >
      <img
        src="${article.image}"
        alt=""
        loading="lazy"
        class="size-full object-cover"
      />
    </div>
    <div class="flex min-w-0 gap-(--spacing-lg) px-(--spacing-xl) py-(--spacing-lg)">
      <div
        class="flex min-w-0 flex-1 flex-col justify-between gap-(--spacing-sm) group-data-[kind=centered]/rows:justify-center"
      >
        <div class="flex flex-col gap-(--spacing-sm)">
          <span class="text-overline-sm text-(--text-muted)">${article.meta}</span>
          <h3 class="m-0">
            <a
              href="${article.href}"
              class="text-pretty text-heading-sm text-(--text-default) no-underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-(--ring-color)"
            >
              ${article.title}
            </a>
          </h3>
          <p class="m-0 line-clamp-2 text-pretty text-body-sm text-(--text-muted)">
            ${article.description}
          </p>
        </div>${indent(byline(article), 4)}
      </div>
      <span
        aria-hidden="true"
        class="flex shrink-0 translate-y-1 items-center self-center gap-(--spacing-xxs) whitespace-nowrap text-overline-md text-(--text-default) uppercase opacity-0 transition-[opacity,translate] duration-moderate-01 ease-productive-entrance group-hover/row:translate-y-0 group-hover/row:opacity-100 group-has-[a:focus-visible]/row:translate-y-0 group-has-[a:focus-visible]/row:opacity-100 motion-reduce:transition-none max-lg:hidden"
      >
        Read article
        <i class="pi pi-arrow-up-right leading-none" />
      </span>
    </div>
  </article>
</li>`

const list = ({ kind, label, rows }) => `<FrameBox flush borders="y" marks="bottom">
  <ul
    aria-label="${label}"
    data-kind="${kind}"
    class="group/rows m-0 flex list-none flex-col p-0"
  >
${each(rows, row, 2)}
  </ul>
</FrameBox>`

const MORE = `<FrameBox flush borders="y" marks="bottom">
  <div class="flex justify-center p-(--spacing-xl)">
    <Button label="Load more" kind="outlined" size="large" />
  </div>
</FrameBox>`

const band = ({ anchor, controls, rows }) =>
  inColumn(`<SectionModule
  id="${anchor}"
  :divided="false"
  :padded="false"
  class="scroll-mt-(--spacing-xxl)"
>
${indent(toolbar(controls), 1)}

${indent(rows, 1)}

${indent(MORE, 1)}
</SectionModule>`)

const BLOG_TEMPLATE = band({
  anchor: 'posts',
  controls: BLOG_CONTROLS,
  rows: list({ kind: 'byline', label: 'Articles', rows: ROWS })
})

const HUB_TEMPLATE = band({
  anchor: 'resources',
  controls: HUB_CONTROLS,
  rows: list({ kind: 'centered', label: 'Resources', rows: RESOURCES })
})

const meta = {
  title: 'Templates/Marketing/Listings/ArticleIndex',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'Every article of a listing as one list, with the controls to narrow it on one row: an optional headline, a category picker, one dropdown per facet and a search field, each shown only when the page supplies it. Every article is a ruled row with its cover on the left and, on the right, its overline, its headline, a two-line deck and, in the `byline` layout, the writers pinned to the foot of the copy; the `centered` layout centres the copy for rows with no byline. Each row is one link, named by its headline; the whole row is clickable with the pointer, and a “Read article” cue rises into its end on hover or keyboard focus from `lg` up. Category, facets and search intersect; until a filter applies, the list can leave out the articles a highlight band above already shows, and when nothing matches an empty state offers to clear every filter. Below `lg` the controls stack and the cover sits over the copy. The Blog page uses it for its posts and the Resource Hub for its resources. Built from `SectionModule`, `FrameBox`, `SegmentedButton`, `Select`, `InputText`, `Avatar`, `Button` and, when nothing matches, `EmptyState`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const AllArticles = {
  ...editable(() => ({ components, setup: blogSetup, template: BLOG_TEMPLATE })),
  parameters: {
    docs: {
      description: {
        story:
          'The Blog page’s list at rest: All articles selected and no search, with the category picker and the search field, rows in the `byline` layout, and the button into the next page.'
      },
      source: { code: toSfc(BLOG_IMPORTS, BLOG_TEMPLATE) }
    }
  }
}

export const ResourceHub = {
  ...editable(() => ({ components, setup: hubSetup, template: HUB_TEMPLATE })),
  parameters: {
    docs: {
      description: {
        story:
          'The Resource Hub’s list: a headline beside three facet dropdowns (content type, category, industry) and no search, with rows in the `centered` layout, each a cover, its type and date, its headline and its deck.'
      },
      source: { code: toSfc(HUB_IMPORTS, HUB_TEMPLATE) }
    }
  }
}
