<script setup>
  import Field from '@aziontech/ui/field'
  import IconButton from '@aziontech/ui/icon-button'
  import LanguageSelect from '@aziontech/ui/language-select'
  import SearchTrigger from '@aziontech/ui/search-trigger'
  import { ref } from 'vue'

  const locale = ref('en')
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <div
      class="flex items-center justify-end gap-(--spacing-xs) border-b border-(--border-default) pb-(--spacing-sm)"
    >
      <SearchTrigger label="Search" />
      <LanguageSelect
        v-model="locale"
        variant="ghost"
      />
      <IconButton
        icon="az az-github"
        variant="outline"
        size="medium"
        aria-label="GitHub"
        href="https://github.com/aziontech/webkit"
        target="_blank"
      />
    </div>
    <Field class="max-w-(--container-xs)">
      <Field.Label>Interface language</Field.Label>
      <LanguageSelect v-model="locale" />
      <Field.Description>The language of menus, buttons and messages.</Field.Description>
    </Field>
  </div>
</template>
