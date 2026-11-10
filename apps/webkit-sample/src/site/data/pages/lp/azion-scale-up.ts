import { ANALYST_FIRMS as FIRMS } from './_shared/analyst-firms.js'
import { campaignPage } from './_shared/campaign-page'

export default campaignPage({
  lang: 'en',
  source: 'https://www.azion.com/en/lp/azion-scale-up/',
  hero: {
    title: 'Azion Scale Up Credit Program',
    paragraphs: [
      'Up to $120,000 in service credits for your company',
      'Azion platform is the easiest way to build, secure, deliver and observe modern applications anywhere: on the edge, multi-cloud, on-premise or mobile devices.',
      "That's why we created Azion Scale Up: a free credits program that will unlock the full potential of your company. Unlock the infinite potential of the edge!",
      'With 100+ edge locations around the world, we improve the performance and availability of websites and applications in a wide range of industries.',
      "We enable new technologies and use cases for applications, security, networking, video and game streaming, AI, IoT, 5G - you name it. Azion's powerful full-stack platform allows you to focus on what you do best: build."
    ],
    highlights: [
      {
        icon: 'pi pi-box',
        title: 'Access to Azion Resources',
        description: 'Full access to all products, features, offers and personalized guidance.'
      },
      {
        icon: 'pi pi-graduation-cap',
        title: 'Training',
        description:
          'Free onboarding session with Azion experts, so you get all the necessary assistance for your integration on the platform'
      },
      {
        icon: 'pi pi-headphones',
        title: "Support From Azion's Customer Success Team",
        description: '24/07 technical support included for up to 12 months'
      }
    ],
    fields: ['phone'],
    country: 'BR',
    labels: { email: 'Work email', submit: 'Request immediate contact' }
  },
  capabilities: {
    title: "Why scale up your company with Azion's credits",
    columns: 4,
    items: [
      {
        title: 'Proximity and Coverage',
        description:
          'Leverage an enterprise-grade, open, extensible and developer-friendly global edge computing platform that is close to your users.'
      },
      {
        title: 'Security at the Edge',
        description:
          'Build a security perimeter around your content, web applications and the origin infrastructure.'
      },
      {
        title: 'Infrastructure Cost Savings',
        description:
          'Our support team is always available to guide, monitor, and adjust defense strategies as needed, keeping you a step ahead of attackers.'
      },
      {
        title: 'Scalable and Secure',
        description:
          'Build even more powerful web applications that are capable of handling large access peaks with high performance and security for your users.'
      }
    ]
  },
  analysts: {
    items: [
      {
        text: 'Azion is a Leader in CDN & High Performer in 6 security categories in the G2 Winter 2026 Reports.',
        name: '',
        jobTitle: '',
        firm: FIRMS.g2
      },
      {
        text: 'Azion was named a Leader and identified as the only purpose-built edge platform whose capabilities meet all of the key criteria outlined in the report.',
        name: '',
        jobTitle: '',
        firm: FIRMS.gigaom
      },
      {
        text: 'Gartner clients note that Azion excels at providing a consultative approach to orchestration and serverless edge application environments.',
        name: '',
        jobTitle: '',
        firm: FIRMS.gartner
      },
      {
        text: "Frost & Sullivan pointed that Azion's serverless edge platform increases business agility by empowering developers to build and scale their applications.",
        name: '',
        jobTitle: '',
        firm: FIRMS.frost
      }
    ]
  }
})
