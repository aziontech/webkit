<script setup>
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import Tag from '@aziontech/webkit/tag'

  const onMetaAction = (action) => action
</script>

<template>
  <DocPageHeader
    description="Terminal agent that reads your codebase, runs commands, and edits files. One CLI command connects the Azion MCP server."
    :breadcrumb="[{ label: 'Agent Setup', href: '/docs/agent-setup' }, { label: 'Claude Code' }]"
    :meta-actions="[
      {
        value: 'copy',
        label: 'Copy as Markdown',
        icon: 'pi pi-copy',
        tip: 'Copy this page as Markdown, ready to paste into an assistant.'
      },
      {
        value: 'agent-setup',
        label: 'Agent setup',
        icon: 'pi pi-microchip-ai',
        href: '/docs/agent-setup',
        tip: 'Set up your coding agent to build on Azion.'
      }
    ]"
    @meta-action="onMetaAction"
  >
    <template #title>
      <div
        class="flex min-w-0 flex-col items-start gap-(--spacing-sm) sm:flex-1 sm:flex-row sm:items-center sm:gap-(--spacing-md)"
      >
        <span
          class="flex size-14 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised) sm:size-16"
        >
          <i
            class="pi pi-microchip-ai text-heading-lg text-(--text-default)"
            aria-hidden="true"
          />
        </span>
        <div class="min-w-0 flex-1">
          <span class="block text-overline-sm uppercase text-(--text-primary)">Anthropic</span>
          <h1 class="m-0 text-heading-2xl text-(--text-default) sm:text-heading-xl">
            Claude Code + Azion
          </h1>
        </div>
      </div>
    </template>
    <template #details>
      <div class="flex flex-wrap items-center gap-(--spacing-xs)">
        <Tag
          label="Terminal"
          size="medium"
          rounded
        />
        <Tag
          label="Subscription"
          size="medium"
          rounded
        />
        <Tag
          label="Project memory"
          size="medium"
          rounded
        />
      </div>
    </template>
  </DocPageHeader>
</template>
