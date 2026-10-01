import herosparkColor from '@aziontech/webkit/assets/clients/light/herospark-logo.svg'
import magaluColor from '@aziontech/webkit/assets/clients/light/magalu-logo.svg'
import zoopColor from '@aziontech/webkit/assets/clients/zoop-logo.svg'

const CLIENT_QUOTES = {
  axur: {
    mark: 'axur',
    text: 'With Azion, we scale proprietary AI models without managing infrastructure—inspecting millions of websites daily and automating the market’s fastest threat takedown.',
    name: 'Fabio Ramos',
    jobTitle: 'CEO at Axur'
  },
  magalu: {
    logo: magaluColor,
    clientName: 'Magalu',
    text: 'Azion shielded us from sophisticated cyberattacks and empowered us to modernize our infrastructure, reduce costs, and deliver the best shopping experiences to millions of customers across Latin America.',
    name: 'Allan Monteiro',
    jobTitle: 'CISO & Head of Technology at Magalu'
  },
  herospark: {
    logo: herosparkColor,
    clientName: 'HeroSpark',
    text: 'Azion transformed our operations, reducing costs and improving performance while freeing 200+ monthly hours for strategic development.',
    name: 'Mateus Leonardi',
    jobTitle: 'CTO at HeroSpark'
  },
  zoop: {
    logo: zoopColor,
    clientName: 'Zoop',
    text: 'Azion delivered the advanced protection and superior performance we needed, with fast implementation and immediate results.',
    name: 'Ismael Aguilar',
    jobTitle: 'Information Security Manager at Zoop'
  },
  contabilizei: {
    mark: 'contabilizei',
    text: 'With Azion, Contabilizei improved request delivery at the Edge, reduced infrastructure costs, and gained fast access to support whenever needed.',
    name: 'Fabrício Santos',
    jobTitle: 'DevSecOps Manager at Contabilizei'
  },
  dafiti: {
    mark: 'dafiti',
    clientName: 'Dafiti',
    text: 'One of the best CDN and WAF solutions I have ever used. Easy to implement and integrate, with the speed and low latency that make a real difference for our customers.',
    name: 'Julian H',
    jobTitle: 'IT OPS, SRE & SEC Manager at Dafiti Group'
  }
}

export function quotesLedBy(lead, text = '') {
  const first = text ? { ...CLIENT_QUOTES[lead], text } : CLIENT_QUOTES[lead]
  const rest = Object.entries(CLIENT_QUOTES)
    .filter(([key]) => key !== lead)
    .map(([, quote]) => quote)
  return [first, ...rest]
}

export const NETWORK_TOPICS = [
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
      'Compute, AI, databases, and security run across all data centers, close to your users, keeping median global latency under 30 ms, with a built-in CDN and tiered caching for every app.'
  },
  {
    icon: 'pi pi-arrows-v',
    title: 'Zero-ops autoscaling and failover',
    description:
      'Absorbs any traffic spike with no cold starts, instantly scaling from zero to millions. No capacity planning, no provisioning. Scale-to-zero with no idle costs: you pay only for what you run.'
  }
]

export const NETWORK_TAGS = [
  '100+ data centers',
  '100+ Tbps throughput',
  'Instant scale, automatic routing & failover',
  '30 ms median latency',
  'Always-on DDoS protection',
  'PCI DSS and SOC 2/3 compliant'
]

export const LEARNING_CENTER = {
  title: 'Learning Center',
  description: 'Practical knowledge to speed up, secure, and scale applications.',
  href: '/site/learning'
}

export const BUILD_CTA = {
  eyebrow: 'Build',
  title: 'Build once.',
  titleMuted: 'Run everywhere.',
  description: 'Get a faster path to launch, lower latency, and less infrastructure overhead.'
}
