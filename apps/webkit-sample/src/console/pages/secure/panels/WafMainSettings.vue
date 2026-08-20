<script setup>
  // WAF Rule → Main Settings. What the rule set is called, whether it is enforcing, and
  // which threat families it inspects for — committed as ONE page.
  //
  // THREE BANDS, ONE SAVE, the rule every internal settings surface in this console
  // follows (../../applications/panels/MainSettings.vue argues it): the bands describe
  // one record, so they commit together from the shared bar, with one `saving` flag and
  // one baseline.
  //
  // THE WAF RULE SET BAND IS A LIST OF PAIRS, not a list of switches. Each family
  // carries a switch AND a sensitivity, because "inspect for SQL injection" is not a
  // decision on its own — how hard it inspects is what decides whether the rule set is
  // usable in production or drowns the Tuning tab in false positives. The two controls
  // sit on one row for that reason: they are one setting with two halves.
  //
  // The sensitivity select is DISABLED while its family is off, rather than hidden. A
  // control that disappears takes its own explanation with it; a disabled one still
  // says "there is a posture here, switch the family on to choose it".
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Switch from '@aziontech/webkit/switch'
  import { reactive, ref } from 'vue'

  import SelectField from '../../../components/form/SelectField.vue'
  import SettingsSaveBar from '../../../components/form/SettingsSaveBar.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import Section from '../../../components/page/Section.vue'
  import { saveGroup, useBaseline } from '../../../lib/behavior/forms'
  import { useTabDirty } from '../../../lib/behavior/tab-dirty'
  import { WAF_MODES, WAF_SENSITIVITIES, wafThreatConfig } from '../../../lib/data/waf-rules'

  const props = defineProps({
    /** The rule set being configured — a seeded row from `lib/data/waf-rules.js`. */
    ruleSet: { type: Object, required: true }
  })

  const settings = reactive({
    name: props.ruleSet.name,
    active: props.ruleSet.status === 'Active',
    mode: props.ruleSet.mode,
    // A copy, not the seed: the tab edits a draft and only the save commits it.
    threats: wafThreatConfig(props.ruleSet)
  })

  const saving = ref(false)
  const { dirty, commit } = useBaseline(settings)

  // `useBaseline` reports dirtiness but does not hand the snapshot back, so the tab
  // keeps its own copy — that copy is what Discard restores.
  const snapshot = ref(JSON.parse(JSON.stringify(settings)))

  const save = () =>
    saveGroup(saving, 'Rule set saved.', () => {
      commit()
      snapshot.value = JSON.parse(JSON.stringify(settings))
    })

  const discard = () => {
    Object.assign(settings, JSON.parse(JSON.stringify(snapshot.value)))
  }

  // The shell marks this tab and asks before letting the reader leave it: the Allowed
  // Rules tab raises a bar in this same strip, and neither tab can see the other's
  // pending work (../../../lib/behavior/tab-dirty.js).
  useTabDirty('main-settings', { dirty, saving }, { label: 'Rule set changed.', save, discard })
</script>

<template>
  <form
    class="flex min-h-full flex-col"
    aria-label="Main settings"
    novalidate
    @submit.prevent="save"
  >
    <div
      class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
    >
      <PageHeading
        title="Main Settings"
        description="How this rule set is identified, and what it inspects requests for."
        size="small"
      />

      <fieldset
        class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
        :disabled="saving"
      >
        <legend class="sr-only">Main settings</legend>

        <Section
          stacked
          anchor
          :divided="false"
          title="General"
          hint="How this rule set is identified across the console."
        >
          <CardBox :padded="false">
            <template #content>
              <Item.List>
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Name</Item.Title>
                    <Item.Description>
                      A unique and descriptive name to identify the rule set.
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions class="max-w-(--container-3xs) flex-1 justify-end">
                    <InputText
                      v-model="settings.name"
                      size="large"
                      :disabled="saving"
                      class="w-full"
                      aria-label="Name"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>
            </template>
          </CardBox>
        </Section>

        <Section
          stacked
          anchor
          :divided="false"
          title="Status"
          hint="Whether the rule set is inspecting traffic, and what it does with what it matches."
        >
          <CardBox :padded="false">
            <template #content>
              <Item.List>
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Active</Item.Title>
                    <Item.Description>
                      When disabled, the rule set stops inspecting requests entirely.
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions class="justify-end">
                    <Switch
                      v-model="settings.active"
                      :disabled="saving"
                      aria-label="Active"
                    />
                  </Item.Actions>
                </Item>
                <Item size="small">
                  <Item.Content>
                    <Item.Title>Mode</Item.Title>
                    <!-- The one field on this page with real blast radius: Learning
                         watches and reports, Blocking rejects the request. Said plainly
                         here because the list's Mode column is where people look for it
                         and this is where they change it. -->
                    <Item.Description>
                      Blocking rejects a matched request. Learning lets it through and records the
                      match on the Tuning tab.
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions class="max-w-(--container-3xs) flex-1 justify-end">
                    <!-- No `label`: the row's Item.Title already names it, and a second
                         label above the control would say "Mode" twice. -->
                    <SelectField
                      v-model="settings.mode"
                      :options="WAF_MODES"
                      size="large"
                      :disabled="saving"
                      placeholder="Select a mode"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>
            </template>
          </CardBox>
        </Section>

        <Section
          stacked
          anchor
          :divided="false"
          title="WAF Rule Set"
          hint="The threat families this rule set inspects for, and how strictly each one is applied."
        >
          <CardBox :padded="false">
            <template #content>
              <Item.List>
                <Item
                  v-for="threat in settings.threats"
                  :key="threat.id"
                  size="small"
                >
                  <Item.Content>
                    <Item.Title>{{ threat.label }}</Item.Title>
                    <Item.Description>{{ threat.hint }}</Item.Description>
                  </Item.Content>
                  <!-- Sensitivity then switch, reading right to left in importance: the
                       switch is the decision and sits closest to the edge, where every
                       other row on this page puts its control. -->
                  <Item.Actions class="items-center justify-end gap-(--spacing-sm)">
                    <SelectField
                      v-model="threat.sensitivity"
                      :options="WAF_SENSITIVITIES"
                      size="medium"
                      :disabled="saving || !threat.enabled"
                      placeholder="Sensitivity"
                      class="w-(--container-3xs)"
                    />
                    <Switch
                      v-model="threat.enabled"
                      :disabled="saving"
                      :aria-label="threat.label"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>
            </template>
          </CardBox>
        </Section>
      </fieldset>
    </div>

    <SettingsSaveBar
      :dirty="dirty"
      :saving="saving"
      :route-guard="false"
      label="Rule set changed."
      hint="Saving applies the new posture to traffic on the next deployment."
      @save="save"
      @discard="discard"
    />
  </form>
</template>
