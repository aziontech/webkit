import Button from '@aziontech/webkit/button'
import CodeBlock from '@aziontech/webkit/code-block'
import FrameBox from '@aziontech/webkit/frame-box'
import MediaSplit from '@aziontech/webkit/media-split'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'
import TextureMaterial from '@aziontech/webkit/texture-material'

import { FUNCTION_SAMPLE_TABS } from '../../_shared/code-samples'
import { COLUMN_IMPORTS, declareTabs, each, inColumn } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const components = {
  Button,
  CodeBlock,
  FrameBox,
  MediaSplit,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle,
  TextureMaterial
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

const AZION_CONFIG = `export default {
  build: { preset: 'vue' },
  rules: {
    request: [
      {
        name: 'Deliver Static Assets',
        match: '.(css|js|svg|png|webp|woff2)$',
        behavior: {
          setOrigin: { name: 'origin-storage-default' },
          deliver: true
        }
      },
      {
        name: 'Redirect to index.html',
        match: '^\\/',
        behavior: { rewrite: '/index.html' }
      }
    ]
  }
}`

const HANDLER = `export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname === '/api/status') {
      return Response.json({ region: 'edge', ok: true })
    }

    return fetch(request)
  }
}`

const STORAGE = `export default {
  async fetch(request) {
    const url = new URL(request.url)
    const asset = await fetch(new URL(url.pathname, 'file://assets-prod/'))

    return new Response(asset.body, {
      headers: { 'cache-control': 'public, max-age=86400' }
    })
  }
}`

const WORKLOAD_TABS = [
  {
    label: 'azion.config.js',
    value: 'config',
    language: 'javascript',
    code: AZION_CONFIG,
    fileName: 'azion.config.js',
    fileIcon: 'pi pi-code'
  },
  {
    label: 'main.js',
    value: 'handler',
    language: 'javascript',
    code: HANDLER,
    fileName: 'main.js',
    fileIcon: 'pi pi-code'
  },
  {
    label: 'assets.js',
    value: 'storage',
    language: 'javascript',
    code: STORAGE,
    fileName: 'assets.js',
    fileIcon: 'pi pi-code'
  }
]

const RECIPES = [
  {
    title: 'Declare the workload in code',
    description:
      'The hostname, the build preset and the routing live in the repository, so shipping a change is a commit rather than a console session.'
  },
  {
    title: 'Answer the request yourself',
    description:
      'Return a response from the handler when a route needs logic — an auth check, a redirect, a shaped payload — instead of sending it to the origin.'
  },
  {
    title: 'Serve objects from storage',
    description:
      'Bind a bucket to the workload and let it answer with the object directly, with no server in front of it and no egress charge behind it.'
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
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  '',
  declareTabs('codeTabs', CACHE_TABS)
]

const RECIPES_IMPORTS = [
  "import CodeBlock from '@aziontech/webkit/code-block'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'",
  "import TextureMaterial from '@aziontech/webkit/texture-material'",
  '',
  declareTabs('codeTabs', WORKLOAD_TABS)
]

const FULL_STACK_TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <MediaSplit
    framed
    media-padded
    texture="pixelate"
    texture-size="small"
    texture-fade="top"
    title="From hello world to full-stack applications"
    description="Run application logic with the resources a full-stack product needs: relational data, low-latency state, object storage, and AI responses through Azion libraries."
  >
    <template #media>
      <div
        class="-mb-(--spacing-xl) h-[20rem] w-full min-w-0 overflow-hidden rounded-t-(--shape-elements) shadow-(--shadow-sm)"
      >
        <CodeBlock
          :tabs="codeTabs"
          default-value="file-upload"
          show-line-numbers
          animate-lines
          copy-aria-label="Copy the file upload sample"
        />
      </div>
    </template>
    <template #actions>
      <Button
        label="Docs"
        kind="secondary"
        size="medium"
        href="/docs"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
      />
      <Button
        label="See GitHub"
        kind="outlined"
        size="medium"
        href="https://github.com/aziontech"
        target="_blank"
        icon="pi pi-github"
      />
    </template>
  </MediaSplit>
</SectionModule>`)

const ACCELERATOR_TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <FrameBox flush borders="y" marks="bottom">
    <div class="grid lg:grid-cols-[4fr_5fr]">
      <div class="flex flex-col justify-between gap-(--spacing-xxl) p-(--spacing-xl)">
        <div class="flex flex-col gap-(--spacing-lg)">
          <h2 class="m-0 text-balance text-heading-md text-(--text-default)">
            From basic caching to advanced acceleration
          </h2>
          <p class="m-0 text-pretty text-body-md text-(--text-muted)">
            Application Accelerator extends Cache with protocol optimizations and advanced cache
            rules for dynamic content.
          </p>
        </div>

        <div>
          <Button
            label="Learn More"
            kind="text"
            size="large"
            href="/docs"
            icon="pi pi-chevron-right"
            icon-position="trailing"
            animated
          />
        </div>
      </div>

      <div
        class="min-w-0 border-t border-(--border-default) bg-(--bg-surface) p-(--spacing-xl) lg:border-l lg:border-t-0"
      >
        <div class="min-w-0 rounded-(--shape-elements) shadow-(--shadow-sm)">
          <CodeBlock
            :tabs="codeTabs"
            default-value="cache-settings"
            show-line-numbers
            animate-lines
            copy-aria-label="Copy the cache settings sample"
          />
        </div>
      </div>
    </div>
  </FrameBox>
</SectionModule>`)

const RECIPES_TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle
      kind="horizontal"
      title="From a hostname to a full stack, on one platform"
      description="Go past hello world: storage, a database, a firewall and a cache policy all bind to the same workload — each one a binding, not another deployment to operate."
    />
  </template>

  <FrameBox flush borders="y" marks="bottom">
    <div class="grid lg:grid-cols-2">
      <div class="relative min-w-0 overflow-hidden p-(--spacing-xl)">
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 opacity-65 [--texture-pool-a:20%_106%] [--texture-pool-b:80%_102%] mask-[linear-gradient(to_top,black_0,black_16%,transparent_80%)]"
        >
          <TextureMaterial kind="pixelate" />
        </div>

        <div class="relative z-10 min-w-0 rounded-(--shape-elements) shadow-(--shadow-sm)">
          <CodeBlock
            :tabs="codeTabs"
            default-value="config"
            show-line-numbers
            animate-lines
            copy-aria-label="Copy the workload sample"
          />
        </div>
      </div>

      <ul
        class="m-0 flex list-none flex-col gap-(--spacing-xl) border-t border-(--border-default) p-(--spacing-xl) lg:border-t-0 lg:border-l"
      >
${each(
  RECIPES,
  (recipe) => `<li class="flex flex-col gap-(--spacing-sm)">
  <h3 class="m-0 text-balance text-heading-md text-(--text-default)">
    ${recipe.title}
  </h3>
  <p class="m-0 text-pretty text-body-md text-(--text-muted)">
    ${recipe.description}
  </p>
</li>`,
  4
)}
      </ul>
    </div>
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Media/CodeSplit',
  excludeStories: ['SITE_SECTION', 'SITE_SECTION_ACCELERATOR', 'SITE_SECTION_RECIPES'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => ({ codeTabs: FUNCTION_SAMPLE_TABS }),
    template: FULL_STACK_TEMPLATE
  }),
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
      'Run application logic with the resources a full-stack product needs: relational data, low-latency state, object storage, and AI responses through Azion libraries.',
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
  render: () => ({
    components,
    setup: () => ({ codeTabs: CACHE_TABS }),
    template: ACCELERATOR_TEMPLATE
  }),
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
      label: 'Learn More',
      href: 'https://www.azion.com/en/documentation/products/build/applications/application-accelerator/'
    }
  }
}

export const AcceleratorJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION_ACCELERATOR)
}

export const Recipes = {
  render: () => ({
    components,
    setup: () => ({ codeTabs: WORKLOAD_TABS }),
    template: RECIPES_TEMPLATE
  }),
  parameters: {
    docs: {
      source: { code: toSfc(RECIPES_IMPORTS, RECIPES_TEMPLATE) }
    }
  }
}

export const SITE_SECTION_RECIPES = {
  _id: 'code-split-recipes',
  props: {
    title: 'From a hostname to a full stack, on one platform',
    description:
      'Go past hello world: storage, a database, a firewall and a cache policy all bind to the same workload — each one a binding, not another deployment to operate.',
    codeTabs: WORKLOAD_TABS,
    copyAriaLabel: 'Copy the workload sample',
    recipes: RECIPES
  }
}

export const RecipesJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION_RECIPES)
}
