<script setup>
  // THE HOST QUESTION, AS THE FIRST SCREEN.
  //
  // A function and a connector do nothing until an application holds them and a rule names
  // them (../../lib/data/create-bindings.js). That is not a detail of the form — it decides
  // where the create ENDS — so the create page opens on it: one column, the object being
  // made, and the applications it can run on.
  //
  // IT IS A CHOOSER, NOT A FORM. No segmented control, no switch: the list IS the question,
  // and the two answers a reader can give sit in the same list — pick one of theirs, or
  // `Create Application`, which turns the row into a name field rather than sending them to
  // another screen. Typing narrows; what was typed seeds the new name, so a search that
  // found nothing is already half of the create it turns into.
  //
  // THE WAY PAST IT IS A ROW TOO, and deliberately the quietest thing on the screen. A
  // resource written now and bound later is a real thing to want — a function drafted
  // before anyone has decided where it runs, a connector made ahead of the application
  // that will fetch through it — so the gate is friction, not a wall. What it costs is
  // stated where it is taken: the form behind it says the resource is bound to nothing and
  // what that means (./ApplicationBindingSummary.vue), which is the honest version of
  // letting someone past.
  //
  // An account with NO host is the one case the screen cannot answer at all, and it is not
  // a dead end either: making one has its own front door, and that is where the reader
  // goes.
  import Button from '@aziontech/webkit/button'
  import InputText from '@aziontech/webkit/input-text'
  import { computed, nextTick, ref, useId, watch } from 'vue'

  import CreationHeader from '../page/CreationHeader.vue'

  const props = defineProps({
    /** The create this gate belongs to, worded exactly as its page is titled. */
    title: { type: String, required: true },
    /** The glyph of the object being created — what the tile above the title carries. */
    icon: { type: String, default: 'pi pi-box' },
    /** The host being chosen, lowercase singular — `application`, `firewall`. */
    noun: { type: String, default: 'application' },
    /** The host's own glyph, on every row. */
    hostIcon: { type: String, default: 'ai ai-edge-application' },
    /** The hosts on offer: `{ value, label, description }`. */
    options: { type: Array, default: () => [] },
    /** Whether a host can be named right here. False when making one is its own create. */
    canCreate: { type: Boolean, default: true },
    /** Where the reader goes when they have no host to pick — and what to call it. */
    emptyLabel: { type: String, default: '' },
    /** The crumb trail, same as the page behind it. */
    breadcrumb: { type: Array, default: () => [] },
    /** Accessible label for the header's back button. */
    backLabel: { type: String, default: 'Back' }
  })

  const emit = defineEmits(['choose', 'skip', 'empty-action', 'back', 'navigate'])

  const query = ref('')
  const creating = ref(false)
  const newName = ref('')
  const nameField = ref(null)
  const titleId = useId()
  const nameId = useId()

  // A chooser, not the module's list: it shows a handful and the field is how the rest are
  // reached. A list that grows past the fold puts `Create Application` — the other answer —
  // where nobody sees it.
  const VISIBLE = 6

  const Noun = computed(() => props.noun.charAt(0).toUpperCase() + props.noun.slice(1))

  const matches = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return props.options
    return props.options.filter((option) =>
      [option.label, option.description].some((field) => (field ?? '').toLowerCase().includes(term))
    )
  })

  const visible = computed(() => matches.value.slice(0, VISIBLE))
  const hidden = computed(() => Math.max(0, matches.value.length - VISIBLE))

  const choose = (option) => emit('choose', { mode: 'existing', name: option.value })

  // What was typed is what the reader was looking for, so it opens the create branch as
  // the name — the search that found nothing becomes the answer.
  const startCreating = () => {
    newName.value = query.value.trim()
    creating.value = true
    nextTick(() => nameField.value?.focus?.())
  }

  const cancelCreating = () => {
    creating.value = false
    newName.value = ''
  }

  const confirmCreating = () => {
    const name = newName.value.trim()
    if (!name) return
    emit('choose', { mode: 'new', name })
  }

  // Enter takes the first row, the way a command palette does: the reader who typed enough
  // to narrow the list to what they meant should not have to reach for the pointer.
  const onSearchEnter = () => {
    if (matches.value.length) {
      choose(matches.value[0])
      return
    }
    if (props.canCreate) startCreating()
  }

  watch(query, () => {
    if (creating.value) cancelCreating()
  })
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <CreationHeader
      :breadcrumb="breadcrumb"
      :back-label="backLabel"
      @back="emit('back')"
      @navigate="(event, href) => emit('navigate', event, href)"
    />

    <!-- The column is centred in what is left of the viewport and scrolls when it cannot
         fit — a chooser that centres itself off the top of a short window is a list whose
         first rows cannot be reached. -->
    <main
      class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col items-center overflow-auto px-(--spacing-md) py-(--spacing-xl)"
    >
      <section
        class="m-auto flex w-full max-w-(--container-2xs) flex-col items-center gap-(--spacing-lg)"
        :aria-labelledby="titleId"
      >
        <header class="flex flex-col items-center gap-(--spacing-xs) text-center">
          <span
            class="flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
          >
            <i
              :class="icon"
              class="text-[1.125rem] leading-none text-(--text-default)"
              aria-hidden="true"
            />
          </span>
          <h1
            :id="titleId"
            class="text-heading-xs text-(--text-default)"
          >
            {{ title }}
          </h1>
          <p class="text-body-sm text-(--text-muted)">Choose {{ noun === 'application' ? 'an' : 'a' }} {{ noun }} to continue</p>
        </header>

        <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
          <InputText
            v-model="query"
            size="large"
            class="w-full"
            :placeholder="`Find ${noun}…`"
            :aria-label="`Find ${noun}`"
            autocomplete="off"
            @keydown.enter.prevent="onSearchEnter"
          />

          <!-- CREATING — the same row the reader pressed, opened into the one field a new
               application takes. It replaces the list rather than sitting over it: the
               question is answered either way, and two live answers on screen would be two
               things to undo. -->
          <div
            v-if="creating"
            class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
          >
            <label
              :for="nameId"
              class="text-label-md text-(--text-default)"
              >New {{ noun }}</label
            >
            <InputText
              :id="nameId"
              ref="nameField"
              v-model="newName"
              size="large"
              class="w-full"
              :placeholder="`my-${noun}`"
              autocomplete="off"
              @keydown.enter.prevent="confirmCreating"
            />
            <div class="flex items-center justify-end gap-(--spacing-sm)">
              <Button
                type="button"
                label="Back"
                kind="text"
                size="medium"
                @click="cancelCreating"
              />
              <Button
                type="button"
                label="Continue"
                kind="primary"
                size="medium"
                :disabled="!newName.trim()"
                @click="confirmCreating"
              />
            </div>
          </div>

          <!-- THE LIST, and the create row inside it. `Create Application` is the last row
               and not a button beside the field, because it is one more answer to the same
               question — which is what the row geometry says.

               Rows are undivided and hover-filled rather than ruled: this is a chooser, not
               a table of records, and a rule between two names implies they are columns of
               something. -->
          <div
            v-else
            class="flex flex-col"
          >
            <button
              v-for="option in visible"
              :key="option.value"
              type="button"
              class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
              @click="choose(option)"
            >
              <i
                :class="hostIcon"
                class="shrink-0 text-[1rem] leading-none text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="min-w-0 flex-1 truncate text-body-md text-(--text-default)">
                {{ option.label }}
              </span>
            </button>

            <!-- What the field is for, said once, where the list stops. -->
            <p
              v-if="hidden"
              class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
            >
              {{ hidden }} more — type to narrow.
            </p>

            <p
              v-else-if="!matches.length && options.length"
              class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
            >
              No {{ noun }} matches “{{ query.trim() }}”.
            </p>

            <!-- THE ACCOUNT HAS NONE. The one state this screen cannot answer on its own,
                 and the only case where "create without one" comes up at all — so it is
                 not offered: making the host is a task with its own front door, and this
                 sends the reader to it. -->
            <p
              v-else-if="!options.length"
              class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
            >
              This account has no {{ noun }} yet.
            </p>

            <button
              v-if="canCreate"
              type="button"
              class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
              @click="startCreating"
            >
              <i
                class="pi pi-plus shrink-0 text-[0.875rem] leading-none text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="min-w-0 flex-1 truncate text-body-md text-(--text-default)">
                Create {{ Noun }}
              </span>
            </button>
          </div>
        </div>

        <div class="flex flex-col items-center gap-(--spacing-xxs)">
          <!-- WHERE THE MISSING ANSWER IS MADE — not a way past the question. Shown when
               there is nothing to pick, or when this host cannot be named here at all. -->
          <Button
            v-if="emptyLabel && (!options.length || !canCreate)"
            type="button"
            :label="emptyLabel"
            kind="text"
            size="small"
            @click="emit('empty-action')"
          />

          <!-- PAST the question. Always available and always quiet: it is the answer a
               reader gives when they have not decided yet, not one the screen recommends. -->
          <Button
            type="button"
            :label="`Continue without ${noun === 'application' ? 'an' : 'a'} ${noun}`"
            kind="text"
            size="small"
            @click="emit('skip')"
          />
        </div>
      </section>
    </main>
  </div>
</template>
