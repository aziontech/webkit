<script setup lang="ts">
  import type { Client } from '@aziontech/webkit/assets/client-registry'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Quote from '@aziontech/webkit/quote'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import Tag from '@aziontech/webkit/tag'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  import { computed } from 'vue'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'RecognitionMarquee' })

  export interface RecognitionMarqueeItem {
    /** What the report says about Azion. */
    text: string
    /** The report's name. */
    name: string
    /** When it was published. */
    jobTitle: string
    /** The analyst firm, signing the card with its logo. */
    firm: Pick<Client, 'name' | 'logo' | 'logoLight' | 'artwork'>
    /** What the card is, as a tag over it. */
    tag?: string
    /** Link to the coverage, floored under the attribution. */
    action?: SiteAction | null
  }

  interface Props {
    /** Overline above the band title. */
    eyebrow?: string
    /** Band title over the marquee. */
    title?: string
    /** One signed card per report, in loop order. */
    items: RecognitionMarqueeItem[]
    /** Accessible name for the scrolling region. */
    ariaLabel?: string
    /** Id of the band, for in-page links. */
    anchor?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    ariaLabel: 'Analyst recognitions',
    anchor: ''
  })

  const SECONDS_PER_CARD = 12

  const passDuration = computed(() => `${props.items.length * SECONDS_PER_CARD}s`)
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <template
      v-if="title"
      #header
    >
      <SectionTitle
        :eyebrow="eyebrow"
        :title="title"
      />
    </template>

    <FrameBox
      flush
      borders="y"
      marks="all"
    >
      <div
        role="region"
        :aria-label="ariaLabel"
        tabindex="0"
        class="group/loop overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset motion-reduce:overflow-x-auto"
      >
        <div
          :style="{ animationDuration: passDuration }"
          class="flex w-max animate-brand-marquee group-focus-within/loop:[animation-play-state:paused] group-hover/loop:[animation-play-state:paused] motion-reduce:animate-none"
        >
          <ul
            v-for="copy in 2"
            :key="copy"
            :data-duplicate="copy === 2 || null"
            :aria-hidden="copy === 2 ? 'true' : undefined"
            class="m-0 flex w-max shrink-0 list-none p-0 motion-reduce:data-[duplicate]:hidden"
          >
            <li
              v-for="(recognition, index) in items"
              :key="`${copy}-${index}`"
              class="flex w-[85vw] max-w-(--container-md) shrink-0 sm:w-(--container-md)"
            >
              <FrameBox
                borders="right"
                marks="all"
                class="w-full bg-(--bg-surface)"
              >
                <div class="flex flex-col gap-(--spacing-md) p-(--spacing-xl)">
                  <div
                    v-if="recognition.tag"
                    class="flex"
                  >
                    <Tag
                      :label="recognition.tag"
                      severity="accent"
                      size="small"
                      icon="pi pi-star-fill"
                    />
                  </div>
                  <Quote
                    kind="signed"
                    :text="recognition.text"
                    :name="recognition.name"
                    :job-title="recognition.jobTitle"
                  >
                    <template #mark>
                      <ClientMark
                        :client="recognition.firm"
                        mark="h-8 w-auto max-w-40 object-contain"
                      />
                    </template>
                    <template
                      v-if="recognition.action"
                      #actions
                    >
                      <SectionAction
                        :action="{ kind: 'text', size: 'medium', trailing: true, ...recognition.action }"
                        :tabindex="copy === 2 ? -1 : undefined"
                      />
                    </template>
                  </Quote>
                </div>
              </FrameBox>
            </li>
          </ul>
        </div>
      </div>
    </FrameBox>
  </SectionModule>
</template>
