<script setup lang="ts">
  import claudeMark from '@aziontech/webkit/assets/claude-symbol-color.svg'
  import codexMark from '@aziontech/webkit/assets/codex-symbol-mono.svg'
  import cursorMark from '@aziontech/webkit/assets/cursor-symbol-mono.svg'
  import geminiMark from '@aziontech/webkit/assets/gemini-symbol-color.svg'
  import Card from '@aziontech/webkit/card'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item-root'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatTileGroup from '@aziontech/webkit/stat-tile-group'
  import ThirdPartyLogo from '@aziontech/webkit/third-party-logo'
  import Tooltip from '@aziontech/webkit/tooltip'

  import type { HomeMetricDefinition } from '../home-metrics'

  /** One usage tile, its definition and its measured figure. */
  export interface HomeUsageTile extends HomeMetricDefinition {
    /** The figure; null reads as a dash. */
    value: number | null
    /** Change against the previous window; null hides the delta. */
    delta: number | null
  }

  export interface HomeUsageBandProps {
    /** The usage tiles, in the order they render. */
    tiles: HomeUsageTile[]
    /** What every delta compares against. */
    comparison: string
    /** The figures are loading. */
    loading: boolean
    /** Why the figures could not load; empty shows the tiles. */
    error: string
  }

  defineProps<HomeUsageBandProps>()

  const agentSetup = defineModel<boolean>('agentSetup', { required: true })

  const agentMarks = [
    { name: 'Claude', src: claudeMark, mono: false },
    { name: 'Codex', src: codexMark, mono: true },
    { name: 'Gemini', src: geminiMark, mono: false },
    { name: 'Cursor', src: cursorMark, mono: true }
  ]

  const AGENT_STACK_CLASS =
    'flex items-center [&>*+*]:-ms-2 [&>*+*]:transition-[margin-left] [&>*+*]:duration-moderate-01 [&>*+*]:ease-productive-entrance group-hover/item:[&>*+*]:-ms-1.5 ' +
    'group-focus-visible/item:[&>*+*]:-ms-1.5 motion-reduce:[&>*+*]:transition-none'

  const AGENT_MARK_CLASS =
    'flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised) ' +
    'text-(--text-default)'
</script>

<template>
  <aside
    class="animate-content-enter motion-reduce:animate-none flex w-full shrink-0 flex-col gap-(--layout-group-gap) xl:flex-row xl:items-stretch xl:gap-(--layout-section-gap)"
    aria-label="Usage"
  >
    <div class="min-w-0 xl:flex-1">
      <p
        v-if="error"
        class="text-body-sm text-(--text-muted)"
      >
        Not available.
      </p>
      <StatTileGroup v-else>
        <StatTile
          v-for="metric in tiles"
          :key="metric.label"
          :label="metric.label"
          :value="metric.value"
          :unit="metric.unit"
          :delta="metric.delta"
          :delta-label="comparison"
          :loading="loading"
          :error="error"
        >
          <template #aside>
            <Hint :content="metric.hint" />
          </template>
        </StatTile>
      </StatTileGroup>
    </div>

    <Transition
      leave-active-class="transition-[scale,translate,opacity] duration-moderate-01 ease-productive-exit motion-reduce:transition-none"
      leave-to-class="scale-95 translate-y-(--spacing-xs) opacity-0"
    >
      <div
        v-if="agentSetup"
        class="relative w-full shrink-0 xl:w-[30%] xl:max-w-(--container-xs)"
      >
        <Card
          :padded="false"
          class="w-full"
        >
          <template #default>
            <Item
              href="/agents/setup"
              class="h-full"
            >
              <span class="flex min-w-0 flex-col items-start gap-(--spacing-md)">
                <span
                  :class="AGENT_STACK_CLASS"
                  aria-hidden="true"
                >
                  <span
                    v-for="agent in agentMarks"
                    :key="agent.name"
                    :class="AGENT_MARK_CLASS"
                  >
                    <ThirdPartyLogo
                      :name="agent.name"
                      :src="agent.src"
                      :variant="agent.mono ? 'current' : 'color'"
                      decorative
                      size="small"
                    />
                  </span>
                </span>

                <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                  <span class="text-heading-2xs text-(--text-default)"
                    >Set up your coding agent</span
                  >
                  <span class="text-pretty text-body-sm text-(--text-muted)"
                    >Give your editor a prompt that teaches it to build and deploy here.</span
                  >
                </span>
              </span>
            </Item>
          </template>
        </Card>
        <div class="absolute end-(--spacing-xs) top-(--spacing-xs)">
          <Tooltip
            content="Dismiss"
            side="top"
          >
            <IconButton
              icon="az az-x"
              variant="ghost"
              size="small"
              aria-label="Dismiss agent setup"
              @click="agentSetup = false"
            />
          </Tooltip>
        </div>
      </div>
    </Transition>
  </aside>
</template>
