import Button from '@aziontech/webkit/button'
import CallToAction from '@aziontech/webkit/call-to-action'
import CopyButton from '@aziontech/webkit/copy-button'
import FieldText from '@aziontech/webkit/field-text'
import FrameBox from '@aziontech/webkit/frame-box'
import InputGroup, { InputGroupAddon } from '@aziontech/webkit/input-group'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import TextureMaterial from '@aziontech/webkit/texture-material'
import Ticker from '@aziontech/webkit/ticker'
import { toast, Toaster } from '@aziontech/webkit/toast'
import { onMounted, onScopeDispose, ref } from 'vue'

import { COLUMN_IMPORTS, indent } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CallToAction from '@aziontech/webkit/call-to-action'",
  "import CopyButton from '@aziontech/webkit/copy-button'",
  "import FieldText from '@aziontech/webkit/field-text'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import InputGroup, { InputGroupAddon } from '@aziontech/webkit/input-group'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'",
  "import SegmentedButton from '@aziontech/webkit/segmented-button'",
  "import TextureMaterial from '@aziontech/webkit/texture-material'",
  "import Ticker from '@aziontech/webkit/ticker'",
  "import { Toaster, toast } from '@aziontech/webkit/toast'"
]

const components = {
  Button,
  CallToAction,
  CopyButton,
  FieldText,
  FrameBox,
  InputGroup,
  InputGroupAddon,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle,
  SegmentedButton,
  TextureMaterial,
  Ticker,
  Toaster
}

const closingColumn = (markup) =>
  `<SectionContainer max-width="site">\n  <SectionGap hatch />\n\n${indent(markup)}\n</SectionContainer>`

const SPLIT_TEMPLATE = closingColumn(`<SectionModule
  id="contact"
  :divided="false"
  :padded="false"
  class="scroll-mt-(--spacing-xxl)"
>
  <CallToAction
    framed
    kind="split"
    eyebrow="Build"
    title="Build once."
    title-muted="Run everywhere."
    description="Get a faster path to launch, lower latency, and less infrastructure overhead."
  >
    <template #actions>
      <Button label="Start free" kind="secondary" size="large" href="/signup" />
    </template>
    <template #aside>
      <Button
        label="Talk to an expert"
        kind="outlined"
        size="large"
        href="#"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
      />
    </template>
  </CallToAction>
</SectionModule>
<FrameBox
  borders="none"
  marks="all"
  data-hatch="true"
  class="h-[calc(var(--spacing-xxl)*2)]"
>
  <TextureMaterial kind="lines" />
</FrameBox>`)

const PANEL_TEMPLATE = closingColumn(`<SectionModule :divided="false" :padded="false">
  <CallToAction
    framed
    title="Ready to join us?"
    description="See our open positions and find the right fit."
  >
    <template #actions>
      <Button
        label="See open roles"
        kind="secondary"
        size="large"
        href="/careers/jobs"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
      />
    </template>
  </CallToAction>
</SectionModule>

<FrameBox
  borders="none"
  marks="all"
  data-hatch="true"
  class="h-(--spacing-xxl)"
>
  <TextureMaterial kind="lines" />
</FrameBox>`)

const PRIMARY_BENEFITS = `[
        { icon: 'ai ai-edge-nodes', label: 'Deployed to 100+ data centers automatically' },
        { icon: 'ai ai-edge-functions', label: 'No regions to pick, no servers to manage' },
        { icon: 'ai ai-origin-shield', label: 'Stop attacks before they reach your origin' },
        { icon: 'ai ai-edge-firewall', label: 'DDoS mitigation with no surprise charges' },
        { icon: 'pi pi-dollar', label: 'Usage-based pricing with no hidden fees' },
        { icon: 'pi pi-gift', label: 'Start with $300 in free credits' },
        { icon: 'ai ai-azion-cli', label: 'Deploy from the CLI, the Console or an agent' },
        { icon: 'ai ai-real-time-metrics', label: 'Real-time events and metrics for every request' },
        { icon: 'ai ai-real-time-purge', label: 'Purge the cache everywhere in real time' },
        { icon: 'pi pi-code', label: 'Works with Vue, React, Next.js, Astro and more' },
        { icon: 'ai ai-edge-ai', label: 'Run AI inference next to your users' },
        { icon: 'ai ai-edge-sql', label: 'A SQL database close to users, no setup' },
        { icon: 'ai ai-edge-storage', label: 'Object storage with no egress fees' },
        { icon: 'ai ai-waf-rules', label: 'WAF and bot protection on by default' },
        { icon: 'ai ai-tiered-cache', label: 'Tiered cache that shields your origin' },
        { icon: 'ai ai-data-stream', label: 'Stream every log to the tools you already use' }
      ]`
