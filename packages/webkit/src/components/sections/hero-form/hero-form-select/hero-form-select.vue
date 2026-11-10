<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { useSelectSearch } from '../../../../composables/use-select-search'
  import Input from '../../../inputs/input/input.vue'
  import Select from '../../../inputs/select/select.vue'
  import SelectContent from '../../../inputs/select/select-content/select-content.vue'
  import SelectOption from '../../../inputs/select/select-option/select-option.vue'
  import SelectTrigger from '../../../inputs/select/select-trigger/select-trigger.vue'

  defineOptions({
    name: 'HeroFormSelect',
    inheritAttrs: false
  })

  interface Props {
    /** Options rendered in the list, each as its own value and label. */
    options?: string[]
    /** Trigger placeholder shown while nothing is selected. */
    placeholder?: string
    /** Id of the trigger, targeted by the field label. */
    triggerId?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    options: () => [],
    placeholder: '',
    triggerId: ''
  })

  const modelValue = defineModel<string>({ default: '' })

  const attrs = useAttrs()
  const generatedId = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-hero-form-select'
  )
  const resolvedTriggerId = computed(() => props.triggerId || `${generatedId}-trigger`)

  const pick = (key: string) => {
    const option = props.options[Number(key)]
    if (option !== undefined) modelValue.value = option
  }

  const {
    open,
    query,
    filtered,
    activeKey,
    activeIndex,
    searchId,
    optionId,
    setActive,
    onTriggerKeydown,
    onContentKeydown,
    onSearchKeydown
  } = useSelectSearch({
    items: () => props.options.map((text, index) => ({ key: String(index), text })),
    selectedKeys: () => {
      const index = props.options.indexOf(modelValue.value)
      return index === -1 ? [] : [String(index)]
    },
    idPrefix: generatedId,
    triggerId: resolvedTriggerId,
    onPick: pick
  })

  const visibleOptions = computed(() =>
    filtered.value.map((item) => ({ key: item.key, label: props.options[Number(item.key)] }))
  )
</script>

<template>
  <Select
    v-bind="$attrs"
    v-model:open="open"
    :model-value="modelValue || undefined"
    :placeholder="placeholder"
    size="large"
    :data-testid="testId"
    @update:model-value="modelValue = $event === undefined ? '' : String($event)"
  >
    <SelectTrigger
      :id="resolvedTriggerId"
      :data-testid="`${testId}__trigger`"
      @keydown="onTriggerKeydown"
    />
    <SelectContent
      :data-testid="`${testId}__content`"
      @keydown="onContentKeydown"
    >
      <template #search>
        <Input
          :id="searchId"
          v-model="query"
          placeholder="Search"
          aria-label="Search"
          :aria-activedescendant="activeKey ? optionId(activeKey) : undefined"
          autocomplete="off"
          :data-testid="`${testId}__search`"
          @keydown="onSearchKeydown"
        >
          <template #iconLeft>
            <i class="pi pi-search" />
          </template>
        </Input>
      </template>
      <SelectOption
        v-for="(option, index) in visibleOptions"
        :id="optionId(option.key)"
        :key="option.key"
        :value="option.label"
        :data-active="index === activeIndex || null"
        :data-testid="`${testId}__option`"
        class="data-[active]:bg-(--bg-hover)"
        @mousemove="setActive(index)"
      >
        {{ option.label }}
      </SelectOption>
      <p
        v-if="visibleOptions.length === 0"
        role="status"
        :data-testid="`${testId}__search-empty`"
        class="px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted)"
      >
        No results found
      </p>
    </SelectContent>
  </Select>
</template>
