<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import FrameBox from '@aziontech/webkit/frame-box'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import { DEPLOY_TEMPLATES } from '@shared/lib/deploy-templates.js'
  import { computed, ref } from 'vue'
  import type { RouteLocationRaw } from 'vue-router'
  import { useRouter } from 'vue-router'

  import { useSiteLink } from '../../composables/use-site-link'
  import { useTypedWords } from '../../composables/use-typed-words'
  import NewsletterBand from '../NewsletterBand.vue'
  import SectionAction from './SectionAction.vue'
  import SectionCommand from './SectionCommand.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'ClosingCallToAction' })

  /** split: the lead and aside actions side by side; panel: one centred ask; newsletter: the ask beside a subscribe form over a wave strip with the Azion mark; primary: a centred ask on the canvas lit by a pixelated primary wave; templates: the ask over the pixelated wave beside a scrolling grid of deployable templates; agents: the primary layout with a switch between the human and the agent way in, a copyable line and a typed sentence; frame: the closing frame alone. */
  export type ClosingCallToActionKind =
    'split' | 'panel' | 'newsletter' | 'primary' | 'templates' | 'agents' | 'frame'

  export interface ClosingCallToActionTemplate {
    /** Stable key of the template. */
    slug: string
    /** Template name. */
    title: string
    /** One line of what the template builds. */
    description: string
    /** Icon class of the template's mark. */
    icon: string
    /** Classes the mark needs to survive the dark theme. */
    markClass?: string
    /** Route the template opens in the deploy flow. */
    to: RouteLocationRaw
  }

  export interface ClosingCallToActionAudience {
    /** Stable key of the audience. */
    value: string
    /** Label of the audience in the switch. */
    label: string
    /** Shell command shown on a copyable line, copied as written. */
    command?: string
    /** Prompt for the visitor's agent, shown on the same copyable line without the shell prompt; ignored when a command is set. */
    prompt?: string
    /** Actions beside the command. */
    actions?: SiteAction[]
  }

  export interface ClosingCallToActionForm {
    /** Label of the email field. */
    label: string
    /** Placeholder of the email field. */
    placeholder: string
    /** Label of the submit action. */
    submit: string
    /** Toast once the address is in. */
    success: string
    /** Message when the field is left empty. */
    required: string
    /** Message when the address is malformed. */
    invalid: string
  }

  interface Props {
    /** Id of the band, for in-page contact links; empty drops it, so a page can carry several closings. */
    anchor?: string
    /** Layout of the closing band. */
    kind?: ClosingCallToActionKind
    /** Draw the hatched field under the band; off when another band stacks directly below and shares its rule. */
    hatch?: boolean
    /** Overline above the title; the primary and agents layouts leave it out. */
    eyebrow?: string
    /** The closing ask. */
    title?: string
    /** Second line of the title, in the muted ink. */
    titleMuted?: string
    /** One sentence under the title. */
    description?: string
    /** Actions in the lead cell. */
    actions?: SiteAction[]
    /** Shell command on a copyable line above the actions of the split, panel and primary layouts, copied as written. */
    command?: string
    /** Action in the aside cell of the split layout. */
    aside?: SiteAction | null
    /** Copy of the subscribe form, for the newsletter layout. */
    form?: ClosingCallToActionForm | null
    /** The ways in the agents layout switches between; the first one opens. */
    audiences?: ClosingCallToActionAudience[]
    /** Accessible name of the audience switch. */
    audiencesLabel?: string
    /** Text before the typed word in the agents layout, such as a lead-in that ends on the word. */
    typedLead?: string
    /** Words the agents layout types, erases and types again, in order. */
    typedWords?: string[]
    /** Deployable templates of the templates layout, two to a row in the scrolling grid. */
    templates?: ClosingCallToActionTemplate[]
    /** Label of each template card's deploy action. */
    deployLabel?: string
    /** Accessible name of the scrolling grid of templates. */
    templatesLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: 'contact',
    kind: 'split',
    hatch: true,
    eyebrow: '',
    title: '',
    titleMuted: '',
    description: '',
    actions: () => [],
    command: '',
    aside: null,
    form: null,
    audiences: () => [],
    audiencesLabel: 'Audience',
    typedLead: '',
    typedWords: () => [],
    templates: () => DEPLOY_TEMPLATES,
    deployLabel: 'Deploy',
    templatesLabel: 'Templates you can deploy'
  })

  const router = useRouter()
  const { follow } = useSiteLink()

  const cards = computed(() =>
    props.templates.map((template) => ({
      ...template,
      href: router.resolve(template.to).href
    }))
  )

  const followCard = (event: MouseEvent, href: string) => {
    const target = event.target as globalThis.Element
    if (target.closest('a, button') || globalThis.getSelection()?.toString()) return
    if (event.metaKey || event.ctrlKey) {
      globalThis.open(href, '_blank', 'noopener')
      return
    }
    router.push(href)
  }

  const callToActionKind = computed(() =>
    props.kind === 'panel'
      ? 'panel'
      : props.kind === 'primary' || props.kind === 'agents'
        ? 'primary'
        : 'split'
  )

  const audienceValue = ref(props.audiences[0]?.value ?? '')

  const audienceOptions = computed(() =>
    props.audiences.map(({ value, label }) => ({ value, label }))
  )

  const audience = computed(
    () => props.audiences.find(({ value }) => value === audienceValue.value) ?? props.audiences[0]
  )

  const { text: typedText } = useTypedWords(() => props.typedWords)

  const typedChars = computed(() => Array.from(typedText.value))
