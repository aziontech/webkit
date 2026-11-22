<script setup lang="ts">
  import DataTable from '@aziontech/webkit/data-table'
  import DocCallout from '@aziontech/webkit/doc-callout'
  import DocCard from '@aziontech/webkit/doc-card'
  import DocCardGroup from '@aziontech/webkit/doc-card-group'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocPreviousNext from '@aziontech/webkit/doc-previous-next'
  import DocProse from '@aziontech/webkit/doc-prose'
  import Item from '@aziontech/webkit/item-root'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import ThirdPartyLogo from '@aziontech/webkit/third-party-logo'

  import {
    agentHref,
    compareColumns,
    compareRows,
    crumbs,
    flagColumns,
    grids,
    keyConcepts,
    metaActions,
    tagColumns,
    tradeoffs,
    workflowTypes
  } from '../agent-setup-data'
</script>

<template>
  <article
    class="layout-column-content layout-boundary-inline flex flex-col gap-(--spacing-lg) pt-(--spacing-md) pb-(--spacing-2xl)"
  >
    <DocPageHeader
      title="Agent setup"
      description="Azion ships an MCP server, agent-ready documentation and a CLI, so your coding agent can build on the platform from your editor or terminal."
      :breadcrumbs="crumbs"
      last-updated="2026-08-26"
      :meta-actions="metaActions"
    />
    <DocProse>
      <DocHeading
        anchor="pick-your-agent"
        :level="2"
        >Pick your agent</DocHeading
      >
      <p>Select an agent to get step-by-step setup instructions.</p>
      <Tabs
        data-doc-block
        default-value="All"
      >
        <Tabs.List>
          <Tabs.Trigger
            v-for="grid in grids"
            :key="grid.filter"
            :value="grid.filter"
            :label="grid.filter"
          />
        </Tabs.List>
        <Tabs.Content
          v-for="grid in grids"
          :key="grid.filter"
          :value="grid.filter"
        >
          <DocCardGroup :columns="3">
            <DocCard
              v-for="agent in grid.agents"
              :key="agent.slug"
              :title="agent.name"
              :eyebrow="agent.vendor"
              :icon="agent.icon"
              :href="agentHref(agent)"
            >
              <template
                v-if="agent.logo"
                #icon
              >
                <span class="flex text-(--text-default)">
                  <ThirdPartyLogo
                    :name="agent.name"
                    :src="agent.logo"
                    :variant="agent.mono ? 'current' : 'color'"
                    decorative
                  />
                </span>
              </template>
              {{ agent.description }}
            </DocCard>
          </DocCardGroup>
        </Tabs.Content>
      </Tabs>
      <p>
        Using another client that speaks MCP? The server is one HTTP endpoint: point your client at
        <code>mcp.azion.com</code> with a Personal Token and the nine tools show up.
      </p>

      <DocHeading
        anchor="compare-agents"
        :level="2"
        >Compare agents</DocHeading
      >
      <div
        data-doc-block
        data-doc-chrome
      >
        <DataTable
          :data="compareRows"
          :columns="compareColumns"
          row-key="id"
          bordered
        >
          <template #cell-agent="{ row }">
            <Item
              :href="row.href"
              variant="inline"
              size="small"
            >
              <ThirdPartyLogo
                v-if="row.logo"
                :name="row.agent"
                :src="row.logo"
                :variant="row.mono ? 'current' : 'color'"
                decorative
                size="small"
              />
              <i
                v-else
                :class="row.icon"
                class="shrink-0 text-label-md"
                aria-hidden="true"
              />
              <span class="truncate">{{ row.agent }}</span>
            </Item>
          </template>
          <template
            v-for="column in flagColumns"
            :key="column"
            #[`cell-${column}`]="{ value }"
          >
            <i
              :class="value ? 'az-check text-(--primary)' : 'az-minus text-(--text-muted)'"
              class="az text-label-md"
              aria-hidden="true"
            />
            <span class="sr-only">{{ value ? 'Yes' : 'No' }}</span>
          </template>
          <template
            v-for="column in tagColumns"
            :key="column"
            #[`cell-${column}`]="{ value }"
          >
            <Tag
              :label="String(value)"
              severity="neutral"
              size="small"
            />
          </template>
        </DataTable>
      </div>
      <DocCallout variant="note">
        Every agent listed connects to the Azion MCP server. The workflow columns say where the tool
        runs, not what it can do.
      </DocCallout>

      <DocHeading
        anchor="understanding-agents"
        :level="2"
        >Understanding agents</DocHeading
      >
      <p>Common types, concepts and tradeoffs.</p>
      <DocHeading
        anchor="workflow"
        :level="3"
        >Workflow</DocHeading
      >
      <DocCardGroup :columns="2">
        <DocCard
          v-for="type in workflowTypes"
          :key="type.title"
          :title="type.title"
          :icon="type.icon"
          :label="type.description"
        />
      </DocCardGroup>
      <DocHeading
        anchor="key-concepts"
        :level="3"
        >Key concepts</DocHeading
      >
      <DocCardGroup :columns="2">
        <DocCard
          v-for="concept in keyConcepts"
          :key="concept.title"
          :title="concept.title"
          :icon="concept.icon"
          :label="concept.description"
        />
      </DocCardGroup>
      <DocHeading
        anchor="common-tradeoffs"
        :level="3"
        >Common tradeoffs</DocHeading
      >
      <DocCardGroup :columns="2">
        <DocCard
          v-for="tradeoff in tradeoffs"
          :key="tradeoff.title"
          :title="tradeoff.title"
          :icon="tradeoff.icon"
          :label="tradeoff.description"
        />
      </DocCardGroup>
    </DocProse>
    <DocPreviousNext
      :previous="{ label: 'MCP server', href: '/docs/dev-tools/mcp' }"
      :next="{ label: 'Claude Code', href: '/docs/agent-setup/claude-code' }"
    />
  </article>
</template>
