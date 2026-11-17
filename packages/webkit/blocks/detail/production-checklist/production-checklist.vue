<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  import { sampleSteps } from './sample'

  /** One gate between the generated hostname and production. */
  export interface ProductionChecklistStep {
    /** Stable id of the gate. */
    id: string
    /** Icon class of the gate. */
    icon: string
    /** Verb-first gate title. */
    title: string
    /** What the gate gives the service, shown in the drawer. */
    description: string
    /** Label of the drawer action; empty uses the title. */
    actionLabel: string
    /** Whether the gate is done. */
    done: boolean
    /** What the gate now serves, shown beside the Done tag. */
    doneNote: string
  }

  export interface ProductionChecklistProps {
    /** The gates, in order. Left out, the sample renders. */
    steps?: ProductionChecklistStep[]
    /** Opens the drawer on mount. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<ProductionChecklistProps>(), {
    steps: undefined,
    defaultOpen: false
  })

  const emit = defineEmits<{
    /** A gate action in the drawer was pressed. */
    'step-action': [event: MouseEvent, step: ProductionChecklistStep]
    /** The drawer Done button was pressed. */
    done: [event: MouseEvent]
  }>()

  const open = ref(props.defaultOpen)

  const steps = computed(() => props.steps ?? sampleSteps)

  const onStepAction = (event: MouseEvent, step: ProductionChecklistStep) => {
    open.value = false
    emit('step-action', event, step)
  }

  const onDone = (event: MouseEvent) => {
    open.value = false
    emit('done', event)
  }

  const doneCount = computed(() => steps.value.filter((step) => step.done).length)
  const complete = computed(() => steps.value.length > 0 && doneCount.value === steps.value.length)
</script>

<template>
  <Card
    :padded="false"
    :data-complete="complete || null"
  >
    <template #header>
      <div class="flex min-w-0 flex-1 items-center gap-(--spacing-sm)">
        <h2 class="truncate text-label-md text-(--text-default)">Ship to production</h2>

        <Tag
          :label="complete ? 'Ready for production' : `${doneCount} of ${steps.length}`"
          :severity="complete ? 'success' : 'neutral'"
          size="small"
          class="shrink-0"
        />
      </div>

      <Tooltip
        content="Expand"
        class="shrink-0"
      >
        <IconButton
          icon="az az-window-maximize"
          aria-label="Expand the production checklist"
          variant="outline"
          size="small"
          @click="open = true"
        />
      </Tooltip>
    </template>

    <template #default>
      <div
        v-if="!complete"
        class="flex flex-col"
      >
        <div
          v-for="step in steps"
          :key="`${step.id}:${step.done ? 'done' : 'todo'}`"
          :data-done="step.done || null"
          class="group/step transition-colors duration-fast-02 ease-productive-entrance data-done:bg-(--primary-mask) motion-reduce:transition-none"
        >
          <Item
            size="small"
            clickable
            @click="open = true"
          >
            <Item.Media>
              <i
                :class="step.icon"
                class="text-body-sm leading-none text-(--text-muted) group-data-done/step:text-(--primary)"
                aria-hidden="true"
              />
            </Item.Media>

            <Item.Content>
              <Item.Title>
                {{ step.title }}
              </Item.Title>
            </Item.Content>

            <Item.Actions>
              <i
                v-if="step.done"
                class="az az-check text-body-sm leading-none text-(--primary)"
                aria-hidden="true"
              />
              <span class="sr-only">{{ step.done ? 'Done' : 'Not started' }}</span>
            </Item.Actions>
          </Item>
        </div>
      </div>
    </template>
  </Card>

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
            <Tag
              :label="complete ? 'Ready for production' : `${doneCount} of ${steps.length}`"
              :severity="complete ? 'success' : 'neutral'"
              size="small"
              class="shrink-0"
            />
          </div>
          <p class="text-body-sm text-(--text-muted)">
            This service is live on a generated hostname. These steps take it to production.
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
                class="flex size-8 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface) text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance group-data-done/item:border-(--primary) group-data-done/item:bg-transparent group-data-done/item:text-(--primary) motion-reduce:transition-none"
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
              <div
                v-if="step.done"
                class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
              >
                <Tag
                  icon="az az-check"
                  label="Done"
                  severity="neutral"
                  size="medium"
                />
                <span
                  v-if="step.doneNote"
                  class="min-w-0 text-body-sm text-(--text-muted)"
                  >{{ step.doneNote }}</span
                >
              </div>
              <Button
                v-else
                :label="step.actionLabel || step.title"
                variant="outline"
                size="small"
                @click="onStepAction($event, step)"
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
            @click="onDone"
          />
        </div>
      </PanelFooter>
    </DrawerContent>
  </Drawer>
</template>
