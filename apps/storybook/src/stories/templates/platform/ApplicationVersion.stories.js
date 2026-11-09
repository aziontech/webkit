import Avatar from '@aziontech/webkit/avatar'
import Breadcrumb from '@aziontech/webkit/breadcrumb'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Dropdown from '@aziontech/webkit/dropdown'
import FieldTextarea from '@aziontech/webkit/field-textarea'
import Hint from '@aziontech/webkit/hint'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import ResizablePanel from '@aziontech/webkit/resizable-panel'
import ScrollArea from '@aziontech/webkit/scroll-area'
import Select from '@aziontech/webkit/select'
import SplitButton from '@aziontech/webkit/split-button'
import Switch from '@aziontech/webkit/switch'
import TabView from '@aziontech/webkit/tab-view'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, reactive, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  mergeScripts,
  pageScroll,
  scriptLines,
  shell,
  SHELL_COMPONENTS,
  shellState
} from './_shell-markup'
import { declare } from './_summary-markup'

const APPLICATION = { id: '1784552864', name: 'webkit-sample-vue' }

const STATE_TAGS = {
  draft: { label: 'Draft', severity: 'warning', icon: 'pi pi-file-edit' },
  active: { label: 'Deployed', severity: 'primary', icon: '' },
  ready: { label: 'Ready', severity: 'success', icon: '' }
}

const version = (id, state, comment, author, createdAgo) => ({
  id,
  name: id,
  state,
  tag: STATE_TAGS[state],
  comment,
  author,
  createdAgo
})

const VERSIONS = [
  version('ADA8FMMR', 'draft', 'Cache static assets for 30 days', 'Herbert Júlio', '14 hours ago'),
  version('AEO25I38', 'active', 'Remove rule "Legacy load balancer"', 'Rafael Umman', '1 day ago'),
  version('AG1VVDJP', 'ready', 'Enable Image Processor', 'Marcus Grando', '3 days ago'),
  version(
    'AHFPL906',
    'ready',
    'Update function instance "ab-test" arguments',
    'Bruno Germano',
    '3 days ago'
  ),
  version('AITJB4GN', 'ready', 'Add device group "Mobile"', 'Gab Lisboa', '4 days ago'),
  version('AK7D0ZX4', 'ready', 'Cache static assets for 30 days', 'Robson Junior', '6 days ago'),
  version('ALL6QVDL', 'ready', 'Remove rule "Legacy load balancer"', 'Isaque Böck', '1 week ago')
]

const TABS = [
  { value: 'main-settings', label: 'Settings' },
  { value: 'source', label: 'Source' },
  { value: 'device-groups', label: 'Device Groups' },
  { value: 'cache-settings', label: 'Cache Settings' },
  { value: 'functions-instances', label: 'Functions Instances' },
  { value: 'rules-engine', label: 'Rules Engine' }
]

const SAVE_OPTIONS = [
  { label: 'Save and Deploy', value: 'deploy' },
  { label: 'Save and Build', value: 'build' },
  { label: 'Save', value: 'save' }
]

const SETTINGS = {
  name: APPLICATION.name,
  active: true,
  modules: {
    application_accelerator: true,
    cache: true,
    device_detection: false,
    functions: true,
    image_processor: false,
    load_balancer: false,
    web_socket_proxy: false
  }
}

const DEFAULT_MODULES = [
  {
    key: 'application_accelerator',
    title: 'Application Accelerator',
    description: 'Optimize protocols and manage dynamic content delivery.'
  },
  { key: 'cache', title: 'Cache', description: 'Customize advanced cache settings.' },
  {
    key: 'device_detection',
    title: 'Device Detection',
    description: 'Activate DeviceAtlas variables to configure responsive rules.'
  },
  {
    key: 'functions',
    title: 'Functions',
    description: 'Build ultra-low latency functions that run on Azion.'
  },
  {
    key: 'image_processor',
    title: 'Image Processor',
    description: 'Enable dynamic image editing options.'
  },
  {
    key: 'load_balancer',
    title: 'Load Balancer',
    description:
      'Balance traffic to your origins ensuring reliability and network congestion control.'
  }
]

const HISTORY_WIDTH = 348

const OLDER_PAGE = 5

const DRAFT = {
  version: VERSIONS[0],
  earlier: VERSIONS.slice(1),
  editable: true,
  createdLabel: '',
  bar: {
    icon: 'pi pi-file-edit',
    title: 'Draft',
    description: 'This version is open for editing. Deploy it when ready.'
  }
}

