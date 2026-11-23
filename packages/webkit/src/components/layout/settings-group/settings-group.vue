<script setup lang="ts">
  import { computed, onBeforeUnmount, ref, useAttrs, useId } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { copyText } from '../../../utils/clipboard'
  import Hint from '../../input/hint/hint.vue'

  defineOptions({
    name: 'SettingsGroup',
    inheritAttrs: false
  })

  export interface SettingsGroupProps {
    /** The group heading, rendered as an h2. */
    label: string
    /** One-sentence guidance shown in a Hint glyph beside the label. */
    hint?: string
    /** Id of the h2 that a hash link targets; when set, a copy-link button appears in the gutter on hover or focus. */
    anchor?: string
    /** Turns the label into a disclosure that folds the band body. */
    collapsible?: boolean
    /** Glyph shown before the label of a collapsible band (e.g. `az az-settings`). */
    icon?: string
  }

  const props = withDefaults(defineProps<SettingsGroupProps>(), {
    hint: '',
    anchor: '',
    collapsible: false,
    icon: ''
  })

  const open = defineModel<boolean>('open', { default: false })

  defineSlots<{
    /** The band body, usually a flush Card of SettingsRow rows. */
    default(): unknown
    /** Rich label content; replaces the label prop text inside the h2. */
    label(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ settingsGroup: en.settingsGroup })
  const regionId = useId()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'settings-group')

  const expanded = computed(() => !props.collapsible || open.value)

  const copied = ref(false)
  let copiedTimer: ReturnType<typeof setTimeout> | null = null

  const copyLink = async () => {
    if (!(await copyText(`${globalThis.location.href.split('#')[0]}#${props.anchor}`))) return
    copied.value = true
    if (copiedTimer) clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => {
      copied.value = false
      copiedTimer = null
    }, 2000)
  }

  onBeforeUnmount(() => {
    if (copiedTimer) clearTimeout(copiedTimer)
  })

  const toggle = () => {
    open.value = !open.value
  }

  const COPY_LINK_CLASS =
    'absolute z-1 -start-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ' +
    'ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) ' +
    'group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 [@media(hover:none)]:relative [@media(hover:none)]:order-last [@media(hover:none)]:opacity-100 ' +
    '[@media(hover:none)]:start-0 [@media(hover:none)]:z-1 [@media(hover:none)]:ms-(--spacing-xl) ' +
    'motion-reduce:transition-none'

  const TRIGGER_CLASS =
    'group/disclosure relative -mx-(--spacing-2xs) flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-2xs) text-start transition-colors duration-fast-02 ' +
    'ease-productive-entrance hover:text-(--text-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 ' +
    'focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none'

  const CHEVRON_CLASS =
    'az az-chevron-down shrink-0 text-body-xs leading-none text-(--text-muted) transition-transform duration-fast-02 ease-productive-entrance ' +
    'group-data-[state=open]/disclosure:rotate-180 ' +
    'motion-reduce:transition-none'

  const BODY_CLASS =
    'min-w-0 transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance ' +
    'data-collapsible:grid data-collapsible:grid-rows-[0fr] data-collapsible:data-[state=open]:grid-rows-[1fr] ' +
    'motion-reduce:transition-none'

  const CONTENT_CLASS =
    '@container/settings-group flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance ' +
    'data-[state=open]:translate-y-0 data-[state=open]:opacity-100 ' +
    'motion-reduce:transition-none'
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-state="collapsible ? (open ? 'open' : 'closed') : undefined"
    class="flex min-w-0 flex-col gap-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)"
  >
    <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-2xs)">
      <button
        v-if="anchor"
        type="button"
        :data-testid="`${testId}__copy-link`"
        :aria-label="
          copied ? t('settingsGroup.linkCopied') : t('settingsGroup.copyLink', { title: label })
        "
        :data-state="copied ? 'copied' : undefined"
        :class="COPY_LINK_CLASS"
        @click="copyLink"
      >
        <span
          aria-hidden="true"
          data-slot="touch-target"
          class="absolute inset-[min(0rem,calc(50%-12px))] pointer-coarse:inset-[min(0rem,calc(50%-22px))]"
        />
        <i
          :class="copied ? 'az az-check' : 'az az-link'"
          class="text-body-xs"
          aria-hidden="true"
        />
        <span
          aria-hidden="true"
          data-slot="touch-target"
          class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
        />
      </button>
      <h2
        :id="anchor || undefined"
        :data-testid="`${testId}__label`"
        class="scroll-mt-(--spacing-xl) text-balance text-heading-2xs text-(--text-default)"
      >
        <button
          v-if="collapsible"
          type="button"
          :data-testid="`${testId}__trigger`"
          :aria-expanded="open"
          :aria-controls="regionId"
          :data-state="open ? 'open' : 'closed'"
          :class="TRIGGER_CLASS"
          @click="toggle"
        >
          <i
            v-if="icon"
            :class="icon"
            class="shrink-0 text-body-sm leading-none text-(--text-muted)"
            aria-hidden="true"
          />
          <slot name="label">{{ label }}</slot>
          <i
            :class="CHEVRON_CLASS"
            aria-hidden="true"
          />
          <span
            aria-hidden="true"
            data-slot="touch-target"
            class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
          />
        </button>
        <span
          v-else
          class="flex items-center gap-(--spacing-xs)"
        >
          <slot name="label">{{ label }}</slot>
        </span>
      </h2>
      <Hint
        v-if="hint"
        :content="hint"
        class="shrink-0"
      />
    </div>
    <div
      :id="regionId"
      :data-testid="`${testId}__body`"
      :data-state="expanded ? 'open' : 'closed'"
      :data-collapsible="collapsible || null"
      :inert="!expanded || undefined"
      :aria-hidden="!expanded || undefined"
      :class="BODY_CLASS"
    >
      <div
        :data-collapsible="collapsible || null"
        class="min-w-0 data-collapsible:overflow-hidden"
      >
        <div
          :data-state="expanded ? 'open' : 'closed'"
          :class="CONTENT_CLASS"
        >
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>
