<script setup lang="ts">
  import {
    type Component,
    type ComponentPublicInstance,
    computed,
    defineAsyncComponent,
    nextTick,
    ref,
    useAttrs,
    useId,
    watch
  } from 'vue'

  import { brandMarkLabel, resolveBrandMark } from '../../../svg/brands/registry'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import CardGrid from '../card-grid/card-grid.vue'
  import CardGridCell from '../card-grid/card-grid-cell/card-grid-cell.vue'
  import type { LogoShape } from '../logo-wall/logo-wall.vue'
  import Quote from '../quote/quote.vue'

  defineOptions({
    name: 'QuoteTabs',
    inheritAttrs: false
  })

  /** One client in the band. */
  export type QuoteTabsItem = {
    /** URL of the client's colour logo, drawn as-is in its own colours; wins over mark. */
    logo?: string
    /** Registry name of the client's one-ink mark, used when there is no logo. */
    mark?: string
    /** The client's name in prose, naming its card; falls back to the registry's label for mark. */
    clientName?: string
    /** How tall the mark sits on its card: wide for a wordmark, compact for a mark closer to square. */
    shape?: LogoShape
    /** The quotation itself, featured in the panel while this client's card is selected. */
    text: string
    /** Who said it, the attribution's lead. */
    name?: string
    /** Their role and company, as one line under the name. */
    jobTitle?: string
    /** URL of the person's likeness, drawn beside the attribution. */
    photo?: string
  }

  type QuoteTabsDirection = 'forward' | 'back'

  interface Props {
    /** The clients, in wall order; each item is the URL of the client's colour logo, the registry name of its one-ink mark, its name in prose, how tall its mark sits on the card, the quotation, who said it, their role and their likeness. */
    items?: QuoteTabsItem[]
    /** Accessible name for the wall of client cards. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    ariaLabel: ''
  })

  /** Index of the selected client, bound with v-model; left unbound the band keeps its own selection, starting on the first card. */
  const model = defineModel<number>({ default: 0 })

  const slots = defineSlots<{
    /** A trailing control under the featured quotation's attribution, such as a secondary Button to the success stories; rendered in the quote's own actions area, the same for every client. */
    actions?(): unknown
  }>()

  const attrs = useAttrs()
  const baseId = useId()

  const loaded = new Map<string, Component>()
  const tabElements: Array<globalThis.HTMLButtonElement | null> = []
  let pendingDirection: QuoteTabsDirection | null = null

  const direction = ref<QuoteTabsDirection>('forward')

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-quote-tabs'
  )

  const panelId = computed(() => `${baseId}-panel`)

  const clients = computed(() =>
    props.items.map((item, index) => {
      const loader = item.logo || !item.mark ? null : resolveBrandMark(item.mark)
      if (item.mark && loader && !loaded.has(item.mark)) {
        loaded.set(item.mark, defineAsyncComponent(loader))
      }
      return {
        ...item,
        id: `${baseId}-tab-${index}`,
        label: item.clientName || (item.mark ? brandMarkLabel(item.mark) : ''),
        art: item.mark && loader ? (loaded.get(item.mark) ?? null) : null
      }
    })
  )

  const selected = computed(() => Math.min(Math.max(model.value, 0), props.items.length - 1))

  const current = computed(() => clients.value[selected.value])

  const hasSlotMark = computed(
    () => !current.value.logo && Boolean(current.value.art || current.value.label)
  )

  watch(selected, (next, previous) => {
    direction.value = pendingDirection ?? (next > previous ? 'forward' : 'back')
    pendingDirection = null
  })

  function isActive(index: number): boolean {
    return selected.value === index
  }

  function bindTab(element: Element | ComponentPublicInstance | null, index: number): void {
    tabElements[index] = element as globalThis.HTMLButtonElement | null
  }

  function select(index: number): void {
    model.value = index
  }

  function targetOf(key: string): number | null {
    const last = props.items.length - 1
    if (key === 'ArrowRight') return selected.value >= last ? 0 : selected.value + 1
    if (key === 'ArrowLeft') return selected.value <= 0 ? last : selected.value - 1
    if (key === 'Home') return 0
    if (key === 'End') return last
    return null
  }

  function directionOf(key: string): QuoteTabsDirection | null {
    if (key === 'ArrowRight') return 'forward'
    if (key === 'ArrowLeft') return 'back'
    return null
  }

  async function onKeydown(event: globalThis.KeyboardEvent): Promise<void> {
    const next = targetOf(event.key)
    if (next === null) return
    event.preventDefault()
    if (next !== selected.value) {
      pendingDirection = directionOf(event.key)
      select(next)
    }
    await nextTick()
    tabElements[next]?.focus()
  }

  function hideLeaving(element: Element): void {
    element.setAttribute('aria-hidden', 'true')
  }
</script>

