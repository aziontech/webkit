// Compound API (see .claude/rules/compound-api.md). The explicit
// CompoundPickList annotation makes declaration emit reference the
// sub-component types instead of expanding the root's private Props.
import PickList from './pick-list.vue'
import PickListControls from './pick-list-controls/pick-list-controls.vue'
import PickListSource from './pick-list-source/pick-list-source.vue'
import PickListTarget from './pick-list-target/pick-list-target.vue'

type CompoundPickList = typeof PickList & {
  Source: typeof PickListSource
  Target: typeof PickListTarget
  Controls: typeof PickListControls
}

const PickListRoot = Object.assign(PickList, {
  Source: PickListSource,
  Target: PickListTarget,
  Controls: PickListControls
}) as CompoundPickList

export default PickListRoot
export { PickListControls, PickListSource, PickListTarget }
