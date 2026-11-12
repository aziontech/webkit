<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import StoryLibrary from '@aziontech/webkit/story-library'
  import axurExtendedReversed from '@aziontech/webkit/assets/axur-extended-reversed.svg'
  import exameExtendedReversed from '@aziontech/webkit/assets/exame-extended-reversed.svg'
  import fourbankExtendedReversed from '@aziontech/webkit/assets/fourbank-extended-reversed.svg'
  import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'
  import marisaExtendedReversed from '@aziontech/webkit/assets/marisa-extended-reversed.svg'
  import panvelExtendedReversed from '@aziontech/webkit/assets/panvel-extended-reversed.svg'

  const items = [
    {
      key: 'case-gpa',
      href: '/site/success-cases/gpa',
      client: {
        name: 'GPA',
        logo: gpaExtendedReversed
      },
      category: 'Retail',
      description:
        'Grupo Pão de Açúcar (GPA) solved a targeted DNS attack, secured 100+ critical applications in 15 days, and reduced costs by 30%.',
      facets: {
        industry: ['Retail'],
        solution: ['Secure'],
        product: ['Bot Manager', 'Firewall', 'Functions', 'WAF']
      }
    },
    {
      key: 'case-axur',
      href: '/site/success-cases/axur',
      client: {
        name: 'Axur',
        logo: axurExtendedReversed
      },
      category: 'Tech',
      description:
        'See how moving AI inference off managed infrastructure unlocked the fastest automatic takedown in the market.',
      facets: {
        industry: ['Tech'],
        solution: ['Build', 'Secure'],
        product: ['AI Inference']
      }
    },
    {
      key: 'case-exame',
      href: '/site/success-cases/exame',
      client: {
        name: 'Exame',
        logo: exameExtendedReversed
      },
      category: 'Media',
      description:
        'Faster content delivery and resilient infrastructure enabled Exame to handle large traffic spikes during major news events.',
      facets: {
        industry: ['Media'],
        solution: ['Build', 'Secure', 'Deploy', 'Observe'],
        product: ['Applications', 'Firewall', 'Edge DNS', 'Real-Time Metrics', 'Real-Time Events']
      }
    },
    {
      key: 'case-fourbank',
      href: '/site/success-cases/fourbank',
      client: {
        name: 'Fourbank',
        logo: fourbankExtendedReversed
      },
      category: 'Tech',
      description:
        'FourBank strengthened the security of its financial services and increased resilience against DDoS attacks using the security capabilities of the Azion Platform.',
      facets: {
        industry: ['Tech'],
        solution: ['Build', 'Secure', 'Observe'],
        product: ['Applications', 'Firewall', 'Real-Time Metrics', 'Real-Time Events']
      }
    },
    {
      key: 'case-panvel',
      href: '/site/success-cases/panvel',
      client: {
        name: 'Panvel',
        logo: panvelExtendedReversed
      },
      category: 'Retail',
      description:
        'Over 60% faster applications and 86% offloaded traffic allowed Panvel to scale its e-commerce using Azion’s distributed platform.',
      facets: {
        industry: ['Retail'],
        solution: ['Build', 'Deploy'],
        product: ['Applications']
      }
    },
    {
      key: 'case-marisa',
      href: '/site/success-cases/marisa',
      client: {
        name: 'Marisa',
        logo: marisaExtendedReversed
      },
      category: 'Retail',
      description:
        'Discover how Marisa improved e-commerce performance with the Azion Platform, delivering 85% of traffic through distributed infrastructure, reducing origin costs, and supporting 96% online sales growth.',
      facets: {
        industry: ['Retail'],
        solution: ['Build', 'Deploy'],
        product: ['Application Accelerator', 'Cache', 'Image Processor']
      }
    }
  ]

  const facets = [
    {
      key: 'industry',
      label: 'Industry',
      allLabel: 'All industries',
      options: [
        {
          value: 'Media',
          label: 'Media'
        },
        {
          value: 'Retail',
          label: 'Retail'
        },
        {
          value: 'Tech',
          label: 'Tech'
        }
      ]
    },
    {
      key: 'solution',
      label: 'Solution',
      allLabel: 'All solutions',
      options: [
        {
          value: 'Build',
          label: 'Build'
        },
        {
          value: 'Deploy',
          label: 'Deploy'
        },
        {
          value: 'Observe',
          label: 'Observe'
        },
        {
          value: 'Secure',
          label: 'Secure'
        }
      ]
    },
    {
      key: 'product',
      label: 'Product',
      allLabel: 'All products',
      options: [
        {
          value: 'AI Inference',
          label: 'AI Inference'
        },
        {
          value: 'Application Accelerator',
          label: 'Application Accelerator'
        },
        {
          value: 'Applications',
          label: 'Applications'
        },
        {
          value: 'Bot Manager',
          label: 'Bot Manager'
        },
        {
          value: 'Cache',
          label: 'Cache'
        },
        {
          value: 'Edge DNS',
          label: 'Edge DNS'
        },
        {
          value: 'Firewall',
          label: 'Firewall'
        },
        {
          value: 'Functions',
          label: 'Functions'
        },
        {
          value: 'Image Processor',
          label: 'Image Processor'
        },
        {
          value: 'Real-Time Events',
          label: 'Real-Time Events'
        },
        {
          value: 'Real-Time Metrics',
          label: 'Real-Time Metrics'
        },
        {
          value: 'WAF',
          label: 'WAF'
        }
      ]
    }
  ]

  const search = {
    placeholder: 'Search by company or story',
    label: 'Search success stories'
  }

  const empty = {
    title: 'No stories match these filters.',
    action: 'View all success stories'
  }
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <StoryLibrary
      anchor="cases"
      title="Companies building with Azion"
      :items="items"
      :facets="facets"
      :search="search"
      :empty="empty"
      link-label="Read story"
      more-label="Load more"
      aria-label="Success stories"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
