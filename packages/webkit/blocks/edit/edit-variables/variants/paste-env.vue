<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import PageHeader from '@aziontech/webkit/page-header'
  import { toast } from '@aziontech/webkit/toast'
  import { ref, useId, watch } from 'vue'

  import { provideVariablesForm, useVariablesForm } from '../composables/use-variables-form'
  import { closePastePanel } from '../lib/paste-report'
  import { plural, type VariablesPair } from '../lib/variables-format'
  import EnvPastePanel from '../parts/env-paste-panel.vue'
  import VariablesDrawerForm from '../parts/variables-drawer-form.vue'
  import VariablesEntries from '../parts/variables-entries.vue'
  import VariablesScopeGroup from '../parts/variables-scope-group.vue'
  import { sampleEnv, sampleVariables } from '../sample'

  const form = useVariablesForm({ existingKeys: sampleVariables.map((variable) => variable.key) })
  provideVariablesForm(form)
  const { view } = form

  const drawerOpen = ref(true)
  const submitting = ref(false)
  const pasteId = useId()
  const pasteOpen = ref(false)
  const pasteText = ref('')
  const pasteStatus = ref('')
  const pasteToggleEl = ref<{ $el?: HTMLElement } | null>(null)

  const cancelPaste = () => closePastePanel(pasteOpen, pasteToggleEl)
  const applyPaste = async (_event: MouseEvent, pairs: VariablesPair[]) => {
    if (!pairs.length) return
    form.mergePairs(pairs)
    pasteStatus.value = `${plural(pairs.length, 'variable', 'variables')} added from the pasted text.`
    pasteText.value = ''
    await cancelPaste()
  }

  watch(
    drawerOpen,
    (isOpen) => {
      if (!isOpen) return
      pasteOpen.value = true
      pasteText.value = sampleEnv
      pasteStatus.value = ''
      form.reset([form.createEntry('CACHE_TTL', '120')])
      submitting.value = false
    },
    { immediate: true }
  )

  const submit = async (_event: Event, formEl: HTMLFormElement | null) => {
    if (submitting.value || !(await form.check(formEl))) return
    submitting.value = true
    await new Promise((resolve) => setTimeout(resolve, 900))
    const created = form.drafts()
    submitting.value = false
    drawerOpen.value = false
    toast.success(
      created.length === 1 ? `${created[0].key} created.` : `${created.length} variables created.`
    )
  }
</script>

<template>
  <div class="layout-column layout-boundary flex flex-col">
    <PageHeader
      title="Variables"
      description="Configure variable names, values, and settings for use across your projects."
    >
      <template #actions>
        <Drawer
          v-model:open="drawerOpen"
          size="large"
          side="end"
        >
          <DrawerTrigger>
            <Button
              label="Create variable"
              icon="az az-plus"
              variant="primary"
              size="medium"
            />
          </DrawerTrigger>
          <VariablesDrawerForm
            title="Create variable"
            description="Create one or more variables and define where they are available."
            shortcut-label="Save variable"
            :active="drawerOpen"
            :submitting="submitting"
            @submit="submit"
          >
            <VariablesEntries>
              <template #toolbar>
                <Button
                  ref="pasteToggleEl"
                  label="Paste .env"
                  icon="az az-clipboard"
                  variant="outline"
                  size="medium"
                  :aria-expanded="pasteOpen"
                  :aria-controls="pasteOpen ? `${pasteId}-panel` : undefined"
                  :disabled="view !== 'Form'"
                  @click="pasteOpen = !pasteOpen"
                />
              </template>
              <template #panel>
                <EnvPastePanel
                  v-if="pasteOpen"
                  :id="pasteId"
                  v-model="pasteText"
                  @apply="applyPaste"
                  @cancel="cancelPaste"
                />
                <p
                  class="sr-only"
                  role="status"
                  aria-live="polite"
                >
                  {{ pasteStatus }}
                </p>
              </template>
            </VariablesEntries>
            <VariablesScopeGroup />
          </VariablesDrawerForm>
        </Drawer>
      </template>
    </PageHeader>
  </div>
</template>
