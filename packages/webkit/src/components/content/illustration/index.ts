import IllustrationRoot from './illustration.vue'
import IllustrationBox from './illustration-box/illustration-box.vue'
import IllustrationBranch from './illustration-branch/illustration-branch.vue'
import IllustrationChart from './illustration-chart/illustration-chart.vue'
import IllustrationConnector from './illustration-connector/illustration-connector.vue'
import IllustrationElbow from './illustration-elbow/illustration-elbow.vue'
import IllustrationGauge from './illustration-gauge/illustration-gauge.vue'
import IllustrationList from './illustration-list/illustration-list.vue'
import IllustrationNode from './illustration-node/illustration-node.vue'
import IllustrationPill from './illustration-pill/illustration-pill.vue'
import IllustrationSurface from './illustration-surface/illustration-surface.vue'
import IllustrationWindow from './illustration-window/illustration-window.vue'

interface IllustrationStatic {
  Box: typeof IllustrationBox
  Node: typeof IllustrationNode
  Connector: typeof IllustrationConnector
  Elbow: typeof IllustrationElbow
  Branch: typeof IllustrationBranch
  Pill: typeof IllustrationPill
  Window: typeof IllustrationWindow
  Surface: typeof IllustrationSurface
  Gauge: typeof IllustrationGauge
  Chart: typeof IllustrationChart
  List: typeof IllustrationList
}

const Illustration = IllustrationRoot as typeof IllustrationRoot & IllustrationStatic
Illustration.Box = IllustrationBox
Illustration.Node = IllustrationNode
Illustration.Connector = IllustrationConnector
Illustration.Elbow = IllustrationElbow
Illustration.Branch = IllustrationBranch
Illustration.Pill = IllustrationPill
Illustration.Window = IllustrationWindow
Illustration.Surface = IllustrationSurface
Illustration.Gauge = IllustrationGauge
Illustration.Chart = IllustrationChart
Illustration.List = IllustrationList

export default Illustration
export {
  IllustrationBox,
  IllustrationBranch,
  IllustrationChart,
  IllustrationConnector,
  IllustrationElbow,
  IllustrationGauge,
  IllustrationList,
  IllustrationNode,
  IllustrationPill,
  IllustrationSurface,
  IllustrationWindow
}
