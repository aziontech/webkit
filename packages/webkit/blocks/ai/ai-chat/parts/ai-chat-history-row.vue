<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import HoverCardContent from '@aziontech/webkit/hover-card-content'
  import HoverCard from '@aziontech/webkit/hover-card-root'
  import HoverCardTrigger from '@aziontech/webkit/hover-card-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'

  import type { AiChatProject, AiChatThread } from '../sample'

  defineProps<{
    thread: AiChatThread
    project?: AiChatProject
    viewMode: 'detailed' | 'compact'
  }>()

  const emit = defineEmits<{
    snooze: [id: string]
    settle: [id: string]
    discard: [id: string]
  }>()

  const ACTIONS_CLASS =
    'pointer-events-none absolute end-0 flex items-center gap-0.5 opacity-0 transition-opacity motion-reduce:transition-none ' +
    'group-hover/item:pointer-events-auto group-hover/item:opacity-100 ' +
    'group-focus-within/item:pointer-events-auto group-focus-within/item:opacity-100'

  const META_TRIGGER_CLASS =
    'inline-flex cursor-default items-center gap-(--spacing-xs) rounded-(--shape-control) px-1 py-0.5 text-label-xs text-(--text-muted) ' +
    'hover:bg-(--bg-subtle) hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)'
</script>

