<script setup>
  // Form type: CARDBOX WITH INDEPENDENT SAVES (the `/form` skill, "Form types"). A
  // long configuration page split into CardBox sections where EACH CARD OWNS ITS OWN
  // SAVE — the user commits changes in parts instead of one giant submit. Approach A
  // inside each card. Each card locks INDEPENDENTLY off its own `submitting` flag (the
  // /usability loading pattern, scoped to the saved block): that card's fields and its
  // right-side controls disable and its Save shows loading, while the other cards stay
  // live. The save reports via toast. Each card's name is the
  // CardBox `title` (its Heading, in the header) — never a title inside the content;
  // the card's guidance is a Message (`label` copy). A per-card Save is
  // `secondary` (the page has no primary), and the first card keeps the Azion Toolbar
  // layout (Save in the box footer, with a Learn-more link).
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Label from '@aziontech/webkit/label'
  import Link from '@aziontech/webkit/link'
  import Message from '@aziontech/webkit/message'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref } from 'vue'

  import UnsavedChangesGuard from '../../components/form/UnsavedChangesGuard.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { useBaseline } from '../../lib/behavior/forms'

  // --- Card 1: Azion Toolbar ----------------------------------------------
  const toolbarOptions = [
    { label: 'Default (controlled at the team level)', value: 'default' },
    { label: 'Enabled', value: 'enabled' },
    { label: 'Disabled', value: 'disabled' }
  ]
  const toolbarLabel = (value) =>
    toolbarOptions.find((option) => option.value === value)?.label ?? ''
  const toolbar = reactive({ preprod: 'default', prod: 'default' })
  const savingToolbar = ref(false)
  const toolbarBaseline = useBaseline(toolbar)

  // --- Card 2: Deployment Protection --------------------------------------
  const protectionOptions = [
    { label: 'Standard Protection', value: 'standard' },
    { label: 'Only Preview Deployments', value: 'preview' },
    { label: 'All Deployments', value: 'all' }
  ]
  const protectionLabel = (value) =>
    protectionOptions.find((option) => option.value === value)?.label ?? ''
  const protection = reactive({ level: 'standard', shareableLinks: true })
  const savingProtection = ref(false)
  const protectionBaseline = useBaseline(protection)

  // Each card commits independently through the same one-flag lock.
  const saveCard = async (flag, message, commit) => {
    if (flag.value) return // per-card re-entrancy lock
    flag.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      // Only THIS band's baseline moves: the other one is still pending, and the leave
      // guard below has to keep saying so.
      commit()
      toast.success(message)
    } catch (error) {
      toast.error('Could not save.', {
        description: error?.message ?? 'Check your connection and try again.'
      })
    } finally {
      flag.value = false
    }
  }

  // The leave guard reads the PAGE, not a band: this screen commits in parts, so the
  // reader can leave with one band saved and the other still pending — and that pending
  // one is exactly what the guard exists to stop them from walking away from.
  const dirty = computed(() => toolbarBaseline.dirty.value || protectionBaseline.dirty.value)

  const saveToolbar = () =>
    saveCard(savingToolbar, 'Azion Toolbar settings saved.', toolbarBaseline.commit)
  const saveProtection = () =>
    saveCard(savingProtection, 'Deployment Protection settings saved.', protectionBaseline.commit)
</script>

<template>
  <AppLayout
    active="forms"
    :breadcrumb="[{ label: 'Forms', href: '/forms' }, { label: 'CardBox with independent saves' }]"
  >
    <UnsavedChangesGuard :dirty="dirty" />

    <!-- No `gap` on the stack: every band below owns its own top space via
         `.layout-section-start` (= --layout-boundary-start, the same step
         `.layout-boundary` puts above the heading). -->
    <main class="flex w-full flex-col">
      <PageHeading
        title="Project Settings"
        description="A long configuration page split into cards. Each card owns its own save, so changes commit in parts."
      />

      <!-- Card 1 — Azion Toolbar (title = CardBox Heading; Save in the box footer). -->
      <CardBox
        title="Azion Toolbar"
        class="layout-section-start w-full"
      >
        <template #content>
          <fieldset
            class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
            :disabled="savingToolbar"
          >
            <legend class="sr-only">Azion Toolbar</legend>

            <Message
              severity="info"
              label="Enable the Azion Toolbar on your Deployments. To use the toolbar in production your team members need the Chrome extension or to enable the toolbar for that domain in the toolbar menu."
            />

            <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
              <div class="flex flex-col gap-(--spacing-xs)">
                <Label for="tb-preprod">Pre-Production Deployments</Label>
                <Select
                  v-model="toolbar.preprod"
                  size="large"
                  :disabled="savingToolbar"
                  :display-value="toolbarLabel"
                >
                  <Select.Trigger id="tb-preprod" />
                  <Select.Content>
                    <Select.Option
                      v-for="option in toolbarOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
              </div>
              <div class="flex flex-col gap-(--spacing-xs)">
                <Label for="tb-prod">Production Deployments</Label>
                <Select
                  v-model="toolbar.prod"
                  size="large"
                  :disabled="savingToolbar"
                  :display-value="toolbarLabel"
                >
                  <Select.Trigger id="tb-prod" />
                  <Select.Content>
                    <Select.Option
                      v-for="option in toolbarOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
              </div>
            </div>
          </fieldset>
        </template>
        <template #footer>
          <div class="flex w-full items-center justify-between gap-(--spacing-sm)">
            <Link
              href="#"
              label="Learn more about the Azion Toolbar"
              size="medium"
            />
            <Button
              label="Save"
              kind="secondary"
              size="medium"
              :loading="savingToolbar"
              @click="saveToolbar"
            />
          </div>
        </template>
      </CardBox>

      <!-- Card 2 — Deployment Protection (title = CardBox Heading; its own save). -->
      <CardBox
        title="Deployment Protection"
        class="layout-section-start w-full"
      >
        <template #content>
          <fieldset
            class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
            :disabled="savingProtection"
          >
            <legend class="sr-only">Deployment Protection</legend>

            <Message
              severity="info"
              label="Control who can access your Deployments. Standard Protection challenges every visitor before a Deployment loads; shareable links let you grant bypass access with a generated URL."
            />

            <div class="flex flex-col gap-(--spacing-xs)">
              <Label for="dp-level">Azion Authentication</Label>
              <Select
                v-model="protection.level"
                size="large"
                :disabled="savingProtection"
                class="sm:max-w-(--container-sm)"
                :display-value="protectionLabel"
              >
                <Select.Trigger id="dp-level" />
                <Select.Content>
                  <Select.Option
                    v-for="option in protectionOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </div>

            <div class="flex items-center justify-between gap-(--spacing-md)">
              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <Label id="dp-links-label">Shareable Links</Label>
                <p class="text-body-sm text-(--text-muted)">
                  Allow bypassing protection with a generated link.
                </p>
              </div>
              <Switch
                v-model="protection.shareableLinks"
                aria-labelledby="dp-links-label"
                :disabled="savingProtection"
              />
            </div>
          </fieldset>
        </template>
        <template #footer>
          <div class="flex w-full items-center justify-end gap-(--spacing-sm)">
            <Button
              label="Save"
              kind="secondary"
              size="medium"
              :loading="savingProtection"
              @click="saveProtection"
            />
          </div>
        </template>
      </CardBox>
    </main>
  </AppLayout>
</template>
