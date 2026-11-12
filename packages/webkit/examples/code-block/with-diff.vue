<script setup>
  import CodeBlock from '@aziontech/webkit/code-block'

  const tabs = [
    {
      label: 'Diff',
      value: 'diff',
      language: 'typescript',
      code: "export default {\n  async fetch(request: Request): Promise<Response> {\n    const { prompt } = await request.json();\n\n    const modelResponse = await Azion.AI.run(\n      'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8',\n      {\n        messages: [\n          {\n            role: 'system',\n            content: 'You are a helpful assistant.'\n          },\n          {\n            role: 'user',\n            content: prompt\n          }\n        ]\n      }\n    );\n\n    return new Response(JSON.stringify(modelResponse))\n  }\n}",
      lineChanges: [
        {
          line: 3,
          change: 'removed'
        },
        {
          line: 4,
          change: 'removed'
        },
        {
          line: 5,
          change: 'removed'
        },
        {
          line: 6,
          change: 'added'
        },
        {
          line: 7,
          change: 'added'
        },
        {
          line: 8,
          change: 'added'
        },
        {
          line: 9,
          change: 'added'
        },
        {
          line: 10,
          change: 'added'
        },
        {
          line: 11,
          change: 'added'
        }
      ]
    }
  ]
</script>

<template>
  <div class="max-w-[692px]">
    <CodeBlock
      :tabs="tabs"
      default-value="diff"
      show-line-numbers
    />
  </div>
</template>