const DEPLOYED = {
  version: VERSIONS[1],
  earlier: VERSIONS.slice(2),
  editable: false,
  createdLabel: 'Created Nov 5, 2026',
  bar: {
    icon: '',
    title: 'Viewing a Deployed version',
    description: VERSIONS[1].comment
  }
}

const attr = (text) => text.replaceAll('"', '&quot;')

const VERSION_CRUMB = `<Select
  :model-value="versionId"
  :display-value="(id) => versions.find((entry) => entry.id === id)?.name ?? String(id ?? '')"
  class="flex! w-auto! min-w-0"
  @update:open="(open) => { if (!open) query = '' }"
>
  <Select.Trigger
    aria-label="Switch version"
    class="h-6! w-auto! min-w-0 gap-(--spacing-xxs)! border-0! bg-transparent! px-(--spacing-xs)! text-label-md! hover:bg-(--bg-mask)! focus-visible:ring-offset-0! data-[state=open]:bg-(--bg-mask)!"
  />
  <Select.Content class="min-w-57">
    <template #search>
      <InputText
        v-model="query"
        size="small"
        placeholder="Search versions"
        aria-label="Search versions"
        @keydown.stop
      >
        <template #iconLeft>
          <i class="pi pi-search" aria-hidden="true" />
        </template>
      </InputText>
    </template>
    <Select.Group label="Versions">
      <Select.Option v-for="entry in matches" :key="entry.id" :value="entry.id">
        {{ entry.name }}
        <template #tag>
          <Tag :label="entry.tag.label" :severity="entry.tag.severity" :icon="entry.tag.icon" size="small" />
        </template>
      </Select.Option>
      <p
        v-if="!matches.length"
        class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
      >
        No versions match "{{ query }}".
      </p>
    </Select.Group>
    <template #footer>
      <Select.Option value="__create-version__" class="w-full">
        <span class="flex items-center gap-(--spacing-xs)">
          <i class="pi pi-plus-circle" aria-hidden="true" />
          Create new Version
        </span>
      </Select.Option>
    </template>
  </Select.Content>
</Select>`

const crumbs = () => `<Breadcrumb :items="[]"$1>
  <Breadcrumb.List>
    <li class="inline-flex items-center">
      <Breadcrumb.Item label="Applications" href="/applications" />
    </li>
    <Breadcrumb.Separator />
    <li class="inline-flex items-center">
      <Breadcrumb.Item label="${APPLICATION.name}" href="/applications/${APPLICATION.id}?tab=versions" />
    </li>
    <Breadcrumb.Separator />
    <li class="inline-flex min-w-0 items-center">
${indent(VERSION_CRUMB, 3)}
    </li>
  </Breadcrumb.List>
</Breadcrumb>`

const CRUMB_ELEMENT = /<Breadcrumb\b([^>]*?)\s*:items="breadcrumb"([^>]*?)\s*\/>/

const withVersionCrumb = (template) => {
  const match = template.match(CRUMB_ELEMENT)
  if (!match) throw new Error('ApplicationVersion: the shell breadcrumb element was not found')
  const [whole, before, after] = match
  const line = template.slice(0, template.indexOf(whole)).split('\n').pop()
  const depth = line.length / 2
  const replaced = indent(crumbs().replace('$1', `${before}${after}`), depth).trimStart()
  return template.replace(whole, replaced)
}

const SECTION_ANCHOR =
  'absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none'

const section = (title, hint, body) => {
  const id = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `<section
  data-stacked
  class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
>
  <div
    data-stacked
    class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
  >
    <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
      <button
        type="button"
        aria-label="Copy link to the ${title} section"
        class="${SECTION_ANCHOR}"
      >
        <i class="pi pi-link text-body-xs" aria-hidden="true" />
      </button>
      <h2 id="${id}" class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)">
        <span class="flex items-center gap-(--spacing-xs)">${title}</span>
      </h2>
      <Hint text="${hint}" class="shrink-0" />
    </div>
  </div>

  <div
    data-open
    class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
  >
    <div class="min-w-0 data-collapsible:overflow-hidden">
      <div
        data-open
        class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
      >
${indent(body, 4)}
      </div>
    </div>
  </div>
</section>`
}

