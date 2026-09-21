<script setup>
  import AzionLogoMin from '@aziontech/webkit/svg/azion/min'
  import { computed } from 'vue'

  // Template preview card: the mark of the thing being deployed, its title/description,
  // and the Git source it clones from. Renders as a link when `href` is set, otherwise a
  // plain card.
  //
  // THE MARK IS THE TEMPLATE'S OWN, not a screenshot of it. This card used to lead with a
  // 192x120 thumbnail, which promised a picture of the site the reader is about to deploy
  // and could not keep it: every template resolved to one hard-coded PNG, so a Nuxt
  // e-commerce deploy opened under a Next.js screenshot. The framework or vendor logo is
  // the mark the reader just clicked in the catalog, it is right for all twenty-five, and
  // it carries the identity in a tile instead of a third of the card.
  const props = defineProps({
    title: { type: String, default: 'Template Title' },
    description: { type: String, default: 'Template Description' },
    /** Brand glyph class (`ai-cor ai-next`, `ai ai-edge-connectors`). */
    icon: { type: String, default: '' },
    /** Filter that keeps a colored logo legible on both themes (see frameworks.js). */
    markClass: { type: String, default: '' },
    source: { type: String, default: 'github' }, // github | gitlab
    /**
     * Whether this deploy clones the source into a repository. False drops the source
     * block: an Azion template has no project to copy, and a reader who deployed without
     * connecting a provider is not cloning from anywhere either.
     */
    cloned: { type: Boolean, default: true },
    repoOwner: { type: String, default: 'aziontech' },
    repoPath: { type: String, default: 'templates/nextjs' },
    href: { type: String, default: '' }
  })

  const sourceIcon = computed(() => (props.source === 'gitlab' ? 'pi-gitlab' : 'pi-github'))

  const isLink = computed(() => Boolean(props.href))
</script>

<template>
  <component
    :is="isLink ? 'a' : 'div'"
    :href="isLink ? href : undefined"
    :target="isLink ? '_blank' : undefined"
    :rel="isLink ? 'noopener' : undefined"
    class="flex w-full items-start gap-(--spacing-md) overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md) no-underline"
  >
    <!-- The mark, in the same tile the Marketplace rows and the importer's repositories
         use. `text-(--text-default)` has to be stated: the Azion product glyphs and the
         fifteen frameworks with no colored logo are FONT glyphs painting in
         `currentColor`, which would inherit the document's black and go black-on-black in
         the dark theme; `markClass` keeps the other half (a hard-coded dark logo) legible.
         A source with no mark of its own falls back to the Azion one. -->
    <span
      class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
    >
      <i
        v-if="icon"
        :class="[icon, markClass]"
        class="text-[1.25rem] leading-none text-(--text-default)"
        aria-hidden="true"
      />
      <AzionLogoMin
        v-else
        class="h-5 w-auto"
        aria-label="Azion"
      />
    </span>

    <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-md)">
      <!-- Title + description -->
      <div class="flex w-full min-w-0 flex-col overflow-hidden">
        <span class="flex items-center gap-(--spacing-xs)">
          <span class="truncate text-heading-xxs text-(--text-default)">
            {{ title }}
          </span>
          <i
            v-if="isLink"
            class="pi pi-external-link shrink-0 text-body-xs leading-none"
            aria-hidden="true"
          />
        </span>
        <span class="text-body-xs text-(--text-muted)">
          {{ description }}
        </span>
      </div>

      <!-- Source info -->
      <div
        v-if="cloned"
        class="flex w-full flex-col gap-(--spacing-xxs)"
      >
        <span class="truncate text-body-xxs text-(--text-muted)">
          Cloning from {{ source === 'gitlab' ? 'GitLab' : 'Github' }}
        </span>
        <div class="flex items-center gap-(--spacing-md)">
          <span
            class="flex h-5 items-center gap-(--spacing-xxs) text-label-sm text-(--text-default)"
          >
            <i
              :class="['pi', sourceIcon]"
              class="text-[length:inherit] leading-none"
              aria-hidden="true"
            />
            {{ repoOwner }}
          </span>
          <span class="flex h-5 items-center gap-(--spacing-xxs) text-label-sm text-(--text-muted)">
            <i
              class="pi pi-folder text-[length:inherit] leading-none"
              aria-hidden="true"
            />
            {{ repoPath }}
          </span>
        </div>
      </div>
    </div>
  </component>
</template>
