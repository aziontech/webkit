<script setup>
  import CodeSplit from '@aziontech/webkit/code-split'

  const codeTabs = [
    {
      label: 'azion.config.js',
      value: 'config',
      language: 'javascript',
      code: "export default {\n  build: { preset: 'javascript' },\n  rules: {\n    request: [{ name: 'Run the handler', match: '^/', behavior: { runFunction: 'handler' } }]\n  }\n}",
      fileName: 'azion.config.js',
      fileIcon: 'ai-cor ai-js'
    },
    {
      label: 'main.js',
      value: 'handler',
      language: 'javascript',
      code: "export default {\n  async fetch(request) {\n    const url = new URL(request.url)\n\n    if (url.pathname === '/api/status') {\n      return Response.json({ region: 'edge', ok: true })\n    }\n\n    return fetch(request)\n  }\n}",
      fileName: 'main.js',
      fileIcon: 'ai-cor ai-js'
    },
    {
      label: 'package.json',
      value: 'package',
      language: 'json',
      code: '{\n  "name": "acme-store",\n  "type": "module",\n  "scripts": {\n    "deploy": "azion deploy"\n  }\n}',
      fileName: 'package.json',
      fileIcon: 'ai ai-json'
    }
  ]
</script>

<template>
  <CodeSplit
    anchor="handler"
    title="Answer the request before it reaches the origin"
    description="A function returns the response itself when a route needs logic, and passes everything else through."
    :code-tabs="codeTabs"
    default-file="handler"
    copy-aria-label="Copy the handler sample"
    :primary-action="{ label: 'Docs', href: '/docs/functions', trailing: true }"
  />
</template>
