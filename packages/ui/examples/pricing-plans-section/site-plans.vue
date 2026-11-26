<script setup>
  import Container from '@aziontech/ui/container'
  import PricingPlansSection from '@aziontech/ui/pricing-plans-section'
  import Spacer from '@aziontech/ui/spacer'

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
          icon: 'az az-globe',
          label: 'Global infrastructure'
        },
        {
          icon: 'az az-functions',
          label: 'Serverless functions'
        },
        {
          icon: 'az az-object-storage',
          label: 'Storage and database'
        },
        {
          icon: 'az az-image',
          label: 'Image Processor'
        },
        {
          icon: 'az az-firewall',
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
          icon: 'az az-workloads',
          label: 'Additional workloads'
        },
        {
          icon: 'az az-applications',
          label: 'Higher application limits'
        },
        {
          icon: 'az az-store-pillar',
          label: 'More storage capacity'
        },
        {
          icon: 'az az-waf',
          label: 'Broader security coverage'
        },
        {
          icon: 'az az-wallet',
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
          icon: 'az az-chart-line',
          label: 'On-demand pricing'
        },
        {
          icon: 'az az-arrow-down',
          label: 'Cut costs with commitments'
        },
        {
          icon: 'az az-layers',
          label: 'Capacity Reservation available'
        },
        {
          icon: 'az az-calendar',
          label: 'Savings Plan available'
        },
        {
          icon: 'az az-business-support',
          label: 'Advanced support available'
        }
      ],
      action: {
        label: 'Talk to sales',
        href: '#contact'
      }
    }
  ]
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <PricingPlansSection
      anchor="plans"
      :periods="periods"
      periods-aria-label="Billing period"
      :plans="plans"
    />

    <Spacer hatch />
  </Container>
</template>
