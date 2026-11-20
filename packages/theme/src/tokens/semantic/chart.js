import { tokenRef } from '../token-ref.js'

const shared = {
  'chart-series-other': tokenRef('primitives.gray.500'),
  'chart-axis': tokenRef('theme.border.border-default'),
  'chart-label': tokenRef('theme.text.text-muted'),
  'chart-crosshair': tokenRef('theme.text.text-muted'),
  'chart-tooltip-bg': tokenRef('theme.background.bg-surface-raised'),
  'chart-tooltip-text': tokenRef('theme.text.text-default'),
  'chart-tooltip-muted': tokenRef('theme.text.text-muted'),
  'chart-tooltip-border': tokenRef('theme.border.border-default')
}

export const chart = {
  light: {
    ...shared,
    'chart-grid': tokenRef('primitives.gray.200'),
    'chart-series-1': tokenRef('primitives.blue.500'),
    'chart-series-2': tokenRef('primitives.chart.teal.light'),
    'chart-series-3': tokenRef('primitives.chart.violet.light'),
    'chart-series-4': tokenRef('primitives.chart.orange.light'),
    'chart-series-5': tokenRef('primitives.chart.cyan.light'),
    'chart-series-6': tokenRef('primitives.indigo.700'),
    'chart-series-7': tokenRef('primitives.chart.lime.light'),
    'chart-series-8': tokenRef('primitives.chart.fuchsia.light'),
    'chart-status-success': tokenRef('primitives.green.700'),
    'chart-status-warning': tokenRef('primitives.yellow.700'),
    'chart-status-danger': tokenRef('primitives.red.500'),
    'chart-status-info': tokenRef('primitives.blue.500'),
    'chart-sequential-1': tokenRef('primitives.indigo.100'),
    'chart-sequential-2': tokenRef('primitives.indigo.200'),
    'chart-sequential-3': tokenRef('primitives.indigo.300'),
    'chart-sequential-4': tokenRef('primitives.indigo.400'),
    'chart-sequential-5': tokenRef('primitives.indigo.500'),
    'chart-sequential-6': tokenRef('primitives.indigo.600'),
    'chart-sequential-7': tokenRef('primitives.indigo.700'),
    'chart-diverging-negative': tokenRef('primitives.orange.600'),
    'chart-diverging-negative-2': tokenRef('primitives.chart.diverging-orange-2.light'),
    'chart-diverging-negative-3': tokenRef('primitives.chart.diverging-orange-3.light'),
    'chart-diverging-neutral': tokenRef('primitives.gray.150'),
    'chart-diverging-positive-3': tokenRef('primitives.chart.diverging-blue-3.light'),
    'chart-diverging-positive-2': tokenRef('primitives.chart.diverging-blue-2.light'),
    'chart-diverging-positive': tokenRef('primitives.blue.600')
  },
  dark: {
    ...shared,
    'chart-grid': tokenRef('primitives.gray.800'),
    'chart-tooltip-muted': tokenRef('primitives.gray.275'),
    'chart-series-1': tokenRef('primitives.chart.blue.dark'),
    'chart-series-2': tokenRef('primitives.chart.teal.dark'),
    'chart-series-3': tokenRef('primitives.chart.violet.dark'),
    'chart-series-4': tokenRef('primitives.chart.orange.dark'),
    'chart-series-5': tokenRef('primitives.chart.cyan.dark'),
    'chart-series-6': tokenRef('primitives.indigo.500'),
    'chart-series-7': tokenRef('primitives.chart.lime.dark'),
    'chart-series-8': tokenRef('primitives.chart.fuchsia.dark'),
    'chart-status-success': tokenRef('primitives.green.600'),
    'chart-status-warning': tokenRef('primitives.yellow.600'),
    'chart-status-danger': tokenRef('primitives.red.400'),
    'chart-status-info': tokenRef('primitives.blue.400'),
    'chart-sequential-1': tokenRef('primitives.indigo.950'),
    'chart-sequential-2': tokenRef('primitives.indigo.900'),
    'chart-sequential-3': tokenRef('primitives.indigo.800'),
    'chart-sequential-4': tokenRef('primitives.indigo.600'),
    'chart-sequential-5': tokenRef('primitives.indigo.500'),
    'chart-sequential-6': tokenRef('primitives.indigo.400'),
    'chart-sequential-7': tokenRef('primitives.indigo.300'),
    'chart-diverging-negative': tokenRef('primitives.orange.400'),
    'chart-diverging-negative-2': tokenRef('primitives.chart.diverging-orange-2.dark'),
    'chart-diverging-negative-3': tokenRef('primitives.chart.diverging-orange-3.dark'),
    'chart-diverging-neutral': tokenRef('primitives.gray.750'),
    'chart-diverging-positive-3': tokenRef('primitives.chart.diverging-blue-3.dark'),
    'chart-diverging-positive-2': tokenRef('primitives.chart.diverging-blue-2.dark'),
    'chart-diverging-positive': tokenRef('primitives.blue.400')
  }
}

export default { chart }