const card = (rows) => `<CardBox :padded="false">
  <template #content>
    <Item.List>
${indent(rows, 3)}
    </Item.List>
  </template>
</CardBox>`

const GENERAL_ROWS = `<Item size="small">
  <Item.Content>
    <Item.Title>Name</Item.Title>
    <Item.Description>
      A unique and descriptive name to identify the application.
    </Item.Description>
  </Item.Content>
  <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
    <InputText v-model="settings.name" size="large" class="w-full" aria-label="Name" />
  </Item.Actions>
</Item>
<Item size="small">
  <Item.Content>
    <Item.Title>Active</Item.Title>
    <Item.Description>
      When disabled, the application stops serving traffic.
    </Item.Description>
  </Item.Content>
  <Item.Actions class="justify-end">
    <Switch v-model="settings.active" aria-label="Active" />
  </Item.Actions>
</Item>`

const MODULE_ROWS = `<Item v-for="mod in defaultModules" :key="mod.key" size="small">
  <Item.Content>
    <Item.Title>{{ mod.title }}</Item.Title>
    <Item.Description>{{ mod.description }}</Item.Description>
  </Item.Content>
  <Item.Actions class="justify-end">
    <Switch v-model="settings.modules[mod.key]" :aria-label="mod.title" />
  </Item.Actions>
</Item>`

const SUBSCRIPTION_ROWS = `<Item size="small">
  <Item.Content>
    <Item.Title>WebSocket Proxy</Item.Title>
    <Item.Description>
      Enhance real-time data exchange between your Application and backend services using the WebSocket protocol.
      <a
        href="https://www.azion.com/en/contact-sales/"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
      >
        Contact sales
        <i class="pi pi-external-link shrink-0 text-body-sm leading-none" aria-hidden="true" />
      </a>
    </Item.Description>
  </Item.Content>
  <Item.Actions class="justify-end">
    <Tooltip text="Contact sales to activate this module.">
      <Switch v-model="settings.modules.web_socket_proxy" disabled aria-label="WebSocket Proxy" />
    </Tooltip>
  </Item.Actions>
</Item>`

const MAIN_SETTINGS = `<form class="flex min-h-full flex-col" aria-label="Main settings" novalidate @submit.prevent>
  <div
    class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
  >
    <header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
      <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
        <div class="flex min-w-0 items-center gap-(--spacing-xs)">
          <h1 class="text-balance text-heading-xs text-(--text-default)">Settings</h1>
        </div>
        <p class="text-pretty text-body-sm text-(--text-muted)">
          Core configuration for this application.
        </p>
      </div>
    </header>

    <fieldset class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0">
      <legend class="sr-only">Main settings</legend>

${indent(
  [
    section(
      'General',
      'How this application is identified across the console, and whether it is serving traffic.',
      card(GENERAL_ROWS)
    ),
    section(
      'Modules',
      'The capabilities this application runs with, each of which can be toggled here.',
      card(MODULE_ROWS)
    ),
    section(
      'Subscription modules',
      'Paid add-ons that are activated with sales, not from this page.',
      card(SUBSCRIPTION_ROWS)
    )
  ].join('\n\n'),
  3
)}
    </fieldset>
  </div>
</form>`

const tabActions = (view) => {
  const { tag } = view.version
  const created = view.createdLabel
    ? `<span class="hidden text-body-sm text-(--text-muted) md:inline">
  ${view.createdLabel}
</span>
`
    : ''
  const editOption = view.editable
    ? `    <Dropdown.Option value="edit" label="Edit version info">
      <template #left>
        <i class="pi pi-pencil" aria-hidden="true" />
      </template>
    </Dropdown.Option>
`
    : ''
  return `${created}<Tag label="${tag.label}" severity="${tag.severity}"${tag.icon ? ` icon="${tag.icon}"` : ''} size="medium" />
<Dropdown placement="bottom-end" @select="openHistory">
  <Dropdown.Trigger>
    <IconButton icon="pi pi-ellipsis-h" kind="transparent" size="small" aria-label="Version actions" />
  </Dropdown.Trigger>
  <Dropdown.Group>
${editOption}    <Dropdown.Option
      value="history"
      :label="historyCollapsed ? 'Show version history' : 'Hide version history'"
    >
      <template #left>
        <i class="pi pi-history" aria-hidden="true" />
      </template>
    </Dropdown.Option>
  </Dropdown.Group>
</Dropdown>`
}

