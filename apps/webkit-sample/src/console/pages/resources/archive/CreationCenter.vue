<script setup>
  import MenuRoot from '@aziontech/webkit/menu-root'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import CreationHeader from '../../../components/page/CreationHeader.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import { routeActivation } from '../../../lib/behavior/anchor-nav'
  import { CREATION_CENTER_PATH } from '../../../lib/behavior/create-origin'
  import GitImporter from '../creation/GitImporter.vue'
  import TemplateGallery from '../creation/TemplateGallery.vue'
  import { createMenu } from './create-menu'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const goHome = () => router.push({ path: '/home', query: { email: userEmail.value } })

  const VIEWS = {
    import: GitImporter,
    templates: TemplateGallery
  }

  const VIEW_IDS = Object.keys(VIEWS)

  const RESOURCE_PATHS = Object.fromEntries(createMenu.map((entry) => [entry.value, entry.path]))

  const NAV_GROUPS = [
    {
      items: [
        {
          id: 'import',
          label: 'Import from GitHub',
          icon: 'pi pi-github',
          href: `${CREATION_CENTER_PATH}?method=import`
        },
        {
          id: 'templates',
          label: 'Templates',
          icon: 'pi pi-th-large',
          href: `${CREATION_CENTER_PATH}?method=templates`
        }
      ]
    },
    {
      label: 'Resources',
      items: createMenu.map((entry) => ({
        id: entry.value,
        label: entry.object,
        icon: entry.icon,
        href: entry.path
      }))
    }
  ]

  const method = computed({
    get: () => (VIEW_IDS.includes(route.query.method) ? route.query.method : 'import'),
    set: (value) => {
      if (!VIEW_IDS.includes(value)) return
      router.replace({ query: { ...route.query, method: value } })
    }
  })

  const view = computed(() => VIEWS[method.value])

  const onNavigate = (event, node) => {
    if (!routeActivation(event)) return
    if (VIEW_IDS.includes(node.id)) {
      method.value = node.id
      return
    }
    router.push({
      path: RESOURCE_PATHS[node.id],
      query: { email: userEmail.value, from: CREATION_CENTER_PATH }
    })
  }
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <CreationHeader
      :breadcrumb="[{ label: 'Creation Center', current: true }]"
      back-label="Back to Home"
      @back="goHome"
    />

    <main
      class="animate-page-enter motion-reduce:animate-none flex min-w-0 flex-1 flex-col overflow-auto lg:min-h-0 lg:overflow-hidden"
    >
      <div class="layout-boundary flex flex-col lg:min-h-0 lg:flex-1">
        <PageHeading
          size="large"
          title="Build on the most reliable network on earth"
          description="Import a repository, start from a framework template, or create a resource."
        />

        <div
          class="layout-section-start flex flex-col gap-(--layout-boundary-start) lg:min-h-0 lg:flex-1 lg:flex-row lg:gap-(--layout-section-gap)"
        >
          <div class="w-full shrink-0 sm:w-(--container-3xs) lg:min-h-0 lg:overflow-y-auto">
            <MenuRoot
              :groups="NAV_GROUPS"
              :active-id="method"
              aria-label="What to create"
              @navigate="onNavigate"
            />
          </div>

          <div class="flex w-full min-w-0 flex-col lg:min-h-0 lg:flex-1">
            <KeepAlive>
              <component
                :is="view"
                :key="method"
              />
            </KeepAlive>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