const PRIMARY_TEMPLATE = closingColumn(`<SectionModule
  id="contact"
  :divided="false"
  :padded="false"
  class="scroll-mt-(--spacing-xxl)"
>
  <CallToAction
    framed
    kind="primary"
    title="Build, run, and protect applications everywhere."
    description="Get faster launches, lower latency, and less infrastructure overhead from day one."
  >
    <template #background>
      <TextureMaterial kind="pixelate" size="small" fade="bottom" />
    </template>
    <template #actions>
      <Button label="Start free" kind="secondary" size="large" href="/signup" />
      <Button
        label="Read the docs"
        kind="outlined"
        size="large"
        href="/docs"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
      />
    </template>
    <template #bottom>
      <Ticker
        aria-label="Why teams choose Azion"
        :items="${PRIMARY_BENEFITS}"
      />
    </template>
  </CallToAction>
</SectionModule>
<FrameBox
  borders="none"
  marks="all"
  data-hatch="true"
  class="h-[calc(var(--spacing-xxl)*2)]"
>
  <TextureMaterial kind="lines" />
</FrameBox>`)

const AGENT_WAYS = {
  humans: {
    line: 'npm install -g azion',
    shell: true,
    action: { label: 'Start free', kind: 'secondary', href: '/signup' }
  },
  agents: {
    line: 'Connect Azion MCP: https://mcp.azion.com',
    shell: false,
    action: { label: 'Read the agent docs', kind: 'outlined', href: '/site/docs/agent-setup' }
  }
}

const TYPED_SOURCE = `const word = ref('')
const words = ['Console', 'CLI', 'MCP server']
let timer
let index = 0
let length = 0
let erasing = false

const step = () => {
  const target = words[index % words.length]
  if (!erasing) {
    word.value = target.slice(0, ++length)
    if (length < target.length) return (timer = setTimeout(step, 90))
    erasing = true
    return (timer = setTimeout(step, 1800))
  }
  word.value = target.slice(0, --length)
  if (length > 0) return (timer = setTimeout(step, 45))
  erasing = false
  index += 1
  timer = setTimeout(step, 270)
}

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) word.value = words.join(', ')
  else timer = setTimeout(step, 90)
})
onScopeDispose(() => clearTimeout(timer))`

const AGENTS_SCRIPT = [
  "import { onMounted, onScopeDispose, ref } from 'vue'",
  '',
  "const audience = ref('humans')",
  '',
  `const ways = ${JSON.stringify(AGENT_WAYS, null, 2)}`,
  '',
  TYPED_SOURCE
]

const typedWord = () => {
  const word = ref('')
  const words = ['Console', 'CLI', 'MCP server']
  let timer
  let index = 0
  let length = 0
  let erasing = false

  const step = () => {
    const target = words[index % words.length]
    if (!erasing) {
      word.value = target.slice(0, ++length)
      if (length < target.length) return (timer = setTimeout(step, 90))
      erasing = true
      return (timer = setTimeout(step, 1800))
    }
    word.value = target.slice(0, --length)
    if (length > 0) return (timer = setTimeout(step, 45))
    erasing = false
    index += 1
    timer = setTimeout(step, 270)
  }

  onMounted(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) word.value = words.join(', ')
    else timer = setTimeout(step, 90)
  })
  onScopeDispose(() => clearTimeout(timer))

  return word
}

