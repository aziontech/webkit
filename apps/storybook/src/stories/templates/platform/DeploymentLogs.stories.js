import { toSfc } from '../../_shared/story-source'
import { deploymentLogs } from './_deployment-logs-markup'

const logsStory = (options, story) => {
  const logs = deploymentLogs(options)
  const imports = [...new Set(logs.imports)].sort()
  return {
    render: () => ({
      components: logs.components,
      setup: logs.setup,
      template: logs.template
    }),
    parameters: {
      docs: {
        description: { story },
        source: {
          code: toSfc(
            [...imports, `import { ${logs.vue.join(', ')} } from 'vue'`, '', ...logs.scriptLines],
            logs.template
          )
        }
      }
    }
  }
}

const meta = {
  title: 'Templates/Platform/Detail/DeploymentLogs',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The deploy logs block on its own: a Logs row that reports the step count and the step in flight while the run goes, or the outcome Tag, the time and the Phased or Complete switch once it has settled; then the pipeline as an Accordion of steps, each with its status glyph, its title and sentence, its time and its own LogView, or every line as one continuous LogView in the Complete view; and a flush ProgressBar on the bottom edge while it runs. DeploymentFlow renders it inside its card with the controls moved up to the card header, and the Deployment page at /deployments/:id renders it inside the Deployment Logs card without its Logs row and progress bar. Built from Accordion, LogView, Spinner, Tag, SegmentedButton and ProgressBar.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Running = logsStory(
  { state: 'running', at: 'build' },
  'A run in flight: three steps checked with their times, Build spinning and open on its lines, the queued steps behind it waiting, 3/8 steps and the step name in the Logs row, and the progress bar on the bottom edge.'
)

export const Succeeded = logsStory(
  { state: 'finished' },
  'A run that went live: every step checked, the last one open, a Completed Tag with Deployed in 42s and the view switch in the Logs row, and copy on every step log.'
)

export const Failed = logsStory(
  { state: 'failed', at: 'rules' },
  'A run the Rules Engine rejected: that step is open on its error output with a Failed Tag and the reason in full, the steps behind it read Skipped, and the Logs row names the failed step beside the view switch.'
)

export const CompleteView = logsStory(
  { state: 'finished', view: 'complete' },
  'The Complete view of a finished run: every line the pipeline printed as one continuous LogView with its copy button.'
)

export const FailedCompleteView = logsStory(
  { state: 'failed', at: 'rules', view: 'complete' },
  'The Complete view of the failed run: the lines up to the error, as one LogView, nothing from the steps that never ran.'
)
