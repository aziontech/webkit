<script setup>
  // Scenario: STALE REFERENCE on create — a server-side referential error.
  //
  // Two people work the same module. User 1 fills in an Application and links an
  // Edge Connector. Before User 1 saves, User 2 deletes that Connector through the
  // API. User 1's browser is never told: its copy of the Connector list is simply
  // stale. The create request is the moment the drift surfaces — the API rejects it
  // with "the referenced object no longer exists".
  //
  // This is NOT field validation, and it is NOT a plain request failure — it is a
  // third case, and it decides where the error goes:
  //
  //   | Failure                                     | Where it goes                     |
  //   | ------------------------------------------- | --------------------------------- |
  //   | empty / malformed input (client-side)       | the field's own required/invalid  |
  //   | request failed, not tied to a field (5xx)   | toast.error + Retry               |
  //   | request rejected, SCOPED to one field       | a Message INSIDE that section     |
  //
  // The third row is what this page demonstrates. A toast is wrong for it: the
  // toast dismisses itself and points nowhere, while the only place the user can
  // recover is one Select, six sections down. So the error renders as a
  // `Message severity="danger"` in that section's own heading (`SectionHeading`'s
  // `bottom` slot, which animates its height so nothing below jumps) — the section
  // that needs attention carries the notice itself. The
  // field also takes its own state: the value is present but no longer valid, so
  // it is the red `invalid`, never the amber `required` prompt (`/form`).
  //
  // The form is deliberately LONG (six sections) so the recovery is the real thing
  // and not a diagram: when the rejection lands, Origin is far below the fold, so
  // the primary affordance is a POSITIONAL SCROLL ANCHOR — the scroll container is
  // smooth-scrolled to the erroring section's own offset, parked just under the top
  // edge. See `scrollToOriginAnchor` below.
  //
  // Everything else follows the In Page create form (`/form`): Approach A (Cards +
  // ItemGroups, `Item.Title` IS the label, control carries an aria-label),
  // validation on submit only, one `submitting` flag locking the whole scope
  // (`<fieldset :disabled>` + Save `:loading`), released in `finally`.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputNumber from '@aziontech/webkit/input-number'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Message from '@aziontech/webkit/message'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import UnsavedChangesGuard from '../../components/form/UnsavedChangesGuard.vue'
  import CreationHeader from '../../components/page/CreationHeader.vue'
  import SectionHeading from '../../components/page/SectionHeading.vue'
  import { useBaseline } from '../../lib/behavior/forms'

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // --- The Connectors module, as two separate truths -------------------------
  // `serverConnectors` is what the API holds. `connectors` is the snapshot THIS
  // form loaded when it opened. User 2's DELETE mutates only the server, so the
  // two drift apart with no signal to this tab — that drift IS the scenario.
  const CATALOG = [
    { value: 'conn-web-prod', label: 'web-origin-prod', kind: 'HTTP' },
    { value: 'conn-api-prod', label: 'api-origin-prod', kind: 'HTTP' },
    { value: 'conn-assets', label: 'assets-bucket', kind: 'Object Storage' }
  ]

  const serverConnectors = ref(CATALOG.map((connector) => connector.value))
  const connectors = ref([...CATALOG])

  const connectorLabel = (value) =>
    connectors.value.find((connector) => connector.value === value)?.label ?? ''

  // --- Field option models --------------------------------------------------
  const protocolUsageOptions = [
    {
      value: 'http',
      label: 'HTTP support',
      description: 'Use only the HTTP protocol. Choose from the available HTTP ports.'
    },
    {
      value: 'https',
      label: 'HTTP and HTTPS support',
      description:
        'Use both HTTP and HTTPS protocols. Choose from the available HTTP and HTTPS ports.'
    },
    {
      value: 'http3',
      label: 'HTTP/3 support',
      description:
        'Use both HTTP and HTTPS protocols and enable HTTP/3 support. Only available for HTTP port 80 and HTTPS port 443.'
    }
  ]

  const httpPortOptions = [
    { label: '80 (Default)', value: '80' },
    { label: '8080', value: '8080' },
    { label: '8008', value: '8008' }
  ]

  const portsLabel = (values) =>
    (values ?? [])
      .map((value) => httpPortOptions.find((option) => option.value === value)?.label ?? value)
      .join(', ')

  // --- Form state -----------------------------------------------------------
  // Pre-filled: the scenario starts with User 1's work already done and the
  // Connector already linked, so the race is one click away.
  const form = reactive({
    name: 'checkout-web',
    protocolUsage: 'https',
    httpPorts: ['80'],
    applicationAccelerator: true,
    edgeFunctions: false,
    imageProcessor: false,
    tieredCache: false,
    connectorId: 'conn-web-prod',
    hostHeader: '${host}',
    browserMaxTtl: 0,
    edgeMaxTtl: 60,
    debugRules: false
  })

  // Per-field messages. Empty string = valid.
  const errors = reactive({ name: '', httpPorts: '', connectorId: '', hostHeader: '' })

  // A request error the API scoped to ONE section. It renders as a Message inside
  // that section — not at the top of the form, not in a toast.
  const originError = ref('')

  // One flag locks the whole scope while the create request is in flight.
  const submitting = ref(false)

  // The leave guard's trigger (ui/UnsavedChangesGuard.vue): dirty while the form diverges
  // from the state it opened on. `commit` re-snapshots it on the way OUT of a successful
  // submit — this page's own navigation must not be stopped by the guard that exists to
  // protect the input that submit just consumed.
  const { dirty, commit } = useBaseline(form)

  // The connector list is being re-fetched. Its own flag, its own scope: it drives
  // the Skeleton that stands in for the Select and the Message action's :loading.
  const reloadingConnectors = ref(false)

  // --- The erroring section, and the scroll container it lives in ------------
  // No focus trap: Tab is never redirected and nothing is contained. The recovery
  // affordance is positional (see `scrollToOriginAnchor`), so the rest of the form
  // stays fully reachable by keyboard the whole time.
  const formScroll = ref(null)
  const originSection = ref(null)

  // --- The create endpoint (mock) -------------------------------------------
  // Rejects with a FIELD-SCOPED error when a referenced object is gone — the
  // shape a real API returns for a dangling reference (404/409 naming the field).
  // Nothing is persisted, which is why the form can keep every value.
  const createApplication = async (payload) => {
    await new Promise((resolve) => setTimeout(resolve, 700))

    if (!serverConnectors.value.includes(payload.connectorId)) {
      throw Object.assign(new Error('The referenced object no longer exists.'), {
        code: 'object_not_found',
        field: 'connectorId',
        resource: `Connector "${connectorLabel(payload.connectorId)}"`
      })
    }

    return { id: 'app-01' }
  }

  // --- The other user (simulation) ------------------------------------------
  // Which connector User 2 removed server-side, by label. Empty = server in sync.
  const deletedByOtherUser = ref('')

  const simulateDelete = () => {
    const target =
      connectors.value.find((connector) => connector.value === form.connectorId) ??
      connectors.value[0]
    if (!target) return

    serverConnectors.value = serverConnectors.value.filter((value) => value !== target.value)
    deletedByOtherUser.value = target.label
    // Deliberately silent — no toast, no list refresh. User 1 gets no signal at
    // all; only the save can reveal it. Anything louder would defeat the point.
  }

  const resetScenario = () => {
    serverConnectors.value = CATALOG.map((connector) => connector.value)
    connectors.value = [...CATALOG]
    deletedByOtherUser.value = ''
    form.name = 'checkout-web'
    form.connectorId = 'conn-web-prod'
    form.hostHeader = '${host}'
    originError.value = ''
    errors.name = ''
    errors.httpPorts = ''
    errors.connectorId = ''
    errors.hostHeader = ''
  }

  // --- Recovery: the positional scroll anchor -------------------------------
  // The PRIMARY affordance. Rather than trapping the user, the erroring section
  // becomes a scroll anchor: measure its offset inside the scroll container and
  // smooth-scroll there, parking the section heading `ANCHOR_OFFSET` below the top
  // edge so the heading, the Message and the broken field all land in view together
  // (`scrollIntoView({ block: 'center' })` cannot express that — it centres the
  // section's box, which on a tall section pushes the heading off the top).
  const ANCHOR_OFFSET = 24 // --spacing-lg of breathing room above the heading
  // SectionHeading's bottom-slot height transition (duration-150). Kept in sync by
  // name so the re-assert below reads as what it is, not a magic number.
  const MESSAGE_EXPAND_MS = 150

  const prefersReducedMotion = () =>
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const scrollToOriginAnchor = () => {
    const container = formScroll.value
    const section = originSection.value
    if (!container || !section) return

    // Container-relative, so it is correct wherever the section sits and however
    // far the container is already scrolled.
    const top =
      container.scrollTop +
      section.getBoundingClientRect().top -
      container.getBoundingClientRect().top -
      ANCHOR_OFFSET

    container.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth'
    })
  }

  // The Select's accessible control is its trigger, so that is what takes focus.
  // `preventScroll` is essential: a bare .focus() triggers the browser's own
  // scroll-into-view, which interrupts the smooth anchor scroll and re-parks the
  // viewport on the control instead of the section. The anchor stays authoritative;
  // focus only moves the caret.
  const focusConnector = () =>
    globalThis.document.getElementById('ev-connector')?.focus({ preventScroll: true })

  // Re-sync the form's snapshot with the server. This is a READ — options arriving
  // into the field — so the affordance is a `Skeleton` in the shape of the control,
  // not a spinner on it (`/ui-states`: Skeleton for data in, the control's own
  // loading for an action out). Only this one control is replaced; the rest of the
  // form stays live, so it is not a Skeleton over a form the user is filling.
  const reloadConnectors = async () => {
    if (reloadingConnectors.value) return // re-entrancy lock

    reloadingConnectors.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)) // the GET

      // The deleted connector drops out of the options and the stale selection
      // clears, so the field's feedback flips from the red `invalid` to the amber
      // `required` prompt — it is now empty, and empty is a prompt, not an error.
      connectors.value = CATALOG.filter((connector) =>
        serverConnectors.value.includes(connector.value)
      )

      if (!serverConnectors.value.includes(form.connectorId)) {
        form.connectorId = ''
        errors.connectorId = 'Select a connector to continue.'
      }

      originError.value = ''
    } finally {
      reloadingConnectors.value = false // release on success AND failure
    }

    // The Select only exists again once the Skeleton is gone.
    await nextTick()
    focusConnector()
  }

  const onConnectorChange = () => {
    errors.connectorId = ''
    originError.value = '' // resolved by picking another one — the Message exits
  }

  // --- Validation -----------------------------------------------------------
  // Runs on submit only. Empty → the amber `required` prompt; present-but-rejected
  // → the red `invalid` state. Never both on one field.
  const validate = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.httpPorts = form.httpPorts.length ? '' : 'Select at least one HTTP port.'
    errors.connectorId = form.connectorId ? '' : 'This field is required.'
    errors.hostHeader = form.hostHeader.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.httpPorts && !errors.connectorId && !errors.hostHeader
  }

  const cancel = () => router.push({ path: '/forms', query: { email: userEmail.value } })

  const submit = async () => {
    if (submitting.value || reloadingConnectors.value) return // re-entrancy lock

    originError.value = '' // a new attempt clears the previous rejection
    if (!validate()) return

    submitting.value = true
    try {
      await createApplication({ ...form })
      toast.success(`Application "${form.name}" created.`)
      commit() // the submit landed — the leave guard stands down
      router.push({ path: '/forms', query: { email: userEmail.value } })
    } catch (error) {
      if (error?.code === 'object_not_found' && error?.field === 'connectorId') {
        // Field-scoped rejection → the section that owns the field, plus the
        // field's own red `invalid` state. It stays put until the user recovers.
        originError.value = `${error.resource} no longer exists — another user deleted it while you were filling in this form, so the Application wasn't created. Nothing else was lost: reload the connector list and select another one.`
        errors.connectorId = 'This connector no longer exists.'
      } else {
        // Unscoped request failure → toast with a Retry (`/ui-states`).
        toast.error('Could not create the application.', {
          description: error?.message ?? 'Check your connection and try again.',
          action: { label: 'Retry', onClick: () => submit() }
        })
      }
    } finally {
      submitting.value = false // release on success AND failure
    }

    // Move the user to the problem only after the lock is released — the fieldset
    // is disabled while submitting, and a disabled control cannot take focus.
    if (originError.value) {
      await nextTick()
      scrollToOriginAnchor() // primary: the section becomes the scroll anchor
      focusConnector() // and the caret lands on the field to fix, un-trapped

      // The message region is still collapsed at this point, so the container is
      // ~90px shorter than it will be — near the end of a long form that is enough
      // for the browser to CLAMP the target and leave the section short of the
      // anchor. Re-assert once the region has finished expanding; it is a no-op when
      // the first scroll already landed, and continues the same smooth motion when
      // it was clamped.
      globalThis.setTimeout(scrollToOriginAnchor, MESSAGE_EXPAND_MS + 50)
    }
  }
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <UnsavedChangesGuard :dirty="dirty" />

    <CreationHeader
      :breadcrumb="[{ label: 'Forms', href: '/forms' }, { label: 'Error validation' }]"
      back-label="Back to Forms"
      @back="cancel"
      @navigate="cancel"
    />
    <!-- The scroll container the positional anchor measures against. -->
    <main
      ref="formScroll"
      class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto"
    >
      <form
        class="flex min-h-full flex-col"
        aria-label="Create application"
        novalidate
        @submit.prevent="submit"
      >
        <!-- Scrollable form body. No `gap`: every band below owns its own top
             space via `.layout-section-start` (= --layout-boundary-start, the same
             step the boundary puts above the first band). -->
        <div class="layout-column-form layout-boundary flex flex-1 flex-col">
          <!-- Demo scaffolding, deliberately outside the <fieldset> so it stays
               usable and reads as not-part-of-the-product. -->
          <aside
            aria-label="Scenario simulation"
            class="flex flex-col gap-(--spacing-md) rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-lg)"
          >
            <div class="flex flex-wrap items-center justify-between gap-(--spacing-sm)">
              <p class="m-0 text-overline-sm text-(--text-muted)">Simulation — the other user</p>
              <Tag
                :label="
                  deletedByOtherUser
                    ? `Deleted server-side: ${deletedByOtherUser}`
                    : 'Server in sync'
                "
                :severity="deletedByOtherUser ? 'danger' : 'success'"
                size="medium"
              />
            </div>
            <p class="m-0 text-body-sm text-(--text-muted)">
              You are User 1: the Application below is filled in and already linked to a Connector,
              four sections down. Have User 2 delete that Connector through the API — nothing will
              tell you, your copy of the list just goes stale. Then press Save, and watch the form
              take you to the one section that needs you.
            </p>
            <div class="flex flex-wrap items-center gap-(--spacing-sm)">
              <Button
                label="User 2 deletes the linked Connector"
                kind="outlined"
                size="medium"
                icon="pi pi-trash"
                :disabled="!!deletedByOtherUser || submitting"
                @click="simulateDelete"
              />
              <Button
                label="Reset scenario"
                kind="text"
                size="medium"
                :disabled="submitting"
                @click="resetScenario"
              />
            </div>
          </aside>

          <!-- One flag locks every control while the request is in flight. -->
          <fieldset
            class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">Create application</legend>

            <!-- Section 1: General -->
            <section class="flex flex-col gap-(--layout-group-gap)">
              <SectionHeading title="General" />
              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Name</Item.Title>
                        <Item.Description>
                          Give a unique and descriptive name to identify the Application.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <InputText
                            v-model="form.name"
                            size="large"
                            class="w-full"
                            aria-label="Name"
                            placeholder="My Application"
                            :required="!!errors.name"
                            :aria-describedby="errors.name ? 'ev-name-error' : undefined"
                            :disabled="submitting"
                            @update:model-value="errors.name = ''"
                          />
                          <HelperText
                            v-if="errors.name"
                            id="ev-name-error"
                            kind="required"
                            :label="errors.name"
                          />
                        </div>
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </section>

            <!-- Section 2: Delivery Settings -->
            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <SectionHeading title="Delivery Settings" />
              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item
                      size="small"
                      class="items-start"
                    >
                      <Item.Content>
                        <Item.Title>Protocol Usage</Item.Title>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <fieldset class="flex w-full flex-col gap-(--spacing-sm)">
                          <legend class="sr-only">Protocol Usage</legend>
                          <FieldRadioBlock
                            v-for="option in protocolUsageOptions"
                            :key="option.value"
                            v-model="form.protocolUsage"
                            :value="option.value"
                            name="protocolUsage"
                            :input-id="`ev-protocolUsage-${option.value}`"
                            :label="option.label"
                            :description="option.description"
                            :disabled="submitting"
                          />
                        </fieldset>
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>HTTP ports</Item.Title>
                        <Item.Description>
                          The ports the Application listens on for HTTP traffic.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <MultiSelect
                            v-model="form.httpPorts"
                            size="large"
                            class="w-full"
                            placeholder="Select ports"
                            :required="!!errors.httpPorts"
                            :display-value="portsLabel"
                            :disabled="submitting"
                            @update:model-value="errors.httpPorts = ''"
                          >
                            <MultiSelect.Trigger
                              id="ev-httpPorts"
                              aria-label="HTTP ports"
                              :aria-describedby="
                                errors.httpPorts ? 'ev-httpPorts-error' : undefined
                              "
                            />
                            <MultiSelect.Content>
                              <MultiSelect.Option
                                v-for="option in httpPortOptions"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </MultiSelect.Option>
                            </MultiSelect.Content>
                          </MultiSelect>
                          <HelperText
                            v-if="errors.httpPorts"
                            id="ev-httpPorts-error"
                            kind="required"
                            :label="errors.httpPorts"
                          />
                        </div>
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </section>

            <!-- Section 3: Modules -->
            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <SectionHeading title="Modules" />
              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Application Accelerator</Item.Title>
                        <Item.Description>
                          Optimize the delivery of dynamic content and enable advanced caching
                          rules.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end">
                        <Switch
                          v-model="form.applicationAccelerator"
                          aria-label="Application Accelerator"
                          :disabled="submitting"
                        />
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Edge Functions</Item.Title>
                        <Item.Description>
                          Run serverless functions at the edge, closer to your users.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end">
                        <Switch
                          v-model="form.edgeFunctions"
                          aria-label="Edge Functions"
                          :disabled="submitting"
                        />
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Image Processor</Item.Title>
                        <Item.Description>
                          Resize, crop, and convert images on the fly through URL parameters.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end">
                        <Switch
                          v-model="form.imageProcessor"
                          aria-label="Image Processor"
                          :disabled="submitting"
                        />
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Tiered Cache</Item.Title>
                        <Item.Description>
                          Add a second caching layer to reduce requests to the origin.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end">
                        <Switch
                          v-model="form.tieredCache"
                          aria-label="Tiered Cache"
                          :disabled="submitting"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </section>

            <!-- Section 4: Origin — owns the cross-module reference, and therefore
                 owns the server's rejection. It is also the SCROLL ANCHOR the
                 recovery targets (`scrollToOriginAnchor` measures this element). -->
            <section
              ref="originSection"
              class="layout-section-start flex flex-col gap-(--layout-group-gap)"
            >
              <!-- The field-scoped server rejection lands in the heading's `bottom`
                   slot: inside the section that needs attention, between its title
                   and the card holding the broken field. `Message severity="danger"`
                   renders role="alert", so it announces on arrival, and it carries
                   the one recovery action. It is NOT a validation summary — no
                   client validation ever writes here.

                   Two animations compose. SectionHeading owns the HEIGHT: the slot
                   region grows from a zero-height grid row, so the card below never
                   jumps. The Message owns its own travel: a productive translate-Y
                   on one axis — ENTER from +8px (rises into place, decelerating:
                   `ease-out`), EXIT to -8px (keeps rising, accelerating away:
                   `ease-in`), each paired with opacity, exit shorter than entrance.

                   That travel sits on a WRAPPER, not on <Message>: the component
                   sets an inline `transition: opacity …` on its own root, and an
                   inline style beats a utility class — it would clamp
                   `transition-property` to opacity and the translate would jump. -->
              <SectionHeading title="Origin">
                <template #bottom>
                  <Transition
                    enter-active-class="transition duration-150 ease-out motion-reduce:transition-none"
                    enter-from-class="translate-y-2 opacity-0"
                    enter-to-class="translate-y-0 opacity-100"
                    leave-active-class="transition duration-100 ease-in motion-reduce:transition-none"
                    leave-from-class="translate-y-0 opacity-100"
                    leave-to-class="-translate-y-2 opacity-0"
                  >
                    <div v-if="originError">
                      <Message
                        severity="danger"
                        :label="originError"
                      >
                        <template #action>
                          <Button
                            label="Reload connectors"
                            kind="secondary"
                            size="medium"
                            :loading="reloadingConnectors"
                            @click="reloadConnectors"
                          />
                        </template>
                      </Message>
                    </div>
                  </Transition>
                </template>
              </SectionHeading>

              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Connector</Item.Title>
                        <Item.Description>
                          The Edge Connector that serves this Application's content. Lives in the
                          Connectors module, so anyone on the account can change it.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <!-- The option list is arriving: reserve the trigger's
                               exact box (size="large" is 40px) so the row does not
                               reflow when the Select comes back. -->
                          <Skeleton
                            v-if="reloadingConnectors"
                            kind="shape"
                            width="100%"
                            height="40px"
                            aria-label="Loading connectors"
                          />
                          <template v-else>
                            <!-- Present-but-rejected → red `invalid`.
                                 Empty → amber `required`. Never both. -->
                            <Select
                              v-model="form.connectorId"
                              size="large"
                              class="w-full"
                              placeholder="Select a connector"
                              :display-value="connectorLabel"
                              :required="!!errors.connectorId && !form.connectorId"
                              :invalid="!!errors.connectorId && !!form.connectorId"
                              :disabled="submitting"
                              @update:model-value="onConnectorChange"
                            >
                              <Select.Trigger
                                id="ev-connector"
                                aria-label="Connector"
                                :aria-describedby="
                                  errors.connectorId ? 'ev-connector-error' : undefined
                                "
                              />
                              <Select.Content>
                                <Select.Option
                                  v-for="connector in connectors"
                                  :key="connector.value"
                                  :value="connector.value"
                                >
                                  {{ connector.label }}
                                </Select.Option>
                              </Select.Content>
                            </Select>
                            <HelperText
                              v-if="errors.connectorId"
                              id="ev-connector-error"
                              :kind="form.connectorId ? 'invalid' : 'required'"
                              :label="errors.connectorId"
                            />
                          </template>
                        </div>
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Host header</Item.Title>
                        <Item.Description>
                          Identify a virtualhost sent in the Host header to the origin.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <div class="flex w-full flex-col gap-(--spacing-xs)">
                          <InputText
                            v-model="form.hostHeader"
                            size="large"
                            class="w-full"
                            aria-label="Host header"
                            :required="!!errors.hostHeader"
                            :aria-describedby="
                              errors.hostHeader ? 'ev-hostHeader-error' : undefined
                            "
                            :disabled="submitting"
                            @update:model-value="errors.hostHeader = ''"
                          />
                          <HelperText
                            v-if="errors.hostHeader"
                            id="ev-hostHeader-error"
                            kind="required"
                            :label="errors.hostHeader"
                          />
                        </div>
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </section>

            <!-- Section 5: Cache Expiration Policies — untouched by the rejection,
                 which is the point of scoping the Message to one section. -->
            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <SectionHeading title="Cache expiration policies" />
              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Browser Maximum TTL (seconds)</Item.Title>
                        <Item.Description>
                          How long browsers may keep a cached response.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <InputNumber
                          v-model="form.browserMaxTtl"
                          size="large"
                          class="w-full"
                          :min="0"
                          :disabled="submitting"
                          aria-label="Browser maximum TTL in seconds"
                        />
                      </Item.Actions>
                    </Item>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Edge Maximum TTL (seconds)</Item.Title>
                        <Item.Description>
                          How long the edge may keep a cached response. Tiered Cache requires a TTL
                          of at least 3 seconds.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                        <InputNumber
                          v-model="form.edgeMaxTtl"
                          size="large"
                          class="w-full"
                          :min="0"
                          :disabled="submitting"
                          aria-label="Edge maximum TTL in seconds"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </section>

            <!-- Section 6: Debug Rules -->
            <section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
              <SectionHeading title="Debug Rules" />
              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item size="small">
                      <Item.Content>
                        <Item.Title>Active</Item.Title>
                        <Item.Description>
                          Rules that were successfully executed will be shown under the $traceback
                          field in Data Streaming and Real-Time Events or the $stacktrace variable
                          in GraphQL.
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions class="justify-end">
                        <Switch
                          v-model="form.debugRules"
                          aria-label="Active"
                          :disabled="submitting"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </CardBox>
            </section>
          </fieldset>
        </div>

        <!-- Sticky action bar. The webkit Button renders a native type="button"
             and does not forward a type, so submit is driven from its click; the
             sr-only submit keeps Enter working. -->
        <footer
          class="sticky bottom-0 z-10 border-t-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface)"
        >
          <div
            class="layout-column-form layout-boundary-inline flex items-center justify-end gap-(--spacing-sm) py-(--spacing-md)"
          >
            <Button
              type="button"
              label="Cancel"
              kind="outlined"
              size="medium"
              :disabled="submitting"
              @click="cancel"
            />
            <!-- Saving while the field's options are still arriving is incoherent,
                 so the reload flag gates Save too. -->
            <Button
              label="Save"
              kind="primary"
              size="medium"
              :loading="submitting"
              :disabled="reloadingConnectors"
              @click="submit"
            />
          </div>
        </footer>
        <button
          type="submit"
          class="sr-only"
          tabindex="-1"
          aria-hidden="true"
        >
          Save
        </button>
      </form>
    </main>
  </div>
</template>
