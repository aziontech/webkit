import Button from '@aziontech/webkit/button'
import CodeBlock from '@aziontech/webkit/code-block'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import { ref } from 'vue'

import { COLUMN_IMPORTS, declareTabs, inColumn } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const components = {
  Button,
  CodeBlock,
  FrameBox,
  SectionContainer,
  SectionGap,
  SectionModule
}

const DOCS_HREF = 'https://www.azion.com/en/documentation/'

const FEATURES = [
  { label: 'Zero configuration', icon: 'pi pi-bolt' },
  { label: 'Connect to your database', icon: 'pi pi-database' },
  { label: 'Trigger via webhook', icon: 'pi pi-share-alt' },
  { label: 'Works with Supabase Auth', icon: 'pi pi-shield' },
  { label: 'Works with Supabase Storage', icon: 'pi pi-server' }
]

const SAMPLES = [
  {
    label: 'index.js',
    value: 'config',
    language: 'javascript',
    fileName: 'index.js',
    fileIcon: 'ai ai-azion',
    code: `${'import'} { createClient } from '@supabase/supabase-js'

const supabase = createClient(Azion.env.get('SUPABASE_URL'), Azion.env.get('SUPABASE_KEY'))

export default { fetch: () => new Response('ready') }`
  },
  {
    label: 'query.js',
    value: 'database',
    language: 'javascript',
    fileName: 'query.js',
    fileIcon: 'ai ai-azion',
    code: `const { data, error } = await supabase
  .from('orders')
  .select('id, total, status')
  .eq('status', 'paid')
  .limit(20)

return Response.json(data)`
  },
  {
    label: 'webhook.js',
    value: 'webhook',
    language: 'javascript',
    fileName: 'webhook.js',
    fileIcon: 'ai ai-azion',
    code: `export default {
  async fetch(request) {
    const { type, record } = await request.json()
    if (type === 'INSERT') await notify(record)
    return new Response('ok')
  }
}`
  },
  {
    label: 'auth.js',
    value: 'auth',
    language: 'javascript',
    fileName: 'auth.js',
    fileIcon: 'ai ai-azion',
    code: `const token = request.headers.get('Authorization')?.replace('Bearer ', '')
const { data: { user } } = await supabase.auth.getUser(token)

if (!user) return new Response('Unauthorized', { status: 401 })`
  },
  {
    label: 'storage.js',
    value: 'storage',
    language: 'javascript',
    fileName: 'storage.js',
    fileIcon: 'ai ai-azion',
    code: `const { data } = await supabase.storage
  .from('avatars')
  .download('user-42.png')

return new Response(data, { headers: { 'Content-Type': 'image/png' } })`
  }
]

const IMPORTS = [
  "import { ref } from 'vue'",
  '',
  "import Button from '@aziontech/webkit/button'",
  "import CodeBlock from '@aziontech/webkit/code-block'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  '',
  'const active = ref(0)',
  '',
  declareTabs('samples', SAMPLES),
  '',
  `const features = [\n${FEATURES.map((item) => `  { label: '${item.label}', icon: '${item.icon}' }`).join(',\n')}\n]`
]

const TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <FrameBox flush borders="y" marks="bottom">
    <div class="grid gap-(--spacing-xl) p-(--spacing-xl) lg:min-h-[40rem] lg:grid-cols-2">
      <div class="flex flex-col justify-between gap-(--spacing-xl)">
        <h2 class="m-0 text-balance text-heading-lg text-(--text-muted)">
          Integrates with the
          <span class="block text-(--text-default)">Supabase ecosystem</span>
        </h2>
        <ul class="m-0 flex list-none flex-col gap-(--spacing-sm) p-0">
          <li v-for="(feature, index) in features" :key="feature.label">
            <button
              type="button"
              :aria-pressed="active === index"
              class="flex cursor-pointer items-center gap-(--spacing-sm) border-0 bg-transparent p-0 text-left text-body-lg text-(--text-muted) transition-colors duration-150 ease-out hover:text-(--text-default) aria-pressed:text-(--text-default) motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none"
              @click="active = index"
            >
              <i :class="feature.icon" aria-hidden="true" />
              {{ feature.label }}
            </button>
          </li>
        </ul>
      </div>
      <div class="flex min-w-0 flex-col gap-(--spacing-xl)">
        <p class="m-0 max-w-prose text-pretty text-body-md text-(--text-muted)">
          Access your database, auth, storage, and webhooks directly from Functions with zero configuration.
        </p>
        <div class="flex min-w-0 flex-col gap-(--spacing-md)">
          <CodeBlock
            :tabs="[samples[active]]"
            show-line-numbers
            animate-lines
            :copy-aria-label="'Copy the ' + samples[active].fileName + ' sample'"
          />
          <Button
            class="self-end"
            label="Documentation"
            kind="outlined"
            size="small"
            href="${DOCS_HREF}"
            icon="pi pi-arrow-up-right"
            icon-position="trailing"
          />
        </div>
      </div>
    </div>
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Content/IntegrationCode',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A partner or ecosystem integration told as a short list of what it gives you, with the code that proves each one beside it. The headline sits top left in two tones with the list of capabilities at the foot of the same column; the lead sits top right over the code block, with a single "Documentation" button under it. Choosing a capability swaps the sample in place, and the block animates to the new height. Built from `SectionModule`, `FrameBox`, `CodeBlock` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => ({ active: ref(0), features: FEATURES, samples: SAMPLES }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Five capabilities of a Supabase integration, from zero configuration to Storage, each with a one-file sample in the panel.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
