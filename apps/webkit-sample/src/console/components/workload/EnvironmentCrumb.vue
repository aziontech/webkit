<script setup lang="ts">
  import InputText from '@aziontech/webkit/input-text'
  import Select from '@aziontech/webkit/select'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  import { DEPLOYMENT_POLICY_OPTIONS } from '../../lib/data/environments'

  interface EnvironmentEntry {
    name: string
    deploymentPolicy?: string
  }

  interface Props {
    /** Every environment the workload answers in, in display order. */
    environments?: EnvironmentEntry[]
  }

  const props = withDefaults(defineProps<Props>(), {
    environments: () => []
  })

  const emit = defineEmits<{
    create: []
  }>()

  const model = defineModel<string>({ default: '' })

  const CREATE_ENVIRONMENT = '__create-environment__'

  const query = ref('')

  const matches = computed(() => {
    const needle = query.value.trim().toLowerCase()
    if (!needle) return props.environments
    return props.environments.filter((entry) => entry.name.toLowerCase().includes(needle))
  })

  const policyLabel = (policy?: string) =>
    DEPLOYMENT_POLICY_OPTIONS.find((option) => option.value === policy)?.label ?? ''

  const nameOf = (value: unknown) => String(value ?? '')

  const pick = (value: unknown) => {
    if (value === CREATE_ENVIRONMENT) return emit('create')
    if (typeof value === 'string' && value !== model.value) model.value = value
  }

  const onOpen = (open: boolean) => {
    if (!open) query.value = ''
  }
</script>

<template>
  <Select
    :model-value="model"
    :display-value="nameOf"
    class="flex! w-auto! min-w-0"
    @update:model-value="pick"
    @update:open="onOpen"
  >
    <Select.Trigger
      aria-label="Switch environment"
      class="h-6! w-auto! min-w-0 gap-(--spacing-xxs)! border-0! bg-transparent! px-(--spacing-xs)! text-label-md! hover:bg-(--bg-mask)! focus-visible:ring-offset-0! data-[state=open]:bg-(--bg-mask)!"
    />
    <Select.Content class="min-w-57">
      <template #search>
        <InputText
          v-model="query"
          size="small"
          placeholder="Search environments"
          aria-label="Search environments"
          @keydown.stop
        >
          <template #iconLeft>
            <i
              class="pi pi-search"
              aria-hidden="true"
            />
          </template>
        </InputText>
      </template>
      <Select.Group label="Environments">
        <Select.Option
          v-for="entry in matches"
          :key="entry.name"
          :value="entry.name"
        >
          {{ entry.name }}
          <template
            v-if="policyLabel(entry.deploymentPolicy)"
            #tag
          >
            <Tag
              :label="policyLabel(entry.deploymentPolicy)"
              severity="secondary"
              size="small"
            />
          </template>
        </Select.Option>
        <p
          v-if="!matches.length"
          class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
        >
          No environments match "{{ query }}".
        </p>
      </Select.Group>
      <template #footer>
        <Select.Option
          :value="CREATE_ENVIRONMENT"
          class="w-full"
        >
          <span class="flex items-center gap-(--spacing-xs)">
            <i
              class="pi pi-plus-circle"
              aria-hidden="true"
            />
            Add Environment
          </span>
        </Select.Option>
      </template>
    </Select.Content>
  </Select>
</template>
