<script setup>
  // An organization's mark: generated marble art, seeded by the org's name and
  // coloured by the accent it was created with.
  //
  // Why generated art and not initials: an org is a place you live in, and two
  // orgs whose names start with the same two letters produce the same initials
  // — the very case the mark exists to disambiguate. The marble is derived from
  // the WHOLE name, so no two orgs land on the same picture, and it is stable
  // (same name → same art, every reload, every device) without anyone uploading
  // a logo.
  //
  // It is inline SVG rather than the design system's Avatar because the palette
  // is theme tokens: `var(--color-*)` resolves against the page, and an
  // <img src="data:image/svg+xml,…"> is a separate document that cannot see
  // them — the art would freeze at whatever the theme was when it was encoded.
  // Colours therefore ride on `style`, not on a `fill` attribute (presentation
  // attributes don't take `var()`).
  import { computed, useId } from 'vue'

  import { MARBLE_SIZE, marbleElements, marbleTransform } from '../../lib/behavior/marble.js'
  import { accentOf } from '../../lib/state/organizations.js'

  const props = defineProps({
    // Organization name — the seed for the art.
    name: { type: String, default: '' },
    // Accent the org was created with: 'blue' | 'orange' | 'yellow'.
    accent: { type: String, default: 'blue' },
    // Size token, matching the design system Avatar's scale.
    size: { type: String, default: 'small' }
  })

  // Unique per instance: several avatars share one page, and a duplicated
  // filter id would make them all reference the first one's blur.
  const uid = useId()
  const filterId = `marble-blur-${uid}`

  const colors = computed(() => accentOf(props.accent).colors)
  const elements = computed(() => marbleElements(props.name, colors.value.length))
  const fillOf = (index) => ({ fill: colors.value[elements.value[index].colorIndex] })

  // The scale is named for where the mark is used, not for the Avatar's own steps.
  //
  // `medium` is 24 — the DS Avatar's `small` — and it is the mark the tenancy
  // switcher wears in both places it appears: the header pill and the panel rows,
  // beside the account's and workspace's own 24px marks (./TenancySwitcher.vue).
  // `small` (20) is the compact mark for a form that previews an org inline, and
  // `large` (48) the org at rest in the create flow and onboarding.
  const sizeClasses = {
    small: 'size-(--size-5)',
    medium: 'size-(--size-6)',
    large: 'size-(--size-12)'
  }
</script>

<template>
  <span
    role="img"
    :aria-label="name"
    :class="[
      sizeClasses[size] ?? sizeClasses.small,
      'inline-flex shrink-0 overflow-hidden rounded-(--shape-button)'
    ]"
  >
    <svg
      :viewBox="`0 0 ${MARBLE_SIZE} ${MARBLE_SIZE}`"
      width="100%"
      height="100%"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <!-- The field the blobs float over. -->
        <rect
          :width="MARBLE_SIZE"
          :height="MARBLE_SIZE"
          :style="fillOf(0)"
        />
        <path
          :filter="`url(#${filterId})`"
          :transform="marbleTransform(elements[1])"
          :style="fillOf(1)"
          d="M32.414 59.35L50.376 70.5H72.5v-71H33.728L26.5 13.381l19.057 27.08L32.414 59.35z"
        />
        <!-- Overlay blending is what turns two flat shapes into depth. -->
        <path
          :filter="`url(#${filterId})`"
          :transform="marbleTransform(elements[2])"
          :style="{ ...fillOf(2), mixBlendMode: 'overlay' }"
          d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z"
        />
      </g>
      <defs>
        <filter
          :id="filterId"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood
            flood-opacity="0"
            result="BackgroundImageFix"
          />
          <feBlend
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="7"
            result="effect1_foregroundBlur"
          />
        </filter>
      </defs>
    </svg>
  </span>
</template>
