import Embed from '@aziontech/webkit/embed'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Embed from '@aziontech/webkit/embed'"

const SRC =
  "data:text/html,<body style='margin:0;height:100vh;display:grid;place-items:center;font:1rem system-ui;color:gray'>Placeholder embed</body>"

const TITLE = 'A placeholder document standing in for an embedded demo'

/** @type {import('@storybook/vue3').Meta<typeof Embed>} */
const meta = {
  title: 'Components/Marketing/Embed',
  component: Embed,
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
          'A framed, responsive `iframe` for third-party content — a demo, a player, a status page, a form — that keeps its aspect ratio at every width and always carries the accessible name an `iframe` needs. It is the one place external content enters a page, so the attributes that are easy to forget are not optional.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    src: {
      control: 'text',
      description:
        'URL of the document to embed. Every story here points at a placeholder document inlined as a `data:` URI, never at a live third-party URL.',
      table: {
        category: 'props',
        type: { summary: 'string', required: true }
      }
    },
    title: {
      control: 'text',
      description:
        'Accessible name for the embedded document, announced before its content. Say what the embedded thing is, not that it is a frame.',
      table: {
        category: 'props',
        type: { summary: 'string', required: true }
      }
    },
    ratio: {
      control: 'select',
      options: ['video', 'square', 'wide'],
      description:
        'Aspect ratio the frame holds while it scales: `video` is 16:9, `square` is 1:1, `wide` is 21:9.',
      table: {
        category: 'props',
        type: { summary: "'video' | 'square' | 'wide'" },
        defaultValue: { summary: "'video'" }
      }
    }
  },
  args: {
    src: SRC,
    title: TITLE,
    ratio: 'video'
  }
}

export default meta

const Template = (args) => ({
  components: { Embed },
  setup() {
    return { args }
  },
  template: '<Embed v-bind="args" />'
})

const DEFAULT_MARKUP = `<Embed
  src="${SRC}"
  title="${TITLE}"
  ratio="video"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof Embed>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'One frame at the default `video` ratio. The source is a placeholder document inlined as a `data:` URI rather than a live third-party URL: a real embed pulls in a document from another origin, which a docs build should not do on every page view. Change `ratio` in the Controls panel and the frame changes shape without the page shifting, because the ratio is reserved before the document loads. `title` has no default on purpose — an `iframe` without one is announced as an unnamed frame, and a screen-reader user meets that name before any content.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const RATIOS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xxl)">
  <Embed
    src="${SRC}"
    title="A placeholder document in a 16:9 frame"
    ratio="video"
  />
  <Embed
    src="${SRC}"
    title="A placeholder document in a square frame"
    ratio="square"
  />
  <Embed
    src="${SRC}"
    title="A placeholder document in a 21:9 frame"
    ratio="wide"
  />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Embed>} */
export const Ratios = {
  render: () => ({ components: { Embed }, template: RATIOS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Every `ratio` value, one frame under the other, around the same placeholder document. Each frame keeps its shape at any width — only the height follows. Pick the ratio the source already has: a `video` frame around a square form leaves bands of empty surface above and below it, and no ratio will crop a document that disagrees, it will just scroll inside the frame. Each frame states its own `title`, because every embedded document needs its own name.'
      },
      source: { code: toSfc(IMPORT, RATIOS_TEMPLATE) }
    }
  }
}