const TAB_BAR = (actions) => `<div class="border-b border-(--border-default)">
  <div class="layout-boundary-inline flex items-center gap-(--spacing-sm) py-(--spacing-sm)">
    <TabView v-model:value="activeTab" class="-ml-(--spacing-xs) min-w-0 flex-1">
      <TabView.List>
        <TabView.Item v-for="tab in tabs" :key="tab.value" :value="tab.value" :label="tab.label" />
      </TabView.List>
    </TabView>
    <div class="flex min-h-8 shrink-0 items-center gap-(--spacing-xs)">
${indent(actions, 3)}
    </div>
  </div>
</div>`

const BAR_ICON = (icon) => `<span
  class="hidden size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) md:flex"
  aria-hidden="true"
>
  <i class="${icon} text-body-sm text-(--text-default)" />
</span>
`

const DRAFT_ACTIONS = `<div class="flex shrink-0 items-center gap-(--spacing-xs)">
  <SplitButton
    :label="saveOptions.find((option) => option.value === saveAction).label"
    :icon="saveAction === 'deploy' ? 'pi pi-cloud-upload' : ''"
    kind="primary"
    size="medium"
    :model="saveOptions"
    @item-click="(event, item) => (saveAction = item.value)"
  />
</div>`

const DEPLOYED_ACTIONS = `<div class="flex shrink-0 items-center gap-(--spacing-xs)">
  <Button label="New Version" kind="outlined" size="medium" icon="pi pi-plus" />
  <Button label="Redeploy" kind="outlined" size="medium" icon="pi pi-refresh" />
</div>`

const footer = (view) => `<Transition
  appear
  enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
  enter-from-class="translate-y-2 opacity-0"
>
  <footer
    class="flex min-h-14 shrink-0 flex-col border-t border-(--border-default) bg-(--bg-surface)"
    data-testid="application-version-bar"
  >
    <div
      class="layout-boundary-inline flex min-w-0 flex-1 items-center gap-(--spacing-sm) py-(--spacing-xs)"
    >
${indent(
  `${view.bar.icon ? BAR_ICON(view.bar.icon) : ''}<div class="flex min-w-0 flex-1 flex-col" role="status">
  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
    <span class="truncate text-body-sm text-(--text-default)">${view.bar.title}</span>
    <span class="hidden shrink-0 sm:inline-flex">
      ${
        view.editable
          ? '<Tag label="Editable" severity="info" size="small" />'
          : '<Tag label="Read Only" severity="secondary" icon="pi pi-lock" size="small" />'
      }
    </span>
  </div>
  <p
    class="hidden truncate text-body-xs text-(--text-muted) data-dirty:text-(--text-default) md:block"
    title="${attr(view.bar.description)}"
  >
    ${view.bar.description}
  </p>
</div>

${view.editable ? DRAFT_ACTIONS : DEPLOYED_ACTIONS}`,
  3
)}
    </div>
  </footer>
</Transition>`

const META_LINE = (
  subject
) => `<span class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)">
  <span class="flex shrink-0">
    <Avatar :alt="${subject}.author" :label="${subject}.author" size="small" kind="square" />
  </span>
  <span class="truncate">{{ ${subject}.author }} · {{ ${subject}.createdAgo }}</span>
</span>`

const TIMELINE_LINE =
  '<span\n  class="absolute bottom-0 left-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"\n  aria-hidden="true"\n/>'

const DESCRIPTION_EDITOR = `<div v-if="editing" class="flex flex-col gap-(--spacing-sm) pt-(--spacing-xs)">
  <FieldTextarea
    v-model="draftText"
    label="Description"
    placeholder="What changed in this version?"
    helper-text="Shows in the version list and on the deployment."
  />
  <div class="flex justify-end gap-(--spacing-xs)">
    <Button label="Cancel" kind="outlined" size="small" @click="editing = false" />
    <Button
      label="Save"
      kind="primary"
      size="small"
      @click="() => { description = draftText.trim(); editing = false }"
    />
  </div>
</div>
<template v-else>
  <p
    :data-empty="!description || null"
    class="text-body-sm text-(--text-default) data-empty:text-(--text-muted)"
  >
    {{ description || 'No description' }}
  </p>
${indent(META_LINE('version'))}
</template>`

const DESCRIPTION_READ = `<p
  :data-empty="!description || null"
  class="text-body-sm text-(--text-default) data-empty:text-(--text-muted)"
>
  {{ description || 'No description' }}
</p>
${META_LINE('version')}`

