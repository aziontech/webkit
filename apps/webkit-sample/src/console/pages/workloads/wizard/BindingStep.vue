<script setup>
  // PART 2 — THE ADDRESS, AND WHAT SERVES IT.
  //
  // The last part, because it is the one that binds the part before it. Part 1 settled what
  // the workload serves; this one gives it a public address, says which environment and
  // certificate answer on it, and picks the deployment the first release lands in.
  //
  // ── WHY THE DOMAIN IS A CHOICE NOW ──
  //
  // The old flow had no domain question at all: the first part asked for a NAME and the
  // Azion domain fell out of it. That is true and it is also the whole story only for readers who
  // are happy on the Azion domain. Anyone bringing their own hostname had to create the
  // workload on a domain they did not want and add theirs afterwards from the workload's own
  // page — a second trip for the single most common thing a workload is for.
  //
  // So the address is asked directly, in two branches. The Azion branch is a PREFIX and the
  // suffix is shown, not typed. The custom branch is a full hostname — and it needs a second
  // field, because when the address is not derived from a name there is no name.
  //
  // ── NAMES CASCADE FROM WHICHEVER FIELD THAT IS ──
  //
  // The workload's name, the deployment created for it, and the domain all come from one
  // string (../../../lib/data/workload-flows.js → `workloadNamesFromForm`). The reader types
  // it once and reads back every name the commit will use. That is what the address box
  // under the field is for: the domain is a CONSEQUENCE of what they typed, and prose
  // describing the rule would make them derive it themselves.
  //
  // ── THE ANATOMY IS THE ONE EVERY OTHER PART USES ──
  //
  // Titled CardBoxes for the groups, then the Advanced band — the same shape as part 1 here
  // and as the application flow's last part
  // (../../applications/wizard/ConfigureStep.vue). `Section` is reserved for the one band
  // that is not a group of fields: the Advanced disclosure.
  import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import { computed } from 'vue'

  import FieldStack from '../../../components/form/FieldStack.vue'
  import Section from '../../../components/page/Section.vue'
  import ResourcePicker from '../../../components/resource/ResourcePicker.vue'
  import { CERTIFICATE_OPTIONS, TLS_VERSION_OPTIONS } from '../../../lib/data/create-resources'
  import { CUSTOM_PAGE_OPTIONS } from '../../../lib/data/deployment-strategies'
  import {
    WORKLOAD_DEPLOYMENTS,
    WORKLOAD_ENVIRONMENTS,
    workloadNamesFromForm
  } from '../../../lib/data/workload-flows'
  import { AZION_DOMAIN_SUFFIX } from '../../../lib/data/workload-provisioning'
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

  const DOMAIN_TYPES = [
    { label: 'Free Azion domain', value: 'azion' },
    { label: 'Your own domain', value: 'own' }
  ]

  const DEPLOYMENT_MODES = [
    { label: 'Create one', value: 'auto' },
    { label: 'Use existing', value: 'existing' }
  ]

  const isAzionDomain = computed(() => form.domainType !== 'own')
  const isExistingDeployment = computed(() => form.deploymentMode === 'existing')

  // The whole cascade, read through the one derivation the summary and the run also read.
  const names = computed(() => workloadNamesFromForm(form))
</script>

