<script setup>
  // Add Domain — the one form that puts a domain on a RESOURCE, the one form that puts the
  // environment it answers in on that resource, and the one form that EDITS a domain
  // already there. They are the same form because they are the same act, and an edit is
  // that act re-opened on a row: a second drawer re-asking the same four questions in
  // different words is how the two drift.
  //
  // ── ONE FORM FOR THE WORKLOAD AND FOR THE APPLICATION ──
  //
  // An application is deployed THROUGH a workload — they are bound and work together — so
  // a domain on an application answers in an environment for exactly the reason a domain
  // on a workload does. `resource` is the noun this form uses while it says so; nothing
  // else about it differs, which is what keeps the two surfaces from drifting into two
  // different accounts of the same act.
  //
  // ── WHY ONE FORM ──
  //
  // An environment is an account record (../../lib/data/environments.js). It reaches a
  // WORKLOAD only one way, and the product says which (../../lib/state/workload-settings.js):
  //
  //   "Every environment used by a DOMAIN is linked to Deployment Settings automatically,
  //    matching the deployment policy of that environment."
  //
  // So there is nothing to create here and nothing to link by hand: the reader says where
  // the domain answers and names the address, and the environment arrives with it. The card's
  // picker used to open a Create Environment drawer that asked for a name and a Deployment
  // Setting — an environment no domain answered on, and a link the platform makes itself.
  //
  // ── THE SECOND DRAWER ──
  //
  // The Environment field offers what the account already holds, and a quick-add in the
  // Select's footer opens the account's OWN create
  // (../environment/CreateEnvironmentDrawer.vue) on top of this one. Not a copy of it: the
  // same drawer the Environments page opens, so an environment made mid-flow is a real
  // record with its policies, its protection and its branch tracking, and the two surfaces
  // cannot drift. It returns here with the new environment already selected, so the
  // interrupted form resumes where it paused.
  //
  // IT IS NARROWER THAN THIS ONE, and a layer above it — both from `stacked`. At equal
  // width the child covered the parent exactly and the stack was invisible; at 384px
  // against this drawer's 672px the parent shows along the left edge, which is what says
  // this is a detour and what the reader comes back to. The layer is what keeps that strip
  // from being LIVE: a drawer's backdrop sits under a drawer's panel, so until the child
  // is lifted, clicking the parent's fields through its own gap still types into them.
  //
  // WHILE IT IS OPEN THIS DRAWER STANDS ITS EXITS DOWN (`:dismissible="false"`). Every open
  // drawer listens for Escape on `document`, so with two panels up one press closed BOTH —
  // measured, and it took the filled-in parent with it. The child keeps its own Escape;
  // this one gets its back when it is the panel on top again.
  //
  // ── THE CERTIFICATE IS ANSWERED HERE, AND ANSWERED BY DEFAULT ──
  //
  // It used to be a Select in every row of the Settings table, which put the one decision
  // about how a domain is SERVED somewhere other than the form that decides what the
  // domain is. It is a field here now, and the form fills it in: an account holding
  // `*.edgeflow.com` has already decided what serves `api.edgeflow.com`
  // (../../lib/data/certificates.js § certificateForDomain). The reader can change it, and
  // once they do the form stops guessing — a default that overwrites a deliberate answer
  // on the next keystroke is worse than no default at all.
  //
  // It is asked ONLY for a domain the reader brings. An Azion subdomain is served by the
  // platform's own certificate and by nothing else, so on that branch the field would be a
  // control with exactly one legal value.
  //
  // ── ANATOMY ──
  //
  // ResourceDrawer + Section bands + FieldStack rows — the create anatomy every
  // in-resource form here uses, so this reads like the Record drawer and the Variables
  // drawer rather than like a third thing. No Advanced band: every field is required or is
  // the point of the form, and a disclosure holding neither is a disclosure holding
  // nothing. One `submitting` flag, validation on submit only, one Save alone on the right.
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import InputGroup, { InputGroupAddon } from '@aziontech/webkit/input-group'
  import InputText from '@aziontech/webkit/input-text'
  import Message from '@aziontech/webkit/message'
  import Select from '@aziontech/webkit/select'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref, watch } from 'vue'

  import {
    certificateForDomain,
    domainCertificateLabel,
    domainCertificateOptions
  } from '../../lib/data/certificates'
  import { deploymentPolicyLabel, environmentNameOptions } from '../../lib/data/environments'
  import { AZION_DOMAIN_SUFFIX } from '../../lib/data/workload-provisioning'
  import CreateEnvironmentDrawer from '../environment/CreateEnvironmentDrawer.vue'
  import FieldStack from '../form/FieldStack.vue'
  import ResourceDrawer from '../form/ResourceDrawer.vue'
  import Section from '../page/Section.vue'

  const open = defineModel('open', { type: Boolean, default: false })

  const props = defineProps({
    /**
     * Which resource this domain lands on — `workload` or `application`. It is the NOUN in
     * this form's sentences, nothing more: the act, the fields and the commit are the same
     * on both (an application is deployed through a workload).
     */
    resource: {
      type: String,
      default: 'workload',
      validator: (value) => ['workload', 'application'].includes(value)
    },
    /**
     * Which door the reader came through — `environment` (the card's picker) or `domain`
     * (the Custom domains field, the production checklist). It changes the TITLE and the
     * commit's verb, nothing else: the form is one form, and this is what stops it
     * announcing "Add Environment" to someone who pressed "Add a custom domain".
     */
    intent: {
      type: String,
      default: 'environment',
      validator: (value) => ['environment', 'domain'].includes(value)
    },
    /**
     * The environments this resource already publishes into — `{ name }[]`
     * (../../lib/state/workload-environments.js). Not the answer set: it is what lets the
     * form say, while the reader is choosing, that the one they named is new here.
     */
    environments: { type: Array, default: () => [] },
    /**
     * The row this drawer is EDITING — `{ id, domain, environment, certificate }` — or
     * `null` when it is adding. It is what turns the same form into the edit form: the
     * fields open on the row's own answers and the commit carries its id back, so the
     * page replaces a domain rather than growing a second one beside it.
     */
    domain: { type: Object, default: null }
  })

  // `save` carries `{ id, domain, environment, certificate }` — a form commit, not a DOM
  // activation. On an edit it carries the row's OWN id, which is what makes it a replace.
  const emit = defineEmits(['save'])

  const editing = computed(() => Boolean(props.domain))

  const copy = computed(() => {
    if (editing.value) return { title: 'Edit Domain', save: 'Save Domain' }
    return props.intent === 'domain'
      ? { title: 'Add Domain', save: 'Add Domain' }
      : { title: 'Add Environment', save: 'Add Environment' }
  })

  // The drawer says what it is for in one line, and an edit is for something else than an
  // add: the address already exists, so the question is what to change about it.
  const description = computed(() =>
    editing.value
      ? 'Change where it answers, the address, or the certificate it is served with.'
      : `A domain is what puts an environment on this ${props.resource}. Say where it answers, and name the address.`
  )

  const kindOptions = computed(() => [
    {
      value: 'free',
      label: 'Get a free Azion Domain',
      description: `You can use a free ${AZION_DOMAIN_SUFFIX.replace(/^\./, '')} domain.`
    },
    {
      value: 'own',
      label: 'Bring my own Domain',
      description: `Use your own DNS and point it to your Azion ${props.resource}.`
    }
  ])

  const environmentOptions = environmentNameOptions
  const environmentLabel = (value) =>
    environmentOptions.value.find((option) => option.value === value)?.label ?? ''

  // NO DEFAULT ENVIRONMENT. It decides what the domain publishes with, so it is answered
  // rather than inherited — a pre-filled `Production` is the state this form was in while
  // nothing read the field at all. The CERTIFICATE is the opposite case and gets the
  // opposite treatment: there is a right answer derivable from the address, so the form
  // derives it (see the header note).
  const blankForm = () => ({ kind: 'free', domain: '', environment: '', certificate: '' })

  // The row reopened as ANSWERS. An Azion subdomain is stored whole, so the `own`/`free`
  // branch and the bare name are both read back off the suffix — otherwise editing a free
  // domain would re-add the suffix to a value that already carries it.
  const formForDomain = (entry) => {
    const address = String(entry.domain ?? '')
    const free = address.endsWith(AZION_DOMAIN_SUFFIX)
    return {
      kind: free ? 'free' : 'own',
      domain: free ? address.slice(0, -AZION_DOMAIN_SUFFIX.length) : address,
      environment: entry.environment ?? '',
      certificate: entry.certificate ?? ''
    }
  }

  const form = reactive(blankForm())
  const errors = reactive({ domain: '', environment: '' })
  const submitting = ref(false)
  const createEnvironmentOpen = ref(false)

  // Whether the reader has answered the certificate themselves. Once they have, the form
  // stops deriving it — the derived value is a starting point, never a correction.
  const certificateTouched = ref(false)

  // Reset on CLOSE and seed on OPEN, both here: a drawer that seeded only on mount would
  // open on the last row's answers the second time it is used for a different one.
  watch(open, (isOpen) => {
    Object.assign(errors, { domain: '', environment: '' })
    submitting.value = false
    if (!isOpen) {
      Object.assign(form, blankForm())
      certificateTouched.value = false
      return
    }
    Object.assign(form, props.domain ? formForDomain(props.domain) : blankForm())
    // An edit opens on an answer that is already the row's, derived or not — so it is
    // treated as answered and nothing rewrites it while the reader edits the address.
    certificateTouched.value = editing.value
  })

  // The address as it will be stored — the bare name on a domain the reader brings, the
  // name plus the platform suffix on a free one. Both the certificate default and the
  // commit read this, so the value matched against and the value saved cannot disagree.
  const fullDomain = computed(() => {
    const name = form.domain.trim()
    if (!name) return ''
    return form.kind === 'free' ? `${name}${AZION_DOMAIN_SUFFIX}` : name
  })

  const certificateOptions = computed(() => domainCertificateOptions())

  const freeDomainNote = computed(
    () =>
      `Your ${props.resource} is always accessible at an ${AZION_DOMAIN_SUFFIX.replace(/^\./, '')} subdomain based on its name. Custom domains allow visitors to reach your project at your own domain.`
  )

  // THE DEFAULT PICK. It follows the address while the field is untouched, and a free
  // Azion domain is always the platform's own certificate — the field is not even asked
  // for on that branch, so leaving a picked one behind would commit an answer the reader
  // can no longer see.
  watch(
    () => [fullDomain.value, form.kind],
    ([host, kind]) => {
      if (kind === 'free') {
        form.certificate = ''
        return
      }
      if (certificateTouched.value) return
      form.certificate = certificateForDomain(host)
    },
    { immediate: true }
  )

  const onCertificate = (value) => {
    certificateTouched.value = true
    form.certificate = value
  }

  // What the field says under itself: which certificate is about to serve this address,
  // and — while it is the derived one — that the form is the one that chose it.
  const certificateHint = computed(() => {
    if (!form.certificate) {
      return 'Served by the free Azion certificate, issued and renewed by the platform.'
    }
    const name = domainCertificateLabel(form.certificate)
    return certificateTouched.value
      ? `Served with ${name}.`
      : `${name} already covers this address, so it is selected. Change it if another one should serve it.`
  })

  const chosen = computed(() =>
    environmentOptions.value.find((option) => option.value === form.environment)
  )

  // Whether the environment named is already on this workload. When it is not, this domain
  // is what brings it — a consequence worth stating BEFORE the commit rather than as a
  // surprise on the card afterwards.
  const joinsWorkload = computed(
    () =>
      Boolean(form.environment) &&
      !props.environments.some((environment) => environment.name === form.environment)
  )

  const environmentHint = computed(() => {
    if (!chosen.value) return 'Where this domain answers. Pick one, or create it from here.'
    const policy = deploymentPolicyLabel(chosen.value.deploymentPolicy)
    return joinsWorkload.value
      ? `This ${props.resource} doesn't publish into ${chosen.value.label} yet. Adding this domain connects it, served by the Deployment Settings set to ${policy}.`
      : `${chosen.value.label} publishes with the Deployment Settings set to ${policy}.`
  })

  // THE QUICK-ADD'S SENTINEL. It rides in the Select's `#footer` slot as an option, so
  // the Select stays CONTROLLED (`:model-value`, never `v-model`): picking the sentinel
  // must not commit a value, it must open the second drawer and leave the real answer
  // exactly as the reader left it. Told apart by identity rather than by position — a
  // list whose last row happens to mean something else is one reorder away from a bug.
  const CREATE_ENVIRONMENT = '__create-environment__'

  // The Select's own open state, so the quick-add can close the listbox BEFORE the child
  // drawer opens over it — a dropdown left open under a new panel is a popup with no
  // owner on screen.
  const environmentSelectOpen = ref(false)

  const onEnvironmentModel = (value) => {
    if (value === CREATE_ENVIRONMENT) {
      environmentSelectOpen.value = false
      createEnvironmentOpen.value = true
      return
    }
    form.environment = value
    errors.environment = ''
  }

  // The nested create returns the record it made. Selecting it is the whole point of
  // having opened it — a reader sent back to an unchanged Select would have to find their
  // own environment in the list and wonder whether it saved.
  const onEnvironmentCreated = (environment) => {
    form.environment = environment.name
    errors.environment = ''
  }

  const validate = () => {
    errors.domain = form.domain.trim() ? '' : 'This field is required.'
    errors.environment = form.environment ? '' : 'This field is required.'
    return !errors.domain && !errors.environment
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      emit('save', {
        // THE ROW'S OWN ID ON AN EDIT. A new id would make the replace an add, and the
        // table would end up holding the address twice.
        id: props.domain?.id ?? `domain-${Date.now()}`,
        domain: fullDomain.value,
        environment: form.environment,
        certificate: form.certificate
      })
      open.value = false
    } catch (error) {
      // A request-level failure surfaces here — the parent only ever sees a successful
      // `save` — so it is reported where the reader is looking, never silently.
      const noun = editing.value || props.intent === 'domain' ? 'domain' : 'environment'
      toast.error(`Couldn't ${editing.value ? 'save' : 'add'} the ${noun}.`, {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false // release on success AND failure
    }
  }
</script>

<template>
  <ResourceDrawer
    v-model:open="open"
    :title="copy.title"
    :description="description"
    :save-label="copy.save"
    :submitting="submitting"
    :dismissible="!createEnvironmentOpen"
    @submit="submit"
  >
    <!-- ── Environment ── -->
    <Section
      stacked
      :divided="false"
      title="Environment"
      hint="Where the domain answers. An environment's deployment policy decides which Deployment Settings can ever serve it."
    >
      <FieldStack
        label="Environment"
        required
        :description="environmentHint"
        :message="errors.environment"
        message-kind="required"
      >
        <template #default="{ controlId, describedBy }">
          <!-- CONTROLLED (`:model-value`, not `v-model`) so the quick-add's sentinel can
               never commit itself as an answer. `@update:model-value` routes it to the
               second drawer and assigns everything else. -->
          <Select
            v-model:open="environmentSelectOpen"
            :model-value="form.environment"
            size="large"
            class="w-full"
            placeholder="Select an environment"
            :disabled="submitting"
            :invalid="!!errors.environment"
            :display-value="environmentLabel"
            @update:model-value="onEnvironmentModel"
          >
            <Select.Trigger
              :id="controlId"
              :aria-describedby="describedBy"
            />
            <Select.Content>
              <Select.Option
                v-for="option in environmentOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Option>
              <!-- THE QUICK-ADD, in the footer slot rather than among the values: a row
                   that is not an environment must not sit in the list of environments.
                   It opens the account's own create so the reader never leaves this form
                   to make one — which is the whole reason the pattern exists.

                   NO `icon` HERE, though a Select.Option takes one: the leading glyph is
                   revealed by `group-has-[[data-leading]]/options`, and the footer sits
                   OUTSIDE that group — measured, the `<i>` renders and stays `hidden`. A
                   prop that emits nothing is worse than no prop, so the row leans on the
                   footer's own separation instead. -->
              <template #footer>
                <Select.Option
                  :value="CREATE_ENVIRONMENT"
                  class="w-full"
                >
                  Create Environment
                </Select.Option>
              </template>
            </Select.Content>
          </Select>
        </template>
      </FieldStack>
    </Section>

    <!-- ── Domain ── -->
    <Section
      stacked
      :divided="false"
      title="Domain"
      hint="The address this workload answers on, where it comes from, and the certificate it is served with."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <!-- A RADIO GROUP CANNOT BE THE TARGET OF A `<label for>`, so the field hands it
             the name by id instead — which is what `group` on FieldStack is for. -->
        <FieldStack
          group
          label="Domain source"
        >
          <template #default="{ labelId }">
            <div
              role="radiogroup"
              :aria-labelledby="labelId"
              class="flex min-w-0 flex-col gap-(--spacing-sm)"
            >
              <FieldRadioBlock
                v-for="option in kindOptions"
                :key="option.value"
                v-model="form.kind"
                :value="option.value"
                name="domain-kind"
                :input-id="`domain-kind-${option.value}`"
                :label="option.label"
                :description="option.description"
                :disabled="submitting"
              />
            </div>
          </template>
        </FieldStack>

        <FieldStack
          label="Domain"
          required
          :message="errors.domain"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <InputGroup :disabled="submitting">
              <InputText
                :id="controlId"
                v-model="form.domain"
                size="large"
                class="flex-1"
                placeholder="my-workload"
                :disabled="submitting"
                :required="!!errors.domain"
                :aria-describedby="describedBy"
                @update:model-value="errors.domain = ''"
              />
              <InputGroupAddon v-if="form.kind === 'free'">
                {{ AZION_DOMAIN_SUFFIX }}
              </InputGroupAddon>
            </InputGroup>
          </template>
        </FieldStack>

        <!-- THE CERTIFICATE, on the branch where there is something to pick. A free Azion
             domain is served by the platform's own certificate and by nothing else, so on
             that branch this is a control with one legal value and the Message below says
             so instead. -->
        <FieldStack
          v-if="form.kind === 'own'"
          label="Certificate"
          :description="certificateHint"
        >
          <template #default="{ controlId, describedBy }">
            <Select
              :model-value="form.certificate"
              size="large"
              class="w-full"
              :disabled="submitting"
              :display-value="domainCertificateLabel"
              @update:model-value="onCertificate"
            >
              <Select.Trigger
                :id="controlId"
                :aria-describedby="describedBy"
              />
              <Select.Content>
                <Select.Option
                  v-for="option in certificateOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Option>
              </Select.Content>
            </Select>
          </template>
        </FieldStack>

        <Message
          severity="info"
          :label="freeDomainNote"
        />
      </div>
    </Section>
  </ResourceDrawer>

  <!-- THE SECOND DRAWER — the account's own create, opened over this one and returning
       the record it made. It lives outside ResourceDrawer's form on purpose: a `<form>`
       inside a `<form>` is invalid HTML, and its own Save would submit this one. -->
  <CreateEnvironmentDrawer
    v-model:open="createEnvironmentOpen"
    stacked
    @create="onEnvironmentCreated"
  />
</template>
