<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import Message from '@aziontech/webkit/message'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import { consumersOf } from '../../lib/data/resource-dependencies'
  import Section from '../page/Section.vue'

  interface Props {
    resource: string
    unit?: string
    answers?: unknown[]
    binding?: Record<string, unknown>
    host?: Record<string, unknown>
    boundTo?: string
    moduleRequirement?: Record<string, unknown>
    moduleMissing?: boolean
    moduleEnabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    unit: 'resource',
    answers: () => [],
    binding: null,
    host: null,
    boundTo: '',
    moduleRequirement: null,
    moduleMissing: false,
    moduleEnabled: false
  })

  const consumers = computed(() => consumersOf(props.resource))

  const printValue = (field, value) => {
    if (field.kind === 'secret') return '••••••••'
    if (typeof value === 'boolean') return value ? 'On' : 'Off'
    if (Array.isArray(value)) return value.join(', ')
    const option = field.options?.find((entry) => entry.value === value)
    return option?.label ?? String(value)
  }

  const printable = computed(() =>
    props.answers
      .filter(({ value }) => value !== '' && value !== undefined && value !== null)
      .map(({ field, value }) => ({
        id: field.id,
        label: field.label || field.api || field.id,
        api: field.api,
        text: printValue(field, value)
      }))
  )
</script>

<template>
  <div class="flex flex-col">
    <Section
      stacked
      :divided="false"
      title="What gets created"
      :hint="`Every value below is posted as the property named beside it.`"
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <Item
              v-for="answer in printable"
              :key="answer.id"
            >
              <Item.Content>
                <Item.Title>{{ answer.label }}</Item.Title>
                <Item.Description>{{ answer.api }}</Item.Description>
              </Item.Content>
              <Item.Actions>
                <span class="max-w-80 truncate text-label-sm text-(--text-default)">
                  {{ answer.text }}
                </span>
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </CardBox>
    </Section>

    <Section
      v-if="binding"
      stacked
      :divided="false"
      title="Where it runs"
      :hint="binding.mechanism"
    >
      <CardBox :padded="false">
        <template #content>
          <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
            <Message
              key="message-1"
              v-if="!boundTo"
              severity="warning"
              size="small"
              :label="`Bound to no ${host?.noun ?? 'host'}. ${binding.unboundNote}`"
            />
            <Message
              key="message-2"
              v-else-if="moduleMissing && !moduleEnabled"
              severity="warning"
              size="small"
              :label="`${moduleRequirement?.label} is off on ${boundTo}, so nothing reads this ${unit} until it is on.`"
            />
            <Message
              key="message-3"
              v-else-if="moduleMissing"
              severity="info"
              size="small"
              :label="`${moduleRequirement?.label} will be turned on for ${boundTo} when this ${unit} is created.`"
            />
            <Message
              key="message-4"
              v-else
              severity="success"
              size="small"
              :label="`Runs on ${boundTo}.`"
            />
          </div>
        </template>
      </CardBox>
    </Section>

    <Section
      key="section-2"
      v-if="consumers.length"
      stacked
      :divided="false"
      title="What can reference it"
      hint="Read off the v6 dependency matrix: every consumer of this resource, and the field or rule that carries the reference."
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <Item
              v-for="(row, index) in consumers"
              :key="`${row.by}-${index}`"
            >
              <Item.Content>
                <Item.Title>{{ row.by }}</Item.Title>
                <Item.Description>{{ row.path }}</Item.Description>
              </Item.Content>
              <Item.Actions>
                <Tag
                  v-if="row.requires"
                  :label="`modules.${row.requires}`"
                  severity="warning"
                  size="small"
                />
                <Tag
                  :label="row.as"
                  size="small"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </CardBox>
    </Section>
  </div>
</template>
