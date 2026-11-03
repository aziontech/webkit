import ShellMockup from './shell-mockup.vue'
import ShellMockupPart from './shell-mockup-part/shell-mockup-part.vue'

type CompoundShellMockup = typeof ShellMockup & {
  Part: typeof ShellMockupPart
}

const ShellMockupRoot = Object.assign(ShellMockup, {
  Part: ShellMockupPart
}) as CompoundShellMockup

export default ShellMockupRoot
export { ShellMockupPart }
