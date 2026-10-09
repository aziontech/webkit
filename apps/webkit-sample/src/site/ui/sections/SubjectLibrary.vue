<script setup lang="ts">
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'

  import { useSiteLink } from '../../composables/use-site-link'
  import SectionAction from './SectionAction.vue'
  import type { SiteAction, SiteLink } from './types'

  defineOptions({ name: 'SubjectLibrary' })

  interface LibrarySubject {
    /** Id of the subject's card, for in-page links. */
    slug: string
    /** Subject name. */
    title: string
    /** What the subject covers. */
    description: string
    /** The subject's articles, one link each. */
    articles: SiteLink[]
  }

  interface LibraryClosing {
    /** Overline above the title. */
    eyebrow?: string
    /** The closing ask. */
    title: string
    /** Second line of the title, in the muted ink. */
    titleMuted?: string
    /** One sentence under the title. */
    description?: string
    /** Actions under the copy. */
    actions?: SiteAction[]
  }

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** One card per subject. */
    subjects: LibrarySubject[]
    /** Call to action filling the grid's last two cells; null leaves it out. */
    closing?: LibraryClosing | null
  }

  withDefaults(defineProps<Props>(), {
    anchor: '',
    closing: null
  })

  const { follow } = useSiteLink()
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
    class="scroll-mt-(--spacing-xxl)"
  >
    <FrameBox
      flush
      borders="y"
      marks="none"
    >
      <CardGrid
        kind="divider"
        :columns="3"
        :mobile-columns="1"
      >
        <FrameBox
          v-for="subject in subjects"
          :id="subject.slug"
          :key="subject.slug"
          borders="none"
          marks="all"
          class="min-w-0 scroll-mt-(--spacing-xxl) bg-(--bg-canvas)"
        >
          <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-xl)">
            <div class="flex flex-col gap-(--spacing-sm)">
              <h3 class="m-0 text-balance text-heading-sm text-(--text-default)">
                {{ subject.title }}
              </h3>
              <p class="m-0 text-pretty text-body-sm text-(--text-muted)">
                {{ subject.description }}
              </p>
            </div>

            <ul
              role="list"
              class="m-0 flex list-none flex-col gap-(--spacing-xs) p-0"
            >
              <li
                v-for="article in subject.articles"
                :key="article.href"
              >
                <a
                  :href="article.href"
                  class="text-body-sm text-(--text-muted) underline underline-offset-2 transition-colors duration-150 ease-out hover:text-(--text-default) focus-visible:rounded-(--shape-flat) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none"
                  @click="follow($event, article.href)"
                >
                  {{ article.label }}
                </a>
              </li>
            </ul>
          </div>
        </FrameBox>

        <FrameBox
          v-if="closing"
          borders="none"
          marks="all"
          class="min-w-0 bg-(--bg-surface-raised) sm:col-span-2"
        >
          <CallToAction
            kind="lead"
            class="h-full"
            :eyebrow="closing.eyebrow ?? ''"
            :title="closing.title"
            :title-muted="closing.titleMuted ?? ''"
            :description="closing.description ?? ''"
          >
            <template #actions>
              <SectionAction
                v-for="action in closing.actions ?? []"
                :key="action.label"
                :action="action"
              />
            </template>
          </CallToAction>
        </FrameBox>
      </CardGrid>
    </FrameBox>
  </SectionModule>
</template>
