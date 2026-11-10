<script setup>
  import DocProse from '@aziontech/webkit/doc-prose'
  import DocUpdate from '@aziontech/webkit/doc-update'
</script>

<template>
  <DocProse>
    <DocUpdate
      label="August 19, 2026"
      description="v2.4.0"
      :tags="['Console', 'Edge Functions']"
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
    </DocUpdate>
    <DocUpdate
      label="August 5, 2026"
      description="v2.3.1"
      :tags="['CLI']"
    >
      <p>
        Fixed a crash when <code>azion deploy --local</code> ran in a workspace whose manifest had
        no function bound.
      </p>
    </DocUpdate>
    <DocUpdate
      label="July 28, 2026"
      description="v2.3.0"
      :tags="['API', 'Storage']"
    >
      <p>
        Object Storage buckets can be created and listed from the API, with pagination on every
        collection endpoint.
      </p>
    </DocUpdate>
  </DocProse>
</template>