const EDIT_BUTTON = `
<span v-if="!editing" class="ml-auto shrink-0">
  <IconButton
    icon="pi pi-pencil"
    kind="transparent"
    size="small"
    aria-label="Edit version info"
    @click="() => { draftText = description; editing = true }"
  />
</span>`

const NO_CHANGES = `<li class="relative flex flex-col pb-(--spacing-lg)">
${indent(TIMELINE_LINE)}
  <p class="flex gap-(--spacing-sm)">
    <span class="relative flex size-7 shrink-0 items-center justify-center" aria-hidden="true">
      <span class="size-2 rounded-full border border-(--border-strong) bg-(--bg-surface)" />
    </span>
    <span class="pt-1 text-body-sm text-(--text-muted)">
      No changes yet. Each change you save shows up here.
    </span>
  </p>
</li>`

const OLDER = `<li
  v-for="(entry, index) in earlier.slice(0, shown)"
  :key="entry.id"
  class="relative flex pb-(--spacing-lg) last:pb-0"
>
  <span
    v-if="index < earlier.slice(0, shown).length - 1"
    class="absolute bottom-0 left-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
    aria-hidden="true"
  />
  <button
    type="button"
    class="group flex w-full min-w-0 gap-(--spacing-sm) rounded-(--shape-button) text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
  >
    <span
      class="relative flex size-7 shrink-0 items-center justify-center rounded-full border border-(--border-default) bg-(--bg-surface) text-(--text-default)"
      aria-hidden="true"
    >
      <i class="pi pi-code text-body-xs" />
    </span>
    <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs) pt-0.5">
      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
        <span class="truncate text-label-md text-(--text-default) group-hover:underline">
          {{ entry.name }}
        </span>
        <span class="flex shrink-0">
          <Tag :label="entry.tag.label" :severity="entry.tag.severity" size="small" />
        </span>
      </span>
      <span class="line-clamp-2 text-body-sm text-(--text-muted)">
        {{ entry.comment }}
      </span>
${indent(META_LINE('entry'), 3)}
    </span>
  </button>
</li>`

const historyPanel = (view) => `<aside
  :inert="historyCollapsed"
  aria-labelledby="version-history-title"
  class="flex min-h-0 min-w-0 flex-1 flex-col bg-(--bg-surface)"
  data-testid="application-version-history"
  @keydown.esc="historyCollapsed = true"
>
  <header
    class="flex min-h-14 shrink-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) py-(--spacing-xs) pl-(--spacing-lg) pr-(--spacing-sm)"
  >
    <h2 id="version-history-title" class="truncate text-label-lg text-(--text-default)">
      Version history
    </h2>
    <IconButton
      icon="pi pi-times"
      kind="transparent"
      size="small"
      aria-label="Close version history"
      @click="historyCollapsed = true"
    />
  </header>
  <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-(--spacing-lg)">
    <ol class="flex flex-col">
      <li class="relative flex gap-(--spacing-sm) pb-(--spacing-lg)">
${indent(TIMELINE_LINE, 4)}
        <span
          class="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-(--accent) text-(--accent-contrast)"
          aria-hidden="true"
        >
          <i class="${view.version.tag.icon || 'pi pi-code'} text-body-xs" />
        </span>
        <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs) pt-0.5">
          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
            <span class="truncate text-label-md text-(--text-default)">
              {{ version.name }}
            </span>
            <span class="flex shrink-0">
              <Tag :label="version.tag.label" :severity="version.tag.severity" size="small" />
            </span>${view.editable ? indent(EDIT_BUTTON, 6) : ''}
          </div>
          <p class="text-label-sm text-(--text-muted)">Current version</p>

${indent(view.editable ? DESCRIPTION_EDITOR : DESCRIPTION_READ, 5)}
        </div>
      </li>
${view.editable ? `\n${indent(NO_CHANGES, 3)}\n` : ''}
${indent(OLDER, 3)}
    </ol>

    <div v-if="earlier.length > shown" class="pt-(--spacing-sm)">
      <Button label="Show older" kind="text" size="small" @click="shown += ${OLDER_PAGE}" />
    </div>
  </div>
</aside>`

