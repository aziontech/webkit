<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Flow from '../../data/flow/flow.vue'
  import FlowAnchor from '../../data/flow/flow-anchor/flow-anchor.vue'
  import FlowNode from '../../data/flow/flow-node/flow-node.vue'
  import FlowParallel from '../../data/flow/flow-parallel/flow-parallel.vue'
  import Hero from '../../marketing/hero/hero.vue'
  import HeroTitle from '../../marketing/hero/hero-title/hero-title.vue'
  import Tag, { type TagSeverity } from '../../tag/tag.vue'

  defineOptions({
    name: 'HeroCopyOnTopArt',
    inheritAttrs: false
  })

  /** A call to action under the headline. */
  export type HeroCopyOnTopArtAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
    /** Link target of the action. */
    target?: '_blank' | '_self'
  }

  /** One card of the topology. */
  export type HeroCopyOnTopArtNode = {
    /** Kind of resource the card stands for, set above its title. */
    eyebrow: string
    /** Icon class drawn before the eyebrow. */
    icon: string
    /** Name of the resource; a card without it is skipped. */
    title: string
    /** Status shown in the card's tag. */
    label: string
    /** Severity of the status tag. */
    severity: TagSeverity
    /** Marks the card as the focus of the scene. */
    lit?: boolean
  }

  /** One column of the topology. */
  export type HeroCopyOnTopArtLevel = {
    /** The cards of the column, top to bottom. */
    nodes: HeroCopyOnTopArtNode[]
  }

  interface Props {
    /** Short overline above the headline. */
    eyebrow?: string
    /** Opening words of the headline, painted in the brand accent; reads as one sentence with `title`. */
    highlight?: string
    /** Page headline, rendered as the page `h1`; the band renders nothing when empty. */
    title?: string
    /** Sentence under the headline. */
    description?: string
    /** First button under the headline; `{ label, href, trailing?, target? }`. Shown only with a label and a link. */
    primaryAction?: HeroCopyOnTopArtAction
    /** Second, outlined button beside the first; `{ label, href, trailing?, target? }`. Shown only with a label and a link. */
    secondaryAction?: HeroCopyOnTopArtAction
    /** The columns of the topology, left to right; each is `{ nodes }`, the cards top to bottom, each `{ eyebrow, icon, title, label, severity, lit? }`. A card without `title` is skipped, and the scene renders only when a level has a card. */
    levels?: HeroCopyOnTopArtLevel[]
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    highlight: '',
    title: '',
    description: '',
    primaryAction: undefined,
    secondaryAction: undefined,
    levels: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-hero-copy-on-top-art'
  )

  const headline = computed(() => [props.highlight, props.title].filter(Boolean).join(' '))

  const primary = computed(() =>
    props.primaryAction?.label && props.primaryAction.href ? props.primaryAction : null
  )

  const secondary = computed(() =>
    props.secondaryAction?.label && props.secondaryAction.href ? props.secondaryAction : null
  )

  const scene = computed(() =>
    props.levels
      .map((level) => level.nodes.filter((node) => node.title))
      .filter((nodes) => nodes.length > 0)
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
  >
    <Hero
      v-if="title"
      kind="screen"
      align="center"
      max-width="site"
      :aria-label="headline"
    >
      <HeroTitle
        centered
        max-width="xl"
        :eyebrow="eyebrow"
        eyebrow-prefix="//"
        :highlight="highlight"
        :title="title"
        :description="description"
      >
        <template
          v-if="primary || secondary"
          #actions
        >
          <Button
            v-if="primary"
            :label="primary.label"
            :href="primary.href"
            :target="primary.target"
            kind="secondary"
            size="large"
            :icon="primary.trailing ? 'pi pi-chevron-right' : ''"
            :icon-position="primary.trailing ? 'trailing' : 'leading'"
            :animated="Boolean(primary.trailing)"
          />
          <Button
            key="button-2"
            v-if="secondary"
            :label="secondary.label"
            :href="secondary.href"
            :target="secondary.target"
            kind="outlined"
            size="large"
            :icon="secondary.trailing ? 'pi pi-chevron-right' : ''"
            :icon-position="secondary.trailing ? 'trailing' : 'leading'"
            :animated="Boolean(secondary.trailing)"
          />
        </template>
      </HeroTitle>

      <template
        v-if="scene.length > 0"
        #bottom
      >
        <div class="@container">
          <div
            class="flex animate-content-enter justify-center pb-(--spacing-xxl) motion-reduce:animate-none [--content-enter-delay:120ms] @max-2xl:[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
          >
            <Flow
              align="center"
              class="w-[40rem] shrink-0 @4xl:w-(--container-3xl) [&>div]:w-full"
            >
              <FlowParallel
                v-for="(nodes, index) in scene"
                :key="index"
                align="start"
                class="min-w-0 flex-1 @4xl:min-w-[15rem]"
              >
                <FlowNode
                  v-for="node in nodes"
                  :key="node.title"
                  unstyled
                  class="flex w-full flex-col rounded-(--shape-card) border-solid border-[length:var(--border-width-default,1px)] border-(--border-default) bg-(--bg-surface) shadow-(--shadow-xs) transition-colors duration-moderate-01 ease-productive-entrance hover:border-(--border-strong) has-[:focus-visible]:border-(--border-strong) motion-reduce:transition-none has-[[data-lit]]:border-(--primary) has-[[data-lit]]:before:pointer-events-none has-[[data-lit]]:before:absolute has-[[data-lit]]:before:inset-0 has-[[data-lit]]:before:rounded-[inherit] has-[[data-lit]]:before:shadow-[-22px_0_44px_-16px_var(--accent),22px_0_44px_-16px_var(--primary),0_0_20px_-8px_var(--primary)] has-[[data-lit]]:before:content-['']"
                >
                  <FlowAnchor>
                    <div
                      class="flex w-full items-center gap-(--spacing-xxs) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-xxs)"
                    >
                      <i
                        :class="node.icon"
                        class="shrink-0 text-label-sm leading-none text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="truncate text-label-sm text-(--text-muted)">{{
                        node.eyebrow
                      }}</span>
                      <Tag
                        class="ml-auto shrink-0"
                        :severity="node.severity"
                        :label="node.label"
                        size="small"
                      />
                    </div>
                  </FlowAnchor>
                  <div
                    :data-lit="node.lit || null"
                    class="flex min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-sm)"
                  >
                    <span class="min-w-0 truncate text-label-sm text-(--text-default)">{{
                      node.title
                    }}</span>
                  </div>
                </FlowNode>
              </FlowParallel>
            </Flow>
          </div>
        </div>
      </template>
    </Hero>
  </div>
</template>
