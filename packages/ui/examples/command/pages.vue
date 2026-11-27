<script setup>
  import Button from '@aziontech/ui/button'
  import CommandEmpty from '@aziontech/ui/command-empty'
  import CommandGroup from '@aziontech/ui/command-group'
  import CommandInput from '@aziontech/ui/command-input'
  import CommandItem from '@aziontech/ui/command-item'
  import CommandList from '@aziontech/ui/command-list'
  import CommandPage from '@aziontech/ui/command-page'
  import CommandRoot from '@aziontech/ui/command-root'
  import { ref } from 'vue'

  const open = ref(false)
  const page = ref('')
  const project = ref('acme-store')

  function openProjects() {
    page.value = 'projects'
    open.value = true
  }
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-sm)">
    <Button
      label="Open palette with pages"
      variant="primary"
      @click="open = true"
    />
    <Button
      label="Switch project"
      variant="outline"
      @click="openProjects"
    />
    <span class="text-body-sm text-(--text-muted)">Current project: {{ project }}</span>
  </div>

  <CommandRoot
    v-model:open="open"
    v-model:page-key="page"
    shortcut=""
    @select="(event, value) => (project = String(value))"
  >
    <CommandInput placeholder="Search commands…" />
    <CommandList>
      <CommandGroup label="Projects">
        <CommandItem
          value="switch-project"
          page="projects"
          :keywords="['change', 'open']"
          >Switch project</CommandItem
        >
        <CommandItem value="new-project">Create project</CommandItem>
      </CommandGroup>
      <CommandPage
        name="projects"
        title="Switch project"
      >
        <CommandGroup label="Acme Inc.">
          <CommandItem value="acme-store">acme-store</CommandItem>
          <CommandItem value="docs-site">docs-site</CommandItem>
          <CommandItem value="site-assets">site-assets</CommandItem>
        </CommandGroup>
      </CommandPage>
      <CommandEmpty>No commands found.</CommandEmpty>
    </CommandList>
  </CommandRoot>
</template>
