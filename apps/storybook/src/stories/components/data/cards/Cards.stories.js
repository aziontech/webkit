import Cards from '@aziontech/webkit/cards'

import Example0 from '../../../../../../../packages/webkit/examples/cards/default.vue'
import source0 from '../../../../../../../packages/webkit/examples/cards/default.vue?raw'
import Example1 from '../../../../../../../packages/webkit/examples/cards/selectable.vue'
import source1 from '../../../../../../../packages/webkit/examples/cards/selectable.vue?raw'

export default {
  title: 'Components/Primitives/Data/Cards',
  component: Cards,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' },
      description: {
        component:
          "A collection shown as cards, after Cloudscape's cards: one card per item, named by its `header` slot, with the item's fields in the default slot. It shares Table's item and selection model — `items`, `trackBy`, `selectedKeys` — so `useCollection` binds it through `cardsProps`, and selection (single or multi, with a visible select-all) survives paging. Four cards a row in a wide container, then three, two and one as the container narrows."
      }
    }
  }
}

export const Default = {
  render: () => ({ components: { Example: Example0 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'A collection shown as cards: the `header` slot names each card and the default slot lays out its fields. Four columns in a wide container, then three, two and one as it narrows (container queries, not the viewport).'
      },
      source: { code: source0 }
    }
  }
}

export const Selectable = {
  render: () => ({ components: { Example: Example1 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'Bound to `useCollection` with multi selection: each card gets a checkbox named by its header, a visible Select all items sits above the cards, and the selection survives paging (the same item and selection model as Table).'
      },
      source: { code: source1 }
    }
  }
}
