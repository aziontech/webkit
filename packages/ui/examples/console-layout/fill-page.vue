<script setup lang="ts">
  import ConsoleLayoutRoot, { type ConsoleLayoutNavGroup } from '@aziontech/ui/console-layout-root'
  import Resizable from '@aziontech/ui/resizable'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: 'az az-home', href: '/' },
        { id: 'functions', label: 'Functions', icon: 'az az-functions', href: '/functions' }
      ]
    }
  ]

  const routes = [
    'products',
    'orders',
    'customers',
    'carts',
    'invoices',
    'reviews',
    'coupons',
    'stores'
  ]
  const lines = routes.flatMap((name) => [
    `router.get('/${name}/:id', async ({ params }) => {`,
    `  const item = await ${name}.get(params.id)`,
    `  if (!item) return new Response('Not found', { status: 404 })`,
    '  return Response.json(item)',
    '})',
    ''
  ])

  const narrow = ref(false)
  let narrowQuery: MediaQueryList | null = null
  const onNarrowChange = () => {
    narrow.value = Boolean(narrowQuery?.matches)
  }
  onMounted(() => {
    narrowQuery = globalThis.matchMedia?.('(max-width: 767px)') ?? null
    onNarrowChange()
    narrowQuery?.addEventListener('change', onNarrowChange)
  })
  onBeforeUnmount(() => narrowQuery?.removeEventListener('change', onNarrowChange))
  const orientation = computed(() => (narrow.value ? 'vertical' : 'horizontal'))
  const previewBasis = computed(() => (narrow.value ? 240 : 320))
</script>

<template>
  <ConsoleLayoutRoot
    :navigation="navigation"
    :breadcrumbs="[{ label: 'Functions', href: '/functions' }, { label: 'edge-auth' }]"
    active-id="functions"
  >
    <div
      data-layout-fill
      class="flex min-h-0 flex-col"
    >
      <div
        class="flex h-14 shrink-0 items-center border-b border-(--border-default) px-(--spacing-md) text-label-md text-(--text-default)"
      >
        Code
      </div>
      <div class="grid min-h-0 flex-1">
        <Resizable
          :orientation="orientation"
          aria-label="Editor workspace"
        >
          <Resizable.Pane aria-label="Source">
            <div
              tabindex="0"
              role="group"
              aria-label="Source lines"
              class="h-full overflow-auto p-(--spacing-md) text-body-sm text-(--text-muted) outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)"
            >
              <p
                v-for="(line, index) in lines"
                :key="index"
                class="m-0 min-h-[1lh] whitespace-pre"
                v-text="line"
              />
            </div>
          </Resizable.Pane>
          <Resizable.Handle aria-label="Resize the preview" />
          <Resizable.Pane
            :basis="previewBasis"
            aria-label="Preview"
          >
            <div
              tabindex="0"
              role="group"
              aria-label="Preview output"
              class="h-full overflow-auto p-(--spacing-md) text-body-sm text-(--text-muted) outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)"
            >
              GET /products/42 returned 200 in 12 ms.
            </div>
          </Resizable.Pane>
        </Resizable>
      </div>
    </div>
  </ConsoleLayoutRoot>
</template>
