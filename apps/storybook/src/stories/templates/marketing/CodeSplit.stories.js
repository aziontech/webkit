import Button from '@aziontech/webkit/button'
import CodeBlock from '@aziontech/webkit/code-block'
import MediaSplit from '@aziontech/webkit/media-split'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'

import { FUNCTION_SAMPLE_TABS } from '../../_shared/code-samples'
import { editable } from '../../_shared/editable-content'
import { COLUMN_IMPORTS, declareTabs, inColumn } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const components = {
  Button,
  CodeBlock,
  MediaSplit,
  SectionContainer,
  SectionGap,
  SectionModule
}

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

const CACHE_TABS = [
  {
    label: 'cache-settings.json',
    value: 'cache-settings',
    language: 'json',
    code: CACHE_SETTINGS,
    fileName: 'cache-settings.json',
    fileIcon: 'ai ai-json'
  }
]

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

const GATEWAY_TABS = [
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
]

const FULL_STACK_IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CodeBlock from '@aziontech/webkit/code-block'",
  "import MediaSplit from '@aziontech/webkit/media-split'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  '',
  declareTabs('codeTabs', FUNCTION_SAMPLE_TABS)
]

const ACCELERATOR_IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CodeBlock from '@aziontech/webkit/code-block'",
  "import MediaSplit from '@aziontech/webkit/media-split'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  '',
  declareTabs('codeTabs', CACHE_TABS)
]

const AGENTS_IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CodeBlock from '@aziontech/webkit/code-block'",
  "import MediaSplit from '@aziontech/webkit/media-split'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  '',
  declareTabs('agentTabs', GATEWAY_TABS)
]

const FULL_STACK_TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <MediaSplit
    framed
    media-padded
    texture="pixelate"
    texture-size="small"
    texture-fade="top"
    title="From hello world to full-stack applications"
    description="Run application logic next to what a full-stack product needs: SQL Database, KV Store, Object Storage and AI Inference, through Azion libraries."
  >
    <template #media>
      <div
        class="-mb-(--spacing-xl) h-[20rem] w-full min-w-0 overflow-hidden rounded-t-(--shape-elements) border-x border-t border-(--border-default) bg-(--bg-surface) shadow-(--shadow-sm)"
      >
        <CodeBlock
          :tabs="codeTabs"
          default-value="file-upload"
          show-line-numbers
          :border="false"
          animate-lines
          copy-aria-label="Copy the file upload sample"
        />
      </div>
    </template>
    <template #actions>
      <Button
        label="Docs"
        kind="secondary"
        size="large"
        href="/docs"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
      />
      <Button
        label="See GitHub"
        kind="outlined"
        size="large"
        href="https://github.com/aziontech"
        target="_blank"
        icon="pi pi-github"
      />
    </template>
  </MediaSplit>
</SectionModule>`)

const ACCELERATOR_TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <MediaSplit
    framed
    media-padded
    texture="pixelate"
    texture-size="small"
    texture-fade="top"
    title="From basic caching to advanced acceleration"
    description="Application Accelerator extends Cache with protocol optimizations and advanced cache rules for dynamic content."
  >
    <template #media>
      <div
        class="-mb-(--spacing-xl) h-[20rem] w-full min-w-0 overflow-hidden rounded-t-(--shape-elements) border-x border-t border-(--border-default) bg-(--bg-surface) shadow-(--shadow-sm)"
      >
        <CodeBlock
          :tabs="codeTabs"
          default-value="cache-settings"
          show-line-numbers
          :border="false"
          animate-lines
          copy-aria-label="Copy the cache settings sample"
        />
      </div>
    </template>
    <template #actions>
      <Button
        label="Learn more"
        kind="secondary"
        size="large"
        href="/docs"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
      />
    </template>
  </MediaSplit>
</SectionModule>`)

const AGENTS_TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <MediaSplit
    framed
    media-padded
    texture="pixelate"
    texture-size="small"
    texture-fade="top"
    title="The shortest path to a production AI gateway"
    description="Keep the OpenAI SDK you already use. Point it at your gateway and send a model alias. The gateway handles keys, routing, fallback, and logs."
  >
    <template #media>
      <div
        class="-mb-(--spacing-xl) h-[20rem] w-full min-w-0 overflow-hidden rounded-t-(--shape-elements) border-x border-t border-(--border-default) bg-(--bg-surface) shadow-(--shadow-sm)"
      >
        <CodeBlock
          :tabs="agentTabs"
          show-line-numbers
          :border="false"
          animate-lines
          copy-aria-label="Copy the gateway client sample"
        >
          <template #tab-icon="{ tab }">
            <i
              :class="tab.icon"
              class="size-3.5!"
              aria-hidden="true"
            />
          </template>
        </CodeBlock>
      </div>
    </template>
    <template #actions>
      <Button
        label="Read the guide"
        kind="secondary"
        size="large"
        href="/docs"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
      />
    </template>
  </MediaSplit>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Solutions/CodeSplit',
  excludeStories: [
    'SITE_SECTION',
    'SITE_SECTION_ACCELERATOR',
    'SITE_SECTION_AGENTS'
  ],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  ...editable(
    () => ({
      components,
      setup: () => ({ codeTabs: FUNCTION_SAMPLE_TABS }),
      template: FULL_STACK_TEMPLATE
    }),
    { codeTabs: FUNCTION_SAMPLE_TABS }
  ),
  parameters: {
    docs: {
      source: { code: toSfc(FULL_STACK_IMPORTS, FULL_STACK_TEMPLATE) }
    }
  }
}

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
      href: 'https://www.azion.com/en/documentation/products/azion-lib/overview/'
    },
    secondaryAction: { label: 'See GitHub', href: 'https://github.com/aziontech' }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}

export const Accelerator = {
  ...editable(
    () => ({
      components,
      setup: () => ({ codeTabs: CACHE_TABS }),
      template: ACCELERATOR_TEMPLATE
    }),
    { codeTabs: CACHE_TABS }
  ),
  parameters: {
    docs: {
      source: { code: toSfc(ACCELERATOR_IMPORTS, ACCELERATOR_TEMPLATE) }
    }
  }
}

export const SITE_SECTION_ACCELERATOR = {
  _id: 'code-split-accelerator',
  props: {
    title: 'From basic caching to advanced acceleration',
    description:
      'Application Accelerator extends Cache with protocol optimizations and advanced cache rules for dynamic content.',
    codeTabs: CACHE_TABS,
    copyAriaLabel: 'Copy the code sample',
    action: {
      label: 'Learn more',
      href: 'https://www.azion.com/en/documentation/products/build/applications/application-accelerator/'
    }
  }
}

export const AcceleratorJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION_ACCELERATOR)
}

export const Agents = {
  ...editable(
    () => ({
      components,
      setup: () => ({ agentTabs: GATEWAY_TABS }),
      template: AGENTS_TEMPLATE
    }),
    { agentTabs: GATEWAY_TABS }
  ),
  parameters: {
    docs: {
      source: { code: toSfc(AGENTS_IMPORTS, AGENTS_TEMPLATE) }
    }
  }
}

export const SITE_SECTION_AGENTS = {
  _id: 'code-split-agents',
  props: {
    kind: 'agents',
    title: 'The shortest path to a production AI gateway',
    description:
      'Keep the OpenAI SDK you already use. Point it at your gateway and send a model alias. The gateway handles keys, routing, fallback, and logs.',
    agents: GATEWAY_TABS,
    copyAriaLabel: 'Copy the gateway client sample',
    actions: [{ label: 'Read the guide', href: '/docs' }]
  }
}

export const AgentsJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION_AGENTS)
}
