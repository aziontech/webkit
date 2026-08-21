<script setup>
  // PART 3 — THE RELEASE, WHICH IS WHERE THE OTHER TWO PARTS COMBINE.
  //
  // A workload with a domain and no release is an address that answers nothing. This part
  // is what makes the first two mean something: it binds what the domain SERVES.
  //
  // ── THE FIREWALL IS NOT ASKED AGAIN ──
  //
  // The reader answered "protect it" one part ago, so this part does not re-offer it — a
  // second firewall control here would be a second place the same fact lives, and the two
  // would disagree the first time somebody edited one. The answer is SHOWN, read-only,
  // with a way back to the part that owns it — and it is shown in the summary card the
  // wizard already puts above this part (../CreateWorkload.vue), beside the workload row,
  // because both are the same kind of thing: an answer given earlier, projected here.
  // That card is the exact counterpart of the application flow's SourceSummary
  // (../../applications/wizard/SourceSummary.vue), which is one card of projected answers
  // above the part that asks the rest.
  //
  // That is the whole meaning of "combine this into the release": the release is a
  // projection of the parts before it, not a fresh questionnaire.
  //
  // ── WHAT THIS PART ACTUALLY ASKS ──
  //
  // The application (and its version), the environment the binding lands on, and the
  // custom page — the three things nothing earlier in the flow implied. Everything else
  // the endpoint accepts already carries a default and sits in Advanced.
  //
  // ── THE ANATOMY IS THE ONE EVERY OTHER PART USES ──
  //
  // One TITLED CardBox of fields, then the Advanced band — the same shape as the
  // application flow's last part (../../applications/wizard/ConfigureStep.vue) and as
  // part 1 of this one (./WorkloadStep.vue). The fields used to sit in an untitled card
  // inside a `Section` band, which named this group with a page-level <h2> while the card
  // above it was named by its own header: two ways of titling a group, 200px apart, on
  // one screen. A group of fields inside a part is a CARD; `Section` is reserved for the
  // one band that is not a group of fields — the Advanced disclosure.
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import { computed } from 'vue'

  import FieldStack from '../../../components/form/FieldStack.vue'
  import Section from '../../../components/page/Section.vue'
  import { CERTIFICATE_OPTIONS, TLS_VERSION_OPTIONS } from '../../../lib/data/create-resources'
  import { CUSTOM_PAGE_OPTIONS } from '../../../lib/data/deployment-strategies'
  import {
    WORKLOAD_APPLICATIONS,
    WORKLOAD_ENVIRONMENTS,
    WORKLOAD_VERSIONS
  } from '../../../lib/data/workload-flows'
  import { domainForWorkload } from '../../../lib/data/workload-provisioning'
  import { useWorkloadForm } from './form-context'

  defineProps({
    // The flow-wide lock while the commit is in flight.
    disabled: { type: Boolean, default: false }
  })

  const { form, errors } = useWorkloadForm()

  // Stored value → visible label, for every Select here. Without it the trigger prints the
  // raw API value (`tls_1_2` instead of "TLS 1.2").
  const labelFor = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? ''

  // The same derivation the provisioning logs and part 1 narrate, so the domain named in
  // the Advanced flag is the domain the run reports.
  const domain = computed(() => domainForWorkload(form.name))
</script>

