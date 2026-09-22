<script setup>
  // THE HOST QUESTION, AS THE FIRST SCREEN.
  //
  // A function and a connector do nothing until an application holds them and a rule names
  // them (../../lib/data/create-bindings.js). That is not a detail of the form — it decides
  // where the create ENDS — so the create page opens on it: one column, the object being
  // made, and the applications it can run on.
  //
  // THE COLUMN ITSELF is ./HostChooser.vue, shared with the first step of the stepped create
  // page (./DependencyStep.vue) so the same question is never asked in two shapes. What this
  // file still owns is the SCREEN around it: the creation header, the crumb trail, and the
  // scrolling frame that keeps a short window from cutting off the first rows.
  import { computed } from 'vue'

  import CreationHeader from '../page/CreationHeader.vue'
  import HostChooser from './HostChooser.vue'

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

  const chooser = computed(() => ({
    title: props.title,
    icon: props.icon,
    noun: props.noun,
    hostIcon: props.hostIcon,
    options: props.options,
    canCreate: props.canCreate,
    emptyLabel: props.emptyLabel
  }))
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
      <HostChooser
        v-bind="chooser"
        class="m-auto"
        @choose="(choice) => emit('choose', choice)"
        @skip="emit('skip')"
        @empty-action="emit('empty-action')"
      />
    </main>
  </div>
</template>
