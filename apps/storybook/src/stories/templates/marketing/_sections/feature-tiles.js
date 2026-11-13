export const ARTWORK_SECTION = {
  _id: 'feature-tiles',
  props: {
    kind: 'artwork',
    eyebrow: 'Why Azion',
    title: 'From commit to live traffic, on one platform',
    description:
      'Build, ship, and run an application on the same platform that serves it — one place to deploy from, one place to watch it from.',
    tiles: [
      {
        image: '/marketing-components/illustrations/branches.svg',
        title: 'Build at AI speed.',
        description:
          'Go from commit to a live URL in minutes. Test on a preview, promote when you are ready, and roll back without a rebuild.'
      },
      {
        image: '/marketing-components/illustrations/personal-tokens.svg',
        title: 'Secure by default.',
        description:
          'Every workload runs in its own isolated environment, with WAF, rate limits, and leading compliance practices. No configuration required.'
      }
    ]
  }
}

export const ILLUSTRATED_SECTION = {
  _id: 'feature-tiles',
  props: {
    kind: 'illustrated',
    anchor: 'why-pricing',
    tiles: [
      {
        illustration: 'no-idle-no-waste',
        scale: 0.7,
        title: 'No idle. No waste',
        description:
          'Azion bills for actual consumption. You pay for what your applications use, not for infrastructure sitting idle waiting for demand.'
      },
      {
        illustration: 'stay-in-control',
        scale: 1,
        title: 'Stay in control',
        description:
          'Scale without losing control of your bill. Track consumption, set spending limits, and keep costs predictable as your applications grow.'
      },
      {
        illustration: 'white-gloves-when-it-matters',
        scale: 0.8,
        title: 'White-glove when it matters',
        description:
          'Self-service when you want it, experts when you need them. Azion specialists and partners help you build, migrate, optimize, and scale.'
      }
    ]
  }
}
