import DocStepsRoot from './doc-steps.vue'
import DocStepsStep from './doc-steps-step.vue'

type CompoundDocSteps = typeof DocStepsRoot & {
  Step: typeof DocStepsStep
}

const DocSteps = Object.assign(DocStepsRoot, {
  Step: DocStepsStep
}) as CompoundDocSteps

export default DocSteps
export type { DocStepsStepProps } from './doc-steps-step.vue'
