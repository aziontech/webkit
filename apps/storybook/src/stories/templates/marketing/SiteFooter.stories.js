import Brand from '@aziontech/webkit/brand'
import Footer from '@aziontech/webkit/footer'
import IconButton from '@aziontech/webkit/icon-button'
import Select from '@aziontech/webkit/select'
import StatusIndicator from '@aziontech/webkit/status-indicator'
import { onBeforeUnmount, ref } from 'vue'

import { toSfc } from '../../_shared/story-source'

const COLUMNS = [
  {
    title: 'Products',
    links: [
      'Functions',
      'Cache',
      'Object Storage',
      'SQL Database',
      'WAF',
      'Edge DNS',
      'Data Stream'
    ]
  },
  {
    title: 'Solutions',
    links: ['Web Apps', 'AI', 'Application Security', 'Financial Services', 'Retail', 'Technology']
  },
  {
    title: 'Developers',
    links: ['Documentation', 'API Reference', 'Dev Tools', 'Release Notes', 'Marketplace', 'Status']
  },
  {
    title: 'Company',
    links: ['About', 'Customers', 'Partners', 'Careers', 'Blog', 'Contact']
  }
]

const SOCIALS = [
  { icon: 'pi pi-github', label: 'Azion on GitHub', href: 'https://github.com/aziontech' },
  {
    icon: 'pi pi-linkedin',
    label: 'Azion on LinkedIn',
    href: 'https://www.linkedin.com/company/aziontech'
  },
  { icon: 'pi pi-youtube', label: 'Azion on YouTube', href: 'https://www.youtube.com/aziontech' },
  { icon: 'ai ai-x', label: 'Azion on X', href: 'https://x.com/aziontech' },
  {
    icon: 'pi pi-instagram',
    label: 'Azion on Instagram',
    href: 'https://www.instagram.com/aziontech'
  },
  { icon: 'pi pi-discord', label: 'Azion on Discord', href: 'https://discord.gg/azion' },
  { icon: 'pi pi-reddit', label: 'Azion on Reddit', href: 'https://www.reddit.com/r/aziontech' }
]

const LANGUAGES = ['EN', 'PT-BR', 'ES']

const WIDE_QUERY = '(min-width: 1024px)'

const quoted = (text) => `'${text.replaceAll("'", "\\'")}'`

const literal = (value, depth = 0) => {
  const pad = '  '.repeat(depth + 1)
  const end = '  '.repeat(depth)
  if (typeof value === 'string') return quoted(value)
  if (Array.isArray(value)) {
    const inline = `[${value.map((entry) => literal(entry, depth + 1)).join(', ')}]`
    return value.every((entry) => typeof entry === 'string') && inline.length + depth * 2 <= 96
      ? inline
      : `[\n${value.map((entry) => `${pad}${literal(entry, depth + 1)}`).join(',\n')}\n${end}]`
  }
  const entries = Object.entries(value).map(([key, entry]) => [key, literal(entry, depth + 1)])
  const inline = `{ ${entries.map(([key, entry]) => `${key}: ${entry}`).join(', ')} }`
  return !inline.includes('\n') && inline.length + depth * 2 <= 96
    ? inline
    : `{\n${entries.map(([key, entry]) => `${pad}${key}: ${entry}`).join(',\n')}\n${end}}`
}

const IMPORTS = [
  "import Brand from '@aziontech/webkit/brand'",
  "import Footer from '@aziontech/webkit/footer'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import Select from '@aziontech/webkit/select'",
  "import StatusIndicator from '@aziontech/webkit/status-indicator'",
  "import { onBeforeUnmount, ref } from 'vue'",
  '',
  `const columns = ${literal(COLUMNS)}`,
  '',
  `const socials = ${literal(SOCIALS)}`,
  '',
  `const languages = ${literal(LANGUAGES)}`,
  "const language = ref('EN')",
  '',
  `const wideQuery = window.matchMedia(${quoted(WIDE_QUERY)})`,
  'const brandLeadsSocialRow = ref(wideQuery.matches)',
  'const onWideChange = (event) => {',
  '  brandLeadsSocialRow.value = event.matches',
  '}',
  "wideQuery.addEventListener('change', onWideChange)",
  "onBeforeUnmount(() => wideQuery.removeEventListener('change', onWideChange))"
]

