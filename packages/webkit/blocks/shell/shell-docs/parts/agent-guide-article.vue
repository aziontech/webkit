<script setup lang="ts">
  import DataTable from '@aziontech/webkit/data-table'
  import DocAccordion from '@aziontech/webkit/doc-accordion'
  import DocAccordionGroup from '@aziontech/webkit/doc-accordion-group'
  import DocCallout from '@aziontech/webkit/doc-callout'
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
  import DocCodeGroup from '@aziontech/webkit/doc-code-group'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocItem from '@aziontech/webkit/doc-item'
  import DocMarkdown from '@aziontech/webkit/doc-markdown'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocPreviousNext from '@aziontech/webkit/doc-previous-next'
  import DocPrompt from '@aziontech/webkit/doc-prompt'
  import DocProse from '@aziontech/webkit/doc-prose'
  import DocSteps from '@aziontech/webkit/doc-steps'
  import ItemList from '@aziontech/webkit/item-list'
  import Link from '@aziontech/webkit/link'
  import RegistrationFrame from '@aziontech/webkit/registration-frame'
  import Tag from '@aziontech/webkit/tag'
  import ThirdPartyLogo from '@aziontech/webkit/third-party-logo'

  import {
    browserPrimer,
    cliSamples,
    contextSample,
    crumbs,
    docLinks,
    facts,
    faq,
    headerLinks,
    MCP_SERVER_URL,
    mcpColumns,
    mcpTools,
    metaActions,
    others,
    prompts,
    steps,
    tips,
    troubleshooting
  } from '../agent-guide-data'
</script>

