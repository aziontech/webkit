<script setup lang="ts">
  import type { CodeBlockTab } from '@aziontech/webkit/code-block'
  import CodeBlock from '@aziontech/webkit/code-block'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import { computed, ref } from 'vue'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction, SiteTopic } from './types'

  defineOptions({ name: 'IntegrationCode' })

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Lead-in of the headline, drawn muted. */
    title: string
    /** Close of the headline, drawn in the default ink on its own line. */
    emphasis?: string
    /** One or two sentences over the code. */
    description?: string
    /** Capabilities; choosing one shows its sample and its description. */
    items: SiteTopic[]
    /** One code file per capability, in the same order. */
    samples: CodeBlockTab[]
    /** Link beside the description of the chosen capability. */
    action?: SiteAction | null
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    emphasis: '',
    description: '',
    action: null
  })

  const active = ref(0)

  const sample = computed(() => props.samples[active.value] ?? props.samples[0])
  const item = computed(() => props.items[active.value] ?? props.items[0])
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <div class="grid gap-(--spacing-xl) bg-(--bg-surface) p-(--spacing-xl) lg:min-h-160 lg:grid-cols-2">
        <div class="flex flex-col justify-between gap-(--spacing-xl)">
          <h2 class="m-0 text-balance text-heading-lg text-(--text-muted)">
            {{ title }}
            <span
              v-if="emphasis"
              class="block text-(--text-default)"
              >{{ emphasis }}</span
            >
          </h2>
          <ul class="m-0 flex list-none flex-col gap-(--spacing-sm) p-0">
            <li
              v-for="(entry, index) in items"
              :key="entry.title"
            >
              <button
                type="button"
                :aria-pressed="active === index"
                class="flex cursor-pointer items-center gap-(--spacing-sm) border-0 bg-transparent p-0 text-left text-body-lg text-(--text-muted) transition-colors duration-150 ease-out hover:text-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none aria-pressed:text-(--text-default) motion-reduce:transition-none"
                @click="active = index"
              >
                <i
                  v-if="entry.icon"
                  :class="entry.icon"
                  aria-hidden="true"
                />
                {{ entry.title }}
              </button>
            </li>
          </ul>
        </div>

        <div class="flex min-w-0 flex-col gap-(--spacing-xl)">
          <p
            v-if="description"
            class="m-0 max-w-(--container-md) text-pretty text-body-md text-(--text-muted)"
          >
            {{ description }}
          </p>
          <div class="flex min-w-0 flex-col gap-(--spacing-md)">
            <CodeBlock
              v-if="sample"
              :tabs="[sample]"
              show-line-numbers
              animate-lines
              :copy-aria-label="`Copy the ${sample.fileName ?? sample.label} sample`"
            />
            <div class="flex flex-wrap items-start justify-between gap-x-(--spacing-xl) gap-y-(--spacing-md)">
              <p
                v-if="item"
                aria-live="polite"
                class="m-0 min-w-0 flex-1 basis-64 text-pretty text-body-sm text-(--text-muted)"
              >
                {{ item.description }}
              </p>
              <span
                v-if="action"
                class="ms-auto flex shrink-0"
              >
                <SectionAction
                  :action="{ kind: 'secondary', size: 'small', trailing: true, ...action }"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </FrameBox>
  </SectionModule>
</template>
