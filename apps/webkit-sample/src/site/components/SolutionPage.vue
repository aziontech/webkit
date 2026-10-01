<script setup>
  import BandStack from '@aziontech/webkit/band-stack'
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid'
  import ColumnNavigation from '@aziontech/webkit/column-navigation'
  import Faq from '@aziontech/webkit/faq'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
  import NetworkMap from '@aziontech/webkit/network-map'
  import QuoteTabs from '@aziontech/webkit/quote-tabs'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import Ticker from '@aziontech/webkit/ticker'
  import Topic from '@aziontech/webkit/topic'
  import { DEPLOY_TEMPLATES } from '@shared/lib/deploy-templates.js'
  import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'
  import { useRouter } from 'vue-router'

  import { CERTIFICATIONS } from '../data/certifications.js'
  import { PLATFORM_PRIMITIVES } from '../data/platform-primitives.js'
  import { NETWORK_TAGS, NETWORK_TOPICS } from '../data/solutions.js'

  defineProps({
    /** The opening band, centered on the dot field: eyebrow, title, description and the client marks the carousel runs; without marks the carousel runs the site's default strip. */
    hero: { type: Object, required: true },
    /** The capability cards the grid under the hero holds, each an icon, a title and a description. */
    capabilities: { type: Array, required: true },
    /** The use-case band: its eyebrow, its title and the stacked bands under it, each with an optional eyebrow; a band with an href links there with its own action label, one without links to the docs. Omitted, the page has no use-case band. */
    useCases: { type: Object, default: null },
    /** The ticker under the templates band: its label and the marks it runs. Omitted, the page has no templates band. */
    stack: { type: Object, default: null },
    /** Description of the templates band. */
    templatesDescription: {
      type: String,
      default:
        'Build faster with pre-built applications and starter kits for common use cases. Deploy complete projects in seconds with popular frameworks.'
    },
    /** The reference-architecture band: its title, the registered Illustration it shows with that art's alt text, and the docs page it links to. */
    architecture: { type: Object, default: null },
    /** The client cards, the page's own quote first. Omitted, the page has no quote band. */
    quotes: { type: Array, default: null },
    /** The guides band: its title, optionally an eyebrow (Go Deeper when omitted) and a description, beside a two-column grid of linked resource cards, each a title, a description and an href; four fill the grid. */
    resources: { type: Object, default: null },
    /** Show the compliance band with the certification badges. */
    compliance: { type: Boolean, default: false },
    /** Eyebrow of the primitives band. */
    primitivesEyebrow: { type: String, default: 'Complete, not complex' },
    /** Title of the primitives band. */
    primitivesTitle: { type: String, required: true },
    /** Show the distributed-infrastructure band. */
    network: { type: Boolean, default: true },
    /** The benefits the network band closes on, each an icon, a title and a description. */
    networkTopics: { type: Array, default: () => NETWORK_TOPICS },
    /** The questions and answers the FAQ band holds; an answer may continue into a link and the text after it. Omitted, the page has no FAQ band. */
    faq: { type: Array, default: null },
    /** The closing band: eyebrow, title, its muted second line and the description. */
    cta: { type: Object, required: true }
  })

  const isExternal = (href) => /^https?:/.test(href)

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  const openDestination = (event, item) => {
    if (!item.href?.startsWith('/')) return
    event.preventDefault()
    router.push(item.href)
  }

  const routeHref = (to) => router.resolve(to).href
  const openRoute = (event, to) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return
    }
    event.preventDefault()
    router.push(to)
  }
  const followTemplate = (event, to) => {
    if (event.target.closest('a, button') || globalThis.getSelection()?.toString()) return
    if (event.metaKey || event.ctrlKey) {
      globalThis.open(routeHref(to), '_blank', 'noopener')
      return
    }
    router.push(to)
  }

  const SUCCESS_CASES = '/site/success-cases'
  const GUIDES = 'https://www.azion.com/en/documentation/products/guides/'
  const DOCS = '/site/docs'
  const COMPLIANCE = '/site/compliance'
