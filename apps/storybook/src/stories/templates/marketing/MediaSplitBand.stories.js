import Button from '@aziontech/webkit/button'
import Illustration from '@aziontech/webkit/illustration'
import MediaSplit from '@aziontech/webkit/media-split'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'

import { COLUMN_IMPORTS, inColumn, indent } from '../../_shared/markup'
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

const ONE_ACTION_TEMPLATE = band(
  `media-href="/docs"
title="Move application delivery without disrupting releases"
description="Translate Vercel projects into Azion equivalents while keeping validation workflows predictable. Rebuild CDN behavior, redirects, rewrites, image optimization, Functions, AI integrations, storage, security rules, DNS, certificates, and observability before shifting production domains."`,
  `<Illustration
  name="build-applications"
  aria-label="Framework projects mapped through the platform to what each one serves"
/>`,
  `<Button
  label="See the guide"
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
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'One framed claim beside one picture of it, given a band of its own and linked through to the page that explains it. Every band grounds its media on the same texture: an animated `pixelate` field at the small size, fading out toward the top. Actions are medium buttons: one outlined button, or a secondary and an outlined one side by side. With one action the band sets `media-href` to the same destination, so the whole band is a link and hovering anywhere on it lights the button; with two the reader has to pick one, so the band sets no `media-href` and each button carries its own hover. The copy sits at the top of its cell beside the art on the surface fill. With one action it follows the Home page’s pattern: one outlined button with the animated chevron. Solution pages use it for the reference architecture, the alternative guides for their migration guide, and Workloads for its runtime architecture. Built from `SectionModule`, a `framed` `MediaSplit`, `Illustration` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const OneAction = {
  render: () => ({ components, template: ONE_ACTION_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Vercel Alternative guide’s band: title and description beside the art, with one outlined button into the full guide. The band sets `media-href` to the same destination, so the whole band is a link: hovering anywhere on it lights the button and slides its chevron, and the media shows its chevron affordance.'
      },
      source: { code: toSfc(IMPORTS, ONE_ACTION_TEMPLATE) }
    }
  }
}

export const TwoActions = {
  render: () => ({ components, template: TWO_ACTIONS_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Workloads page’s runtime band with two actions: Docs as the secondary button and See GitHub as the outlined one, both medium and each linked to its own destination, the repository opening in a new tab. The band sets no `media-href`, so it is not a link itself and hovering it lights neither button; only the button under the pointer reacts.'
      },
      source: { code: toSfc(IMPORTS, TWO_ACTIONS_TEMPLATE) }
    }
  }
}
