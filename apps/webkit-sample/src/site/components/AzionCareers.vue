<script setup>
  // Careers — a translation of
  // https://www.azion.com/en/careers/jobs/?area=Engineering into this site's own page
  // language, produced with the /site-design-translate flow (the live page read mechanically
  // into a band inventory, then rebuilt band by band). The source is the specification for
  // WHAT the page says; CONTAINERS.md is the specification for HOW it is drawn. Every line of
  // copy below is the source's, verbatim; none of its grid, spacing, borders, colours or radii
  // came across.
  //
  // ── THE SOURCE IS ONE BAND, AND ITS ANATOMY IS THE WHOLE BRIEF ──
  //
  // The extractor finds a single band 1280px tall. Read at the DOM, it is:
  //
  //   a breadcrumb            Careers > Jobs
  //   an h1                   We're hiring!
  //   a two-column grid       `md:grid-cols-[240px,_1fr]`
  //     · the 240px rail      the area filter — STICKY, and rendered EMPTY on the live page
  //     · the list column     a muted `Engineering` label, then six job cards
  //
  // So the page has three parts and one of them is a hole. What each becomes here:
  //
  //   breadcrumb              dropped (below)
  //   the h1                  BannerContainer hero + a FrameBox holding HeroTitle
  //   the rail                the label column of the positions frame (see below)
  //   `Engineering`           that column's content
  //   the six cards           six ruled rows in one frame, each with its own `Read more`
  //
  // ── WHERE OUR FORM DEPARTS FROM THE SOURCE, on purpose ──
  //
  //   • THE HEADLINE BECOMES A HERO. The source sets `We're hiring!` at the top of a scrolling
  //     column, 40px tall, with the list starting immediately under it. Ours is `hero` — one
  //     viewport — because that is this language's hero rule and because it is what gives the
  //     globe a band to live in. The source's single band therefore renders as a hero plus a
  //     framed column; that is a change of FORM, not of content or of running order, and the
  //     band counts on the two sides are not comparable for exactly this reason.
  //
  //   • THE EMPTY RAIL GETS A JOB. The source reserves a 240px sticky column for the area
  //     filter and the live page draws nothing in it — the control never hydrates, so what
  //     ships is a 240px hole beside the list. This language does not draw empty structural
  //     columns, and inventing the filter that column is FOR would be inventing controls the
  //     page does not render. So the rail carries the one string the source sets immediately
  //     to its right: `Engineering`, the area the list is filtered to. One column, one job, no
  //     copy added and none moved out of the band it was in.
  //
  //     It is also what the reference layout does with that column, from the other side. On
  //     Vercel's careers page the same quarter-width column is likewise blank and the list is
  //     likewise offset from it; putting the area label there is the version of that shape in
  //     which every drawn column means something.
  //
  //   • `Read more` IS A `text` BUTTON, TRAILING. The source's control is a small uppercase
  //     label with an orange arrow, sitting under the meta line; the reference's is a bordered
  //     pill on the row's right edge. Ours takes the source's WEIGHT (a label, no fill — this
  //     site's `Button kind="text"`, since Button's icon is leading-only and Link paints the
  //     product UI's blue) and the reference's PLACEMENT (trailing, so six rows share one
  //     right-hand column of targets instead of six ragged ones). It stacks under the copy
  //     below `sm`, where there is no room for a second column.
  //
  //   • NO BREADCRUMB. The source draws `Careers > Jobs` above the headline. A trail earns its
  //     place when a page is a leaf of something the reader can climb back to, and this one is
  //     not: it is a routed example reached from this app's own nav, its parent segment points
  //     off-site, and its last segment is the page you are on. So both segments went, and with
  //     them the data — nothing in `careers.js` carries the trail any more. It is the only
  //     element of the source's band this page does not render, and it is a decision about
  //     THIS surface, not a claim that the source is wrong to have one.
  //
  //   • THE HERO IS A FRAMED BOX. The headline sits inside a FrameBox that spans the page's own
  //     column and fills the band, so the two verticals every section below draws now start at
  //     the top of the page instead of under the hero, and the band's corners carry the
  //     registration marks the rest of the site's boxes do. It is `flush` top and bottom
  //     because both of those rules already exist — the nav's bottom hairline and the band's
  //     own `border-b` — and a frame that redrew them would double a hairline on each. Its
  //     padding is `--spacing-xl`, which is the inset every column of copy on this site opens
  //     at, so the h1 starts on the same vertical as the `Engineering` label below it.
  //
  //   • NO CLOSING CTA. Every other page on this site ends with `SiteCta`. This one does not:
  //     the source states no closing band, and a CTA is a band, a headline, a description and
  //     two labels — four inventions to make the page end the way its siblings do. It ends on
  //     the hatched spacer instead, which is rhythm rather than content.
  //
  // ── THE NETWORK ──
  //
  // The hero's backdrop is `network`: the map full bleed, with requests running across it.
  // Not the `map` banner's default hero, which opens at 42% and parks the artwork in the half
  // beside the copy — here the map is the GROUND, edge to edge, and the copy stands on it. The
  // composition (MapBanner bleeding, MapMesh on the same crop, the wash and the edge mask both
  // the banner's own) is in NetworkBanner, and the reasoning for each part is there.
  //
  // It earns the band rather than decorating it: this is the page where the network is the
  // employer, the roles are `Porto Alegre / São Paulo` on a platform that runs everywhere, and
  // the traffic drawn on it is requests between peers with nothing at the centre. The source's
  // own hero is empty — 1200px of column with a 40px headline in it — so there is no art here
  // we are replacing, and no `alt` of the source's that our art displaces.
  import Button from '@aziontech/webkit/button'
  import FrameBox from '@aziontech/webkit/frame-box'
  import HeroTitle from '@aziontech/webkit/hero-title'
  import { BannerContainer, SectionContainer, SectionModule } from '@shared/ui/layout/index.js'

  import { CAREERS_AREA, CAREERS_JOBS } from '../data/careers.js'
