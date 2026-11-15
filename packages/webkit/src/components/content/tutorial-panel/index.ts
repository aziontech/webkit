import TutorialPanel from './tutorial-panel.vue'
import TutorialPanelProvider from './tutorial-panel-provider/tutorial-panel-provider.vue'

type CompoundTutorialPanel = typeof TutorialPanel & {
  Provider: typeof TutorialPanelProvider
}

const TutorialPanelRoot = Object.assign(TutorialPanel, {
  Provider: TutorialPanelProvider
}) as CompoundTutorialPanel

export default TutorialPanelRoot
export { TutorialPanelProvider }
export type {
  TutorialPanelStep,
  TutorialPanelTaskData,
  TutorialPanelTaskStatus,
  TutorialPanelTutorial
} from './injection-key'
export type { TutorialPanelProps } from './tutorial-panel.vue'
export type { TutorialPanelProviderProps } from './tutorial-panel-provider/tutorial-panel-provider.vue'
