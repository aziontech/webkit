import Avatar from '@aziontech/webkit/avatar'
import Brand from '@aziontech/webkit/brand'
import Breadcrumb from '@aziontech/webkit/breadcrumb'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import GlobalHeader from '@aziontech/webkit/global-header'
import HelperText from '@aziontech/webkit/helper-text'
import Hint from '@aziontech/webkit/hint'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Switch from '@aziontech/webkit/switch'
import { reactive, ref } from 'vue'

import { toSfc } from '../../_shared/story-source'

const BREADCRUMB = [{ label: 'Edge DNS', href: '/edge-dns' }, { label: 'Create Zone' }]

const NAME_MAX = 50
const DOMAIN_PATTERN = /^(?=.{4,253}$)((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$/

const createZoneState = () => {
  const form = reactive({ name: '', domain: '', dnssec: false, active: true })
  const errors = reactive({ name: '', nameKind: 'required', domain: '', domainKind: 'required' })
  const advancedOpen = ref(false)
  const fileRef = ref(null)

  const validate = () => {
    const name = form.name.trim()
    if (!name) {
      errors.nameKind = 'required'
      errors.name = 'This field is required.'
    } else if (name.length > NAME_MAX) {
      errors.nameKind = 'invalid'
      errors.name = `Use at most ${NAME_MAX} characters.`
    } else {
      errors.name = ''
    }

    const domain = form.domain.trim()
    if (!domain) {
      errors.domainKind = 'required'
      errors.domain = 'This field is required.'
    } else if (!DOMAIN_PATTERN.test(domain)) {
      errors.domainKind = 'invalid'
      errors.domain = 'Enter a valid domain name. Example: mydomain.com.'
    } else {
      errors.domain = ''
    }

    return !errors.name && !errors.domain
  }

  const submit = () => validate()
  const openImport = () => fileRef.value?.click()

  return { breadcrumb: BREADCRUMB, form, errors, advancedOpen, fileRef, submit, openImport }
}

const IMPORTS = [
  "import Avatar from '@aziontech/webkit/avatar'",
  "import Brand from '@aziontech/webkit/brand'",
  "import Breadcrumb from '@aziontech/webkit/breadcrumb'",
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import GlobalHeader from '@aziontech/webkit/global-header'",
  "import HelperText from '@aziontech/webkit/helper-text'",
  "import Hint from '@aziontech/webkit/hint'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Item from '@aziontech/webkit/item'",
  "import Switch from '@aziontech/webkit/switch'",
  "import { reactive, ref } from 'vue'",
  '',
  'const breadcrumb = [',
  "  { label: 'Edge DNS', href: '/edge-dns' },",
  "  { label: 'Create Zone' }",
  ']',
  '',
  "const form = reactive({ name: '', domain: '', dnssec: false, active: true })",
  "const errors = reactive({ name: '', nameKind: 'required', domain: '', domainKind: 'required' })",
  'const advancedOpen = ref(false)',
  'const fileRef = ref(null)',
  '',
  'const NAME_MAX = 50',
  'const DOMAIN_PATTERN = /^(?=.{4,253}$)((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\\.)+[a-zA-Z]{2,63}$/',
  '',
  'const validate = () => {',
  '  const name = form.name.trim()',
  '  if (!name) {',
  "    errors.nameKind = 'required'",
  "    errors.name = 'This field is required.'",
  '  } else if (name.length > NAME_MAX) {',
  "    errors.nameKind = 'invalid'",
  '    errors.name = `Use at most ${NAME_MAX} characters.`',
  '  } else {',
  "    errors.name = ''",
  '  }',
  '',
  '  const domain = form.domain.trim()',
  '  if (!domain) {',
  "    errors.domainKind = 'required'",
  "    errors.domain = 'This field is required.'",
  '  } else if (!DOMAIN_PATTERN.test(domain)) {',
  "    errors.domainKind = 'invalid'",
  "    errors.domain = 'Enter a valid domain name. Example: mydomain.com.'",
  '  } else {',
  "    errors.domain = ''",
  '  }',
  '',
  '  return !errors.name && !errors.domain',
  '}',
  '',
  'const submit = () => validate()',
  'const openImport = () => fileRef.value?.click()'
]

const components = {
  Avatar,
  Brand,
  Breadcrumb,
  Button,
  CardBox,
  GlobalHeader,
  'GlobalHeader.Left': GlobalHeader.Left,
  'GlobalHeader.Middle': GlobalHeader.Middle,
  'GlobalHeader.Right': GlobalHeader.Right,
  'GlobalHeader.Brand': GlobalHeader.Brand,
  HelperText,
  Hint,
  IconButton,
  InputText,
  Item,
  'Item.List': Item.List,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Description': Item.Description,
  'Item.Actions': Item.Actions,
  Switch
}

const TEMPLATE = `<div class="flex h-dvh flex-col bg-(--bg-canvas)">
  <GlobalHeader aria-label="Azion Console">
    <GlobalHeader.Left>
      <IconButton icon="pi pi-chevron-left" aria-label="Back to Edge DNS" kind="outlined" size="small" />
      <GlobalHeader.Brand>
        <a
          href="/home"
          aria-label="Azion home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Brand kind="default" size="small" />
        </a>
      </GlobalHeader.Brand>
      <Breadcrumb :items="breadcrumb" />
    </GlobalHeader.Left>
    <GlobalHeader.Middle />
    <GlobalHeader.Right>
      <button
        type="button"
        aria-label="Account settings"
        class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
      >
        <Avatar label="myemail@azion.com" size="medium" kind="square" />
      </button>
    </GlobalHeader.Right>
  </GlobalHeader>

  <main class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto">
    <form class="flex min-h-full flex-col" aria-labelledby="create-zone-title" novalidate @submit.prevent="submit">
      <div class="layout-column-form layout-boundary-inline flex flex-1 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)">
        <header class="flex flex-col gap-(--spacing-md) md:flex-row md:items-start md:justify-between">
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <h1 id="create-zone-title" class="text-balance text-heading-xs text-(--text-default)">Create Zone</h1>
            </div>
            <p class="text-pretty text-body-sm text-(--text-muted)">
              A zone holds the DNS records that answer authoritatively for a domain, served from Azion's distributed infrastructure.
            </p>
          </div>
        </header>

        <fieldset class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0">
          <legend class="sr-only">Create Zone</legend>

          <section class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
                <h2 class="text-balance text-heading-xxs text-(--text-default)">General</h2>
                <Hint text="The two fields this endpoint requires: what the zone is called here, and the domain it answers for." class="shrink-0" />
              </div>
            </div>
            <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small" class="items-start">
                      <Item.Content>
                        <Item.Title>Name</Item.Title>
                        <Item.Description>Identifies the zone in this list. It is not the domain.</Item.Description>
                      </Item.Content>
                      <Item.Actions class="flex-1 justify-end max-w-(--container-3xs)">
                        <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                          <InputText
                            v-model="form.name"
                            size="large"
                            class="w-full"
                            aria-label="Name"
                            placeholder="My zone"
                            autocomplete="off"
                            :required="!!errors.name && errors.nameKind === 'required'"
                            :invalid="!!errors.name && errors.nameKind === 'invalid'"
                            :aria-describedby="errors.name ? 'create-zone-name-message' : undefined"
                            @update:model-value="errors.name = ''"
                          />
                          <HelperText v-if="errors.name" id="create-zone-name-message" :kind="errors.nameKind" :label="errors.name" />
                        </div>
                      </Item.Actions>
                    </Item>
                    <Item size="small" class="items-start">
                      <Item.Content>
                        <Item.Title>Domain Name</Item.Title>
                        <Item.Description>
                          The root domain this zone answers for, without a subdomain. Pasting a zone file here imports its records instead.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="flex-1 justify-end max-w-(--container-3xs)">
                        <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                          <InputText
                            v-model="form.domain"
                            size="large"
                            class="w-full"
                            aria-label="Domain Name"
                            placeholder="mydomain.com"
                            autocomplete="off"
                            :required="!!errors.domain && errors.domainKind === 'required'"
                            :invalid="!!errors.domain && errors.domainKind === 'invalid'"
                            :aria-describedby="errors.domain ? 'create-zone-domain-message' : undefined"
                            @update:model-value="errors.domain = ''"
                          />
                          <HelperText v-if="errors.domain" id="create-zone-domain-message" :kind="errors.domainKind" :label="errors.domain" />
                        </div>
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </div>
          </section>

          <section class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
                <h2 class="text-balance text-heading-xxs text-(--text-default)">
                  <button
                    type="button"
                    :aria-expanded="advancedOpen"
                    aria-controls="create-zone-advanced"
                    :data-state="advancedOpen ? 'open' : 'closed'"
                    class="group/disclosure -mx-(--spacing-xxs) flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xxs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                    @click="advancedOpen = !advancedOpen"
                  >
                    <i class="pi pi-cog shrink-0 text-body-sm leading-none text-(--text-muted)" aria-hidden="true" />
                    Advanced
                    <i
                      class="pi pi-chevron-down shrink-0 text-body-xs leading-none text-(--text-muted) transition-transform duration-fast-02 ease-productive-entrance group-data-[state=open]/disclosure:rotate-180 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </button>
                </h2>
              </div>
            </div>
            <div
              id="create-zone-advanced"
              :data-open="advancedOpen || null"
              :inert="!advancedOpen || undefined"
              :aria-hidden="!advancedOpen || undefined"
              class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
            >
              <div class="min-w-0 overflow-hidden">
                <div
                  :data-open="advancedOpen || null"
                  class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
                >
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <Item size="small" class="items-start">
                          <Item.Content>
                            <Item.Title>DNSSEC</Item.Title>
                            <Item.Description>
                              Signs this zone's answers so a resolver can detect cache poisoning and spoofing. Completing the setup also means adding the Key Tag and Digest at your domain provider.
                            </Item.Description>
                          </Item.Content>
                          <Item.Actions class="justify-end">
                            <Switch v-model="form.dnssec" aria-label="Enable DNSSEC" />
                          </Item.Actions>
                        </Item>
                        <Item size="small" class="items-start">
                          <Item.Content>
                            <Item.Title>Active</Item.Title>
                            <Item.Description>When active, the zone answers authoritative DNS queries for the domain.</Item.Description>
                          </Item.Content>
                          <Item.Actions class="justify-end">
                            <Switch v-model="form.active" aria-label="Active" />
                          </Item.Actions>
                        </Item>
                      </Item.List>
                    </template>
                  </CardBox>
                </div>
              </div>
            </div>
          </section>
        </fieldset>
      </div>

      <footer class="pointer-events-none sticky bottom-0 z-10 flex justify-center px-(--spacing-md) pt-(--spacing-xl) pb-(--spacing-lg)">
        <div class="pointer-events-auto flex max-w-full items-center gap-(--spacing-md) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) py-(--spacing-xs) pr-(--spacing-xs) pl-(--spacing-xs) shadow-lg">
          <div class="flex min-w-0 items-center gap-(--spacing-sm)">
            <Button type="button" label="Import" kind="outlined" size="medium" icon="pi pi-upload" @click="openImport" />
            <p class="min-w-0 text-body-sm text-(--text-muted)">or paste zone file contents in Domain Name</p>
            <input ref="fileRef" type="file" accept=".zone,.txt,.db,text/plain" class="sr-only" tabindex="-1" aria-hidden="true" />
          </div>
          <div class="flex shrink-0 items-center gap-(--spacing-sm)">
            <Button type="button" label="Cancel" kind="outlined" size="medium" />
            <Button label="Save" kind="primary" size="medium" @click="submit" />
          </div>
        </div>
      </footer>
      <button type="submit" class="sr-only" tabindex="-1" aria-hidden="true">Save</button>
    </form>
  </main>
</div>`

const meta = {
  title: 'Templates/Platform/Shell/CreatePage',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The page a first-level resource is created on: its own creation header with no sidebar, a centred form column opening with a small page heading, then stacked sections, each a heading over a flush CardBox of field rows, and a floating sticky bar carrying a leading slot plus Cancel and Save. Create Zone, Create Team and every other top-level create page share it. Fields flag required or invalid only after Save is clicked. Built from `GlobalHeader`, `IconButton`, `Brand`, `Breadcrumb`, `Avatar`, `Hint`, `CardBox`, `Item`, `InputText`, `HelperText`, `Switch` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: createZoneState,
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Create Zone: a General section with Name and Domain Name, a collapsed Advanced section holding the DNSSEC and Active switches, and the bar with Import on the left and Cancel and Save on the right.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