const AGENTS_TEMPLATE = closingColumn(`<SectionModule
  id="contact"
  :divided="false"
  :padded="false"
  class="scroll-mt-(--spacing-xxl)"
>
  <CallToAction
    framed
    kind="primary"
    title="Built by you, or your agents."
  >
    <template #background>
      <TextureMaterial kind="pixelate" size="small" fade="bottom" />
    </template>
    <template #actions>
      <div style="width: min(var(--container-xl), calc(100vw - var(--spacing-xxl) * 3))" class="flex flex-col items-center gap-(--spacing-md)">
        <SegmentedButton
          v-model="audience"
          size="large"
          aria-label="Audience"
          :options="[
            { value: 'humans', label: 'For humans' },
            { value: 'agents', label: 'For agents' }
          ]"
        />
        <div aria-live="polite" class="w-full min-w-0">
          <div
            :key="audience"
            class="flex w-full min-w-0 animate-fade-in flex-col items-stretch justify-center gap-(--spacing-sm) motion-reduce:animate-none sm:items-center lg:flex-row"
          >
            <div class="w-full min-w-0 max-w-(--container-xs) lg:w-(--container-xs)">
              <InputGroup size="large">
                <InputGroupAddon v-if="ways[audience].shell" aria-hidden="true">$</InputGroupAddon>
                <input readonly :value="ways[audience].line" :aria-label="ways[audience].shell ? 'Command' : 'Prompt'" class="h-full min-w-0 flex-1 border-0 bg-(--bg-surface) px-(--spacing-md) text-label-code-sm text-(--text-default) outline-none" />
                <CopyButton size="large" :value="ways[audience].line" :aria-label="ways[audience].shell ? 'Copy command' : 'Copy prompt'" />
              </InputGroup>
            </div>
            <Button
              :label="ways[audience].action.label"
              :kind="ways[audience].action.kind"
              size="large"
              class="shrink-0"
              :href="ways[audience].action.href"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
            />
          </div>
        </div>
        <p class="m-0 max-w-(--container-md) text-center text-body-code-sm text-(--text-muted)">
          <span class="block">
            <span class="sr-only">Drive one platform from the Console, CLI, MCP server.</span>
            <span aria-hidden="true">
              Drive one platform from the
              <span class="text-(--text-default)"><TransitionGroup
                tag="span"
                enter-from-class="-translate-x-1 opacity-0"
                enter-active-class="transition-[translate,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
              ><span v-for="(char, index) in Array.from(word)" :key="index" class="inline-block whitespace-pre">{{ char }}</span></TransitionGroup><span class="ml-px inline-block h-4 w-1 animate-blink bg-(--accent) align-text-bottom motion-reduce:hidden" /></span>
            </span>
          </span>
          <span class="block">A person and an agent ship the same way.</span>
        </p>
      </div>
    </template>
  </CallToAction>
</SectionModule>
<FrameBox
  borders="none"
  marks="all"
  data-hatch="true"
  class="h-[calc(var(--spacing-xxl)*2)]"
>
  <TextureMaterial kind="lines" />
</FrameBox>`)

const NEWSLETTER_COPY = {
  eyebrow: 'Stay up to date',
  title: 'Subscribe to our Newsletter',
  description: 'Product updates, event highlights, and industry insights, delivered to your inbox.'
}

