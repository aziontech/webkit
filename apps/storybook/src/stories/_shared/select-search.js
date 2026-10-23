import { computed, ref } from 'vue'

const quoted = (text) => `'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

export const searchable = (options) => options.length > 0

export const declareOptions = (name, options) =>
  `const ${name} = [\n${options.map((option) => `  ${quoted(option)}`).join(',\n')}\n]`

export const searchSlot = (key, label) => `<template #search>
  <InputText
    v-model="${key}Query"
    size="small"
    placeholder="Search"
    aria-label="Search ${label.toLowerCase()}"
  >
    <template #iconLeft>
      <i
        class="pi pi-search"
        aria-hidden="true"
      />
    </template>
  </InputText>
</template>`

export const noMatches = (key) => `<p
  v-if="!${key}Matches.length"
  role="status"
  class="px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted)"
>
  No results found
</p>`

export const searchScript = (key, source) => [
  `const ${key}Query = ref('')`,
  '',
  `const ${key}Matches = computed(() => {
  const term = ${key}Query.value.trim().toLowerCase()
  return ${source}.filter((option) => option.toLowerCase().includes(term))
})`
]

export const searchState = (key, options) => {
  const query = ref('')
  const matches = computed(() => {
    const term = query.value.trim().toLowerCase()
    return options.filter((option) => option.toLowerCase().includes(term))
  })
  return { [`${key}Query`]: query, [`${key}Matches`]: matches }
}
