import CardBox from '@aziontech/webkit/card-box'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import StatusIndicator from '@aziontech/webkit/status-indicator'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import { deploymentLogs } from './_deployment-logs-markup'

const RUN = { owner: 'gab-az', path: 'checkout-web', scope: 'gab-az' }

const AZION_MARK =
  'M18.2868 0L0.490892 14.9821L0 17.561H2.5639L16.349 5.96141L14.1271 17.561H17.4898L20.8537 0H18.2868Z'

const STATUS = `<StatusIndicator
  loading
  severity="info"
  label="Building"
/>`

const VIEW_SWITCH = `<SegmentedButton
  v-model="logView"
  :options="logViews"
  class="shrink-0"
  aria-label="Log view"
/>`

const repoChip = (text) => `<span
  class="inline-flex items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-xs) py-(--spacing-xxs)"
>
  <i
    class="pi pi-github text-[length:inherit] leading-none"
    aria-hidden="true"
  />
  ${text}
</span>`

const SPLASH = `<div
  class="flex min-h-(--size-96) flex-col items-center justify-center gap-(--spacing-xl) p-(--spacing-lg)"
>
  <div
    class="w-(--size-64) overflow-hidden rounded-(--shape-card) border border-(--primary) bg-(--bg-surface)"
  >
    <div class="flex items-center gap-(--spacing-xxs) border-b border-(--border-default)">
      <span class="size-2 rounded-full bg-(--danger)" />
      <span class="size-2 rounded-full bg-(--warning)" />
      <span class="size-2 rounded-full bg-(--success)" />
    </div>
    <div class="flex flex-col gap-(--spacing-sm) p-(--spacing-md)">
      <div class="h-3 w-3/4 rounded-(--shape-flat) bg-(--bg-surface-raised)" />
      <div class="flex items-center justify-center gap-(--spacing-lg) py-(--spacing-sm)">
        <span
          class="flex size-12 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-canvas) text-(--text-default)"
        >
          <i
            class="pi pi-github text-body-lg"
            aria-hidden="true"
          />
        </span>
        <span
          class="flex size-12 items-center justify-center rounded-(--shape-elements) border border-(--border-selected) bg-(--bg-canvas) text-(--primary)"
        >
          <svg
            viewBox="0 0 21 18"
            fill="currentColor"
            class="size-6"
          >
            <path d="${AZION_MARK}" />
          </svg>
        </span>
      </div>
      <div class="h-3 w-3/4 rounded-(--shape-flat) bg-(--bg-surface-raised)" />
    </div>
  </div>

  <div
    class="flex max-w-(--container-lg) flex-wrap items-center justify-center gap-(--spacing-xs) text-label-sm text-(--text-default)"
  >
    <span>Cloning</span>
${indent(repoChip(`${RUN.owner}/${RUN.path}`), 2)}
    <span class="text-(--text-muted)">to</span>
${indent(repoChip(RUN.scope), 2)}
  </div>
</div>`

const flowCard = (control, content) => `<CardBox
  :padded="false"
  class="w-full"
>
  <template #header>
    <p class="truncate text-heading-xs text-(--text-default)">Deployment</p>
${indent(control, 2)}
  </template>

  <template #content>
${indent(content, 2)}
  </template>
</CardBox>`

const HOST_IMPORTS = {
  CardBox: "import CardBox from '@aziontech/webkit/card-box'",
  SegmentedButton: "import SegmentedButton from '@aziontech/webkit/segmented-button'",
  StatusIndicator: "import StatusIndicator from '@aziontech/webkit/status-indicator'"
}

const HOST_COMPONENTS = { CardBox, SegmentedButton, StatusIndicator }

const flowStory = (logState, story) => {
  const logs = deploymentLogs({
    ...logState,
    live: true,
    label: 'Logs',
    controls: false
  })
  const showsSwitch = logState.state === 'failed'
  const template = flowCard(showsSwitch ? VIEW_SWITCH : STATUS, logs.template)
  const hostImports = [
    HOST_IMPORTS.CardBox,
    showsSwitch ? HOST_IMPORTS.SegmentedButton : HOST_IMPORTS.StatusIndicator
  ]
  const imports = [...new Set([...hostImports, ...logs.imports])].sort()
  return {
    render: () => ({
      components: { ...HOST_COMPONENTS, ...logs.components },
      setup: logs.setup,
      template
    }),
    parameters: {
      controls: { disable: true },
      docs: {
        description: { story },
        source: {
          code: toSfc(
            [...imports, `import { ${logs.vue.join(', ')} } from 'vue'`, '', ...logs.scriptLines],
            template
          )
        }
      }
    }
  }
}

const meta = {
  title: 'Templates/Platform/Creation/CreationProgress',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The build logs a create flow streams while it deploys: a CardBox titled Deployment whose header carries the run status, a StatusIndicator while it runs and the Phased or Complete SegmentedButton once it has failed, opening on a cloning splash and then streaming the pipeline as an Accordion of steps, each with its status glyph, its time and its own LogView, over a flush ProgressBar. The console renders it on Create Application, Create Workload, Deploy Template in the Marketplace and the Async Deployment form, and the Deployment detail page shows the same step accordion inside its Deployment Logs disclosure. The live stream is shown here as one story per state, with the steps and log lines of the template deploy pipeline. Built from CardBox, StatusIndicator, SegmentedButton, Accordion, LogView, Spinner, Tag and ProgressBar.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const INITIAL_TEMPLATE = flowCard(STATUS, SPLASH)

export const Initial = {
  render: () => ({
    components: HOST_COMPONENTS,
    template: INITIAL_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The splash the card holds before the first log line: the repository being cloned into the GitHub scope, with the Building status in the header.'
      },
      source: {
        code: toSfc([HOST_IMPORTS.CardBox, HOST_IMPORTS.StatusIndicator], INITIAL_TEMPLATE)
      }
    }
  }
}

export const Running = flowStory(
  { state: 'running', at: 'install', revealed: 2 },
  'Mid-stream: two steps checked with their times, Install dependencies spinning and open on the lines printed so far, the step count in the Logs row and the progress bar on the bottom edge.'
)

export const Finished = flowStory(
  { state: 'finished' },
  'The last line has printed: every step checked and collapsed, a Completed Tag in the Logs row and the progress bar retired, a beat before the flow hands over to its success screen.'
)

export const Failed = flowStory(
  { state: 'failed', at: 'rules' },
  'The Rules Engine rejected the configuration: that step is open on its error output with a Failed Tag, the steps behind it read Skipped, and the header swaps the status for the Phased or Complete switch.'
)

export const CompleteView = flowStory(
  { state: 'failed', at: 'rules', view: 'complete' },
  'The same failed run in the Complete view: every line the pipeline printed as one continuous LogView with its copy button.'
)
