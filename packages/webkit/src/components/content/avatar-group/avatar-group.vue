<script setup lang="ts">
  import { computed, ref, useAttrs, useId } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { initials } from '../../../utils/initials'

  defineOptions({
    name: 'AvatarGroup',
    inheritAttrs: false
  })

  /** One person in the group. */
  export interface AvatarGroupItem {
    /** Full name: the accessible name, the pointer hint and the source of the initials. */
    name: string
    /** Photo URL. */
    src?: string
    /** Initials that replace the ones derived from name. */
    label?: string
  }

  /** Size of each avatar. */
  export type AvatarGroupSize = 'small' | 'medium' | 'large'
  /** Direction the avatars stack and overlap in. */
  export type AvatarGroupOrientation = 'horizontal' | 'vertical'

  export interface AvatarGroupProps {
    /** The people, in display order; name is the accessible name, the hint and the initials. */
    items?: AvatarGroupItem[]
    /** Avatars shown before the rest collapse into the +N button; 0 shows every avatar. */
    max?: number
    /** Size of each avatar (24 / 32 / 48 px), the same steps as Avatar. */
    size?: AvatarGroupSize
    /** Direction the avatars stack and overlap in. */
    orientation?: AvatarGroupOrientation
    /** Accessible name of the group; empty uses the catalog count. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<AvatarGroupProps>(), {
    items: () => [],
    max: 4,
    size: 'medium',
    orientation: 'horizontal',
    ariaLabel: ''
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ avatarGroup: en.avatarGroup })
  const listId = useId()

  const open = ref(false)
  const failedSources = ref<string[]>([])

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'avatar-group')
  const anchorName = computed(() => `--avatar-group-${listId.replace(/[^\w-]/g, '-')}`)

  const collapses = computed(() => props.max > 0 && props.items.length > props.max)
  const shown = computed(() => (collapses.value ? props.items.slice(0, props.max) : props.items))
  const hidden = computed(() => (collapses.value ? props.items.slice(props.max) : []))

  const groupLabel = computed(
    () => props.ariaLabel || t('avatarGroup.people', { count: props.items.length })
  )

  const moreLabel = computed(() => t('avatarGroup.more', { count: hidden.value.length }))

  const showsPhoto = (item: AvatarGroupItem) =>
    Boolean(item.src) && !failedSources.value.includes(item.src as string)

  const initialsOf = (item: AvatarGroupItem) =>
    initials(item.label || item.name).slice(0, props.size === 'small' ? 1 : 2)

  function onImageError(src: string | undefined) {
    if (src && !failedSources.value.includes(src)) failedSources.value.push(src)
  }

  function onToggle(event: Event) {
    open.value = (event as ToggleEvent).newState === 'open'
  }

  const AVATAR_CLASS =
    'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-(--bg-surface-raised) text-(--text-default) uppercase select-none text-label-sm size-8 ' +
    'ring-2 ring-(--bg-canvas) hover:z-1 not-first:group-data-[orientation=horizontal]:-ms-(--spacing-2xs) not-first:group-data-[orientation=vertical]:-mt-(--spacing-2xs) ' +
    'not-first:group-data-[size=large]:group-data-[orientation=horizontal]:-ms-(--spacing-xs) not-first:group-data-[size=large]:group-data-[orientation=vertical]:-mt-(--spacing-xs) ' +
    'group-data-[size=small]:size-6 group-data-[size=large]:size-12 group-data-[size=large]:text-label-md ' +
    'data-[content=label]:border data-[content=label]:border-(--border-default)'

  const OVERFLOW_CLASS =
    'relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-(--border-default) bg-(--bg-surface-raised) text-(--text-default) select-none ' +
    'text-label-sm size-8 ring-2 ring-(--bg-canvas) transition-colors duration-150 ease-out ' +
    'motion-reduce:transition-none hover:z-1 hover:bg-(--bg-hover) focus-visible:z-1 focus-visible:outline-none focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 ' +
    'focus-visible:ring-offset-(--bg-canvas) ' +
    'data-[state=open]:z-1 data-[state=open]:bg-(--bg-hover) ' +
    'group-data-[orientation=horizontal]:-ms-(--spacing-2xs) group-data-[orientation=vertical]:-mt-(--spacing-2xs) ' +
    'group-data-[size=large]:group-data-[orientation=horizontal]:-ms-(--spacing-xs) group-data-[size=large]:group-data-[orientation=vertical]:-mt-(--spacing-xs) ' +
    'group-data-[size=small]:size-6 group-data-[size=large]:size-12 group-data-[size=large]:text-label-md'

  const LIST_CLASS =
    'm-0 mt-(--spacing-2xs) inset-auto max-h-(--container-3xs) max-w-(--container-3xs) overflow-y-auto rounded-(--shape-control) border border-(--border-default) ' +
    'bg-(--bg-surface-raised) p-(--spacing-xs) text-(--text-default) text-body-sm shadow-(--shadow-sm) [position-area:block-end_span-inline-end] ' +
    '[position-try-fallbacks:flip-block,flip-inline]'
</script>

<template>
  <div
    v-bind="$attrs"
    role="group"
    :aria-label="groupLabel"
    :data-testid="testId"
    :data-size="size"
    :data-orientation="orientation"
    class="group inline-flex items-center data-[orientation=vertical]:flex-col"
  >
    <span
      v-for="(item, index) in shown"
      :key="`${index}-${item.name}`"
      :title="item.name"
      :role="showsPhoto(item) ? undefined : 'img'"
      :aria-label="showsPhoto(item) ? undefined : item.name"
      :data-content="showsPhoto(item) ? 'image' : 'label'"
      :data-testid="`${testId}__avatar`"
      :class="AVATAR_CLASS"
    >
      <img
        v-if="showsPhoto(item)"
        :src="item.src"
        :alt="item.name"
        class="size-full object-cover rounded-[inherit]"
        @error="onImageError(item.src)"
      />
      <span
        v-else
        aria-hidden="true"
        class="leading-none"
      >
        {{ initialsOf(item) }}
      </span>
    </span>
    <button
      v-if="hidden.length"
      type="button"
      :popovertarget="listId"
      :aria-label="moreLabel"
      :aria-expanded="open"
      :aria-controls="listId"
      :data-state="open ? 'open' : 'closed'"
      :data-testid="`${testId}__overflow`"
      :style="{ anchorName }"
      :class="OVERFLOW_CLASS"
    >
      +{{ hidden.length }}
      <span
        aria-hidden="true"
        data-slot="touch-target"
        :data-testid="`${testId}__touch-target`"
        class="absolute hidden inset-[min(0rem,calc(50%-22px))] pointer-coarse:block"
      />
    </button>
    <div
      v-if="hidden.length"
      :id="listId"
      popover="auto"
      :data-testid="`${testId}__list`"
      :style="{ positionAnchor: anchorName }"
      :class="LIST_CLASS"
      @toggle="onToggle"
    >
      <ul
        :aria-label="moreLabel"
        tabindex="0"
        class="flex flex-col gap-(--spacing-2xs) rounded-(--shape-control) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
      >
        <li
          v-for="(item, index) in open ? hidden : []"
          :key="`${index}-${item.name}`"
          class="truncate"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
