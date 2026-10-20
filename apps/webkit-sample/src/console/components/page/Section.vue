<script setup lang="ts">
  import Hint from '@aziontech/webkit/hint'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref, useId } from 'vue'
  import { useRoute } from 'vue-router'


  interface Props {
    title?: string
    icon?: string
    hint?: string
    stacked?: boolean
    divided?: boolean
    anchor?: boolean
    collapsible?: boolean
    defaultOpen?: boolean
    titleId?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    icon: '',
    hint: '',
    stacked: false,
    divided: true,
    anchor: false,
    collapsible: false,
    defaultOpen: false
  })

  defineSlots<{
    aside(): unknown
    default(): unknown
  }>()

  const route = useRoute()

  const open = ref(props.defaultOpen)
  const isOpen = computed(() => !props.collapsible || open.value)

  const regionId = useId()

  const anchorId = computed(() => {
    if (props.titleId) return props.titleId
    if (!props.anchor) return undefined
    return props.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  })

  const anchorUrl = computed(
    () => `${globalThis.location?.origin ?? ''}${route.fullPath.split('#')[0]}#${anchorId.value}`
  )

  const copyAnchor = async () => {
    try {
      await globalThis.navigator?.clipboard?.writeText(anchorUrl.value)
      toast.success('Link copied.')
    } catch {
      toast.error('Could not copy the link.')
    }
  }

</script>

<template>
  <section
    :data-stacked="stacked || null"
    :data-divided="divided || null"
    class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
  >
    <div
      v-if="title || hint || $slots.aside"
      :data-stacked="stacked || null"
      class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
    >
      <div
        v-if="title"
        class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)"
      >
        <button
          v-if="anchor"
          type="button"
          :aria-label="`Copy link to the ${title} section`"
          class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
          @click="copyAnchor"
        >
          <i
            class="pi pi-link text-body-xs"
            aria-hidden="true"
          />
        </button>
        <h2
          :id="anchorId"
          class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
        >
          <button
            v-if="collapsible"
            type="button"
            :aria-expanded="open"
            :aria-controls="regionId"
            :data-state="open ? 'open' : 'closed'"
            class="group/disclosure -mx-(--spacing-xxs) flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xxs) text-left text-[length:inherit] font-[inherit] leading-[inherit] transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
            @click="open = !open"
          >
            <i
              v-if="icon"
              :class="icon"
              class="shrink-0 text-body-sm leading-none text-(--text-muted)"
              aria-hidden="true"
            />
            {{ title }}
            <i
              class="pi pi-chevron-down shrink-0 text-body-xs leading-none text-(--text-muted) transition-transform duration-fast-02 ease-productive-entrance group-data-[state=open]/disclosure:rotate-180 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </button>
          <span
            v-else
            class="flex items-center gap-(--spacing-xs)"
          >
            <i
              v-if="icon"
              :class="icon"
              class="shrink-0 text-body-sm leading-none text-(--text-muted)"
              aria-hidden="true"
            />
            {{ title }}
          </span>
        </h2>
        <Hint
          v-if="hint"
          :text="hint"
          class="shrink-0"
        />
      </div>
      <slot name="aside" />
    </div>

    <div
      :id="collapsible ? regionId : undefined"
      :data-open="isOpen || null"
      :inert="!isOpen || undefined"
      :aria-hidden="!isOpen || undefined"
      class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
    >
      <div
        :data-collapsible="collapsible || null"
        class="min-w-0 data-collapsible:overflow-hidden"
      >
        <div
          :data-open="isOpen || null"
          class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
        >
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>
