<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import CodeSplit from '@aziontech/webkit/code-split'

  const codeTabs = [
    {
      label: 'OpenAI SDK',
      value: 'openai-sdk',
      language: 'ts',
      code: "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  baseURL: process.env.AI_GATEWAY_URL,\n  apiKey: process.env.AI_GATEWAY_KEY\n});\n\nconst reply = await client.chat.completions.create({\n  model: 'general',\n  messages: [{ role: 'user', content: 'Summarize this ticket.' }]\n});\n\nconsole.log(reply.choices[0].message.content);",
      fileName: 'client.ts',
      fileIcon: 'pi pi-code',
      icon: 'ai-cor ai-open'
    },
    {
      label: 'GitHub Copilot',
      value: 'github-copilot',
      language: 'json',
      code: '[\n  {\n    "name": "Azion AI Gateway",\n    "vendor": "customendpoint",\n    "apiKey": "${input:chat.lm.secret.azion}",\n    "apiType": "chat-completions",\n    "models": [\n      {\n        "id": "general",\n        "name": "general",\n        "url": "https://YOUR_GATEWAY_DOMAIN/v1",\n        "toolCalling": true,\n        "streaming": true,\n        "maxInputTokens": 128000,\n        "maxOutputTokens": 16000\n      }\n    ]\n  }\n]',
      fileName: 'chatLanguageModels.json',
      fileIcon: 'ai ai-json',
      icon: 'ai-cor ai-microsoft-copilot'
    }
  ]

  const primaryAction = {
    label: 'Read the guide',
    href: '/docs',
    trailing: true
  }
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <CodeSplit
      title="The shortest path to a production AI gateway"
      description="Keep the OpenAI SDK you already use. Point it at your gateway and send a model alias. The gateway handles keys, routing, fallback, and logs."
      :code-tabs="codeTabs"
      copy-aria-label="Copy the gateway client sample"
      :primary-action="primaryAction"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