<template>
  <div
    v-if="viewMode === 'detailed'"
    class="group/row flex w-full min-w-0 flex-col gap-(--spacing-2xs) py-(--spacing-2xs)"
  >
    <div class="flex min-w-0 items-center justify-between gap-(--spacing-xs)">
      <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
        <i
          v-if="thread.draft"
          class="az az-square-pen shrink-0 text-body-xs text-(--warning-foreground)"
          aria-hidden="true"
        />
        <span
          v-if="project"
          class="inline-flex size-5 shrink-0 items-center justify-center rounded-(--shape-control) bg-(--info-surface) font-mono text-label-xs text-(--info-foreground)"
        >
          {{ project.code }}
        </span>
        <span class="truncate text-label-xs text-(--text-muted)">
          {{ project?.title ?? 'No project' }}
        </span>
      </span>
      <span class="relative flex shrink-0 items-center">
        <time
          class="text-label-xs text-(--text-muted) tabular-nums transition-opacity motion-reduce:transition-none group-hover/item:opacity-0 group-focus-within/item:opacity-0"
        >
          {{ thread.age }}
        </time>
        <span :class="ACTIONS_CLASS">
          <Tooltip
            v-if="thread.draft"
            content="Discard draft"
          >
            <IconButton
              icon="az az-x"
              aria-label="Discard draft"
              variant="ghost"
              size="small"
              @click.stop="emit('discard', thread.id)"
            />
          </Tooltip>
          <Tooltip :content="thread.snoozed ? 'Unsnooze thread' : 'Snooze thread'">
            <IconButton
              icon="az az-clock"
              :aria-label="thread.snoozed ? 'Unsnooze thread' : 'Snooze thread'"
              variant="ghost"
              size="small"
              @click.stop="emit('snooze', thread.id)"
            />
          </Tooltip>
          <Button
            :label="thread.settled ? 'Reopen' : 'Settle'"
            icon="az az-check"
            variant="ghost"
            size="small"
            @click.stop="emit('settle', thread.id)"
          />
        </span>
      </span>
    </div>

    <span class="min-w-0 truncate text-label-md text-(--text-default)">
      {{ thread.title }}
    </span>

    <div class="flex items-center justify-end">
      <HoverCard
        side="end"
        align="end"
        :open-delay="150"
        :close-delay="150"
      >
        <HoverCardTrigger>
          <span
            tabindex="0"
            aria-label="Thread details"
            :class="META_TRIGGER_CLASS"
            @click.stop
          >
            <span
              v-if="thread.chainCount"
              class="inline-flex items-center gap-0.5 text-(--success-foreground) tabular-nums"
            >
              <i
                class="az az-layers text-body-xs leading-none"
                aria-hidden="true"
              />
              {{ thread.chainCount }}
            </span>
            <span
              v-else-if="thread.changeRef"
              class="inline-flex items-center gap-0.5 tabular-nums"
            >
              <i
                class="az az-git-pull-request text-body-xs leading-none"
                aria-hidden="true"
              />
              {{ thread.changeRef }}
            </span>
            <i
              class="az az-server text-body-xs leading-none"
              aria-hidden="true"
            />
            <i
              :class="[thread.providerIcon, 'text-body-xs leading-none text-(--text-default)']"
              aria-hidden="true"
            />
          </span>
        </HoverCardTrigger>
        <HoverCardContent>
          <div class="flex min-w-60 flex-col gap-(--spacing-xs)">
            <p class="m-0 text-label-md text-(--text-default)">{{ thread.title }}</p>
            <div class="flex flex-col gap-1 text-body-xs text-(--text-muted)">
              <span class="flex items-center gap-(--spacing-xs)">
                <span
                  v-if="project"
                  class="inline-flex size-5 items-center justify-center rounded-(--shape-control) bg-(--info-surface) font-mono text-label-xs text-(--info-foreground)"
                >
                  {{ project.code }}
                </span>
                <span>{{ project?.title ?? 'No project' }}</span>
              </span>
              <span class="flex items-center gap-(--spacing-xs)">
                <i
                  class="az az-server w-5 text-center text-body-xs leading-none"
                  aria-hidden="true"
                />
                <span>{{ thread.environment }}</span>
              </span>
              <span class="flex items-center gap-(--spacing-xs)">
                <i
                  :class="[
                    thread.providerIcon,
                    'w-5 text-center text-body-xs leading-none text-(--text-default)'
                  ]"
                  aria-hidden="true"
                />
                <span>{{ thread.modelLabel }}</span>
              </span>
            </div>
            <div
              v-if="thread.changes?.length"
              class="flex flex-col gap-1 border-t border-(--border-subtle) pt-(--spacing-xs)"
            >
              <div
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
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  </div>

  <div
    v-else
    class="flex w-full min-w-0 items-center gap-(--spacing-xs)"
  >
    <i
      v-if="thread.draft"
      class="az az-square-pen shrink-0 text-body-xs text-(--warning-foreground)"
      aria-hidden="true"
    />
    <span class="min-w-0 flex-1 truncate text-label-md text-(--text-default)">
      {{ thread.title }}
    </span>
    <span class="relative flex shrink-0 items-center gap-(--spacing-2xs)">
      <time class="text-label-xs text-(--text-muted) tabular-nums group-hover/item:hidden">
        {{ thread.age }}
      </time>
      <span class="hidden items-center gap-0.5 group-hover/item:inline-flex">
        <IconButton
          v-if="thread.draft"
          icon="az az-x"
          aria-label="Discard draft"
          variant="ghost"
          size="small"
          @click.stop="emit('discard', thread.id)"
        />
        <IconButton
          icon="az az-clock"
          :aria-label="thread.snoozed ? 'Unsnooze thread' : 'Snooze thread'"
          variant="ghost"
          size="small"
          @click.stop="emit('snooze', thread.id)"
        />
        <IconButton
          icon="az az-check"
          :aria-label="thread.settled ? 'Reopen thread' : 'Settle thread'"
          variant="ghost"
          size="small"
          @click.stop="emit('settle', thread.id)"
        />
      </span>
      <HoverCard
        side="end"
        align="end"
        :open-delay="150"
        :close-delay="150"
      >
        <HoverCardTrigger>
          <i
            :class="[
              thread.providerIcon,
              'shrink-0 cursor-default text-body-xs text-(--text-muted) hover:text-(--text-default)'
            ]"
            aria-hidden="true"
            @click.stop
          />
        </HoverCardTrigger>
        <HoverCardContent>
          <div class="flex min-w-52 flex-col gap-1 text-body-xs text-(--text-muted)">
            <p class="m-0 text-label-md text-(--text-default)">{{ thread.title }}</p>
            <span>{{ project?.title ?? 'No project' }} · {{ thread.environment }}</span>
            <span>{{ thread.modelLabel }} · {{ thread.age }}</span>
          </div>
        </HoverCardContent>
      </HoverCard>
    </span>
  </div>
</template>
