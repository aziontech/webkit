<script setup>
  // The "Webkit Hub" — a docs-style shell for the @aziontech/webkit library. Its
  // navigation lives in a full-height left rail (HubSidebar), the same shell the
  // console (AppSidebar) and the developer docs (DocsLayout) use. Selecting a
  // sidebar item swaps the content view in the scrolling right column:
  //   • Home        — the hero + the full interactive Component Grid.
  //   • Componentes — one category at a time (that slice of the Component Grid).
  //   • Foundations — the tokens / colors / type / theme / icons catalog.
  //   • Assets      — the Brand, Icons and Illustrations galleries.
  // The views aren't routes, so activating an item sets `active` and the shell
  // renders the matching view, resetting the scroll to the top.
  //
  // One view is HIDDEN — `changelog` (the console sample's updates). It has no
  // HubSidebar entry and nothing here links to it, so the only way in is its own
  // route (/site/hub/changelog), which seeds `view`. That is what makes it a link
  // you hand to someone rather than a section of the library docs; it still
  // renders in this shell so a reader who arrives by link can walk into the Hub.
  import Button from '@aziontech/webkit/button'
  import { computed, nextTick, ref } from 'vue'

  import ContrastBanner from '../ui/ContrastBanner.vue'
  import AsciiAsterisk from './AsciiAsterisk.vue'
  import ComponentGrid from './ComponentGrid.vue'
  import BannerContainer from './foundations/components/layout/BannerContainer.vue'
  import CardGrid from './foundations/components/layout/CardGrid.vue'
  import PageHeader from './foundations/components/layout/PageHeader.vue'
  import SectionContainer from './foundations/components/layout/SectionContainer.vue'
  import SectionModule from './foundations/components/layout/SectionModule.vue'
  import HubAssets from './HubAssets.vue'
  import HubChangelog from './HubChangelog.vue'
  import HubFoundations from './HubFoundations.vue'
  import HubSidebar from './HubSidebar.vue'
  import SiteFooter from './SiteFooter.vue'

  const props = defineProps({
    // Which view the shell opens on. The route supplies it (that is how the hidden
    // `changelog` page is reachable); the sidebar owns it from then on.
    view: { type: String, default: 'home' }
  })

  // "Start" affordance in the hero — a one-click "copy prompt" pill (ContrastBanner)
  // that hands an AI coding tool everything it needs to build with the Azion Design
  // System.
  const webkitPrompt =
    'Build my UI with the Azion Design System. Install @aziontech/webkit and ' +
    "@aziontech/theme, import the theme globals once, and compose the app from webkit's " +
    'Vue components and design tokens instead of hand-rolling UI — following each ' +
    "component's documented props and compound API."

  // The scrolling content column and the active view id (matches HubSidebar ids,
  // plus the hidden `changelog`). Seeded from the route, then owned by the sidebar.
  const scrollRef = ref(null)
  const active = ref(props.view)

  // Component-category metadata for the category page headers — mirrors the
  // section subtitles in ComponentGrid. Keys match the sidebar's "Componentes" ids
  // and ComponentGrid's `category` filter.
  const CATEGORY_META = {
    actions: {
      label: 'Actions',
      icon: 'pi pi-bolt',
      description:
        'Buttons and triggers — the controls that start a task, confirm a choice, or fire a command.'
    },
    inputs: {
      label: 'Inputs',
      icon: 'pi pi-pencil',
      description: 'Fields and controls — how people enter, pick, and toggle values in a form.'
    },
    content: {
      label: 'Content',
      icon: 'pi pi-id-card',
      description: 'Status and identity — tags, badges and avatars that label and describe things.'
    },
    feedback: {
      label: 'Feedback',
      icon: 'pi pi-comment',
      description: 'Messages and progress — how the UI reports what happened and what is happening.'
    },
    overlay: {
      label: 'Overlay',
      icon: 'pi pi-clone',
      description:
        'Layered, floating surfaces — dialogs, drawers, popovers, tooltips and menus that sit above the page.'
    },
    navigation: {
      label: 'Navigation',
      icon: 'pi pi-compass',
      description: 'Wayfinding and menus — breadcrumbs, tabs and shells that move people around.'
    },
    data: {
      label: 'Data',
      icon: 'pi pi-database',
      description: 'Tables and display — structured records and the surfaces that present them.'
    },
    code: {
      label: 'Code',
      icon: 'pi pi-code',
      description: 'Source and log surfaces — code blocks and log views for structured, monospaced content.'
    }
  }

  // The Home "explore the Hub" cards — the Hub's four top-level areas, mirroring
  // the sidebar groups (Getting Started, Foundations, Components, Assets). The
  // Components card lands on the first category (Actions) and Assets on the first
  // gallery (Brand); the sidebar then highlights where you are.
  const hubSections = [
    {
      id: 'getting-started',
      label: 'Getting Started',
      icon: 'pi pi-book',
      description: 'Install the packages, wire the tooling, and ship your first token-driven component.'
    },
    {
      id: 'foundation-tokens',
      label: 'Foundations',
      icon: 'pi pi-palette',
      description: 'The tokens, colors, typography, theme and icons every component is built from.'
    },
    {
      id: 'actions',
      label: 'Components',
      icon: 'pi pi-th-large',
      description:
        'Browse the library by category — actions, inputs, content, feedback, overlay, navigation, data and code.'
    },
    {
      id: 'brand',
      label: 'Assets',
      icon: 'pi pi-images',
      description: 'The Azion brand lockups, the full icon gallery, and the shipped illustrations.'
    }
  ]

  // The Home "why webkit" band — a stats headline + three feature columns, each
  // with a colored diamond glyph.
  const powersFeatures = [
    {
      color: 'var(--info)',
      title: 'Design for quality and speed',
      body: 'Foundations you can trust, speed you can feel. The system is built so teams stop reinventing the basics and start shipping the ideas that matter.'
    },
    {
      color: 'var(--primary)',
      title: 'Built by the people who use it',
      body: 'From CEOs, designers, and engineers that build at Azion and for Azion. The system gets sharper every time we put it to work in the real product.'
    },
    {
      color: 'var(--warning)',
      title: 'Ready for what’s next',
      body: 'Opinionated foundations paired with flexible, composable patterns so your system keeps pace, no matter how the craft evolves.'
    }
  ]

  const isCategory = computed(() => active.value in CATEGORY_META)
  const isAsset = computed(() => ['brand', 'icons', 'illustrations'].includes(active.value))
  const category = computed(() => CATEGORY_META[active.value] ?? null)

  // Foundations fan out into one view per foundation. Ids are `foundation-<key>`
  // so `foundation-icons` never collides with the Assets `icons` gallery; the
  // stripped `<key>` is what HubFoundations renders.
  const isFoundation = computed(() => active.value.startsWith('foundation-'))
  const foundationSection = computed(() => active.value.replace('foundation-', ''))

  const scrollBehavior = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

  // Activate a nav item: swap the view and reset the scroll to the top (after the
  // new view has rendered).
  const onNavigate = async (event, item) => {
    active.value = item.id
    await nextTick()
    scrollRef.value?.scrollTo({ top: 0, behavior: scrollBehavior() })
  }
