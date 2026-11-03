import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'
import TextureMaterial from '@aziontech/webkit/texture-material'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { editable } from '../../_shared/editable-content'
import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const components = {
  FrameBox,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle,
  TextureMaterial
}

const IMPORTS = [
  ...COLUMN_IMPORTS,
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'",
  "import TextureMaterial from '@aziontech/webkit/texture-material'",
  "import { onBeforeUnmount, onMounted, ref } from 'vue'"
]

const COPY = {
  eyebrow: 'How we hire',
  title: 'Hiring process',
  description: 'Every role goes through the same five stages, from the first request to the offer.',
  ariaLabel: 'Hiring process stages'
}

const ITEMS = [
  {
    title: 'Role request',
    description: 'A hiring manager requests a new role.'
  },
  {
    title: 'Scope and posting',
    description:
      'We define the role’s scope, write the job description, and post the opening on selected channels.'
  },
  {
    title: 'Recruiting and interviews',
    description:
      'We source and screen candidates, then schedule interviews and, when the role needs one, a technical assessment.'
  },
  {
    title: 'Calibration',
    description: 'Interviewers meet to compare feedback and choose the candidate.'
  },
  {
    title: 'Offer letter',
    description: 'We prepare the offer and send it to the chosen candidate.'
  }
]

const SCROLL_OPTIONS = { capture: true, passive: true }

const stickyCarousel = () => {
  const runway = ref(null)
  const pinned = ref(null)
  const viewport = ref(null)
  const track = ref(null)
  const runwayHeight = ref('')
  const offset = ref(0)
  let frame = null
  let observer = null

  const measure = () => {
    frame = null
    if (!runway.value || !pinned.value || !viewport.value || !track.value) return
    if (getComputedStyle(pinned.value).position !== 'sticky') {
      runwayHeight.value = ''
      offset.value = 0
      return
    }
    const overflow = Math.max(0, track.value.offsetWidth - viewport.value.clientWidth)
    runwayHeight.value = `${pinned.value.offsetHeight + overflow}px`
    const travelled =
      pinned.value.getBoundingClientRect().top - runway.value.getBoundingClientRect().top
    offset.value = Math.min(overflow, Math.max(0, travelled))
  }

  const schedule = () => {
    if (frame === null) frame = requestAnimationFrame(measure)
  }

  onMounted(() => {
    document.addEventListener('scroll', schedule, SCROLL_OPTIONS)
    window.addEventListener('resize', schedule, { passive: true })
    observer = new ResizeObserver(schedule)
    observer.observe(pinned.value)
    observer.observe(track.value)
    measure()
  })

  onBeforeUnmount(() => {
    if (frame !== null) cancelAnimationFrame(frame)
    document.removeEventListener('scroll', schedule, SCROLL_OPTIONS)
    window.removeEventListener('resize', schedule)
    observer?.disconnect()
  })

  const cardNumber = (index) => String(index + 1).padStart(2, '0')

  return { items: ITEMS, runway, pinned, viewport, track, runwayHeight, offset, cardNumber }
}

const SCRIPT = `const items = ${JSON.stringify(ITEMS, null, 2).replace(/"([a-z]+)":/g, '$1:')}

const SCROLL_OPTIONS = { capture: true, passive: true }

const runway = ref(null)
const pinned = ref(null)
const viewport = ref(null)
const track = ref(null)
const runwayHeight = ref('')
const offset = ref(0)
let frame = null
let observer = null

const measure = () => {
  frame = null
  if (!runway.value || !pinned.value || !viewport.value || !track.value) return
  if (getComputedStyle(pinned.value).position !== 'sticky') {
    runwayHeight.value = ''
    offset.value = 0
    return
  }
  const overflow = Math.max(0, track.value.offsetWidth - viewport.value.clientWidth)
  runwayHeight.value = \`\${pinned.value.offsetHeight + overflow}px\`
  const travelled =
    pinned.value.getBoundingClientRect().top - runway.value.getBoundingClientRect().top
  offset.value = Math.min(overflow, Math.max(0, travelled))
}

const schedule = () => {
  if (frame === null) frame = requestAnimationFrame(measure)
}

onMounted(() => {
  document.addEventListener('scroll', schedule, SCROLL_OPTIONS)
  window.addEventListener('resize', schedule, { passive: true })
  observer = new ResizeObserver(schedule)
  observer.observe(pinned.value)
  observer.observe(track.value)
  measure()
})

onBeforeUnmount(() => {
  if (frame !== null) cancelAnimationFrame(frame)
  document.removeEventListener('scroll', schedule, SCROLL_OPTIONS)
  window.removeEventListener('resize', schedule)
  observer?.disconnect()
})

const cardNumber = (index) => String(index + 1).padStart(2, '0')`

const TEMPLATE = inColumn(`<div ref="runway" :style="{ height: runwayHeight || undefined }">
  <div
    ref="pinned"
    class="flex flex-col lg:motion-safe:sticky lg:motion-safe:top-14 lg:motion-safe:h-[calc(100dvh_-_3.5rem)]"
  >
    <SectionModule :divided="false" :padded="false">
      <template #header>
        <SectionTitle
          eyebrow="${COPY.eyebrow}"
          title="${COPY.title}"
          description="${COPY.description}"
        />
      </template>
    </SectionModule>

    <div class="grid flex-1 grid-cols-1">
      <FrameBox flush borders="y" marks="bottom">
        <div
          ref="viewport"
          role="region"
          aria-label="${COPY.ariaLabel}"
          tabindex="0"
          class="h-full snap-x snap-mandatory overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) lg:motion-safe:snap-none lg:motion-safe:overflow-hidden"
        >
          <ol
            ref="track"
            :style="{ translate: offset ? \`\${-offset}px 0\` : undefined }"
            class="m-0 flex h-full w-max list-none p-0"
          >
            <li
              v-for="(item, index) in items"
              :key="item.title"
              data-theme="dark"
              style="--texture-pool-a: 50% 112%; --texture-pool-b: 50% -10%; --texture-wave-pace: 6; --texture-wave-gain: 1.4"
              class="relative flex min-h-80 w-[min(22rem,80vw)] shrink-0 snap-start flex-col justify-between gap-(--spacing-xxl) overflow-hidden border-(--border-default) bg-(--bg-surface) not-last:border-r p-(--spacing-xl) lg:w-104"
            >
              <TextureMaterial kind="pixelate" size="small" />
              <div
                aria-hidden="true"
                class="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_top,var(--bg-surface)_0%,color-mix(in_srgb,var(--bg-surface)_92%,transparent)_34%,transparent_62%)]"
              />
              <span aria-hidden="true" class="relative text-big-number-lg tabular-nums text-(--text-default)">
                {{ cardNumber(index) }}
              </span>
              <div class="relative flex flex-col gap-(--spacing-sm)">
                <h3 class="m-0 text-balance text-heading-sm text-(--text-default)">{{ item.title }}</h3>
                <p class="m-0 text-pretty text-body-md text-(--text-muted)">{{ item.description }}</p>
              </div>
            </li>
          </ol>
        </div>
      </FrameBox>
    </div>
  </div>
</div>`)

const meta = {
  title: 'Templates/Marketing/Content/StickyCarousel',
  excludeStories: ['SITE_SECTION'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  ...editable(() => ({
    components,
    setup: stickyCarousel,
    template: TEMPLATE
  })),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS.concat('', SCRIPT), TEMPLATE) }
    }
  }
}

export const SITE_SECTION = {
  _id: 'sticky-carousel',
  props: {
    ...COPY,
    items: ITEMS
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
