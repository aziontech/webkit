import Brand from '@aziontech/webkit/brand'
import Footer from '@aziontech/webkit/footer'
import IconButton from '@aziontech/webkit/icon-button'
import Select from '@aziontech/webkit/select'
import StatusIndicator from '@aziontech/webkit/status-indicator'
import { onBeforeUnmount, ref } from 'vue'

export const SITE_FOOTER_COLUMNS = [
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

export const SITE_FOOTER_SOCIALS = [
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

export const SITE_FOOTER_LANGUAGES = ['EN', 'PT-BR', 'ES']

export const BRAND_LINK_CLASS =
  'inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)'

export const SITE_FOOTER_COMPONENTS = {
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

export const SITE_FOOTER_IMPORTS = [
  "import Brand from '@aziontech/webkit/brand'",
  "import Footer from '@aziontech/webkit/footer'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import Select from '@aziontech/webkit/select'",
  "import StatusIndicator from '@aziontech/webkit/status-indicator'"
]

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

export const LG_PROBE_IMPORT = "import { onBeforeUnmount, ref } from 'vue'"

export const LG_PROBE_SETUP = [
  "const lgProbe = document.createElement('span')",
  "lgProbe.className = 'hidden lg:block'",
  'document.body.append(lgProbe)',
  "const isLg = () => getComputedStyle(lgProbe).display !== 'none'",
  'const brandLeadsSocialRow = ref(isLg())',
  'const syncBrand = () => {',
  '  brandLeadsSocialRow.value = isLg()',
  '}',
  "window.addEventListener('resize', syncBrand)",
  'onBeforeUnmount(() => {',
  "  window.removeEventListener('resize', syncBrand)",
  '  lgProbe.remove()',
  '})'
]

export const SITE_FOOTER_SETUP = [
  `const columns = ${literal(SITE_FOOTER_COLUMNS)}`,
  '',
  `const socials = ${literal(SITE_FOOTER_SOCIALS)}`,
  '',
  `const languages = ${literal(SITE_FOOTER_LANGUAGES)}`,
  "const language = ref('EN')",
  '',
  ...LG_PROBE_SETUP
]

export const useSiteFooter = () => {
  const lgProbe = globalThis.document.createElement('span')
  lgProbe.className = 'hidden lg:block'
  globalThis.document.body.append(lgProbe)
  const isLg = () => globalThis.getComputedStyle(lgProbe).display !== 'none'
  const brandLeadsSocialRow = ref(isLg())
  const syncBrand = () => {
    brandLeadsSocialRow.value = isLg()
  }
  globalThis.addEventListener('resize', syncBrand)
  onBeforeUnmount(() => {
    globalThis.removeEventListener('resize', syncBrand)
    lgProbe.remove()
  })

  return {
    columns: SITE_FOOTER_COLUMNS,
    socials: SITE_FOOTER_SOCIALS,
    languages: SITE_FOOTER_LANGUAGES,
    language: ref('EN'),
    brandLeadsSocialRow
  }
}

export const siteFooterMarkup = (kind) => `<div class="w-full border-t border-(--border-default)">
  <Footer kind="${kind}" aria-label="Footer">
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
        size="small"
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
