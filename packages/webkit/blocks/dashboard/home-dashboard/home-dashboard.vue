<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import claudeMark from '@aziontech/webkit/assets/claude-symbol-color.svg'
  import codexMark from '@aziontech/webkit/assets/codex-symbol-mono.svg'
  import cursorMark from '@aziontech/webkit/assets/cursor-symbol-mono.svg'
  import geminiMark from '@aziontech/webkit/assets/gemini-symbol-color.svg'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import Logo from '@aziontech/webkit/logo'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatTileGroup from '@aziontech/webkit/stat-tile-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  const metrics = [
    {
      label: 'Data transferred',
      value: 842,
      unit: 'GB',
      delta: 12.4,
      hint: 'Total bytes delivered across all your resources.'
    },
    {
      label: 'Requests per second',
      value: 1240,
      unit: '/s',
      delta: 3.8,
      hint: 'Average requests handled per second in the selected window.'
    },
    {
      label: 'Bandwidth saving',
      value: 588,
      unit: 'GB',
      delta: 6.2,
      hint: 'Bytes served from cache instead of your origin.'
    },
    {
      label: 'Data offload',
      value: 70,
      unit: '%',
      delta: -1.5,
      hint: 'Share of traffic served from cache instead of your origin.'
    }
  ]

  const panels = [
    {
      key: 'projects',
      label: 'Projects',
      path: '/projects',
      recent: false,
      marked: true,
      resources: [
        {
          id: '4410203040',
          type: 'projects',
          typeLabel: 'Project',
          name: 'marketing-site',
          presetIcon: 'ai-color ai-astro',
          presetLabel: 'Astro'
        },
        {
          id: '6630405070',
          type: 'projects',
          typeLabel: 'Project',
          name: 'docs-site',
          presetIcon: 'ai-color ai-nextjs',
          presetLabel: 'Next.js'
        },
        {
          id: '5520304060',
          type: 'projects',
          typeLabel: 'Project',
          name: 'black-friday-2026',
          presetIcon: 'ai-color ai-nextjs',
          presetLabel: 'Next.js'
        },
        {
          id: '2041778390',
          type: 'projects',
          typeLabel: 'Project',
          name: 'hello-world',
          presetIcon: 'ai-color ai-javascript',
          presetLabel: 'JavaScript'
        },
        {
          id: '1784552864',
          type: 'projects',
          typeLabel: 'Project',
          name: 'web-app',
          presetIcon: 'ai-color ai-vue',
          presetLabel: 'Vue'
        }
      ]
    },
    {
      key: 'resources',
      label: 'Resources',
      path: '/resources',
      recent: false,
      marked: false,
      resources: [
        { id: '1020655', type: 'resources', typeLabel: 'Resource', name: 'resource-01' },
        { id: '1031410003', type: 'resources', typeLabel: 'Resource', name: 'resource-02' },
        { id: '1031410001', type: 'resources', typeLabel: 'Resource', name: 'resource-03' }
      ]
    },
    {
      key: 'domains',
      label: 'Domains',
      path: '',
      recent: false,
      marked: false,
      resources: [
        { id: 'domain-1020655', type: 'domains', typeLabel: 'Domain', name: 'app.example.com' },
        {
          id: 'domain-1031410003',
          type: 'domains',
          typeLabel: 'Domain',
          name: '*.preview.example.com'
        },
        { id: 'domain-1031410001', type: 'domains', typeLabel: 'Domain', name: 'www.example.com' },
        { id: 'domain-1031410002', type: 'domains', typeLabel: 'Domain', name: 'api.example.com' }
      ]
    },
    {
      key: 'recents',
      label: 'Recents',
      path: '',
      recent: true,
      marked: false,
      resources: [
        { id: '1020655', type: 'resources', typeLabel: 'Resource', name: 'resource-01' },
        { id: 'domain-1020655', type: 'domains', typeLabel: 'Domain', name: 'app.example.com' },
        {
          id: '4410203040',
          type: 'projects',
          typeLabel: 'Project',
          name: 'marketing-site',
          presetIcon: 'ai-color ai-astro',
          presetLabel: 'Astro'
        },
        {
          id: '6630405070',
          type: 'projects',
          typeLabel: 'Project',
          name: 'docs-site',
          presetIcon: 'ai-color ai-nextjs',
          presetLabel: 'Next.js'
        },
        {
          id: '5520304060',
          type: 'projects',
          typeLabel: 'Project',
          name: 'black-friday-2026',
          presetIcon: 'ai-color ai-nextjs',
          presetLabel: 'Next.js'
        }
      ]
    }
  ]

  const agentMarks = [
    { name: 'Claude', src: claudeMark, mono: false },
    { name: 'Codex', src: codexMark, mono: true },
    { name: 'Gemini', src: geminiMark, mono: false },
    { name: 'Cursor', src: cursorMark, mono: true }
  ]

  const resourcePath = (resource: { type: string; id: string }) =>
    `/${resource.type}/${resource.id}`

  const agentOnboardingVisible = ref(true)
  const failed = false

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()
</script>

