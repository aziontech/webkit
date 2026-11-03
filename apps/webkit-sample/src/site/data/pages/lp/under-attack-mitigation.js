import gdprBadge from '@aziontech/webkit/assets/gdpr-symbol-color.svg'
import lgpdBadge from '@aziontech/webkit/assets/lgpd-symbol-color.svg'
import pciDssBadge from '@aziontech/webkit/assets/pci-dss-symbol-color.svg'
import socBadge from '@aziontech/webkit/assets/soc-symbol-color.svg'

import { successCaseLink } from '../../success-case-articles.js'
import { SUCCESS_CASES } from '../../success-cases.js'
import { MARKET_RECOGNITIONS } from '../home.js'

const caseCard = (key, title, description, meta) => {
  const story = SUCCESS_CASES.find((entry) => entry.key === key)
  return { key, ...successCaseLink(story), title, description, meta, mark: story.client }
}

export default {
  lang: 'en',
  source: 'https://www.azion.com/en/lp/under-attack-mitigation/',
  sections: [
    {
      section: 'HeroForm',
      title: 'Mitigating Cyberattacks',
      kind: 'incident',
      description: 'Our digital security team is available to provide immediate assistance.',
      carouselMarks: [],
      labels: {
        firstName: 'Name',
        lastName: 'Last name',
        email: 'Business email',
        company: 'Company',
        website: 'Website',
        phone: 'Phone',
        submit: 'Request immediate contact'
      },
      messages: {
        required: 'This field is required.',
        invalidEmail: 'Enter a valid email address.'
      }
    },
    {
      section: 'ArticleCards',
      title: 'Trusted by market leaders in banking, e-commerce, technology, and other industries.',
      items: [
        caseCard(
          'case-fourbank',
          'FourBank Protects Apps & APIs from DDoS with Azion',
          'FourBank protects its applications and APIs against DDoS attacks by adding a programmable security layer at the web platform',
          'Tech'
        ),
        caseCard(
          'case-netshoes',
          'Netshoes Blocks 4M+ Threats in 6 Months with Azion WAF',
          'Netshoes automatically blocked more than 4 million threats in six months using Azion WAF',
          'Retail'
        ),
        caseCard(
          'case-digimais',
          'Digimais Safeguards Its Digital Bank with Azion Firewall',
          'Digimais uses Azion’s Firewall to safeguard online access to its digital bank and ensure the highest level of service availability',
          'Financial'
        )
      ]
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
            'Our support team is always available to guide, monitor, and adjust defense strategies as needed, keeping you a step ahead of attackers.'
        }
      ]
    },
    { section: 'RecognitionMarquee', items: MARKET_RECOGNITIONS },
    {
      section: 'ComplianceBadges',
      eyebrow: '',
      title: 'Trust built on the strictest certifications in the market',
      description:
        'Azion follows strict security, availability, and privacy standards, so customers can adopt our services with confidence.',
      certifications: [
        { label: 'SOC 2 Type 2', badge: socBadge, alt: 'AICPA SOC 2 Type 2 badge' },
        { label: 'SOC 3', badge: socBadge, alt: 'AICPA SOC 3 badge' },
        { label: 'PCI DSS', badge: pciDssBadge, alt: 'PCI DSS badge' },
        { label: 'GDPR', badge: gdprBadge, alt: 'GDPR' },
        { label: 'LGPD', badge: lgpdBadge, alt: 'LGPD badge' }
      ],
      more: null
    }
  ]
}