const main = (view) => `<div class="grid h-full min-h-0">
  <ResizablePanel orientation="horizontal" aria-label="Version workspace">
    <ResizablePanel.Pane aria-label="Version settings">
      <main class="flex min-h-0 min-w-0 flex-1 flex-col">
${indent(TAB_BAR(tabActions(view)), 4)}

        <section
          class="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-processing:opacity-32 motion-reduce:transition-none"
        >
          <ScrollArea aria-label="Version settings" fade>
            <div class="flex min-h-full flex-col">
              <fieldset${view.editable ? '' : ' disabled'} class="contents">
                <legend class="sr-only">
                  ${APPLICATION.name} ${view.version.name}${view.editable ? '' : ', read-only'}
                </legend>
${indent(MAIN_SETTINGS, 8)}
              </fieldset>
            </div>
          </ScrollArea>
        </section>

${indent(footer(view), 4)}
      </main>
    </ResizablePanel.Pane>
    <ResizablePanel.Handle v-if="!historyCollapsed" aria-label="Resize the version history" />
    <ResizablePanel.Pane
      v-model:basis="historyBasis"
      v-model:collapsed="historyCollapsed"
      collapsible
      :min="280"
      :max="560"
      aria-label="Version history"
    >
${indent(historyPanel(view), 3)}
    </ResizablePanel.Pane>
  </ResizablePanel>
</div>`

const IMPORTS = [
  "import Avatar from '@aziontech/webkit/avatar'",
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import Dropdown from '@aziontech/webkit/dropdown'",
  "import FieldTextarea from '@aziontech/webkit/field-textarea'",
  "import Hint from '@aziontech/webkit/hint'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Item from '@aziontech/webkit/item'",
  "import ResizablePanel from '@aziontech/webkit/resizable-panel'",
  "import ScrollArea from '@aziontech/webkit/scroll-area'",
  "import Select from '@aziontech/webkit/select'",
  "import Switch from '@aziontech/webkit/switch'",
  "import TabView from '@aziontech/webkit/tab-view'",
  "import Tag from '@aziontech/webkit/tag'",
  "import Tooltip from '@aziontech/webkit/tooltip'"
]

const OPEN_HISTORY = [
  'const openHistory = (event, value) => {',
  "  if (value === 'history' && !historyCollapsed.value) {",
  '    historyCollapsed.value = true',
  '    return',
  '  }',
  "  editing.value = value === 'edit'",
  '  if (editing.value) draftText.value = description.value',
  '  historyCollapsed.value = false',
  '}'
]

const script = (view, historyOpen) => [
  ...IMPORTS,
  ...(view.editable ? ["import SplitButton from '@aziontech/webkit/split-button'"] : []),
  "import { computed, reactive, ref } from 'vue'",
  '',
  declare('tabs', TABS),
  declare('versions', VERSIONS),
  declare('version', view.version),
  declare('earlier', view.earlier),
  declare('defaultModules', DEFAULT_MODULES),
  ...(view.editable ? [declare('saveOptions', SAVE_OPTIONS)] : []),
  '',
  `const versionId = ref('${view.version.id}')`,
  "const query = ref('')",
  "const activeTab = ref('main-settings')",
  `const settings = reactive(${declare('x', SETTINGS).slice('const x = '.length)})`,
  ...(view.editable ? ["const saveAction = ref('deploy')"] : []),
  `const historyCollapsed = ref(${!historyOpen})`,
  `const historyBasis = ref(${HISTORY_WIDTH})`,
  `const description = ref('${view.version.comment.replaceAll("'", "\\'")}')`,
  "const draftText = ref('')",
  'const editing = ref(false)',
  `const shown = ref(${OLDER_PAGE})`,
  '',
  'const matches = computed(() =>',
  '  versions.filter((entry) => entry.name.toLowerCase().includes(query.value.trim().toLowerCase()))',
  ')',
  '',
  ...OPEN_HISTORY
]

