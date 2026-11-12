<script setup>
  import ListingTable from '@aziontech/webkit/listing-table'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'

  const columns = [
    {
      key: 'role',
      label: 'Role',
      grow: 2
    },
    {
      key: 'team',
      label: 'Team and location',
      grow: 2
    },
    {
      key: 'type',
      label: 'Work type',
      align: 'end'
    }
  ]

  const rows = [
    {
      href: '/careers/senior-platform-engineer',
      values: {
        role: 'Senior Platform Engineer',
        team: 'Delivery Engineering · Porto Alegre',
        type: 'Hybrid · Full-time'
      }
    },
    {
      href: '/careers/senior-quality-automation-engineer',
      values: {
        role: 'Senior Quality Automation Engineer',
        team: 'Delivery Engineering · Porto Alegre',
        type: 'Hybrid · Full-time'
      }
    },
    {
      href: '/careers/software-engineer-go',
      values: {
        role: 'Software Engineer (Go)',
        team: 'Engineering · Porto Alegre',
        type: 'Hybrid · Full-time'
      }
    },
    {
      href: '/careers/software-engineer-rust',
      values: {
        role: 'Software Engineer (Rust and/or C/C++)',
        team: 'Platform Engineering · Porto Alegre / São Paulo',
        type: 'Hybrid · Full-time'
      }
    },
    {
      href: '/careers/senior-infrastructure-analyst',
      values: {
        role: 'Senior Infrastructure Analyst',
        team: 'SRE · Porto Alegre / São Paulo',
        type: 'Hybrid · Full-time'
      }
    },
    {
      href: '/careers/software-engineer-frontend',
      values: {
        role: 'Software Engineer (Frontend)',
        team: 'UX Engineering · Porto Alegre',
        type: 'Hybrid · Full-time'
      }
    }
  ]

  const primaryAction = {
    label: 'See all 23 roles',
    href: '/careers/jobs',
    trailing: true
  }
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <ListingTable
      title="Latest roles"
      :columns="columns"
      :rows="rows"
      :primary-action="primaryAction"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
