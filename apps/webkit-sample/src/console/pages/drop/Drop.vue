<script setup>
  import Button from '@aziontech/webkit/button'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import ProjectInitializing from '../../components/creation/ProjectInitializing.vue'
  import CreationHeader from '../../components/page/CreationHeader.vue'
  import { useProjectDrop } from '../../lib/behavior/project-upload'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const goHome = () => router.push({ path: '/home', query: { email: userEmail.value } })

  const { dragging, initializing, pickFile, pickFolder } = useProjectDrop()
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
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
        <section
          class="relative isolate flex flex-col items-center justify-center gap-(--spacing-lg) overflow-hidden rounded-(--shape-card) border-2 border-dashed border-(--border-default) px-(--spacing-lg) py-(--spacing-xxl) text-center transition-colors duration-150 ease-out [--texture-ink:color-mix(in_srgb,var(--text-default)_10%,transparent)] motion-reduce:transition-none data-[dragging]:border-(--border-selected) data-[dragging]:bg-(--bg-surface)"
          :data-dragging="dragging || null"
        >
          <TextureMaterial />

          <span
            class="relative flex size-12 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised)"
          >
            <i
              class="pi pi-cloud-upload text-body-lg leading-none text-(--text-default)"
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
