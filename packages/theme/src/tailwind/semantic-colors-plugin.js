/**
 * No-op plugin: semantic text/bg/border utilities come from tailwind-preset
 * (`textColor`, `backgroundColor`, `borderColor` in theme.extend).
 */
const plugin = (() => {
  try {
    return require('tailwindcss/plugin')
  } catch {
    return (handler) => handler
  }
})()

const semanticColors = () => plugin(() => {})

export default semanticColors
