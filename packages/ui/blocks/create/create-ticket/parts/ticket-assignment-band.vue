<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import Combobox from '@aziontech/ui/combobox'
  import Item from '@aziontech/ui/item'
  import MultiSelect from '@aziontech/ui/multi-select'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import SettingsRow from '@aziontech/ui/settings-row'
  import { computed, ref, watch } from 'vue'

  import type { CreateTicketAgent, CreateTicketGroup } from '../create-ticket.vue'
  import TicketPersonOption from './ticket-person-option.vue'

  export interface TicketAssignmentBandProps {
    /** The groups a ticket can be routed to. */
    groups: CreateTicketGroup[]
    /** The agents a ticket can be assigned to. */
    agents: CreateTicketAgent[]
    /** The tags offered while tagging. */
    tagOptions: string[]
    /** Locks every control while the request runs. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<TicketAssignmentBandProps>(), {
    disabled: false
  })

  const groupId = defineModel<string>('groupId', { default: '' })
  const assigneeId = defineModel<string>('assigneeId', { default: '' })
  const tags = defineModel<string[]>('tags', { default: () => [] })

  const typed = ref<string[]>([])
  const tagChoices = computed(() => [
    ...new Set([...props.tagOptions, ...tags.value, ...typed.value])
  ])

  const addTag = (_event: MouseEvent | KeyboardEvent, tag: string) => {
    typed.value = [...typed.value, tag]
    tags.value = [...tags.value, tag]
  }

  const groupOptions = computed(() =>
    props.groups.map((group) => ({ value: group.id, label: group.name }))
  )
  const groupName = (id: string) => props.groups.find((group) => group.id === id)?.name ?? ''
  const assigneeOptions = computed(() =>
    props.agents
      .filter((agent) => !groupId.value || agent.groupIds.includes(groupId.value))
      .map((agent) => ({
        value: agent.id,
        label: agent.name,
        description: agent.groupIds.map(groupName).filter(Boolean).join(', ')
      }))
  )
  const presenceOf = (id: string) => props.agents.find((agent) => agent.id === id)?.presence ?? ''

  watch(groupId, () => {
    if (!assigneeOptions.value.some((option) => option.value === assigneeId.value))
      assigneeId.value = ''
  })
</script>

<template>
  <SettingsGroup
    label="Assignment"
    hint="Who owns the ticket. Leave it unassigned to route it to the group's queue."
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            stackable
            title="Group"
            description="The team whose queue the ticket joins."
          >
            <Combobox
              v-model="groupId"
              :options="groupOptions"
              :allow-custom="false"
              size="large"
              placeholder="Search groups"
              aria-label="Group"
              clearable
              :disabled="disabled"
            >
              <template #option="{ option }">
                <TicketPersonOption
                  :name="option.label ?? option.value"
                  team
                />
              </template>
            </Combobox>
          </SettingsRow>
          <SettingsRow
            stackable
            title="Assignee"
            description="The agent who answers next. Only agents in the group are listed."
          >
            <Combobox
              v-model="assigneeId"
              :options="assigneeOptions"
              :allow-custom="false"
              size="large"
              placeholder="Search agents"
              aria-label="Assignee"
              empty-title="No agent in this group matches."
              clearable
              :disabled="disabled"
            >
              <template #option="{ option }">
                <TicketPersonOption
                  :name="option.label ?? option.value"
                  :detail="option.description"
                  :presence="presenceOf(option.value)"
                />
              </template>
            </Combobox>
          </SettingsRow>
          <SettingsRow
            stackable
            title="Tags"
            description="Labels for routing rules and reports. Type a new tag and press Enter."
          >
            <MultiSelect
              v-model="tags"
              variant="chips"
              size="large"
              searchable
              allow-custom
              placeholder="Add tags"
              aria-label="Tags"
              :disabled="disabled"
              @create="addTag"
            >
              <MultiSelect.Trigger />
              <MultiSelect.Content>
                <MultiSelect.Item
                  v-for="tag in tagChoices"
                  :key="tag"
                  :value="tag"
                  >{{ tag }}</MultiSelect.Item
                >
              </MultiSelect.Content>
            </MultiSelect>
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
