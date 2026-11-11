import PropertyFilter from '@aziontech/webkit/property-filter'

import Example0 from '../../../../../../../packages/webkit/examples/property-filter/default.vue'
import source0 from '../../../../../../../packages/webkit/examples/property-filter/default.vue?raw'
import Example1 from '../../../../../../../packages/webkit/examples/property-filter/with-collection.vue'
import source1 from '../../../../../../../packages/webkit/examples/property-filter/with-collection.vue?raw'

export default {
  title: 'Components/Primitives/Data/PropertyFilter',
  component: PropertyFilter,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' },
      description: {
        component:
          "One field that filters a collection by properties and free text, after Cloudscape's property filter. Typing suggests a property, then an operator, then a value, and each choice becomes a removable token (`Status = Active`); text typed without a property becomes a free-text token. Two or more tokens combine with Match all (and) or Match any (or). It edits a `PropertyFilterQuery` and never filters anything itself: `useCollection` (or the server) applies the query, and `propertyFilterProps` binds the query, the properties and the match count in one `v-bind`."
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
          'One field that suggests a property, then an operator, then a value, and turns each choice into a removable token (`Status = Active`). Typed text without a property becomes a free-text token. With two tokens or more, a Match all / Match any switch combines them; Clear filters removes every token and the count says how many items match.'
      },
      source: { code: source0 }
    }
  }
}

export const WithCollection = {
  render: () => ({ components: { Example: Example1 }, template: '<Example />' }),
  parameters: {
    docs: {
      description: {
        story:
          'Bound to `useCollection`: `propertyFilterProps` feeds the query, the properties and the match count, and the table rows narrow as tokens are added.'
      },
      source: { code: source1 }
    }
  }
}
