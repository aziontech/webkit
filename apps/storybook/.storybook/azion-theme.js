import { primitives } from '@aziontech/theme/colors'

const { brand, surface, gray } = primitives

export const FONT_BASE = '"Rubik", ui-sans-serif, system-ui, sans-serif'
export const FONT_CODE = '"JetBrains Mono", ui-monospace, monospace'

export const azionDocsTheme = {
  base: 'dark',

  fontBase: FONT_BASE,
  fontCode: FONT_CODE,

  colorPrimary: brand.primary[500],
  colorSecondary: brand.primary[500],

  appBg: surface[950],
  appContentBg: surface[950],
  appPreviewBg: surface[950],
  appBorderColor: surface[800],
  appBorderRadius: 6,

  textColor: gray[50],
  textMutedColor: gray[400],
  textInverseColor: surface[950],

  barTextColor: gray[400],
  barHoverColor: brand.primary[400],
  barSelectedColor: brand.primary[500],
  barBg: surface[900],

  buttonBg: surface[800],
  buttonBorder: surface[700],
  booleanBg: surface[800],
  booleanSelectedBg: surface[700],

  inputBg: surface[800],
  inputBorder: surface[700],
  inputTextColor: gray[50],
  inputBorderRadius: 6
}
