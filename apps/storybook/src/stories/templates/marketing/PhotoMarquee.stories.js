import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
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

const WORK = {
  title: 'Work at Azion',
  description:
    'At Azion, culture is how we live and work every day. The Azion Way of Life is built on the belief that high performance goes hand in hand with autonomy, authenticity, and enjoyment. We trust people to manage their own routines with balance and accountability, focusing on outcomes.'
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

const slide = (photo, duplicate) => `<li
  class="h-80 shrink-0 overflow-hidden sm:h-112"
  style="aspect-ratio: ${photo.width} / ${photo.height}"
>
  <img
    src="${photo.src}"
    alt="${duplicate ? '' : photo.alt}"
    width="${photo.width}"
    height="${photo.height}"
    draggable="false"
    decoding="async"
    class="size-full object-cover"
  />
</li>`

const row = (duplicate) => `<ul
  ${duplicate ? 'aria-hidden="true"\n  data-duplicate\n  ' : ''}class="m-0 flex shrink-0 list-none items-end gap-(--spacing-md) p-0 pr-(--spacing-md) motion-reduce:data-[duplicate]:hidden"
>
${each(PHOTOS, (photo) => slide(photo, duplicate), 1)}
</ul>`

const TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle
      kind="horizontal"
      title="${WORK.title}"
      description="${WORK.description}"
    />
  </template>

  <FrameBox flush borders="y" marks="bottom">
    <div
      class="group/loop overflow-hidden motion-reduce:overflow-x-auto"
      role="region"
      aria-label="Azion offices"
    >
      <div
        style="animation-duration: 60s"
        class="flex w-max animate-brand-marquee group-hover/loop:[animation-play-state:paused] motion-reduce:animate-none"
      >
${indent(row(false), 4)}
${indent(row(true), 4)}
      </div>
    </div>
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Media/PhotoMarquee',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A `SectionTitle` header, its headline and paragraph side by side, over a row of photos that loops across the band. Each slide keeps its photo’s own aspect ratio at one shared height, so portrait and landscape shots sit in one strip. The row is drawn twice and travels half its width, so the second copy lands where the first started; hovering pauses it, and under reduced motion it stops and becomes a plain horizontal scroll with the repeated row hidden. Careers uses it for its offices. Built from `SectionModule`, `SectionTitle` and `FrameBox`, with the theme’s `animate-brand-marquee` utility.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Offices = {
  render: () => ({ components, template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Careers page’s “Work at Azion” band: six office photos, three portrait and three landscape, looping in 60 seconds.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
