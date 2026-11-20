<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Field from '@aziontech/webkit/field'
  import InputGroupAddon from '@aziontech/webkit/input-group-addon'
  import InputGroupInput from '@aziontech/webkit/input-group-input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import { onMounted, ref } from 'vue'

  import CreateDeployTemplate from '../create-deploy-template.vue'

  const scopes: SelectOptionItem[] = [
    { label: 'jane-doe', value: 'jane-doe' },
    { label: 'acme', value: 'acme' },
    { label: 'acme-templates', value: 'acme-templates' }
  ]

  const scope = ref('jane-doe')
  const repoName = ref('nuxt-ecommerce')
  const isPublic = ref(true)
  const repoNameError = ''

  const guard = useUnsavedChanges(() => ({
    scope: scope.value,
    repoName: repoName.value,
    isPublic: isPublic.value
  }))
  const discardDialog = guard.dialogProps
  const discardLabels = guard.labels

  const onLeave = () => guard.confirmLeave()

  const panelEl = ref<HTMLElement | null>(null)

  onMounted(() =>
    panelEl.value
      ?.querySelector<HTMLElement>(
        '[role="combobox"], input:not([type="hidden"]), textarea, select'
      )
      ?.focus()
  )
</script>

<template>
  <CreateDeployTemplate @back="onLeave">
    <div
      ref="panelEl"
      data-phase="form"
      class="flex w-full flex-col items-center gap-(--spacing-xl)"
    >
      <Card class="w-full">
        <template #default>
          <div class="flex flex-col gap-(--spacing-lg)">
            <div class="flex flex-col gap-(--spacing-2xs)">
              <h2 class="text-heading-xs text-(--text-default)">Deploy your project</h2>
              <p class="text-body-sm text-pretty text-(--text-muted)">
                This repository deploys on every push, automatically.
              </p>
            </div>

            <div class="grid grid-cols-1 items-start gap-(--spacing-lg) sm:grid-cols-2">
              <Field>
                <Field.Label>Scope</Field.Label>
                <Select
                  v-model="scope"
                  size="large"
                  placeholder="Select a scope"
                >
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item
                      v-for="option in scopes"
                      :key="String(option.value)"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Item>
                  </Select.Content>
                </Select>
              </Field>

              <Field
                required
                :invalid="Boolean(repoNameError)"
              >
                <Field.Label for="repoName">
                  {{ isPublic ? 'Public repository name' : 'Private repository name' }}
                </Field.Label>
                <InputGroupRoot size="large">
                  <InputGroupInput
                    id="repoName"
                    v-model="repoName"
                    placeholder="my-repository"
                  />
                  <InputGroupAddon>
                    <Tooltip content="Repository visibility">
                      <Switch
                        v-model="isPublic"
                        variant="privacy"
                        aria-label="Public repository"
                      />
                    </Tooltip>
                  </InputGroupAddon>
                </InputGroupRoot>
                <Field.Error v-if="repoNameError">{{ repoNameError }}</Field.Error>
              </Field>
            </div>

            <div
              class="flex flex-col gap-(--spacing-lg)"
              aria-busy="true"
            >
              <div
                v-for="row in 3"
                :key="row"
                class="flex flex-col gap-(--spacing-xs)"
                aria-hidden="true"
              >
                <Skeleton
                  width="30%"
                  height="var(--size-4)"
                />
                <Skeleton height="var(--size-10)" />
                <Skeleton
                  width="55%"
                  height="var(--size-3)"
                />
              </div>
              <span
                class="sr-only"
                role="status"
              >
                Loading the template settings.
              </span>
            </div>
          </div>
        </template>

        <template #footer>
          <Button
            class="w-full"
            label="Deploy"
            variant="primary"
            size="large"
            disabled
          />
        </template>
      </Card>

      <Button
        label="Browse templates"
        variant="outline"
        size="medium"
      />
    </div>
  </CreateDeployTemplate>
  <ConfirmDialog
    v-bind="discardDialog"
    data-testid="unsaved-changes-dialog"
  >
    <template #actions>
      <Button
        :label="discardLabels.keepEditing"
        variant="ghost"
        size="medium"
        data-autofocus
        @click="guard.keepEditing"
      />
      <Button
        :label="discardLabels.discard"
        variant="danger"
        size="medium"
        @click="guard.discardAndLeave"
      />
    </template>
  </ConfirmDialog>
</template>
