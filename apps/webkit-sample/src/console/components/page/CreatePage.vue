<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import UnsavedChangesGuard from '../form/UnsavedChangesGuard.vue'
  import CreationHeader from './CreationHeader.vue'
  import PageHeading from './PageHeading.vue'

  interface Props {
    breadcrumb?: unknown[]
    backLabel?: string
    title?: string
    description?: string
    titleId?: string
    submitting?: boolean
    dirty?: boolean
    saveLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    breadcrumb: () => [],
    backLabel: 'Back',
    title: '',
    description: '',
    submitting: false,
    dirty: false,
    saveLabel: 'Save'
  })

  defineSlots<{
    default(): unknown
    start(): unknown
  }>()

  const emit = defineEmits<{
    submit: []
    cancel: []
  }>()

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const onCrumb = (event, href) => {
    if (!href || href === '#') {
      emit('cancel')
      return
    }
    const [path, queryString] = href.split('?')
    const extra = Object.fromEntries(new URLSearchParams(queryString || ''))
    router.push({ path, query: { email: userEmail.value, ...extra } })
  }
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <UnsavedChangesGuard :dirty="dirty" />

    <CreationHeader
      :breadcrumb="breadcrumb"
      :back-label="backLabel"
      @back="emit('cancel')"
      @navigate="onCrumb"
    />

    <main class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto">
      <form
        class="flex min-h-full flex-col"
        :aria-labelledby="titleId"
        :aria-label="titleId ? undefined : title"
        novalidate
        @submit.prevent="emit('submit')"
      >
        <div
          class="layout-column-form layout-boundary-inline flex flex-1 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
        >
          <PageHeading
            :title="title"
            :description="description"
            :title-id="titleId"
          />

          <fieldset
            class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">{{ title }}</legend>
            <slot />
          </fieldset>
        </div>

        <footer
          class="pointer-events-none sticky bottom-0 z-10 flex justify-center px-(--spacing-md) pt-(--spacing-xl) pb-(--spacing-lg)"
        >
          <div
            class="pointer-events-auto flex max-w-full items-center gap-(--spacing-md) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) py-(--spacing-xs) pr-(--spacing-xs) pl-(--spacing-xs) shadow-lg"
          >
            <div
              v-if="$slots.start"
              class="flex min-w-0 items-center gap-(--spacing-sm)"
            >
              <slot name="start" />
            </div>
            <div class="flex shrink-0 items-center gap-(--spacing-sm)">
              <Button
                type="button"
                label="Cancel"
                kind="outlined"
                size="medium"
                :disabled="submitting"
                @click="emit('cancel')"
              />
              <Button
                :label="saveLabel"
                kind="primary"
                size="medium"
                :loading="submitting"
                @click="emit('submit')"
              />
            </div>
          </div>
        </footer>
        <button
          type="submit"
          class="sr-only"
          tabindex="-1"
          aria-hidden="true"
        >
          {{ saveLabel }}
        </button>
      </form>
    </main>
  </div>
</template>
