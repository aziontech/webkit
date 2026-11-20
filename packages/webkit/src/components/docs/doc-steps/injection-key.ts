import type { InjectionKey } from 'vue'

import type { UseStepRegistryReturn } from '../../../composables/use-step-registry'

export type DocStepsContext = UseStepRegistryReturn

export const DocStepsInjectionKey: InjectionKey<DocStepsContext> = Symbol('DocSteps')
