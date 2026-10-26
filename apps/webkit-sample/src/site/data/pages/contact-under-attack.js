import { successCaseArticle, successCaseCard } from '../success-case-articles.js'
import { MARKET_RECOGNITIONS } from './about.js'

const ATTACK_STORIES = ['fourbank', 'netshoes', 'digimais'].map((slug) =>
  successCaseCard(successCaseArticle(slug))
)

export const CONTACT_UNDER_ATTACK_PAGE = [
  {
    section: 'HeroForm',
    kind: 'incident',
    eyebrow: 'Under Cyberattack?',
    title: 'Mitigating Cyberattacks',
    description: 'Our digital security team is available to provide immediate assistance.',
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
    title: 'When our customers succeed, we succeed',
    ariaLabel: 'Success cases',
    items: ATTACK_STORIES
  },
  {
    section: 'CapabilityGrid',
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
    section: 'StatsBand',
    items: [
      { value: '35', suffix: 'B', label: 'Edge functions run monthly for security controls' },
      { value: '265', suffix: 'B', label: 'Attacks blocked since 2022' },
      { prefix: '+', value: '90', suffix: '%', label: 'Customer requests served instantly' }
    ]
  },
  {
    section: 'RecognitionMarquee',
    title: 'What analysts say about Azion',
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
