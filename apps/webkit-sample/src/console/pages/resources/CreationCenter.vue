<script setup>
  // CREATIONCENTER — the two ways to start a deploy, side by side on one page: import a
  // repository from a connected Git provider, or clone a framework template. Both routes
  // end in the same /deploy flow.
  //
  // BOTH WAYS IN ARE SECTIONS, NOT TABS. They do not exclude each other — a reader who has
  // code already written and a reader who is starting from nothing are looking at the same
  // screen — and a tab bar would hide half the entry points behind a click.
  //
  // Each half is a component of its own: what importing a repository needs and what
  // browsing the catalog needs have nothing to do with each other, and neither belongs in
  // this page's markup. The page owns the frame and the two columns; the panes own
  // themselves.
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ProjectDropZone from '../../components/creation/ProjectDropZone.vue'
  import ProjectInitializing from '../../components/creation/ProjectInitializing.vue'
  import CreationHeader from '../../components/page/CreationHeader.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import { useProjectDrop } from '../../lib/behavior/project-upload'
  import GitImporter from './creation/GitImporter.vue'
  import TemplateGallery from './creation/TemplateGallery.vue'

  const route = useRoute()
  const router = useRouter()

  // Carry the signed-in user across the flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const goHome = () => router.push({ path: '/home', query: { email: userEmail.value } })

  const { dragging, initializing, pickFile, pickFolder } = useProjectDrop()
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <!-- The drop's own answer, over the page it was made on. -->
    <ProjectInitializing
      v-if="initializing"
      :files="initializing.files"
      :truncated="initializing.truncated"
    />

    <!-- Global header: back to console, brand + breadcrumb. -->
    <CreationHeader
      :breadcrumb="[{ label: 'Creation Center', current: true }]"
      back-label="Back to Home"
      @back="goHome"
    />

    <!-- Flow content. From `lg` up the page is height-bounded: the whole layout fits the
         viewport and the only scroll box is the template grid (see TemplateBrowser's
         `scrollable`). Below `lg` the two columns stack, so the page scrolls normally — a
         clamped stack would squeeze both halves into unusable slivers. -->
    <main
      class="animate-page-enter motion-reduce:animate-none relative flex min-w-0 flex-1 flex-col overflow-hidden lg:min-h-0"
    >
      <!-- `<main>` here runs to the viewport edge — the page's boundary is on the
           container inside it — so the zone is told where that boundary is. Without it
           the dashed box is drawn hard against the window and its corners are clipped. -->
      <ProjectDropZone
        :active="dragging"
        class="[--drop-zone-inset:var(--layout-boundary-inline)]"
      />

      <!-- The scroll lives on this box rather than on `<main>`, so the drop zone above
           has a frame that does not move: an absolute child of a scroll container drifts
           with the content, and a dashed boundary that slides off the top of the region
           it is marking is worse than no boundary. Below `lg` this scrolls; from `lg` up
           the page is height-bounded and only the template grid does. -->
      <div class="flex min-h-0 flex-1 flex-col overflow-auto lg:overflow-hidden">
        <!-- `.layout-boundary` — the same inset every other page carries, and it brings the
           bottom boundary with it, which matters below `lg` where this page scrolls. From
           `lg` up the layout is height-bounded and only the template grid scrolls, so the
           same bottom inset simply ends that scroll box one step above the edge.

           No `gap` on the stack: the band below owns its own top space via
           `.layout-section-start` (= --layout-boundary-start, the same step this container's
           boundary puts above the heading). -->
        <div class="layout-boundary flex flex-col lg:min-h-0 lg:flex-1">
          <PageHeading
            size="large"
            title="Build on the most reliable network on earth"
          >
            <template #description>
              Start from a repository or use a framework template. You can also drag and drop your
              project, or choose a
              <button
                type="button"
                class="text-link cursor-pointer"
                @click="pickFile"
              >
                file
              </button>
              or a
              <button
                type="button"
                class="text-link cursor-pointer"
                @click="pickFolder"
              >
                folder</button
              >.
            </template>
          </PageHeading>

          <!-- From `lg` up both columns terminate at the same y: the page is height-bounded
             there, so the importer stretches to the catalog's height instead of ending
             mid-page. Two boxes of the same width that stop on different lines read as one
             unfinished half, and the ragged edge would move every time the importer swapped
             content. Below `lg` the halves stack and the importer is content-sized.

             Stacked, the `gap` is band rhythm and takes the boundary step like every other
             band top; from `lg` up it is the column gutter between the two halves, which
             wants the larger section step. -->
          <div
            class="layout-section-start flex flex-col gap-(--layout-boundary-start) lg:min-h-0 lg:flex-1 lg:flex-row lg:gap-(--layout-section-gap)"
          >
            <GitImporter />
            <TemplateGallery />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
