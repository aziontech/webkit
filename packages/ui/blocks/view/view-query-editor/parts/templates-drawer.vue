<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import DrawerContent from '@aziontech/ui/drawer-content'
  import Drawer from '@aziontech/ui/drawer-root'
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import EmptyState from '@aziontech/ui/empty-state'
  import Input from '@aziontech/ui/input'
  import Item from '@aziontech/ui/item'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelHeader from '@aziontech/ui/panel-header'
  import { computed, ref, watch } from 'vue'

  import { type QueryEditorTemplate, sampleTemplates } from '../sample'

  const emit = defineEmits<{
    /** A template was picked; carries its SQL. */
    choose: [sql: string]
  }>()

  /** Whether the drawer is open. */
  const open = defineModel<boolean>('open', { default: false })

  const templateQuery = ref('')
  const filteredTemplates = computed(() => {
    const term = templateQuery.value.trim().toLowerCase()
    if (!term) return sampleTemplates
    return sampleTemplates.filter(
      (template) =>
        template.title.toLowerCase().includes(term) ||
        template.description.toLowerCase().includes(term)
    )
  })
  watch(open, (value) => {
    if (value) templateQuery.value = ''
  })
  const choose = (template: QueryEditorTemplate) => {
    emit('choose', template.sql)
    open.value = false
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="end"
  >
    <DrawerContent>
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
          <DrawerTitle>SQL quick templates</DrawerTitle>
          <p class="text-body-sm text-(--text-muted)">Pick a snippet to load it into the editor.</p>
        </div>
      </PanelHeader>

      <PanelBody>
        <div
          class="flex flex-col gap-(--spacing-md) outline-none"
          tabindex="-1"
          data-autofocus
        >
          <Input
            v-model="templateQuery"
            size="large"
            class="w-full"
            placeholder="Search templates"
            aria-label="Search templates"
          >
            <template #leading>
              <i
                class="az az-search"
                aria-hidden="true"
              />
            </template>
          </Input>

          <div
            v-if="filteredTemplates.length"
            class="grid grid-cols-1 gap-(--spacing-sm) md:grid-cols-2"
          >
            <Item
              v-for="template in filteredTemplates"
              :key="template.title"
              variant="outline"
              clickable
              @click="choose(template)"
            >
              <Item.Media>
                <i
                  :class="template.icon"
                  class="text-(--text-muted)"
                  aria-hidden="true"
                />
              </Item.Media>
              <Item.Content>
                <Item.Title>{{ template.title }}</Item.Title>
                <Item.Description>{{ template.description }}</Item.Description>
              </Item.Content>
            </Item>
          </div>

          <EmptyState
            v-else
            size="small"
            icon="az az-search"
            :title="`No templates match “${templateQuery}”`"
            description="Try another name or statement."
          >
            <template #actions>
              <Button
                label="Clear search"
                variant="outline"
                size="small"
                @click="templateQuery = ''"
              />
            </template>
          </EmptyState>
        </div>
      </PanelBody>
    </DrawerContent>
  </Drawer>
</template>
