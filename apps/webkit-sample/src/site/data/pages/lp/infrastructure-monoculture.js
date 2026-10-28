import frost from '@aziontech/webkit/assets/frost-and-sullivan-extended-color.svg'
import frostReversed from '@aziontech/webkit/assets/frost-and-sullivan-extended-reversed.svg'
import g2 from '@aziontech/webkit/assets/g2-symbol-color.svg'
import gartner from '@aziontech/webkit/assets/gartner-extended-color.svg'
import gartnerReversed from '@aziontech/webkit/assets/gartner-extended-reversed.svg'
import gigaom from '@aziontech/webkit/assets/gigaom-extended-color.svg'
import gigaomReversed from '@aziontech/webkit/assets/gigaom-extended-reversed.svg'

const FIRMS = {
  g2: { name: 'G2', logo: g2, logoLight: g2 },
  gigaom: { name: 'GigaOm', logo: gigaomReversed, logoLight: gigaom },
  gartner: { name: 'Gartner', logo: gartnerReversed, logoLight: gartner },
  frost: { name: 'Frost & Sullivan', logo: frostReversed, logoLight: frost }
}

export default {
  lang: 'en',
  source: 'https://www.azion.com/en/lp/infrastructure-monoculture/',
  sections: [
    {
      section: 'HeroForm',
      title: 'Infrastructure Monoculture',
      paragraphs: [
        "When a single vendor outage takes down your entire stack, the problem isn't the provider, it's your architecture. Infrastructure monoculture creates correlated failure risk: one DNS error, one CDN outage, and thousands of services go dark simultaneously.",
        'The efficiency of consolidation comes with hidden costs. While one bill and one API simplify operations, they also create single points of failure across compute, storage, CDN, DNS, and security.',
        "Azion's Platform helps you build resilient, multi-vendor architectures with 100+ global points of presence and built-in failover capabilities.",
        "Don't wait for an outage to expose your vulnerabilities. Talk to an Azion specialist and discover how to balance efficiency with resilience before your next vendor failure becomes your problem."
      ],
      carouselMarks: [],
      labels: {
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Work email',
        role: 'Role',
        rolePlaceholder: 'Select your role',
        company: 'Company',
        phone: 'Phone',
        message: 'Message',
        submit: 'Request immediate contact'
      },
      messages: {
        required: 'This field is required.',
        invalidEmail: 'Enter a valid email address.'
      }
    },
    {
      section: 'CapabilityGrid',
      items: [
        {
          icon: 'pi pi-check',
          title: 'Distributed Architecture',
          description:
            'Deploy across 100+ global points of presence with built-in failover. When one provider fails, your services stay operational through redundant paths.'
        },
        {
          icon: 'pi pi-check',
          title: 'Avoid Single Points of Failure',
          description:
            "Distribute critical services—DNS, CDN, security—across multiple vendors. Stop betting your entire stack on one provider's uptime."
        },
        {
          icon: 'pi pi-check',
          title: 'Reduce Vendor Lock-In Risk',
          description:
            'Maintain escape velocity with open data formats and standardized APIs. Negotiate from strength, not dependency.'
        },
        {
          icon: 'pi pi-check',
          title: 'Resilience by Design',
          description:
            'Balance operational efficiency with architectural diversity. Keep the edge distributed while consolidating what makes sense at the origin.'
        }
      ]
    },
    {
      section: 'RecognitionMarquee',
      title: 'What analysts say about Azion',
      items: [
        {
          text: 'Azion is a Leader in CDN & High Performer in 6 security categories in the G2 Winter 2026 Reports.',
          name: 'G2 Winter 2026 Reports',
          jobTitle: '',
          firm: FIRMS.g2
        },
        {
          text: 'Azion was named a Leader and identified as the only purpose-built edge platform whose capabilities meet all of the key criteria outlined in the report.',
          name: 'Radar GigaOms para Plataformas de Edge.',
          jobTitle: '',
          firm: FIRMS.gigaom
        },
        {
          text: 'Gartner clients note that Azion excels at providing a consultative approach to orchestration and serverless edge application environments.',
          name: 'Gartner Competitive Landscape for CDN and Edge Services.',
          jobTitle: '',
          firm: FIRMS.gartner
        },
        {
          text: "Frost & Sullivan pointed that Azion's serverless edge platform increases business agility by empowering developers to build and scale their applications.",
          name: 'Frost & Sullivan Best Practices Award, North.',
          jobTitle: '',
          firm: FIRMS.frost
        }
      ]
    }
  ]
}
