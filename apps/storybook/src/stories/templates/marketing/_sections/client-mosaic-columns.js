const CASE = (slug) => `https://www.azion.com/en/success-case/${slug}/`

export const SITE_SECTION = {
  _id: 'client-mosaic-columns',
  props: {
    ariaLabel: 'Featured success stories',
    linkLabel: 'Read story',
    cells: [
      {
        name: 'Magalu',
        logo: '/marketing-components/logos/magalu-extended-color.svg',
        href: CASE('magalu'),
        story:
          "Explore how Magalu enhances cybersecurity with Azion's Firewall and WAF, improving threat intelligence and bot management in retail.",
        brand: { base: '#0e89ff', glow: '#0e89ff' },
        logoTreatment: 'monochrome'
      },
      {
        name: 'Dafiti',
        logo: '/marketing-components/logos/dafiti-extended-reversed.svg',
        href: CASE(
          'dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application'
        ),
        story:
          'Dafiti modernized its digital architecture to deliver faster, scalable, and resilient experiences for millions of consumers across Latin America.',
        brand: { base: '#ffffff', glow: '#ffffff', ink: 'dark' },
        logoTreatment: 'knockout'
      },
      {
        name: 'MadeiraMadeira',
        logo: '/marketing-components/logos/madeiramadeira-extended-reversed.svg',
        href: CASE('madeiramadeira'),
        story:
          'Faster product delivery and scalable infrastructure allowed MadeiraMadeira to support massive traffic growth during major e-commerce campaigns.',
        brand: { base: '#ff9014', glow: '#ff9014' },
        logoTreatment: 'monochrome'
      }
    ]
  }
}
