import Avatar from '@aziontech/webkit/avatar'
import Button from '@aziontech/webkit/button'
import FrameBox from '@aziontech/webkit/frame-box'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import { ref } from 'vue'

import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const ALL = 'All Articles'

const CATEGORIES = [
  ALL,
  'Developers',
  'Security',
  'Company News',
  'Market Trends',
  'Serverless',
  'Caching',
  'Observability',
  'Routing & Networking'
].map((category) => ({ label: category, value: category }))

const ROWS = [
  {
    href: '/blog/cloudflare-alternatives-and-competitors',
    meta: 'Security · SEP 22, 2026',
    title: 'Best Cloudflare Alternatives and Competitors',
    authors: ['Vitor Eltz'],
    byline: 'Vitor Eltz · 13 min read'
  },
  {
    href: '/blog/which-azion-plan-is-right-for-your-project',
    meta: 'Company News · SEP 22, 2026',
    title: 'Which Azion Plan Is Right for Your Project?',
    authors: ['Marilia Bafutto Costa'],
    byline: 'Marilia Bafutto Costa · 7 min read'
  },
  {
    href: '/blog/optimize-operations-at-scale-azion-enterprise-plan',
    meta: 'Developers · SEP 14, 2026',
    title: 'How to Optimize Operations at Scale with the Azion Enterprise Plan',
    authors: ['Marilia Bafutto Costa'],
    byline: 'Marilia Bafutto Costa · 7 min read'
  },
  {
    href: '/blog/azion-pro-plan-personal-project-to-product',
    meta: 'Developers · SEP 10, 2026',
    title: 'Azion Pro Plan: When Your Personal Project Becomes a Product',
    authors: ['Marilia Bafutto Costa'],
    byline: 'Marilia Bafutto Costa · 4 min read'
  }
]

const quoted = (text) => `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

const IMPORTS = [
  "import Avatar from '@aziontech/webkit/avatar'",
  "import Button from '@aziontech/webkit/button'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Item from '@aziontech/webkit/item'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SegmentedButton from '@aziontech/webkit/segmented-button'",
  "import { ref } from 'vue'",
  '',
  `const categories = [\n${CATEGORIES.map(({ label, value }) => `  { label: ${quoted(label)}, value: ${quoted(value)} }`).join(',\n')}\n]`,
  '',
  `const category = ref(${quoted(ALL)})`,
  '',
  "const query = ref('')"
]

const components = {
  Avatar,
  Button,
  FrameBox,
  InputText,
  Item,
  'Item.Actions': Item.Actions,
  'Item.Content': Item.Content,
  'Item.List': Item.List,
  'Item.Title': Item.Title,
  SectionContainer,
  SectionGap,
  SectionModule,
  SegmentedButton
}

const setup = () => ({ categories: CATEGORIES, category: ref(ALL), query: ref('') })

const TOOLBAR = `<FrameBox flush borders="y" marks="none">
  <div
    role="search"
    class="flex flex-col gap-(--spacing-md) px-(--spacing-xl) py-(--spacing-lg) lg:flex-row lg:items-center lg:justify-between"
  >
    <div class="min-w-0 overflow-x-auto">
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
    </div>
  </div>
</FrameBox>`

const author = (name) => `<Avatar
  kind="circle"
  size="small"
  label="${name}"
  alt="${name}"
  class="ring-2 ring-(--bg-canvas)"
/>`

const row = (
  article
) => `<Item class="group/row relative px-(--spacing-xl)! py-(--spacing-lg)! transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) motion-reduce:transition-none">
  <Item.Content class="min-w-0 gap-(--spacing-sm)">
    <span class="text-body-sm text-(--text-muted)">${article.meta}</span>
    <Item.Title>
      <a
        href="${article.href}"
        class="text-pretty text-heading-sm text-(--text-default) after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
      >
        ${article.title}
      </a>
    </Item.Title>
    <span class="flex items-center gap-(--spacing-sm) text-body-sm text-(--text-muted)">
      <span class="flex shrink-0 -space-x-(--spacing-xs)">
${each(article.authors, author, 4)}
      </span>
      <span>${article.byline}</span>
    </span>
  </Item.Content>
  <Item.Actions class="max-sm:hidden">
    <span
      aria-hidden="true"
      class="flex translate-y-1 items-center gap-(--spacing-xxs) whitespace-nowrap text-overline-md text-(--text-default) uppercase opacity-0 transition-[opacity,translate] duration-moderate-01 ease-productive-entrance group-hover/row:translate-y-0 group-hover/row:opacity-100 group-has-[a:focus-visible]/row:translate-y-0 group-has-[a:focus-visible]/row:opacity-100 motion-reduce:transition-none"
    >
      Read article
      <i class="pi pi-arrow-up-right leading-none" />
    </span>
  </Item.Actions>
</Item>`

const LIST = `<FrameBox flush borders="y" marks="bottom">
  <Item.List aria-label="Articles">
${each(ROWS, row, 2)}
  </Item.List>
</FrameBox>`

const MORE = `<FrameBox flush borders="y" marks="bottom">
  <div class="flex justify-center p-(--spacing-xl)">
    <Button label="Show more" kind="outlined" size="large" />
  </div>
</FrameBox>`

const TEMPLATE = inColumn(`<SectionModule
  id="posts"
  :divided="false"
  :padded="false"
  class="scroll-mt-(--spacing-xxl)"
>
${indent(TOOLBAR, 1)}

${indent(LIST, 1)}

${indent(MORE, 1)}
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Content/ArticleIndex',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Every article of a blog as one list, with the controls to narrow it: a category picker and a search field on one row, then one row per article with its category and date, its headline and its byline, and a button that lists the next page. Each row is one link, named by its headline; the whole row is clickable with the pointer, and a “Read article” cue rises into its end on hover or keyboard focus. Until a filter applies, the list leaves out the articles the highlight band above already shows; when nothing matches, an empty state offers to clear every filter. Below `lg` the controls stack. The Blog page (/blog) uses it for its posts. Built from `SectionModule`, `FrameBox`, `SegmentedButton`, `InputText`, `Item`, `Avatar`, `Button` and, when nothing matches, `EmptyState`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const AllArticles = {
  render: () => ({ components, setup, template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Blog page’s list at rest: All Articles selected and no search, starting after the four newest posts the highlight shows, with the first rows of the page and the button into the next.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
