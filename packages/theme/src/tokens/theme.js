import { brandPrimitives, primitives, surfacePrimitives } from './primitives/colors/colors.js'
import { semanticColors } from './semantic/colors.js'

export const theme = {
  extend: {
    colors: {
      base: {
        white: primitives.base.white,
        black: primitives.base.black
      },
      brand: {
        primary: brandPrimitives.primary,
        accent: brandPrimitives.accent
      },
      surface: surfacePrimitives.surface,
      orange: primitives.orange,
      violet: primitives.violet,
      neutral: primitives.neutral,
      gray: primitives.gray,
      slate: primitives.slate,
      red: primitives.red,
      green: primitives.green,
      yellow: primitives.yellow,
      blue: primitives.blue
    },
    textColor: semanticColors.text,
    backgroundColor: semanticColors.background,
    borderColor: semanticColors.border
  }
}

export default { theme }
