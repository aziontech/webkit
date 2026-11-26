<script setup>
  import DocChangelogEntry from '@aziontech/ui/doc-changelog-entry'
  import DocProse from '@aziontech/ui/doc-prose'
</script>

<template>
  <DocProse>
    <DocChangelogEntry
      label="August 19, 2026"
      description="v2.4.0"
      :tags="['Console', 'Functions']"
    >
      <h3>Header matching in Rules Engine</h3>
      <p>
        Conditions now match on request headers, so a rule can branch on anything the client sends
        without a function in the path.
      </p>
      <ul>
        <li>New criteria: <code>request.headers</code> and <code>response.headers</code>.</li>
        <li>Existing rules keep working — nothing to migrate.</li>
      </ul>
    </DocChangelogEntry>
    <DocChangelogEntry
      label="August 5, 2026"
      description="v2.3.1"
      :tags="['CLI']"
    >
      <p>
        Fixed a crash when <code>azion deploy --local</code> ran in a workspace whose manifest had
        no function bound.
      </p>
    </DocChangelogEntry>
    <DocChangelogEntry
      label="July 28, 2026"
      description="v2.3.0"
      :tags="['API', 'Storage']"
    >
      <p>
        Object Storage buckets can be created and listed from the API, with pagination on every
        collection endpoint.
      </p>
    </DocChangelogEntry>
  </DocProse>
</template>
