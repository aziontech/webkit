import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import CopyButton from '@aziontech/webkit/copy-button'
import Dialog from '@aziontech/webkit/dialog'
import DialogClose from '@aziontech/webkit/dialog-close'
import DialogContent from '@aziontech/webkit/dialog-content'
import DialogDescription from '@aziontech/webkit/dialog-description'
import DialogOverlay from '@aziontech/webkit/dialog-overlay'
import DialogPortal from '@aziontech/webkit/dialog-portal'
import DialogTitle from '@aziontech/webkit/dialog-title'
import Drawer from '@aziontech/webkit/drawer'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/drawer-portal'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import Dropdown from '@aziontech/webkit/dropdown'
import FieldPassword from '@aziontech/webkit/field-password'
import HelperText from '@aziontech/webkit/helper-text'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Message from '@aziontech/webkit/message'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import Popover from '@aziontech/webkit/popover'
import Select from '@aziontech/webkit/select'
import Switch from '@aziontech/webkit/switch'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import Textarea from '@aziontech/webkit/textarea'
import Tooltip from '@aziontech/webkit/tooltip'
import { reactive, ref, watch } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  COLUMNS_SCRIPT,
  compound,
  controlsHeader,
  declare,
  DELETE_IMPORTS,
  DELETE_SCRIPT,
  deleteDialog,
  headingAction,
  LIST_IMPORTS,
  LIST_SCRIPT,
  pageHeading,
  PAGINATED,
  rowActions,
  tableCard,
  useColumns,
  useDeleteDialog,
  useList,
  VUE_IMPORT,
  webkitImport,
  webkitImports
} from './_account-markup'

const TOKENS = [
  {
    id: 'pt-1',
    name: 'CLI local',
    description: 'Local development machine',
    created: 'June 02, 2026',
    expires: 'September 02, 2026',
    lastUsed: '2 hours ago',
    status: 'Active'
  },
  {
    id: 'pt-2',
    name: 'CI / CD Pipeline',
    description: 'GitHub Actions deploy token',
    created: 'May 18, 2026',
    expires: 'August 18, 2026',
    lastUsed: 'Yesterday',
    status: 'Active'
  },
  {
    id: 'pt-3',
    name: 'Terraform provider',
    description: 'Infrastructure automation',
    created: 'March 09, 2026',
    expires: 'March 09, 2026',
    lastUsed: '1 month ago',
    status: 'Expired'
  },
  {
    id: 'pt-4',
    name: 'Legacy script',
    description: 'Retired nightly export',
    created: 'November 21, 2025',
    expires: 'February 21, 2026',
    lastUsed: '5 months ago',
    status: 'Revoked'
  }
]

