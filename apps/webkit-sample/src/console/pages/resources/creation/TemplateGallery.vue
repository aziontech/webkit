<script setup>
  // TEMPLATEGALLERY — the Creation Center's "start from a template" pane.
  //
  // A thin host for the shared TemplateBrowser module: it declares the BANDS and their
  // reading order, the two filter axes come from ../../../lib/data/frameworks.js, and
  // selecting anything opens the deploy flow on that template's slug.
  //
  // ── THE ORDER, AND WHY IT IS THIS ONE ──
  //
  //   1. RECOMMENDED — the nine framework starters most people arrive with, which is a
  //      3×3 grid at the pane's full width. A reader who came here already knowing
  //      their framework is done in one glance, which is the common case.
  //   2. AZION TEMPLATES — the applications Azion and its partners publish, as the
  //      Marketplace's catalog ROWS. Second rather than first because the reader who
  //      wants a framework outnumbers the one shopping for a solution; second rather
  //      than last because nobody arrives at "AI Inference Starter Kit" by name, so
  //      burying it under twenty-five logos is the same as not offering it. It listed
  //      NOWHERE until now: these fourteen were reachable only three parts into the
  //      application wizard (../../applications/wizard/TemplateSourceStep.vue), on the
  //      same catalog this pane was already showing half of.
  //   3. ALL FRAMEWORKS — the other sixteen, as ROWS. The long tail is where a reader is
  //      HUNTING a name they already have in mind rather than browsing, and sixteen more
  //      centered tiles is four screens of scrolling to read sixteen titles; a row is a
  //      third of the height and leads with the title. Same catalog, same order — only
  //      the shape changes with the job.
  //
  // Every band is narrowed by the ONE filter above them, and a band a cut empties is
  // dropped whole — so filtering by "Ecommerce" collapses the pane to the five
  // templates that answer it, whichever band they came from.
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import TemplateBrowser from '../../../components/marketplace/TemplateBrowser.vue'
  import { technologyOptions, useCaseOptions } from '../../../lib/data/frameworks'
  import {
    deploySlugRoute,
    MORE_FRAMEWORKS,
    PUBLISHED_TEMPLATES,
    RECOMMENDED_CARDS
  } from '../../../lib/data/templates.js'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const SECTIONS = [
    { id: 'recommended', label: 'Recommended', kind: 'cards', items: RECOMMENDED_CARDS },
    { id: 'azion', label: 'Azion Templates', kind: 'list', items: PUBLISHED_TEMPLATES },
    { id: 'frameworks', label: 'All Frameworks', kind: 'list', items: MORE_FRAMEWORKS }
  ]

  // Clicking a card opens the deploy flow on that template's own slug — the card's slug,
  // not its technology: an Azion template and the framework starter it is built on are
  // two different templates with two different settings groups, and resolving by tech
  // would open the Next.js boilerplate for a reader who clicked the AI chatbot.
  const deployTemplate = (tpl) => {
    const target = deploySlugRoute(tpl.slug)
    router.push({ path: target.path, query: { ...target.query, email: userEmail.value } })
  }
</script>

<template>
  <!-- Its own title row is the same height as the importer's header, so either pane starts
       its content on the line the rail's first row does. `scrollable` makes the catalog the
       page's only scroll box from `lg` up, so it can grow without pushing the layout past
       the viewport. No `grid-class`: the module's default (1 / 2 / 3) is written for a
       full-width pane, which is what this is — and it is what makes the Recommended band a
       3×3, since the band holds exactly nine. -->
  <TemplateBrowser
    class="w-full min-w-0 lg:min-h-0 lg:flex-1"
    scrollable
    title="Start from Template"
    :sections="SECTIONS"
    :use-case-options="useCaseOptions"
    :technology-options="technologyOptions"
    @select="deployTemplate"
  />
</template>
