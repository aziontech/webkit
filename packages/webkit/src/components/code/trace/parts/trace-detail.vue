<script setup lang="ts">
  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Button from '../../../action/button/button.vue'
  import CopyButton from '../../../action/copy-button/copy-button.vue'
  import Tag from '../../../content/tag/tag.vue'
  import type { TraceSpan } from '../types'

  defineOptions({ name: 'TraceDetail', inheritAttrs: false })

  interface Props {
    /** The selected span. */
    detail: TraceSpan
    /** The span is the slowest one. */
    slowest: boolean
    /** The span is on the critical path. */
    critical: boolean
    /** Facts listed under the name. */
    facts: { label: string; value: string }[]
    /** Events of the span, in time order. */
    events: { key: string; time: string; name: string }[]
    /** Attributes of the span. */
    attributes: { key: string; value: string }[]
    /** Test id of the owning Trace; each part appends its own name. */
    testId: string
  }

  defineProps<Props>()

  const emit = defineEmits<{
    close: [event: MouseEvent]
  }>()

  const { t } = useTranslate({ trace: en.trace })
</script>

<template>
  <section
    v-bind="$attrs"
    :aria-label="t('trace.details', { name: detail.name })"
    :data-testid="`${testId}__detail`"
    class="flex flex-col gap-(--spacing-sm) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-sm)"
  >
    <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
      <i
        v-if="detail.icon"
        :class="detail.icon"
        class="shrink-0 text-[0.9em] leading-none text-(--text-muted)"
        aria-hidden="true"
      />
      <span class="truncate text-body-code-sm text-(--text-default)"
        ><bdi>{{ detail.name }}</bdi></span
      >
      <Tag
        v-if="detail.status === 'error'"
        key="failed"
        severity="danger"
        :label="t('trace.failed')"
        size="small"
      />
      <Tag
        v-else-if="detail.status === 'running'"
        key="running"
        severity="warning"
        :label="t('trace.running')"
        size="small"
      />
      <Tag
        v-if="slowest"
        key="slowest"
        severity="info"
        :label="t('trace.slowest')"
        size="small"
        :data-testid="`${testId}__slowest-tag`"
      />
      <Tag
        v-if="critical"
        key="critical"
        severity="neutral"
        :label="t('trace.criticalPath')"
        size="small"
        :data-testid="`${testId}__critical-tag`"
      />
      <CopyButton
        :value="detail.name"
        :aria-label="t('trace.copyName')"
        variant="outline"
        class="shrink-0"
        size="small"
      />
      <span class="ms-auto flex">
        <Button
          :label="t('trace.close')"
          :data-testid="`${testId}__close`"
          variant="ghost"
          size="medium"
          @click="(event: MouseEvent) => emit('close', event)"
        />
      </span>
    </div>

    <dl
      class="m-0 grid grid-cols-2 gap-(--spacing-sm) @xl/trace:grid-cols-4 @3xl/trace:grid-cols-6"
    >
      <div
        v-for="fact in facts"
        :key="fact.label"
        class="flex min-w-0 flex-col gap-(--spacing-2xs)"
      >
        <dt class="text-label-sm text-(--text-muted)">{{ fact.label }}</dt>
        <dd class="m-0 truncate text-body-sm text-(--text-default) tabular-nums">
          <bdi>{{ fact.value }}</bdi>
        </dd>
      </div>
    </dl>

    <p
      v-if="detail.message"
      class="text-body-sm text-(--danger-foreground)"
    >
      {{ detail.message }}
    </p>

    <div
      v-if="events.length"
      :data-testid="`${testId}__events`"
      class="flex flex-col gap-(--spacing-xs) border-t border-(--border-muted) pt-(--spacing-sm)"
    >
      <p class="text-label-sm text-(--text-default)">{{ t('trace.events') }}</p>
      <dl
        class="m-0 grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-x-(--spacing-md) gap-y-(--spacing-2xs)"
      >
        <template
          v-for="item in events"
          :key="item.key"
        >
          <dt class="truncate text-label-sm text-(--text-muted) tabular-nums">
            <bdi>{{ item.time }}</bdi>
          </dt>
          <dd class="m-0 min-w-0 text-label-code-sm break-words text-(--text-default)">
            <bdi>{{ item.name }}</bdi>
          </dd>
        </template>
      </dl>
    </div>

    <div
      v-if="attributes.length"
      class="flex flex-col gap-(--spacing-xs) border-t border-(--border-muted) pt-(--spacing-sm)"
    >
      <p class="text-label-sm text-(--text-default)">{{ t('trace.attributes') }}</p>
      <dl
        class="m-0 grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)] gap-x-(--spacing-md) gap-y-(--spacing-2xs)"
      >
        <template
          v-for="item in attributes"
          :key="item.key"
        >
          <dt class="truncate text-label-sm text-(--text-muted)">
            <bdi>{{ item.key }}</bdi>
          </dt>
          <dd class="m-0 min-w-0 text-label-code-sm break-words text-(--text-default)">
            <bdi>{{ item.value }}</bdi>
          </dd>
        </template>
      </dl>
    </div>
  </section>
</template>
