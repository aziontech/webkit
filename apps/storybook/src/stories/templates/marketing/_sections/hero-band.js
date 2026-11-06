const CLIENT_STRIP = [
  'global-fashion-group',
  'herospark',
  'itau',
  'nzn',
  'netshoes',
  'caixa',
  'agibank',
  'prime-video',
  'america-movil',
  'gpa',
  'fourbank'
]

export const CENTERED_SECTION = {
  _id: 'hero-band',
  props: {
    kind: 'centered',
    highlight: 'Build and run applications',
    title: 'globally, with no ops',
    description:
      'Run code, AI, data, and security on 100+ data centers worldwide, with no cold starts and instant scale. One platform, from first commit to production traffic.',
    primaryAction: {
      label: 'Start for free',
      href: 'https://console.azion.com/signup/'
    },
    secondaryAction: {
      label: 'Talk to a specialist',
      href: 'https://www.azion.com/en/contact/',
      trailing: true
    },
    carouselLabel: 'Trusted by teams running critical workloads',
    carouselMarks: CLIENT_STRIP
  }
}

export const TITLE_BAND_SECTION = {
  _id: 'hero-band',
  props: {
    kind: 'title-band',
    size: 'large',
    eyebrow: 'Cache',
    title: 'Deliver content fast, worldwide',
    description:
      'Serve cached content close to users. Cut origin load and keep applications fast during traffic spikes.',
    primaryAction: {
      label: 'Start for free',
      href: 'https://console.azion.com/signup/'
    },
    secondaryAction: {
      label: 'Docs',
      href: 'https://www.azion.com/en/documentation/',
      trailing: true
    }
  }
}

export const TITLE_BAND_SMALL_SECTION = {
  _id: 'hero-band',
  props: {
    kind: 'title-band',
    size: 'medium',
    eyebrow: 'Contact',
    title: 'Contact us',
    description: 'Talk to sales about a new project, or reach support about one already running.'
  }
}

export const TITLE_BAND_CAROUSEL_SECTION = {
  _id: 'hero-band',
  props: {
    kind: 'title-band',
    size: 'large',
    eyebrow: 'Resources',
    title: 'Learning Center',
    description: 'Practical knowledge to speed up, secure, and scale applications.',
    primaryAction: {
      label: 'See articles',
      href: '#subjects'
    },
    secondaryAction: {
      label: 'Talk to a specialist',
      href: 'https://www.azion.com/en/contact/',
      trailing: true
    },
    carouselLabel: 'Trusted by teams running critical workloads',
    carouselMarks: CLIENT_STRIP
  }
}

export const PIXEL_FLOOR_SECTION = {
  _id: 'hero-band',
  props: {
    kind: 'pixel-floor',
    eyebrow: 'AI Inference',
    title: 'Build and deploy AI agents and applications in seconds',
    description:
      'Run AI inference close to users on Azion’s distributed infrastructure, with low latency, lower cost, and data kept local.',
    primaryAction: {
      label: 'Start for free',
      href: 'https://console.azion.com/signup'
    },
    secondaryAction: {
      label: 'Talk to a specialist',
      href: 'https://www.azion.com/en/contact/'
    },
    carouselLabel: 'Trusted by teams running critical workloads',
    carouselMarks: CLIENT_STRIP
  }
}

export const COPY_BESIDE_ART_SECTION = {
  _id: 'hero-band',
  props: {
    kind: 'copy-beside-art',
    eyebrow: 'AWS Alternative Comparison',
    title: 'AWS sells services. Your team becomes the integrator.',
    description:
      'Every capability is a separate service with its own setup, limits, and bill. Azion delivers one platform, distributed by default. One configuration, one bill, security included, and support in your language.',
    primaryAction: {
      label: 'Talk to a specialist',
      href: 'https://www.azion.com/en/contact/',
      trailing: true
    },
    illustration: 'global-network',
    illustrationAriaLabel: 'AWS sells services. Your team becomes the integrator.',
    carouselLabel: 'Trusted by teams running critical workloads',
    carouselMarks: [
      'agibank',
      'radware',
      'america-movil',
      'gpa',
      'fourbank',
      'global-fashion-group',
      'herospark',
      'itau',
      'magalu'
    ]
  }
}
