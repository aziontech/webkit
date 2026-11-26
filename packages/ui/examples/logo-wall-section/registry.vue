<script setup>
  import { CLIENTS } from '@aziontech/webkit/assets/client-registry'
  import LogoWallSection from '@aziontech/webkit/logo-wall-section'

  const WALL = [
    'Agibank',
    'iFood',
    'Itaú',
    'GPA',
    'Netshoes',
    'Renner',
    'Magalu',
    'Dafiti',
    'Prime Video'
  ]

  const logos = WALL.map((name) => CLIENTS.find((client) => client.name === name))

  const zoop = CLIENTS.find((client) => client.name === 'Zoop')
</script>

<template>
  <LogoWallSection
    eyebrow="Customers"
    title="Trusted by the largest retailers and banks"
    aria-label="Retailers and banks running on Azion"
    :logos="logos"
    :quote="{
      text: 'Azion delivered the advanced protection and superior performance we needed, with fast implementation and immediate results.',
      name: 'Priya Patel',
      jobTitle: 'Information security manager at Zoop',
      logo: zoop.logo,
      logoLight: zoop.logoLight,
      artwork: zoop.artwork,
      logoAlt: zoop.name
    }"
    :primary-action="{
      label: 'Read the case study',
      href: 'https://example.com/stories',
      trailing: true
    }"
    :secondary-action="{ label: 'See all customers', href: 'https://example.com/customers' }"
  />
</template>
