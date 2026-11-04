const CASE = (slug) => `https://www.azion.com/en/success-case/${slug}/`

export const SITE_SECTION = {
  _id: 'client-mosaic',
  props: {
    ariaLabel: 'Client stories',
    linkLabel: 'Read the case study',
    stories: [
      {
        logo: '/marketing-components/logos/netshoes-extended-color.svg',
        logoAlt: 'Netshoes',
        photo: '/marketing-components/photos/netshoes.jpg',
        text: 'Netshoes automatically blocks more than 4 million threats in six months',
        href: CASE('netshoes'),
        fill: 'surface',
        logoTreatment: 'monochrome'
      },
      {
        logo: '/marketing-components/logos/gpa-extended-reversed.svg',
        logoAlt: 'GPA',
        photo: '/marketing-components/photos/gpa.jpg',
        text: 'Grupo Pão de Açúcar (GPA) stops a cyberattack and reduces costs by 30%',
        href: CASE('gpa-solved-cyberattack'),
        fill: 'surface',
        logoTreatment: 'monochrome'
      }
    ],
    logos: [
      {
        logo: '/marketing-components/logos/dafiti-extended-mono.svg',
        logoAlt: 'Dafiti',
        href: CASE(
          'dafiti/dafiti-accelerates-its-e-commerce-by-86-and-saves-45-on-data-transfer-costs-using-azion-edge-application'
        ),
        fill: 'white',
        logoTreatment: 'knockout'
      },
      {
        logo: '/marketing-components/logos/agibank-extended-reversed.svg',
        logoAlt: 'Agibank',
        href: CASE('agibank'),
        fill: 'canvas',
        logoTreatment: 'monochrome'
      },
      {
        logo: '/marketing-components/logos/renner-extended-reversed.svg',
        logoAlt: 'Renner',
        href: CASE('renner'),
        fill: 'canvas',
        logoTreatment: 'monochrome'
      },
      {
        logo: '/marketing-components/logos/fourbank-extended-reversed.svg',
        logoAlt: 'Fourbank',
        href: CASE('fourbank'),
        fill: 'primary',
        logoTreatment: 'knockout'
      },
      {
        logo: '/marketing-components/logos/exame-extended-mono.svg',
        logoAlt: 'Exame',
        href: CASE('exame'),
        fill: 'canvas',
        logoTreatment: 'monochrome'
      },
      {
        logo: '/marketing-components/logos/nzn-extended-reversed.svg',
        logoAlt: 'NZN',
        href: CASE(
          'nzn/nzn-creates-more-than-100-edge-applications-and-reduces-their-websites-loading-time-by-50-using-the-azion-platform'
        ),
        fill: 'primary',
        logoTreatment: 'knockout'
      }
    ]
  }
}
