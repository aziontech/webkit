# Rule: code samples in docs

A code sample in a docs page is `DocCodeGroup` (one sample, or the same thing in several languages
or tools). It renders on `CodeBlock`, so its copy control, label header and syntax colours come with
it. Two kinds of block exist, and they never mix:

- a **command** (or source) block holds only what the reader runs or pastes: the copy control
  copies exactly that;
- an **output** block holds what the command prints: muted, labelled "Output", no copy control.

## Do

- Put what a command prints in the sample's `output` field. `DocCodeGroup` draws it as a separate
  "Output" block under the command:
  `{ language: 'bash', code: 'curl -I https://<your-azion-domain>', output: 'HTTP/2 200' }`.
- For a long printout that stands alone (a deploy log), use
  `<DocCodeGroup kind="output" :samples="[{ code: log }]" />`, or say the outcome in prose
  ("A `200` status means the application is live").
- Set `language` on every sample (`bash`, `javascript`, `json`, …). The label header shows its
  readable name — Shell, JavaScript, JSON — so leave `label` empty unless the samples differ by
  tool (`npm`, `pnpm`) or you need a different title.
- A `$ ` prompt is allowed at the start of a shell line: it is drawn muted and is not copied.

## Do not

- Do not put output in a command block, as a comment or as plain lines: never
  `curl -I https://example.com\n# HTTP/2 200`, never `$ azion version\nAzion CLI 4.23.0`. The reader
  copies the comment into the terminal. The `webkit/no-output-in-command` lint warns on it.
- Do not hide the label header (`:show-label="false"`) on a docs sample: the reader scans for the
  language before reading the code.
- Do not label a sample "Example" or "Code"; label what differs, or let the language name it.
- Do not colour commands yourself: the theme's syntax tokens already draw the program
  (`azion`, `curl`) in the brand orange and flags in blue, in both themes.

## Correct

```vue
<script setup>
  import DocCodeGroup from '@aziontech/webkit/doc-code-group'
</script>

<template>
  <DocCodeGroup
    :samples="[
      { language: 'bash', code: 'curl -I https://<your-azion-domain>', output: 'HTTP/2 200' }
    ]"
  />
</template>
```
