export const SITE_SECTION = {
  _id: 'feature-widgets',
  props: {
    anchor: 'get-started',
    eyebrow: 'Get started',
    title: 'Start where you already work',
    description:
      'The same function, three ways to ship it. Hand it to a coding agent, build it in the Console, or deploy it from the terminal.',
    primaryAction: { label: 'Start for free', href: '/signup' },
    secondaryAction: { label: 'Docs', href: '/site/docs', trailing: true },
    columns: 3,
    items: [
      {
        title: 'Ask your coding agent',
        description:
          'Connect the Azion MCP servers to Claude Code, Cursor or ChatGPT, and the agent creates, instances and routes the function, with a dry run before every write.',
        illustration: 'deploy-secure-mcp-server',
        copy: {
          label: 'Copy prompt',
          text: 'Create a function that answers 401 when a request has no Authorization header.'
        }
      },
      {
        title: 'Build it in the Console',
        description:
          'Choose the application it runs on, write the handler in the editor, name it, and create it. The rule that runs it is drafted for you.',
        illustration: 'build-applications',
        action: { label: 'Docs', href: '/site/docs' }
      },
      {
        title: 'Ship it from the terminal',
        description:
          'azion init scaffolds from 25 presets, azion dev serves it on localhost:3333, and azion deploy puts it on a live domain.',
        illustration: 'quick-start-with-templates',
        action: { label: 'Docs', href: '/site/docs' }
      }
    ]
  }
}
