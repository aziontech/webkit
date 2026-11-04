import UseCases from '../use-cases/use-cases.vue'
import { registry } from './registry'
import Sections from './sections.vue'

type CompoundSections = typeof Sections & {
  UseCases: typeof UseCases
  registry: typeof registry
}

const SectionsRoot = Object.assign(Sections, {
  UseCases,
  registry
}) as CompoundSections

export default SectionsRoot
export { registry }
