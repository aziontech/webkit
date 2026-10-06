import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Illustration from '@aziontech/webkit/illustration'
import InputText from '@aziontech/webkit/input-text'
import Kbd from '@aziontech/webkit/kbd'
import { ref } from 'vue'

import { each, indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import Illustration from '@aziontech/webkit/illustration'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Kbd from '@aziontech/webkit/kbd'",
  "import { ref } from 'vue'",
  '',
  "const domain = ref('')"
]

const components = { Button, CardBox, Illustration, InputText, Kbd }

const DOORS = [
  {
    illustration: 'modern-frontends',
    title: 'Ship something new',
    description:
      'Deploy a static site or a full-stack app, with compute, AI, storage and media on the same build.',
    action: '<Button label="Create Application" kind="outlined" size="medium" />'
  },
  {
    illustration: 'dns-protection',
    title: 'Add a domain',
    description:
      'Register a new one or bring your own. DNS, automatic HTTPS and DDoS protection come with it.',
    action: `<form class="w-full" @submit.prevent>
  <InputText v-model="domain" placeholder="Type in your domain" size="medium" aria-label="Domain to add" />
</form>`
  },
  {
    illustration: 'ai-applications',
    title: 'Onboard your agent',
    description:
      'Give Claude, Cursor, Windsurf, Codex or OpenCode a prompt that sets your project up to deploy on Azion.',
    action: '<Button label="Copy prompt" kind="outlined" size="medium" icon="pi pi-copy" />'
  }
]

const door = (entry) => `<CardBox :padded="false">
  <template #content>
    <div class="flex h-full flex-col p-(--spacing-sm)">
      <div
        class="flex aspect-4/3 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
      >
        <Illustration name="${entry.illustration}" />
      </div>
      <div class="flex flex-1 flex-col gap-(--spacing-md) px-(--spacing-sm) pb-(--spacing-sm) pt-(--spacing-md)">
        <div class="flex flex-1 flex-col gap-(--spacing-xs)">
          <h3 class="text-label-md text-(--text-default)">${entry.title}</h3>
          <p class="text-pretty text-body-sm text-(--text-muted)">${entry.description}</p>
        </div>
        <div class="flex items-center gap-(--spacing-xs)">
${indent(entry.action, 5)}
        </div>
      </div>
    </div>
  </template>
</CardBox>`

const TEMPLATE = `<main class="layout-column layout-boundary flex min-h-screen flex-col">
  <div class="my-auto flex w-full flex-col gap-(--layout-section-gap) py-(--spacing-xl)">
    <div class="animate-content-enter motion-reduce:animate-none flex flex-col items-center gap-(--spacing-lg)">
      <div class="flex flex-col items-center gap-(--spacing-xs)">
        <p class="text-center text-body-md text-(--text-muted)">Good morning, Gabriel</p>
        <h1 class="text-balance text-center text-heading-lg text-(--text-default)">Let's build on Azion.</h1>
      </div>
      <div class="flex w-full max-w-(--container-2xl) flex-col items-stretch">
        <InputText
          model-value=""
          placeholder="Search products, resources and commands"
          size="large"
          readonly
          aria-label="Search products, resources and commands"
          aria-keyshortcuts="Meta+K"
        >
          <template #iconLeft>
            <i class="pi pi-search" aria-hidden="true" />
          </template>
          <template #iconRight>
            <Kbd meta size="small">K</Kbd>
          </template>
        </InputText>
      </div>
    </div>

    <div
      class="animate-content-enter motion-reduce:animate-none grid grid-cols-1 gap-(--spacing-lg) md:grid-cols-3 [--content-enter-delay:var(--transition-duration-fast-01)]"
    >
${each(DOORS, door, 3)}
    </div>
  </div>
</main>`

const meta = {
  title: 'Templates/Platform/States/FirstAccess',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The first screen a brand-new account sees on Home: a greeting under a centred headline, the command prompt as a read-only InputText carrying a search glyph and a Kbd hint for the palette shortcut, and three doors (ship something new, add a domain, onboard an agent), each a flush CardBox with an Illustration stage, a title, a description and its own action. The console renders it as HomeEmptyState until the account owns its first resource. Built from CardBox, Illustration, InputText, Kbd and Button.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => ({ domain: ref('') }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The three doors as Home ships them: Create Application, the domain field, and the Copy prompt button for agent onboarding.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
