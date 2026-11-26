<script setup lang="ts">
  import HoverCardContent from '@aziontech/ui/hover-card-content'
  import HoverCard from '@aziontech/ui/hover-card-root'
  import HoverCardTrigger from '@aziontech/ui/hover-card-trigger'
  import { computed } from 'vue'

  import { type AiChatProject, type AiChatThread, sampleProducts } from '../sample'

  const props = defineProps<{
    thread: AiChatThread
    project?: AiChatProject
    viewMode: 'detailed' | 'compact'
  }>()

  const products = computed(() =>
    props.thread.products.map((key) => sampleProducts[key]).filter((item) => item !== undefined)
  )
  const lead = computed(() => products.value[0])
  const badge = computed(
    () => props.thread.version ?? (products.value.length > 1 ? String(products.value.length) : '')
  )
  const summary = computed(() =>
    [
      products.value.map((item) => item.label).join(', '),
      props.thread.version ? `version ${props.thread.version}` : '',
      props.thread.environment,
      props.thread.modelLabel
    ]
      .filter(Boolean)
      .join(' · ')
  )

  const UNDER_ACTIONS_CLASS =
    'transition-opacity duration-fast-02 motion-reduce:transition-none pointer-coarse:invisible ' +
    'group-hover/item:opacity-0 group-focus-within/item:opacity-0 group-data-[active]/item:opacity-0'

  const TITLE_CLASS =
    'min-w-0 truncate text-label-md text-(--text-default) ' +
    'pointer-coarse:pe-(--ai-chat-history-actions-width) pointer-fine:group-hover/item:pe-(--ai-chat-history-actions-width) ' +
    'pointer-fine:group-focus-within/item:pe-(--ai-chat-history-actions-width) pointer-fine:group-data-[active]/item:pe-(--ai-chat-history-actions-width)'
</script>

<template>
  <span
    v-if="viewMode === 'detailed'"
    class="flex w-full min-w-0 flex-col gap-(--spacing-2xs)"
  >
    <span class="flex h-5 min-w-0 items-center gap-(--spacing-2xs)">
      <i
        v-if="thread.draft"
        class="az az-square-pen shrink-0 text-body-xs text-(--warning-foreground)"
        aria-hidden="true"
      />
      <span
        v-if="project"
        class="inline-flex size-5 shrink-0 items-center justify-center rounded-(--shape-control) bg-(--info) font-mono text-label-xs text-(--info-foreground)"
        aria-hidden="true"
      >
        {{ project.code }}
      </span>
      <span class="min-w-0 flex-1 truncate text-label-xs text-(--text-muted)">
        {{ project?.title ?? 'No project' }}
      </span>
      <time
        class="shrink-0 text-label-xs text-(--text-muted) tabular-nums"
        :class="UNDER_ACTIONS_CLASS"
        >{{ thread.age }}</time
      >
    </span>

    <span
      class="block"
      :class="TITLE_CLASS"
    >
      {{ thread.title }}
    </span>

    <span class="flex h-5 min-w-0 items-center justify-end">
      <HoverCard
        side="end"
        align="end"
        :open-delay="300"
        :close-delay="150"
      >
        <HoverCardTrigger>
          <span
            class="inline-flex items-center gap-(--spacing-xs) px-1 text-label-xs text-(--text-muted)"
          >
            <span
              v-if="lead"
              class="inline-flex items-center gap-1 tabular-nums"
            >
              <i
                :class="[lead.icon, 'text-body-xs leading-none text-(--text-default)']"
                aria-hidden="true"
              />
              <span
                v-if="badge"
                :data-version="thread.version ? '' : null"
                class="data-[version]:font-mono"
                >{{ badge }}</span
              >
            </span>
            <i
              :class="[thread.providerIcon, 'text-body-xs leading-none text-(--text-default)']"
              aria-hidden="true"
            />
            <span class="sr-only">{{ summary }}</span>
          </span>
        </HoverCardTrigger>
        <HoverCardContent>
          <span class="flex max-w-80 min-w-60 flex-col gap-(--spacing-xs)">
            <span class="text-label-md text-(--text-default)">{{ thread.title }}</span>
            <span class="flex flex-col gap-1 text-body-xs text-(--text-muted)">
              <span
                v-for="item in products"
                :key="item.label"
                class="flex items-center gap-(--spacing-xs)"
              >
                <i
                  :class="[item.icon, 'w-5 text-center leading-none text-(--text-default)']"
                  aria-hidden="true"
                />
                <span>{{ item.label }}</span>
                <span
                  v-if="thread.version && item === lead"
                  class="font-mono text-(--text-default)"
                  >{{ thread.version }}</span
                >
              </span>
              <span class="flex items-center gap-(--spacing-xs)">
                <i
                  class="az az-globe w-5 text-center leading-none"
                  aria-hidden="true"
                />
                <span>{{ thread.environment }}</span>
              </span>
              <span class="flex items-center gap-(--spacing-xs)">
                <i
                  :class="[
                    thread.providerIcon,
                    'w-5 text-center leading-none text-(--text-default)'
                  ]"
                  aria-hidden="true"
                />
                <span>{{ thread.modelLabel }}</span>
              </span>
            </span>
            <span
              v-if="thread.changes?.length"
              class="flex flex-col gap-1 border-t border-(--border-default) pt-(--spacing-xs)"
            >
              <span
                v-for="change in thread.changes"
                :key="change.ref"
                class="flex items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
              >
                <i
                  class="az az-git-pull-request shrink-0 leading-none"
                  aria-hidden="true"
                />
                <span class="shrink-0 font-mono text-(--text-default)">{{ change.ref }}</span>
                <span class="min-w-0 flex-1 truncate">{{ change.title }}</span>
              </span>
            </span>
          </span>
        </HoverCardContent>
      </HoverCard>
    </span>
  </span>

  <span
    v-else
    class="flex w-full min-w-0 items-center gap-(--spacing-xs)"
  >
    <i
      v-if="thread.draft"
      class="az az-square-pen shrink-0 text-body-xs text-(--warning-foreground)"
      aria-hidden="true"
    />
    <span
      class="flex-1"
      :class="TITLE_CLASS"
    >
      {{ thread.title }}
    </span>
    <span
      class="flex shrink-0 items-center gap-(--spacing-xs)"
      :class="UNDER_ACTIONS_CLASS"
    >
      <i
        v-if="lead"
        :class="[lead.icon, 'text-body-xs leading-none text-(--text-muted)']"
        aria-hidden="true"
      />
      <time class="text-label-xs text-(--text-muted) tabular-nums">{{ thread.age }}</time>
    </span>
    <span class="sr-only">{{ summary }}</span>
  </span>
</template>
