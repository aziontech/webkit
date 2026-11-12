<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import ArticleCards from '@aziontech/webkit/article-cards'
  import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'
  import netshoesExtendedReversed from '@aziontech/webkit/assets/netshoes-extended-reversed.svg'
  import rennerExtendedColor from '@aziontech/webkit/assets/renner-extended-color.svg'

  const items = [
    {
      key: 'netshoes',
      href: '/success-cases/netshoes',
      title: 'Netshoes Blocks 4M+ Threats in 6 Months with Azion WAF',
      description:
        'Netshoes strengthened its e-commerce security and improved the shopping experience by blocking threats such as SQL Injection and XSS.',
      meta: 'FEB 4, 2022 • 4 min read',
      mark: {
        name: 'Netshoes',
        logo: netshoesExtendedReversed
      }
    },
    {
      key: 'renner',
      href: '/success-cases/renner',
      title: 'Lojas Renner Optimizes Online Shopping Journey with Azion',
      description:
        'Faster product pages and more resilient digital shopping experiences allowed Renner to scale its e-commerce platform using Azion’s distributed infrastructure.',
      meta: 'AUG 10, 2021 • 4 min read',
      mark: {
        name: 'Renner',
        logo: rennerExtendedColor
      }
    },
    {
      key: 'gpa',
      href: '/success-cases/gpa',
      title: 'GPA solved a cyberattack and reduced costs by 30%',
      description:
        'Grupo Pão de Açúcar (GPA) solved a targeted DNS attack, secured 100+ critical applications in 15 days, and reduced costs by 30%.',
      meta: 'MAY 6, 2025 • 4 min read',
      mark: {
        name: 'GPA',
        logo: gpaExtendedReversed
      }
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <ArticleCards
      kind="centered"
      eyebrow="Success cases"
      title="When our customers succeed, we succeed"
      :items="items"
      aria-label="When our customers succeed, we succeed"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