const setup = (view, historyOpen) => {
  const query = ref('')
  const historyCollapsed = ref(!historyOpen)
  const description = ref(view.version.comment)
  const draftText = ref('')
  const editing = ref(false)
  const openHistory = (event, value) => {
    if (value === 'history' && !historyCollapsed.value) {
      historyCollapsed.value = true
      return
    }
    editing.value = value === 'edit'
    if (editing.value) draftText.value = description.value
    historyCollapsed.value = false
  }
  return {
    ...shellState('applications'),
    tabs: TABS,
    versions: VERSIONS,
    version: view.version,
    earlier: view.earlier,
    defaultModules: DEFAULT_MODULES,
    saveOptions: SAVE_OPTIONS,
    versionId: ref(view.version.id),
    query,
    activeTab: ref('main-settings'),
    settings: reactive(structuredClone(SETTINGS)),
    saveAction: ref('deploy'),
    historyCollapsed,
    historyBasis: ref(HISTORY_WIDTH),
    description,
    draftText,
    editing,
    shown: ref(OLDER_PAGE),
    matches: computed(() =>
      VERSIONS.filter((entry) =>
        entry.name.toLowerCase().includes(query.value.trim().toLowerCase())
      )
    ),
    openHistory
  }
}

const components = {
  ...SHELL_COMPONENTS,
  Avatar,
  Breadcrumb,
  'Breadcrumb.List': Breadcrumb.List,
  'Breadcrumb.Item': Breadcrumb.Item,
  'Breadcrumb.Separator': Breadcrumb.Separator,
  Button,
  CardBox,
  Dropdown,
  'Dropdown.Trigger': Dropdown.Trigger,
  'Dropdown.Group': Dropdown.Group,
  'Dropdown.Option': Dropdown.Option,
  FieldTextarea,
  Hint,
  IconButton,
  InputText,
  Item,
  'Item.List': Item.List,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Description': Item.Description,
  'Item.Actions': Item.Actions,
  ResizablePanel,
  'ResizablePanel.Pane': ResizablePanel.Pane,
  'ResizablePanel.Handle': ResizablePanel.Handle,
  ScrollArea,
  Select,
  'Select.Trigger': Select.Trigger,
  'Select.Content': Select.Content,
  'Select.Group': Select.Group,
  'Select.Option': Select.Option,
  SplitButton,
  Switch,
  TabView,
  'TabView.List': TabView.List,
  'TabView.Item': TabView.Item,
  Tag,
  Tooltip
}

const story = (view, historyOpen, description) => {
  const template = withVersionCrumb(shell({ withBreadcrumb: true, main: pageScroll(main(view)) }))
  return {
    render: () => ({
      components,
      setup: () => setup(view, historyOpen),
      template
    }),
    parameters: {
      docs: {
        description: { story: description },
        source: {
          code: toSfc(
            mergeScripts(
              scriptLines({
                parts: ['Breadcrumb'],
                active: 'applications',
                declarations: [],
                state: []
              }),
              script(view, historyOpen)
            ),
            template
          )
        }
      }
    }
  }
}

const meta = {
  title: 'Templates/Platform/Detail/ApplicationVersion',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'One version of an application, opened from its Versions tab: the platform shell whose last breadcrumb is a Select that switches between the application versions, each with its state Tag, or creates a new one. Under it a horizontal `ResizablePanel` holds the version workspace, a tab bar with Settings, Source, Device Groups, Cache Settings, Functions Instances and Rules Engine carrying the state Tag and a Version actions menu, the open tab in a fading `ScrollArea`, and the version bar pinned to the bottom that names the state and holds the Save and Deploy `SplitButton` on a draft or New Version and Redeploy on a built version, and a collapsible Version history pane with the current version, its changes and the earlier built versions. The stories open on the Settings tab; the Rules Engine tab is the Forms/RulesEngine template, and the Source, Device Groups, Cache Settings and Functions Instances panels are not plotted here. Built from the platform shell, `Breadcrumb`, `Select`, `ResizablePanel`, `TabView`, `Tag`, `Dropdown`, `ScrollArea`, `CardBox`, `Item`, `InputText`, `Switch`, `Hint`, `SplitButton`, `Button`, `Avatar` and `FieldTextarea`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Draft = story(
  DRAFT,
  false,
  'The working draft: the Draft Tag with Edit version info and Show version history in the actions menu, every setting editable, and the version bar reading Draft and Editable with the Save and Deploy split button, which switches to Save and Build or Save.'
)

export const Deployed = story(
  DEPLOYED,
  false,
  'The deployed version, read-only: the creation date beside the Deployed Tag, the settings fieldset disabled, and the version bar reading Viewing a Deployed version and Read Only with its description, New Version and Redeploy.'
)

export const VersionHistory = story(
  DRAFT,
  true,
  'The draft with Version history open beside it: the current version with its description, author and the pencil that edits it in place, the empty changes entry, and the five newest earlier versions with Show older for the rest.'
)
