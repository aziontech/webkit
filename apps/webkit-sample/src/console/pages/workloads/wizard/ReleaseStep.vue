<script setup>
  // PART 3 — THE RELEASE, WHICH IS WHERE THE OTHER TWO PARTS COMBINE.
  //
  // A workload with a domain and no release is an address that answers nothing. This part
  // is what makes the first two mean something: it binds what the domain SERVES.
  //
  // ── THE FIREWALL IS NOT ASKED AGAIN ──
  //
  // The reader answered "protect it" one part ago, so the release SHOWS that answer rather
  // than re-offering it — a second firewall control here would be a second place the same
  // fact lives, and the two would disagree the first time somebody edited one. The row is
  // read-only with a way BACK to the part that owns it, which is the honest shape for a
  // value this screen displays but does not own.
  //
  // That is the whole meaning of "combine this into the release": the release is a
  // projection of the parts before it, not a fresh questionnaire.
  //
  // ── WHAT THIS PART ACTUALLY ASKS ──
  //
  // The application (and its version), the environment the binding lands on, and the
  // custom page — the three things nothing earlier in the flow implied. Everything else
  // the endpoint accepts already carries a default and sits in Advanced.
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

  const emit = defineEmits(['edit-protection'])

  const { form, errors } = useWorkloadForm()

  // Stored value → visible label, for every Select here. Without it the trigger prints the
  // raw API value (`tls_1_2` instead of "TLS 1.2").
  const labelFor = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? ''

  const domain = computed(() => domainForWorkload(form.name))
</script>

<template>
  <div class="flex min-w-0 flex-col">
    <!-- WHAT THIS RELEASE IS FOR — the two answers already given, projected. Read-only, so
         there is exactly one place each of them can be changed. -->
    <CardBox
      :padded="false"
      title="Serving"
    >
      <template #content>
        <Item.List>
          <Item size="small">
            <Item.Media>
              <span
                class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  class="pi pi-globe text-[1rem] leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
            </Item.Media>
            <Item.Content>
              <Item.Title>{{ domain || 'No domain yet' }}</Item.Title>
              <Item.Description>
                Provisioned from the workload name. Traffic arrives here.
              </Item.Description>
            </Item.Content>
          </Item>

          <Item size="small">
            <Item.Media>
              <span
                class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  class="pi pi-shield text-[1rem] leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
            </Item.Media>
            <Item.Content>
              <Item.Title>{{ form.protected ? form.firewall : 'Not protected' }}</Item.Title>
              <Item.Description>
                {{
                  form.protected
                    ? 'Bound to this release. Requests are filtered before the application runs.'
                    : 'No firewall in front of this workload. Requests reach the application directly.'
                }}
              </Item.Description>
            </Item.Content>
            <Item.Actions>
              <!-- Back to the part that OWNS this answer, rather than a second control for
                   it here. -->
              <button
                type="button"
                class="rounded-(--shape-button) px-(--spacing-xxs) text-label-sm text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                :disabled="disabled"
                @click="emit('edit-protection')"
              >
                Change
              </button>
            </Item.Actions>
          </Item>
        </Item.List>
      </template>
    </CardBox>

    <!-- WHAT THE RELEASE BINDS. The fields nothing earlier implied. -->
    <Section
      stacked
      :divided="false"
      title="Release"
      hint="What this workload's environment serves. A workload can exist without one, but it answers nothing until a release is cut."
    >
      <CardBox>
        <template #content>
          <div class="flex flex-col gap-(--spacing-lg)">
            <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-[minmax(0,1fr)_10rem]">
              <FieldStack
                label="Application"
                required
                hint="The application this workload serves. Bindings are per environment, so one workload can serve different applications on Production and Stage."
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
    </Section>

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
      <CardBox title="TLS">
        <template #content>
          <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
            <FieldStack
              label="Certificate"
              hint="One certificate per workload — it is a property of the workload, not of a domain on it."
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
        </template>
      </CardBox>

      <CardBox title="Custom page">
        <template #content>
          <FieldStack
            label="Custom page"
            hint="What the workload serves for an error or a maintenance window. Optional — unbound falls back to Azion's own pages."
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
        </template>
      </CardBox>

      <CardBox
        :padded="false"
        title="Behavior"
      >
        <template #content>
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
                  When disabled, the workload is created but stops serving traffic at the edge.
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