const NEWSLETTER_FORM = {
  label: 'Email',
  placeholder: 'Your email',
  submit: 'Subscribe',
  success: 'Thanks for subscribing to the Azion newsletter',
  required: 'Enter your email address.',
  invalid: 'Enter an email address like name@example.com.'
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const newsletterForm = () => {
  const email = ref('')
  const error = ref('')
  const sending = ref(false)

  const subscribe = async () => {
    if (sending.value) return
    const value = email.value.trim()
    if (!value) return (error.value = NEWSLETTER_FORM.required)
    if (!EMAIL_PATTERN.test(value)) return (error.value = NEWSLETTER_FORM.invalid)
    error.value = ''
    sending.value = true
    await new Promise((resolve) => setTimeout(resolve, 600))
    sending.value = false
    email.value = ''
    toast.success(NEWSLETTER_FORM.success)
  }

  return { email, error, sending, subscribe }
}

const NEWSLETTER_SOURCE = `const email = ref('')
const error = ref('')
const sending = ref(false)

async function subscribe() {
  if (sending.value) return
  const value = email.value.trim()
  if (!value) return (error.value = '${NEWSLETTER_FORM.required}')
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) return (error.value = '${NEWSLETTER_FORM.invalid}')
  error.value = ''
  sending.value = true
  await new Promise((resolve) => setTimeout(resolve, 600))
  sending.value = false
  email.value = ''
  toast.success('${NEWSLETTER_FORM.success}')
}`

const NEWSLETTER_SCRIPT = ["import { ref } from 'vue'", '', NEWSLETTER_SOURCE]

const NEWSLETTER_TEMPLATE = closingColumn(`<SectionModule
  id="contact"
  :divided="false"
  :padded="false"
  class="scroll-mt-(--spacing-xxl)"
>
  <CallToAction
    framed
    kind="split"
    eyebrow="${NEWSLETTER_COPY.eyebrow}"
    title="${NEWSLETTER_COPY.title}"
    description="${NEWSLETTER_COPY.description}"
  >
    <template #actions>
      <div>
        <form
          novalidate
          class="flex w-full flex-col gap-(--spacing-sm) sm:w-(--container-md) sm:max-w-full sm:flex-row sm:items-start"
          @submit.prevent="subscribe"
        >
          <FieldText
            v-model="email"
            label="${NEWSLETTER_FORM.label}"
            size="large"
            type="email"
            autocomplete="email"
            placeholder="${NEWSLETTER_FORM.placeholder}"
            :invalid="Boolean(error)"
            :helper-text="error"
            :disabled="sending"
            class="min-w-0 flex-1"
            @update:model-value="error = ''"
          />
          <Button
            label="${NEWSLETTER_FORM.submit}"
            kind="secondary"
            size="large"
            :loading="sending"
            class="sm:mt-(--spacing-lg)"
            @click="subscribe"
          />
        </form>
      </div>
    </template>
  </CallToAction>
</SectionModule>
<FrameBox
  borders="none"
  marks="all"
  data-hatch="true"
  class="h-[calc(var(--spacing-xxl)*2)]"
>
  <TextureMaterial kind="lines" />
</FrameBox>
<Toaster />`)

const meta = {
  title: 'Templates/Marketing/Closing CTAs/ClosingCallToAction',
  excludeStories: ['SPLIT_SECTION', 'PANEL_SECTION', 'NEWSLETTER_SECTION'],
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

export const Split = {
  render: () => ({ components, template: SPLIT_TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, SPLIT_TEMPLATE) }
    }
  }
}

export const SPLIT_SECTION = {
  _id: 'closing-call-to-action-split',
  props: {
    eyebrow: 'Build',
    title: 'Build once.',
    titleMuted: 'Run everywhere.',
    description: 'Get a faster path to launch, lower latency, and less infrastructure overhead.',
    primaryAction: {
      label: 'Start free',
      href: 'https://console.azion.com/signup?tck=build_cta'
    },
    asideAction: {
      label: 'Talk to an expert',
      href: 'https://www.azion.com/en/contact/'
    }
  }
}

export const SplitJson = {
  tags: ['!dev'],
  ...siteJsonStory(SPLIT_SECTION)
}

export const Panel = {
  render: () => ({ components, template: PANEL_TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, PANEL_TEMPLATE) }
    }
  }
}

export const PANEL_SECTION = {
  _id: 'closing-call-to-action-panel',
  props: {
    title: 'Ready to join us?',
    description: 'See our open positions and find the right fit.',
    action: {
      label: 'See open roles',
      href: '/en/careers/jobs/'
    }
  }
}

export const PanelJson = {
  tags: ['!dev'],
  ...siteJsonStory(PANEL_SECTION)
}

export const Newsletter = {
  render: () => ({
    components,
    setup: newsletterForm,
    template: NEWSLETTER_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The split band with a subscribe form in place of the actions. The Blog page (/site/blog) closes with it. An empty field and a malformed address each show their message under the field; a valid address clears the field and raises a success toast.'
      },
      source: { code: toSfc(IMPORTS.concat('', NEWSLETTER_SCRIPT), NEWSLETTER_TEMPLATE) }
    }
  }
}

export const NEWSLETTER_SECTION = {
  _id: 'closing-call-to-action-newsletter',
  props: {
    kind: 'newsletter',
    ...NEWSLETTER_COPY,
    form: NEWSLETTER_FORM
  }
}

export const NewsletterJson = {
  tags: ['!dev'],
  ...siteJsonStory(NEWSLETTER_SECTION)
}

export const Primary = {
  render: () => ({ components, template: PRIMARY_TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, PRIMARY_TEMPLATE) }
    }
  }
}

export const Agents = {
  render: () => ({
    components,
    setup: () => ({ audience: ref('humans'), ways: AGENT_WAYS, word: typedWord() }),
    template: AGENTS_TEMPLATE
  }),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS.concat('', AGENTS_SCRIPT), AGENTS_TEMPLATE) }
    }
  }
}
