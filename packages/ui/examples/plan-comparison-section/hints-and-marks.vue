<script setup>
  import PlanComparisonSection from '@aziontech/ui/plan-comparison-section'

  const plans = [
    { id: 'starter', name: 'Starter', action: { label: 'Start for free', href: '/signup' } },
    {
      id: 'team',
      name: 'Team',
      highlighted: true,
      action: { label: 'Start with Team', href: '/signup?plan=team' }
    },
    { id: 'scale', name: 'Scale', action: { label: 'Talk to sales', href: '/contact' } }
  ]

  const sections = [
    {
      eyebrow: 'Security',
      title: 'Protection',
      description: 'Keep applications and APIs safe from attacks and abuse.',
      rows: [
        {
          label: 'Web application firewall',
          hint: 'Inspects every request and blocks common attacks, such as SQL injection and cross-site scripting, before they reach your application.',
          values: [true, true, true]
        },
        {
          label: 'Bot management',
          hint: 'Tells people from automated traffic and blocks the bots you choose.',
          values: ['—', true, true]
        },
        { label: 'Custom rules', values: ['5 rules', '50 rules', 'Unlimited'] },
        { label: 'Dedicated support engineer', values: ['—', '—', true] }
      ]
    }
  ]
</script>

<template>
  <PlanComparisonSection
    caption="What each plan includes for security."
    column-label="Features"
    picker-aria-label="Plan being compared"
    included-label="Included"
    excluded-label="Not included"
    :plans="plans"
    :sections="sections"
  />
</template>
