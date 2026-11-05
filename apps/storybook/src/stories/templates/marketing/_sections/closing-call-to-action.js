export const SPLIT_SECTION = {
  _id: 'closing-call-to-action',
  props: {
    kind: 'split',
    anchor: 'contact',
    eyebrow: 'Build',
    title: 'Build once.',
    titleMuted: 'Run everywhere.',
    description: 'Get a faster path to launch, lower latency, and less infrastructure overhead.',
    primaryAction: {
      label: 'Start for free',
      href: 'https://console.azion.com/signup?tck=build_cta'
    },
    secondaryAction: {
      label: 'Talk to a specialist',
      href: 'https://www.azion.com/en/contact/',
      trailing: true
    }
  }
}

export const PANEL_SECTION = {
  _id: 'closing-call-to-action',
  props: {
    kind: 'panel',
    title: 'Ready to join us?',
    description: 'See our open positions and find the right fit.',
    primaryAction: {
      label: 'See open roles',
      href: '/en/careers/jobs/',
      trailing: true
    }
  }
}

export const PRIMARY_SECTION = {
  _id: 'closing-call-to-action',
  props: {
    kind: 'primary',
    anchor: 'contact',
    title: 'Build, run, and protect applications everywhere.',
    description:
      'Get faster launches, lower latency, and less infrastructure overhead from day one.',
    primaryAction: {
      label: 'Start for free',
      href: '/signup'
    },
    secondaryAction: {
      label: 'Docs',
      href: '/docs',
      trailing: true
    }
  }
}
