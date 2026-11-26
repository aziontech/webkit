<script setup>
  import ArticleCardsSection from '@aziontech/ui/article-cards-section'
  import gpaExtendedReversed from '@aziontech/ui/assets/gpa-extended-reversed.svg'
  import netshoesExtendedReversed from '@aziontech/ui/assets/netshoes-extended-reversed.svg'
  import rennerExtendedColor from '@aziontech/ui/assets/renner-extended-color.svg'
  import Container from '@aziontech/ui/container'
  import Spacer from '@aziontech/ui/spacer'

  const items = [
    {
      id: 'netshoes',
      href: '/success-cases/netshoes',
      title: 'Netshoes blocks 4M+ threats in 6 months with Azion WAF',
      description:
        'Netshoes strengthened its e-commerce security and improved the shopping experience by blocking threats such as SQL Injection and XSS.',
      meta: 'FEB 4, 2022 • 4 min read',
      mark: {
        name: 'Netshoes',
        logo: netshoesExtendedReversed
      }
    },
    {
      id: 'renner',
      href: '/success-cases/renner',
      title: 'Lojas Renner optimizes its online shopping journey with Azion',
      description:
        'Faster product pages and more resilient digital shopping experiences allowed Renner to scale its e-commerce platform using Azion’s distributed infrastructure.',
      meta: 'AUG 10, 2021 • 4 min read',
      mark: {
        name: 'Renner',
        logo: rennerExtendedColor
      }
    },
    {
      id: 'gpa',
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
  <Container max-width="site">
    <Spacer hatch />

    <ArticleCardsSection
      align="start"
      title="Related success cases"
      :items="items"
      aria-label="Related success cases"
    />

    <Spacer hatch />
  </Container>
</template>
