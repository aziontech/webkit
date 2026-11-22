<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import { computed } from 'vue'

  import ProductionProgressTag, { type ProductionStep } from './production-progress-tag.vue'

  export interface ProductionChecklistCardProps {
    /** The steps of the checklist. */
    steps: ProductionStep[]
  }

  const props = defineProps<ProductionChecklistCardProps>()

  const emit = defineEmits<{
    expand: [event: MouseEvent]
  }>()

  const complete = computed(() => props.steps.length > 0 && props.steps.every((step) => step.done))
</script>

<template>
  <Card
    :padded="false"
    :data-complete="complete || null"
  >
    <template #header>
      <div class="flex min-w-0 flex-1 items-center gap-(--spacing-sm)">
        <h2 class="truncate text-label-md text-(--text-default)">Ship to production</h2>

        <ProductionProgressTag :steps="steps" />
      </div>

      <IconButton
        icon="az az-app-window"
        aria-label="Expand the production checklist"
        variant="outline"
        size="small"
        class="shrink-0"
        @click="(event: MouseEvent) => emit('expand', event)"
      />
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
</template>
