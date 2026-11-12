<script setup lang="ts">
  import HeroBand from '@aziontech/webkit/hero-band'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SiteLayout, {
    type SiteLayoutFooter,
    type SiteLayoutNavigation
  } from '@aziontech/webkit/site-layout'

  const navigation: SiteLayoutNavigation = {
    home: '/en/',
    menus: [
      {
        value: 'products',
        label: 'Products',
        columns: [
          [
            {
              label: 'Build',
              items: [
                {
                  label: 'Functions',
                  description: 'Run serverless code close to your users',
                  href: '/en/products/functions/'
                },
                {
                  label: 'Applications',
                  description: 'Deliver and accelerate your applications',
                  href: '/en/products/applications/'
                }
              ]
            }
          ],
          [
            {
              label: 'Secure',
              items: [
                {
                  label: 'Firewall',
                  description: 'Stop attacks before they reach your origin',
                  href: '/en/products/firewall/'
                }
              ]
            }
          ]
        ]
      }
    ],
    links: [{ label: 'Pricing', href: '/en/pricing/' }],
    contact: { label: 'Contact', href: '/en/contact/' },
    secondaryAction: { label: 'Login', href: 'https://console.azion.com/login' },
    primaryAction: { label: 'Start for free', href: 'https://console.azion.com/signup' }
  }

  const footer: SiteLayoutFooter = {
    home: '/en/',
    columns: [
      {
        title: 'Products',
        links: [
          { label: 'Functions', href: '/en/products/functions/' },
          { label: 'Firewall', href: '/en/products/firewall/' }
        ]
      },
      {
        title: 'Company',
        links: [
          { label: 'About us', href: '/en/about-us/' },
          { label: 'Careers', href: '/en/careers/' }
        ]
      }
    ],
    socials: [
      { icon: 'pi pi-github', label: 'Azion on GitHub', href: 'https://github.com/aziontech' }
    ],
    statusLabel: 'All Systems Operational',
    languages: ['EN', 'PT-BR', 'ES']
  }
</script>

<template>
  <SiteLayout
    :navigation="navigation"
    :footer="footer"
  >
    <HeroBand
      kind="centered"
      eyebrow="Functions"
      title="Run code where your users are"
      description="Deploy serverless functions to the edge network in seconds."
      :primary-action="{ label: 'Start for free', href: 'https://console.azion.com/signup' }"
      :secondary-action="{ label: 'Talk to an expert', href: '/en/contact/' }"
    />
    <SectionContainer max-width="site">
      <SectionGap hatch />
    </SectionContainer>
  </SiteLayout>
</template>
