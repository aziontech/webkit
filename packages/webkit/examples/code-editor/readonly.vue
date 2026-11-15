<script setup>
  import CodeEditor from '@aziontech/webkit/code-editor'

  const query = `SELECT country, count(*) AS requests
FROM events
WHERE status >= 500
GROUP BY country
ORDER BY requests DESC
LIMIT 10;
`
</script>

<template>
  <CodeEditor
    :model-value="query"
    language="sql"
    readonly
    height="10rem"
    aria-label="Saved query"
  />
</template>
