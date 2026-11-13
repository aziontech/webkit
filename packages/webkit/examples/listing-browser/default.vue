<script setup>
  import ListingBrowser from '@aziontech/webkit/listing-browser'
</script>

<template>
  <ListingBrowser
    title="Open positions"
    :columns="[
      { key: 'role', label: 'Role', grow: 2 },
      { key: 'team', label: 'Team and location', grow: 2 },
      { key: 'type', label: 'Work type', align: 'end' }
    ]"
    :rows="[
      {
        href: '/careers/software-engineer-go',
        group: 'Engineering',
        values: {
          role: 'Software Engineer (Go)',
          team: 'Engineering · San Francisco',
          type: 'Hybrid · Full-time'
        },
        facets: { area: ['Engineering'], location: ['San Francisco'] }
      },
      {
        href: '/careers/grc-analyst',
        group: 'Security',
        values: {
          role: 'GRC Analyst (Governance, Risk & Compliance)',
          team: 'Compliance and Corporate IT · San Francisco / New York',
          type: 'Hybrid · Full-time'
        },
        facets: { area: ['Security'], location: ['San Francisco', 'New York'] }
      }
    ]"
    :groups="['Engineering', 'Security']"
    :facets="[
      {
        key: 'area',
        label: 'Department',
        allLabel: 'All departments',
        options: [
          { value: 'Engineering', label: 'Engineering' },
          { value: 'Security', label: 'Security' }
        ]
      },
      {
        key: 'location',
        label: 'Location',
        allLabel: 'All locations',
        options: [
          { value: 'New York', label: 'New York, United States' },
          { value: 'San Francisco', label: 'San Francisco, United States' }
        ]
      }
    ]"
    :sorts="[
      { value: 'newest', label: 'Newest posted', by: '' },
      { value: 'title', label: 'Title (A–Z)', by: 'role' }
    ]"
    sort-aria-label="Sort positions"
    :search="{
      placeholder: 'Search by title, team, or location',
      shortPlaceholder: 'Search positions',
      label: 'Search positions'
    }"
    :empty="{
      title: 'Nothing here yet',
      description: 'No open positions match your search.',
      clearLabel: 'View all open positions'
    }"
  />
</template>
