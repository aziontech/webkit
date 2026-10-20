import ChartRoot from './chart.vue'
import ChartArea from './chart-area/chart-area.vue'
import ChartAxis from './chart-axis/chart-axis.vue'
import ChartBar from './chart-bar/chart-bar.vue'
import ChartCrosshair from './chart-crosshair/chart-crosshair.vue'
import ChartGrid from './chart-grid/chart-grid.vue'
import ChartLegend from './chart-legend/chart-legend.vue'
import ChartLine from './chart-line/chart-line.vue'
import ChartTooltip from './chart-tooltip/chart-tooltip.vue'

interface ChartStatic {
  Grid: typeof ChartGrid
  Axis: typeof ChartAxis
  Line: typeof ChartLine
  Area: typeof ChartArea
  Bar: typeof ChartBar
  Crosshair: typeof ChartCrosshair
  Tooltip: typeof ChartTooltip
  Legend: typeof ChartLegend
}

const Chart = ChartRoot as typeof ChartRoot & ChartStatic
Chart.Grid = ChartGrid
Chart.Axis = ChartAxis
Chart.Line = ChartLine
Chart.Area = ChartArea
Chart.Bar = ChartBar
Chart.Crosshair = ChartCrosshair
Chart.Tooltip = ChartTooltip
Chart.Legend = ChartLegend

export default Chart
export {
  ChartArea,
  ChartAxis,
  ChartBar,
  ChartCrosshair,
  ChartGrid,
  ChartLegend,
  ChartLine,
  ChartTooltip
}
export type {
  ChartColor,
  ChartCurve,
  ChartLabel,
  ChartPoint,
  ChartSeries,
  ChartStatus
} from '../_lib'
export type { ChartAxisKind, ChartOrientation } from './injection-key'
