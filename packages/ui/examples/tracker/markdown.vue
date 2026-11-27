<script setup>
  import DocMarkdown from '@aziontech/ui/doc-markdown'
  import DocProse from '@aziontech/ui/doc-prose'

  const source = [
    '## Uptime',
    '',
    'One block per day for the last 30 days.',
    '',
    '<Tracker',
    '  aria-label="Application uptime, last 30 days"',
    '  items={[',
    '    { "id": "2026-10-12", "severity": "success", "label": "Oct 12 · Operational" },',
    '    { "id": "2026-10-13", "severity": "success", "label": "Oct 13 · Operational" },',
    '    { "id": "2026-10-14", "severity": "success", "label": "Oct 14 · Operational" },',
    '    { "id": "2026-10-15", "severity": "success", "label": "Oct 15 · Operational" },',
    '    { "id": "2026-10-16", "severity": "success", "label": "Oct 16 · Operational" },',
    '    { "id": "2026-10-17", "severity": "success", "label": "Oct 17 · Operational" },',
    '    { "id": "2026-10-18", "severity": "success", "label": "Oct 18 · Operational" },',
    '    { "id": "2026-10-19", "severity": "success", "label": "Oct 19 · Operational" },',
    '    { "id": "2026-10-20", "severity": "success", "label": "Oct 20 · Operational" },',
    '    { "id": "2026-10-21", "severity": "warning", "label": "Oct 21 · Degraded performance" },',
    '    { "id": "2026-10-22", "severity": "success", "label": "Oct 22 · Operational" },',
    '    { "id": "2026-10-23", "severity": "success", "label": "Oct 23 · Operational" },',
    '    { "id": "2026-10-24", "severity": "success", "label": "Oct 24 · Operational" },',
    '    { "id": "2026-10-25", "severity": "success", "label": "Oct 25 · Operational" },',
    '    { "id": "2026-10-26", "severity": "success", "label": "Oct 26 · Operational" },',
    '    { "id": "2026-10-27", "severity": "success", "label": "Oct 27 · Operational" },',
    '    { "id": "2026-10-28", "severity": "success", "label": "Oct 28 · Operational" },',
    '    { "id": "2026-10-29", "severity": "success", "label": "Oct 29 · Operational" },',
    '    { "id": "2026-10-30", "severity": "success", "label": "Oct 30 · Operational" },',
    '    { "id": "2026-10-31", "severity": "success", "label": "Oct 31 · Operational" },',
    '    { "id": "2026-11-01", "severity": "success", "label": "Nov 1 · Operational" },',
    '    { "id": "2026-11-02", "severity": "danger", "label": "Nov 2 · Partial outage" },',
    '    { "id": "2026-11-03", "severity": "success", "label": "Nov 3 · Operational" },',
    '    { "id": "2026-11-04", "severity": "success", "label": "Nov 4 · Operational" },',
    '    { "id": "2026-11-05", "severity": "success", "label": "Nov 5 · Operational" },',
    '    { "id": "2026-11-06", "severity": "success", "label": "Nov 6 · Operational" },',
    '    { "id": "2026-11-07", "severity": "success", "label": "Nov 7 · Operational" },',
    '    { "id": "2026-11-08", "severity": "success", "label": "Nov 8 · Operational" },',
    '    { "id": "2026-11-09", "severity": "success", "label": "Nov 9 · Operational" },',
    '    { "id": "2026-11-10", "label": "Nov 10 · No data" }',
    '  ]}',
    '/>'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
