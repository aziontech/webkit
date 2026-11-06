const CASE = (slug) => `https://www.azion.com/en/success-case/${slug}/`

export const SITE_SECTION = {
  _id: 'logo-wall-quote',
  props: {
    eyebrow: 'Customers',
    title: "Trusted by the world's largest banks and e-commerce companies",
    ariaLabel: 'Banks and e-commerce companies running on Azion',
    logos: [
      {
        name: 'Magalu',
        logo: '/marketing-components/logos/magalu-extended-color.svg',
        href: CASE('magalu')
      },
      {
        name: 'Banco de la Nación',
        logo: '/marketing-components/logos/banco-de-la-nacion-extended-mono.svg',
        logoTreatment: 'monochrome',
        href: CASE('banco-de-la-nacion-achieves-speed-and-reduces-costs')
      },
      {
        name: 'Netshoes',
        logo: '/marketing-components/logos/netshoes-extended-color.svg',
        href: CASE('netshoes')
      },
      {
        name: 'Agibank',
        logo: '/marketing-components/logos/agibank-extended-reversed.svg',
        logoLight: '/marketing-components/logos/agibank-extended-color.svg',
        href: CASE('agibank')
      },
      {
        name: 'Zoop',
        logo: '/marketing-components/logos/zoop-extended-color.svg',
        href: CASE('zoop-case-performance-at-scale')
      },
      {
        name: 'Crefisa',
        logo: '/marketing-components/logos/crefisa-extended-reversed.svg',
        logoTreatment: 'invert-light',
        href: CASE('crefisa')
      },
      {
        name: 'Renner',
        logo: '/marketing-components/logos/renner-extended-color.svg',
        href: CASE('renner')
      },
      {
        name: 'Fourbank',
        logo: '/marketing-components/logos/fourbank-extended-reversed.svg',
        logoTreatment: 'invert-light',
        href: CASE('fourbank')
      },
      {
        name: 'Marisa',
        logo: '/marketing-components/logos/marisa-extended-color.svg',
        href: CASE('marisa')
      }
    ],
    quote: {
      text: '"Azion delivered the advanced protection and superior performance we needed, with fast implementation and immediate results."',
      name: 'Ismael Aguilar',
      jobTitle: 'Information Security Manager at Zoop',
      logo: '/marketing-components/logos/zoop-extended-color.svg',
      logoAlt: 'Zoop'
    },
    primaryAction: {
      label: 'Read the case study',
      href: CASE('zoop-case-performance-at-scale'),
      trailing: true,
      target: '_blank'
    }
  }
}
