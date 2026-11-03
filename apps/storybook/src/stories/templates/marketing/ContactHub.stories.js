import Button from '@aziontech/webkit/button'
import CardGrid from '@aziontech/webkit/card-grid'
import CardGridCell from '@aziontech/webkit/card-grid-cell'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import Topic from '@aziontech/webkit/topic'

import { editable } from '../../_shared/editable-content'
import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CardGridCell from '@aziontech/webkit/card-grid-cell'",
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import Topic from '@aziontech/webkit/topic'"
]

const components = {
  Button,
  CardGrid,
  CardGridCell,
  FrameBox,
  SectionContainer,
  SectionGap,
  SectionModule,
  Topic
}

const LANE_LABEL = 'm-0 flex items-center gap-(--spacing-xs) text-body-md text-(--text-muted)'
const LANE_COPY = 'm-0 max-w-(--container-md) text-pretty text-heading-sm text-(--text-default)'

const CONTACT_TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <FrameBox flush borders="y" marks="bottom">
    <CardGrid flush kind="frame" :columns="2">
      <CardGridCell kind="canvas">
        <div class="flex h-full flex-col gap-(--spacing-xl)">
          <div class="flex flex-col gap-(--spacing-sm)">
            <h2 class="${LANE_LABEL}">
              <i class="pi pi-briefcase shrink-0 text-(--primary)" aria-hidden="true" />
              Sales
            </h2>
            <p class="${LANE_COPY}">
              Discuss your requirements, get custom pricing, or see the platform running on your own workload.
            </p>
          </div>
          <div class="mt-auto flex flex-wrap gap-(--spacing-sm)">
            <Button
              label="Talk to sales"
              kind="secondary"
              size="large"
              href="/contact/sales"
            />
          </div>
        </div>
      </CardGridCell>
      <CardGridCell kind="canvas">
        <div class="flex h-full flex-col gap-(--spacing-xl)">
          <div class="flex flex-col gap-(--spacing-sm)">
            <h2 class="${LANE_LABEL}">
              <i class="pi pi-headphones shrink-0 text-(--primary)" aria-hidden="true" />
              Support
            </h2>
            <p class="${LANE_COPY}">
              Log in with your Azion account to open a ticket. Our engineers pick it up 24/7 on paid support plans.
            </p>
          </div>
          <div class="mt-auto flex flex-wrap gap-(--spacing-sm)">
            <Button
              label="Log in to open a ticket"
              kind="secondary"
              size="large"
              href="https://console.azion.com/login"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
            />
            <a
              href="https://status.azion.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex h-10 items-center gap-(--spacing-xs) whitespace-nowrap rounded-full border border-(--border-default) bg-(--bg-surface) px-(--spacing-md) text-button-lg text-(--text-default) no-underline transition-colors duration-150 ease-out hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
            >
              <span class="size-2 shrink-0 rounded-full bg-(--success-contrast)" aria-hidden="true" />
              System status
            </a>
          </div>
        </div>
      </CardGridCell>
    </CardGrid>
  </FrameBox>

  <FrameBox flush borders="y" marks="bottom">
    <CardGrid flush kind="frame" :columns="3">
      <CardGridCell kind="canvas">
        <Topic
          :heading-level="2"
          icon="pi pi-shield"
          title="Under a cyberattack?"
          description="Get emergency mitigation for an attack in progress, even before you become a customer."
          href="https://www.azion.com/en/lp/under-attack-mitigation/"
          target="_blank"
          rel="noopener noreferrer"
        />
      </CardGridCell>
      <CardGridCell kind="canvas">
        <Topic
          :heading-level="2"
          icon="pi pi-discord"
          title="Join the community"
          description="Ask developers and the Azion team on Discord. Open to everyone, on any plan."
          href="https://discord.com/invite/pM8ANzztuB"
          target="_blank"
          rel="noopener noreferrer"
        />
      </CardGridCell>
      <CardGridCell kind="canvas">
        <Topic
          :heading-level="2"
          icon="pi pi-book"
          title="Read the docs"
          description="Guides, API reference, and troubleshooting for every Azion product."
          href="https://www.azion.com/en/documentation/"
          target="_blank"
          rel="noopener noreferrer"
        />
      </CardGridCell>
    </CardGrid>
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Content/ContactHub',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'The contact hub under the Contact title band: Sales and Support side by side, each with its scope in one sentence and the action that actually reaches that team, over a row of self-serve channels. Contact renders it.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  ...editable(() => ({ components, template: CONTACT_TEMPLATE })),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, CONTACT_TEMPLATE) }
    }
  }
}
