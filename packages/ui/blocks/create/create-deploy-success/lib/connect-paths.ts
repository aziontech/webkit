export const PATHS = [
  { label: 'CLI', value: 'cli' },
  { label: 'GitHub Actions', value: 'actions' }
]

export const cliSteps = (name: string) => [
  {
    title: 'Install the CLI',
    description:
      'Install it globally. It builds with your framework preset and ships the build in one step.',
    tabs: [
      {
        label: 'npm',
        value: 'npm',
        language: 'bash',
        code: 'npm install -g platform-cli'
      },
      {
        label: 'yarn',
        value: 'yarn',
        language: 'bash',
        code: 'yarn global add platform-cli'
      },
      { label: 'pnpm', value: 'pnpm', language: 'bash', code: 'pnpm add -g platform-cli' },
      {
        label: 'brew',
        value: 'brew',
        language: 'bash',
        code: 'brew install platform-cli'
      }
    ]
  },
  {
    title: 'Link your project',
    description:
      'Authenticate, then link the local project to this resource so every deploy lands on it.',
    tabs: [
      {
        label: 'Link',
        value: 'link',
        language: 'bash',
        code: `platform login
platform link \\
  --name ${name}`
      }
    ]
  },
  {
    title: 'Deploy and visit your site',
    description:
      'Build and ship. The CLI prints the domain when it finishes, and sync reconciles platform.json with what the console shows.',
    tabs: [
      {
        label: 'Deploy',
        value: 'deploy',
        language: 'bash',
        code: `platform deploy --auto --local
platform sync`
      }
    ]
  }
]

export const ACTIONS_STEPS = [
  {
    title: 'Store your personal token',
    description:
      'Create a personal token in Account settings and keep it as the repository secret the workflow authenticates with.',
    tabs: [
      {
        label: 'Secret',
        value: 'secret',
        language: 'bash',
        code: `gh secret set \\
  PLATFORM_TOKEN`
      }
    ]
  },
  {
    title: 'Add the deploy workflow',
    description:
      'One job that installs the CLI and deploys the build. Every push to the production branch runs it.',
    tabs: [
      {
        label: 'deploy.yml',
        value: 'workflow',
        fileName: '.github/workflows/deploy.yml',
        language: 'yaml',
        code: `on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g platform-cli
      - run: platform login --token \${{ secrets.PLATFORM_TOKEN }}
      - run: platform deploy --auto --local`
      }
    ]
  },
  {
    title: 'Push to deploy',
    description:
      'Every push to the production branch builds and ships. The deployment lands on the Overview tab as it runs.',
    tabs: [{ label: 'Push', value: 'push', language: 'bash', code: 'git push origin main' }]
  }
]
