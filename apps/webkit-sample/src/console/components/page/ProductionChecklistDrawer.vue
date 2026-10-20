<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Item from '@aziontech/webkit/item'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  const open = defineModel('open', { type: Boolean, default: false })

  interface Props {
    title?: string
    description?: string
    steps?: unknown[]
  }

  const props = withDefaults(defineProps<Props>(), {
    title: 'Ship to production',
    description: '',
    steps: () => []
  })

  const emit = defineEmits<{
    action: [step: unknown]
  }>()

  const doneCount = computed(() => props.steps.filter((step) => step.done).length)
  const complete = computed(() => props.steps.length > 0 && doneCount.value === props.steps.length)

  const act = (step) => {
    open.value = false
    emit('action', step)
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="right"
  >
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
            <div class="flex min-w-0 items-center gap-(--spacing-sm)">
              <DrawerTitle>{{ title }}</DrawerTitle>
              <Tag
                :label="complete ? 'Ready for production' : `${doneCount} of ${steps.length}`"
                :severity="complete ? 'success' : 'secondary'"
                size="small"
                class="shrink-0"
              />
            </div>
            <p
              v-if="description"
              class="text-body-sm text-(--text-muted)"
            >
              {{ description }}
            </p>
          </div>
          <DrawerClose />
        </PanelHeader>

        <PanelContent>
          <div class="flex flex-col gap-(--spacing-sm)">
            <Item
              v-for="step in steps"
              :key="`${step.id}:${step.done ? 'done' : 'todo'}`"
              size="medium"
              :data-done="step.done || null"
              class="rounded-(--shape-card) border-(--border-muted) bg-(--bg-surface) transition-colors duration-fast-02 ease-productive-entrance data-done:border-(--primary) data-done:bg-(--primary-mask) motion-reduce:transition-none"
            >
              <Item.Media>
                <span
                  class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface) text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance group-data-done/item:border-(--primary) group-data-done/item:bg-transparent group-data-done/item:text-(--primary) motion-reduce:transition-none"
                  aria-hidden="true"
                >
                  <i
                    :class="step.done ? 'pi pi-check' : step.icon"
                    class="text-body-sm leading-none"
                  />
                </span>
              </Item.Media>

              <Item.Content>
                <Item.Title
                  class="group-data-done/item:text-(--primary) group-data-done/item:line-through"
                >
                  {{ step.title }}
                </Item.Title>
                <Item.Description
                  class="group-data-done/item:text-(--primary) group-data-done/item:line-through"
                >
                  {{ step.description }}
                </Item.Description>
              </Item.Content>

              <Item.Footer>
                <Tag
                  v-if="step.done"
                  icon="pi pi-check"
                  :label="step.doneNote || 'Done'"
                  severity="secondary"
                  size="medium"
                />
                <Button
                  v-else
                  :label="step.actionLabel || step.title"
                  kind="outlined"
                  size="small"
                  @click="act(step)"
                />
              </Item.Footer>
            </Item>
          </div>
        </PanelContent>

        <PanelFooter class="justify-end">
          <Button
            label="Done"
            kind="primary"
            size="medium"
            @click="open = false"
          />
        </PanelFooter>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
