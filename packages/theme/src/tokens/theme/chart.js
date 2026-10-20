import { tokenRef } from '../../scripts/refs.js'

const shared = {
  'chart-series-1': tokenRef('primitives.orange.600'),
  'chart-series-3': tokenRef('primitives.green.700'),
  'chart-series-4': tokenRef('primitives.red.500'),
  'chart-series-6': tokenRef('primitives.yellow.700'),
  'chart-series-other': tokenRef('primitives.gray.500'),
  'chart-grid': tokenRef('theme.border.border-muted'),
  'chart-axis': tokenRef('theme.border.border-default'),
  'chart-label': tokenRef('theme.text.text-muted'),
  'chart-crosshair': tokenRef('theme.text.text-muted'),
  'chart-tooltip-bg': tokenRef('theme.background.bg-contrast'),
  'chart-tooltip-text': tokenRef('theme.text.text-contrast'),
  'chart-status-success': tokenRef('theme.success.success-contrast'),
  'chart-status-warning': tokenRef('theme.warning.warning-contrast'),
  'chart-status-danger': tokenRef('theme.danger.danger-contrast'),
  'chart-status-info': tokenRef('theme.info.info-contrast')
}

export const chart = {
  light: {
    ...shared,
    'chart-series-2': tokenRef('primitives.blue.600'),
    'chart-series-5': tokenRef('primitives.violet.700'),
    'chart-tooltip-muted': tokenRef('primitives.gray.300'),
    'chart-sequential-1': tokenRef('primitives.blue.100'),
    'chart-sequential-2': tokenRef('primitives.blue.200'),
    'chart-sequential-3': tokenRef('primitives.blue.300'),
    'chart-sequential-4': tokenRef('primitives.blue.400'),
    'chart-sequential-5': tokenRef('primitives.blue.500'),
    'chart-sequential-6': tokenRef('primitives.blue.600'),
    'chart-sequential-7': tokenRef('primitives.blue.700'),
    'chart-diverging-negative': tokenRef('primitives.red.600'),
    'chart-diverging-neutral': tokenRef('primitives.gray.150'),
    'chart-diverging-positive': tokenRef('primitives.blue.600')
  },
  dark: {
    ...shared,
    'chart-series-2': tokenRef('primitives.blue.500'),
    'chart-series-5': tokenRef('primitives.violet.600'),
    'chart-tooltip-muted': tokenRef('primitives.gray.650'),
    'chart-sequential-1': tokenRef('primitives.blue.900'),
    'chart-sequential-2': tokenRef('primitives.blue.800'),
    'chart-sequential-3': tokenRef('primitives.blue.700'),
    'chart-sequential-4': tokenRef('primitives.blue.600'),
    'chart-sequential-5': tokenRef('primitives.blue.500'),
    'chart-sequential-6': tokenRef('primitives.blue.400'),
    'chart-sequential-7': tokenRef('primitives.blue.300'),
    'chart-diverging-negative': tokenRef('primitives.red.400'),
    'chart-diverging-neutral': tokenRef('primitives.gray.750'),
    'chart-diverging-positive': tokenRef('primitives.blue.400')
  }
}

export default { chart }
