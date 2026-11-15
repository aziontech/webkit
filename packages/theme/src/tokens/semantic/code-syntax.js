import { tokenRef } from '../token-ref.js'

export const codeSyntax = {
  light: {
    'code-syntax-identifier': tokenRef('primitives.gray.900'),
    'code-syntax-line-number': tokenRef('primitives.gray.650'),
    'code-syntax-keyword': tokenRef('primitives.blue.700'),
    'code-syntax-punctuation': tokenRef('primitives.gray.650'),
    'code-syntax-comment': tokenRef('primitives.gray.650'),
    'code-syntax-function': tokenRef('brand.primary.primary-700'),
    'code-syntax-type': tokenRef('primitives.yellow.800'),
    'code-syntax-string': tokenRef('primitives.blue.700')
  },
  dark: {
    'code-syntax-identifier': tokenRef('primitives.gray.50'),
    'code-syntax-line-number': tokenRef('primitives.gray.400'),
    'code-syntax-keyword': tokenRef('primitives.blue.200'),
    'code-syntax-punctuation': tokenRef('primitives.gray.300'),
    'code-syntax-comment': tokenRef('primitives.gray.400'),
    'code-syntax-function': tokenRef('brand.primary.primary-300'),
    'code-syntax-type': tokenRef('primitives.yellow.300'),
    'code-syntax-string': tokenRef('primitives.blue.200')
  }
}

export default { codeSyntax }
