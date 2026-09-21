<script setup>
  // /drop — ONE PAGE, ONE GESTURE.
  //
  // Vercel Drop and Cloudflare Drop are the same idea, and it is a good one: a surface with
  // no other doors, where the shortest path from files to a live URL is a single drag.
  // Nothing is asked before the drop — not a repository, not a template, not a name.
  //
  // This is NOT a second create flow. Everything after the drop is the flow that already
  // exists: `useProjectUpload` reads the project and detects its framework, the manifest
  // goes into ../../lib/state/dropped-project.js because `File` handles cannot ride a URL,
  // and the reader lands on `/deploy?upload=<name>&framework=<tech>` — the same screen the
  // Creation Center hands a drop to. What this page changes is only what the user asked it
  // to change: it can START only with a drop.
  //
  // WHAT THE DROP PRODUCES: an application with no repository (`source: 'cli'`, see
  // ../../lib/data/applications.js). That is the honest answer — a dropped folder is not a
  // repository Azion can watch — and it is why the application's page then carries the CLI
  // commands: drop to get live in a gesture, `azion link` to keep it moving.
  import Button from '@aziontech/webkit/button'
  import { computed, onBeforeUnmount, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { DotGridBanner } from '@shared/ui/banners'

  import ProjectDropOverlay from '../../components/creation/ProjectDropOverlay.vue'
  import ProjectInitializing from '../../components/creation/ProjectInitializing.vue'
  import CreationHeader from '../../components/page/CreationHeader.vue'
  import { useProjectUpload } from '../../lib/behavior/project-upload'
  import { rememberDroppedProject } from '../../lib/state/dropped-project'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const goHome = () => router.push({ path: '/home', query: { email: userEmail.value } })

  // The same handoff the Creation Center performs, for the same reasons: the name and the
  // framework ride the URL so a reload still has them; the FILES cannot be written down, so
  // they go through the store and the deploy screen lists them from there.
  const initializing = ref(null)
  let handoff = null

  const HANDOFF_MS = 1600

  const deployProject = ({ name, framework, files, truncated }) => {
    initializing.value = { files, truncated }
    handoff = setTimeout(() => {
      rememberDroppedProject({ name, files, truncated })
      router.push({
        path: '/deploy',
        query: { email: userEmail.value, upload: name, framework }
      })
    }, HANDOFF_MS)
  }

  onBeforeUnmount(() => clearTimeout(handoff))

  const { dragging, pickFile, pickFolder } = useProjectUpload(deployProject)
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <ProjectDropOverlay
      :active="dragging"
      title="Drop it anywhere on this page"
      description="A project folder, or the files inside one. Azion reads what it is built with."
    />

    <ProjectInitializing
      v-if="initializing"
      :files="initializing.files"
      :truncated="initializing.truncated"
    />

    <CreationHeader
      :breadcrumb="[{ label: 'Drop', current: true }]"
      back-label="Back to Home"
      @back="goHome"
    />

    <main
      class="animate-page-enter motion-reduce:animate-none flex min-w-0 flex-1 flex-col overflow-auto"
    >
      <div class="layout-boundary flex flex-1 flex-col justify-center">
        <!-- THE ZONE. `relative` so the texture can sit behind it: every banner is
             `pointer-events-none absolute inset-0`, which is exactly what a drop target
             needs from a decoration — it is painted over and cannot swallow the drag.
             `dot-grid` rather than `pixelate`, whose opacity and mask ellipse are fitted
             per cell and degrade to a flat wash in a box this size.

             `--dot-grid-ink` is the override the banner documents, at 10% instead of its
             default 22%: at full strength a dot lands in the middle of a word of the body
             copy. It has to be BRACKETED — the paren shorthand has no form for DECLARING a
             custom property and would emit nothing at all. -->
        <section
          class="relative isolate flex flex-col items-center justify-center gap-(--spacing-lg) overflow-hidden rounded-(--shape-card) border-2 border-dashed border-(--border-default) px-(--spacing-lg) py-(--spacing-xxl) text-center transition-colors duration-150 ease-out [--dot-grid-ink:color-mix(in_srgb,var(--text-default)_10%,transparent)] motion-reduce:transition-none data-[dragging]:border-(--border-selected) data-[dragging]:bg-(--bg-surface)"
          :data-dragging="dragging || null"
        >
          <DotGridBanner />

          <span
            class="relative flex size-12 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised)"
          >
            <i
              class="pi pi-cloud-upload text-[1.25rem] leading-none text-(--text-default)"
              aria-hidden="true"
            />
          </span>

          <div class="relative flex max-w-(--container-md) flex-col gap-(--spacing-xs)">
            <h1 class="text-heading-lg text-(--text-default)">Drop your project</h1>
            <p class="text-pretty text-body-md text-(--text-muted)">
              Drag a folder here and Azion detects the framework, builds it, and gives you a live
              URL. No repository, no configuration.
            </p>
          </div>

          <!-- The fallback, for a reader who cannot drag — a picker is the same gesture
               with a different input device, and both land in `deployProject`. -->
          <div class="relative flex flex-wrap items-center justify-center gap-(--spacing-xs)">
            <Button
              label="Choose a folder"
              kind="primary"
              size="large"
              @click="pickFolder"
            />
            <Button
              label="Choose a file"
              kind="secondary"
              size="large"
              @click="pickFile"
            />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
