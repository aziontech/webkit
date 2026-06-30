/**
 * Compound API — each sub-component stays available as its own import
 * (`@aziontech/webkit/pick-list-source`, ...) and is also attached to the root
 * for dot-notation usage: `<PickList.Source>`, `<PickList.Target>`,
 * `<PickList.Controls>`.
 *
 * This is a `.ts` file so vue-tsc generates the adjacent `index.d.ts`, giving
 * `<PickList.Source>` full type-checking. `Object.assign` keeps one source of
 * truth; the explicit `CompoundPickList` annotation lets declaration emit
 * reference the sub-component types instead of expanding the root's private
 * `Props`. See `.claude/rules/compound-api.md`.
 */
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
