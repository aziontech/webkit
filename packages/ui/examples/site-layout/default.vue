<script setup lang="ts">
  import Container from '@aziontech/webkit/container'
  import HeroSection from '@aziontech/webkit/hero-section'
  import Module from '@aziontech/webkit/module'
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
    secondaryAction: { label: 'Log in', href: 'https://console.azion.com/login' },
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
      { icon: 'az az-github', label: 'Azion on GitHub', href: 'https://github.com/aziontech' }
    ],
    statusLabel: 'All systems operational',
    languages: ['EN', 'PT-BR', 'ES']
  }
</script>

<template>
  <SiteLayout
    :navigation="navigation"
    :footer="footer"
  >
    <HeroSection
      variant="center"
      eyebrow="Functions"
      title="Run code where your users are"
      description="Deploy serverless functions to the edge network in seconds."
      :primary-action="{ label: 'Start for free', href: 'https://console.azion.com/signup' }"
      :secondary-action="{ label: 'Talk to an expert', href: '/en/contact/' }"
    />
    <Container max-width="site">
      <Module
        :divided="false"
        title="Deploy from the CLI or from Git"
        description="Push a change and it goes live in every data center in seconds."
      />
    </Container>
  </SiteLayout>
</template>
