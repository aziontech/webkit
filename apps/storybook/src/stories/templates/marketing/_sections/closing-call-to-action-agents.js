export const SITE_SECTION = {
  _id: 'closing-call-to-action-agents',
  props: {
    anchor: 'contact',
    title: 'Built by you, or your agents.',
    typedLead: 'Drive one platform from the',
    typedWords: ['Console', 'CLI', 'MCP server'],
    description: 'A person and an agent ship the same way.',
    audiencesAriaLabel: 'Audience',
    lineAriaLabel: 'Prompt',
    audiences: [
      {
        value: 'humans',
        label: 'For humans',
        actions: [
          { label: 'Start for free', href: '/signup', kind: 'secondary', trailing: true },
          {
            label: 'Talk to a specialist',
            href: '/site/contact',
            kind: 'outlined',
            trailing: true
          }
        ]
      },
      {
        value: 'agents',
        label: 'For agents',
        copy: { label: 'Copy prompt', text: 'Connect Azion MCP: https://mcp.azion.com' },
        actions: [
          {
            label: 'Read the agent docs',
            href: '/site/docs/agent-setup',
            kind: 'outlined',
            trailing: true
          }
        ]
      }
    ]
  }
}