const COLUMNS = [
  { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
  { accessorKey: 'description', header: 'Description', grow: 2 },
  { accessorKey: 'created', header: 'Created', enableSorting: true, minWidth: 80 },
  { accessorKey: 'expires', header: 'Expires', enableSorting: true, minWidth: 80 },
  { accessorKey: 'lastUsed', header: 'Last used', minWidth: 80 },
  { accessorKey: 'status', header: 'Status', minWidth: 104 },
  { id: 'actions', kind: 'action', hideable: false }
]

const STATUS_SEVERITY = { Active: 'success', Expired: 'danger', Revoked: 'danger' }

const EXPIRY_OPTIONS = [
  { label: '1 day', value: '1d', days: 1 },
  { label: '7 days', value: '7d', days: 7 },
  { label: '15 days', value: '15d', days: 15 },
  { label: '30 days', value: '30d', days: 30 },
  { label: '60 days', value: '60d', days: 60 },
  { label: '90 days', value: '90d', days: 90 },
  { label: '1 year', value: '1y', days: 365 }
]

const CELLS = [
  `<template #cell-status="{ value }">
  <Tag :label="value" :severity="statusSeverity[value] ?? 'secondary'" size="medium" />
</template>`,
  `<template #cell-actions="{ row }">
${indent(
  rowActions({
    label: 'Token actions',
    handler: 'onTokenAction',
    groups: [
      { options: [{ value: 'view', label: 'View details' }] },
      {
        options: [
          { value: 'revoke', label: 'Revoke', icon: 'pi pi-ban' },
          { value: 'delete', label: 'Delete', icon: 'pi pi-trash' }
        ]
      }
    ]
  })
)}
</template>`
]

const DRAWER_ROW_ACTIONS = 'justify-end flex-1 max-w-(--container-3xs)'

const CREATE_DRAWER = `<Drawer v-model:open="drawerOpen" size="large" side="right">
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent>
      <form class="flex min-h-0 flex-1 flex-col" aria-label="Create Personal Token" novalidate @submit.prevent="submit">
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <DrawerTitle>Create personal token</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              Create a personal token to securely access your account via API.
            </p>
          </div>
          <DrawerClose />
        </PanelHeader>

        <PanelContent>
          <fieldset class="m-0 flex min-w-0 flex-col gap-(--layout-section-gap) border-0 p-0" :disabled="submitting">
            <legend class="sr-only">Create personal token</legend>

            <section class="flex flex-col gap-(--layout-group-gap)">
              <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">General</p>
              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small" class="items-start">
                      <Item.Content>
                        <Item.Title>Name</Item.Title>
                        <Item.Description>
                          Give a unique and descriptive name to identify the personal token.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="${DRAWER_ROW_ACTIONS}">
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <InputText
                            v-model="form.name"
                            size="large"
                            class="w-full"
                            aria-label="Name"
                            :disabled="submitting"
                            :required="!!errors.name"
                            :aria-describedby="errors.name ? 'pt-name-error' : undefined"
                            @update:model-value="errors.name = ''"
                          />
                          <HelperText v-if="errors.name" id="pt-name-error" kind="required" :label="errors.name" />
                        </div>
                      </Item.Actions>
                    </Item>

                    <Item size="small" class="items-start">
                      <Item.Content>
                        <Item.Title>Description</Item.Title>
                        <Item.Description>
                          Include a description to specify the token's purpose or usage.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="${DRAWER_ROW_ACTIONS}">
                        <Textarea v-model="form.description" class="w-full" aria-label="Description" :disabled="submitting" />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </section>

            <section class="flex flex-col gap-(--layout-group-gap)">
              <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">Token</p>
              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small" class="items-start">
                      <Item.Content>
                        <Item.Title>Expires within</Item.Title>
                        <Item.Description>
                          Define the token expiration by selecting a suggested range. For
                          security, the token is only available right after it's created.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="${DRAWER_ROW_ACTIONS}">
                        <Select
                          v-model="form.expiresWithin"
                          size="large"
                          class="w-full"
                          :disabled="submitting"
                          :display-value="expiryLabel"
                        >
                          <Select.Trigger aria-label="Expires within" />
                          <Select.Content class="z-[1002]!">
                            <Select.Option v-for="option in expiryOptions" :key="option.value" :value="option.value">
                              {{ option.label }}
                            </Select.Option>
                          </Select.Content>
                        </Select>
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </section>
          </fieldset>
        </PanelContent>

        <PanelFooter class="flex-col md:flex-row md:justify-end">
          <Button
            class="w-full md:w-auto"
            type="button"
            label="Cancel"
            kind="outlined"
            size="medium"
            :disabled="submitting"
            @click="drawerOpen = false"
          />
          <Button class="w-full md:w-auto" label="Create" kind="primary" size="medium" :loading="submitting" type="submit" />
        </PanelFooter>
      </form>
    </DrawerContent>
  </DrawerPortal>
</Drawer>`

const CREATED_DIALOG = `<Dialog v-model:open="dialogOpen" size="medium">
  <DialogPortal>
    <DialogOverlay />
    <DialogContent>
      <PanelHeader class="w-full">
        <DialogTitle>Personal Token has been created</DialogTitle>
        <DialogClose />
      </PanelHeader>

      <PanelContent class="flex flex-col gap-(--spacing-md)">
        <DialogDescription class="sr-only">
          Copy and store your new personal token. It won't be shown again.
        </DialogDescription>

        <Message
          severity="warning"
          label="This token will only be displayed once. Make sure to copy and store it safely before closing this dialog."
        />

        <FieldPassword
          input-id="pt-token"
          label="Personal Token"
          :model-value="generatedToken"
          readonly
          helper-text="Once the dialog is closed, the token cannot be retrieved. It'll be necessary to generate a new one."
        />

        <div class="flex justify-end">
          <CopyButton :value="generatedToken" kind="outlined" size="large" aria-label="Copy personal token" />
        </div>
      </PanelContent>

      <PanelFooter class="justify-end">
        <Button label="Confirm" kind="primary" size="medium" @click="dialogOpen = false" />
      </PanelFooter>
    </DialogContent>
  </DialogPortal>
</Dialog>`

const TEMPLATE = `<div class="flex h-screen flex-col bg-(--bg-canvas)">
  <div class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto layout-boundary">
    <main class="layout-column flex min-h-full flex-col">
${indent(
  pageHeading({
    title: 'Personal Tokens',
    description:
      "Personal tokens securely access your account via API. Create one, then copy it — it's shown only once.",
    size: 'medium',
    documentation: 'https://www.azion.com/en/documentation/',
    actions: headingAction({ label: 'Create Personal Token', click: 'drawerOpen = true' })
  }),
  3
)}

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
${indent(
  controlsHeader({
    placeholder: 'Search personal tokens',
    ariaLabel: 'Search personal tokens',
    filename: 'personal-tokens.csv',
    when: 'tokens.length'
  }),
  5
)}

          <section class="flex min-h-0 flex-col">
${indent(tableCard({ rows: 'tokens', extra: PAGINATED, cells: CELLS }), 6)}
          </section>
        </section>
      </section>
    </main>
  </div>

${indent(CREATE_DRAWER)}

${indent(CREATED_DIALOG)}

${indent(
  deleteDialog({
    heading: 'Delete Personal token',
    description:
      'The selected Personal token will be deleted, and any script or integration signing with it will stop authenticating. Check the'
  })
)}
</div>`

const scriptFor = (tokens) => [
  ...webkitImports([
    ...LIST_IMPORTS,
    ...DELETE_IMPORTS,
    webkitImport('CopyButton', 'copy-button'),
    webkitImport('DialogDescription', 'dialog-description'),
    webkitImport('Drawer', 'drawer'),
    webkitImport('DrawerClose', 'drawer-close'),
    webkitImport('DrawerContent', 'drawer-content'),
    webkitImport('DrawerOverlay', 'drawer-overlay'),
    webkitImport('DrawerPortal', 'drawer-portal'),
    webkitImport('DrawerTitle', 'drawer-title'),
    webkitImport('Dropdown', 'dropdown'),
    webkitImport('FieldPassword', 'field-password'),
    webkitImport('HelperText', 'helper-text'),
    webkitImport('Item', 'item'),
    webkitImport('Select', 'select'),
    webkitImport('Tag', 'tag'),
    webkitImport('Textarea', 'textarea')
  ]),
  VUE_IMPORT(['computed', 'reactive', 'ref', 'watch']),
  '',
  declare('tokens', tokens, 'ref'),
  declare('columns', COLUMNS),
  declare('statusSeverity', STATUS_SEVERITY),
  declare('expiryOptions', EXPIRY_OPTIONS),
  "const expiryLabel = (value) => expiryOptions.find((option) => option.value === value)?.label ?? ''",
  '',
  ...LIST_SCRIPT,
  ...COLUMNS_SCRIPT(),
  '',
  ...DELETE_SCRIPT('tokens'),
  '',
  'const onTokenAction = (event, value, row) => {',
  "  if (value === 'revoke') {",
  '    tokens.value = tokens.value.map((token) =>',
  "      token.id === row.id ? { ...token, status: 'Revoked' } : token",
  '    )',
  '    return',
  '  }',
  "  if (value === 'delete') askDelete(row)",
  '}',
  '',
  'const drawerOpen = ref(false)',
  'const dialogOpen = ref(false)',
  "const generatedToken = ref('')",
  'const submitting = ref(false)',
  "const form = reactive({ name: '', description: '', expiresWithin: '1d' })",
  "const errors = reactive({ name: '' })",
  '',
  'watch(drawerOpen, (open) => {',
  '  if (!open) return',
  "  form.name = ''",
  "  form.description = ''",
  "  form.expiresWithin = '1d'",
  "  errors.name = ''",
  '})',
  '',
  'const generateToken = () => {',
  '  const bytes = new Uint8Array(30)',
  '  globalThis.crypto?.getRandomValues?.(bytes)',
  "  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')",
  "  return 'azion_pat_' + hex",
  '}',
  '',
  'const formatDate = (date) =>',
  "  date.toLocaleString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })",
  '',
  'const submit = () => {',
  '  if (submitting.value) return',
  "  errors.name = form.name.trim() ? '' : 'This field is required.'",
  '  if (errors.name) return',
  '  submitting.value = true',
  '  setTimeout(() => {',
  '    const now = new Date()',
  '    const days = expiryOptions.find((option) => option.value === form.expiresWithin)?.days ?? 1',
  '    tokens.value = [',
  '      {',
  "        id: 'pt-' + Date.now(),",
  '        name: form.name.trim(),',
  "        description: form.description.trim() || '—',",
  '        created: formatDate(now),',
  '        expires: formatDate(new Date(now.getTime() + days * 86400000)),',
  "        lastUsed: 'Never',",
  "        status: 'Active'",
  '      },',
  '      ...tokens.value',
  '    ]',
  '    generatedToken.value = generateToken()',
  '    submitting.value = false',
  '    drawerOpen.value = false',
  '    dialogOpen.value = true',
  '  }, 900)',
  '}'
]

const generateToken = () => {
  const bytes = new Uint8Array(30)
  globalThis.crypto?.getRandomValues?.(bytes)
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `azion_pat_${hex}`
}

const formatDate = (date) =>
  date.toLocaleString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })

