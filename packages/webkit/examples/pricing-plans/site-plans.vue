<script setup>
  import PricingPlans from '@aziontech/webkit/pricing-plans'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'

  const periods = [
    {
      label: 'Monthly',
      value: 'monthly'
    },
    {
      label: 'Annual',
      value: 'annual'
    }
  ]

  const plans = [
    {
      name: 'Hobby',
      highlighted: false,
      prices: [
        {
          value: 'Free',
          details: 'Free forever, no card required. Included limits reset every month.'
        }
      ],
      featuresTitle: 'All features included.',
      features: [
        {
          icon: 'ai ai-globe',
          label: 'Global infrastructure'
        },
        {
          icon: 'ai ai-edge-functions',
          label: 'Serverless functions'
        },
        {
          icon: 'ai ai-edge-storage',
          label: 'Storage and database'
        },
        {
          icon: 'ai ai-image',
          label: 'Image Processor'
        },
        {
          icon: 'ai ai-edge-firewall',
          label: 'DDoS mitigation and firewall'
        }
      ],
      action: {
        label: 'Start for free',
        href: 'https://console.azion.com/signup?plan=hobby'
      }
    },
    {
      name: 'Pro',
      highlighted: true,
      tagLabel: 'Popular',
      prices: [
        {
          period: 'monthly',
          value: '25',
          prefix: '$',
          suffix: '/mo',
          details:
            'Billed monthly, cancel anytime. Usage past the included limits is charged on demand.'
        },
        {
          period: 'annual',
          value: '20',
          prefix: '$',
          suffix: '/mo',
          details: 'Billed annually, save 20%. Usage past the included limits is charged on demand.'
        }
      ],
      featuresTitle: 'All Hobby features, plus:',
      features: [
        {
          icon: 'ai ai-workloads',
          label: 'Additional workloads'
        },
        {
          icon: 'ai ai-edge-application',
          label: 'Higher application limits'
        },
        {
          icon: 'ai ai-store',
          label: 'More storage capacity'
        },
        {
          icon: 'ai ai-waf-rules',
          label: 'Broader security coverage'
        },
        {
          icon: 'ai ai-wallet',
          label: 'Configurable spend limit'
        }
      ],
      action: {
        label: 'Start with Pro',
        href: 'https://console.azion.com/signup?plan=pro&billing-cycle=monthly'
      }
    },
    {
      name: 'Enterprise',
      highlighted: false,
      prices: [
        {
          value: 'Custom',
          details: 'Custom terms and payment schedule. Commit up front and save on usage.'
        }
      ],
      featuresTitle: 'All Pro features, plus:',
      features: [
        {
          icon: 'ai ai-chart-line',
          label: 'On-demand pricing'
        },
        {
          icon: 'ai ai-arrow-down',
          label: 'Cut costs with commitments'
        },
        {
          icon: 'ai ai-layers',
          label: 'Capacity Reservation available'
        },
        {
          icon: 'ai ai-calendar',
          label: 'Savings Plan available'
        },
        {
          icon: 'ai ai-business-support',
          label: 'Advanced support available'
        }
      ],
      action: {
        label: 'Talk to a specialist',
        href: '#contact'
      }
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <PricingPlans
      anchor="plans"
      :periods="periods"
      periods-aria-label="Billing period"
      :plans="plans"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
