<script setup>
  import ListingTable from '@aziontech/webkit/listing-table'
</script>

<template>
  <ListingTable
    title="Latest roles"
    :columns="[
      { key: 'role', label: 'Role', grow: 2 },
      { key: 'team', label: 'Team and location', grow: 2 },
      { key: 'type', label: 'Work type', align: 'end' }
    ]"
    :rows="[
      {
        href: '/careers/senior-platform-engineer',
        values: {
          role: 'Senior Platform Engineer',
          team: 'Delivery Engineering · San Francisco',
          type: 'Hybrid · Full-time'
        }
      },
      {
        href: '/careers/senior-quality-automation-engineer',
        values: {
          role: 'Senior Quality Automation Engineer',
          team: 'Delivery Engineering · San Francisco',
          type: 'Hybrid · Full-time'
        }
      },
      {
        href: '/careers/software-engineer-go',
        values: {
          role: 'Software Engineer (Go)',
          team: 'Engineering · San Francisco',
          type: 'Hybrid · Full-time'
        }
      },
      {
        href: '/careers/software-engineer-rust',
        values: {
          role: 'Software Engineer (Rust and/or C/C++)',
          team: 'Platform Engineering · San Francisco / New York',
          type: 'Hybrid · Full-time'
        }
      },
      {
        href: '/careers/senior-infrastructure-analyst',
        values: {
          role: 'Senior Infrastructure Analyst',
          team: 'SRE · San Francisco / New York',
          type: 'Hybrid · Full-time'
        }
      },
      {
        href: '/careers/software-engineer-frontend',
        values: {
          role: 'Software Engineer (Frontend)',
          team: 'UX Engineering · San Francisco',
          type: 'Hybrid · Full-time'
        }
      }
    ]"
    :primary-action="{ label: 'See all 23 roles', href: '/careers/jobs', trailing: true }"
  />
</template>
