<script setup>
  import ListingIndex from '@aziontech/webkit/listing-index'
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
      group: 'Engineering',
      values: {
        role: 'Senior Platform Engineer',
        team: 'Delivery Engineering · Porto Alegre',
        type: 'Hybrid · Full-time'
      },
      facets: {
        area: ['Engineering'],
        location: ['Porto Alegre']
      }
    },
    {
      href: '/careers/software-engineer-go',
      group: 'Engineering',
      values: {
        role: 'Software Engineer (Go)',
        team: 'Engineering · Porto Alegre',
        type: 'Hybrid · Full-time'
      },
      facets: {
        area: ['Engineering'],
        location: ['Porto Alegre']
      }
    },
    {
      href: '/careers/software-engineer-frontend',
      group: 'Engineering',
      values: {
        role: 'Software Engineer (Frontend)',
        team: 'UX Engineering · Porto Alegre',
        type: 'Hybrid · Full-time'
      },
      facets: {
        area: ['Engineering'],
        location: ['Porto Alegre']
      }
    },
    {
      href: '/careers/defensive-security-engineer',
      group: 'Security',
      values: {
        role: 'Defensive Security Engineer (SOC)',
        team: 'Cybersecurity · Porto Alegre / São Paulo',
        type: 'Hybrid · Full-time'
      },
      facets: {
        area: ['Security'],
        location: ['Porto Alegre', 'São Paulo']
      }
    },
    {
      href: '/careers/grc-analyst',
      group: 'Security',
      values: {
        role: 'GRC Analyst (Governance, Risk & Compliance)',
        team: 'Compliance and Corporate IT · Porto Alegre / São Paulo',
        type: 'Hybrid · Full-time'
      },
      facets: {
        area: ['Security'],
        location: ['Porto Alegre', 'São Paulo']
      }
    }
  ]

  const groups = ['Engineering', 'Security']

  const facets = [
    {
      id: 'area',
      label: 'Department',
      allLabel: 'All departments',
      options: [
        {
          value: 'Engineering',
          label: 'Engineering'
        },
        {
          value: 'Marketing',
          label: 'Marketing'
        },
        {
          value: 'Revenue',
          label: 'Revenue'
        },
        {
          value: 'Operations',
          label: 'Operations'
        },
        {
          value: 'Security',
          label: 'Security'
        }
      ]
    },
    {
      id: 'location',
      label: 'Location',
      allLabel: 'All locations',
      options: [
        {
          value: 'Palo Alto',
          label: 'Palo Alto, USA'
        },
        {
          value: 'São Paulo',
          label: 'São Paulo, Brazil'
        },
        {
          value: 'Porto Alegre',
          label: 'Porto Alegre, Brazil'
        }
      ]
    }
  ]

  const sorts = [
    {
      value: 'newest',
      label: 'Newest posted',
      by: ''
    },
    {
      value: 'title',
      label: 'Title (A–Z)',
      by: 'role'
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <ListingIndex
      title="Open positions"
      :columns="columns"
      :data="rows"
      :groups="groups"
      :facets="facets"
      :sorts="sorts"
      sort-aria-label="Sort positions"
      search-placeholder="Search by title, team, or location"
      search-short-placeholder="Search positions"
      search-aria-label="Search positions"
      empty-title="Nothing here yet"
      empty-description="No open positions match your search."
      empty-action-label="View all open positions"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
