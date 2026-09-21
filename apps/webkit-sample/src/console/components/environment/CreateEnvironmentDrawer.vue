<script setup>
  // Create Environment — the v6 create body, as a form.
  //
  // The bands are console-kit's own (`views/Environments/FormFields/`), because the
  // grouping is part of the contract: what identifies the environment, how its URLs and
  // its robots.txt behave, who may reach it, and what builds it.
  //
  //   General          name, description
  //   Settings         deployment policy, robots policy
  //   Protection       who may reach it at all
  //   Branch tracking  what builds it
  //
  // DEPLOYMENT POLICY IS THE CONSEQUENTIAL FIELD, and the form says so rather than
  // leaving it as one dropdown among four: it decides which Deployment Settings this
  // environment may ever be linked to (../../lib/state/workload-settings.js). Picking
  // `Versioned` here means the environment can never publish with a `Single` setting.
  //
  // VALIDATION mirrors the console's schema: a name is required, and the allowlist —
  // when its switch is on — needs at least one entry and every entry has to be a legal
  // IPv4 address or CIDR range. Both are checked in the field that typed them rather
  // than in a toast after a round trip.
  import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Select from '@aziontech/webkit/select'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed, reactive, ref, watch } from 'vue'

  import {
    addEnvironment,
    blankProtection,
    BRANCH_MODE_OPTIONS,
    BRANCH_TRACKING_DEFAULTS,
    branchModeLabel,
    DEFAULT_DEPLOYMENT_POLICY,
    DEFAULT_ROBOTS_POLICY,
    DEPLOYMENT_POLICY_OPTIONS,
    deploymentPolicyLabel,
    environmentByName,
    isValidIpOrCidr,
    parseIpAllowlist,
    ROBOTS_POLICY_OPTIONS,
    robotsPolicyLabel
  } from '../../lib/data/environments'
  import FieldStack from '../form/FieldStack.vue'
  import ResourceDrawer from '../form/ResourceDrawer.vue'
  import Section from '../page/Section.vue'

  const open = defineModel('open', { type: Boolean, default: false })

  defineProps({
    /**
     * This drawer is the SECOND in a stack — opened over another drawer rather than over
     * the page (../workload/AddEnvironmentDrawer.vue), instead of standing on its own on
     * the Environments page.
     *
     * One fact, two consequences, so it is one prop: it goes NARROW (`small`, 384px,
     * against the parent's 672px) so the parent stays visible behind it and the reader can
     * see this is a detour, and it takes the layer above the parent's panel so its own
     * backdrop covers it.
     */
    stacked: { type: Boolean, default: false }
  })

  const emit = defineEmits(['create'])

  const blankForm = () => ({
    name: '',
    description: '',
    deploymentPolicy: DEFAULT_DEPLOYMENT_POLICY,
    robotsPolicy: DEFAULT_ROBOTS_POLICY,
    ipAllowlistEnabled: false,
    ipAllowlistCidrs: '',
    branchTrackingEnabled: BRANCH_TRACKING_DEFAULTS.enabled,
    branchMode: BRANCH_TRACKING_DEFAULTS.mode,
    branchMatch: BRANCH_TRACKING_DEFAULTS.branchMatch
  })

  const form = reactive(blankForm())
  const errors = reactive({ name: '', ipAllowlistCidrs: '', branchMatch: '' })
  const submitting = ref(false)

  watch(open, (isOpen) => {
    if (isOpen) return
    Object.assign(form, blankForm())
    Object.assign(errors, { name: '', ipAllowlistCidrs: '', branchMatch: '' })
    submitting.value = false
  })

  const validate = () => {
    const name = form.name.trim()
    if (!name) errors.name = 'This field is required.'
    else if (environmentByName(name)) errors.name = 'An environment with this name already exists.'
    else errors.name = ''

    errors.ipAllowlistCidrs = ''
    if (form.ipAllowlistEnabled) {
      const entries = parseIpAllowlist(form.ipAllowlistCidrs)
      const invalid = entries.filter((entry) => !isValidIpOrCidr(entry))
      if (!entries.length) {
        errors.ipAllowlistCidrs = 'Add at least one IPv4 address or CIDR range.'
      } else if (invalid.length) {
        errors.ipAllowlistCidrs = `Invalid IPv4 address or CIDR range: ${invalid.join(', ')}.`
      }
    }

    errors.branchMatch =
      form.branchTrackingEnabled && !form.branchMatch.trim() ? 'This field is required.' : ''

    return !errors.name && !errors.ipAllowlistCidrs && !errors.branchMatch
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const environment = addEnvironment({
        name: form.name,
        description: form.description,
        deploymentPolicy: form.deploymentPolicy,
        robotsPolicy: form.robotsPolicy,
        protection: {
          ...blankProtection(),
          ipAllowlist: {
            enabled: form.ipAllowlistEnabled,
            cidrs: form.ipAllowlistEnabled ? parseIpAllowlist(form.ipAllowlistCidrs) : []
          }
        },
        branchTracking: {
          enabled: form.branchTrackingEnabled,
          mode: form.branchMode,
          branchMatch: form.branchMatch.trim()
        }
      })
      open.value = false
      emit('create', environment)
    } finally {
      submitting.value = false
    }
  }

  // The sentence under the policy Select, which changes with the choice: the reader is
  // picking how every URL in this environment is shaped, and the two answers are not
  // variations of one thing.
  const policyHint = computed(
    () =>
      DEPLOYMENT_POLICY_OPTIONS.find((option) => option.value === form.deploymentPolicy)
        ?.description ?? ''
  )

  const robotsHint = computed(
    () =>
      ROBOTS_POLICY_OPTIONS.find((option) => option.value === form.robotsPolicy)?.description ?? ''
  )