<template>
  <div
    v-if="clients.length"
    v-bind="$attrs"
    :data-testid="testId"
    class="flex flex-col"
  >
    <FrameBox
      :id="panelId"
      borders="bottom"
      marks="all"
      role="tabpanel"
      tabindex="0"
      :data-testid="`${testId}__panel`"
      :data-direction="direction"
      :aria-labelledby="current.id"
      class="group/panel bg-(--bg-canvas) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
    >
      <div class="grid p-(--spacing-xl) *:col-start-1 *:row-start-1">
        <div
          :data-testid="`${testId}__sizer`"
          aria-hidden="true"
          inert
          class="pointer-events-none grid min-w-0 opacity-0 *:col-start-1 *:row-start-1"
        >
          <Quote
            v-for="client in clients"
            :key="client.id"
            kind="highlight"
            :data-testid="`${testId}__sizer-quote`"
            :text="client.text"
            :name="client.name"
            :job-title="client.jobTitle"
            :photo="client.photo"
            :logo="client.logo"
            :logo-alt="client.label"
          >
            <template
              v-if="!client.logo && (client.art || client.label)"
              #mark
            >
              <component
                :is="client.art"
                v-if="client.art"
                class="h-8 w-auto max-w-(--size-40) md:h-auto md:max-h-24 md:w-full md:max-w-none"
              />
              <span
                v-else
                class="text-heading-xxs"
                >{{ client.label }}</span
              >
            </template>
            <template
              v-if="slots.actions"
              #actions
            >
              <slot name="actions" />
            </template>
          </Quote>
        </div>

        <Transition
          enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
          enter-from-class="opacity-0 group-data-[direction=forward]/panel:translate-x-(--spacing-xl) group-data-[direction=back]/panel:-translate-x-(--spacing-xl) motion-reduce:translate-x-0"
          leave-active-class="pointer-events-none transition-[translate,opacity] duration-moderate-01 ease-productive-exit motion-reduce:transition-none"
          leave-to-class="opacity-0 group-data-[direction=forward]/panel:-translate-x-(--spacing-xl) group-data-[direction=back]/panel:translate-x-(--spacing-xl) motion-reduce:translate-x-0"
          @before-leave="hideLeaving"
        >
          <div
            :key="selected"
            :data-testid="`${testId}__quote`"
            class="min-w-0"
          >
            <Quote
              kind="highlight"
              :text="current.text"
              :name="current.name"
              :job-title="current.jobTitle"
              :photo="current.photo"
              :logo="current.logo"
              :logo-alt="current.label"
            >
              <template
                v-if="hasSlotMark"
                #mark
              >
                <component
                  :is="current.art"
                  v-if="current.art"
                  :data-mark="current.mark"
                  aria-hidden="true"
                  class="h-8 w-auto max-w-(--size-40) text-(--text-default) md:h-auto md:max-h-24 md:w-full md:max-w-none"
                />
                <span
                  v-else
                  aria-hidden="true"
                  class="text-heading-xxs text-(--text-default)"
                  >{{ current.label }}</span
                >
              </template>
              <template
                v-if="slots.actions"
                #actions
              >
                <slot name="actions" />
              </template>
            </Quote>
          </div>
        </Transition>
      </div>
    </FrameBox>

    <CardGrid
      kind="frame"
      flush
      :columns="3"
      :mobile-columns="2"
      role="tablist"
      :aria-label="ariaLabel || undefined"
      class="grid-cols-3! lg:grid-cols-6!"
      @keydown="onKeydown"
    >
      <CardGridCell
        v-for="(client, index) in clients"
        :key="client.id"
        kind="surface"
        :padded="false"
        role="presentation"
      >
        <button
          :id="client.id"
          :ref="(element) => bindTab(element, index)"
          type="button"
          role="tab"
          :data-testid="`${testId}__tab`"
          :data-active="isActive(index) || null"
          :aria-label="client.label || undefined"
          :aria-selected="isActive(index) ? 'true' : 'false'"
          :aria-controls="panelId"
          :tabindex="isActive(index) ? 0 : -1"
          class="relative isolate flex aspect-3/2 w-full cursor-pointer items-center justify-center px-(--spacing-md) transition-colors duration-moderate-01 ease-out before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-(--bg-hover) before:opacity-0 before:transition-opacity before:duration-fast-02 before:ease-productive-entrance before:content-[''] hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) data-[active]:bg-(--bg-selected) data-[active]:before:hidden motion-reduce:transition-none motion-reduce:before:transition-none"
          @click="select(index)"
        >
          <img
            v-if="client.logo"
            :src="client.logo"
            alt=""
            :data-shape="client.shape ?? 'wide'"
            decoding="async"
            class="h-5 w-auto max-w-full object-contain data-[shape=compact]:h-7 sm:max-w-24"
          />
          <component
            :is="client.art"
            v-else-if="client.art"
            :data-mark="client.mark"
            :data-shape="client.shape ?? 'wide'"
            aria-hidden="true"
            class="h-5 w-auto max-w-full text-(--text-default) data-[shape=compact]:h-7 sm:max-w-24"
          />
          <span
            v-else
            aria-hidden="true"
            class="text-heading-xxs text-(--text-default)"
            >{{ client.label }}</span
          >
        </button>
      </CardGridCell>
    </CardGrid>
  </div>
</template>
