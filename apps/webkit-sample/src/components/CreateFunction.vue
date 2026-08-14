<script setup>
  // CreateFunction — the create page for a Function, and the ONE create in the console
  // that is not the generic renderer (../components/CreateResource.vue).
  //
  // WHY IT IS ITS OWN PAGE. Every other first-level resource is created by answering
  // questions: a name, a type, a couple of toggles. A function is not — the RESOURCE IS
  // THE CODE. Asking for it as one field among four, in a 12-row textarea inside a band,
  // is the create page saying the code is a detail of the form. It is the form. So the
  // editor gets the viewport, and the rest of `POST v4/workspace/functions` moves out of
  // its way:
  //
  //   the NAME  → into the commit bar, so the one required field is on screen from
  //               whichever tab the reader presses Save on;
  //   the ARGS  → their own editor, because `default_args` is JSON the reader writes,
  //               not a value they pick — the same tab the console gives them;
  //   the REST  → Main Settings (runtime, execution environment, status).
  //
  // THE FIELDS ARE THE CONSOLE'S, ONE FOR ONE. The body this page builds is the body the
  // console's own adapter builds — `{ name, code, runtime, execution_environment,
  // default_args, azion_form, active }` — and the tabs carry the same three groups
  // (Code · Arguments · Main Settings). Two deliberate differences, both stated where
  // they happen: the name is in the commit bar rather than in Main Settings, and the
  // Form Builder (`azion_form`: a JSON Schema that renders a form which writes the args)
  // is not built here — the args are written as JSON, which is what the endpoint receives
  // either way.
  //
  // The surface rule is untouched (../lib/surfaces.js): a first-level resource creates
  // on a PAGE, at `/functions/new`, linkable and reload-safe. What changes is the page's
  // shape, not where it lives — this is the create page a code resource asks for, not an
  // exemption from the rule.
  //
  // WHY THE PAGE DOES NOT SCROLL. It is `h-dvh` and the regions inside it are what
  // scroll: the editor scrolls its own document, the Settings tab scrolls its bands. An
  // editor that grows the page instead of scrolling itself would push the commit bar off
  // the bottom, and a code editor whose Save you have to scroll to find is not one. That
  // is also why the bar here is a hard-edged sibling rather than CreatePage's translucent
  // gradient: nothing passes under it, so there is no edge to soften.
  //
  // The FIELDS and their guidance are the same ones ../lib/create-resources.js declares
  // for this resource, and the editor opens on the same starter — one API truth, two
  // renderings of it.
  import Button from '@aziontech/webkit/button'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref, useId } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { FUNCTION_ARGS, FUNCTION_STARTER } from '../lib/create-resources'
  import { useBaseline } from '../lib/forms'
  import { RUNTIMES } from '../lib/functions'
  import MonacoEditor from './monaco-editor/monaco-editor.vue'
  import CreationHeader from './ui/CreationHeader.vue'
  import FunctionSettings from './ui/FunctionSettings.vue'
  import PageTabs from './ui/PageTabs.vue'
  import UnsavedChangesGuard from './ui/UnsavedChangesGuard.vue'

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow, so identity survives every hop —
  // the same contract CreatePage and CreationHeader keep.
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const TABS = [
    { value: 'code', label: 'Code' },
    { value: 'arguments', label: 'Arguments' },
    { value: 'settings', label: 'Main Settings' }
  ]

  const tab = ref('code')

  // The request body of `POST v4/workspace/functions`, one ref per property the endpoint
  // takes. `runtime` has a single value (`azion_js`) so it is not a ref — it is shown
  // locked and posted as a constant.
  const name = ref('')
  const code = ref(FUNCTION_STARTER)
  const args = ref(FUNCTION_ARGS)
  const executionEnvironment = ref('application')
  const active = ref(true)

  // A new function is written in JavaScript. The endpoint's other runtime (`azion_lua`)
  // exists on functions the platform already holds, but nothing here writes Lua, so the
  // create page states one runtime instead of asking a question with one useful answer.
  const RUNTIME = RUNTIMES.azion_js

  const saving = ref(false)

  // The leave guard's trigger (ui/UnsavedChangesGuard.vue). This page's fields are separate
  // refs rather than one reactive record, so the baseline reads them through a getter — a
  // ref inside a plain object serializes to its internals, not its value. `commit` runs on
  // the way OUT of a successful create, so the page's own navigation is not stopped by the
  // guard protecting the input that create just consumed.
  const { dirty, commit } = useBaseline(() => ({
    name: name.value,
    code: code.value,
    args: args.value,
    executionEnvironment: executionEnvironment.value,
    active: active.value
  }))

  // Validation runs on SUBMIT only — nothing is judged while the reader is still typing,
  // and an empty required field gets the amber `required` prompt rather than a red error.
  // The exception is the args editor: Monaco's JSON worker underlines a syntax error as
  // it is typed, which is the language server doing what it is for, not the form judging.
  const nameError = ref('')
  const codeError = ref('')
  const argsError = ref('')

  const titleId = useId()
  const nameId = useId()
  const nameMessageId = useId()

  const listPath = '/functions'

  const cancel = () => router.push({ path: listPath, query: { email: userEmail.value } })

  // A crumb with an href goes there; the current crumb is the same intent as Back.
  const onCrumb = (event, href) => {
    if (!href || href === '#') {
      cancel()
      return
    }
    router.push({ path: href, query: { email: userEmail.value } })
  }

  /** `default_args` is posted as an object, so what is typed has to parse. */
  const parsedArgs = () => {
    try {
      const value = JSON.parse(args.value)
      // `[1,2]` and `"x"` are valid JSON and invalid arguments: the endpoint takes an
      // object, and an array would be posted as one silently.
      if (value === null || Array.isArray(value) || typeof value !== 'object') return null
      return value
    } catch {
      return null
    }
  }

  /**
   * Points the reader at the field that is missing, on the tab that holds it. The name
   * lives in the bar and is always on screen; the code and the arguments live behind
   * tabs, so a failure there switches to the tab before marking it — a message on a tab
   * nobody is looking at is a failed submit with no visible cause. Later tabs are
   * switched to first, so the LEFTMOST failure is the one left on screen.
   */
  const validate = () => {
    nameError.value = name.value.trim() ? '' : 'This field is required.'
    codeError.value = code.value.trim() ? '' : 'This field is required.'
    argsError.value = parsedArgs() ? '' : 'Arguments must be a JSON object.'

    if (argsError.value) tab.value = 'arguments'
    if (codeError.value) tab.value = 'code'
    if (nameError.value) globalThis.document.getElementById(nameId)?.focus()

    return !nameError.value && !codeError.value && !argsError.value
  }

  /**
   * Stands in for `POST v4/workspace/functions`. The body is built here, in the
   * endpoint's own snake_case, so the page shows the request it would actually send.
   */
  const post = (body) => new Promise((resolve) => globalThis.setTimeout(() => resolve(body), 900))

  const save = async () => {
    if (saving.value) return // re-entrancy lock
    if (!validate()) return

    saving.value = true
    try {
      await post({
        name: name.value.trim(),
        code: code.value,
        runtime: RUNTIME.api,
        execution_environment: executionEnvironment.value,
        default_args: parsedArgs(),
        active: active.value
      })
      const created = name.value.trim()

      // The success toast CARRIES THE RESOURCE: it names what was created and its action
      // opens the surface that owns it. Creating is not deploying — this page writes the
      // function; running it on traffic is an instance on an application.
      toast.success(`${created} created.`, {
        action: {
          label: 'Open Functions',
          onClick: () => router.push({ path: listPath, query: { email: userEmail.value } })
        }
      })
      commit() // the create landed — the leave guard stands down
      router.push({ path: listPath, query: { email: userEmail.value } })
    } catch (error) {
      toast.error('Could not create the function.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => save() }
      })
    } finally {
      saving.value = false // release on success AND failure
    }
  }
