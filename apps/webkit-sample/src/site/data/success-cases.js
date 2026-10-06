// The success-case library — a verbatim transcription of
// https://www.azion.com/en/success-case/, read mechanically on 2026-09-25 with the
// /site-design-translate extractor and from the page's own island payload.
//
// TRANSCRIPTION RULES, the same ones every other page's data module follows:
//
//   • Every `description`, `tag`, `industry`, `solutions` and `products` entry is the
//     source's own string, character for character — including its curly apostrophes and
//     the two product names it spells differently from the rest (`Application Acceleration`,
//     `Data Streaming`). Nothing is normalized, pluralized or sentence-cased.
//   • `href` is the source's own path, absolutized onto azion.com: these stories live on
//     the real site, and a demo that linked them at its own origin would 404.
//   • `client` is the only field this file adds, and it adds no copy: it resolves the mark
//     the source draws on each card to an asset this repo already holds. A client with no
//     asset carries its name alone, which is what ClientMark renders as the typographic
//     fallback — no logo is drawn from a name and no third party's file was fetched.
//   • The order is the source's own, which is neither alphabetical nor chronological.
//
// THE SOURCE RENDERS THE FIRST TWELVE and reveals the rest through its `Load more` control.
// All 35 are here for the same reason: the control is the source's, and a control that does
// nothing would be the invention. The initial render is the source's twelve, in its order.

import axur from '@aziontech/webkit/assets/axur-extended-reversed.svg'
import bancoDeLaNacion from '@aziontech/webkit/assets/banco-de-la-nacion-extended-mono.svg'
import { CLIENTS } from '@aziontech/webkit/assets/client-registry'
import contabilizei from '@aziontech/webkit/assets/contabilizei-extended-reversed.svg'
import crefisa from '@aziontech/webkit/assets/crefisa-extended-reversed.svg'
import marisa from '@aziontech/webkit/assets/marisa-extended-color.svg'
import panvel from '@aziontech/webkit/assets/panvel-extended-color.svg'
import pernambucanas from '@aziontech/webkit/assets/pernambucanas-extended-mono.svg'
import vtex from '@aziontech/webkit/assets/vtex-extended-reversed.svg'

const byName = (name) => CLIENTS.find((client) => client.name === name)

/**
 * The three stories the source features above the library, in its order. `brand` paints the
 * card; glow equal to base is a flat fill, and `ink: 'dark'` sets the mark and text black
 * for a light fill. Axur's is read off Figma 13224:203120.
 */
export const FEATURED_CASES = [
  {
    key: 'case-magalu',
    client: byName('Magalu'),
    brand: { base: '#0e89ff', glow: '#0e89ff' },
    tag: 'Retail',
    description:
      "Explore how Magalu enhances cybersecurity with Azion's Firewall and WAF, improving threat intelligence and bot management in retail.",
    href: 'https://www.azion.com/en/success-case/magalu/'
  },
  {
    key: 'case-dafiti',
    client: byName('Dafiti'),
    brand: { base: '#ffffff', glow: '#ffffff', ink: 'dark' },
    tag: 'Retail',
    description:
      'Dafiti modernized its digital architecture to deliver faster, scalable, and resilient experiences for millions of consumers across Latin America.',
    href: 'https://www.azion.com/en/success-case/dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application/'
  },
  {
    key: 'case-axur',
    client: { name: 'Axur', logo: axur, artwork: 'light' },
    brand: { base: '#e65224', glow: '#ff5824' },
    tag: 'Tech',
    description:
      'Learn how moving AI inference from managed-infrastructure unlocked the fastest automatic takedown in the market.',
    href: 'https://www.azion.com/en/success-case/axur-reduced-time-to-takedown-with-ai/'
  }
]

/**
 * Every story in the library, in the source's order. `tags` is the pill row the card
 * renders (its industry, then its products); `solutions` is the taxonomy the source's
 * second filter reads and never prints.
 */