</script>

<template>
  <ResourceDrawer
    v-model:open="open"
    :size="stacked ? 'small' : 'medium'"
    :stacked="stacked"
    title="Create Environment"
    description="An environment is where a deployment lands. Its deployment policy decides which Deployment Settings can ever serve it."
    save-label="Create Environment"
    :submitting="submitting"
    @submit="submit"
  >
    <!-- ── General ── -->
    <Section
      stacked
      :divided="false"
      title="General"
      hint="How this environment is identified across the console."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <FieldStack
          label="Name"
          required
          description="Use a clear name to identify this deployment stage."
          :message="errors.name"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <InputText
              :id="controlId"
              v-model="form.name"
              size="large"
              class="w-full"
              placeholder="Preview"
              :disabled="submitting"
              :required="!!errors.name"
              :aria-describedby="describedBy"
              @update:model-value="errors.name = ''"
            />
          </template>
        </FieldStack>

        <FieldStack
          label="Description"
          description="Optional, and internal: it never reaches traffic."
        >
          <template #default="{ controlId, describedBy }">
            <Textarea
              :id="controlId"
              v-model="form.description"
              class="w-full"
              :rows="2"
              :disabled="submitting"
              :aria-describedby="describedBy"
            />
          </template>
        </FieldStack>
      </div>
    </Section>

    <!-- ── Settings ── -->
    <Section
      stacked
      :divided="false"
      title="Settings"
      hint="How this environment's URLs are organized, and how the edge answers /robots.txt for it."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <FieldStack
          label="Deployment policy"
          :description="policyHint"
        >
          <template #default="{ controlId, describedBy }">
            <Select
              v-model="form.deploymentPolicy"
              size="large"
              class="w-full"
              :disabled="submitting"
              :display-value="deploymentPolicyLabel"
            >
              <Select.Trigger
                :id="controlId"
                :aria-describedby="describedBy"
              />
              <Select.Content>
                <Select.Option
                  v-for="option in DEPLOYMENT_POLICY_OPTIONS"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Option>
              </Select.Content>
            </Select>
          </template>
        </FieldStack>

        <!-- THE CONSEQUENCE, stated where it is decided. This is the field that limits
             which Deployment Settings the environment can ever be linked to, and it is
             the one thing about it a reader cannot work out from the label. -->
        <HelperText
          :label="`Only Deployment Settings set to ${deploymentPolicyLabel(form.deploymentPolicy)} can serve this environment.`"
        />

        <FieldStack
          label="Robots policy"
          :description="robotsHint"
        >
          <template #default="{ controlId, describedBy }">
            <Select
              v-model="form.robotsPolicy"
              size="large"
              class="w-full"
              :disabled="submitting"
              :display-value="robotsPolicyLabel"
            >
              <Select.Trigger
                :id="controlId"
                :aria-describedby="describedBy"
              />
              <Select.Content>
                <Select.Option
                  v-for="option in ROBOTS_POLICY_OPTIONS"
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
    </Section>

    <!-- ── Protection ── -->
    <Section
      stacked
      :divided="false"
      title="Protection"
      hint="Restrict who can reach this environment. Each protection is independent."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <FieldSwitchBlock
          v-model="form.ipAllowlistEnabled"
          label="IP allowlist"
          description="Only allow access from the listed IPs or CIDR ranges."
          :disabled="submitting"
          @update:model-value="errors.ipAllowlistCidrs = ''"
        />

        <FieldStack
          v-if="form.ipAllowlistEnabled"
          label="IPs/CIDRs"
          required
          description="One IPv4 address or CIDR range per line."
          :message="errors.ipAllowlistCidrs"
          message-kind="invalid"
        >
          <template #default="{ controlId, describedBy }">
            <Textarea
              :id="controlId"
              v-model="form.ipAllowlistCidrs"
              class="w-full"
              :rows="3"
              placeholder="203.0.113.0/24"
              :disabled="submitting"
              :invalid="!!errors.ipAllowlistCidrs"
              :aria-describedby="describedBy"
              @update:model-value="errors.ipAllowlistCidrs = ''"
            />
          </template>
        </FieldStack>
      </div>
    </Section>

    <!-- ── Branch tracking ── -->
    <Section
      stacked
      :divided="false"
      title="Branch tracking"
      hint="Build this environment automatically when a matching Git branch is updated."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <FieldSwitchBlock
          v-model="form.branchTrackingEnabled"
          label="Enable branch tracking"
          description="Track a Git branch pattern to trigger builds."
          :disabled="submitting"
          @update:model-value="errors.branchMatch = ''"
        />

        <template v-if="form.branchTrackingEnabled">
          <FieldStack
            label="Mode"
            description="How the branch name is matched."
          >
            <template #default="{ controlId, describedBy }">
              <Select
                v-model="form.branchMode"
                size="large"
                class="w-full"
                :disabled="submitting"
                :display-value="branchModeLabel"
              >
                <Select.Trigger
                  :id="controlId"
                  :aria-describedby="describedBy"
                />
                <Select.Content>
                  <Select.Option
                    v-for="option in BRANCH_MODE_OPTIONS"
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
            label="Branch match"
            required
            description="The branch name or pattern to match."
            :message="errors.branchMatch"
            message-kind="required"
          >
            <template #default="{ controlId, describedBy }">
              <InputText
                :id="controlId"
                v-model="form.branchMatch"
                size="large"
                class="w-full"
                placeholder="main"
                :disabled="submitting"
                :required="!!errors.branchMatch"
                :aria-describedby="describedBy"
                @update:model-value="errors.branchMatch = ''"
              />
            </template>
          </FieldStack>
        </template>
      </div>
    </Section>
  </ResourceDrawer>
</template>