<template>
  <article
    class="layout-column-content layout-boundary-inline flex flex-col gap-(--spacing-lg) pt-(--spacing-md) pb-(--spacing-2xl)"
  >
    <DocPageHeader
      description="Terminal agent that reads your codebase, runs commands and edits files. Made by Anthropic."
      :breadcrumbs="crumbs"
      last-updated="2026-08-26"
      :meta-actions="metaActions"
    >
      <template #title>
        <div
          class="flex min-w-0 flex-col items-start gap-(--spacing-sm) sm:flex-1 sm:flex-row sm:items-center sm:gap-(--spacing-md)"
        >
          <span
            class="flex size-14 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised) sm:size-16"
          >
            <i
              class="az az-claude text-heading-md text-(--text-default)"
              aria-hidden="true"
            />
          </span>
          <div class="min-w-0 flex-1">
            <span class="block text-overline-sm text-(--text-muted)">Anthropic</span>
            <h1 class="m-0 text-heading-xl text-(--text-default)">Claude Code + Azion</h1>
          </div>
        </div>
      </template>
      <template #details>
        <div class="flex flex-col gap-(--spacing-md)">
          <div class="flex flex-wrap items-center gap-(--spacing-xs)">
            <Tag
              v-for="fact in facts"
              :key="fact"
              :label="fact"
              severity="neutral"
              size="medium"
              rounded
            />
          </div>
          <div class="flex flex-wrap items-center gap-x-(--spacing-xs) gap-y-(--spacing-2xs)">
            <template
              v-for="(link, index) in headerLinks"
              :key="link.href"
            >
              <span
                v-if="index > 0"
                class="text-label-md text-(--text-muted)"
                aria-hidden="true"
                >·</span
              >
              <Link
                :href="link.href"
                target="_blank"
                size="small"
                icon="az az-arrow-up-right"
                :label="link.label"
              />
            </template>
          </div>
        </div>
      </template>
    </DocPageHeader>

    <DocProse>
      <DocHeading
        anchor="quick-start"
        :level="2"
        >Quick start</DocHeading
      >
      <DocSteps>
        <DocSteps.Step
          v-for="step in steps"
          :key="step.title"
          :title="step.title"
        >
          <div class="[&>*>*:first-child]:pt-0!">
            <DocMarkdown :source="step.body" />
          </div>
          <DocCodeGroup
            v-if="step.samples"
            :samples="step.samples"
          />
          <DocCallout
            v-if="step.note"
            variant="warning"
            :label="step.note"
          />
          <DocPrompt
            v-if="step.prompt"
            title="Try it"
            >{{ step.prompt }}</DocPrompt
          >
        </DocSteps.Step>
      </DocSteps>

      <DocHeading
        anchor="platform-access"
        :level="2"
        >Azion platform access</DocHeading
      >
      <p>
        Three layers, and a connected agent uses all three: the MCP server to look things up and
        create configuration, the CLI to build and deploy from your working copy, and a context file
        so it starts each session knowing your account.
      </p>
      <DocHeading
        anchor="mcp-tools"
        :level="3"
        >MCP server</DocHeading
      >
      <p>
        One HTTP endpoint at <code>{{ MCP_SERVER_URL }}</code
        >, authenticated with your Personal Token. It exposes these tools:
      </p>
      <div
        data-doc-block
        data-doc-chrome
      >
        <DataTable
          :data="mcpTools"
          :columns="mcpColumns"
          row-key="id"
          bordered
        >
          <template #cell-title="{ row }">
            <code
              class="rounded-(--shape-control) border border-(--border-default) bg-(--bg-hover) px-(--spacing-xs) py-0.5 text-label-code-sm text-(--text-default)"
              >{{ row.title }}</code
            >
          </template>
        </DataTable>
      </div>
      <DocHeading
        anchor="cli"
        :level="3"
        >Azion CLI</DocHeading
      >
      <p>
        Local builds, deploys and the product commands the API does not cover. Install it once and
        Claude Code runs it for you; the first <code>azion login</code> is interactive, so run that
        one yourself.
      </p>
      <DocCodeGroup :samples="cliSamples" />
      <DocHeading
        anchor="agent-context"
        :level="3"
        >Agent context</DocHeading
      >
      <p>
        Claude Code reads <code>CLAUDE.md</code> at the repository root before it answers: a few
        committed lines that every session starts with.
      </p>
      <DocCodeGroup :samples="contextSample" />

      <DocHeading
        anchor="agent-friendly-docs"
        :level="2"
        >Agent-friendly docs</DocHeading
      >
      <p>Token-efficient references an agent can fetch on its own, with no tool call.</p>
      <RegistrationFrame
        data-doc-block
        data-doc-chrome
        class="w-full bg-(--bg-surface)"
      >
        <ItemList>
          <DocItem
            v-for="link in docLinks"
            :key="link.title"
            :title="link.title"
            :icon="link.icon"
            :href="link.href"
            >{{ link.description }}</DocItem
          >
        </ItemList>
      </RegistrationFrame>
      <p>No MCP support in the tool you are using? Prime it by hand, once per session:</p>
      <DocPrompt
        title="Any assistant"
        icon="az az-comment"
        >{{ browserPrimer }}</DocPrompt
      >

      <DocHeading
        anchor="example-prompts"
        :level="2"
        >Example prompts</DocHeading
      >
      <p>Each one exercises a different part of the connection.</p>
      <DocPrompt
        v-for="prompt in prompts"
        :key="prompt"
        >{{ prompt }}</DocPrompt
      >

      <DocHeading
        anchor="tips"
        :level="2"
        >Tips</DocHeading
      >
      <DocCallout
        v-for="tip in tips"
        :key="tip"
        variant="tip"
        :label="tip"
      />

      <DocHeading
        anchor="faq"
        :level="2"
        >FAQ</DocHeading
      >
      <DocAccordionGroup>
        <DocAccordion
          v-for="entry in faq"
          :key="entry.question"
          :title="entry.question"
        >
          <div class="[&>*>*:first-child]:pt-0!">
            <DocMarkdown :source="entry.answer" />
          </div>
        </DocAccordion>
      </DocAccordionGroup>

      <DocHeading
        anchor="troubleshooting"
        :level="2"
        >Troubleshooting</DocHeading
      >
      <DocAccordionGroup>
        <DocAccordion
          v-for="entry in troubleshooting"
          :key="entry.question"
          :title="entry.question"
        >
          <div class="[&>*>*:first-child]:pt-0!">
            <DocMarkdown :source="entry.answer" />
          </div>
        </DocAccordion>
      </DocAccordionGroup>

      <DocHeading
        anchor="other-agents"
        :level="2"
        >Other agents</DocHeading
      >
      <DocCardGroup :columns="3">
        <DocCard
          v-for="other in others"
          :key="other.slug"
          :title="other.name"
          :eyebrow="other.vendor"
          :icon="other.icon"
          :href="`/docs/agent-setup/${other.slug}`"
        >
          <template
            v-if="other.logo"
            #icon
          >
            <span class="flex text-(--text-default)">
              <ThirdPartyLogo
                :name="other.name"
                :src="other.logo"
                :variant="other.mono ? 'current' : 'color'"
                decorative
              />
            </span>
          </template>
          {{ other.description }}
        </DocCard>
      </DocCardGroup>
    </DocProse>
    <DocPreviousNext
      :previous="{ label: 'Agent setup', href: '/docs/agent-setup' }"
      :next="{ label: 'Cursor', href: '/docs/agent-setup/cursor' }"
    />
  </article>
</template>