</script>

<template>
  <!-- ══ The hero ═══════════════════════════════════════════════════════════════
       BannerContainer owns the full-bleed band and the page's top rule. `--banner-offset` is
       the sticky SiteNav's height (h-14 = 3.5rem), so the band still measures exactly one
       screen with the nav above it. -->
  <BannerContainer
    hero
    banner="network"
    max-width="site"
    :padded="false"
    class="[--banner-offset:3.5rem]"
  >
    <!-- THE BAND'S OWN BOX. `:padded="false"` hands the block rhythm to this frame, and
         `-mx-(--layout-boundary-inline)` takes back the inline inset the container always
         applies — together they put the frame's four edges exactly on the band's, which is
         what makes its verticals the same two rules the sections below draw and its bottom
         the band's own. `min-h` is then the whole band (no padding to subtract), so the frame
         fills one screen and the copy centres in it.

         The copy is z-10 over the disc and stops well short of the globe's limb: the headline
         is two words and HeroTitle caps its own measure, so on every width the two occupy
         opposite halves of the band without either being positioned against the other. -->
    <FrameBox
      :flush="['top', 'bottom']"
      class="-mx-(--layout-boundary-inline) flex min-h-[calc(100dvh-var(--banner-offset,0px))] flex-col justify-center p-(--spacing-xl)"
    >
      <!-- The page's one h1, verbatim. No eyebrow, no description and no actions, because the
           source states none — the hero is the headline and the globe. -->
      <HeroTitle title="We're hiring!" />
    </FrameBox>
  </BannerContainer>

  <!-- ══ The framed column ══════════════════════════════════════════════════════ -->
  <SectionContainer max-width="site">
    <!-- ── The positions ────────────────────────────────────────────────────────
         First module in the column, so `:divided="false"` — its top edge is the hero's
         `border-b`. `:padded="false"` because the body is an edge-to-edge frame and the
         module's own padding would pull it off the column's rules.

         ONE FRAME, TWO COLUMNS, SIX ROWS, AND EVERY RULE DRAWN ONCE. The vertical between the
         label and the list is the label cell's `lg:border-r`; the rules between rows belong to
         the LOWER row (`index && border-t`), so the first row's top edge is the module's own
         and nothing is doubled. Below `lg` the grid collapses to one column in the source's
         own reading order — label, then list — and the vertical becomes the label's
         `border-b`. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <div class="grid lg:grid-cols-4">
        <!-- The rail, in TWO elements, and that is the whole trick. The CELL draws the rule and
             is left to stretch, so the vertical runs the module's full height the way a column
             rule must; the LABEL inside it is what sticks. Collapsing the two — putting
             `sticky` on the cell — needs `h-fit` to work, and `h-fit` is what stops the cell
             stretching, so the rule ends under the first row and the frame opens up with five
             rows still to go. Rendered that way once; the seam is obvious and silent.

             `lg:sticky` is the source's own behaviour for this column (its filter was meant to
             follow the list), and it is what keeps the area label in view beside a list long
             enough to scroll — the only reason a label COLUMN beats a label row. `top-14`
             clears the sticky nav, the same 3.5rem the hero subtracts. -->
        <div class="border-b border-(--border-default) lg:border-r lg:border-b-0">
          <h2 class="m-0 p-(--spacing-xl) text-body-md text-(--text-muted) lg:sticky lg:top-14">
            {{ CAREERS_AREA }}
          </h2>
        </div>

        <div class="lg:col-span-3">
          <!-- One row per posting, from the dated snapshot in data/careers.js. -->
          <article
            v-for="(job, index) in CAREERS_JOBS"
            :key="job.href"
            :class="[
              'grid gap-(--spacing-md) p-(--spacing-xl)',
              'sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center',
              index > 0 && 'border-t border-(--border-default)'
            ]"
          >
            <div class="flex flex-col gap-(--spacing-xs)">
              <h3 class="m-0 text-heading-sm text-(--text-default)">{{ job.title }}</h3>
              <p class="m-0 text-pretty text-body-md text-(--text-muted)">{{ job.meta }}</p>
            </div>

            <!-- `justify-self-start` so the control keeps its own width in the stacked layout
                 instead of stretching across the row. -->
            <Button
              label="Read more"
              kind="text"
              size="large"
              :href="job.href"
              class="justify-self-start"
            />
          </article>
        </div>
      </div>
    </SectionModule>

    <!-- The rhythm the page closes on, hatched. A bare FrameBox at SectionGap's own `medium`
         height drawing NO rules: the footer below opens with a full-bleed rule, and
         SectionGap's fixed `borders="y"` would land a second hairline on that pixel. -->
    <FrameBox
      borders="none"
      marks="none"
      hatch
      class="h-[calc(var(--spacing-xxl)*2)]"
    />
  </SectionContainer>
</template>
