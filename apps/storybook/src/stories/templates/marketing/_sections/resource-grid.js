const START_HERE = {
  title: 'New to Azion? Start here',
  description: 'A guide to your first steps with Azion.',
  href: '/docs'
}

const LEARNING_CENTER = {
  title: 'Learning Center',
  description: 'Practical knowledge to speed up, secure, and scale applications.',
  href: '/learning'
}

const FINTECH = {
  title: 'How Technology Can Help You Comply with Regulations for Fintech',
  description:
    'Distributed infrastructure brings security, compliance, and monitoring together for reliable, scalable operations.',
  href: 'https://www.azion.com/en/blog/how-technology-can-help-comply-with-regulations-for-fintech/'
}

const JUSTA = {
  title: 'How Justa is evolving its technology to meet modern digital demands',
  description:
    'See how Justa uses the Azion Web Platform to improve security and performance in PIX and QR Code transactions.',
  href: 'https://www.azion.com/en/blog/how-justa-has-been-evolving-its-technology-to-meet-modern-digital-demands/'
}

const SEE_ALL = {
  label: 'See all guides',
  href: 'https://www.azion.com/en/documentation/products/guides/',
  trailing: true,
  target: '_blank'
}

export const SITE_SECTION = {
  _id: 'resource-grid',
  props: {
    eyebrow: 'Go Deeper',
    title: 'Guides and Resources',
    description:
      'Documentation, articles, and customer stories on building secure, compliant financial applications on a distributed architecture.',
    items: [START_HERE, LEARNING_CENTER, FINTECH, JUSTA],
    primaryAction: SEE_ALL
  }
}

export const SCROLLABLE_SECTION = {
  _id: 'resource-grid',
  props: {
    eyebrow: 'Go Deeper',
    title: 'Guides and Resources',
    description:
      'Documentation and articles on building, securing, and scaling modern applications on a distributed architecture.',
    items: [
      START_HERE,
      LEARNING_CENTER,
      {
        title: 'Build modern applications with Functions',
        description: 'Create serverless functions that run close to users.',
        href: 'https://www.azion.com/en/documentation/products/build/edge-application/edge-functions/'
      },
      {
        title: 'SQL Database for modern applications',
        description:
          'Build data-driven applications with SQL Database on a distributed architecture.',
        href: 'https://www.azion.com/en/documentation/products/store/edge-sql/'
      },
      FINTECH,
      JUSTA
    ],
    primaryAction: SEE_ALL
  }
}
