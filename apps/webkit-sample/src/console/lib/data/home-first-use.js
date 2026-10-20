export const firstUseDoors = [
  {
    id: 'applications',
    illustration: 'modern-frontends',
    title: 'Ship something new',
    description:
      'Deploy a static site or a full-stack app, with compute, AI, storage and media on the same build.',
    action: { kind: 'create', label: 'Create Application' }
  },
  {
    id: 'domains',
    illustration: 'dns-protection',
    title: 'Add a domain',
    description:
      'Register a new one or bring your own. DNS, automatic HTTPS and DDoS protection come with it.',
    action: { kind: 'domain' }
  },
  {
    id: 'agent',
    illustration: 'ai-applications',
    title: 'Onboard your agent',
    description:
      'Give Claude, Cursor, Windsurf, Codex or OpenCode a prompt that sets your project up to deploy on Azion.',
    action: { kind: 'copy-prompt', label: 'Copy prompt' }
  }
]
