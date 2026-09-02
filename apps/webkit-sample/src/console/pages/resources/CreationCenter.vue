<script setup>
  // CREATIONCENTER — the console's front door for "make something", and the one screen
  // that lists EVERY way in: import a repository from a connected Git provider, clone a
  // framework template, or create one of the platform objects.
  //
  // ── A RAIL, AND ONE PANE ──
  //
  // The two deploy routes used to sit side by side as two half-width columns, which worked
  // while they were the only two things here: a third way in had nowhere to go. So the ways
  // in moved into a rail on the left and the pane beside it holds ONE of them at a time.
  // The rail is the index of the flow; the pane is where the reader works.
  //
  // ── TWO KINDS OF ROW ──
  //
  // A WAY TO DEPLOY CODE (import, templates) is a VIEW: it happens here, in the pane, so
  // leaving this screen to do it would be a navigation that buys nothing.
  //
  // A RESOURCE opens its own create page at `/<module>/new`. That is the console's surface
  // rule and not a shortcut: a first-level create is a page — linkable, reloadable,
  // back-button-safe (../../lib/behavior/surfaces.js) — and the workload and application
  // flows are multi-part wizards that provision infrastructure at the end. What the rail
  // adds is the way BACK: the row sends `?from=/create`, so the create page's first crumb
  // reads `Creation Center`, its header back returns here, and so does Cancel
  // (../../lib/behavior/create-origin.js). A reader who used this index to decide what to
  // build lands back on it instead of on a module list they may never have opened.
  import Menu from '@aziontech/webkit/menu'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import CreationHeader from '../../components/page/CreationHeader.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import { routeActivation } from '../../lib/behavior/anchor-nav'
  import { CREATION_CENTER_PATH } from '../../lib/behavior/create-origin'
  import { createMenu } from '../../lib/data/create-menu'
  import GitImporter from './creation/GitImporter.vue'
  import TemplateGallery from './creation/TemplateGallery.vue'

  const route = useRoute()
  const router = useRouter()

  // Carry the signed-in user across the flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const goHome = () => router.push({ path: '/home', query: { email: userEmail.value } })

  // The two views the pane can hold, each a component of its own rather than a branch of
  // this page's markup: what importing a repository needs and what browsing the catalog
  // needs have nothing to do with each other, and neither has anything to do with the rail.
  const VIEWS = {
    import: GitImporter,
    templates: TemplateGallery
  }

  const VIEW_IDS = Object.keys(VIEWS)

  // EVERY object an account can create, and the page each one creates on — read from the one
  // registry that already holds them all (../../lib/data/create-menu.js), which is also what
  // the header's global Create menu lists.
  //
  // The rail used to name four of them by hand, on the argument that it is an index rather
  // than a second copy of the sidebar. But an index that lists four of fourteen is not
  // smaller, it is incomplete: a reader who opened this screen to decide what to build and
  // wanted a certificate, a bucket or a stream found no row for it and had to go back out to
  // the sidebar to look for the module — while the Create menu one control over listed all
  // fourteen. The rail is the screen for the reader who has NOT decided yet, which is exactly
  // the reader who cannot be asked to already know where the object lives.
  const RESOURCE_PATHS = Object.fromEntries(createMenu.map((entry) => [entry.value, entry.path]))

  // Every row is a real `<a>` to what it opens — a view row to the pane's own address
  // (`/create?method=…`, exactly the state it produces), a resource row to that resource's
  // create page. So the address in the status bar is the address the row leads to, and a
  // modified click opens it in a new tab; a plain click is claimed for the router below.
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
          // A GRID, not the Marketplace cart. The cart is right in the sidebar, where
          // `Marketplace` names a STORE the reader is going to; this row names a
          // catalog they are about to browse in place, and it sits two rows above four
          // product glyphs — a shopping mark there says "buy", which is the one thing
          // this step is not.
          icon: 'pi pi-th-large',
          href: `${CREATION_CENTER_PATH}?method=templates`
        }
      ]
    },
    {
      label: 'Resources',
      // In the registry's order, which is the sidebar's areas: what a workload serves first,
      // then Build, Secure, Store, Observe. One section and not five: the group heading is
      // what separates the objects from the two ways to deploy code above them, and area
      // titles inside it would trade that one distinction for five weaker ones.
      //
      // The row reads the OBJECT noun (`WAF rule set`), not the menu's `Create WAF rule set`:
      // `Resources` already says what the section is for, so the verb belongs to the heading
      // and the page it opens, not to every row in between.
      items: createMenu.map((entry) => ({
        id: entry.value,
        label: entry.object,
        icon: entry.icon,
        href: entry.path
      }))
    }
  ]

  // Which view the pane is showing — on the URL, like every other in-page view switch in
  // the console (`?tab=`), so a chosen pane survives a reload and can be linked to. Only a
  // real view is ever written, and Import is the default: it is the route a reader with
  // code already written takes, and the one this flow was built for.
  const method = computed({
    get: () => (VIEW_IDS.includes(route.query.method) ? route.query.method : 'import'),
    set: (value) => {
      if (!VIEW_IDS.includes(value)) return
      router.replace({ query: { ...route.query, method: value } })
    }
  })

  const view = computed(() => VIEWS[method.value])

  // The row is an anchor, so the plain activation has to be TAKEN from the browser or it
  // would leave and reload the whole SPA (../../lib/behavior/anchor-nav.js). Anything
  // modified — a new tab, a new window, a middle click — is left alone, which is the only
  // reason the row is a link rather than a button.
  //
  // Then the two kinds of row part company: a view swaps the pane, a resource opens its
  // create page WITH THE ORIGIN so that page can bring the reader back here.
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
    <!-- Global header: back to console, brand + breadcrumb. -->
    <CreationHeader
      :breadcrumb="[{ label: 'Creation Center', current: true }]"
      back-label="Back to Home"
      @back="goHome"
    />

    <!-- Flow content. From `lg` up the page is height-bounded: the whole layout fits the
         viewport and the only scroll boxes are the rail and the pane's own (the template
         grid). Below `lg` the rail and the pane stack, so the page scrolls normally — a
         clamped stack would squeeze both into unusable slivers. -->
    <main
      class="animate-page-enter motion-reduce:animate-none flex min-w-0 flex-1 flex-col overflow-auto lg:min-h-0 lg:overflow-hidden"
    >
      <!-- `.layout-boundary` — the same inset every other page carries, and it brings the
           bottom boundary with it, which matters below `lg` where this page scrolls. From
           `lg` up the layout is height-bounded and only the pane scrolls, so the same bottom
           inset simply ends that scroll box one step above the edge.

           No `gap` on the stack: the band below owns its own top space via
           `.layout-section-start` (= --layout-boundary-start, the same step this container's
           boundary puts above the heading). -->
      <div class="layout-boundary flex flex-col lg:min-h-0 lg:flex-1">
        <PageHeading
          size="large"
          title="Build on the most reliable network on earth"
          description="Import a repository, start from a framework template, or create a resource."
        />

        <!-- THE RAIL, THEN THE PANE. From `lg` up the page is height-bounded, so the row is
             the layout: the rail keeps its width and the pane takes the slack, and both
             terminate at the same y. Below `lg` they stack — the rail first, because it is
             the index of what follows it.

             Stacked, the `gap` is band rhythm and takes the boundary step like every other
             band top; from `lg` up it is the gutter between the rail and the pane, which
             wants the larger section step. -->
        <div
          class="layout-section-start flex flex-col gap-(--layout-boundary-start) lg:min-h-0 lg:flex-1 lg:flex-row lg:gap-(--layout-section-gap)"
        >
          <!-- A PLAIN BOX HOSTS THE MENU, not a `<nav>` and not a `Sidebar`: `Menu` renders
               the nav landmark itself (and names it), so a `<nav>` here would nest two, and
               `Sidebar` would bring a surface, a border and a resize gesture this column has
               no use for. The host owns width and scrolling — which is exactly the split the
               component asks for — so past the viewport the rail scrolls inside itself
               instead of growing the height-bounded row.

               `--container-3xs` (256px) is the rail's width, and it holds from `sm` up,
               stacked or not — a row's selected surface spans the box, and a 900px-wide pill
               above the pane reads as a banner rather than a menu row. On a phone the rail
               keeps the full width, where a full-bleed list of rows is what navigation looks
               like. -->
          <div class="w-full shrink-0 sm:w-(--container-3xs) lg:min-h-0 lg:overflow-y-auto">
            <Menu
              :groups="NAV_GROUPS"
              :active-id="method"
              aria-label="What to create"
              @navigate="onNavigate"
            />
          </div>

          <!-- THE PANE. One view at a time, each one a component, so the pane is a slot
               rather than a stack of branches — and `KeepAlive` holds the one the reader
               steps away from: a connected Git account and a filtered catalog are both work
               the reader did, and re-doing the OAuth mock every time they glance at the
               other row is the kind of thing that makes a rail annoying to use. -->
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
