export const OUTCOMES_SECTION = {
  _id: 'network-section',
  props: {
    kind: 'outcomes',
    eyebrow: 'Region: Earth.',
    title:
      'One distributed infrastructure without the complexity of managing, securing and scaling it',
    lead: 'Built around your users. Distributed around your data.',
    claims: [
      '100+ data centers',
      '100+ Tbps network capacity',
      '30 ms median latency',
      '100% availability'
    ],
    outcomes: [
      {
        logo: '/marketing-components/logos/dafiti-extended-mono.svg',
        logoAlt: 'Dafiti',
        logoTreatment: 'monochrome',
        text: '86% faster load times, with a 45% cost reduction in data transfer.',
        highlights: ['86% faster load times', '45% cost reduction']
      },
      {
        logo: '/marketing-components/clients/madeiramadeira.svg',
        logoAlt: 'MadeiraMadeira',
        logoTreatment: 'as-is',
        text: '90% lower cloud costs and faster applications at scale.',
        highlights: ['90% lower cloud costs']
      },
      {
        logo: '/marketing-components/clients/renner-color.svg',
        logoAlt: 'Renner',
        logoTreatment: 'as-is',
        text: '67% saved on data transfer, even during massive traffic spikes.',
        highlights: ['67% saved']
      },
      {
        logo: '/marketing-components/clients/fourbank.svg',
        logoAlt: 'Fourbank',
        logoTreatment: 'monochrome',
        text: 'DDoS mitigated on applications and APIs, with a programmable security layer.',
        highlights: ['DDoS mitigated']
      }
    ]
  }
}

export const BENEFITS_SECTION = {
  _id: 'network-section',
  props: {
    kind: 'benefits',
    eyebrow: OUTCOMES_SECTION.props.eyebrow,
    title: OUTCOMES_SECTION.props.title,
    lead: OUTCOMES_SECTION.props.lead,
    claims: OUTCOMES_SECTION.props.claims,
    benefits: [
      {
        icon: 'pi pi-globe',
        title: 'Global resilience beyond anycast',
        description:
          "Azion's software-defined global router steers traffic around failures and network degradation faster than BGP can reconverge. Always-on DDoS protection across 100+ data centers worldwide."
      },
      {
        icon: 'pi pi-stopwatch',
        title: 'Low latency everywhere',
        description:
          'Compute, AI, databases, and security run in every data center, close to your users. Median global latency stays under 30 ms, with a built-in CDN and tiered caching for every app.'
      },
      {
        icon: 'pi pi-arrows-v',
        title: 'Zero-ops autoscaling and failover',
        description:
          'Absorbs any traffic spike with no cold starts, instantly scaling from zero to millions. No capacity planning, no provisioning. Scale-to-zero with no idle costs: you pay only for what you run.'
      }
    ]
  }
}