<template>
  <div
    data-layout-fill
    class="layout-column layout-boundary relative flex h-dvh flex-col justify-center-safe overflow-y-auto xl:justify-start"
  >
    <header class="flex items-center">
      <h1 class="text-heading-sm text-(--text-muted)">
        Good morning,
        <span class="text-(--text-default)">Alex</span>
      </h1>
    </header>

    <div
      class="layout-section-start flex flex-col gap-(--layout-boundary-start) xl:min-h-0 xl:flex-1"
    >
      <aside
        class="animate-content-enter motion-reduce:animate-none flex w-full shrink-0 flex-col gap-(--layout-group-gap) xl:flex-row xl:items-stretch xl:gap-(--layout-section-gap)"
        aria-label="Usage"
      >
        <div class="min-w-0 xl:flex-1">
          <Alert
            v-if="failed"
            severity="danger"
            label="Couldn't load usage. Check your connection and retry."
            action-label="Retry"
            @action="(event) => emit('retry', event)"
          />
          <StatTileGroup v-else>
            <StatTile
              v-for="metric in metrics"
              :key="metric.label"
              :label="metric.label"
              :value="metric.value"
              :unit="metric.unit"
              :delta="metric.delta"
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
            v-if="agentOnboardingVisible"
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
                      class="flex items-center [&>*+*]:-ms-2 [&>*+*]:transition-[margin-left] [&>*+*]:duration-moderate-01 [&>*+*]:ease-productive-entrance group-hover/item:[&>*+*]:-ms-1.5 group-focus-visible/item:[&>*+*]:-ms-1.5 motion-reduce:[&>*+*]:transition-none"
                      aria-hidden="true"
                    >
                      <span
                        v-for="agent in agentMarks"
                        :key="agent.name"
                        class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised) text-(--text-default)"
                      >
                        <Logo
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
                  icon="ai ai-x"
                  variant="ghost"
                  size="small"
                  aria-label="Dismiss agent setup"
                  @click="agentOnboardingVisible = false"
                />
              </Tooltip>
            </div>
          </div>
        </Transition>
      </aside>

      <section
        class="animate-content-enter motion-reduce:animate-none mt-(--spacing-lg) grid w-full min-w-0 grid-cols-1 gap-(--layout-group-gap) sm:grid-cols-2 lg:grid-cols-3 xl:min-h-0 xl:flex-1 xl:grid-cols-5 xl:gap-(--layout-section-gap) [--content-enter-delay:var(--transition-duration-fast-01)]"
        aria-label="Resources"
      >
        <div
          v-for="panel in panels"
          :key="panel.key"
          class="flex min-w-0 flex-col gap-(--spacing-xs) xl:min-h-0"
          :class="panel.recent ? 'sm:col-span-2 lg:col-span-3 xl:col-span-2' : ''"
        >
          <h2
            class="flex min-h-(--size-6) items-center gap-(--spacing-xs) text-label-sm text-(--text-default)"
          >
            <span
              v-if="panel.marked || panel.recent"
              class="shrink-0"
              aria-hidden="true"
            />
            <Link
              v-if="panel.path"
              :href="panel.path"
              :label="panel.label"
              size="small"
              icon="ai ai-chevron-right"
            />
            <span v-else>{{ panel.label }}</span>
          </h2>

          <div class="min-w-0 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:overscroll-contain">
            <Alert
              v-if="failed"
              severity="danger"
              :label="`Couldn't load ${panel.label.toLowerCase()}. Check your connection and retry.`"
              action-label="Retry"
              @action="(event) => emit('retry', event)"
            />
            <Item.List
              v-else-if="panel.resources.length"
              key="panel-rows"
            >
              <Item
                v-for="resource in panel.resources"
                :key="resource.type + '-' + resource.id"
                :href="resourcePath(resource)"
                size="small"
              >
                <Item.Content>
                  <Item.Title class="w-full">
                    <template v-if="panel.recent">
                      <span
                        class="flex shrink-0 items-center justify-center"
                        aria-hidden="true"
                      >
                        <i class="ai ai-history text-body-xs leading-none text-(--text-muted)" />
                      </span>
                      <span class="min-w-(--size-24) shrink-0 text-body-sm text-(--text-muted)"
                        >{{ resource.typeLabel }} /</span
                      >
                    </template>

                    <span
                      v-else-if="panel.marked"
                      class="flex shrink-0 items-center justify-center"
                      aria-hidden="true"
                    >
                      <i
                        v-if="resource.presetIcon"
                        :class="resource.presetIcon"
                        class="text-body-lg leading-none"
                        :title="resource.presetLabel"
                      />
                    </span>
                    <span class="min-w-0 truncate text-label-md text-(--text-default)">
                      {{ resource.name }}
                    </span>
                  </Item.Title>
                </Item.Content>

                <Item.Actions>
                  <i
                    class="ai ai-chevron-right shrink-0 text-body-xs text-(--text-muted)"
                    aria-hidden="true"
                  />
                </Item.Actions>
              </Item>
            </Item.List>

            <EmptyState
              v-else
              size="small"
              :title="panel.recent ? 'Nothing opened yet' : `No ${panel.label.toLowerCase()} yet`"
              :description="
                panel.recent
                  ? 'Resources you open show up here.'
                  : `${panel.label} you create show up here.`
              "
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
