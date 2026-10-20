<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { useTabEnter } from '../../lib/behavior/tab-enter'

  import UnsavedChangesGuard from '../form/UnsavedChangesGuard.vue'
  import CreationHeader from './CreationHeader.vue'
  import PageHeading from './PageHeading.vue'
  import StepRail from './StepRail.vue'

  interface Props {
    breadcrumb?: unknown[]
    backLabel?: string
    title?: string
    steps?: unknown[]
    submitting?: boolean
    dirty?: boolean
    saveLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    breadcrumb: () => [],
    backLabel: 'Back',
    title: '',
    steps: () => [],
    submitting: false,
    dirty: false,
    saveLabel: 'Create'
  })

  defineSlots<{
    default(props: { step: unknown }): unknown
    docs(): unknown
  }>()

  const emit = defineEmits<{
    submit: []
    cancel: []
    back: []
    next: []
  }>()

  const current = defineModel({ type: String, default: '' })

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const index = computed(() => props.steps.findIndex((step) => step.value === current.value))
  const step = computed(() => props.steps[index.value] ?? null)
  const isFirst = computed(() => index.value <= 0)
  const isLast = computed(() => index.value === props.steps.length - 1)

  const mainRef = ref(null)
  const direction = ref(null)

  watch(index, (next, previous) => {
    direction.value = next < previous ? 'back' : 'forward'
  })

  useTabEnter(mainRef, current, mainRef)

  const onCrumb = (event, href) => {
    if (!href || href === '#') {
      emit('cancel')
      return
    }
    const [path, queryString] = href.split('?')
    const extra = Object.fromEntries(new URLSearchParams(queryString || ''))
    router.push({ path, query: { email: userEmail.value, ...extra } })
  }

  const commit = () => (isLast.value ? emit('submit') : emit('next'))
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

    <div class="flex min-h-0 flex-1">
      <StepRail
        v-model="current"
        :steps="steps"
        :aria-label="title || 'Steps'"
      />

      <div class="flex min-w-0 flex-1 flex-col">
        <main
          ref="mainRef"
          :data-bleed="step?.bleed || null"
          :data-direction="direction"
          class="group/main data-[direction=forward]:[--page-enter-distance:calc(var(--layout-boundary-inline)*-1)] animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto data-bleed:flex data-bleed:flex-col data-bleed:overflow-hidden"
        >
          <form
            class="flex min-h-full flex-col group-data-[bleed]/main:min-h-0 group-data-[bleed]/main:flex-1"
            :aria-label="step?.title || title"
            novalidate
            @submit.prevent="commit"
          >
            <div
              v-if="step?.bleed"
              class="flex min-h-0 flex-1 flex-col"
            >
              <fieldset
                class="m-0 flex min-h-0 min-w-0 flex-1 flex-col border-0 p-0"
                :disabled="submitting"
              >
                <legend class="sr-only">{{ step?.title ?? title }}</legend>
                <slot :step="step?.value ?? ''" />
              </fieldset>
            </div>

            <div
              v-else
              class="layout-form-create layout-boundary-inline flex flex-1 flex-col pt-(--layout-section-gap) pb-(--layout-section-gap)"
            >
              <p class="pb-(--spacing-sm) text-label-sm text-(--text-muted) md:hidden">
                Step {{ index + 1 }} of {{ steps.length }}
              </p>

              <PageHeading
                v-if="step?.heading !== false"
                :title="step?.title ?? title"
                :description="step?.description ?? ''"
              />

              <fieldset
                class="mx-0 flex min-w-0 flex-1 flex-col border-0 p-0 data-headed:mt-(--layout-section-gap)"
                :data-headed="step?.heading !== false || null"
                :disabled="submitting"
              >
                <legend class="sr-only">{{ step?.title ?? title }}</legend>
                <slot :step="step?.value ?? ''" />
              </fieldset>
            </div>

            <button
              type="submit"
              class="sr-only"
              tabindex="-1"
              aria-hidden="true"
            >
              {{ isLast ? saveLabel : 'Next' }}
            </button>
          </form>
        </main>

        <footer class="shrink-0 border-t border-(--border-default) bg-(--bg-surface)">
          <div
            class="layout-form-create layout-boundary-inline flex items-center justify-between gap-(--spacing-sm) py-(--spacing-md)"
          >
            <Button
              type="button"
              label="Cancel"
              kind="text"
              size="medium"
              :disabled="submitting"
              @click="emit('cancel')"
            />
            <div class="flex shrink-0 items-center gap-(--spacing-sm)">
              <Button
                v-if="!isFirst"
                type="button"
                label="Back"
                kind="outlined"
                size="medium"
                :disabled="submitting"
                @click="emit('back')"
              />
              <Button
                :label="isLast ? saveLabel : 'Next'"
                kind="primary"
                size="medium"
                :loading="submitting"
                @click="commit"
              />
            </div>
          </div>
        </footer>
      </div>

      <aside
        v-if="$slots.docs"
        class="hidden h-full w-80 shrink-0 overflow-auto border-l border-(--border-default) px-(--spacing-md) py-(--layout-section-gap) xl:block"
      >
        <slot name="docs" />
      </aside>
    </div>
  </div>
</template>
