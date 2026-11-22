<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Item from '@aziontech/webkit/item'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Tag from '@aziontech/webkit/tag'

  import ProductionProgressTag, { type ProductionStep } from './production-progress-tag.vue'

  export interface ProductionChecklistDrawerProps {
    /** The steps of the checklist. */
    steps: ProductionStep[]
  }

  defineProps<ProductionChecklistDrawerProps>()

  const open = defineModel<boolean>('open', { required: true })

  const emit = defineEmits<{
    step: [event: MouseEvent, id: string]
  }>()

  const STEP_MEDIA_CLASS =
    'flex size-8 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface) text-(--text-default) transition-colors duration-fast-02 ' +
    'ease-productive-entrance ' +
    'group-data-done/item:border-(--primary) group-data-done/item:bg-transparent group-data-done/item:text-(--primary) ' +
    'motion-reduce:transition-none'
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="end"
  >
    <DrawerContent>
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs)">
          <div class="flex min-w-0 items-center gap-(--spacing-sm)">
            <DrawerTitle>Ship to production</DrawerTitle>
            <ProductionProgressTag :steps="steps" />
          </div>
          <p class="text-body-sm text-(--text-muted)">
            The create put this service live on a generated hostname. These are the gates between
            that and production.
          </p>
        </div>
      </PanelHeader>

      <PanelBody>
        <div class="flex flex-col gap-(--spacing-sm)">
          <Item
            v-for="step in steps"
            :key="`${step.id}:${step.done ? 'done' : 'todo'}`"
            size="medium"
            :data-done="step.done || null"
          >
            <Item.Media>
              <span
                :class="STEP_MEDIA_CLASS"
                aria-hidden="true"
              >
                <i
                  :class="step.done ? 'az az-check' : step.icon"
                  class="text-body-sm leading-none"
                />
              </span>
            </Item.Media>

            <Item.Content>
              <Item.Title>
                {{ step.title }}
              </Item.Title>
              <Item.Description>
                {{ step.description }}
              </Item.Description>
            </Item.Content>

            <Item.Footer>
              <Tag
                v-if="step.done"
                icon="az az-check"
                :label="step.doneNote || 'Done'"
                severity="neutral"
                size="medium"
              />
              <Button
                v-else
                :label="step.actionLabel || step.title"
                variant="outline"
                size="small"
                @click="(event: MouseEvent) => emit('step', event, step.id)"
              />
            </Item.Footer>
          </Item>
        </div>
      </PanelBody>

      <PanelFooter>
        <div class="flex w-full items-center justify-end gap-(--spacing-sm)">
          <Button
            label="Done"
            variant="primary"
            size="medium"
            @click="open = false"
          />
        </div>
      </PanelFooter>
    </DrawerContent>
  </Drawer>
</template>
