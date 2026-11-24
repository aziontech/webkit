<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Kbd from '@aziontech/webkit/kbd'
  import SaveBar from '@aziontech/webkit/save-bar'
  import { computed, ref } from 'vue'

  export interface DeploymentSaveBarProps {
    /** The defaults differ from the saved ones. */
    dirty: boolean
    /** The defaults save is in flight. */
    saving: boolean
    /** Names of the settings the save rewrites with Apply to existing; empty rewrites none. */
    rewritten: string[]
    /** The binding policy those settings take. */
    bindingLabel: string
  }

  const props = defineProps<DeploymentSaveBarProps>()

  const emit = defineEmits<{
    'save-shortcut': [event: KeyboardEvent]
    discard: [event: MouseEvent]
    save: [event: MouseEvent]
  }>()

  const confirmOpen = ref(false)
  const count = computed(() => props.rewritten.length)
  const message = computed(() =>
    count.value
      ? `Saving moves ${count.value} ${count.value === 1 ? 'setting' : 'settings'} to the ${props.bindingLabel} binding policy.`
      : 'You have unsaved changes.'
  )
  const confirmDescription = computed(
    () =>
      `${props.rewritten.join(', ')} ${count.value === 1 ? 'takes' : 'take'} the ${props.bindingLabel} binding policy. ` +
      'Their other values and Default stay as they are.'
  )

  const onSaveShortcut = (event: KeyboardEvent) => {
    if (count.value) confirmOpen.value = true
    else emit('save-shortcut', event)
  }
  const discard = (event: MouseEvent) => emit('discard', event)
  const save = (event: MouseEvent) => {
    if (count.value) confirmOpen.value = true
    else emit('save', event)
  }
  const confirmSave = (event: MouseEvent) => {
    confirmOpen.value = false
    emit('save', event)
  }
</script>

<template>
  <Transition
    enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
    enter-from-class="translate-y-2 opacity-0"
    leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
    leave-to-class="translate-y-2 opacity-0"
  >
    <SaveBar
      v-if="dirty || saving"
      @save="onSaveShortcut"
    >
      {{ message }}
      <template #actions>
        <Button
          type="button"
          label="Discard"
          variant="outline"
          size="medium"
          :disabled="saving"
          @click="discard"
        />
        <Button
          variant="primary"
          size="medium"
          :loading="saving"
          @click="save"
          aria-keyshortcuts="Meta+S Control+S"
        >
          Save
          <Kbd
            meta
            size="small"
            class="pointer-coarse:hidden!"
            aria-hidden="true"
            >S</Kbd
          >
        </Button>
      </template>
    </SaveBar>
  </Transition>
  <ConfirmDialog
    v-model:open="confirmOpen"
    variant="primary"
    :title="`Change ${count} Deployment ${count === 1 ? 'Setting' : 'Settings'}`"
    :description="confirmDescription"
    confirm-label="Save"
    size="small"
    @confirm="confirmSave"
  />
</template>
