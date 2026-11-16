<script setup>
  import ClosingCallToActionSection from '@aziontech/webkit/closing-call-to-action-section'

  const typedWords = ['Console', 'CLI', 'MCP server']

  const audiences = [
    {
      value: 'humans',
      label: 'For humans',
      actions: [
        {
          label: 'Start for free',
          href: '/signup',
          variant: 'secondary',
          trailing: true
        },
        {
          label: 'Talk to a specialist',
          href: '/site/contact',
          variant: 'outline',
          trailing: true
        }
      ]
    },
    {
      value: 'agents',
      label: 'For agents',
      copy: {
        label: 'Copy prompt',
        text: 'Connect Azion MCP: https://mcp.azion.com'
      },
      actions: [
        {
          label: 'Read the agent docs',
          href: '/site/docs/agent-setup',
          variant: 'outline',
          trailing: true
        }
      ]
    }
  ]
</script>

<template>
  <ClosingCallToActionSection
    variant="primary"
    anchor="contact"
    title="Built by you, or your agents."
    typed-lead="Drive one platform from the"
    :typed-words="typedWords"
    description="A person and an agent ship the same way."
    audiences-aria-label="Audience"
    line-aria-label="Prompt"
    :audiences="audiences"
  />
</template>
