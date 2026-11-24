<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Link from '../../navigation/link/link.vue'
  import Popover from '../../overlay/popover/popover.vue'
  import PopoverContent from '../../overlay/popover/popover-content/popover-content.vue'
  import PopoverTrigger from '../../overlay/popover/popover-trigger/popover-trigger.vue'

  /** Side of the glyph the note opens on; `start` and `end` follow the text direction. */
  export type HintSide = 'top' | 'bottom' | 'start' | 'end'

  /** Where the docs link opens. */
  export type HintTarget = '_blank' | '_self'

  defineOptions({
    name: 'Hint',
    inheritAttrs: false
  })

  export interface HintProps {
    /** The note, one to three sentences, shown when the glyph is clicked and read as the glyph's description. */
    content: string
    /** Side of the glyph the note opens on, flipped when it does not fit; `'auto'` picks the side with the most room. */
    side?: HintSide | 'auto'
    /** Docs URL linked under the note; empty renders no link. */
    href?: string
    /** Text of the docs link; empty uses the locale catalog (`Learn more`). */
    linkLabel?: string
    /** Where the docs link opens. */
    target?: HintTarget
    /** Accessible name of the glyph button; empty uses the locale catalog (`More information`). */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<HintProps>(), {
    side: 'bottom',
    href: '',
    linkLabel: '',
    target: '_blank',
    ariaLabel: ''
  })

  /** Open state of the note. Use with v-model:open; while unbound the note keeps its own state. */
  const open = defineModel<boolean>('open', { default: false })

  const attrs = useAttrs()
  const { t } = useTranslate({ hint: en.hint })
  const uid = useId()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'hint')
  const descriptionId = `${uid}-note`
  const name = computed(() => props.ariaLabel || t('hint.label'))

  const TRIGGER_CLASS =
    'relative inline-flex size-5 items-center justify-center rounded-(--shape-button) text-(--text-muted) transition-colors duration-150 ease-out ' +
    'hover:text-(--text-default) aria-expanded:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none'
</script>

<template>
  <Popover
    v-bind="$attrs"
    v-model:open="open"
    :data-testid="testId"
    :side="side"
    align="start"
  >
    <PopoverTrigger>
      <button
        type="button"
        :data-testid="`${testId}__trigger`"
        :aria-label="name"
        :aria-describedby="descriptionId"
        :class="TRIGGER_CLASS"
        @click.prevent
      >
        <span
          aria-hidden="true"
          data-slot="touch-target"
          class="absolute inset-[min(0rem,calc(50%-12px))] pointer-coarse:inset-[min(0rem,calc(50%-22px))]"
        />
        <i
          class="az az-circle-info text-body-xs"
          aria-hidden="true"
        />
      </button>
    </PopoverTrigger>
    <span
      :id="descriptionId"
      hidden
      >{{ content }}</span
    >
    <PopoverContent :data-testid="`${testId}__panel`">
      <div class="flex flex-col gap-(--spacing-xs) p-(--spacing-sm) text-start">
        <p class="text-body-sm text-(--text-default)">{{ content }}</p>
        <Link
          v-if="href"
          :data-testid="`${testId}__link`"
          :href="href"
          :label="linkLabel"
          :target="target"
          size="small"
          class="self-start"
        />
      </div>
    </PopoverContent>
  </Popover>
</template>