</script>

<template>
  <div class="flex h-dvh flex-col bg-[var(--bg-canvas)]">
    <UnsavedChangesGuard :dirty="dirty" />

    <CreationHeader
      :breadcrumb="[{ label: 'Functions', href: listPath }, { label: 'Create function' }]"
      back-label="Back to Functions"
      @back="cancel"
      @navigate="onCrumb"
    />

    <main class="flex min-h-0 flex-1 flex-col">
      <form
        class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col"
        :aria-labelledby="titleId"
        novalidate
        @submit.prevent="save"
      >
        <!-- The page's <h1>, and the only thing on this page that is NOT rendered: the
             title is carried visually by the breadcrumb (every tabbed page in the console
             works that way), and a heading block here would spend the top of the viewport
             on a sentence to take it from the editor. Screen readers still get the page's
             name, and the form is labelled by it. -->
        <h1
          :id="titleId"
          class="sr-only"
        >
          Create function
        </h1>

        <!-- The second-level nav bar every module page uses. The three tabs are three
             views of ONE create, so they are tabs, not steps: nothing here has to be
             answered in order, and Save commits all three from any of them. -->
        <PageTabs
          v-model:value="tab"
          :tabs="TABS"
        />

        <!-- One flag locks every control while the request is in flight. The bar's own
             name field sits outside this fieldset, so it takes `:disabled` directly. -->
        <fieldset
          class="m-0 flex min-h-0 flex-1 flex-col border-0 p-0"
          :disabled="saving"
        >
          <legend class="sr-only">Create function</legend>

          <!-- `v-show`, not `v-if`: Monaco owns undo history, cursor and folding state,
               and unmounting the editor on every tab switch throws all three away. Hidden
               is the correct state for a document the reader is coming back to. -->
          <div
            v-show="tab === 'code'"
            class="layout-boundary flex min-h-0 flex-1 flex-col"
          >
            <!-- The code measure is FLUID: this is the densest surface in the console and
                 a form measure would cap it at 56rem of the viewport's width for no reason.
                 `fill` is what makes the editor take the region instead of a fixed height. -->
            <MonacoEditor
              v-model="code"
              fill
              pad-line-numbers
              size="small"
              language="javascript"
              path="main.js"
              :invalid="!!codeError"
              :helper-text="codeError"
              :disabled="saving"
              aria-label="Function code"
              data-testid="create-function-code"
              @update:model-value="codeError = ''"
            />
          </div>

          <!-- ARGUMENTS. `default_args` is a JSON object every instance of this function
               starts from, so it is written, not picked — the same editor as the code, in
               the JSON grammar, which is what gives it Monaco's own live syntax
               diagnostics. The submit check is the stricter one the endpoint needs: valid
               JSON is not enough, it has to be an OBJECT. -->
          <div
            v-show="tab === 'arguments'"
            class="layout-boundary flex min-h-0 flex-1 flex-col gap-[var(--spacing-sm)]"
          >
            <p class="text-body-sm text-[var(--text-muted)]">
              Default arguments for every instance of this function. An instance can override them
              with its own.
            </p>
            <MonacoEditor
              v-model="args"
              fill
              pad-line-numbers
              size="small"
              language="json"
              path="args.json"
              :invalid="!!argsError"
              :helper-text="argsError"
              :disabled="saving"
              aria-label="Default arguments, as JSON"
              data-testid="create-function-args"
              @update:model-value="argsError = ''"
            />
          </div>

          <div
            v-show="tab === 'settings'"
            class="min-h-0 flex-1 overflow-auto"
          >
            <!-- The settings ARE a form, so they take the form measure and the same band
                 rhythm every other create page uses — the tab beside the editor is not a
                 second design, it is the console's create page with the code lifted out. -->
            <div class="layout-column-form layout-boundary flex min-w-0 flex-col">
              <!-- The three bands, shared with the detail page so a function's
                   settings cannot read one way while it is being written and another
                   once it exists (ui/FunctionSettings.vue). -->
              <FunctionSettings
                v-model:execution-environment="executionEnvironment"
                v-model:active="active"
                :runtime-label="RUNTIME.label"
                :disabled="saving"
              />
            </div>
          </div>
        </fieldset>

        <!-- THE COMMIT BAR. `h-14` is the same height as the header above, so the page is
             bracketed by two bands of equal height. It carries the NAME because the name is
             the only field that has to be answered and the editor is where the reader
             spends the whole task: asking for it on a tab would mean a Save that fails for
             a reason on the other screen. -->
        <footer class="shrink-0 border-t border-[var(--border-default)] bg-[var(--bg-canvas)]">
          <!-- `min-h-14` rather than `h-14`: at the desktop widths this page is written
               for, the row fits on one line and the bar IS 56px. Below that it wraps and
               grows instead of pushing Save off the edge — a commit bar that overflows is
               a commit you cannot reach. -->
          <div
            class="layout-boundary-inline flex min-h-14 flex-wrap items-center gap-[var(--spacing-sm)] py-[var(--spacing-xxs)]"
          >
            <div class="mr-auto flex min-w-0 flex-1 items-center gap-[var(--spacing-sm)]">
              <!-- No required marker: this page follows the console's validation model —
                   nothing is judged while the reader is still typing, and the amber
                   prompt on a failed submit is where "required" is said. -->
              <Label
                :for="nameId"
                label="Name"
                class="shrink-0"
              />
              <InputText
                :id="nameId"
                v-model="name"
                size="medium"
                placeholder="my-function"
                class="w-full min-w-0 max-w-[var(--container-3xs)]"
                autocomplete="off"
                :required="!!nameError"
                :aria-describedby="nameError ? nameMessageId : undefined"
                :disabled="saving"
                @update:model-value="nameError = ''"
              />
              <!-- The message sits BESIDE the field, not under it: a bar of fixed height
                   that grows on a failed submit moves the commit buttons out from under
                   the pointer that just pressed one. -->
              <HelperText
                v-if="nameError"
                :id="nameMessageId"
                kind="required"
                :label="nameError"
                class="shrink-0"
              />
            </div>

            <!-- The pair wraps as one unit: Cancel and Save never end up on different
                 lines from each other. -->
            <div class="flex shrink-0 items-center gap-[var(--spacing-sm)]">
              <Button
                type="button"
                label="Cancel"
                kind="outlined"
                size="medium"
                :disabled="saving"
                @click="cancel"
              />
              <!-- The webkit Button renders a native type="button" and does not forward a
                   type, so submit is driven from its click; the sr-only submit below keeps
                   Enter working. -->
              <Button
                label="Save"
                kind="primary"
                size="medium"
                :loading="saving"
                @click="save"
              />
            </div>
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
