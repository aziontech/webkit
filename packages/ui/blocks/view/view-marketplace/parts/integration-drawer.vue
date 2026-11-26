<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import DrawerContent from '@aziontech/ui/drawer-content'
  import Drawer from '@aziontech/ui/drawer-root'
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import Field from '@aziontech/ui/field'
  import KeyValueList from '@aziontech/ui/key-value-list'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import Select from '@aziontech/ui/select'
  import { computed, ref } from 'vue'

  import type { MarketplaceIntegration } from '../view-marketplace.vue'

  export interface IntegrationDrawerRun {
    /** idle, running, succeeded or failed. */
    state: string
    /** The application of the last run. */
    application: string
    /** Why the last run failed. */
    reason: string
  }

  export interface IntegrationDrawerProps {
    /** The integration the drawer shows. */
    integration: MarketplaceIntegration
    /** Display text of where it runs. */
    contextLabel: string
    /** The applications it can still be installed on. */
    available: string[]
    /** The install request is in flight. */
    installing?: boolean
    /** The application field shows its error. */
    invalid?: boolean
    /** The last install run. */
    run: IntegrationDrawerRun
  }

  const props = withDefaults(defineProps<IntegrationDrawerProps>(), {
    installing: false,
    invalid: false
  })

  const emit = defineEmits<{
    submit: [event: Event]
  }>()

  const open = defineModel<boolean>('open', { default: false })
  const application = defineModel<string>('application', { default: '' })

  const installEl = ref<HTMLElement | null>(null)

  const submitLabel = computed(() =>
    props.run.state === 'failed' && application.value === props.run.application
      ? 'Reinstall'
      : 'Install'
  )

  const chooseApplication = () =>
    installEl.value?.querySelector<HTMLElement>('[role="combobox"], button')?.focus()
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="end"
  >
    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        :aria-label="`Install ${integration.name}`"
        novalidate
        @submit.prevent="(event: Event) => emit('submit', event)"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 items-center gap-(--spacing-sm)">
            <span
              class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
            >
              <i
                :class="integration.logo"
                class="text-body-lg leading-none text-(--text-default)"
                aria-hidden="true"
              />
            </span>
            <div
              class="flex min-w-0 flex-col outline-none"
              tabindex="-1"
              data-autofocus
            >
              <DrawerTitle>{{ integration.name }}</DrawerTitle>
              <span class="text-body-xs text-(--text-muted)"
                >by <bdi>{{ integration.vendor }}</bdi></span
              >
            </div>
          </div>
        </PanelHeader>

        <PanelBody>
          <div class="flex flex-col gap-(--layout-section-gap)">
            <Alert
              key="alert-1"
              v-if="run.state === 'succeeded'"
              severity="success"
              :label="`${integration.name} is installed on ${run.application}. It runs from the next request.`"
            />
            <Alert
              key="alert-2"
              v-else-if="run.state === 'failed'"
              severity="danger"
              :label="`${integration.name} wasn't installed on ${run.application}. ${run.reason}`"
              :action-label="available.length ? 'Choose another application' : ''"
              @action="chooseApplication"
            />

            <p class="m-0 text-body-sm text-(--text-muted)">{{ integration.description }}</p>

            <KeyValueList
              :columns="2"
              aria-label="Integration details"
            >
              <KeyValueList.Item label="Publisher"
                ><bdi>{{ integration.vendor }}</bdi></KeyValueList.Item
              >
              <KeyValueList.Item label="Category">{{ integration.category }}</KeyValueList.Item>
              <KeyValueList.Item label="Context">{{ contextLabel }}</KeyValueList.Item>
              <KeyValueList.Item label="Version">{{ integration.version }}</KeyValueList.Item>
              <KeyValueList.Item label="Updated">{{ integration.updated }}</KeyValueList.Item>
              <KeyValueList.Item label="Installed on">{{
                integration.installedOn.length
                  ? integration.installedOn.join(', ')
                  : 'Not installed'
              }}</KeyValueList.Item>
            </KeyValueList>

            <section
              class="flex flex-col gap-(--layout-group-gap)"
              aria-labelledby="integration-overview"
            >
              <h3
                id="integration-overview"
                class="text-heading-2xs text-(--text-default)"
              >
                Overview
              </h3>
              <p class="m-0 text-body-sm text-(--text-default)">
                Installing adds a function instance to the application you choose and one rule that
                runs it. Its settings can be changed at any time from Configure.
              </p>
            </section>

            <section
              class="flex flex-col gap-(--layout-group-gap)"
              aria-labelledby="integration-permissions"
            >
              <h3
                id="integration-permissions"
                class="text-heading-2xs text-(--text-default)"
              >
                Permissions
              </h3>
              <ul class="m-0 flex list-none flex-col gap-(--spacing-sm) p-0">
                <li
                  v-for="permission in [
                    'Read the application’s rules',
                    'Add a function instance to the application',
                    'Add one rule that runs the function'
                  ]"
                  :key="permission"
                  class="flex items-center gap-(--spacing-sm) text-body-sm text-(--text-muted)"
                >
                  <i
                    class="az az-check shrink-0 text-(--success-foreground)"
                    aria-hidden="true"
                  />
                  {{ permission }}
                </li>
              </ul>
            </section>

            <section
              ref="installEl"
              class="flex flex-col gap-(--layout-group-gap)"
              aria-labelledby="integration-install"
            >
              <h3
                id="integration-install"
                class="text-heading-2xs text-(--text-default)"
              >
                {{ integration.installedOn.length ? 'Install on another application' : 'Install' }}
              </h3>
              <Field
                v-if="available.length"
                :invalid="invalid"
                :disabled="installing"
                required
              >
                <Field.Label>Application</Field.Label>
                <Select
                  v-model="application"
                  size="medium"
                  placeholder="Select an application"
                >
                  <Select.Trigger class="w-full" />
                  <Select.Content>
                    <Select.Item
                      v-for="app in available"
                      :key="app"
                      :value="app"
                      >{{ app }}</Select.Item
                    >
                  </Select.Content>
                </Select>
                <Field.Error v-if="invalid">
                  Select the application to install {{ integration.name }} on.
                </Field.Error>
                <Field.Description v-else>
                  The integration runs on every request to this application.
                </Field.Description>
              </Field>
              <p
                v-else
                class="m-0 text-body-sm text-(--text-muted)"
              >
                {{ integration.name }} is installed on every application.
              </p>
            </section>
          </div>
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
            <Button
              v-if="integration.installedOn.length"
              label="Configure"
              icon="az az-settings"
              variant="outline"
              size="medium"
              :href="`/marketplace/${integration.id}/configure`"
            />
            <Button
              key="button-2"
              v-if="available.length"
              :label="submitLabel"
              variant="primary"
              size="medium"
              type="submit"
              :loading="installing"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
