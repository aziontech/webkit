<script setup>
  import HeroSection from '@aziontech/webkit/hero-section'

  const DESCRIPTION =
    'A workload is the hostname, the certificate and the routing that make an application reachable. Create one and it is live in every Azion data center — no servers to size, no ' +
    'regions to pick.'
</script>

<template>
  <HeroSection
    variant="copy-on-top-art"
    eyebrow="Workloads"
    title="Put your application close to users in seconds"
    :description="DESCRIPTION"
    :primary-action="{ label: 'Start for free', href: 'https://console.azion.com/signup' }"
    :secondary-action="{
      label: 'Docs',
      href: 'https://www.azion.com/en/documentation/',
      trailing: true
    }"
    :levels="[
      {
        nodes: [
          {
            eyebrow: 'Domain',
            icon: 'az az-domains',
            title: 'shop.example.com',
            label: 'Public',
            severity: 'info'
          },
          {
            eyebrow: 'Domain',
            icon: 'az az-domains',
            title: 'api.example.com',
            label: 'Public',
            severity: 'info'
          }
        ]
      },
      {
        nodes: [
          {
            eyebrow: 'Workload',
            icon: 'az az-workloads',
            title: 'shop-prod',
            label: 'Live',
            severity: 'success',
            lit: true
          }
        ]
      },
      {
        nodes: [
          {
            eyebrow: 'Application',
            icon: 'az az-applications',
            title: 'storefront',
            label: 'Active',
            severity: 'success'
          },
          {
            eyebrow: 'Firewall',
            icon: 'az az-firewall',
            title: 'shop-rules',
            label: 'Active',
            severity: 'success'
          }
        ]
      }
    ]"
  />
</template>