</script>

<template>
  <Hero
    kind="screen"
    align="center"
    max-width="site"
    texture="dots"
    texture-fade="top"
    carousel
    carousel-label="Trusted by mission-critical workloads"
    :carousel-marks="hero.carouselMarks ?? CLIENT_STRIP"
    offset="3.5rem"
  >
    <Hero.Title
      centered
      max-width="xl"
      :eyebrow="hero.eyebrow"
      eyebrow-prefix="//"
      :title="hero.title"
      :description="hero.description"
    >
      <template #actions>
        <Button
          label="Start Free"
          kind="secondary"
          size="large"
          @click="goSignup"
        />
        <Button
          label="Talk to a Specialist"
          kind="outlined"
          size="large"
          href="#contact"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
        />
      </template>
    </Hero.Title>
  </Hero>

  <SectionContainer max-width="site">
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          flush
          kind="frame"
          :columns="3"
        >
          <CardGrid.Cell
            v-for="capability in capabilities"
            :key="capability.title"
            kind="canvas"
          >
            <Topic
              :heading-level="2"
              :icon="capability.icon"
              :title="capability.title"
              :description="capability.description"
            />
          </CardGrid.Cell>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <template v-if="useCases">
      <SectionGap hatch />

      <SectionModule
        :divided="false"
        :padded="false"
      >
        <template #header>
          <SectionTitle
            size="large"
            :eyebrow="useCases.eyebrow ?? 'Use Cases'"
            :title="useCases.title"
          />
        </template>

        <BandStack
          sticky
          flush
        >
          <MediaSplit
            v-for="useCase in useCases.items"
            :key="useCase.title"
            :media-href="useCase.href ?? DOCS"
            kind="media-end"
            :divided="true"
            :heading-level="3"
            align="center"
            size="large"
            media-fill="canvas"
            texture="pixelate"
            texture-size="small"
            texture-fade="top"
            :eyebrow="useCase.eyebrow"
            :title="useCase.title"
            :description="useCase.description"
          >
            <template #media>
              <Illustration
                :name="useCase.illustration"
                :aria-label="useCase.alt"
              />
            </template>
            <template #actions>
              <Button
                v-if="useCase.href"
                key="destination"
                :label="useCase.action"
                kind="outlined"
                size="medium"
                :href="useCase.href"
                icon="pi pi-chevron-right"
                icon-position="trailing"
                animated
              />
              <Button
                v-else
                key="docs"
                label="Read Docs"
                kind="outlined"
                size="medium"
                :href="DOCS"
                icon="pi pi-chevron-right"
                icon-position="trailing"
                animated
              >
                <template #prefix>
                  <i
                    class="pi pi-book shrink-0 leading-none"
                    aria-hidden="true"
                  />
                </template>
              </Button>
            </template>
          </MediaSplit>
        </BandStack>
      </SectionModule>
    </template>

    <template v-if="stack">
      <SectionGap hatch />

      <SectionModule
        :divided="false"
        :padded="false"
      >
        <MediaSplit
          framed
          :heading-level="2"
          align="center"
          eyebrow="Your Stack, Your Way"
          size="large"
          texture="none"
          title="Quick Start with Templates"
          :description="templatesDescription"
        >
          <template #media>
            <div class="relative min-h-[36rem] w-full self-stretch lg:min-h-[44rem]">
              <ScrollArea
                aria-label="Templates you can deploy"
                class="absolute inset-0 mask-t-from-[calc(100%_-_2rem)] mask-b-from-[calc(100%_-_6rem)]"
              >
                <CardGrid
                  flush
                  kind="frame"
                  :columns="2"
                >
                  <CardGrid.Cell
                    v-for="template in DEPLOY_TEMPLATES"
                    :key="template.slug"
                    kind="none"
                    :padded="false"
                  >
                    <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -- the Deploy now link inside is the keyboard path; the card click only widens the pointer target -->
                    <div
                      class="group/template flex h-full min-w-0 cursor-pointer flex-col gap-(--spacing-md) bg-(--bg-surface) p-(--spacing-xl)"
                      @click="followTemplate($event, template.to)"
                    >
                      <span
                        class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                      >
                        <i
                          :class="[template.icon, template.markClass]"
                          aria-hidden="true"
                          class="text-[1.25rem] leading-none text-(--text-default)"
                        />
                      </span>
                      <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                        <span class="text-body-md text-(--text-default)">{{ template.title }}</span>
                        <span class="text-pretty text-body-sm text-(--text-muted)">
                          {{ template.description }}
                        </span>
                      </div>
                      <Button
                        label="Deploy now"
                        kind="outlined"
                        size="medium"
                        icon="pi pi-chevron-right"
                        icon-position="trailing"
                        animated
                        :href="routeHref(template.to)"
                        class="mt-auto self-start group-hover/template:before:opacity-100 group-active/template:after:opacity-100 group-hover/template:[&_[data-animated]]:translate-x-0.5"
                        @click="openRoute($event, template.to)"
                      >
                        <template #prefix>
                          <i
                            class="ai ai-azion text-(--primary)"
                            aria-hidden="true"
                          />
                        </template>
                      </Button>
                    </div>
                  </CardGrid.Cell>
                </CardGrid>
                <div
                  aria-hidden="true"
                  class="h-16"
                />
              </ScrollArea>
            </div>
          </template>
          <template #actions>
            <Button
              label="Deploy now"
              kind="secondary"
              size="large"
              href="https://www.azion.com/en/documentation/products/guides/#azion-templates"
              target="_blank"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
            />
          </template>
        </MediaSplit>

        <FrameBox
          flush
          borders="y"
          marks="all"
        >
          <SectionModule :divided="false">
            <Ticker
              size="small"
              :label="stack.label"
              :marks="stack.marks"
            />
          </SectionModule>
        </FrameBox>
      </SectionModule>
    </template>

    <template v-if="architecture">
      <SectionGap hatch />

      <SectionModule
        :divided="false"
        :padded="false"
      >
        <MediaSplit
          framed
          :media-href="architecture.href"
          align="center"
          size="large"
          media-fill="canvas"
          texture="pixelate"
          texture-size="small"
          texture-fade="top"
          :title="architecture.title"
        >
          <template #media>
            <Illustration
              :name="architecture.illustration"
              :aria-label="architecture.alt"
            />
          </template>
          <template #actions>
            <Button
              label="Docs"
              kind="outlined"
              size="medium"
              :href="architecture.href"
              target="_blank"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
            />
          </template>
        </MediaSplit>
      </SectionModule>
    </template>

    <template v-if="quotes">
      <SectionGap hatch />

      <SectionModule
        :divided="false"
        :padded="false"
      >
        <FrameBox
          flush
          borders="y"
          marks="all"
        >
          <QuoteTabs
            aria-label="Client stories"
            :items="quotes"
          >
            <template #actions>
              <Button
                label="See success stories"
                kind="secondary"
                size="large"
                :href="routeHref(SUCCESS_CASES)"
                icon="pi pi-chevron-right"
                icon-position="trailing"
                animated
                @click="openRoute($event, SUCCESS_CASES)"
              />
            </template>
          </QuoteTabs>
        </FrameBox>
      </SectionModule>
    </template>

    <template v-if="resources">
      <SectionGap hatch />

      <SectionModule
        :divided="false"
        :padded="false"
      >
        <MediaSplit
          framed
          :heading-level="2"
          align="center"
          size="large"
          texture="none"
          :eyebrow="resources.eyebrow ?? 'Go Deeper'"
          :title="resources.title"
          :description="resources.description"
        >
          <template #media>
            <CardGrid
              flush
              kind="frame"
              :columns="2"
              class="w-full self-stretch"
            >
              <CardGrid.Cell
                v-for="card in resources.items"
                :key="card.title"
                kind="surface"
                :padded="false"
              >
                <Topic
                  :heading-level="3"
                  :title="card.title"
                  :description="card.description"
                  :href="card.href"
                  :target="isExternal(card.href) ? '_blank' : undefined"
                  :rel="isExternal(card.href) ? 'noopener noreferrer' : undefined"
                  class="h-full p-(--spacing-xl)"
                />
              </CardGrid.Cell>
            </CardGrid>
          </template>
          <template #actions>
            <Button
              label="See all guides"
              kind="secondary"
              size="large"
              :href="GUIDES"
              target="_blank"
              icon="pi pi-chevron-right"
              icon-position="trailing"
              animated
            />
          </template>
        </MediaSplit>
      </SectionModule>
    </template>

    <template v-if="compliance">
      <SectionGap hatch />

      <SectionModule
        :divided="false"
        :padded="false"
      >
        <MediaSplit
          framed
          align="center"
          texture="none"
          size="large"
          eyebrow="Scale with Confidence"
          title="Security and Compliance for High-Stakes Digital Experiences"
          description="We're committed to making sure our customers and global partners can meet a wide range of compliance requirements."
        >
          <template #media>
            <CardGrid
              flush
              kind="frame"
              :columns="3"
              :mobile-columns="2"
              role="list"
              aria-label="Compliance certifications"
              class="w-full self-stretch"
            >
              <CardGrid.Cell
                v-for="certification in CERTIFICATIONS"
                :key="certification.label"
                kind="surface"
                :padded="false"
                role="listitem"
              >
                <div
                  class="flex h-full flex-col items-center justify-center gap-(--spacing-lg) px-(--spacing-sm) py-(--spacing-xl)"
                >
                  <img
                    :src="certification.badge"
                    :alt="certification.alt"
                    loading="lazy"
                    decoding="async"
                    class="h-16 w-24 object-contain"
                  />
                  <span
                    class="inline-flex h-7 items-center gap-(--spacing-xs) whitespace-nowrap rounded-full border border-(--border-muted) bg-(--bg-surface-raised) pr-(--spacing-sm) pl-(--spacing-xxs) text-overline-sm text-(--text-default)"
                  >
                    <span
                      aria-hidden="true"
                      class="flex size-5 shrink-0 items-center justify-center rounded-full bg-(--success-contrast) text-tag-sm text-(--success)"
                    >
                      <i class="pi pi-check text-[length:inherit] leading-none" />
                    </span>
                    {{ certification.label }}
                  </span>
                </div>
              </CardGrid.Cell>

              <CardGrid.Cell
                kind="surface"
                :padded="false"
                role="listitem"
              >
                <RouterLink
                  :to="COMPLIANCE"
                  class="group/more flex h-full items-center justify-center gap-(--spacing-xs) px-(--spacing-sm) py-(--spacing-xl) text-overline-md uppercase text-(--text-muted) transition-colors duration-moderate-02 ease-expressive-entrance hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:bg-(--bg-hover) focus-visible:text-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset focus-visible:outline-none motion-reduce:transition-none"
                >
                  See more
                  <i
                    aria-hidden="true"
                    class="pi pi-chevron-right shrink-0 text-[length:inherit] leading-none transition-[translate] duration-moderate-02 ease-expressive-entrance group-hover/more:translate-x-0.5 motion-reduce:transition-none"
                  />
                </RouterLink>
              </CardGrid.Cell>
            </CardGrid>
          </template>
        </MediaSplit>
      </SectionModule>
    </template>

    <SectionGap hatch />

    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          :eyebrow="primitivesEyebrow"
          :title="primitivesTitle"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="all"
      >
        <ColumnNavigation
          :columns="4"
          :mobile-columns="1"
          :aria-label="primitivesTitle"
        >
          <ColumnNavigation.Column
            v-for="group in PLATFORM_PRIMITIVES"
            :key="group.label"
            :title="group.label"
          >
            <ColumnNavigation.Item
              v-for="primitive in group.items"
              :key="primitive.title"
              :icon="primitive.icon"
              :title="primitive.title"
              :description="primitive.description"
              :href="primitive.href"
              @click="openDestination"
            />
          </ColumnNavigation.Column>
        </ColumnNavigation>
      </FrameBox>
    </SectionModule>

    <template v-if="network">
      <SectionGap hatch />

      <SectionModule
        :divided="false"
        :padded="false"
      >
        <FrameBox
          flush
          borders="y"
          marks="all"
          class="relative overflow-hidden"
        >
          <NetworkMap
            region="world"
            position="top-right"
            animated
            fade="left"
            :opacity="0.3"
            density="medium"
            :scale="1.3"
            :offset-x="0.4"
            :offset-y="-0.2"
            class="max-md:hidden"
          />

          <div class="relative flex h-full flex-col">
            <div
              class="relative flex min-h-[clamp(340px,52vh,620px)] flex-col justify-start gap-(--spacing-xl) p-(--spacing-xxl) lg:justify-between"
            >
              <NetworkMap
                region="world"
                position="bottom"
                animated
                fade="none"
                :opacity="0.3"
                density="medium"
                :scale="2"
                :offset-x="0.19"
                :offset-y="0.085"
                class="md:hidden"
              />

              <SectionTitle
                :framed="false"
                kind="left"
                size="medium"
                title="Distributed infrastructure that stays up when others go down"
                class="relative [&_h2]:max-w-[14em]"
              />

              <ul
                class="relative m-0 flex max-w-(--container-md) list-none flex-wrap gap-(--spacing-xs) p-0"
              >
                <li
                  v-for="claim in NETWORK_TAGS"
                  :key="claim"
                  class="inline-flex h-6 items-center rounded-(--shape-elements) border border-(--primary) bg-[color-mix(in_srgb,var(--primary)_10%,var(--bg-canvas))] px-(--spacing-xs) text-label-sm text-(--text-default)"
                >
                  {{ claim }}
                </li>
              </ul>
            </div>

            <CardGrid
              flush
              kind="frame"
              :columns="3"
              class="border-t border-(--border-default)"
            >
              <CardGrid.Cell
                v-for="topic in networkTopics"
                :key="topic.title"
                kind="canvas"
              >
                <Topic
                  :heading-level="3"
                  :icon="topic.icon"
                  :title="topic.title"
                  :description="topic.description"
                />
              </CardGrid.Cell>
            </CardGrid>
          </div>
        </FrameBox>
      </SectionModule>
    </template>

    <template v-if="faq">
      <SectionGap hatch />

      <SectionModule
        id="faq"
        :divided="false"
        :padded="false"
      >
        <Faq
          framed
          title="Frequently Asked Questions"
          :items="faq"
        >
          <template #answer="{ item }">
            {{ item.answer
            }}<a
              v-if="item.link"
              :href="item.link.href"
              target="_blank"
              rel="noopener"
              class="text-(--text-default) underline underline-offset-2 transition-colors hover:text-(--primary) motion-reduce:transition-none"
              >{{ item.link.label }}</a
            >{{ item.answerAfter }}
          </template>
        </Faq>
      </SectionModule>
    </template>

    <SectionGap hatch />

    <SectionModule
      id="contact"
      :divided="false"
      :padded="false"
      class="scroll-mt-(--spacing-xxl)"
    >
      <CallToAction
        framed
        kind="split"
        :eyebrow="cta.eyebrow"
        :title="cta.title"
        :title-muted="cta.titleMuted"
        :description="cta.description"
      >
        <template #actions>
          <Button
            label="Start Free"
            kind="secondary"
            size="large"
            @click="goSignup"
          />
        </template>
        <template #aside>
          <Button
            label="Talk to our team"
            kind="outlined"
            size="large"
            href="#"
            icon="pi pi-chevron-right"
            icon-position="trailing"
            animated
          />
        </template>
      </CallToAction>
    </SectionModule>
    <FrameBox
      borders="none"
      marks="all"
      data-hatch="true"
      class="h-[calc(var(--spacing-xxl)*2)]"
    >
      <TextureMaterial kind="lines" />
    </FrameBox>
  </SectionContainer>
</template>
