<script setup>
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
      :breadcrumb="[{ label: 'Creation Center', current: true }]"
      back-label="Back to Home"
      @back="goHome"
    />

    <main
      class="animate-page-enter motion-reduce:animate-none relative flex min-w-0 flex-1 flex-col overflow-hidden lg:min-h-0"
    >
      <ProjectDropZone
        :active="dragging"
        class="[--drop-zone-inset:var(--layout-boundary-inline)]"
      />

      <div class="flex min-h-0 flex-1 flex-col overflow-auto lg:overflow-hidden">
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
