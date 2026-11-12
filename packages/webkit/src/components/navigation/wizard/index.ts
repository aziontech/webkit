import Wizard from './wizard.vue'
import WizardStep from './wizard-step/wizard-step.vue'

type CompoundWizard = typeof Wizard & {
  Step: typeof WizardStep
}

const WizardRoot = Object.assign(Wizard, {
  Step: WizardStep
}) as CompoundWizard

export default WizardRoot
export { WizardStep }
