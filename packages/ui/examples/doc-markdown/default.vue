<script setup lang="ts">
  import DocMarkdown from '@aziontech/webkit/doc-markdown'
  import DocProse from '@aziontech/webkit/doc-prose'

  const source = [
    '---',
    'title: First deploy',
    'description: Deploy a template and see it served from the edge.',
    '---',
    '',
    '## Before you start',
    '',
    'You need an Acme account. Log in with `acme login`, then read the [CLI reference](https://example.com/docs/cli).',
    '',
    '- A project folder with a `package.json`',
    '- Node.js 22 or later',
    '',
    '<Note>A first deploy takes about a minute.</Note>',
    '',
    '## Deploy with the CLI',
    '',
    '<Steps>',
    '  <Step title="Install the CLI">',
    '    <CodeGroup>',
    '    ```bash npm',
    '    npm install -g acme-cli',
    '    ```',
    '    ```bash pnpm',
    '    pnpm add -g acme-cli',
    '    ```',
    '    </CodeGroup>',
    '  </Step>',
    '  <Step title="Deploy">Run `acme deploy` from the project folder.</Step>',
    '</Steps>',
    '',
    '## Limits',
    '',
    '| Plan | Builds per day |',
    '| :--- | ---: |',
    '| Free | 100 |',
    '| Pro | 1,000 |',
    '',
    '## Next steps',
    '',
    '<CardGroup cols={2}>',
    '  <Card title="Domains" icon="az az-globe" href="/docs/domains">Point your own domain at the deploy.</Card>',
    '  <Card title="Cache" icon="az az-bolt" href="/docs/cache">Cache static assets at the edge.</Card>',
    '</CardGroup>'
  ].join('\n')
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
