export const APPLICATION_FLOWS = {
  git: {
    id: 'git',
    icon: 'pi pi-github',
    title: 'Import from Git',
    description:
      'Deploy from a repository you already have. Connect the Git account that owns it and select the repository to import.',
    steps: [
      { id: 'method', label: 'Select a method' },
      { id: 'source', label: 'Select a repository' },
      { id: 'configure', label: 'Create and deploy' }
    ]
  },

  cli: {
    id: 'cli',
    icon: 'pi pi-desktop',
    title: 'Sync with Azion CLI',
    description:
      'Create the application now and push to it from your own terminal. Azion links the local project, builds it with your framework preset, and keeps azion.json in sync. No repository required.',
    steps: [
      { id: 'method', label: 'Select a method' },
      { id: 'configure', label: 'Configure and create' }
    ]
  },

  template: {
    id: 'template',
    icon: 'pi pi-objects-column',
    title: 'Start from a template',
    description:
      'Clone a framework starter already wired to build and deploy on Azion. Next, Astro, Vue, Nuxt, and more.',
    steps: [
      { id: 'method', label: 'Select a method' },
      { id: 'source', label: 'Select a template' },
      { id: 'repository', label: 'Connect a repository' },
      { id: 'target', label: 'Select an application' },
      { id: 'configure', label: 'Create and deploy' }
    ]
  }
}

export const TEMPLATE_TARGETS = {
  existing: {
    id: 'existing',
    icon: 'ai ai-edge-application',
    title: 'Add to an existing application',
    description:
      'Install the rule on an application you already run. It opens on its Rules Engine for you to save.'
  },
  new: {
    id: 'new',
    icon: 'pi pi-plus',
    title: 'Create a new application',
    description: 'Create an application with the rule already in place. Nothing left to save.'
  }
}

export const PROVISIONAL_STEPS = [
  { id: 'method', label: 'Select a method' },
  { id: 'source', label: 'Select a source' },
  { id: 'configure', label: 'Create and deploy' }
]

export const APPLICATION_METHODS = [
  APPLICATION_FLOWS.git,
  APPLICATION_FLOWS.cli,
  APPLICATION_FLOWS.template
]

export const getApplicationFlow = (id) => APPLICATION_FLOWS[id] ?? null

export const SCRATCH_SOURCE = {
  kind: 'cli',
  title: 'Local project',
  description: 'The Azion application layer, ready for your first `azion deploy`.',
  framework: 'javascript',
  icon: 'pi pi-desktop',
  repoOwner: 'aziontech',
  repoPath: 'templates/hello-world',
  defaultName: 'my-application',
  requiresBuild: false,
  settings: []
}
