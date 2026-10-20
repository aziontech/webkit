<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  import ProductionChecklistDrawer from './ProductionChecklistDrawer.vue'

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
    action: []
  }>()

  const detailOpen = ref(false)

  const doneCount = computed(() => props.steps.filter((step) => step.done).length)
  const complete = computed(() => props.steps.length > 0 && doneCount.value === props.steps.length)
</script>

<template>
  <CardBox
    :padded="false"
    :data-complete="complete || null"
    class="data-complete:[&>header]:border-b-0"
  >
    <template #header>
      <div class="flex min-w-0 flex-1 items-center gap-(--spacing-sm)">
        <h2 class="truncate text-label-md text-(--text-default)">{{ title }}</h2>

        <Tag
          :label="complete ? 'Ready for production' : `${doneCount} of ${steps.length}`"
          :severity="complete ? 'success' : 'secondary'"
          size="small"
          class="shrink-0"
        />
      </div>

      <IconButton
        icon="pi pi-window-maximize"
        aria-label="Expand the production checklist"
        kind="outlined"
        size="small"
        class="shrink-0"
        @click="detailOpen = true"
      />
    </template>

    <template #content>
      <div
        v-if="!complete"
        class="flex flex-col"
      >
        <Item
          v-for="step in steps"
          :key="`${step.id}:${step.done ? 'done' : 'todo'}`"
          as-child
          size="small"
        >
          <button
            type="button"
            :data-done="step.done || null"
            class="w-full rounded-none text-left transition-colors duration-fast-02 ease-productive-entrance data-done:bg-(--primary-mask) motion-reduce:transition-none"
            @click="emit('action', step)"
          >
            <Item.Media>
              <i
                :class="step.icon"
                class="text-body-sm leading-none text-(--text-muted) group-data-done/item:text-(--primary)"
                aria-hidden="true"
              />
            </Item.Media>

            <Item.Content>
              <Item.Title
                class="truncate group-data-done/item:text-(--primary) group-data-done/item:line-through"
              >
                {{ step.title }}
              </Item.Title>
            </Item.Content>

            <Item.Actions>
              <i
                v-if="step.done"
                class="pi pi-check text-body-sm leading-none text-(--primary)"
                aria-hidden="true"
              />
              <span class="sr-only">{{ step.done ? 'Done' : 'Not started' }}</span>
            </Item.Actions>
          </button>
        </Item>
      </div>
    </template>
  </CardBox>

  <ProductionChecklistDrawer
    v-model:open="detailOpen"
    :title="title"
    :description="description"
    :steps="steps"
    @action="emit('action', $event)"
  />
</template>
