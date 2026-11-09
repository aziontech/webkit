import { successCaseArticle, successCaseCard } from '../success-case-articles.js'
import { MARKET_RECOGNITIONS } from './home.js'

const ATTACK_STORIES = ['fourbank', 'netshoes', 'digimais'].map((slug) =>
  successCaseCard(successCaseArticle(slug))
)

const ATTACK_HIGHLIGHTS = [
  {
    icon: 'ai ai-security-team',
    title: 'Help before you become a customer',
    description: 'Emergency mitigation for an attack in progress.'
  },
  {
    icon: 'ai ai-secure-pillar',
    title: '265B attacks blocked',
    description: 'Stopped on the Azion network since 2022.'
  },
  {
    icon: 'ai ai-build-pillar',
    title: '35B functions a month',
    description: 'Edge functions run every month for security controls.'
  },
  {
    icon: 'ai ai-app-accelerator',
    title: '+90% of requests served instantly',
    description: 'Customer requests answered close to your users.'
  }
]

export const CONTACT_UNDER_ATTACK_PAGE = [
  {
    section: 'HeroForm',
    kind: 'incident',
    eyebrow: 'Under Cyberattack?',
    title: 'Mitigating Cyberattacks',
    description: 'Our digital security team is available to provide immediate assistance.',
    highlights: ATTACK_HIGHLIGHTS,
    formLabel: 'Request immediate contact',
    labels: {
      firstName: 'Name',
      lastName: 'Last name',
      email: 'Business email',
      submit: 'Request immediate contact'
    },
    messages: {
      success: 'Thank you. We will be in touch with you soon.',
      error: 'Could not send your request.'
    }
  },
  {
    section: 'ArticleCards',
    kind: 'centered',
    eyebrow: 'Success cases',
    title: 'When our customers succeed, we succeed',
    ariaLabel: 'Success cases',
    items: ATTACK_STORIES
  },
  {
    section: 'CapabilityGrid',
    eyebrow: 'Attack mitigation',
    title: 'Your Direct Line for Immediate Attack Mitigation',
    items: [
      {
        icon: 'pi pi-server',
        title: 'Resilient Infrastructure',
        description:
          'Our solutions are built to automatically scale in response to the volume and intensity of the attack, maintaining the performance and security of your operations.'
      },
      {
        icon: 'pi pi-shield',
        title: 'Proactive Mitigation',
        description:
          'In addition to responding to the ongoing attack, we implement proactive measures to prevent future breach attempts, ensuring business continuity.'
      },
      {
        icon: 'pi pi-headphones',
        title: '24/7 Support',
        description:
          'Our support team is always available to guide, monitor, and adjust defense strategies as needed.'
      }
    ]
  },
  {
    section: 'RecognitionMarquee',
    items: MARKET_RECOGNITIONS
  },
  {
    section: 'ComplianceBadges',
    title: 'Trust built on the strictest certifications in the market',
    description:
      'Azion follows strict security, availability, and privacy standards, so customers can adopt our services with confidence.'
  },
  { section: 'ClosingCallToAction', kind: 'frame' }
]
