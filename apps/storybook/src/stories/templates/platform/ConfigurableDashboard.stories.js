import { toSfc } from '../../_shared/story-source'
import {
  CONFIGURABLE_COMPONENTS,
  CONFIGURABLE_TEMPLATE,
  configurableScript,
  configurableSetup
} from './_configurable-dashboard'

const meta = {
  title: 'Templates/Platform/Dashboards/ConfigurableDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A configurable dashboard: the reader arranges the cards. An Edit layout Button turns on the ChartCard drag handle and resize corner on every card of a 12-column grid; a card snaps to whole columns between 3 and 12 and to a height between 280 and 720 pixels. Each card keeps its title with a Hint and nothing else in its header, and shows a Tag with its span while editing. The page owns the layout, an array of id, span and height bound with v-model:span and v-model:height, and the order, which it changes on drop or on the arrow keys of a focused drag handle, then puts focus back on the moved handle and announces the move in a polite live region. Reset layout appears once the layout differs from the default. Keep the layout wherever the product stores preferences. Built from `ChartCard` (with `DragHandle` and `ResizeHandle`), `Chart`, `DonutChart`, `BarList`, `Hint`, `Tag` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    },
    webkit: {
      intents: [
        'configurable dashboard',
        'custom dashboard',
        'drag and drop dashboard',
        'resizable cards',
        'edit layout',
        'dashboard builder',
        'painel configurável',
        'painel personalizado',
        'reorganizar cards'
      ],
      skills: ['webkit-data-viz', 'webkit-layout', 'webkit-ui-states']
    }
  }
}

export default meta

const story = (state) => ({
  components: CONFIGURABLE_COMPONENTS,
  setup: configurableSetup(state),
  template: CONFIGURABLE_TEMPLATE
})

export const Default = {
  render: () => story('default'),
  parameters: {
    docs: {
      description: {
        story:
          'The default layout in reading mode. The handles stay hidden until Edit layout is pressed, so the cards read as a plain dashboard.'
      },
      source: { code: toSfc(configurableScript('default'), CONFIGURABLE_TEMPLATE) }
    }
  }
}

export const Editing = {
  render: () => story('editing'),
  parameters: {
    docs: {
      description: {
        story:
          'Edit mode. Drag a card by its handle onto another to swap their order, or drag its corner to change the span and the height. Focus the handle and use the arrow keys to move a card, or focus the corner and use Left and Right for the span, Up and Down for the height.'
      },
      source: { code: toSfc(configurableScript('editing'), CONFIGURABLE_TEMPLATE) }
    }
  }
}

export const Loading = {
  render: () => story('loading'),
  parameters: {
    docs: {
      description: {
        story:
          'While the data loads, every chart renders its own Skeleton inside its card, so the layout holds its shape.'
      },
      source: { code: toSfc(configurableScript('loading'), CONFIGURABLE_TEMPLATE) }
    }
  }
}

export const Empty = {
  render: () => story('empty'),
  parameters: {
    docs: {
      description: {
        story:
          'Nothing recorded yet. Each card keeps its place and size and shows its empty state, so the reader can still arrange the dashboard before any data arrives.'
      },
      source: { code: toSfc(configurableScript('empty'), CONFIGURABLE_TEMPLATE) }
    }
  }
}
