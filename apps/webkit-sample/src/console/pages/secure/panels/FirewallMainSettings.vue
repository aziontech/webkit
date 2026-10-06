<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref } from 'vue'

  import FieldRow from '../../../components/form/FieldRow.vue'
  import SettingsSaveBar from '../../../components/form/SettingsSaveBar.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import Section from '../../../components/page/Section.vue'
  import { useTabDirty } from '../../../lib/behavior/tab-dirty'
  import { FIREWALL_MODULE_FIELDS } from '../../../lib/data/firewalls'
  import { productFirstUse } from '../../../lib/data/product-empty-states'

  interface Props {
    firewall: Record<string, unknown>
  }

  const props = defineProps<Props>()

  const HELP = productFirstUse('firewall').learnMore.href

  const seed = () => ({
    name: props.firewall.name,
    active: props.firewall.status !== 'Inactive',
    debugRules: Boolean(props.firewall.debugRules),
    modules: Object.fromEntries(
      FIREWALL_MODULE_FIELDS.map((field) => [
        field.key,
        field.locked || (props.firewall.modules ?? []).includes(field.key)
      ])
    )
  })

  const form = reactive(seed())
  let saved = JSON.stringify(form)

  const dirty = computed(() => JSON.stringify(form) !== saved)
  const saving = ref(false)

  const save = async () => {
    if (saving.value) return
    saving.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 700))
      saved = JSON.stringify(form)
      toast.success(`${form.name} saved.`)
    } catch (error) {
      toast.error('Could not save the firewall.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => save() }
      })
    } finally {
      saving.value = false
    }
  }

  const discard = () => Object.assign(form, JSON.parse(saved))

  useTabDirty(
    'firewall-main-settings',
    { dirty, saving },
    { label: 'Settings changed.', save, discard }
  )
</script>

<template>
  <div class="flex min-w-0 flex-1 flex-col">
    <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col pb-0">
      <PageHeading
        title="Settings"
        description="Core configuration for this firewall."
        size="small"
        :documentation="HELP"
      />

      <section class="layout-section-start flex min-w-0 flex-1 flex-col pb-(--layout-boundary-end)">
        <Section
          stacked
          :divided="false"
          title="General"
        >
          <CardBox :padded="false">
            <template #content>
              <Item.List>
                <FieldRow
                  title="Name"
                  description="Give a unique and descriptive name to identify this firewall."
                >
                  <InputText
                    v-model="form.name"
                    size="large"
                    class="w-full"
                    aria-label="Name"
                    autocomplete="off"
                  />
                </FieldRow>
                <FieldRow
                  kind="compact"
                  title="Application"
                  description="The application this firewall runs in front of."
                >
                  <span class="text-body-md text-(--text-default)">
                    {{ firewall.application || '—' }}
                  </span>
                </FieldRow>
              </Item.List>
            </template>
          </CardBox>
        </Section>

        <Section
          stacked
          :divided="false"
          title="Modules"
          hint="A module is what makes a rule act: WAF is what a Set WAF Rule Set behavior applies, Functions is what Run Function runs."
        >
          <CardBox :padded="false">
            <template #content>
              <Item.List>
                <FieldRow
                  v-for="field in FIREWALL_MODULE_FIELDS"
                  :key="field.key"
                  kind="compact"
                  :title="field.title"
                  :description="field.description"
                >
                  <Tooltip
                    v-if="field.locked"
                    text="DDoS Protection is always on, on every firewall."
                  >
                    <span class="flex">
                      <Switch
                        :model-value="true"
                        :aria-label="field.title"
                        disabled
                      />
                    </span>
                  </Tooltip>
                  <Switch
                    v-else
                    v-model="form.modules[field.key]"
                    :aria-label="field.title"
                  />
                </FieldRow>
              </Item.List>
            </template>
          </CardBox>
        </Section>

        <Section
          stacked
          :divided="false"
          title="Debug Rules"
          hint="Query the logged executions with Data Stream, Real-Time Events, or the Real-Time Events GraphQL API."
        >
          <CardBox :padded="false">
            <template #content>
              <Item.List>
                <FieldRow
                  kind="compact"
                  title="Active"
                  description="Logs which rules ran for a request, under the Straceback field in Data Stream and Real-Time Events."
                >
                  <Switch
                    v-model="form.debugRules"
                    aria-label="Debug Rules"
                  />
                </FieldRow>
              </Item.List>
            </template>
          </CardBox>
        </Section>

        <Section
          stacked
          :divided="false"
          title="Status"
        >
          <CardBox :padded="false">
            <template #content>
              <Item.List>
                <FieldRow
                  kind="compact"
                  title="Active"
                  description="An inactive firewall stops evaluating rules."
                >
                  <Switch
                    v-model="form.active"
                    aria-label="Active"
                  />
                </FieldRow>
              </Item.List>
            </template>
          </CardBox>
        </Section>
      </section>
    </div>

    <SettingsSaveBar
      :dirty="dirty"
      :saving="saving"
      @save="save"
      @discard="discard"
    />
  </div>
</template>