</script>

<template>
  <SectionModule
    v-if="kind !== 'frame'"
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
    class="scroll-mt-(--spacing-xxl)"
  >
    <NewsletterBand
      v-if="kind === 'newsletter' && form"
      :eyebrow="eyebrow"
      :title="title"
      :description="description"
      :form="form"
    />
    <FrameBox
      v-else-if="kind === 'templates'"
      flush
      borders="y"
      marks="all"
    >
      <section
        :aria-label="title"
        class="grid lg:grid-cols-2"
      >
        <div class="relative isolate flex items-center overflow-clip bg-(--bg-canvas)">
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 [--texture-pool-a:50%_140%] [--texture-pool-b:50%_140%] [--texture-wave-gain:3] [--texture-wave-pace:5]"
          >
            <TextureMaterial
              kind="pixelate"
              size="small"
              fade="bottom"
            />
          </div>
          <SectionTitle
            :framed="false"
            kind="left"
            size="large"
            :title="title"
            :description="description"
            class="relative z-10 px-(--spacing-xl) py-[calc(var(--spacing-xxl)*1.5)]"
          >
            <template
              v-if="actions.length"
              #actions
            >
              <SectionAction
                v-for="action in actions"
                :key="action.label"
                :action="action"
              />
            </template>
          </SectionTitle>
        </div>
        <div
          v-if="cards.length"
          class="relative min-h-[32rem] border-t border-(--border-default) lg:min-h-[38rem] lg:border-t-0 lg:border-l"
        >
          <ScrollArea
            :aria-label="templatesLabel"
            class="absolute inset-0 mask-t-from-[calc(100%_-_2rem)] mask-b-from-[calc(100%_-_6rem)]"
          >
            <CardGrid
              flush
              kind="frame"
              :columns="2"
            >
              <CardGridCell
                v-for="card in cards"
                :key="card.slug"
                kind="none"
                :padded="false"
                @click="followCard($event, card.href)"
              >
                <div
                  class="group/template flex h-full min-w-0 cursor-pointer flex-col gap-(--spacing-md) bg-(--bg-surface) p-(--spacing-xl)"
                >
                  <span
                    class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                  >
                    <i
                      :class="[card.icon, card.markClass]"
                      aria-hidden="true"
                      class="text-[1.25rem] leading-none text-(--text-default)"
                    />
                  </span>
                  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                    <span class="text-body-md text-(--text-default)">{{ card.title }}</span>
                    <span class="text-pretty text-body-sm text-(--text-muted)">
                      {{ card.description }}
                    </span>
                  </div>
                  <div class="mt-auto self-start">
                    <Button
                      :label="deployLabel"
                      kind="outlined"
                      size="medium"
                      icon="pi pi-chevron-right"
                      icon-position="trailing"
                      animated
                      :href="card.href"
                      class="group-hover/template:before:opacity-100 group-active/template:after:opacity-100 group-hover/template:[&_[data-animated]]:translate-x-0.5"
                      @click="follow($event, card.href)"
                    >
                      <template #prefix>
                        <i
                          class="ai ai-azion text-(--primary)"
                          aria-hidden="true"
                        />
                      </template>
                    </Button>
                  </div>
                </div>
              </CardGridCell>
            </CardGrid>
            <div
              aria-hidden="true"
              class="h-16"
            />
          </ScrollArea>
        </div>
      </section>
    </FrameBox>
    <CallToAction
      v-else
      framed
      :kind="callToActionKind"
      :eyebrow="eyebrow"
      :title="title"
      :title-muted="titleMuted"
      :description="kind === 'agents' ? '' : description"
    >
      <template #actions>
        <div
          v-if="kind === 'agents' && audience"
          style="width: min(var(--container-xl), calc(100vw - var(--spacing-xxl) * 3))"
          class="flex flex-col items-center gap-(--spacing-md)"
        >
          <SegmentedButton
            v-model="audienceValue"
            :options="audienceOptions"
            :aria-label="audiencesLabel"
            size="large"
          />
          <div
            aria-live="polite"
            class="w-full min-w-0"
          >
            <div
              :key="audience.value"
              class="flex w-full min-w-0 animate-fade-in flex-col items-stretch justify-center gap-(--spacing-sm) motion-reduce:animate-none sm:items-center lg:flex-row"
            >
              <SectionCommand
                v-if="audience.command || audience.prompt"
                :value="audience.command || audience.prompt || ''"
                :shell="Boolean(audience.command)"
              />
              <SectionAction
                v-for="action in audience.actions"
                :key="action.label"
                :action="action"
                class="shrink-0"
              />
            </div>
          </div>
          <p
            v-if="typedWords.length || description"
            class="m-0 max-w-(--container-md) text-center text-body-code-sm text-(--text-muted)"
          >
            <span
              v-if="typedWords.length"
              class="block"
            >
              <span class="sr-only">{{ typedLead }} {{ typedWords.join(', ') }}.</span>
              <span aria-hidden="true">
                {{ typedLead }}
                <span class="text-(--text-default)">
                  <TransitionGroup
                    tag="span"
                    enter-from-class="-translate-x-1 opacity-0"
                    enter-active-class="transition-[translate,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                  >
                    <span
                      v-for="(char, index) in typedChars"
                      :key="index"
                      class="inline-block whitespace-pre"
                      >{{ char }}</span
                    > </TransitionGroup
                  ><span
                    class="ml-px inline-block h-4 w-1 animate-blink bg-(--accent) align-text-bottom motion-reduce:hidden"
                /></span>
              </span>
            </span>
            <span
              v-if="description"
              class="block"
              >{{ description }}</span
            >
          </p>
        </div>
        <template v-else>
          <SectionCommand
            v-if="command"
            :value="command"
          />
          <SectionAction
            v-for="action in actions"
            :key="action.label"
            :action="action"
          />
        </template>
      </template>
      <template
        v-if="kind === 'primary' || kind === 'agents'"
        #background
      >
        <TextureMaterial
          kind="pixelate"
          size="small"
          fade="bottom"
        />
      </template>
      <template
        v-if="kind === 'split' && aside"
        #aside
      >
        <SectionAction :action="{ kind: 'outlined', trailing: true, ...aside }" />
      </template>
    </CallToAction>
  </SectionModule>
  <FrameBox
    v-if="hatch || kind === 'frame'"
    borders="none"
    marks="all"
    data-hatch="true"
    :data-size="kind === 'panel' ? 'small' : 'large'"
    class="h-[calc(var(--spacing-xxl)*2)] data-[size=small]:h-(--spacing-xxl)"
  >
    <TextureMaterial kind="lines" />
  </FrameBox>
</template>