</script>

<template>
  <!-- Own the scroll region: the global shell locks html/body/#app to
       height:100dvh; overflow:hidden, so this docs shell is a full-height row —
       the sidebar rail fixed on the left, the content column scrolling on the
       right. -->
  <div class="flex h-dvh overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-default)]">
    <!-- Global navigation rail (hidden below md, matching the docs shell). -->
    <div class="hidden shrink-0 md:block">
      <HubSidebar
        :active="active"
        @navigate="onNavigate"
      />
    </div>

    <main
      ref="scrollRef"
      class="min-w-0 flex-1 overflow-y-auto"
    >
      <!-- ── Home: the hero + a browse-by-category card grid ──────────────── -->
      <template v-if="active === 'home'">
        <!-- Fluid banner: full-bleed hero band whose border-b meets the framed
             column below it as one continuous border. -->
        <BannerContainer
          hero
          max-width="7xl"
        >
          <PageHeader
            margin-bottom=""
            size="hero"
            eyebrow="Webkit Hub"
            title="One design system. Every component, ready to compose."
            description="Explore the @aziontech/webkit library — browse every component by category, dig into the foundations, and grab the brand assets. Tokens, accessibility, and dark mode built in."
          >
            <!-- Start here: the primary CTA into Foundations + a one-click "copy
             prompt" pill that onboards an AI coding tool to the Azion Design
             System. -->
            <template #actions>
              <div
                class="flex flex-col items-stretch gap-[var(--spacing-sm)] sm:flex-row sm:items-center"
              >
                <Button
                  label="Getting Started"
                  kind="primary"
                  size="large"
                  @click="(event) => onNavigate(event, { id: 'getting-started' })"
                />
                <ContrastBanner
                  label="Start with Agents"
                  :show-logo="false"
                  :prompt="webkitPrompt"
                />
              </div>
            </template>
          </PageHeader>
        </BannerContainer>

        <!-- ══ Bordered content column ═══════════════════════════════════════
             Vertical rules on both edges (border-x); its top edge is the hero's
             border-b and its bottom edge the SiteFooter's border-t, so the frame
             reads as one continuous border with no doubled lines. The two bands
             inside divide with the "Why webkit" band's own border-t. -->
        <SectionContainer max-width="7xl">
          <!-- Browse by category: an edge-to-edge module. No outer padding — each
           module owns its own padding, and its left/right edges are the column's
           border-x (never a second line), so nothing doubles. -->
          <section class="w-full">
            <!-- Module header row: a single border-b divides it from the grid; its
               sides are the column's border-x and its top the hero's border-b. -->
            <PageHeader
              level="h2"
              size="section"
              margin-bottom=""
              class="border-b border-[var(--border-default)] p-[var(--spacing-xl)]"
              title="Explore the Hub"
              description="Four ways in — get set up, learn the foundations, browse every component, and grab the brand assets."
            />
            <!-- Card grid (divider variant): the 1px gaps reveal the wrapper's
               border colour as internal lines; the perimeter carries none, so the
               column's border-x and the bands above/below own the outer edges. -->
            <CardGrid
              :columns="4"
              variant="divider"
            >
              <button
                v-for="section in hubSections"
                :key="section.id"
                type="button"
                class="relative flex h-full min-h-[260px] flex-col justify-center bg-[var(--bg-canvas)] p-[var(--spacing-xl)] text-left transition-colors duration-moderate-01 ease-productive-entrance hover:bg-[var(--bg-surface)] focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ring-color)] motion-reduce:transition-none"
                @click="(event) => onNavigate(event, { id: section.id })"
              >
                <span class="mb-[var(--spacing-md)]">
                  <i
                    :class="[section.icon, 'text-heading-sm text-[var(--text-default)]']"
                    aria-hidden="true"
                  />
                </span>
                <span class="mb-[var(--spacing-sm)] text-heading-xxs text-[var(--text-default)]">
                  {{ section.label }}
                </span>
                <span
                  class="text-pretty text-body-xxs text-[var(--text-muted)]"
                  >{{ section.description }}</span
                >
              </button>
            </CardGrid>
          </section>

          <!-- Why webkit: same framed module as Browse — a header row (border-b)
           over a box grid of three feature cards. No outer padding; the column's
           border-x owns the sides, and the band's border-t its top. -->
          <section class="w-full border-t border-[var(--border-default)]">
            <!-- Module header row: keeps its own p-xxl; a single border-b divides
               it from the cards grid below. -->
            <PageHeader
              level="h2"
              size="section"
              margin-bottom=""
              class="border-b border-[var(--border-default)] p-[var(--spacing-xl)]"
              title="One kit powers every Azion interface"
              description="Webkit has grown inside Azion — the same components, tokens, and patterns behind the Azion Console, shaped by the teams who depend on it every day."
            />

            <!-- Feature cards as a box grid: gap-px dividers reveal the wrapper's
               border-muted background; canvas-blended cells own their own p-xxl. -->
            <CardGrid
              :columns="3"
              variant="divider"
              divider-color="muted"
            >
              <div
                v-for="feat in powersFeatures"
                :key="feat.title"
                class="flex flex-col bg-[var(--bg-canvas)] p-[var(--spacing-xl)]"
              >
                <AsciiAsterisk class="mb-[var(--spacing-md)] text-[var(--primary)]" />
                <h3
                  class="mb-[var(--spacing-sm)] min-h-[2lh] max-w-[20ch] text-balance text-heading-xxs text-[var(--text-default)]"
                >
                  {{ feat.title }}
                </h3>
                <p class="flex-1 text-pretty text-body-xxs text-[var(--text-muted)]">
                  {{ feat.body }}
                </p>
              </div>
            </CardGrid>
          </section>
        </SectionContainer>
      </template>

      <!-- ── Componentes: one category's slice of the Component Grid ───────── -->
      <template v-if="isCategory">
        <BannerContainer max-width="7xl">
          <PageHeader
            size="page"
            margin-bottom=""
            :title="category.label"
            :description="category.description"
          />
        </BannerContainer>
        <SectionContainer max-width="7xl">
          <SectionModule
            :divided="false"
            :title="`${category.label} components`"
            :description="`Every ${category.label.toLowerCase()} component in the library, live and composable.`"
          >
            <ComponentGrid :category="active" />
          </SectionModule>
        </SectionContainer>
      </template>

      <!-- ── Getting Started: install + style-guide onboarding docs ───────── -->
      <HubFoundations
        v-else-if="active === 'getting-started'"
        key="getting-started"
        section="getting-started"
      />

      <!-- ── Foundations: one view per foundation (tokens/colors/type/theme/
           icons), driven by the sidebar's fanned-out "Foundations" group. ─── -->
      <HubFoundations
        v-else-if="isFoundation"
        :key="active"
        :section="foundationSection"
      />

      <!-- ── Assets: Brand / Icons / Illustrations galleries ──────────────── -->
      <HubAssets
        v-else-if="isAsset"
        :section="active"
      />

      <!-- ── Changelog: the console sample's updates. Hidden — reached only by
           /site/hub/changelog, never listed in the rail. ─────────────────── -->
      <HubChangelog v-else-if="active === 'changelog'" />

      <SiteFooter />
    </main>
  </div>
</template>
