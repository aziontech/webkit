<script setup>
import PrimeButton from 'primevue/button'

defineOptions({ name: 'empty-results-block' })

const emit = defineEmits(['click-to-create'])

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createButtonLabel: {
    type: String,
    default: ''
  },
  disabledList: {
    type: Boolean,
    default: false
  },
  inTabs: {
    type: Boolean,
    default: false
  },
  noBorder: {
    type: Boolean,
    default: false
  },
  noShowBorderTop: {
    type: Boolean,
    default: false
  },
  showLearnMoreButton: {
    type: Boolean,
    default: true
  },
  documentationService: {
    type: Function,
    default: null
  },
  pt: {
    type: Object,
    default: () => ({})
  }
})

function openDocumentation() {
  if (props.documentationService) {
    props.documentationService()
  }
}

function handleCreateClick() {
  emit('click-to-create')
}
</script>

<template>
  <div
    class="flex flex-col justify-center surface-section rounded-md"
    :class="{
      'mt-4 pb-8': inTabs,
      'border surface-border': !noBorder,
      'rounded-t-none': noShowBorderTop
    }"
  >
    <div
      class="min-h-[300px] flex flex-col justify-center gap-5 items-center rounded-md p-8 max-md:p-3"
      :class="pt"
    >
      <slot name="illustration"></slot>
      <div class="flex flex-col gap-2 max-w-4xl">
        <p class="text-center text-color text-lg font-medium leading-7">
          {{ title }}
        </p>
        <p class="text-center text-color-secondary text-base font-normal leading-tight">
          {{ description }}
        </p>
      </div>
      <div class="flex flex-col gap-5 items-center w-full">
        <div class="flex flex-wrap gap-2 justify-center w-full">
          <slot name="extraActionsLeft"></slot>
          <slot name="default">
            <PrimeButton
              v-if="createButtonLabel"
              class="max-md:w-full w-fit"
              severity="secondary"
              :disabled="disabledList"
              icon="pi pi-plus"
              :data-testid="`create_${createButtonLabel}_button`"
              :label="createButtonLabel"
              size="small"
              @click="handleCreateClick"
            />
          </slot>
          <slot name="extraActionsRight"></slot>
        </div>
        <PrimeButton
          v-if="documentationService"
          class="w-fit"
          icon-pos="right"
          icon="pi pi-external-link"
          label="View Documentation"
          link
          size="small"
          @click="openDocumentation"
        />
      </div>
    </div>
  </div>
</template>