const usePersonalTokens = (seed) => {
  const tokens = ref(structuredClone(seed))
  const deletion = useDeleteDialog(tokens)
  const onTokenAction = (event, value, row) => {
    if (value === 'revoke') {
      tokens.value = tokens.value.map((token) =>
        token.id === row.id ? { ...token, status: 'Revoked' } : token
      )
      return
    }
    if (value === 'delete') deletion.askDelete(row)
  }
  const drawerOpen = ref(false)
  const dialogOpen = ref(false)
  const generatedToken = ref('')
  const submitting = ref(false)
  const form = reactive({ name: '', description: '', expiresWithin: '1d' })
  const errors = reactive({ name: '' })
  watch(drawerOpen, (open) => {
    if (!open) return
    form.name = ''
    form.description = ''
    form.expiresWithin = '1d'
    errors.name = ''
  })
  const submit = () => {
    if (submitting.value) return
    errors.name = form.name.trim() ? '' : 'This field is required.'
    if (errors.name) return
    submitting.value = true
    setTimeout(() => {
      const now = new Date()
      const days = EXPIRY_OPTIONS.find((option) => option.value === form.expiresWithin)?.days ?? 1
      tokens.value = [
        {
          id: `pt-${Date.now()}`,
          name: form.name.trim(),
          description: form.description.trim() || '—',
          created: formatDate(now),
          expires: formatDate(new Date(now.getTime() + days * 86400000)),
          lastUsed: 'Never',
          status: 'Active'
        },
        ...tokens.value
      ]
      generatedToken.value = generateToken()
      submitting.value = false
      drawerOpen.value = false
      dialogOpen.value = true
    }, 900)
  }
  return {
    tokens,
    columns: COLUMNS,
    statusSeverity: STATUS_SEVERITY,
    expiryOptions: EXPIRY_OPTIONS,
    expiryLabel: (value) => EXPIRY_OPTIONS.find((option) => option.value === value)?.label ?? '',
    ...useList(),
    ...useColumns(COLUMNS),
    ...deletion,
    onTokenAction,
    drawerOpen,
    dialogOpen,
    generatedToken,
    submitting,
    form,
    errors,
    submit
  }
}

