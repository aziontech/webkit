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
          team: 'Engineering · Porto Alegre',
          type: 'Hybrid · Full-time'
        },
        facets: { area: ['Engineering'], location: ['Porto Alegre'] }
      },
      {
        href: '/careers/grc-analyst',
        group: 'Security',
        values: {
          role: 'GRC Analyst (Governance, Risk & Compliance)',
          team: 'Compliance and Corporate IT · Porto Alegre / São Paulo',
          type: 'Hybrid · Full-time'
        },
        facets: { area: ['Security'], location: ['Porto Alegre', 'São Paulo'] }
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
          { value: 'São Paulo', label: 'São Paulo, Brazil' },
          { value: 'Porto Alegre', label: 'Porto Alegre, Brazil' }
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
