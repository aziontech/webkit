import { ANALYST_FIRMS as FIRMS } from './_shared/analyst-firms.js'
import { campaignPage } from './_shared/campaign-page'
import { caseCard } from './_shared/case-card.js'

export default campaignPage({
  lang: 'en',
  source: 'https://www.azion.com/en/lp/under-attack-mitigation/',
  hero: {
    title: 'Mitigating Cyberattacks',
    description: 'Our digital security team is available to provide immediate assistance.',
    fields: ['website', 'phone'],
    optional: ['company'],
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
  cases: {
    title: 'Trusted by market leaders in banking, e-commerce, technology, and other industries.',
    items: [
      caseCard('case-fourbank', {
        title: 'FourBank Protects Apps & APIs from DDoS with Azion',
        description:
          'FourBank protects its applications and APIs against DDoS attacks by adding a programmable security layer at the web platform',
        meta: 'Tech'
      }),
      caseCard('case-netshoes', {
        title: 'Netshoes Blocks 4M+ Threats in 6 Months with Azion WAF',
        description:
          'Netshoes automatically blocked more than 4 million threats in six months using Azion WAF',
        meta: 'Retail'
      }),
      caseCard('case-digimais', {
        title: 'Digimais Safeguards Its Digital Bank with Azion Firewall',
        description:
          'Digimais uses Azion’s Firewall to safeguard online access to its digital bank and ensure the highest level of service availability',
        meta: 'Financial'
      })
    ]
  },
  capabilities: {
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
          'Our support team is always available to guide, monitor, and adjust defense strategies as needed, keeping you a step ahead of attackers.'
      }
    ]
  },
  analysts: {
    items: [
      {
        text: 'Leader in CDN and DDoS Protection: High Performer in Web Application Firewall (WAF), Bot Detection and Mitigation, SSL & TLS Certificate Tools, Web Security, Cloud Security, and API Security Tools',
        name: 'G2 Spring 2026 Reports',
        jobTitle: '',
        firm: FIRMS.g2
      },
      {
        text: 'Leader in CDN: High Performer in Web Security Software, DDoS Protection, Web Application Firewall (WAF), Bot Detection and Mitigation, SSL & TLS Tools and DNS Security',
        name: 'G2 Winter 2026 Reports',
        jobTitle: '',
        firm: FIRMS.g2
      },
      {
        text: 'Azion was named a Leader and identified as the only purpose-built edge platform whose capabilities meet all of the key criteria outlined in the report',
        name: 'GigaOm Radar for Edge Platforms',
        jobTitle: '',
        firm: FIRMS.gigaom
      },
      {
        text: 'Gartner clients note that Azion excels at providing a consultative approach to orchestration and serverless edge application environments',
        name: 'Gartner Competitive Landscape for CDN and Edge Services',
        jobTitle: '',
        firm: FIRMS.gartner
      },
      {
        text: "Frost & Sullivan pointed out that Azion's serverless edge platform increases business agility by empowering developers to build and scale their applications",
        name: 'Frost & Sullivan Best Practices Award, North',
        jobTitle: '',
        firm: FIRMS.frost
      }
    ]
  }
})
