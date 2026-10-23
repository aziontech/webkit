import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { COLUMN_IMPORTS, each, inColumn } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'"
]

const components = {
  FrameBox,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle
}

const PHOTOS = [
  {
    src: '/media/careers/office-desks.jpg',
    alt: 'An open-plan office with a fern-lined shelf and a person working at a shared desk',
    width: 1066,
    height: 1600
  },
  {
    src: '/media/careers/office-lounge.jpg',
    alt: 'A lounge corridor with a sofa and two sling chairs along a wall of windows',
    width: 1600,
    height: 1066
  },
  {
    src: '/media/careers/team-talk.jpg',
    alt: 'A team member giving a talk in front of a screen while colleagues listen with laptops',
    width: 900,
    height: 1600
  },
  {
    src: '/media/careers/office-window-bar.jpg',
    alt: 'One person reading on a window bench while two colleagues talk at a window counter',
    width: 1066,
    height: 1600
  },
  {
    src: '/media/careers/office-shelves.jpg',
    alt: 'Shelves of ferns and collectible figures beside a glass-walled meeting room',
    width: 1600,
    height: 1066
  },
  {
    src: '/media/careers/office-private-room.jpg',
    alt: 'A wood-panelled meeting room with a person working on a laptop by the window',
    width: 1600,
    height: 1066
  }
]

const SECONDS_PER_PHOTO = 10

const TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle
      kind="horizontal"
      title="Work at Azion"
      description="We trust people to manage their own routines with balance and accountability, focusing on outcomes, and we collaborate across countries and cultures to build solutions for the world."
    />
  </template>

  <FrameBox flush borders="y" marks="bottom">
    <div
      role="region"
      aria-label="Azion offices"
      tabindex="0"
      class="group/loop overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset motion-reduce:overflow-x-auto"
    >
      <div
        style="animation-duration: ${PHOTOS.length * SECONDS_PER_PHOTO}s"
        class="flex w-max animate-brand-marquee group-focus-within/loop:[animation-play-state:paused] group-hover/loop:[animation-play-state:paused] motion-reduce:animate-none"
      >
        <ul
          v-for="copy in 2"
          :key="copy"
          :data-duplicate="copy === 2 || null"
          :aria-hidden="copy === 2 ? 'true' : undefined"
          class="m-0 flex shrink-0 list-none items-end gap-(--spacing-md) p-0 pr-(--spacing-md) motion-reduce:data-[duplicate]:hidden"
        >
${each(
  PHOTOS,
  (
    photo
  ) => `<li style="aspect-ratio: ${photo.width} / ${photo.height}" class="h-80 shrink-0 overflow-hidden sm:h-112">
  <img
    src="${photo.src}"
    :alt="copy === 2 ? '' : '${photo.alt}'"
    width="${photo.width}"
    height="${photo.height}"
    draggable="false"
    decoding="async"
    class="size-full object-cover"
  />
</li>`,
  5
)}
        </ul>
      </div>
    </div>
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Social Proof/PhotoMarquee',
  excludeStories: ['SITE_SECTION'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, template: TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}

export const SITE_SECTION = {
  _id: 'photo-marquee',
  props: {
    title: 'Work at Azion',
    description:
      'We trust people to manage their own routines with balance and accountability, focusing on outcomes, and we collaborate across countries and cultures to build solutions for the world.',
    ariaLabel: 'Azion offices',
    duration: PHOTOS.length * SECONDS_PER_PHOTO,
    photos: PHOTOS.map((photo) => ({ ...photo, src: photo.src.replace('/media', '') }))
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
