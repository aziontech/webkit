<script setup>
  import Button from '@aziontech/webkit/button'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import UnsavedChangesGuard from '../form/UnsavedChangesGuard.vue'
  import CreationHeader from './CreationHeader.vue'
  import PageHeading from './PageHeading.vue'
  import StepRail from './StepRail.vue'

  const props = defineProps({
    /** Breadcrumb trail for the flow, e.g. `[{ label: 'Firewall', href: '/firewall' }, { label: 'Create Network List' }]`. */
    breadcrumb: { type: Array, default: () => [] },
    /** Accessible label for the header's back button. */
    backLabel: { type: String, default: 'Back' },
    /** The flow's own name, carried by the rail's accessible label. */
    title: { type: String, default: '' },
    /**
     * The ordered steps. Each is `{ value, title, description, state, disabled }`, plus two
     * optional flags: `heading: false` when the step renders its own header, and
     * `bleed: true` when it takes the whole pane instead of the form measure.
     */
    steps: { type: Array, default: () => [] },
    /** The owner's in-flight flag: locks the fieldset and spins the commit. */
    submitting: { type: Boolean, default: false },
    /** True while the form holds input the reader has not committed. */
    dirty: { type: Boolean, default: false },
    /** The commit's own verb, shown on the last step. */
    saveLabel: { type: String, default: 'Create' }
  })

  const emit = defineEmits(['submit', 'cancel', 'back', 'next'])

  /** The step the reader is on; two-way so the rail can move it. */
  const current = defineModel({ type: String, default: '' })

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const index = computed(() => props.steps.findIndex((step) => step.value === current.value))
  const step = computed(() => props.steps[index.value] ?? null)
  const isFirst = computed(() => index.value <= 0)
  const isLast = computed(() => index.value === props.steps.length - 1)

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
          :data-bleed="step?.bleed || null"
          class="group/main animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto data-bleed:flex data-bleed:flex-col data-bleed:overflow-hidden"
        >
          <!-- A bleeding step hands its own height down: the form stops being content-sized
               (`min-h-full`, which lets `flex-1` children collapse to nothing) and becomes a
               flex child that fills the pane, so an editor inside it has a height to fill. -->
          <form
            class="flex min-h-full flex-col group-data-[bleed]/main:min-h-0 group-data-[bleed]/main:flex-1"
            :aria-label="step?.title || title"
            novalidate
            @submit.prevent="commit"
          >
            <!-- A BLEEDING STEP owns the whole pane. A code editor squeezed into the form
                 measure, with a rail already beside it, is an editor spending its width on
                 padding — so the column class and the boundary come off and the step fills
                 what is left of the viewport. It brings its own chrome, so no heading. -->
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
