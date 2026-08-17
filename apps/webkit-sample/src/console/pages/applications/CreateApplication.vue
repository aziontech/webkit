<script setup>
  // The Applications module "create" flow — a dedicated PAGE (route
  // /applications/new), sidebar hidden so the form is the only focus.
  //
  // WHERE SAVE LEADS. Creating an application creates a CHAIN: the application plus
  // the Workload that publishes it, the Connector it reads from and the Storage bucket
  // holding its assets (src/lib/provisioning.js — the four resources `azion deploy`
  // creates). Nothing about that chain serves traffic until a DEPLOYMENT binds it —
  // and Save does NOT start one. Creating is not deploying: publishing spends real
  // infrastructure, and a button labelled "Save" must not do it as a side effect.
  // Save creates, then hands back a toast that carries the resource — the
  // confirmation names what was created and its action opens it — and lands on the
  // module list. Deploying stays an explicit act, from the application itself.
  //
  // The FIELDS are exactly the body of POST /v4/workspace/applications — `name`,
  // the four `modules` toggles, `active` and `debug`, nothing else. `form` is keyed
  // by the API's own names (snake_case inside `modules`) because this object IS the
  // request body; `payload()` only nests each module flag into its `{ enabled }`
  // object, so the shape sent is readable straight off the state.
  //
  // THE BANDS ARE ORDERED BY HOW LIKELY THE DECISION IS. The endpoint requires
  // exactly ONE field — `name`; `active`, `debug` and every `modules` flag are
  // optional and already carry the endpoint's own defaults. But "optional" is not
  // one bucket: the modules are what the person creating an application came here to
  // choose, while `active` and `debug` are flags almost nobody touches at creation
  // time. So General leads, Modules stays open, and Advanced — those two flags —
  // is collapsed and last. Nothing the endpoint REQUIRES is ever inside the
  // disclosure, so a failed submit always points at a field already on screen.
  //
  // Layout is the IN-PAGE create form (`/forms/in-page`), the same anatomy as an
  // application's Build tab: the form measure, one `<fieldset>` locking the scope,
  // and bands made of a Section (title + hint) over a flush CardBox whose body is an
  // Item.List. Every field is a small Item row (`size="small"`) — the Item.Title IS
  // the label, guidance goes in Item.Description, the control sits right via
  // Item.Actions — a switch lives in that cell, never loose on the page.
  //
  // Accessibility (the `/webkit-form` skill):
  //   - the Item.Title names each field; the control carries an aria-label so it has
  //     an accessible name (no <Label for> — that's reserved for Fields-separated);
  //   - the disclosure is the Section's own heading button, so it ships
  //     `aria-expanded` + `aria-controls`, and the collapsed region is `inert` —
  //     nobody can tab into a field they cannot see;
  //   - validation runs on submit only; with no Label the feedback is a HelperText
  //     under the control. `name` is the only required field, so the state is amber
  //     `required` (required is NOT an error — never the red `invalid`), rendered on
  //     submit and cleared as the user edits. No error-summary;
  //   - one `submitting` flag locks the whole scope (the /webkit-ui-states Pattern 1
  //     lock): the outer <fieldset :disabled> is the NATIVE safety net, and every
  //     control ALSO takes :disabled off the same flag — a fieldset blocks
  //     interaction for the whole subtree but each webkit control renders its
  //     disabled VISUAL from its own prop, so the fieldset alone would leave the
  //     controls looking live mid-submit. The lock is the PROP everywhere; no page
  //     ever hand-styles a locked control. Save carries :loading (webkit Button
  //     suppresses its own click while loading); request errors toast.
  import CardBox from '@aziontech/webkit/card-box'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { provisionDeployment } from '@shared/lib/provisioning'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import CreatePage from '../../components/page/CreatePage.vue'
  import Section from '../../components/page/Section.vue'
  import { useBaseline } from '../../lib/behavior/forms'

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // --- Form state ----------------------------------------------------------
  // One property per field the create endpoint accepts. The defaults are the
  // endpoint's own defaults: Cache and Functions ship on, the two paid-feature
  // modules ship off, the application is created active and undebugged. Because
  // they ARE the endpoint's defaults, submitting the form untouched sends exactly
  // what the API would have applied on its own — which is what lets every one of
  // them sit behind the disclosure.
  const form = reactive({
    name: '',
    modules: {
      application_accelerator: false,
      cache: true,
      device_detection: false,
      functions: true,
      image_processor: false,
      load_balancer: false,
      web_socket_proxy: false
    },
    active: true,
    debug: false
  })

  // The optional application-level flags, in the order Main Settings lists them so a
  // created application reads the same when it is edited. `key` indexes `form`.
  const behaviorFields = [
    {
      key: 'active',
      title: 'Active',
      description:
        'When disabled, the Application is created but stops serving traffic at the edge.'
    },
    {
      key: 'debug',
      title: 'Debug',
      description: 'Expose executed rules in $traceback and $stacktrace.'
    }
  ]

  // The module catalog, in the SAME order and with the same copy as an
  // application's Main Settings, so a created application reads identically the
  // first time it is edited. `key` indexes `form.modules`.
  //
  // Two tiers, and the difference is not cosmetic: `defaultModules` ship on every
  // plan and are user-toggleable here; `subscriptionModules` are paid add-ons that
  // cannot be switched on by the person filling in this form at all — activating one
  // is a sales conversation. So their switch is disabled, a Tooltip on it says why,
  // and the row itself carries the way FORWARD (a real link to contact sales),
  // because a tooltip panel is `pointer-events-none` and can never hold one.
  const defaultModules = [
    {
      key: 'application_accelerator',
      title: 'Application Accelerator',
      description: 'Optimize protocols and manage dynamic content delivery.'
    },
    {
      key: 'cache',
      title: 'Cache',
      description: 'Customize advanced cache settings.'
    },
    {
      key: 'device_detection',
      title: 'Device Detection',
      description: 'Activate DeviceAtlas variables to configure responsive rules.'
    },
    {
      key: 'functions',
      title: 'Functions',
      description: 'Build ultra-low latency functions that run on the edge.'
    },
    {
      key: 'image_processor',
      title: 'Image Processor',
      description: 'Enable dynamic image editing options.'
    },
    {
      key: 'load_balancer',
      title: 'Load Balancer',
      description:
        'Balance traffic to your origins ensuring reliability and network congestion control.'
    }
  ]

  const subscriptionModules = [
    {
      key: 'web_socket_proxy',
      title: 'WebSocket Proxy',
      description:
        'Enhance real-time data exchange between your Application and backend services using the WebSocket protocol.'
    }
  ]

  const CONTACT_SALES = 'https://www.azion.com/en/contact-sales/'

  // Per-field error messages. Empty string = valid.
  const errors = reactive({
    name: ''
  })

  // One flag locks the whole scope while the request is in flight.
  const submitting = ref(false)

  // The leave guard's trigger (ui/UnsavedChangesGuard.vue, mounted by CreatePage): dirty
  // while the form diverges from the state it opened on. `commit` re-snapshots it, and is
  // called on the way OUT of a successful create — the page's own navigation must not be
  // stopped by the guard that exists to protect the input that create just consumed.
  const { dirty, commit } = useBaseline(form)

  // --- Validation ----------------------------------------------------------
  // Runs on submit only. A non-empty error flag drives the field's `required`
  // indicator — the feedback IS the field, rendered as a result of the submit and
  // cleared as the user edits. `name` is the endpoint's only required field, which
  // is also why no submit can ever fail on something inside the disclosure.
  const validate = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    return !errors.name
  }

  // The request body, exactly as POST /v4/workspace/applications expects it: each
  // module flag nested under its own `{ enabled }` object.
  const payload = () => ({
    name: form.name.trim(),
    modules: Object.fromEntries(
      Object.entries(form.modules).map(([key, enabled]) => [key, { enabled }])
    ),
    active: form.active,
    debug: form.debug
  })

  const cancel = () => router.push({ path: '/applications', query: { email: userEmail.value } })

  const submit = async () => {
    if (submitting.value) return // re-entrancy lock

    // Validation feedback is on the fields themselves (required + :invalid).
    if (!validate()) return

    // Lock the scope off one flag (usability Pattern 1): Save shows :loading and
    // every field is :disabled while the create request is in flight.
    submitting.value = true
    try {
      const application = payload()
      await new Promise((resolve) => setTimeout(resolve, 900))

      // CREATING AN APPLICATION CREATES A CHAIN. An application is code and
      // configuration; on its own it serves nobody. What makes it reachable is the
      // rest of what Azion provisions around it — a Workload (the public entry point:
      // domain, TLS, infrastructure), a Connector (where it reads from) and a Storage
      // bucket (its static assets) — the same four resources `azion deploy` creates
      // and the same registry every list in this console reads
      // (src/lib/provisioning.js).
      const record = provisionDeployment({
        repoName: application.name,
        framework: 'vue',
        templateTitle: application.name
      })

      // CREATING IS NOT DEPLOYING. Save creates the application and stops there —
      // nothing is published until the user asks for it. Deciding to deploy on the
      // user's behalf spends real infrastructure on an intent they never stated, and
      // it makes the one irreversible-looking thing on the page a side effect of a
      // button labelled "Save".
      //
      // So the outcome is a toast that CARRIES THE RESOURCE: the confirmation names
      // what was created and its action opens it, which is the whole reason someone
      // reads a success toast. Without that link the user lands on a list and has to
      // find the row they just made.
      toast.success(`Application "${application.name}" created.`, {
        description: application.active
          ? 'Deploy it when you are ready to serve traffic.'
          : 'Created inactive, so it serves no traffic until you activate it.',
        action: {
          label: 'Open application',
          onClick: () =>
            router.push({
              path: `/applications/${record.application.id}`,
              query: { email: userEmail.value }
            })
        }
      })

      // The create landed: nothing is pending any more, so the leave guard stands down
      // before this page navigates on its own success.
      commit()

      // The module list, where the new application is the first row.
      router.push({ path: '/applications', query: { email: userEmail.value } })
    } catch (error) {
      // Request-level failure → toast with a way to recover. Never silent.
      toast.error('Could not create the application.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false // release on success AND failure
    }
  }
</script>

<template>
  <CreatePage
    :breadcrumb="[
      { label: 'Applications', href: '/applications' },
      { label: 'Create Application' }
    ]"
    back-label="Back to Applications"
    title="Create Application"
    description="An application is the code and configuration served at the edge. Saving creates it and the workload that publishes it; nothing serves traffic until you deploy."
    title-id="create-application-title"
    :submitting="submitting"
    :dirty="dirty"
    @cancel="cancel"
    @submit="submit"
  >
    <Section
      stacked
      :divided="false"
      title="General"
      hint="The only field this endpoint requires. Everything below it already carries a working default."
    >
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
                <!-- Empty-required → amber `required` HelperText (not red). -->
                <div class="flex w-full flex-col gap-(--spacing-xs)">
                  <InputText
                    v-model="form.name"
                    size="large"
                    class="w-full"
                    aria-label="Name"
                    placeholder="My Application"
                    :disabled="submitting"
                    :required="!!errors.name"
                    :aria-describedby="errors.name ? 'app-name-error' : undefined"
                    @update:model-value="errors.name = ''"
                  />
                  <HelperText
                    v-if="errors.name"
                    id="app-name-error"
                    kind="required"
                    :label="errors.name"
                  />
                </div>
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </CardBox>
    </Section>

    <!-- The nested `modules` object, as its own band: optional to the
           endpoint, but it is what the person creating an application came
           here to choose, so it stays open. Two tiers in one card — the
           default modules, then a muted label row and the paid add-ons, which
           is how Main Settings groups them too. -->
    <Section
      stacked
      :divided="false"
      title="Modules"
      hint="The capabilities this application runs with. Cache and Functions are on by default, and every module can be changed later in Main Settings."
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <Item
              v-for="mod in defaultModules"
              :key="mod.key"
              size="small"
            >
              <Item.Content>
                <Item.Title>{{ mod.title }}</Item.Title>
                <Item.Description>{{ mod.description }}</Item.Description>
              </Item.Content>
              <Item.Actions class="justify-end">
                <Switch
                  v-model="form.modules[mod.key]"
                  :aria-label="mod.title"
                  :disabled="submitting"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </CardBox>
    </Section>

    <!-- Subscription modules are their own band, not a labelled group inside
           Modules: nothing here is a decision this form can make. The rows
           above are switches the user flips; these are a different KIND of
           thing — locked capabilities with a sales path — and a muted divider
           row inside one card asked the reader to notice that from a label
           alone. -->
    <Section
      stacked
      :divided="false"
      title="Subscription modules"
      hint="Paid add-ons. They cannot be switched on from this form — activating one starts with a conversation with sales."
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <Item
              v-for="mod in subscriptionModules"
              :key="mod.key"
              size="small"
            >
              <Item.Content>
                <Item.Title>{{ mod.title }}</Item.Title>
                <Item.Description>
                  {{ mod.description }}
                  <!-- The way forward lives on the ROW, not in the tooltip:
                         a Tooltip panel is `pointer-events-none`, so a link
                         inside one can never be clicked or tabbed to. -->
                  <a
                    :href="CONTACT_SALES"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                  >
                    Contact sales
                    <i
                      class="pi pi-external-link shrink-0 text-[0.9em] leading-none"
                      aria-hidden="true"
                    />
                  </a>
                </Item.Description>
              </Item.Content>
              <Item.Actions class="justify-end">
                <!-- Disabled, with the reason on hover/focus. The switch is
                       not something this form can turn on — activation is a
                       sales conversation — so it states that rather than
                       pretending to be interactive. -->
                <Tooltip text="Contact sales to activate this module.">
                  <Switch
                    v-model="form.modules[mod.key]"
                    disabled
                    :aria-label="mod.title"
                  />
                </Tooltip>
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </CardBox>
    </Section>

    <!-- Last, and collapsed: the two application-level flags that already
           carry the endpoint's defaults. Section owns the trigger semantics
           (`aria-expanded`/`aria-controls`), the height transition and `inert`
           while closed, so no hidden field is ever tabbable. Nothing required
           is in here — a failed submit always points at a visible field. -->
    <Section
      stacked
      collapsible
      :divided="false"
      icon="pi pi-cog"
      title="Advanced"
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <Item
              v-for="field in behaviorFields"
              :key="field.key"
              size="small"
            >
              <Item.Content>
                <Item.Title>{{ field.title }}</Item.Title>
                <Item.Description>{{ field.description }}</Item.Description>
              </Item.Content>
              <Item.Actions class="justify-end">
                <Switch
                  v-model="form[field.key]"
                  :aria-label="field.title"
                  :disabled="submitting"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </CardBox>
    </Section>
  </CreatePage>
</template>
