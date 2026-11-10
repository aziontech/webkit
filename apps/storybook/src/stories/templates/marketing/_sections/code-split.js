import { FUNCTION_SAMPLE_TABS } from '../../../_shared/code-samples'

const CACHE_SETTINGS = `{
  "cache_settings": {
    "name": "api-cache",
    "browser_cache_settings": {
      "ttl": 60
    },
    "cdn_cache_settings": {
      "ttl": 30
    },
    "cache_key": {
      "query_string": "whitelist",
      "query_string_fields": ["user_id", "category"],
      "cookie": "whitelist",
      "cookie_names": ["session_id", "region"]
    },
    "methods": ["GET", "POST", "OPTIONS"],
    "stale_cache": true
  }
}`

const GATEWAY_CLIENT = `import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: process.env.AI_GATEWAY_URL,
  apiKey: process.env.AI_GATEWAY_KEY
});

const reply = await client.chat.completions.create({
  model: 'general',
  messages: [{ role: 'user', content: 'Summarize this ticket.' }]
});

console.log(reply.choices[0].message.content);`

const COPILOT_CONFIG = `[
  {
    "name": "Azion AI Gateway",
    "vendor": "customendpoint",
    "apiKey": "\${input:chat.lm.secret.azion}",
    "apiType": "chat-completions",
    "models": [
      {
        "id": "general",
        "name": "general",
        "url": "https://YOUR_GATEWAY_DOMAIN/v1",
        "toolCalling": true,
        "streaming": true,
        "maxInputTokens": 128000,
        "maxOutputTokens": 16000
      }
    ]
  }
]`

export const SITE_SECTION = {
  _id: 'code-split',
  props: {
    title: 'From hello world to full-stack applications',
    description:
      'Run application logic next to what a full-stack product needs: SQL Database, KV Store, Object Storage and AI Inference, through Azion libraries.',
    codeTabs: FUNCTION_SAMPLE_TABS,
    copyAriaLabel: 'Copy the code sample',
    primaryAction: {
      label: 'Explore Azion Lib',
      href: 'https://www.azion.com/en/documentation/products/azion-lib/overview/',
      trailing: true
    },
    secondaryAction: {
      label: 'See GitHub',
      href: 'https://github.com/aziontech',
      icon: 'pi pi-github',
      target: '_blank'
    }
  }
}

export const ACCELERATOR_SECTION = {
  _id: 'code-split',
  props: {
    title: 'From basic caching to advanced acceleration',
    description:
      'Application Accelerator extends Cache with protocol optimizations and advanced cache rules for dynamic content.',
    codeTabs: [
      {
        label: 'cache-settings.json',
        value: 'cache-settings',
        language: 'json',
        code: CACHE_SETTINGS,
        fileName: 'cache-settings.json',
        fileIcon: 'ai ai-json'
      }
    ],
    copyAriaLabel: 'Copy the cache settings sample',
    primaryAction: {
      label: 'Learn more',
      href: 'https://www.azion.com/en/documentation/products/build/applications/application-accelerator/',
      trailing: true
    }
  }
}

export const AGENTS_SECTION = {
  _id: 'code-split',
  props: {
    title: 'The shortest path to a production AI gateway',
    description:
      'Keep the OpenAI SDK you already use. Point it at your gateway and send a model alias. The gateway handles keys, routing, fallback, and logs.',
    codeTabs: [
      {
        label: 'OpenAI SDK',
        value: 'openai-sdk',
        language: 'ts',
        code: GATEWAY_CLIENT,
        fileName: 'client.ts',
        fileIcon: 'pi pi-code',
        icon: 'ai-cor ai-open'
      },
      {
        label: 'GitHub Copilot',
        value: 'github-copilot',
        language: 'json',
        code: COPILOT_CONFIG,
        fileName: 'chatLanguageModels.json',
        fileIcon: 'ai ai-json',
        icon: 'ai-cor ai-microsoft-copilot'
      }
    ],
    copyAriaLabel: 'Copy the gateway client sample',
    primaryAction: { label: 'Read the guide', href: '/docs', trailing: true }
  }
}