const components = {
  Button,
  CardBox,
  CopyButton,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  ...compound('Dropdown', Dropdown, ['Trigger', 'Group', 'Option']),
  FieldPassword,
  HelperText,
  IconButton,
  InputText,
  ...compound('Item', Item, ['List', 'Content', 'Title', 'Description', 'Actions']),
  Message,
  PanelContent,
  PanelFooter,
  PanelHeader,
  ...compound('Popover', Popover, ['Trigger', 'Content']),
  ...compound('Select', Select, ['Trigger', 'Content', 'Option']),
  Switch,
  TableRoot,
  Tag,
  Textarea,
  Tooltip
}

const meta = {
  title: 'Templates/Platform/Account/PersonalTokens',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Personal Tokens page (`/personal-tokens`), as the console renders it inside the padded app shell: a medium page heading with Documentation and Create Personal Token, the list controls row, and a flush table of tokens with status tags and a row menu (View details, Revoke, Delete, where Delete opens the type-to-confirm dialog). Create Personal Token opens a drawer with General (Name, Description) and Token (Expires within) cards; Create adds the token and opens the one-time dialog with the generated token in a read-only `FieldPassword` and a `CopyButton`. The shell around it is owned by the Shell templates. Built from `TableRoot`, `CardBox`, `Tag`, `Dropdown`, `Drawer`, `Item`, `InputText`, `HelperText`, `Textarea`, `Select`, `Dialog`, `Message`, `FieldPassword`, `CopyButton`, `Popover`, `Switch`, `Tooltip`, `IconButton` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const PersonalTokens = {
  render: () => ({
    components,
    setup: () => usePersonalTokens(TOKENS),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Four seeded tokens: two Active, one Expired and one Revoked. Create Personal Token opens the drawer, which resets on every open; Create with no name flags it as required.'
      },
      source: { code: toSfc(scriptFor(TOKENS), TEMPLATE) }
    }
  }
}

export const Empty = {
  render: () => ({
    components,
    setup: () => usePersonalTokens([]),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The empty-account mode of the sample: no tokens, so the controls row is hidden and only the heading and the empty table remain.'
      },
      source: { code: toSfc(scriptFor([]), TEMPLATE) }
    }
  }
}
