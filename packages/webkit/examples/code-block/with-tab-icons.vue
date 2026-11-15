<script setup>
  import codexMark from '@aziontech/webkit/assets/codex-symbol-mono.svg'
  import openaiMark from '@aziontech/webkit/assets/openai-symbol-mono.svg'
  import opencodeMark from '@aziontech/webkit/assets/opencode-symbol-mono.svg'
  import CodeBlock from '@aziontech/webkit/code-block'

  const agentTabs = [
    {
      label: 'OpenAI SDK',
      value: 'openai-sdk',
      language: 'ts',
      fileName: 'client.ts',
      code: `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: process.env.AI_GATEWAY_URL,
  apiKey: process.env.AI_GATEWAY_KEY
});

const reply = await client.chat.completions.create({
  model: 'general',
  messages: [{ role: 'user', content: 'Summarize this ticket.' }]
});`
    },
    {
      label: 'Codex',
      value: 'codex',
      language: 'toml',
      fileName: 'config.toml',
      code: `model = "general"
model_provider = "azion"

[model_providers.azion]
name = "Azion AI Gateway"
base_url = "https://YOUR_GATEWAY_DOMAIN/v1"
env_key = "AI_GATEWAY_KEY"
wire_api = "chat"`
    },
    {
      label: 'OpenCode',
      value: 'opencode',
      language: 'json',
      fileName: 'opencode.json',
      code: `{
  "$schema": "https://opencode.ai/config.json",
  "model": "azion/general",
  "provider": {
    "azion": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Azion AI Gateway",
      "options": {
        "baseURL": "{env:AI_GATEWAY_URL}",
        "apiKey": "{env:AI_GATEWAY_KEY}"
      }
    }
  }
}`
    }
  ]

  const marks = {
    'openai-sdk': openaiMark,
    codex: codexMark,
    opencode: opencodeMark
  }

  const markStyle = (tab) => ({
    maskImage: `url("${marks[tab.value]}")`,
    maskSize: 'contain',
    maskRepeat: 'no-repeat',
    maskPosition: 'center'
  })
</script>

<template>
  <div class="max-w-[692px]">
    <CodeBlock
      :tabs="agentTabs"
      show-line-numbers
    >
      <template #tab-icon="{ tab }">
        <span
          aria-hidden="true"
          class="block size-3.5 bg-current"
          :style="markStyle(tab)"
        />
      </template>
    </CodeBlock>
  </div>
</template>
