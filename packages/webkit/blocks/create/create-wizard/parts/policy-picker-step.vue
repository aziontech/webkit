<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  import type { CreateWizardPolicy } from '../types'

  export interface PolicyPickerStepProps {
    /** The policies the list can run in. */
    policies: CreateWizardPolicy[]
    /** The policy picked, empty for none. */
    choice: string
    /** Next was pressed with no answer: the step says to pick one. */
    missing?: boolean
  }

  const props = withDefaults(defineProps<PolicyPickerStepProps>(), { missing: false })

  const emit = defineEmits<{
    /** A policy was picked, or Continue without a policy pressed (an empty value). */
    answer: [value: string]
  }>()

  const VISIBLE = 6

  const query = ref('')

  const matches = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return props.policies
    return props.policies.filter((option) =>
      [option.label, option.description].some((field) => field.toLowerCase().includes(term))
    )
  })
  const visible = computed(() => {
    const head = matches.value.slice(0, VISIBLE)
    if (!props.choice || head.some((option) => option.value === props.choice)) return head
    const picked = matches.value.find((option) => option.value === props.choice)
    return picked ? [picked, ...head.slice(0, VISIBLE - 1)] : head
  })
  const hidden = computed(() => Math.max(0, matches.value.length - visible.value.length))

  const choose = (option: CreateWizardPolicy) => emit('answer', option.value)

  const skip = () => emit('answer', '')

  const onSearchEnter = () => {
    if (matches.value.length) choose(matches.value[0])
  }
</script>

<template>
  <section class="mx-auto flex w-full max-w-(--container-md) flex-col gap-(--spacing-lg)">
    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
      <Input
        v-model="query"
        size="large"
        class="w-full"
        placeholder="Search policies"
        aria-label="Search policies"
        autocomplete="off"
        @keydown.enter.prevent="onSearchEnter"
      />

      <div class="flex flex-col">
        <Item
          v-for="option in visible"
          :key="option.value"
          size="small"
          clickable
          :aria-pressed="choice === option.value"
          @click="choose(option)"
        >
          <Item.Media>
            <i
              class="az az-shield text-body-md leading-none text-(--text-muted)"
              aria-hidden="true"
            />
          </Item.Media>
          <Item.Content>
            <Item.Title>{{ option.label }}</Item.Title>
          </Item.Content>
          <Item.Actions>
            <Tag
              v-if="!option.ready"
              label="IP filtering off"
              severity="warning"
              size="small"
            />
            <i
              v-if="choice === option.value"
              class="az az-check text-body-sm leading-none text-(--text-default)"
              aria-hidden="true"
            />
          </Item.Actions>
        </Item>

        <p
          v-if="hidden"
          class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
        >
          {{ hidden }} more. Type to narrow the list.
        </p>
        <p
          v-else-if="!matches.length"
          class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
        >
          No policy matches “{{ query.trim() }}”.
        </p>
      </div>
      <FieldError v-if="missing">Select a policy, or continue without one.</FieldError>
    </div>

    <div class="flex flex-col items-center gap-(--spacing-2xs)">
      <Button
        type="button"
        label="Create a policy"
        variant="ghost"
        size="small"
      />
      <Button
        type="button"
        label="Continue without a policy"
        variant="ghost"
        size="small"
        @click="skip"
      />
    </div>
  </section>
</template>
