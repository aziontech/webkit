<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Tabs from '@aziontech/webkit/tabs'
  import { computed } from 'vue'

  import type { SettingsLeaveDialogProps } from './settings-leave-dialog.vue'
  import SettingsSaveBar from './settings-save-bar.vue'

  export interface SettingsTabPageProps {
    /** The tabs of the resource; the settings page is one of them. */
    tabs: { value: string; label: string }[]
    /** The page heading. */
    title: string
    /** The sentence under the heading. */
    description: string
    /** Where the Documentation button leads. */
    docsHref: string
    /** The form holds edits. */
    dirty?: boolean
    /** The save is in flight. */
    saving?: boolean
    /** The tab that carries the unsaved-changes dot while the form holds edits. */
    dirtyTab?: string
    /** The leave guard; set, a tab change while dirty asks first and the leave dialog renders. */
    guard?: SettingsLeaveDialogProps['guard'] & { confirmLeave: () => Promise<boolean> }
  }

  const props = withDefaults(defineProps<SettingsTabPageProps>(), {
    dirty: false,
    saving: false,
    dirtyTab: '',
    guard: undefined
  })

  const emit = defineEmits<{
    save: [event: Event]
    discard: [event: MouseEvent]
  }>()

  const activeTab = defineModel<string>('tab', { default: 'main-settings' })

  defineSlots<{
    /** The settings groups. */
    default(): unknown
    /** The sentence of the save bar. */
    message(): unknown
    /** Dialogs the page opens, after the save bar. */
    dialogs(): unknown
  }>()

  const shownTab = computed({
    get: () => activeTab.value,
    set: async (value: string) => {
      if (!value || value === activeTab.value) return
      if (props.guard && !(await props.guard.confirmLeave())) return
      activeTab.value = value
    }
  })
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="shownTab">
        <Tabs.Trigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
          :dirty="dirty && tab.value === dirtyTab"
        />
      </PageTabs>
    </div>

    <section class="min-h-0 flex-1">
      <div class="flex min-h-full flex-col">
        <div class="flex min-w-0 flex-1 flex-col">
          <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col pb-0">
            <PageHeader
              :title="title"
              :description="description"
              size="small"
            >
              <template #actions>
                <Button
                  label="Documentation"
                  icon="az az-book"
                  variant="outline"
                  :href="docsHref"
                  target="_blank"
                  size="medium"
                />
              </template>
            </PageHeader>

            <section
              class="layout-section-start flex min-w-0 flex-1 flex-col pb-(--layout-boundary-end)"
            >
              <slot />
            </section>
          </div>

          <SettingsSaveBar
            :visible="dirty || saving"
            :guard="guard"
            :saving="saving"
            @save="(event) => emit('save', event)"
            @discard="(event) => emit('discard', event)"
          >
            <slot name="message" />
          </SettingsSaveBar>

          <slot name="dialogs" />
        </div>
      </div>
    </section>
  </div>
</template>
