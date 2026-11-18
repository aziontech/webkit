<script setup>
  import DocMarkdown from '@aziontech/webkit/doc-markdown'
  import DocProse from '@aziontech/webkit/doc-prose'

  const source = [
    '## Watch the demo',
    '',
    '<Embed src="data:text/html,<body style=\'margin:0;height:100vh;display:grid;place-items:center;font:1rem system-ui;color:gray\'>Placeholder embed</body>" title="A placeholder document standing in for an embedded demo" ratio="video" />'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
