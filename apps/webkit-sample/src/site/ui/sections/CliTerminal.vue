<script setup lang="ts">
  import FrameBox from '@aziontech/webkit/frame-box'
  import ProductWidget from '@aziontech/webkit/product-widget'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import { computed, onMounted, onScopeDispose, ref } from 'vue'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'CliTerminal' })

  /** A recorded Azion CLI session the terminal types. */
  export type CliTerminalScript = 'start' | 'deploy'

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Overline above the title. */
    eyebrow?: string
    /** The section's headline. */
    title?: string
    /** One or two sentences beside the headline. */
    description?: string
    /** The session the terminal types. */
    script?: CliTerminalScript
    /** Buttons under the headline. */
    actions?: SiteAction[]
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: 'Azion CLI',
    title: '',
    description: '',
    script: 'deploy',
    actions: () => []
  })

  const widget = computed(() =>
    props.script === 'start' ? 'cli-terminal-start' : 'cli-terminal-deploy'
  )

  const stage = ref<globalThis.HTMLElement | null>(null)
  const entered = ref(false)

  let arrival: globalThis.IntersectionObserver | null = null

  onMounted(() => {
    if (!stage.value) return
    arrival = new globalThis.IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        entered.value = true
        arrival?.disconnect()
      },
      { threshold: 0.2 }
    )
    arrival.observe(stage.value)
  })

  onScopeDispose(() => arrival?.disconnect())
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <template #header>
      <div
        class="contents [--section-title-headline-span:2] [--section-title-headline-max:var(--container-xl)]"
      >
        <SectionTitle
          kind="horizontal"
          padding="small"
          :eyebrow="eyebrow"
          :title="title"
          :description="description"
        >
          <template
            v-if="actions.length"
            #actions
          >
            <SectionAction
              v-for="item in actions"
              :key="item.label"
              :action="item"
            />
          </template>
        </SectionTitle>
      </div>
    </template>

    <FrameBox
      flush
      borders="y"
      marks="all"
    >
      <div
        class="relative w-full overflow-hidden px-(--spacing-xl) pt-(--spacing-16) md:pt-(--spacing-32) [--texture-wave-gain:1.8] [--texture-wave-pace:5] [--texture-pool-a:50%_100%] [--texture-pool-b:50%_0%]"
      >
        <TextureMaterial
          kind="pixelate"
          size="small"
          fade="none"
        />
        <div
          ref="stage"
          :data-entered="entered || null"
          class="relative z-10 mx-auto -mb-(--spacing-xs) h-(--size-72) w-full max-w-(--container-4xl) translate-y-(--spacing-xl) scale-95 rounded-(--shape-elements) opacity-0 shadow-(--shadow-2xl) transition-[translate,scale,opacity] duration-slow-02 ease-expressive-entrance data-entered:translate-y-0 data-entered:scale-100 data-entered:opacity-100 md:h-(--size-96) motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none"
        >
          <ProductWidget :name="widget" />
        </div>
      </div>
    </FrameBox>
  </SectionModule>
</template>
