<script setup lang="ts">
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import Spinner from '@aziontech/webkit/spinner'
  import Tooltip from '@aziontech/webkit/tooltip'

  /** One entry of the Period Select. */
  export interface PeriodOption {
    /** The period key the Select writes. */
    value: string
    /** The label the Select shows. */
    label: string
  }

  export interface PeriodHeaderProps {
    /** The page title. */
    title: string
    /** One sentence on what the page shows. */
    description: string
    /** The periods the Select offers. */
    options: PeriodOption[]
    /** Adds a Refresh button after the Select. */
    refreshable?: boolean
    /** The page is reloading; the Refresh button shows its spinner. */
    refetching?: boolean
  }

  const props = withDefaults(defineProps<PeriodHeaderProps>(), {
    refreshable: false,
    refetching: false
  })

  const emit = defineEmits<{ refresh: [event: MouseEvent] }>()

  const period = defineModel<string>('period', { required: true })

  const periodLabel = (value: string) =>
    props.options.find((entry) => entry.value === value)?.label ?? ''
</script>

<template>
  <PageHeader
    :title="title"
    :description="description"
  >
    <template #actions>
      <span
        v-if="refetching && !refreshable"
        class="inline-flex items-center gap-(--spacing-2xs) text-body-sm text-(--text-muted)"
        role="status"
        data-testid="period-header__updating"
      >
        <Spinner class="size-4" />
        Updating
      </span>
      <Select
        variant="ghost"
        v-model="period"
        size="medium"
        :display-value="periodLabel"
      >
        <Select.Trigger aria-label="Period" />
        <Select.Content>
          <Select.Item
            v-for="option in options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </Select.Item>
        </Select.Content>
      </Select>
      <Tooltip
        v-if="refreshable"
        content="Refresh"
      >
        <IconButton
          icon="az az-refresh"
          variant="outline"
          size="medium"
          aria-label="Refresh metrics"
          :loading="refetching"
          @click="(event: MouseEvent) => emit('refresh', event)"
        />
      </Tooltip>
    </template>
  </PageHeader>
</template>
