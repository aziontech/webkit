<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import AppHeaderAccount from '@aziontech/webkit/app-header-account'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb, { type BreadcrumbItemData } from '@aziontech/webkit/breadcrumb-root'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import { useEscapeToCancel } from '@aziontech/webkit/use-escape-to-cancel'
  import { useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import type { UseUnsavedChangesReturn } from '@aziontech/webkit/use-unsaved-changes'
  import Wizard from '@aziontech/webkit/wizard-root'
  import { type ComponentPublicInstance, onMounted, ref } from 'vue'

  import DiscardDialog from './discard-dialog.vue'

  export interface WizardFrameProps {
    /** Name of the back control, read by screen readers. */
    backLabel: string
    /** The trail beside the brand: the module, then the page title. */
    breadcrumb: BreadcrumbItemData[]
    /** Page title and wizard name. */
    title: string
    /** The line under the title. */
    description: string
    /** Label of the submit button on the last step. */
    submitLabel: string
    /** Name of the Cmd+Enter shortcut in the shortcut list. */
    shortcutLabel: string
    /** The request is in flight: the wizard locks. */
    loading?: boolean
    /** The unsaved-changes guard; Back, Cancel and Escape ask before leaving a changed draft. */
    guard: Pick<
      UseUnsavedChangesReturn<unknown>,
      'confirmLeave' | 'dialogProps' | 'labels' | 'keepEditing' | 'discardAndLeave'
    >
  }

  const props = withDefaults(defineProps<WizardFrameProps>(), { loading: false })

  const emit = defineEmits<{
    next: [event: MouseEvent, position: number]
    submit: [event: MouseEvent]
    cancel: [event: MouseEvent | KeyboardEvent]
  }>()

  /** The step the wizard is on. */
  const stepIndex = defineModel<number>({ required: true })

  defineSlots<{
    /** The steps of the wizard. */
    default(): unknown
  }>()

  const onCancel = async (event: MouseEvent | KeyboardEvent) => {
    if (await props.guard.confirmLeave()) emit('cancel', event)
  }

  useEscapeToCancel(onCancel, { enabled: () => !props.loading })

  const wizardEl = ref<ComponentPublicInstance | null>(null)

  const FIELD_SELECTOR =
    'input:not([type="hidden"]), textarea, select, [role="combobox"], [role="radio"][tabindex="0"]'

  const wizardRoot = () => (wizardEl.value?.$el as HTMLElement | undefined) ?? null

  const focusFirstField = () => {
    const root = wizardRoot()
    const field = root?.querySelector<HTMLElement>(FIELD_SELECTOR)
    const checked =
      field instanceof HTMLInputElement && field.type === 'radio'
        ? root?.querySelector<HTMLElement>(`input[name="${CSS.escape(field.name)}"]:checked`)
        : null
    ;(checked ?? field)?.focus()
  }

  useShortcuts({
    keys: 'meta+enter',
    label: () => props.shortcutLabel,
    group: 'Page',
    element: wizardRoot,
    when: () => !props.loading,
    handler: () =>
      [...(wizardRoot()?.querySelectorAll<HTMLButtonElement>('button') ?? [])].pop()?.click()
  })

  onMounted(focusFirstField)
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <AppHeader aria-label="Console">
      <AppHeader.Start>
        <IconButton
          icon="az az-chevron-left"
          :aria-label="backLabel"
          variant="outline"
          size="small"
          @click="onCancel"
        />
        <AppHeader.Brand
          href="/home"
          aria-label="Azion home"
        >
          <Brand
            variant="default"
            size="small"
          />
        </AppHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </AppHeader.Start>
      <AppHeader.Center />
      <AppHeader.End>
        <AppHeaderAccount
          name="name@example.com"
          aria-label="Account settings"
        />
      </AppHeader.End>
    </AppHeader>

    <main class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto">
      <div
        class="layout-form-create layout-boundary-inline flex flex-col gap-(--layout-section-gap) py-(--layout-section-gap)"
      >
        <PageHeader
          :title="title"
          :description="description"
          size="small"
        />

        <Wizard
          ref="wizardEl"
          v-model="stepIndex"
          :aria-label="title"
          :submit-label="submitLabel"
          :loading="loading"
          @next="(event: MouseEvent, position: number) => emit('next', event, position)"
          @submit="(event: MouseEvent) => emit('submit', event)"
          @cancel="onCancel"
        >
          <slot />
        </Wizard>
      </div>
    </main>
    <DiscardDialog
      :guard="guard"
      data-testid="unsaved-changes-dialog"
    />
  </div>
</template>