export const SUCCESS_CASES = [
  {
    key: 'case-banco-de-la-nacion',
    client: { name: 'Banco de la Nación', logo: bancoDeLaNacion, artwork: 'dark' },
    industry: 'Government Financial Services',
    solutions: [],
    products: [
      'Azion Application',
      'Functions',
      'Application Accelerator',
      'Image Processor',
      'Cache',
      'DDoS Protection'
    ],
    tags: [
      'Government Financial Services',
      'Azion Application',
      'Functions',
      'Application Accelerator',
      'Image Processor',
      'Cache',
      'DDoS Protection'
    ],
    description:
      'With Azion, Banco de la Nación achieved maximum performance efficiency, reducing latency and accelerating content delivery across Peru.',
    href: 'https://www.azion.com/en/success-case/banco-de-la-nacion-achieves-speed-and-reduces-costs/'
  },
  {
    key: 'case-zoop',
    client: byName('iFood'),
    industry: 'Fintech',
    solutions: ['Secure'],
    products: [
      'Azion Application',
      'Functions',
      'Application Accelerator',
      'Network Shield',
      'Data Stream',
      'Web Application Firewall'
    ],
    tags: [
      'Fintech',
      'Azion Application',
      'Functions',
      'Application Accelerator',
      'Network Shield',
      'Data Stream',
      'Web Application Firewall'
    ],
    description:
      'To handle transaction spikes without compromising the checkout experience, Zoop, iFood’s fintech, adopted Azion’s platform, reducing costs and accelerating risk decisions with high performance.',
    href: 'https://www.azion.com/en/success-case/zoop-case-performance-at-scale/'
  },
  {
    key: 'case-herospark-security',
    client: byName('HeroSpark'),
    industry: 'EdTech',
    solutions: ['Secure'],
    products: ['Bot Manager', 'Web Application Firewall'],
    tags: ['EdTech', 'Bot Manager', 'Web Application Firewall'],
    description:
      'With Azion, HeroSpark automated fraud prevention, sped up content delivery, and strengthened HeroPay’s infrastructure to scale globally.',
    href: 'https://www.azion.com/en/success-case/herospark-fraud-prevention-azion/'
  },
  {
    key: 'case-herospark',
    client: byName('HeroSpark'),
    industry: 'EdTech',
    solutions: ['Secure'],
    products: ['Object Storage', 'Functions', 'Application Accelerator'],
    tags: ['EdTech', 'Object Storage', 'Functions', 'Application Accelerator'],
    description:
      'HeroSpark accelerated access to its digital learning platform and scaled content delivery for thousands of students and creators using Azion’s distributed infrastructure.',
    href: 'https://www.azion.com/en/success-case/herospark-30-percent-performance-azion/'
  },
  {
    key: 'case-gpa',
    client: byName('GPA'),
    industry: 'Retail',
    solutions: ['Secure'],
    products: ['Bot Manager', 'Firewall', 'Functions', 'Web Application Firewall'],
    tags: ['Retail', 'Bot Manager', 'Firewall', 'Functions', 'Web Application Firewall'],
    description:
      'Grupo Pão de Açúcar (GPA) solved a targeted DNS attack, secured 100+ critical applications in 15 days, and reduced costs by 30%.',
    href: 'https://www.azion.com/en/success-case/gpa-solved-cyberattack/'
  },
  {
    key: 'case-axur',
    client: { name: 'Axur', logo: axur, artwork: 'light' },
    industry: 'Tech',
    solutions: ['Build', 'Secure'],
    products: ['AI Inference'],
    tags: ['Tech', 'AI Inference'],
    description:
      'Learn how moving AI inference from managed-infrastructure unlocked the fastest automatic takedown in the market.',
    href: 'https://www.azion.com/en/success-case/axur-reduced-time-to-takedown-with-ai/'
  },
  {
    key: 'case-ibero',
    client: { name: 'Ibero' },
    industry: 'Education',
    solutions: ['Build', 'Secure'],
    products: ['Edge DNS', 'Firewall', 'Applications'],
    tags: ['Education', 'Edge DNS', 'Firewall', 'Applications'],
    description:
      'Universidad Iberoamericana strengthened digital security and improved user experience with resilient DNS and application protection using Azion’s distributed infrastructure.',
    href: 'https://www.azion.com/en/success-case/ibero/'
  },
  {
    key: 'case-exame',
    client: byName('Exame'),
    industry: 'Media',
    solutions: ['Build', 'Secure', 'Deploy', 'Observe'],
    products: ['Applications', 'Firewall', 'Edge DNS', 'Real-Time Metrics', 'Real-Time Events'],
    tags: [
      'Media',
      'Applications',
      'Firewall',
      'Edge DNS',
      'Real-Time Metrics',
      'Real-Time Events'
    ],
    description:
      'Faster content delivery and resilient infrastructure enabled Exame to handle large traffic spikes during major news events.',
    href: 'https://www.azion.com/en/success-case/exame/'
  },
  {
    key: 'case-fourbank',
    client: byName('Fourbank'),
    industry: 'Tech',
    solutions: ['Build', 'Secure', 'Observe'],
    products: ['Applications', 'Firewall', 'Real-Time Metrics', 'Real-Time Events'],
    tags: ['Tech', 'Applications', 'Firewall', 'Real-Time Metrics', 'Real-Time Events'],
    description:
      'FourBank strengthened the security of its financial services and increased resilience against DDoS attacks using the security capabilities of the Azion Platform.',
    href: 'https://www.azion.com/en/success-case/fourbank/'
  },
  {
    key: 'case-todo',
    client: { name: 'Todo Cartões' },
    industry: 'Tech',
    solutions: [],
    products: ['Firewall'],
    tags: ['Tech', 'Firewall'],
    description:
      'Todo Cartões strengthened digital payment security and reduced fraud risks in gift cards using Azion’s distributed security infrastructure.',
    href: 'https://www.azion.com/en/success-case/todo/'
  },
  {
    key: 'case-panvel',
    client: { name: 'Panvel', logo: panvel, artwork: 'dark' },
    industry: 'Retail',
    solutions: ['Build', 'Deploy'],
    products: ['Applications'],
    tags: ['Retail', 'Applications'],
    description:
      'Over 60% faster applications and 86% offloaded traffic allowed Panvel to scale its e-commerce using Azion’s distributed platform.',
    href: 'https://www.azion.com/en/success-case/panvel/'
  },
  {
    key: 'case-contabilizei',
    client: { name: 'Contabilizei', logo: contabilizei, artwork: 'light' },
    industry: 'Tech',
    solutions: ['Build', 'Secure', 'Deploy'],
    products: ['Applications', 'Functions'],
    tags: ['Tech', 'Applications', 'Functions'],
    description:
      'Scalable infrastructure and optimized application performance enabled Contabilizei to support rapid growth of its digital accounting platform.',
    href: 'https://www.azion.com/en/success-case/contabilizei/'
  },
  {
    key: 'case-mobiauto',
    client: byName('Mobiauto'),
    industry: 'Tech',
    solutions: ['Build', 'Secure', 'Deploy'],
    products: ['Azion Application'],
    tags: ['Tech', 'Azion Application'],
    description:
      'Mobiauto strengthened application scalability and sustained 500,000 simultaneous users during nationwide campaigns using Azion’s distributed infrastructure.',
    href: 'https://www.azion.com/en/success-case/mobiauto/'
  },
  {
    key: 'case-quero-quero',
    client: { name: 'Quero-Quero' },
    industry: 'Retail',
    solutions: ['Build', 'Secure', 'Observe'],
    products: ['Firewall'],
    tags: ['Retail', 'Firewall'],
    description:
      'Explore how Quero-Quero protects its e-commerce platform with Azion Firewall, strengthening API security and ensuring high availability.',
    href: 'https://www.azion.com/en/success-case/quero-quero/'
  },
  {
    key: 'case-digimais',
    client: { name: 'Digi+' },
    industry: 'Financial',
    solutions: ['Secure'],
    products: ['Firewall'],
    tags: ['Financial', 'Firewall'],
    description:
      'Digi+ increased the security and resilience of its digital banking services while scaling access for a growing customer base.',
    href: 'https://www.azion.com/en/success-case/digimais/'
  },
  {
    key: 'case-marisa',
    client: { name: 'Marisa', logo: marisa, artwork: 'light' },
    industry: 'Retail',
    solutions: ['Build', 'Deploy'],
    products: ['Application Accelerator', 'Cache', 'Image Processor'],
    tags: ['Retail', 'Application Accelerator', 'Cache', 'Image Processor'],
    description:
      'Discover how Marisa improved e-commerce performance with the Azion Platform, delivering 85% of traffic through distributed infrastructure, reducing origin costs, and supporting 96% online sales growth.',
    href: 'https://www.azion.com/en/success-case/marisa/'
  },
  {
    key: 'case-fam',
    client: { name: 'FAM' },
    industry: 'Education',
    solutions: ['Secure'],
    products: ['Web Application Firewall'],
    tags: ['Education', 'Web Application Firewall'],
    description:
      'Discover how FAM uses the security capabilities of the Azion Platform to implement a zero-trust model and protect academic applications with Firewall, WAF, and DDoS Protection.',
    href: 'https://www.azion.com/en/success-case/fam/'
  },
  {
    key: 'case-crefisa',
    client: { name: 'Crefisa', logo: crefisa, artwork: 'light' },
    industry: 'Financial',
    solutions: ['Build', 'Secure'],
    products: ['Firewall'],
    tags: ['Financial', 'Firewall'],
    description:
      'Discover how Crefisa modernized its digital infrastructure and reinforced application and API security using the security capabilities of Azion Platform.',
    href: 'https://www.azion.com/en/success-case/crefisa/'
  },
  {
    key: 'case-pernambucanas-performance',
    client: { name: 'Pernambucanas', logo: pernambucanas, artwork: 'dark' },
    industry: 'Retail',
    solutions: ['Build', 'Secure', 'Observe'],
    products: ['Applications'],
    tags: ['Retail', 'Applications'],
    description:
      'Faster checkout performance and improved platform reliability helped Pernambucanas deliver better e-commerce experiences to millions of customers.',
    href: 'https://www.azion.com/en/success-case/pernambucanas/pernambucanas-relies-on-azion-to-speed-up-its-e-commerce-platform-and-innovate-customer-experience-through-edge-applications/'
  },
  {
    key: 'case-pernambucanas-security',
    client: { name: 'Pernambucanas', logo: pernambucanas, artwork: 'dark' },
    industry: 'Retail',
    solutions: ['Build', 'Deploy'],
    products: ['Edge Firewall', 'Data Stream'],
    tags: ['Retail', 'Edge Firewall', 'Data Stream'],
    description:
      'Pernambucanas increased visibility into security events and strengthened e-commerce protection with automated mitigation and observability capabilities.',
    href: 'https://www.azion.com/en/success-case/pernambucanas-built-a-robust-zero-trust-security-model-with-azions-platform/'
  },
  {
    key: 'case-madeiramadeira',
    client: byName('MadeiraMadeira'),
    industry: 'Retail',
    solutions: ['Build', 'Deploy'],
    products: ['Applications'],
    tags: ['Retail', 'Applications'],
    description:
      'Faster product delivery and scalable infrastructure allowed MadeiraMadeira to support massive traffic growth during major e-commerce campaigns.',
    href: 'https://www.azion.com/en/success-case/madeiramadeira/'
  },
  {
    key: 'case-b2w',
    client: { name: 'B2W' },
    industry: 'Retail',
    solutions: ['Build', 'Secure', 'Observe'],
    products: ['Firewall', 'Data Stream'],
    tags: ['Retail', 'Firewall', 'Data Stream'],
    description:
      'B2W Digital strengthened e-commerce security by automating protection rules and increasing visibility into security events.',
    href: 'https://www.azion.com/en/success-case/b2w/'
  },
  {
    key: 'case-dafiti',
    client: byName('Dafiti'),
    industry: 'Retail',
    solutions: ['Build', 'Secure', 'Observe'],
    products: [
      'Applications',
      'Functions',
      'Image Processor',
      'Application Acceleration',
      'Tiered Cache',
      'Cache'
    ],
    tags: [
      'Retail',
      'Applications',
      'Functions',
      'Image Processor',
      'Application Acceleration',
      'Tiered Cache',
      'Cache'
    ],
    description:
      'Dafiti modernized its digital architecture to deliver faster, scalable, and resilient experiences for millions of consumers across Latin America.',
    href: 'https://www.azion.com/en/success-case/dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application/'
  },
  {
    key: 'case-dafiti-security',
    client: byName('Dafiti'),
    industry: 'Retail',
    solutions: ['Build', 'Deploy'],
    products: ['Firewall'],
    tags: ['Retail', 'Firewall'],
    description:
      'Dafiti strengthened its e-commerce security by automatically blocking threats and ensuring compliance with standards such as PCI DSS.',
    href: 'https://www.azion.com/en/success-case/dafiti/dafiti-azion-edge-firewall/'
  },
  {
    key: 'case-magalu',
    client: byName('Magalu'),
    industry: 'Retail',
    solutions: ['Build', 'Secure', 'Deploy', 'Observe'],
    products: [
      'Firewall',
      'Data Stream',
      'Web Application Firewall',
      'Network Shield',
      'Bot Manager',
      'DDoS Protection'
    ],
    tags: [
      'Retail',
      'Firewall',
      'Data Stream',
      'Web Application Firewall',
      'Network Shield',
      'Bot Manager',
      'DDoS Protection'
    ],
    description:
      "Explore how Magalu enhances cybersecurity with Azion's Firewall and WAF, improving threat intelligence and bot management in retail.",
    href: 'https://www.azion.com/en/success-case/magalu/'
  },
  {
    key: 'case-netshoes',
    client: byName('Netshoes'),
    industry: 'Retail',
    solutions: ['Build', 'Secure', 'Observe'],
    products: ['Firewall'],
    tags: ['Retail', 'Firewall'],
    description:
      'Netshoes strengthened its e-commerce security and improved the shopping experience by blocking threats such as SQL Injection and XSS.',
    href: 'https://www.azion.com/en/success-case/netshoes/'
  },
  {
    key: 'case-nzn-intelligent-dns',
    client: byName('NZN'),
    industry: 'Media',
    solutions: ['Build', 'Secure', 'Deploy'],
    products: ['Intelligent DNS'],
    tags: ['Media', 'Intelligent DNS'],
    description:
      'Explore how NZN enhances user experiences with Azion Intelligent DNS for improved content delivery, performance, and security against DNS attacks.',
    href: 'https://www.azion.com/en/success-case/nzn/azion-intelligent-dns-helps-nzn-to-increase-performance-security-and-reliability-of-its-applications-and-delight-millions-of-users-in-brazil/'
  },
  {
    key: 'case-vtex',
    client: { name: 'VTEX', logo: vtex, artwork: 'light' },
    industry: 'Tech',
    solutions: ['Build'],
    products: ['Application'],
    tags: ['Tech', 'Application'],
    description:
      'High-performance serverless applications enabled VTEX to accelerate global e-commerce experiences while maintaining low latency and high availability.',
    href: 'https://www.azion.com/en/success-case/vtex/'
  },
  {
    key: 'case-getninjas',
    client: { name: 'GetNinjas' },
    industry: 'Tech',
    solutions: ['Build', 'Secure', 'Deploy', 'Observe'],
    products: ['Applications', 'Firewall', 'Data Stream', 'Functions'],
    tags: ['Tech', 'Applications', 'Firewall', 'Data Stream', 'Functions'],
    description:
      "GetNinjas now delivers about 70% of requests through Azion's infrastructure, reaching a hit rate of up to 80% and collecting over 3 TB of data to optimize performance, SEO, and security.",
    href: 'https://www.azion.com/en/success-case/getninjas/'
  },
  {
    key: 'case-nzn',
    client: byName('NZN'),
    industry: 'Media',
    solutions: ['Build', 'Secure', 'Deploy'],
    products: ['Applications', 'Intelligent DNS'],
    tags: ['Media', 'Applications', 'Intelligent DNS'],
    description:
      'Discover how NZN leverages Azion’s distributed infrastructure to improve performance, optimize content delivery, and enhance user experience in Brazil.',
    href: 'https://www.azion.com/en/success-case/nzn/nzn-creates-more-than-100-edge-applications-and-reduces-their-websites-loading-time-by-50-using-the-azion-platform/'
  },
  {
    key: 'case-renner',
    client: byName('Renner'),
    industry: 'Retail',
    solutions: ['Build', 'Deploy'],
    products: ['Applications', 'Functions'],
    tags: ['Retail', 'Applications', 'Functions'],
    description:
      'Faster product pages and more resilient digital shopping experiences allowed Renner to scale its e-commerce platform using Azion’s distributed infrastructure.',
    href: 'https://www.azion.com/en/success-case/renner/'
  },
  {
    key: 'case-uninter',
    client: { name: 'Uninter' },
    industry: 'Education',
    solutions: ['Deploy'],
    products: ['Applications'],
    tags: ['Education', 'Applications'],
    description:
      'Reliable digital learning experiences enabled Uninter to scale its online education platform and support thousands of students accessing classes simultaneously.',
    href: 'https://www.azion.com/en/success-case/uninter/'
  },
  {
    key: 'case-unicesumar',
    client: { name: 'UniCesumar' },
    industry: 'Education',
    solutions: ['Build', 'Secure', 'Deploy'],
    products: ['Applications', 'Firewall', 'Functions'],
    tags: ['Education', 'Applications', 'Firewall', 'Functions'],
    description:
      'Scalable infrastructure and faster application delivery allowed UniCesumar to improve digital education experiences for thousands of online students.',
    href: 'https://www.azion.com/en/success-case/unicesumar/'
  },
  {
    key: 'case-agi',
    client: byName('Agibank'),
    industry: 'Financial',
    solutions: ['Build', 'Secure', 'Observe'],
    products: ['Firewall', 'Data Streaming'],
    tags: ['Financial', 'Firewall', 'Data Streaming'],
    description:
      'Explore how Agi leverages Firewall and Data Streaming on the Azion Platform to enhance cybersecurity and ensure continuous service availability.',
    href: 'https://www.azion.com/en/success-case/agibank/'
  },
  {
    key: 'case-omelete',
    client: { name: 'Omelete' },
    industry: 'Media',
    solutions: ['Build', 'Secure', 'Deploy'],
    products: ['Applications'],
    tags: ['Media', 'Applications'],
    description:
      'High-traffic media experiences became faster and more reliable as Omelete scaled its entertainment platform to millions of users.',
    href: 'https://www.azion.com/en/success-case/omelete/'
  }
]
