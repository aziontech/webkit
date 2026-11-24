<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { computed, ref, watch } from 'vue'

  import type {
    DetailTicketAgent,
    DetailTicketField,
    DetailTicketPropertyChange,
    DetailTicketTicket
  } from '../detail-ticket.vue'
  import { priorityOptions, TICKET_STATUSES, TICKET_TYPES } from '../lib/ticket-fields'

  export interface TicketPropertiesProps {
    /** The ticket; absent while it loads. */
    ticket?: DetailTicketTicket
    /** Agents the ticket can be assigned to. */
    agents: DetailTicketAgent[]
    /** Groups the ticket can move to. */
    groups: string[]
    /** Tags offered in the Tags field. */
    tagOptions: string[]
    /** The ticket is loading. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<TicketPropertiesProps>(), {
    ticket: undefined,
    loading: false
  })

  const emit = defineEmits<{
    change: [change: DetailTicketPropertyChange]
  }>()

  const UNASSIGNED = 'unassigned'
  const PRESENCE: Record<string, string> = {
    online: 'Online',
    away: 'Away',
    busy: 'Busy',
    offline: 'Offline'
  }

  const extraTags = ref<string[]>([])

  const EMPTY = { status: '', priority: '', type: '', group: '', assignee: UNASSIGNED, tags: [] }

  function seed(): Record<DetailTicketField, string | string[]> {
    const ticket = props.ticket
    if (!ticket) return { ...EMPTY }
    const { status, priority, type, group, assignee, tags } = ticket
    return { status, priority, type, group, assignee: assignee || UNASSIGNED, tags }
  }

  const values = ref<Record<DetailTicketField, string | string[]>>(seed())

  watch(
    () => props.ticket,
    () => (values.value = seed())
  )

  const assignee = computed(() =>
    props.agents.find((agent) => agent.name === values.value.assignee)
  )
  const tags = computed(() => [
    ...new Set([...props.tagOptions, ...extraTags.value, ...(values.value.tags as string[])])
  ])
  const statusOptions = TICKET_STATUSES.map((value) => ({ value, label: value }))
  const typeOptions = TICKET_TYPES.map((value) => ({ value, label: value }))
  const groupOptions = computed(() => props.groups.map((value) => ({ value, label: value })))
  const singleFields = computed(() => [
    { field: 'status' as const, label: 'Status', options: statusOptions },
    { field: 'priority' as const, label: 'Priority', options: [...priorityOptions] },
    { field: 'type' as const, label: 'Type', options: typeOptions },
    { field: 'group' as const, label: 'Group', options: groupOptions.value }
  ])

  const set = (field: DetailTicketField, value: string | string[]) => {
    values.value = { ...values.value, [field]: value }
    const out = field === 'assignee' && value === UNASSIGNED ? '' : value
    emit('change', { field, value: out })
  }

  const addTag = (_event: MouseEvent | KeyboardEvent, tag: string) => {
    extraTags.value = [...extraTags.value, tag]
    set('tags', [...(values.value.tags as string[]), tag])
  }
</script>

<template>
  <Card title="Properties">
    <div
      v-if="!ticket && loading"
      class="flex flex-col gap-(--spacing-md)"
      aria-hidden="true"
    >
      <Skeleton
        v-for="row in 6"
        :key="row"
        height="2rem"
      />
    </div>
    <div
      v-else-if="ticket"
      class="flex flex-col gap-(--spacing-md)"
    >
      <Field
        v-for="item in singleFields"
        :key="item.field"
      >
        <Field.Label>{{ item.label }}</Field.Label>
        <Select
          :model-value="values[item.field] as string"
          size="medium"
          @update:model-value="(value: string) => set(item.field, value)"
        >
          <Select.Trigger class="w-full" />
          <Select.Content>
            <Select.Item
              v-for="option in item.options"
              :key="option.value"
              :value="option.value"
              >{{ option.label }}</Select.Item
            >
          </Select.Content>
        </Select>
      </Field>
      <Field>
        <Field.Label>Assignee</Field.Label>
        <div class="flex min-w-0 items-center gap-(--spacing-xs)">
          <Avatar
            v-if="assignee"
            :label="assignee.name"
            :alt="assignee.name"
            :presence="assignee.presence"
            size="small"
            class="shrink-0"
          />
          <Select
            :model-value="values.assignee as string"
            size="medium"
            class="min-w-0 grow"
            @update:model-value="(value: string) => set('assignee', value)"
          >
            <Select.Trigger class="w-full" />
            <Select.Content>
              <Select.Item :value="UNASSIGNED">Unassigned</Select.Item>
              <Select.Item
                v-for="agent in agents"
                :key="agent.email"
                :value="agent.name"
              >
                {{ agent.name }}
                <template
                  v-if="agent.presence"
                  #tag
                >
                  <span class="text-body-xs text-(--text-muted)">{{
                    PRESENCE[agent.presence]
                  }}</span>
                </template>
              </Select.Item>
            </Select.Content>
          </Select>
        </div>
      </Field>
      <Field>
        <Field.Label>Tags</Field.Label>
        <MultiSelect
          :model-value="values.tags as string[]"
          variant="chips"
          searchable
          allow-custom
          placeholder="Add tags"
          @update:model-value="(value: string[]) => set('tags', value)"
          @create="addTag"
        >
          <MultiSelect.Trigger />
          <MultiSelect.Content>
            <MultiSelect.Item
              v-for="tag in tags"
              :key="tag"
              :value="tag"
              >{{ tag }}</MultiSelect.Item
            >
          </MultiSelect.Content>
        </MultiSelect>
      </Field>
    </div>
  </Card>
</template>
