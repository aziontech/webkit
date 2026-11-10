<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import Hint from '../../inputs/hint/hint.vue'

  defineOptions({
    name: 'SettingsSection',
    inheritAttrs: false
  })

  interface Props {
    /** The band title, rendered as an h2. */
    title: string
    /** One-sentence guidance shown in a Hint glyph beside the title. */
    hint?: string
    /** Id of the h2 that a hash link targets; when set, a copy-link button appears in the gutter on hover or focus. */
    anchor?: string
    /** Turns the title into a disclosure that folds the band body. */
    collapsible?: boolean
    /** Glyph shown before the title of a collapsible band (e.g. `pi pi-cog`). */
    icon?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    hint: '',
    anchor: '',
    collapsible: false,
    icon: ''
  })

  const open = defineModel<boolean>('open', { default: false })

  defineSlots<{
    /** The band body, usually a flush Card of SettingRow rows. */
    default(): unknown
    /** Rich title content; replaces the title prop text inside the h2. */
    title(): unknown
  }>()

  const attrs = useAttrs()
  const regionId = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'layout-settings-section'
  )

  const expanded = computed(() => !props.collapsible || open.value)

  const copyLink = () => {
    globalThis.navigator?.clipboard
      ?.writeText(`${globalThis.location.href.split('#')[0]}#${props.anchor}`)
      .catch(() => undefined)
  }

  const toggle = () => {
    open.value = !open.value
  }
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-state="collapsible ? (open ? 'open' : 'closed') : undefined"
    class="flex min-w-0 flex-col gap-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)"
  >
    <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
      <button
        v-if="anchor"
        type="button"
        :data-testid="`${testId}__copy-link`"
        :aria-label="`Copy link to the ${title} section`"
        class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
        @click="copyLink"
      >
        <i
          class="pi pi-link text-body-xs"
          aria-hidden="true"
        />
      </button>
      <h2
        :id="anchor || undefined"
        :data-testid="`${testId}__title`"
        class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
      >
        <button
          v-if="collapsible"
          type="button"
          :data-testid="`${testId}__trigger`"
          :aria-expanded="open"
          :aria-controls="regionId"
          :data-state="open ? 'open' : 'closed'"
          class="group/disclosure -mx-(--spacing-xxs) flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xxs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
          @click="toggle"
        >
          <i
            v-if="icon"
            :class="icon"
            class="shrink-0 text-body-sm leading-none text-(--text-muted)"
            aria-hidden="true"
          />
          <slot name="title">{{ title }}</slot>
          <i
            class="pi pi-chevron-down shrink-0 text-body-xs leading-none text-(--text-muted) transition-transform duration-fast-02 ease-productive-entrance group-data-[state=open]/disclosure:rotate-180 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </button>
        <span
          v-else
          class="flex items-center gap-(--spacing-xs)"
        >
          <slot name="title">{{ title }}</slot>
        </span>
      </h2>
      <Hint
        v-if="hint"
        :text="hint"
        class="shrink-0"
      />
    </div>
    <div
      :id="regionId"
      :data-testid="`${testId}__body`"
      :data-open="expanded || null"
      :inert="!expanded || undefined"
      :aria-hidden="!expanded || undefined"
      class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
    >
      <div
        :data-collapsible="collapsible || null"
        class="min-w-0 data-collapsible:overflow-hidden"
      >
        <div
          :data-open="expanded || null"
          class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
        >
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>
