import Button from '@aziontech/webkit/button'
import Illustration from '@aziontech/webkit/illustration'
import MediaSplit from '@aziontech/webkit/media-split'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'

import { COLUMN_IMPORTS, inColumn, indent } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import Illustration from '@aziontech/webkit/illustration'",
  "import MediaSplit from '@aziontech/webkit/media-split'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'"
]

const components = {
  Button,
  Illustration,
  MediaSplit,
  SectionContainer,
  SectionGap,
  SectionModule
}

const TEXTURE = `texture="pixelate"
texture-size="small"
texture-fade="top"`

const band = (props, media, actions) =>
  inColumn(`<SectionModule :divided="false" :padded="false">
  <MediaSplit
    framed
${indent(props, 2)}
${indent(TEXTURE, 2)}
  >
    <template #media>
${indent(media, 3)}
    </template>
    <template #actions>
${indent(actions, 3)}
    </template>
  </MediaSplit>
</SectionModule>`)

const DOCS_BUTTON = `<Button
  label="Docs"
  kind="secondary"
  size="medium"
  href="/docs"
  icon="pi pi-chevron-right"
  icon-position="trailing"
  animated
/>`

const GITHUB_BUTTON = `<Button
  label="See GitHub"
  kind="outlined"
  size="medium"
  href="https://github.com/aziontech"
  target="_blank"
  icon="pi pi-github"
/>`

const TWO_ACTIONS = `${DOCS_BUTTON}\n${GITHUB_BUTTON}`

const ARCHITECTURE_TEMPLATE = band(
  `media-href="https://www.azion.com/en/documentation/architectures/edge-application/application-modernization/"
align="center"
size="large"
media-fill="canvas"
title="Accelerate retail application modernization with a distributed architecture"`,
  `<Illustration
  name="retail-application-modernization"
  aria-label="Retail web application modernization architecture diagram"
/>`,
  `<Button
  label="Docs"
  kind="outlined"
  size="medium"
  href="https://www.azion.com/en/documentation/architectures/edge-application/application-modernization/"
  target="_blank"
  icon="pi pi-chevron-right"
  icon-position="trailing"
  animated
/>`
)

const GUIDE_TEMPLATE = band(
  `media-href="/docs"
title="Move application delivery without disrupting releases"
description="Translate Vercel projects into Azion equivalents while keeping validation workflows predictable. Rebuild CDN behavior, redirects, rewrites, image optimization, Functions, AI integrations, storage, security rules, DNS, certificates, and observability before shifting production domains."`,
  `<Illustration
  name="build-applications"
  aria-label="Framework projects mapped through the platform to what each one serves"
/>`,
  `<Button
  label="Complete technical guide"
  kind="outlined"
  size="medium"
  href="/docs"
  icon="pi pi-chevron-right"
  icon-position="trailing"
  animated
/>`
)

const TWO_ACTIONS_TEMPLATE = band(
  `title="Serverless from the ground up: isolates, not containers"
description="A workload does not reserve a container per deployment. Azion Runtime runs your code in an isolate — a sandbox measured in kilobytes rather than gigabytes — so one location holds thousands of them and starts another the moment a request arrives."`,
  `<Illustration
  name="runtime"
  aria-label="One request reaching a workload, which starts an isolate per request"
/>`,
  TWO_ACTIONS
)

const meta = {
  title: 'Templates/Marketing/Media/MediaSplitBand',
  excludeStories: ['SITE_SECTION_ARCHITECTURE', 'SITE_SECTION_GUIDE', 'SITE_SECTION_TWO_ACTIONS'],
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

export const Architecture = {
  render: () => ({ components, template: ARCHITECTURE_TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, ARCHITECTURE_TEMPLATE) }
    }
  }
}

export const SITE_SECTION_ARCHITECTURE = {
  _id: 'media-split-band-architecture',
  props: {
    title: 'Accelerate retail application modernization with a distributed architecture',
    illustration: 'retail-application-modernization',
    illustrationLabel: 'Retail web application modernization architecture diagram',
    action: {
      label: 'Docs',
      href: 'https://www.azion.com/en/documentation/architectures/edge-application/application-modernization/'
    }
  }
}

export const ArchitectureJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION_ARCHITECTURE)
}

export const Guide = {
  render: () => ({ components, template: GUIDE_TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, GUIDE_TEMPLATE) }
    }
  }
}

export const SITE_SECTION_GUIDE = {
  _id: 'media-split-band-guide',
  props: {
    title: 'Move application delivery without disrupting releases',
    description:
      'Projects map to Applications and Functions, Blob to Object Storage, Edge Config to KV Store, and Vercel Firewall to Firewall and WAF. Rebuild redirects, rewrites, and DNS before you move domains.',
    illustration: 'build-applications',
    illustrationLabel: 'Vercel to Azion architecture mapping',
    action: {
      label: 'Complete technical guide',
      href: 'https://www.azion.com/en/documentation/products/guides/vercel-migration-guide/'
    }
  }
}

export const GuideJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION_GUIDE)
}

export const TwoActions = {
  render: () => ({ components, template: TWO_ACTIONS_TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, TWO_ACTIONS_TEMPLATE) }
    }
  }
}

export const SITE_SECTION_TWO_ACTIONS = {
  _id: 'media-split-band-two-actions',
  props: {
    title: 'Serverless from the ground up: isolates, not containers',
    description:
      'A workload does not reserve a container per deployment. Azion Runtime runs your code in an isolate — a sandbox measured in kilobytes rather than gigabytes — so one location holds thousands of them and starts another the moment a request arrives.',
    illustration: 'runtime',
    illustrationLabel: 'One request reaching a workload, which starts an isolate per request',
    primaryAction: { label: 'Docs', href: '/docs' },
    secondaryAction: { label: 'See GitHub', href: 'https://github.com/aziontech' }
  }
}

export const TwoActionsJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION_TWO_ACTIONS)
}
