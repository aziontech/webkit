import AccordionGallery from '@aziontech/webkit/accordion-gallery'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import AccordionGallery from '@aziontech/webkit/accordion-gallery'"

const STEPS = [
  {
    title: 'Build',
    points: [
      'Import a repository from GitHub',
      'Keep the framework you already use',
      'Pick a preset, or let the build be detected'
    ],
    backgroundImage: '/media/build-applications.svg'
  },
  {
    title: 'Deploy',
    points: [
      'One command, or one click from a pull request',
      'Every location at once, in seconds',
      'Roll back to any previous release'
    ],
    backgroundImage: '/media/fastest-path-to-live-website.svg'
  },
  {
    title: 'Observe',
    points: [
      'Logs and metrics as they happen',
      'Trace a single request end to end',
      'Alerts wired to the channels you already watch'
    ],
    backgroundImage: '/media/live-debugging.svg'
  }
]

const ITEMS_ATTRIBUTE = [
  '  :items="[',
  STEPS.map((step) =>
    [
      '    {',
      `      title: '${step.title}',`,
      '      points: [',
      step.points.map((point) => `        '${point}'`).join(',\n'),
      '      ],',
      `      backgroundImage: '${step.backgroundImage}'`,
      '    }'
    ].join('\n')
  ).join(',\n'),
  '  ]"'
].join('\n')

/** @type {import('@storybook/vue3').Meta<typeof AccordionGallery>} */
const meta = {
  title: 'Components/Marketing/AccordionGallery',
  component: AccordionGallery,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          'A two-column gallery: a stack of selectable steps on one side and the image for the selected step on the other, cross-fading as the selection moves. It advances on its own on a timer with a progress bar over the active step, and collapses below `lg` to one column where the selected step reveals its own image inline.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    items: {
      control: 'object',
      description:
        'The steps, in order; each item is `{ title, points, backgroundImage }`. Give every item an image of the same shape — the image column holds one frame and cross-fades within it, so mismatched aspect ratios jump.',
      table: {
        category: 'props',
        type: { summary: 'AccordionGalleryItem[]' },
        defaultValue: { summary: '[]' }
      }
    },
    autoPlay: {
      control: 'boolean',
      description:
        'Advances to the next step on a timer; stops on interaction and never runs under reduced motion.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    autoPlayInterval: {
      control: 'number',
      description: 'Milliseconds each step is held before the gallery advances.',
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: '5000' }
      }
    },
    showProgress: {
      control: 'boolean',
      description: 'Draws the autoplay progress bar over the active step.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    onStepChange: {
      action: 'step-change',
      description:
        'The active step changed; `index` is the step now shown. Fires on a reader selection, not on an autoplay tick.',
      table: {
        category: 'events',
        type: { summary: '(event: MouseEvent, index: number)' }
      }
    }
  },
  args: {
    items: STEPS,
    autoPlay: true,
    autoPlayInterval: 5000,
    showProgress: true
  }
}

export default meta

const Template = (args) => ({
  components: { AccordionGallery },
  setup() {
    return { args }
  },
  template: '<AccordionGallery v-bind="args" />'
})

const DEFAULT_MARKUP = `<AccordionGallery
${ITEMS_ATTRIBUTE}
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof AccordionGallery>} */
export const Default = {
  render: Template,
  parameters: {
    visual: false,
    docs: {
      description: {
        story:
          'The gallery as a product page gets it: autoplay on, a progress bar draining over the active step, and the image column cross-fading as the selection moves. Selecting a step stops the timer for good — the gallery is a sequence a reader may watch or take over, never one that keeps moving under them. It also pauses while the band has hover or focus, and does not start at all under `prefers-reduced-motion`. Below `lg` the image column is dropped and the selected step reveals its own picture inline instead. Because it moves on a timer, this story is excluded from the visual baseline; `Static` is the snapshotted view.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const STATIC_MARKUP = `<AccordionGallery
${ITEMS_ATTRIBUTE}
  :auto-play="false"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof AccordionGallery>} */
export const Static = {
  args: { autoPlay: false },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Autoplay off, so the gallery rests on its first step and moves only when a reader picks another. The progress bar goes with the timer — there is nothing left to indicate — which is the shape to reach for where the steps are a reference to consult rather than a sequence to watch. Everything else is unchanged: the same cross-fade on selection, the same single-column collapse below `lg`.'
      },
      source: { code: toSfc(IMPORT, STATIC_MARKUP) }
    }
  }
}
