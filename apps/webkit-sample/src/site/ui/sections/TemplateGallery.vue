<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
  import FrameBox from '@aziontech/webkit/frame-box'
  import MediaSplit from '@aziontech/webkit/media-split'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import SectionModule from '@aziontech/webkit/section-module'
  import Ticker from '@aziontech/webkit/ticker'
  import { DEPLOY_TEMPLATES } from '@shared/lib/deploy-templates.js'
  import { PRODUCT_STACK } from '@shared/ui/brand/strips.js'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import type { RouteLocationRaw } from 'vue-router'

  import { useSiteLink } from '../../composables/use-site-link'
  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'TemplateGallery' })

  interface DeployTemplate {
    /** Stable key of the template. */
    slug: string
    /** Template name. */
    title: string
    /** One line of what the template builds. */
    description: string
    /** Icon class of the template's mark. */
    icon: string
    /** Classes the mark needs to survive the dark theme. */
    markClass?: string
    /** Route the template opens in the deploy flow. */
    to: RouteLocationRaw
  }

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Overline above the title. */
    eyebrow?: string
    /** Headline of the copy cell. */
    title?: string
    /** One or two sentences under the title. */
    description?: string
    /** Actions under the copy. */
    actions?: SiteAction[]
    /** Deployable templates, two to a row in the scrolling wall. */
    templates?: DeployTemplate[]
    /** Label of each template card's deploy action. */
    deployLabel?: string
    /** Accessible name of the scrolling wall of templates. */
    galleryLabel?: string
    /** Overline of the ticker that closes the band. */
    stackLabel?: string
    /** Registry names of the marks the ticker runs. */
    stackMarks?: string[]
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: 'Your Stack, Your Way',
    title: 'Quick Start with Templates',
    description:
      'Build faster with pre-built applications and starter kits for common use cases. Deploy complete projects in seconds with popular frameworks.',
    actions: () => [
      {
        label: 'Deploy now',
        href: 'https://www.azion.com/en/documentation/products/guides/#azion-templates',
        kind: 'secondary',
        trailing: true,
        external: true
      }
    ],
    templates: () => DEPLOY_TEMPLATES,
    deployLabel: 'Deploy now',
    galleryLabel: 'Templates you can deploy',
    stackLabel: 'Compatible with Your Stack',
    stackMarks: () => PRODUCT_STACK
  })

  const router = useRouter()
  const { follow } = useSiteLink()

  const cards = computed(() =>
    props.templates.map((template) => ({
      ...template,
      href: router.resolve(template.to).href
    }))
  )

  const followCard = (event: MouseEvent, href: string) => {
    const target = event.target as globalThis.Element
    if (target.closest('a, button') || globalThis.getSelection()?.toString()) return
    if (event.metaKey || event.ctrlKey) {
      globalThis.open(href, '_blank', 'noopener')
      return
    }
    router.push(href)
  }
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <MediaSplit
      framed
      :heading-level="2"
      align="center"
      size="large"
      texture="none"
      :eyebrow="eyebrow"
      :title="title"
      :description="description"
    >
      <template #media>
        <div class="relative min-h-[36rem] w-full self-stretch lg:min-h-[44rem]">
          <div
            class="absolute inset-0 flex flex-col mask-t-from-[calc(100%_-_2rem)] mask-b-from-[calc(100%_-_6rem)]"
          >
            <ScrollArea :aria-label="galleryLabel">
              <CardGrid
                flush
                kind="frame"
                :columns="2"
              >
                <CardGridCell
                  v-for="card in cards"
                  :key="card.slug"
                  kind="none"
                  :padded="false"
                  @click="followCard($event, card.href)"
                >
                  <div
                    class="flex h-full min-w-0 cursor-pointer flex-col gap-(--spacing-md) bg-(--bg-surface) p-(--spacing-xl)"
                  >
                    <span
                      class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                    >
                      <i
                        :class="[card.icon, card.markClass]"
                        aria-hidden="true"
                        class="text-[1.25rem] leading-none text-(--text-default)"
                      />
                    </span>
                    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                      <span class="text-body-md text-(--text-default)">{{ card.title }}</span>
                      <span class="text-pretty text-body-sm text-(--text-muted)">
                        {{ card.description }}
                      </span>
                    </div>
                    <div class="mt-auto self-start">
                      <Button
                        :label="deployLabel"
                        kind="outlined"
                        size="medium"
                        icon="pi pi-chevron-right"
                        icon-position="trailing"
                        animated
                        :href="card.href"
                        @click="follow($event, card.href)"
                      >
                        <template #prefix>
                          <i
                            class="ai ai-azion text-(--primary)"
                            aria-hidden="true"
                          />
                        </template>
                      </Button>
                    </div>
                  </div>
                </CardGridCell>
              </CardGrid>
              <div
                aria-hidden="true"
                class="h-16"
              />
            </ScrollArea>
          </div>
        </div>
      </template>
      <template
        v-if="actions.length"
        #actions
      >
        <SectionAction
          v-for="action in actions"
          :key="action.label"
          :action="action"
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
          :label="stackLabel"
          :marks="stackMarks"
        />
      </SectionModule>
    </FrameBox>
  </SectionModule>
</template>
