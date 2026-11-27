<script setup>
  import DocChangelogEntry from '@aziontech/ui/doc-changelog-entry'
  import DocProse from '@aziontech/ui/doc-prose'
</script>

<template>
  <DocProse>
    <DocChangelogEntry
      label="September 2, 2026"
      title="Terraform Provider"
      description="Version 2.8.0"
      :tags="['Improvements', 'Bug fixes']"
    >
      <h3>Improvements</h3>
      <ul>
        <li>
          Resources now support drift detection, so out-of-band changes made in the Azion Console
          are reverted by <code>terraform plan</code>.
        </li>
      </ul>
      <h3>Bug fixes</h3>
      <ul>
        <li>Fixed <code>terraform import</code> across multiple data sources and resources.</li>
      </ul>
    </DocChangelogEntry>
    <DocChangelogEntry
      label="August 26, 2026"
      title="Azion CLI"
      description="Version 4.23.0"
      :tags="['Features']"
    >
      <p>Added a new command tree for managing DNS zones, records, and DNSSEC.</p>
    </DocChangelogEntry>
    <DocChangelogEntry
      label="August 26, 2026"
      title="Azion Console"
      :tags="['Bug fixes']"
    >
      <p>Fixed the pagination controls being unusable on mobile.</p>
    </DocChangelogEntry>
  </DocProse>
</template>
