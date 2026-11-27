<script setup lang="ts">
  import { computed, ref } from 'vue'

  import Input from '../../../input/input/input.vue'
  import type { SelectSize } from '../../../input/select/injection-key'
  import Select from '../../../input/select/select.vue'
  import SelectContent from '../../../input/select/select-content/select-content.vue'
  import SelectItem from '../../../input/select/select-item/select-item.vue'
  import SelectTrigger from '../../../input/select/select-trigger/select-trigger.vue'

  defineOptions({ name: 'StoryIndexSectionFacetSelect' })

  /** One option of the facet select. */
  export type StoryIndexSectionFacetSelectOption = {
    /** Value the option selects. */
    value: string
    /** Visible label of the option. */
    label: string
  }

  interface Props {
    /** Accessible name of the select trigger. */
    label: string
    /** The options after the show-all one, in order; filtered by the option search. */
    options: StoryIndexSectionFacetSelectOption[]
    /** The option that keeps every entry, listed first and never filtered; omitted when unset. */
    allOption?: StoryIndexSectionFacetSelectOption
    /** Size of the select. */
    size?: SelectSize
    /** Trigger placeholder shown while no option is selected. */
    placeholder?: string
    /** Formatter for the trigger label. */
    displayValue?: (value: string | undefined) => string
    /** Placeholder of the option search field. */
    searchPlaceholder: string
    /** Accessible name of the option search field. */
    searchAriaLabel: string
    /** Message shown when the option search matches nothing. */
    noMatchLabel: string
  }

  const props = withDefaults(defineProps<Props>(), {
    allOption: undefined,
    size: 'large',
    placeholder: undefined,
    displayValue: undefined
  })

  /** The selected value; a non-string pick is emitted as undefined. */
  const model = defineModel<string | undefined>()

  const SEARCH_THRESHOLD = 7

  const optionQuery = ref('')

  const searchable = computed(() => props.options.length > SEARCH_THRESHOLD)

  const narrowed = computed(() => {
    const term = optionQuery.value.trim().toLowerCase()
    return term
      ? props.options.filter((option) => option.label.toLowerCase().includes(term))
      : props.options
  })

  const pick = (value: unknown): void => {
    model.value = typeof value === 'string' ? value : undefined
  }
</script>

<template>
  <Select
    :model-value="model"
    :size="size"
    :placeholder="placeholder"
    :display-value="displayValue"
    @update:model-value="pick"
    @update:open="optionQuery = ''"
  >
    <SelectTrigger :aria-label="label || undefined" />
    <SelectContent>
      <template
        v-if="searchable"
        #search
      >
        <Input
          v-model="optionQuery"
          size="small"
          :placeholder="searchPlaceholder"
          :aria-label="searchAriaLabel"
        >
          <template #leading>
            <i
              class="az az-search"
              aria-hidden="true"
            />
          </template>
        </Input>
      </template>
      <SelectItem
        v-if="allOption"
        :value="allOption.value"
      >
        {{ allOption.label }}
      </SelectItem>
      <SelectItem
        v-for="option in narrowed"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </SelectItem>
      <p
        v-if="narrowed.length === 0"
        role="status"
        class="px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-muted)"
      >
        {{ noMatchLabel }}
      </p>
    </SelectContent>
  </Select>
</template>
