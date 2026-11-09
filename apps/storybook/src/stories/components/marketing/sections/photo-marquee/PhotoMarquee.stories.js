import PhotoMarquee from '@aziontech/webkit/photo-marquee'

import { toSfc } from '../../../../_shared/story-source'
import { SITE_SECTION } from '../../../../templates/marketing/_sections/photo-marquee'

const IMPORT = "import PhotoMarquee from '@aziontech/webkit/photo-marquee'"

/** @type {import('@storybook/vue3').Meta<typeof PhotoMarquee>} */
const meta = {
  title: 'Components/Marketing/Sections/PhotoMarquee',
  component: PhotoMarquee,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          "The office band of the careers page: a horizontal section title over a framed strip of photographs of varied aspect ratios that scrolls continuously and pauses on hover or focus. It is a page section — the site places it from a `{ _id: 'photo-marquee', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title` and `frame-box`."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description:
        'Headline of the band, rendered by the horizontal section title as its `h2`; the band renders no header when empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    description: {
      control: 'text',
      description: 'Paragraph beside the headline.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    descriptionWidth: {
      control: 'select',
      options: ['narrow', 'wide'],
      description: 'Width the description is capped at: `narrow` or `wide`.',
      table: {
        category: 'props',
        type: { summary: 'PhotoMarqueeDescriptionWidth' },
        defaultValue: { summary: "'narrow'" }
      }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the scrolling region.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    duration: {
      control: 'number',
      description: 'Seconds one loop of the strip takes; `0` paces it at ten seconds per photo.',
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: '0' }
      }
    },
    photos: {
      control: 'object',
      description: 'The photographs, in order; each is `{ src, alt, width, height }`.',
      table: {
        category: 'props',
        type: { summary: 'PhotoMarqueePhoto[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { PhotoMarquee },
  setup() {
    return { args }
  },
  template: '<PhotoMarquee v-bind="args" />'
})

const DEFAULT_MARKUP = `<PhotoMarquee
  title="Work at Azion"
  description="The Azion Way of Life pairs high performance with autonomy, authenticity, and enjoyment. You manage your own routine and answer for outcomes, working with teammates across countries and cultures. There's no dress code: what counts is the ideas, energy, and integrity you bring."
  description-width="wide"
  aria-label="Azion offices"
  :photos="[
    { src: '/media/careers/office-desks.jpg', alt: 'An open-plan office with a fern-lined shelf and a person working at a shared desk', width: 1066, height: 1600 },
    { src: '/media/careers/office-lounge.jpg', alt: 'A lounge corridor with a sofa and two sling chairs along a wall of windows', width: 1600, height: 1066 },
    { src: '/media/careers/team-talk.jpg', alt: 'A team member giving a talk in front of a screen while colleagues listen with laptops', width: 900, height: 1600 },
    { src: '/media/careers/office-window-bar.jpg', alt: 'One person reading on a window bench while two colleagues talk at a window counter', width: 1066, height: 1600 },
    { src: '/media/careers/office-shelves.jpg', alt: 'Shelves of ferns and collectible figures beside a glass-walled meeting room', width: 1600, height: 1066 },
    { src: '/media/careers/office-private-room.jpg', alt: 'A wood-panelled meeting room with a person working on a laptop by the window', width: 1600, height: 1066 }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof PhotoMarquee>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The band as the careers page places it: the headline and wide description over a strip of six office photographs that scrolls continuously and pauses on hover or focus. Edit the props in the Controls panel — a band with no photos renders nothing at all.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
