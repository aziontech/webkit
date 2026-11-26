<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import Tabs from '@aziontech/webkit/tabs'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref } from 'vue'

  import {
    type DeployableDomainRow,
    sampleDeployableResource as record,
    sampleDeployableTabs as tabs
  } from '../sample'
  import { provideDeployableSettings } from '../use-deployable-settings'
  import DeployableAdvancedGroup from './deployable-advanced-group.vue'
  import DeployableDomainsGroup from './deployable-domains-group.vue'
  import DeployableEnvironmentSwitcher from './deployable-environment-switcher.vue'
  import SettingsSaveBar from './settings-save-bar.vue'

  const activeTab = ref('settings')

  const { form, saving, dirty, save, discard, nameError, removeDomain, leave } =
    provideDeployableSettings()

  const shownTab = computed({
    get: () => activeTab.value,
    set: async (value: string) => {
      if (!value || value === activeTab.value) return
      if (!(await leave.confirmLeave())) return
      activeTab.value = value
    }
  })

  const deleteOpen = ref(false)
  const deleting = ref(false)

  const confirmDelete = () => {
    if (deleting.value) return
    deleting.value = true
    setTimeout(() => {
      deleting.value = false
      deleteOpen.value = false
    }, 900)
  }

  const pendingDomain = ref<DeployableDomainRow | null>(null)
  const domainDeleteOpen = ref(false)

  const onDomainRemove = (_event: Event, row: DeployableDomainRow) => {
    pendingDomain.value = row
    domainDeleteOpen.value = true
  }

  const confirmDomainDelete = () => {
    const removed = pendingDomain.value
    if (!removed) return
    removeDomain(removed.id)
    domainDeleteOpen.value = false
    toast.success(`${removed.domain} deleted.`)
  }
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <DeployableEnvironmentSwitcher />
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="shownTab">
        <Tabs.Trigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
        <template #actions>
          <Button
            label="Deploy"
            variant="outline"
            size="medium"
            icon="az az-cloud-upload"
          />
        </template>
      </PageTabs>
    </div>

    <section class="min-h-0 flex-1">
      <div>
        <div
          class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
        >
          <PageHeader
            title="Settings"
            description="Manage this resource’s configuration."
            size="small"
          />

          <form
            class="mt-(--layout-section-gap) flex min-w-0 flex-col"
            aria-label="Resource settings"
            novalidate
            @submit.prevent="save"
          >
            <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0">
              <legend class="sr-only">Resource settings</legend>

              <SettingsGroup
                label="General"
                hint="How this resource is identified across the platform, and whether it answers at all."
                anchor="general"
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        title="Name"
                        description="A unique and descriptive name to identify the resource."
                      >
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <Input
                            id="resource-name"
                            v-model="form.name"
                            size="large"
                            class="w-full"
                            aria-label="Name"
                            :readonly="saving"
                            required
                            :invalid="nameError"
                            :aria-describedby="nameError ? 'resource-name-message' : undefined"
                          />
                          <FieldError
                            v-if="nameError"
                            id="resource-name-message"
                            >This field is required.</FieldError
                          >
                        </div>
                      </SettingsRow>
                      <SettingsRow
                        title="Active"
                        description="When disabled, the resource stops answering and traffic to its domains is refused. Its deployments are kept."
                        variant="compact"
                      >
                        <Switch
                          v-model="form.active"
                          aria-label="Active"
                          :readonly="saving"
                        />
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsGroup>

              <DeployableDomainsGroup @remove="onDomainRemove" />

              <DeployableAdvancedGroup />

              <SettingsGroup
                label="Danger zone"
                hint="Actions that cannot be undone."
                anchor="danger-zone"
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        title="Delete this resource"
                        description="Once deleted, the resource and its deployments cannot be recovered."
                        variant="compact"
                      >
                        <ConfirmDialog
                          v-model:open="deleteOpen"
                          title="Delete resource"
                          size="medium"
                          confirm-label="Delete resource"
                          :confirmation-phrase="record.name"
                          :loading="deleting"
                          @confirm="confirmDelete"
                        >
                          <template #trigger>
                            <Button
                              type="button"
                              label="Delete resource"
                              variant="danger"
                              size="medium"
                              icon="az az-trash"
                              :disabled="saving"
                            />
                          </template>
                          <div class="flex flex-col gap-(--spacing-md)">
                            <Alert
                              severity="warning"
                              label="Once confirmed, this action can't be reversed."
                            />
                            <p class="m-0 text-body-sm text-(--text-muted)">
                              The resource will be deleted, along with its domains and deployments.
                            </p>
                          </div>
                        </ConfirmDialog>
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsGroup>
            </fieldset>
          </form>
        </div>
      </div>
    </section>

    <SettingsSaveBar
      :visible="dirty || saving"
      :guard="leave"
      :saving="saving"
      @save="save"
      @discard="discard"
    >
      You have unsaved changes.
    </SettingsSaveBar>
    <ConfirmDialog
      v-model:open="domainDeleteOpen"
      title="Delete domain"
      size="medium"
      confirm-label="Delete domain"
      @confirm="confirmDomainDelete"
    >
      <p class="m-0 text-body-sm text-(--text-muted)">
        {{ pendingDomain?.domain }} is removed from this resource and stops answering for it.
      </p>
    </ConfirmDialog>
  </div>
</template>
