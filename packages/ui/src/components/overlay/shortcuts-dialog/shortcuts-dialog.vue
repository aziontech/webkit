<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { useShortcutList, useShortcuts } from '../../../composables/use-shortcuts'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Kbd from '../../content/kbd/kbd.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Dialog from '../dialog/dialog.vue'
  import DialogContent from '../dialog/dialog-content.vue'
  import DialogTitle from '../dialog/dialog-title.vue'
  import DialogTrigger from '../dialog/dialog-trigger.vue'
  import PanelBody from '../panel/panel-body.vue'
  import PanelHeader from '../panel/panel-header.vue'

  defineOptions({
    name: 'ShortcutsDialog',
    inheritAttrs: false
  })

  export interface ShortcutsDialogProps {
    /** Dialog title. Empty uses the locale catalog (`Keyboard shortcuts`). */
    title?: string
    /** Keys that open the list, in the `useShortcuts` syntax; listed under the general group. Empty binds no key. */
    shortcut?: string
    /** Initial open state when uncontrolled. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<ShortcutsDialogProps>(), {
    title: '',
    shortcut: '?',
    defaultOpen: false
  })

  /** Controlled open state. Use with v-model:open; while unbound the dialog starts at defaultOpen. */
  const open = defineModel<boolean>('open', { default: undefined as never })

  defineSlots<{
    /** The control that opens the list (a menu item, an icon button). */
    trigger(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ shortcutsDialog: en.shortcutsDialog })
  const { groups } = useShortcutList()

  useShortcuts({
    keys: () => props.shortcut,
    label: () => t('shortcutsDialog.show'),
    when: () => props.shortcut.trim() !== '',
    handler: () => {
      open.value = true
    }
  })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'shortcuts-dialog')

  const contentAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )

  const uid = useId()
</script>

<template>
  <Dialog
    v-model:open="open"
    :default-open="defaultOpen"
    :data-testid="testId"
    size="medium"
  >
    <DialogTrigger
      :data-testid="`${testId}__trigger`"
      v-if="$slots['trigger']"
    >
      <slot name="trigger" />
    </DialogTrigger>
    <DialogContent
      :data-testid="`${testId}__panel`"
      v-bind="contentAttrs"
    >
      <PanelHeader class="w-full">
        <DialogTitle :data-testid="`${testId}__title`">{{
          title || t('shortcutsDialog.title')
        }}</DialogTitle>
      </PanelHeader>
      <PanelBody>
        <EmptyState
          v-if="!groups.length"
          :data-testid="`${testId}__empty`"
          :title="t('shortcutsDialog.emptyTitle')"
          size="small"
        />
        <div
          v-else
          class="flex flex-col gap-(--spacing-lg)"
        >
          <div
            v-for="(group, groupIndex) in groups"
            :key="group.group"
            role="group"
            :aria-labelledby="`${uid}-group-${groupIndex}`"
            :data-testid="`${testId}__group`"
          >
            <h3
              :id="`${uid}-group-${groupIndex}`"
              class="m-0 mb-(--spacing-xs) text-label-sm text-(--text-muted)"
            >
              {{ group.group || t('shortcutsDialog.general') }}
            </h3>
            <dl class="m-0 flex flex-col">
              <div
                v-for="item in group.items"
                :key="item.id"
                :data-testid="`${testId}__item`"
                class="flex items-center justify-between gap-(--spacing-md) py-(--spacing-xs) not-last:border-b not-last:border-(--border-default)"
              >
                <dt class="min-w-0 text-body-sm text-(--text-default)">{{ item.label }}</dt>
                <dd class="m-0 shrink-0">
                  <Kbd
                    :keys="item.keyList"
                    size="small"
                    variant="separate"
                  />
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </PanelBody>
    </DialogContent>
  </Dialog>
</template>
