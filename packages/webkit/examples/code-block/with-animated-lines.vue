<script setup>
  import CodeBlock from '@aziontech/webkit/code-block'

  const tabs = [
    {
      label: 'Javascript',
      value: 'js',
      language: 'javascript',
      fileName: 'handler.js',
      code: "export default {\n  async fetch(request) {\n    const { prompt } = await request.json()\n\n    const modelResponse = await Azion.AI.run(\n      'Qwen/Qwen3-30B-A3B-Instruct-2507-FP8',\n      {\n        messages: [\n          { role: 'system', content: 'You are a helpful assistant.' },\n          { role: 'user', content: prompt }\n        ]\n      }\n    )\n\n    return new Response(JSON.stringify(modelResponse))\n  }\n}"
    }
  ]
</script>

<template>
  <div class="max-w-[692px]">
    <CodeBlock
      :tabs="tabs"
      default-value="js"
      show-line-numbers
      animate-lines
    />
  </div>
</template>
