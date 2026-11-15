<script setup>
  import CompetitorComparison from '@aziontech/webkit/competitor-comparison'

  const groups = [
    {
      title: 'Security',
      rows: [
        {
          capability: 'Web application firewall',
          definition: 'Rules that inspect requests and block attacks before they reach the origin.',
          azion: 'full',
          competitor: 'full'
        },
        {
          capability: 'Bot management',
          definition: 'Detecting and blocking automated traffic.',
          azion: 'full',
          competitor: 'partial'
        }
      ]
    },
    {
      title: 'Compute',
      rows: [
        {
          capability: 'Functions on every location',
          definition: 'Code runs on every location of the network, not only in a few regions.',
          azion: 'full',
          competitor: 'none'
        }
      ]
    }
  ]
</script>

<template>
  <CompetitorComparison
    anchor="compare"
    eyebrow="Comparison"
    title="Azion vs Fastly"
    caption="Azion vs Fastly"
    column-label="Capability"
    full-label="Full support"
    partial-label="Partial support"
    none-label="Not supported"
    :competitor="{ name: 'Fastly' }"
    :groups="groups"
  />
</template>