<template>
  <!-- NO `gap` on this stack, deliberately — the same reason the application flow's last
       part carries none (../../applications/wizard/ConfigureStep.vue): CardBox renders a
       real `<section>`, so the Advanced band below is not `:first-of-type` and `Section`
       already applies its own `--layout-section-gap` top margin. A flex gap here would be
       added to that one and the disclosure would float a double step below the fields. -->
  <div class="flex min-w-0 flex-col">
    <!-- THE ADDRESS. `padded="false"` with the inset on the groups inside, so the rule
         above the derived address spans the card edge to edge. -->
    <CardBox
      :padded="false"
      title="Domain"
    >
      <template #content>
        <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
          <!-- WHICH OF THE TWO. A segmented control and not two cards: one question with
               two answers, and the answer decides what the rest of this card asks. -->
          <SegmentedButton
            v-model="form.domainType"
            :options="DOMAIN_TYPES"
            size="large"
            fluid
            aria-label="Where the domain comes from"
          />

          <!-- AZION — a PREFIX, not a hostname. The suffix is fixed, so it is shown on the
               field rather than typed into it: a reader who types the whole thing would
               produce `my-app.azion.run.azion.run`, and a field that
               accepts that and silently fixes it is a field that lied about its format. -->
          <FieldStack
            v-if="isAzionDomain"
            label="Domain prefix"
            required
            hint="Azion provides the domain and its certificate. The prefix is what makes it yours, and it names the workload and its deployment too."
            description="Lowercase letters, numbers and hyphens. Anything else is folded into a hyphen."
            :message="errors.domainPrefix"
            message-kind="required"
          >
            <template #default="{ controlId, describedBy }">
              <InputText
                :id="controlId"
                v-model="form.domainPrefix"
                size="large"
                class="w-full"
                placeholder="my-first-app"
                autocomplete="off"
                :disabled="disabled"
                :required="!!errors.domainPrefix"
                :aria-describedby="describedBy"
              >
                <!-- The suffix rides in the field's trailing slot, muted and
                     `aria-hidden`: it is not part of the value, and a screen reader
                     reading it as one would report an address the input does not hold.
                     The full address is spoken by the box below, which is the value. -->
                <template #iconRight>
                  <span
                    class="whitespace-nowrap text-label-sm text-(--text-muted)"
                    aria-hidden="true"
                  >
                    {{ AZION_DOMAIN_SUFFIX }}
                  </span>
                </template>
              </InputText>
            </template>
          </FieldStack>

          <!-- OWN — the full hostname, and a NAME beside it. When the address is not
               derived from a name there is no name, and the workload still needs one for
               every list it appears in. Two fields, because they are two facts: the
               hostname is what DNS points at, the name is what the console calls it. -->
          <template v-else>
            <FieldStack
              label="Domain"
              required
              hint="The hostname that points at this workload. Add the DNS record after the workload exists — the run does not wait on it."
              description="A full hostname, like www.example.com."
              :message="errors.domainHost"
              message-kind="required"
            >
              <template #default="{ controlId, describedBy }">
                <InputText
                  :id="controlId"
                  v-model="form.domainHost"
                  size="large"
                  class="w-full"
                  placeholder="www.example.com"
                  autocomplete="off"
                  :disabled="disabled"
                  :required="!!errors.domainHost"
                  :aria-describedby="describedBy"
                />
              </template>
            </FieldStack>

            <FieldStack
              label="Name"
              required
              hint="Identifies the workload in every list. It also names the deployment created for it."
              description="Lowercase letters, numbers and hyphens."
              :message="errors.name"
              message-kind="required"
            >
              <template #default="{ controlId, describedBy }">
                <InputText
                  :id="controlId"
                  v-model="form.name"
                  size="large"
                  class="w-full"
                  placeholder="my-first-app"
                  autocomplete="off"
                  :disabled="disabled"
                  :required="!!errors.name"
                  :aria-describedby="describedBy"
                />
              </template>
            </FieldStack>
          </template>
        </div>

        <!-- THE ADDRESS THAT PRODUCES. A read-only consequence, not a field — so it is
             framed as a value the reader can copy their eyes over, with the protocol shown
             so it reads as the address it is rather than as a hostname fragment. The same
             treatment part 1 of this flow used to give it, kept where the address is now
             actually decided. -->
        <div
          class="flex flex-col gap-(--spacing-xs) border-t border-(--border-default) p-(--spacing-md)"
        >
          <p class="text-label-sm text-(--text-default)">Traffic arrives on</p>
          <div
            :data-empty="!names.domain || null"
            class="flex min-h-10 min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) data-[empty]:border-dashed"
          >
            <i
              class="pi pi-globe shrink-0 text-(--text-muted)"
              aria-hidden="true"
            />
            <span
              v-if="names.domain"
              class="min-w-0 truncate text-label-sm text-(--text-default)"
            >
              https://{{ names.domain }}
            </span>
            <span
              v-else
              class="text-label-sm text-(--text-muted)"
            >
              {{
                isAzionDomain
                  ? 'Type a prefix to see the domain.'
                  : 'Type a hostname to see the address.'
              }}
            </span>
          </div>
          <p class="text-label-sm text-(--text-muted)">
            The workload is created as
            <span class="text-(--text-default)">{{ names.workload || 'unnamed' }}</span
            >. Add more domains to it once it exists.
          </p>
        </div>
      </template>
    </CardBox>

    <!-- WHAT ANSWERS ON IT. Two answers that are properties of the workload rather than of
         the address: which environment the binding lands on, and which certificate serves
         the connection. The certificate used to sit in Advanced, which put the one field
         that decides whether HTTPS works at all behind a disclosure. -->
    <CardBox
      title="Environment and certificate"
      class="mt-(--layout-section-gap)"
    >
      <template #content>
        <div class="flex flex-col gap-(--spacing-lg)">
          <!-- THE ENVIRONMENT IS A RADIO BOX GRID, not a dropdown. There are two of them
               and they are not interchangeable — one is live and one is a rehearsal on a
               different hostname — so the choice is worth SEEING, with the sentence that
               tells them apart on the card. A Select spent a click to reveal two words and
               then hid the answer's meaning behind the trigger; the grid is the same
               control the rest of this console reaches for when a small enumeration has to
               be understood rather than merely picked
               (../../../components/application/ApplicationLayer.vue → connector type).
               `group` on the field because a radiogroup cannot be the target of a
               `<label for>`: the name is handed to it by id instead. -->
          <FieldStack
            group
            label="Environment"
            hint="Which environment this binding lands on. The domain answers on the environment it is bound to."
          >
            <template #default="{ labelId, describedBy }">
              <BoxGridSelection
                v-model="form.environment"
                :items="WORKLOAD_ENVIRONMENTS"
                :disabled="disabled"
                :aria-labelledby="labelId"
                :aria-describedby="describedBy"
                class="[&>*]:grow [&>*]:basis-(--container-3xs)"
              />
            </template>
          </FieldStack>

          <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
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
          </div>
        </div>
      </template>
    </CardBox>

    <!-- WHERE THE FIRST RELEASE LANDS. The same existing-or-new question the two resource
         parts asked, on the one resource this part owns — so the reader meets the grammar a
         third time rather than a third grammar. "Create one" is the default because a
         workload's first release almost never belongs in a deployment that already has one. -->
    <CardBox
      :padded="false"
      title="Deployment"
      class="mt-(--layout-section-gap)"
    >
      <template #content>
        <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md) pb-0">
          <p class="text-body-sm text-(--text-muted)">
            The deployment settings the first release is cut against — what it binds, and how
            versions are promoted into it.
          </p>

          <SegmentedButton
            v-model="form.deploymentMode"
            :options="DEPLOYMENT_MODES"
            size="large"
            fluid
            aria-label="Where the deployment comes from"
          />
        </div>

        <!-- AUTO — nothing to ask, so nothing is asked. What the reader gets is stated
             instead: the name the cascade produced, and what it will be configured with.
             An empty branch that just said "Azion handles it" would leave them guessing at
             a resource that shows up in their Deployments list afterwards. -->
        <div
          v-if="!isExistingDeployment"
          class="mt-(--spacing-md) border-t border-(--border-default) p-(--spacing-md)"
        >
          <Item.List>
            <Item size="small">
              <Item.Media>
                <span
                  class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                >
                  <i
                    class="ai ai-deploy-pillar text-[1rem] leading-none text-(--text-default)"
                    aria-hidden="true"
                  />
                </span>
              </Item.Media>
              <Item.Content>
                <Item.Title>{{ names.deployment || 'Named from the domain' }}</Item.Title>
                <Item.Description>
                  Created with the workload, on Azion's default settings. Change them from
                  Deployments once it exists.
                </Item.Description>
              </Item.Content>
            </Item>
          </Item.List>
        </div>

        <!-- EXISTING — the shared list again (../../../components/resource/ResourcePicker.vue). -->
        <ResourcePicker
          v-else
          v-model="form.deployment"
          class="pt-(--spacing-md)"
          :options="WORKLOAD_DEPLOYMENTS"
          icon="ai ai-deploy-pillar"
          noun="deployment"
          :message="errors.deployment"
          :disabled="disabled"
        />
      </template>
    </CardBox>

    <!-- ADVANCED — the existing disclosure pattern (a collapsible Section, never an
         Accordion), holding what the endpoint already defaults: the TLS floor, the custom
         page binding, and the two workload flags. -->
    <Section
      stacked
      collapsible
      :divided="false"
      icon="pi pi-cog"
      title="Advanced"
      hint="Every field here already carries the endpoint's own default, and all of them can be changed once the workload exists."
    >
      <!-- ONE card, three GROUPS inside it — the same shape the application flow's Advanced
           band uses. Three titled boxes stacked here would say the TLS floor, the custom
           page and the two flags are three separate bands of the page; they are three
           groups of ONE band, and the band is already titled "Advanced". -->
      <CardBox :padded="false">
        <template #content>
          <div class="p-(--spacing-md)">
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

          <!-- NO group heading over this one: "Custom page" above a field labelled "Custom
               page" is a heading for a heading. The rule above is what separates it. -->
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
               nobody touches at creation time. Each row is an Item — the Item.Title IS the
               name, guidance goes in Item.Description, the switch sits in Item.Actions. -->
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
                  Serve traffic on the provisioned
                  {{ names.workload ? `${names.workload}${AZION_DOMAIN_SUFFIX}` : 'Azion domain' }}
                  alongside your own. Turn it off once your own domain answers instead.
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
