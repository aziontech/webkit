import { tokenRef } from '../../scripts/refs.js'

const aliases = {
  'illustration-ground': tokenRef('theme.background.bg-canvas'),
  'illustration-surface': tokenRef('theme.background.bg-surface'),
  'illustration-surface-raised': tokenRef('theme.background.bg-surface-raised'),
  'illustration-block': tokenRef('theme.background.bg-selected'),
  'illustration-line': tokenRef('theme.border.border-default'),
  'illustration-line-muted': tokenRef('theme.border.border-muted'),
  'illustration-line-strong': tokenRef('theme.text.text-disabled'),
  'illustration-highlight': tokenRef('theme.border.border-strong'),
  'illustration-ink': tokenRef('theme.text.text-default'),
  'illustration-ink-muted': tokenRef('theme.text.text-muted'),
  'illustration-primary': tokenRef('theme.primary.primary'),
  'illustration-accent': tokenRef('theme.accent.accent'),
  'illustration-code-punctuation': tokenRef('theme.codeSintax.code-sintax-punctuation'),
  'illustration-code-keyword': tokenRef('theme.codeSintax.code-sintax-keyword'),
  'illustration-success': tokenRef('theme.success.success-contrast'),
  'illustration-success-surface': tokenRef('theme.success.success'),
  'illustration-danger': tokenRef('theme.danger.danger-contrast'),
  'illustration-warning': tokenRef('theme.warning.warning-contrast'),
  'illustration-warning-surface': tokenRef('theme.warning.warning'),
  'illustration-info': tokenRef('theme.info.info-contrast'),
  'illustration-info-surface': tokenRef('theme.info.info')
}

export const illustration = {
  light: aliases,
  dark: aliases
}

export default { illustration }
