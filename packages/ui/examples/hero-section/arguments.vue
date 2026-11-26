<script setup>
  import HeroSection from '@aziontech/ui/hero-section'
</script>

<template>
  <HeroSection
    size="large"
    title-length="long"
    eyebrow="Firewall"
    title="Programmable firewall for distributed applications"
    description="Protect users, applications, and networks with rules you program, from layer 3 to layer 7."
    :primary-action="{ label: 'Start for free', href: 'https://console.azion.com/signup/' }"
    :secondary-action="{
      label: 'Docs',
      href: 'https://www.azion.com/en/documentation/',
      trailing: true
    }"
    :items="[
      {
        icon: 'az az-shield',
        title: 'Programmable rule engine',
        description:
          'Define custom rules and behaviors across OSI layers L3-L7 to control traffic before it reaches your applications.'
      },
      {
        icon: 'az az-code',
        title: 'Extensible with Functions',
        description:
          'Run custom JavaScript security code and marketplace integrations on Azion’s distributed infrastructure.'
      },
      {
        icon: 'az az-sync',
        title: 'Real-time synchronization',
        description:
          'Rules sync automatically across every data center. SIEM integration keeps threat intelligence flowing.'
      }
    ]"
  />
</template>
