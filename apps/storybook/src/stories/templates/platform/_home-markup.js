import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Illustration from '@aziontech/webkit/illustration'
import InputText from '@aziontech/webkit/input-text'
import Kbd from '@aziontech/webkit/kbd'
import Popover from '@aziontech/webkit/popover'
import Spinner from '@aziontech/webkit/spinner'
import { reactive, ref, watch } from 'vue'

import { each, indent } from '../../_shared/markup'

const DOMAIN_SHAPE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9-]+)*\.[a-z]{2,}$/i
const REGISTERED = ['azion.com', 'google.com', 'example.com', 'cloudflare.com']
const CHECK_MS = 900

export const FIRST_ACCESS_SCRIPT = [
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import Illustration from '@aziontech/webkit/illustration'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Kbd from '@aziontech/webkit/kbd'",
  "import Popover from '@aziontech/webkit/popover'",
  "import Spinner from '@aziontech/webkit/spinner'",
  "import { reactive, ref, watch } from 'vue'",
  '',
  'const DOMAIN_SHAPE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\\.[a-z0-9-]+)*\\.[a-z]{2,}$/i',
  "const REGISTERED = ['azion.com', 'google.com', 'example.com', 'cloudflare.com']",
  `const CHECK_MS = ${CHECK_MS}`,
  '',
  "const domain = ref('')",
  "const check = reactive({ open: false, loading: false, name: '', registered: false })",
  'const fieldWidth = ref(0)',
  'let checkTimer',
  '',
  'const measureField = (event) => {',
  "  const form = event?.target?.closest?.('form')",
  '  if (form) fieldWidth.value = Math.round(form.offsetWidth)',
  '}',
  '',
  'watch(domain, (value) => {',
  '  globalThis.clearTimeout(checkTimer)',
  '  const name = value.trim().toLowerCase()',
  '  if (!DOMAIN_SHAPE.test(name)) {',
  '    check.open = false',
  '    check.loading = false',
  '    return',
  '  }',
  '  check.open = true',
  '  check.loading = true',
  '  check.name = name',
  '  checkTimer = globalThis.setTimeout(() => {',
  '    check.loading = false',
  '    check.registered = REGISTERED.includes(name)',
  '  }, CHECK_MS)',
  '})',
  '',
  'const onCheckOpen = (value) => {',
  '  if (!value) check.open = false',
  '}'
]

export const firstAccessState = () => {
  const domain = ref('')
  const check = reactive({ open: false, loading: false, name: '', registered: false })
  const fieldWidth = ref(0)
  let checkTimer
  const measureField = (event) => {
    const form = event?.target?.closest?.('form')
    if (form) fieldWidth.value = Math.round(form.offsetWidth)
  }
  watch(domain, (value) => {
    globalThis.clearTimeout(checkTimer)
    const name = value.trim().toLowerCase()
    if (!DOMAIN_SHAPE.test(name)) {
      check.open = false
      check.loading = false
      return
    }
    check.open = true
    check.loading = true
    check.name = name
    checkTimer = globalThis.setTimeout(() => {
      check.loading = false
      check.registered = REGISTERED.includes(name)
    }, CHECK_MS)
  })
  const onCheckOpen = (value) => {
    if (!value) check.open = false
  }
  return { domain, check, fieldWidth, measureField, onCheckOpen }
}

export const FIRST_ACCESS_COMPONENTS = {
  Button,
  CardBox,
  Illustration,
  InputText,
  Kbd,
  Popover,
  'Popover.Trigger': Popover.Trigger,
  'Popover.Content': Popover.Content,
  Spinner
}

const DOMAIN_ACTION = `<Popover
  :open="check.open"
  placement="bottom-start"
  :offset="8"
  class="w-full"
  @update:open="onCheckOpen"
>
  <Popover.Trigger class="w-full">
    <form class="w-full" @submit.prevent>
      <InputText
        v-model="domain"
        placeholder="Type in your domain"
        size="medium"
        aria-label="Domain to add"
        @input="measureField"
      />
    </form>
  </Popover.Trigger>

  <Popover.Content>
    <div
      class="overflow-hidden transition-[height] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
      :style="fieldWidth ? { width: fieldWidth + 'px' } : {}"
    >
      <Transition
        mode="out-in"
        enter-active-class="animate-fade-in motion-reduce:animate-none"
        leave-active-class="animate-fade-out motion-reduce:animate-none"
      >
        <p
          v-if="check.loading"
          key="checking"
          class="flex items-center justify-center gap-(--spacing-xs) p-(--spacing-sm) text-center text-body-sm text-(--text-muted)"
        >
          <Spinner class="size-4 shrink-0 text-(--text-muted)" />
          Checking {{ check.name }}...
        </p>

        <div v-else key="verdict" class="flex flex-col gap-(--spacing-sm) p-(--spacing-sm)">
          <p class="text-body-sm text-(--text-default)">
            <template v-if="check.registered">
              {{ check.name }} is already registered. Try another name.
            </template>
            <template v-else>
              {{ check.name }} is available. Azion registers it and issues the certificate.
            </template>
          </p>
          <Button v-if="!check.registered" label="Register" kind="secondary" size="medium" class="w-full" />
        </div>
      </Transition>
    </div>
  </Popover.Content>
</Popover>`

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
    action: DOMAIN_ACTION
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

const PALETTE_TRIGGER = `
          @click="paletteOpen = true"
          @keydown.enter="paletteOpen = true"`

export const firstAccessMain = ({ palette = false } = {}) => `<main class="layout-column layout-boundary relative flex min-h-full flex-col">
  <div class="my-auto flex w-full flex-col gap-(--layout-section-gap) py-(--spacing-xl)">
    <div class="animate-content-enter motion-reduce:animate-none flex flex-col items-center gap-(--spacing-lg)">
      <div class="flex flex-col items-center gap-(--spacing-xs)">
        <p class="text-center text-body-md text-(--text-muted)">Good morning, Gabriel</p>
        <h1 class="text-balance text-center text-heading-lg text-(--text-default)">Let's build on Azion.</h1>
      </div>

      <div class="flex w-full max-w-(--container-2xl) flex-col items-stretch">
        <div
          class="min-w-0 flex-1 cursor-pointer [&_input]:cursor-pointer"${palette ? PALETTE_TRIGGER : ''}
        >
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
    </div>

    <div
      class="animate-content-enter motion-reduce:animate-none grid grid-cols-1 gap-(--spacing-lg) md:grid-cols-3 [--content-enter-delay:var(--transition-duration-fast-01)]"
    >
${each(DOORS, door, 3)}
    </div>
  </div>
</main>`
