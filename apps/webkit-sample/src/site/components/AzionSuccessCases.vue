<script setup>
  // The success-case library — a translation of https://www.azion.com/en/success-case/ into
  // this site's own page language, produced with the /site-design-translate flow (the live
  // page read mechanically into a band inventory, then rebuilt band by band). The source is
  // the specification for WHAT the page says; CONTAINERS.md is the specification for HOW it
  // is drawn. Every line of copy below is the source's, verbatim; none of its grid, spacing,
  // borders, colours or radii came across.
  //
  // A LIBRARY page — the first /site page whose body is a filtered index rather than an
  // argument. So the register comes from AzionLearning.vue (the other index page) and the
  // bricks from AzionRetail.vue, the page whose success-story grid this one enlarges.
  //
  // The source's 9 bands, in order, and what each becomes here:
  //
  //   0  hero (h1 + one action)                          Hero kind="screen" + Hero.Title
  //   1  three featured stories, as a carousel           CardGrid divider, 3 columns
  //   2  spacer                                          SectionGap hatch
  //   3  the library: title, three filters, 12 cards     SectionTitle + the filter row +
  //      and Load more                                   CardGrid divider, 3 columns
  //   4  spacer                                          SectionGap hatch
  //   5  three analyst recognitions                      SectionTitle + CardGrid divider
  //   6  spacer                                          SectionGap hatch
  //   7  closing CTA                                     CallToAction kind="split"
  //   8  spacer                                          the closing hatch frame
  //
  // Nothing is added and nothing is dropped: no extra band, string, list item or link label.
  // The source places four rhythm bands and so does this page: three are `SectionGap hatch`
  // and the fourth is the closing frame at band 8, which draws no rules because the footer
  // under it opens with one. Band 8 is half the height of the other three on the source, so
  // it takes SectionGap's own `small` step.
  //
  // WHERE OUR FORM DEPARTS FROM THE SOURCE, on purpose:
  //   • Band 1 is a PrimeVue carousel on the source — three slides, three page dots. This
  //     language has no carousel (.claude/rules/dependencies.md), and three cards fit one
  //     row, so they are a hairline grid and the dots go away with the mechanism.
  //   • BAND 1'S PHOTOGRAPHS ARE NOT OURS TO TAKE. The source stands each featured card on
  //     a photograph of that client's premises. We hold none of those files and do not
  //     fetch a third party's asset, so the plate is our own: the dot texture with the
  //     client's mark on it, the sector tag pinned where the source pins it.
  //   • On the source the whole featured card is one anchor with a `Read story` button
  //     nested inside it — invalid, and two stops on one destination. Here the control IS
  //     the link, which is what the library cards below already do.
  //   • Band 3's `//` before `MARKET RECOGNITION` and `BUILD` is SectionTitle's and
  //     CallToAction's own overline anatomy, not a string from the source.
  //   • THE FILTERS ARE REAL. The source renders three pickers, an applied-filter row and a
  //     `Load more`; a translation that drew them dead would be drawing a picture of a page.
  //     They are `Select`s over this page's own data, and every label in them — `Industry`,
  //     `Solutions`, `Products`, `All`, `Filtered by`, `Load more`, and the empty state's
  //     sentence — is the source's own string, read out of its filter-block payload.
  //   • The option lists are alphabetical. The source builds its own from the same values
  //     but renders them only on open, so there is no order in the inventory to honour.
  //   • The source renders 12 of its 35 stories and reveals the rest through `Load more`.
  //     This page renders the same 12 in the same order, and its `Load more` reveals the
  //     same rest — the extra copy is the source's own, shipped in its own page payload.
  //
  // ASSET GAPS — marks the source draws that this repo has no file for. Each one keeps its
  // cell and falls back to ClientMark's typographic wordmark (the client's name in our own
  // type, never a facsimile of its lockup): Ibero and Todo Cartões among the twelve the page
  // opens on, and Mobiauto, Quero-Quero, Digi+, FAM, B2W, GetNinjas, Uninter, UniCesumar and
  // Omelete behind `Load more`.
  import Button from '@aziontech/webkit/button'
  import CallToAction from '@aziontech/webkit/call-to-action'
  import CardGrid from '@aziontech/webkit/card-grid'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FrameBox from '@aziontech/webkit/frame-box'
  import Hero from '@aziontech/webkit/hero'
  import MiniButton from '@aziontech/webkit/mini-button'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import Select from '@aziontech/webkit/select'
  import Tag from '@aziontech/webkit/tag'
  import TextureMaterial from '@aziontech/webkit/texture-material'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  import { computed, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  import { ANALYST_RECOGNITIONS, FEATURED_CASES, SUCCESS_CASES } from '../data/success-cases.js'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  // The source's own labels, kept in one place so the pickers, the applied row, the control
  // and the empty state cannot drift from each other or from the page they came off.
  const LABEL = {
    all: 'All',
    industry: 'Industry',
    products: 'Products',
    solutions: 'Solutions',
    filteredBy: 'Filtered by',
    loadMore: 'Load more',
    notFound: 'No results found for these applied filters.'
  }

  // How many stories the source shows before its control, and therefore how many this page
  // opens on and how many each press reveals.
  const PAGE_SIZE = 12

  // A picker holds '' while it narrows nothing, which is what puts its own name on the
  // trigger — the source's pickers read `Industry` / `Solutions` / `Products` until one is
  // chosen, and `All` is the option that returns to that state.
  const industry = ref('')
  const solution = ref('')
  const product = ref('')
  const shown = ref(PAGE_SIZE)

  const options = (values) => [
    { label: LABEL.all, value: '' },
    ...[...new Set(values)].sort((a, b) => a.localeCompare(b)).map((v) => ({ label: v, value: v }))
  ]

  const industryOptions = computed(() => options(SUCCESS_CASES.map((story) => story.industry)))
  const solutionOptions = computed(() => options(SUCCESS_CASES.flatMap((story) => story.solutions)))
  const productOptions = computed(() => options(SUCCESS_CASES.flatMap((story) => story.products)))

  const filtered = computed(() =>
    SUCCESS_CASES.filter(
      (story) =>
        (industry.value === '' || story.industry === industry.value) &&
        (solution.value === '' || story.solutions.includes(solution.value)) &&
        (product.value === '' || story.products.includes(product.value))
    )
  )

  const visible = computed(() => filtered.value.slice(0, shown.value))
  const hasMore = computed(() => shown.value < filtered.value.length)

  // The chips the source prints after `Filtered by:` — the applied values, or its own `All`
  // when nothing narrows the list.
  const applied = computed(() => {
    const picked = [industry.value, solution.value, product.value].filter(Boolean)
    return picked.length > 0 ? picked : [LABEL.all]
  })

  watch([industry, solution, product], () => {
    shown.value = PAGE_SIZE
  })

  // A divider grid places its cells in source order, so an incomplete last row would leave
  // the seam under it open. One filled cell per empty track closes the rectangle.
  const grid = (count, columns) => Array.from({ length: (columns - (count % columns)) % columns })
</script>

<template>
  <!-- ══ Band 0 — the hero ══════════════════════════════════════════════════════
       Hero owns the full-bleed band and the page's top rule. `--banner-offset` is the
       sticky SiteNav's height (h-14 = 3.5rem), so the band still measures exactly one
       screen with the nav above it. -->
  <Hero
    kind="band"
    size="large"
    max-width="site"
    texture="dots"
    texture-fade="top"
  >
    <Hero.Title
      centered
      title="Trusted by Leading Companies"
    >
      <template #actions>
        <Button
          label="Start Free"
          kind="secondary"
          size="large"
          @click="goSignup"
        />
      </template>
    </Hero.Title>
  </Hero>

  <!-- ══ The framed column ══════════════════════════════════════════════════════
       Every band below the hero is a brick inside one centered column. The column carries
       only `border-x`; its top edge is the hero's `border-b` and its bottom edge the
       SiteFooter's `border-t`. Each brick is `flush` with `borders="y"`, which lands its
       top rule ON the one above and hands the vertical rules back to the column — so no
       line on this page is drawn twice. -->
  <SectionContainer max-width="site">
    <!-- ── Band 1 — the three featured stories ──────────────────────────────────
         First brick in the column, so `:divided="false"` — its top edge is the hero's own
         full-bleed rule. The rules between the cells are the grid's `gap-px`, so each cell
         draws no border and fills `--bg-canvas`. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          kind="divider"
          :columns="3"
        >
          <div
            v-for="story in FEATURED_CASES"
            :key="story.key"
            class="flex flex-col gap-(--spacing-lg) bg-(--bg-canvas) p-(--spacing-xl)"
          >
            <!-- Our plate, not the source's photograph: the mark on the dot field, with
                 the sector tag pinned to the corner the source pins it to. -->
            <div
              class="relative flex aspect-video items-center justify-center overflow-hidden bg-(--bg-surface)"
            >
              <TextureMaterial
                kind="dots"
                size="large"
                fade="vignette"
              />
              <ClientMark
                :client="story.client"
                monochrome
                mark="relative z-10 h-8 w-auto max-w-40 object-contain"
              />
              <Tag
                severity="secondary"
                size="small"
                class="absolute right-(--spacing-md) top-(--spacing-md) z-10"
                >{{ story.tag }}</Tag
              >
            </div>

            <h2 class="m-0 flex-1 text-pretty text-heading-sm text-(--text-default)">
              {{ story.description }}
            </h2>

            <MiniButton
              label="Read story"
              show-icon
              icon="pi pi-arrow-right"
              :href="story.href"
              target="_blank"
            />
          </div>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <!-- Band 2 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 3 — the library ─────────────────────────────────────────────────
         Three source regions, one module: the title in the `#header` slot, the filter row
         in the first frame, the grid `flush` under it. The filter frame draws its own floor
         and the grid takes it as its top rule, so the two meet on one hairline. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          kind="left"
          title="Organizations shaping the future of the web with us"
        />
      </template>

      <FrameBox
        flush
        borders="y"
      >
        <div
          class="flex flex-col gap-(--spacing-lg) p-(--spacing-xl)"
          role="group"
          aria-label="Filter the success-case library"
        >
          <div class="flex flex-wrap gap-(--spacing-md)">
            <Select
              v-model="industry"
              :placeholder="LABEL.industry"
              size="medium"
              class="w-full sm:w-56"
            >
              <Select.Trigger :aria-label="LABEL.industry" />
              <Select.Content>
                <Select.Option
                  v-for="option in industryOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Option>
              </Select.Content>
            </Select>

            <Select
              v-model="solution"
              :placeholder="LABEL.solutions"
              size="medium"
              class="w-full sm:w-56"
            >
              <Select.Trigger :aria-label="LABEL.solutions" />
              <Select.Content>
                <Select.Option
                  v-for="option in solutionOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Option>
              </Select.Content>
            </Select>

            <Select
              v-model="product"
              :placeholder="LABEL.products"
              size="medium"
              class="w-full sm:w-56"
            >
              <Select.Trigger :aria-label="LABEL.products" />
              <Select.Content>
                <Select.Option
                  v-for="option in productOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Option>
              </Select.Content>
            </Select>
          </div>

          <p
            aria-live="polite"
            class="m-0 flex flex-wrap items-center gap-(--spacing-xs) text-body-sm text-(--text-muted)"
          >
            {{ LABEL.filteredBy }}:
            <Tag
              v-for="value in applied"
              :key="value"
              severity="secondary"
              size="small"
              >{{ value }}</Tag
            >
          </p>
        </div>
      </FrameBox>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          v-if="visible.length > 0"
          kind="divider"
          :columns="3"
        >
          <!-- The card is NOT the anchor, as it is not on the source: the pills and the
               summary would become link text, and `Read story` is the control the source
               gives each story. -->
          <div
            v-for="story in visible"
            :key="story.key"
            class="flex flex-col gap-(--spacing-lg) bg-(--bg-canvas) p-(--spacing-xl)"
          >
            <div class="flex h-6 items-center text-(--text-default)">
              <ClientMark
                :client="story.client"
                monochrome
                mark="h-full w-auto max-w-40 object-contain"
              />
            </div>

            <ul class="m-0 flex list-none flex-wrap gap-(--spacing-xs) p-0">
              <li
                v-for="tag in story.tags"
                :key="tag"
              >
                <Tag
                  severity="secondary"
                  size="small"
                  >{{ tag }}</Tag
                >
              </li>
            </ul>

            <p class="m-0 flex-1 text-pretty text-body-sm text-(--text-muted)">
              {{ story.description }}
            </p>

            <MiniButton
              label="Read story"
              show-icon
              icon="pi pi-arrow-right"
              :href="story.href"
              target="_blank"
              :aria-label="`Read story: ${story.client.name} (opens in a new tab)`"
            />
          </div>

          <div
            v-for="(_, index) in grid(visible.length, 3)"
            :key="`filler-${index}`"
            class="bg-(--bg-canvas)"
            aria-hidden="true"
          />
        </CardGrid>

        <!-- The source's own sentence for a combination that matches nothing. -->
        <EmptyState
          v-else
          :title="LABEL.notFound"
          icon="pi pi-search"
          class="p-(--spacing-xxl)"
        />
      </FrameBox>

      <FrameBox
        v-if="hasMore"
        flush
        borders="y"
        marks="bottom"
      >
        <div class="flex justify-center p-(--spacing-xl)">
          <Button
            :label="LABEL.loadMore"
            kind="outlined"
            size="large"
            @click="shown += PAGE_SIZE"
          />
        </div>
      </FrameBox>
    </SectionModule>

    <!-- Band 4 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 5 — what the analysts say ───────────────────────────────────────
         Two source bands, one module: the title in the `#header` slot, the three
         recognitions on the grid's own seams. `justify-between` floors the mark, its source
         line and the control, so the row shares one baseline whatever length each quote
         runs to. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="MARKET RECOGNITION"
          title="What analysts say about Azion"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          kind="divider"
          :columns="3"
        >
          <figure
            v-for="award in ANALYST_RECOGNITIONS"
            :key="award.key"
            class="m-0 flex flex-col gap-(--spacing-lg) bg-(--bg-canvas) p-(--spacing-xl)"
          >
            <!-- The source's own tag, down to its star. -->
            <Tag
              severity="primary"
              size="small"
              icon="pi pi-star-fill"
              class="self-start"
              >Award</Tag
            >

            <p class="m-0 flex-1 text-pretty text-heading-xs text-(--text-default)">
              {{ award.text }}
            </p>

            <figcaption class="flex flex-col gap-(--spacing-sm)">
              <ClientMark
                :client="award.client"
                mark="h-8 w-auto self-start"
              />
              <p class="m-0 text-body-sm text-(--text-muted)">{{ award.source }}</p>
            </figcaption>

            <MiniButton
              label="Read article"
              show-icon
              icon="pi pi-arrow-right"
              :href="award.href"
              target="_blank"
            />
          </figure>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <!-- Band 6 — spacer. -->
    <SectionGap hatch />

    <!-- ── Band 7 — the closing CTA ─────────────────────────────────────────────
         The Site's own closing band, with this page's strings passed in. Its defaults are
         the homepage's copy, so every string the source states here is explicit. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <CallToAction
        framed
        kind="split"
        eyebrow="Build"
        title="Build once."
        title-muted="Run everywhere."
        description="Get a faster path to launch, lower latency, and less infrastructure overhead."
      >
        <template #actions>
          <Button
            label="Start Free"
            kind="secondary"
            size="large"
            @click="goSignup"
          />
        </template>
        <template #aside>
          <Button
            label="Talk to our team"
            kind="outlined"
            size="large"
            href="/site/contact"
            icon="pi pi-chevron-right"
            icon-position="trailing"
            animated
          />
        </template>
      </CallToAction>
    </SectionModule>

    <FrameBox
      borders="none"
      marks="all"
      data-hatch="true"
      class="h-[calc(var(--spacing-xxl)*2)]"
    >
      <TextureMaterial kind="lines" />
    </FrameBox>
  </SectionContainer>
  <!-- ══ End framed column ══════════════════════════════════════════════════════ -->
</template>
