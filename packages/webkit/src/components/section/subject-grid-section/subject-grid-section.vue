<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { safeHref } from '../../../utils/safe-href'
  import Button from '../../action/button/button.vue'
  import CardGrid from '../../layout/card-grid/card-grid.vue'
  import Module from '../../layout/module/module.vue'
  import type { ModuleHeaderAction } from '../../layout/module-header/module-header.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import CallToAction from '../../marketing/call-to-action/call-to-action.vue'

  defineOptions({
    name: 'SubjectGridSection',
    inheritAttrs: false
  })

  export type { ModuleHeaderAction }

  /** One article link under a subject. */
  export type SubjectGridSectionArticle = {
    /** Title of the article, the link's text. */
    label: string
    /** Destination of the article. */
    href: string
  }

  /** One subject card: its name, what it covers and its articles. */
  export type SubjectGridSectionSubject = {
    /** Id of the subject's card, the target of a `#slug` link. */
    slug: string
    /** Name of the subject, rendered as the card's h3. */
    title: string
    /** What the subject covers. */
    description?: string
    /** The subject's articles, in reading order. */
    articles: SubjectGridSectionArticle[]
  }

  /** The call to action spanning the grid's last two cells. */
  export type SubjectGridSectionClosing = {
    /** Short overline above the headline. */
    eyebrow?: string
    /** Headline of the closing cell, rendered as its h2. */
    title: string
    /** Second line of the headline, set in muted ink. */
    titleMuted?: string
    /** Supporting sentence under the headline. */
    description?: string
    /** First action, drawn as the large secondary button. */
    primaryAction?: ModuleHeaderAction
    /** Second action, drawn as the large outlined button. */
    secondaryAction?: ModuleHeaderAction
  }

  export interface SubjectGridSectionProps {
    /** In-page `id` of the band, the target of a `#hash` link. */
    anchor?: string
    /** The subject cards, in order; each is `{ slug, title, description, articles }` where every article is `{ label, href }`. Subjects without a title or a linked article are skipped. */
    subjects?: SubjectGridSectionSubject[]
    /**
     * Call to action across the grid's last two cells; `{ eyebrow, title, titleMuted,
     * description, primaryAction, secondaryAction }` where each action is `{ label, href,
     * trailing?, target? }`. Omitted when absent.
     */
    closing?: SubjectGridSectionClosing
    /** Accessible name of the band; empty leaves the section unnamed. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<SubjectGridSectionProps>(), {
    anchor: '',
    subjects: () => [],
    closing: undefined,
    ariaLabel: ''
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'subject-grid-section'
  )

  const library = computed(() =>
    props.subjects
      .map((subject) => ({
        ...subject,
        articles: (subject.articles ?? []).filter(
          (article) => Boolean(article.label) && Boolean(article.href)
        )
      }))
      .filter((subject) => Boolean(subject.title) && subject.articles.length > 0)
  )

  const hasSubjects = computed(() => library.value.length > 0)

  const hasClosing = computed(() => Boolean(props.closing?.title))

  const closingColumns = computed(() => {
    const count = library.value.length
    return {
      '--subject-grid-section-closing-columns-sm': 2 - (count % 2),
      '--subject-grid-section-closing-columns-lg': 3 - (count % 3)
    }
  })

  const ARTICLE_LINK_CLASS =
    'text-body-sm text-(--text-muted) underline underline-offset-2 transition-colors duration-150 ease-out ' +
    'hover:text-(--text-default) focus-visible:rounded-(--shape-flat) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) ' +
    'motion-reduce:transition-none'
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :aria-label="ariaLabel || undefined"
    class="scroll-mt-(--spacing-2xl)"
  >
    <Module
      v-if="hasSubjects"
      :divided="false"
      :padded="false"
    >
      <RegistrationFrame
        flush
        borders="y"
        marks="none"
      >
        <CardGrid
          variant="divider"
          layout="fixed"
          :columns="3"
          :mobile-columns="1"
        >
          <RegistrationFrame
            v-for="subject in library"
            :id="subject.slug || undefined"
            :key="subject.slug || subject.title"
            borders="none"
            marks="all"
            class="min-w-0 scroll-mt-(--spacing-2xl) bg-(--bg-canvas)"
          >
            <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-xl)">
              <div class="flex flex-col gap-(--spacing-sm)">
                <h3 class="m-0 text-balance text-heading-sm text-(--text-default)">
                  {{ subject.title }}
                </h3>
                <p
                  v-if="subject.description"
                  class="m-0 text-pretty text-body-sm text-(--text-muted)"
                >
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
                    :href="safeHref(article.href) ?? undefined"
                    :class="ARTICLE_LINK_CLASS"
                  >
                    {{ article.label }}
                  </a>
                </li>
              </ul>
            </div>
          </RegistrationFrame>

          <RegistrationFrame
            v-if="closing && hasClosing"
            borders="none"
            marks="all"
            :style="closingColumns"
            class="min-w-0 bg-(--bg-surface-raised) sm:col-span-(--subject-grid-section-closing-columns-sm) lg:col-span-(--subject-grid-section-closing-columns-lg)"
          >
            <CallToAction
              variant="lead"
              class="h-full"
              :eyebrow="closing.eyebrow ?? ''"
              :title="closing.title"
              :title-muted="closing.titleMuted ?? ''"
              :description="closing.description ?? ''"
            >
              <template
                v-if="closing.primaryAction || closing.secondaryAction"
                #actions
              >
                <Button
                  key="primaryAction"
                  v-if="closing.primaryAction"
                  :label="closing.primaryAction.label"
                  :href="closing.primaryAction.href"
                  :target="closing.primaryAction.target"
                  variant="secondary"
                  size="large"
                  :icon="closing.primaryAction.trailing ? 'az az-chevron-right' : ''"
                  icon-position="trailing"
                  :animated="Boolean(closing.primaryAction.trailing)"
                />
                <Button
                  key="secondaryAction"
                  v-if="closing.secondaryAction"
                  :label="closing.secondaryAction.label"
                  :href="closing.secondaryAction.href"
                  :target="closing.secondaryAction.target"
                  variant="outline"
                  size="large"
                  :icon="closing.secondaryAction.trailing ? 'az az-chevron-right' : ''"
                  icon-position="trailing"
                  :animated="Boolean(closing.secondaryAction.trailing)"
                />
              </template>
            </CallToAction>
          </RegistrationFrame>
        </CardGrid>
      </RegistrationFrame>
    </Module>
  </section>
</template>
