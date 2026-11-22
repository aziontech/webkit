<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Spinner from '@aziontech/webkit/spinner'
  import SplitButton from '@aziontech/webkit/split-button'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  import type { VersionDetailRevertDiff, VersionDetailVersion } from '../detail-version.vue'
  import RevertDiff from './revert-diff.vue'

  export interface VersionBarProps {
    /** The version the page is on. */
    viewed: VersionDetailVersion
    /** The version a revert replaces: the deployed one. */
    version: VersionDetailVersion
    /** What the revert changes. */
    revertDiff: VersionDetailRevertDiff
    /** A new version is being copied from the viewed one. */
    creating: boolean
    /** A revert to the viewed version is running. */
    reverting: boolean
  }

  const props = defineProps<VersionBarProps>()

  const emit = defineEmits<{
    save: [event: MouseEvent, action: string]
    'add-version': [event: MouseEvent]
    redeploy: [event: MouseEvent]
    revert: [event: MouseEvent]
  }>()

  const saveOptions = [
    { label: 'Save and deploy', value: 'deploy' },
    { label: 'Save and build', value: 'build' },
    { label: 'Save', value: 'save' }
  ]

  const saveAction = ref<string | undefined>('deploy')
  const confirmOpen = ref(false)

  const isDraft = computed(() => props.viewed.state === 'draft')
  const statusLabel = computed(() => {
    if (props.creating) return 'Creating new version…'
    if (props.reverting) return `Reverting to ${props.viewed.name}…`
    if (isDraft.value) return 'Draft'
    return props.viewed.state === 'deployed'
      ? 'Viewing a deployed version'
      : 'Viewing an earlier version'
  })
  const statusLine = computed(() => {
    if (props.creating) return `Copying ${props.viewed.name} into a new draft.`
    if (isDraft.value) return 'This version is open for editing. Deploy it when ready.'
    return props.viewed.comment
  })

  const save = (event: MouseEvent) => emit('save', event, saveAction.value ?? 'deploy')
  const confirmRevert = (event: MouseEvent) => {
    confirmOpen.value = false
    emit('revert', event)
  }
</script>

<template>
  <Transition
    appear
    enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
    enter-from-class="translate-y-2 opacity-0"
  >
    <footer
      class="flex min-h-14 shrink-0 flex-col border-t border-(--border-default) bg-(--bg-surface)"
      data-testid="version-detail-bar"
    >
      <div
        class="layout-boundary-inline flex min-w-0 flex-1 items-center gap-(--spacing-sm) py-(--spacing-xs)"
      >
        <span
          v-if="creating || isDraft"
          class="hidden size-8 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) md:flex"
          aria-hidden="true"
        >
          <Spinner v-if="creating" />
          <i
            v-else
            class="az az-file-pen text-body-sm text-(--text-default)"
          />
        </span>
        <div
          class="flex min-w-0 flex-1 flex-col"
          role="status"
        >
          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
            <span class="truncate text-body-sm text-(--text-default)">{{ statusLabel }}</span>
            <span
              v-if="!creating"
              class="hidden shrink-0 sm:inline-flex"
            >
              <Tag
                :label="isDraft ? 'Editable' : 'Read-only'"
                :severity="isDraft ? 'info' : 'neutral'"
                :icon="isDraft ? '' : 'az az-lock'"
                size="small"
              />
            </span>
          </div>
          <p
            class="hidden truncate text-body-xs text-(--text-muted) md:block"
            :title="statusLine"
          >
            {{ statusLine }}
          </p>
        </div>

        <div class="flex shrink-0 items-center gap-(--spacing-xs)">
          <SplitButton
            v-if="isDraft && !creating"
            :label="saveOptions.find((option) => option.value === saveAction)?.label"
            :icon="saveAction === 'deploy' ? 'az az-cloud-upload' : ''"
            variant="primary"
            size="medium"
            :items="saveOptions"
            @click="save"
            @item-click="(_event, item) => (saveAction = item.value)"
          />
          <template v-else>
            <Button
              label="Add Version"
              variant="outline"
              size="medium"
              icon="az az-plus"
              :loading="creating"
              @click="(event: MouseEvent) => emit('add-version', event)"
            />
            <Button
              v-if="viewed.state !== 'ready'"
              label="Redeploy"
              variant="outline"
              size="medium"
              icon="az az-refresh"
              :disabled="creating"
              @click="(event: MouseEvent) => emit('redeploy', event)"
            />
            <ConfirmDialog
              v-else
              v-model:open="confirmOpen"
              :title="`Revert to ${viewed.name}?`"
              :description="`Reverting deploys ${viewed.name} to Production in place of ${version.name}. ${version.name} stays in the version history, so you can redeploy it later.`"
              :confirm-label="`Revert to ${viewed.name}`"
              variant="primary"
              size="medium"
              @confirm="confirmRevert"
            >
              <template #trigger>
                <Button
                  :label="`Revert to ${viewed.name}`"
                  variant="primary"
                  size="medium"
                  icon="az az-undo"
                  :loading="reverting"
                />
              </template>
              <RevertDiff
                :revert-diff="revertDiff"
                :deployed-name="version.name"
              />
            </ConfirmDialog>
          </template>
        </div>
      </div>
    </footer>
  </Transition>
</template>
