import { tokenRef } from '../../scripts/refs.js'

export const codeSintax = {
  light: {
    'code-sintax-identifier': tokenRef('primitives.gray.900'),
    'code-sintax-line-number': tokenRef('primitives.gray.650'),
    'code-sintax-keyword': tokenRef('primitives.blue.700'),
    'code-sintax-punctuation': tokenRef('primitives.gray.650'),
    'code-sintax-comment': tokenRef('primitives.gray.650'),
    'code-sintax-function': tokenRef('brand.primary.primary-800'),
    'code-sintax-type': tokenRef('primitives.yellow.800'),
    'code-sintax-string': tokenRef('primitives.blue.700')
  },
  dark: {
    'code-sintax-identifier': tokenRef('primitives.gray.50'),
    'code-sintax-line-number': tokenRef('primitives.gray.400'),
    'code-sintax-keyword': tokenRef('primitives.blue.300'),
    'code-sintax-punctuation': tokenRef('primitives.gray.400'),
    'code-sintax-comment': tokenRef('primitives.gray.400'),
    'code-sintax-function': tokenRef('brand.primary.primary-400'),
    'code-sintax-type': tokenRef('primitives.yellow.300'),
    'code-sintax-string': tokenRef('primitives.blue.300')
  }
}

export default { codeSintax }
