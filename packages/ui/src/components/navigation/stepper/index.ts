import Stepper from './stepper.vue'
import StepperStep from './stepper-step/stepper-step.vue'

type CompoundStepper = typeof Stepper & {
  Step: typeof StepperStep
}

const StepperRoot = Object.assign(Stepper, {
  Step: StepperStep
}) as CompoundStepper

export default StepperRoot
export { StepperStep }
export type { StepperProps } from './stepper.vue'
export type { StepperStepStatus } from './stepper-step/stepper-step.vue'
export type { StepperStepProps } from './stepper-step/stepper-step.vue'