<template>
  <!-- NO `gap` on this stack, deliberately — the same reason the application flow's last
       part carries none (../../applications/wizard/ConfigureStep.vue): CardBox renders a
       real `<section>`, so the Advanced band below is not `:first-of-type` and `Section`
       already applies its own `--layout-section-gap` top margin. A flex gap here would be
       added to that one and the disclosure would float a double step below the fields. -->
  <div class="flex min-w-0 flex-col">
    <!-- WHAT THE RELEASE BINDS. The fields nothing earlier implied, each the webkit field
         triad via FieldStack (Label + control + ONE helper region), stacked at the card's
         full measure. -->
    <CardBox title="Release">
      <template #content>
        <div class="flex flex-col gap-(--spacing-lg)">
          <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-[minmax(0,1fr)_10rem]">
            <FieldStack
              label="Application"
              required
              hint="The application this workload serves — until a release is cut, the domain answers nothing. Bindings are per environment, so one workload can serve different applications on Production and Stage."
              :message="errors.application"
              message-kind="required"
            >
              <template #default="{ controlId, describedBy }">
                <Select
                  v-model="form.application"
                  size="large"
                  class="w-full"
                  placeholder="Select an application"
                  :disabled="disabled"
                  :display-value="labelFor(WORKLOAD_APPLICATIONS)"
                >
                  <Select.Trigger
                    :id="controlId"
                    aria-label="Application"
                    :aria-describedby="describedBy"
                  />
                  <Select.Content>
                    <Select.Option
                      v-for="option in WORKLOAD_APPLICATIONS"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
              </template>
            </FieldStack>

            <FieldStack label="Version">
              <template #default="{ controlId }">
                <Select
                  v-model="form.applicationVersion"
                  size="large"
                  class="w-full"
                  :disabled="disabled"
                  :display-value="labelFor(WORKLOAD_VERSIONS)"
                >
                  <Select.Trigger
                    :id="controlId"
                    aria-label="Application version"
                  />
                  <Select.Content>
                    <Select.Option
                      v-for="option in WORKLOAD_VERSIONS"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
              </template>
            </FieldStack>
          </div>

          <FieldStack
            label="Environment"
            hint="Which environment this binding lands on. The domain answers on the environment it is bound to."
          >
            <template #default="{ controlId }">
              <Select
                v-model="form.environment"
                size="large"
                class="w-full"
                :disabled="disabled"
                :display-value="labelFor(WORKLOAD_ENVIRONMENTS)"
              >
                <Select.Trigger
                  :id="controlId"
                  aria-label="Environment"
                />
                <Select.Content>
                  <Select.Option
                    v-for="option in WORKLOAD_ENVIRONMENTS"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </template>
          </FieldStack>
        </div>
      </template>
    </CardBox>

    <!-- ADVANCED — the existing disclosure pattern (a collapsible Section, never an
         Accordion), holding what the endpoint already defaults: the TLS pair, the custom
         page binding, and the two workload flags. -->
    <Section
      stacked
      collapsible
      :divided="false"
      icon="pi pi-cog"
      title="Advanced"
      hint="Every field here already carries the endpoint's own default, and all of them can be changed once the workload exists."
    >
      <!-- ONE card, three GROUPS inside it — the same shape the application flow's
           Advanced band uses (../../applications/wizard/ConfigureStep.vue). Three titled
           boxes stacked here said the TLS pair, the custom page and the two flags were
           three separate bands of the page; they are three groups of ONE band, and the
           band is already titled "Advanced". A group is a heading and its rows: the rule
           above each heading is what separates them, which is what a card border was
           being spent on. -->
      <CardBox :padded="false">
        <template #content>
          <h3
            class="px-(--spacing-md) pb-(--spacing-xs) pt-(--spacing-md) text-label-sm text-(--text-muted)"
          >
            TLS
          </h3>
          <div
            class="grid grid-cols-1 gap-(--spacing-lg) px-(--spacing-md) pb-(--spacing-md) sm:grid-cols-2"
          >
            <FieldStack
              label="Certificate"
              hint="One certificate per workload. It is a property of the workload, not of a domain on it."
            >
              <template #default="{ controlId }">
                <Select
                  v-model="form.certificate"
                  size="large"
                  class="w-full"
                  :disabled="disabled"
                  :display-value="labelFor(CERTIFICATE_OPTIONS)"
                >
                  <Select.Trigger
                    :id="controlId"
                    aria-label="Certificate"
                  />
                  <Select.Content>
                    <Select.Option
                      v-for="option in CERTIFICATE_OPTIONS"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
              </template>
            </FieldStack>

            <FieldStack
              label="Minimum TLS version"
              hint="Connections negotiating below this version are refused."
            >
              <template #default="{ controlId }">
                <Select
                  v-model="form.minimumTlsVersion"
                  size="large"
                  class="w-full"
                  :disabled="disabled"
                  :display-value="labelFor(TLS_VERSION_OPTIONS)"
                >
                  <Select.Trigger
                    :id="controlId"
                    aria-label="Minimum TLS version"
                  />
                  <Select.Content>
                    <Select.Option
                      v-for="option in TLS_VERSION_OPTIONS"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
              </template>
            </FieldStack>
          </div>

          <!-- NO group heading over this one: "Custom page" above a field labelled
               "Custom page" is a heading for a heading — the same reason the firewall
               card leaves its single switch unheaded
               (../../../components/firewall/FirewallBinding.vue). The rule above is what
               separates it from the TLS pair. -->
          <div class="border-t border-(--border-default) p-(--spacing-md)">
            <FieldStack
              label="Custom page"
              hint="What the workload serves for an error or a maintenance window. Optional. Without one, the workload falls back to Azion's own pages."
            >
              <template #default="{ controlId }">
                <Select
                  v-model="form.customPage"
                  size="large"
                  class="w-full"
                  placeholder="Not bound"
                  :disabled="disabled"
                  :display-value="labelFor(CUSTOM_PAGE_OPTIONS)"
                >
                  <Select.Trigger
                    :id="controlId"
                    aria-label="Custom page"
                  />
                  <Select.Content>
                    <Select.Option
                      v-for="option in CUSTOM_PAGE_OPTIONS"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
              </template>
            </FieldStack>
          </div>

          <!-- The two workload-level flags, last inside the disclosure: the fields almost
               nobody touches at creation time. Each row is an Item — the Item.Title IS
               the name, guidance goes in Item.Description, the switch sits right in
               Item.Actions. -->
          <h3
            class="border-t border-(--border-default) px-(--spacing-md) pb-(--spacing-xs) pt-(--spacing-md) text-label-sm text-(--text-muted)"
          >
            Behavior
          </h3>
          <Item.List>
            <Item size="small">
              <Item.Content>
                <Item.Title>Allow the Azion domain</Item.Title>
                <Item.Description>
                  Serve traffic on the provisioned {{ domain || 'Azion domain' }}. Turn it off once
                  your own domain answers instead.
                </Item.Description>
              </Item.Content>
              <Item.Actions class="justify-end">
                <Switch
                  v-model="form.allowAzionDomain"
                  aria-label="Allow the Azion domain"
                  :disabled="disabled"
                />
              </Item.Actions>
            </Item>
            <Item size="small">
              <Item.Content>
                <Item.Title>Active</Item.Title>
                <Item.Description>
                  When disabled, the workload is created but does not serve traffic.
                </Item.Description>
              </Item.Content>
              <Item.Actions class="justify-end">
                <Switch
                  v-model="form.active"
                  aria-label="Active"
                  :disabled="disabled"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </CardBox>
    </Section>
  </div>
</template>
