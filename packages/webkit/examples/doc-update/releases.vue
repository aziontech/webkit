<script setup>
  import DocProse from '@aziontech/webkit/doc-prose'
  import DocUpdate from '@aziontech/webkit/doc-update'
</script>

<template>
  <DocProse>
    <DocUpdate
      label="September 2, 2026"
      title="Terraform Provider"
      description="Version 2.8.0"
      :tags="['Improvements', 'Bug Fixes']"
    >
      <h3>Improvements</h3>
      <ul>
        <li>
          Resources now support drift detection, so out-of-band changes made in the Azion Console
          are reverted by <code>terraform plan</code>.
        </li>
      </ul>
      <h3>Bug Fixes</h3>
      <ul>
        <li>Fixed <code>terraform import</code> across multiple data sources and resources.</li>
      </ul>
    </DocUpdate>
    <DocUpdate
      label="August 26, 2026"
      title="Azion CLI"
      description="Version 4.23.0"
      :tags="['Features']"
    >
      <p>Added a new command tree for managing DNS zones, records, and DNSSEC.</p>
    </DocUpdate>
    <DocUpdate
      label="August 26, 2026"
      title="Azion Console"
      :tags="['Bug Fixes']"
    >
      <p>Fixed the pagination controls being unusable on mobile.</p>
    </DocUpdate>
  </DocProse>
</template>
