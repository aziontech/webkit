import { tokenRef } from '../../scripts/refs.js'

/**
 * Syntax-highlighting colors for code editors (Figma: code-sintax).
 * Dark values match variable set 77:502 in Webkit Figma.
 */
export const codeSintax = {
  light: {
    'code-sintax-identifier': tokenRef('primitives.gray.900'),
    'code-sintax-line-number': tokenRef('primitives.gray.500'),
    'code-sintax-keyword': tokenRef('primitives.blue.600'),
    'code-sintax-punctuation': tokenRef('primitives.gray.500'),
    'code-sintax-function': tokenRef('brand.primary.primary-500'),
    'code-sintax-type': tokenRef('primitives.yellow.700'),
    'code-sintax-string': tokenRef('primitives.blue.600')
  },
  dark: {
    'code-sintax-identifier': tokenRef('primitives.gray.50'),
    'code-sintax-line-number': tokenRef('primitives.gray.400'),
    'code-sintax-keyword': tokenRef('primitives.blue.400'),
    'code-sintax-punctuation': tokenRef('primitives.gray.400'),
    'code-sintax-function': tokenRef('brand.primary.primary-500'),
    'code-sintax-type': tokenRef('primitives.yellow.300'),
    'code-sintax-string': tokenRef('primitives.blue.400')
  }
}

export default { codeSintax }