const BRAND_LINK_CLASS =
  'inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)'

const TEMPLATE = `<div class="w-full border-t border-(--border-default)">
  <Footer kind="site" aria-label="Footer">
    <Footer.Column v-for="column in columns" :key="column.title" :title="column.title">
      <Footer.Link v-for="link in column.links" :key="link" href="#">{{ link }}</Footer.Link>
    </Footer.Column>

    <template #social>
      <a
        v-if="brandLeadsSocialRow"
        href="#"
        aria-label="Azion home"
        class="${BRAND_LINK_CLASS} mr-(--spacing-xs)"
      >
        <Brand size="small" />
      </a>
      <IconButton
        v-for="social in socials"
        :key="social.label"
        kind="transparent"
        :icon="social.icon"
        :aria-label="social.label"
        :href="social.href"
        target="_blank"
      />
    </template>

    <template #status>
      <StatusIndicator severity="success" label="All Systems Operational" />
    </template>

    <template #language>
      <div class="w-28">
        <Select v-model="language" placeholder="Language">
          <Select.Trigger aria-label="Language">
            <template #iconLeft>
              <i class="pi pi-globe text-(--text-muted)" aria-hidden="true" />
            </template>
          </Select.Trigger>
          <Select.Content>
            <Select.Option v-for="option in languages" :key="option" :value="option">
              {{ option }}
            </Select.Option>
          </Select.Content>
        </Select>
      </div>
    </template>

    <template v-if="!brandLeadsSocialRow" #brand>
      <a
        href="#"
        aria-label="Azion home"
        class="${BRAND_LINK_CLASS} mx-auto"
      >
        <Brand size="small" />
      </a>
    </template>
  </Footer>
</div>`

const components = {
  Brand,
  Footer,
  'Footer.Column': Footer.Column,
  'Footer.Link': Footer.Link,
  IconButton,
  Select,
  'Select.Trigger': Select.Trigger,
  'Select.Content': Select.Content,
  'Select.Option': Select.Option,
  StatusIndicator
}

const meta = {
  title: 'Templates/Marketing/Shell/SiteFooter',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The footer under every marketing page: four link columns, then the social row beside the status indicator and the language select. `Footer kind="site"` caps its bands at the page frame’s measure and draws that frame: the side rules, the hatched gutters, the corner marks and the full-bleed bottom rule that closes the page. The hairline above it is the mirror of the hero’s top rule, so the frame turns the corner instead of stopping at it. The page above must not draw a bottom rule of its own. Built from `Footer` (`Footer.Column`, `Footer.Link`), `Brand`, `IconButton`, `StatusIndicator` and `Select`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup() {
      const wideQuery = globalThis.matchMedia(WIDE_QUERY)
      const brandLeadsSocialRow = ref(wideQuery.matches)
      const onWideChange = (event) => {
        brandLeadsSocialRow.value = event.matches
      }
      wideQuery.addEventListener('change', onWideChange)
      onBeforeUnmount(() => wideQuery.removeEventListener('change', onWideChange))

      return {
        columns: COLUMNS,
        socials: SOCIALS,
        languages: LANGUAGES,
        language: ref('EN'),
        brandLeadsSocialRow
      }
    },
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The site’s own footer. From `lg` the Azion mark leads the social row at the social glyphs’ size; below it the mark moves to the footer’s signature band and the icons get the row to themselves. The `#brand` slot is withheld rather than hidden on wide screens, because the footer opens that band whenever the slot is given. The language select’s values are the labels the reader sees, since its trigger shows the value.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
