<script setup>
  // Product page example: Azion Functions (Figma `Assets` node 1684:7260), composed
  // entirely from @aziontech/webkit components, the site's layout primitives and theme
  // tokens. Rendered inside SiteLayout (website nav + footer, no console sidebar).
  //
  // Sections, top to bottom, as the design lays them out:
  //
  //   hero            split band, one screen tall — the claim on the left, the runtime as
  //                   art on the right, the client marks standing on its floor
  //   two-up          "familiar frameworks" | "serverless runtime", one illustration each
  //   code            "hello world → full-stack", beside the sample it is talking about
  //   quote           one client sentence, signed, over the pixelate strip
  //   products        the platform's primitives, four columns
  //
  // Layout is the framed grid of CONTAINERS.md — the same three-layer skeleton AzionHome
  // uses, so the two pages read as one site:
  //
  //   BannerContainer hero  → the full-bleed hero band, one viewport tall, owning the
  //                           page's top rule (border-b).
  //   SectionContainer      → the centered column below, owning border-x.
  //   SectionModule         → each brick inside it, owning its own padding (which is why
  //                           the column is unpadded).
  //
  // The footer owns border-t, so every edge of the frame is drawn exactly once. Where a
  // brick meets a rule it does not own it draws nothing: every FrameBox in here is `flush`
  // with `borders="y"`, which lands its top rule ON the one above and hands the vertical
  // rules back to the column. The design's `Spacer` instances are SectionGap, hatched — the
  // gap is the one band with no content of its own, so the frame's texture reads as the
  // page's own material there instead of competing with copy.
  //
  // Figma → ours, where the two disagree:
  //   • The design's hero column clips at 662px, which cuts off the pill field drawn
  //     under the globe. It renders here — see FunctionsHeroCanvas.
  //   • Its globe is a photograph under a pixelate effect; ours is the registered
  //     `pixelate` backdrop clipped to a circle (same note).
  //   • A few product rows in the ProductsMenu carry unfilled placeholders
  //     ("ProductName", "What this product does", "Alert users to updates…"). Those rows
  //     take the one-liners AzionHome already uses for the same products, so the two
  //     pages cannot describe one product two ways.
  //   • Its `LABEL LABEL LABEL` code tabs are placeholders for tabs nobody wrote; the two
  //     real ones ship.
  import Button from '@aziontech/webkit/button'
  import CodeBlock from '@aziontech/webkit/code-block'
  import FrameBox from '@aziontech/webkit/frame-box'
  import HeroTitle from '@aziontech/webkit/hero-title'
  import Illustration from '@aziontech/webkit/illustration'
  import Overline from '@aziontech/webkit/overline'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionTitle from '@aziontech/webkit/section-title'
  // Imported from the banner registry directly rather than named through a container's
  // `banner` prop: here the field backs a cell of a frame and a strip inside one, neither
  // of which is a BannerContainer. The registry still owns it — this is its named export.
  import { PixelateBanner } from '@shared/ui/banners/index.js'
  import BrandCarousel from '@shared/ui/brand/BrandCarousel.vue'
  // The tile is a client mark, so it lives in `ui/clients/` with the others — but it is
  // NOT a CLIENTS entry: the registry's entries are trust-strip marks (transparent
  // artwork, classified by fill), and this is Contabilizei's opaque brand tile, used as
  // the art of one quote. Adding it to the registry would put it in every strip on the
  // site, at 48px, as a blue square.
  import contabilizeiTile from '@shared/ui/brand/clients/contabilizei-symbol.png'
  import {
    BannerContainer,
    CardGrid,
    SectionContainer,
    SectionModule
  } from '@shared/ui/layout/index.js'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import { useScrollProgress } from '../composables/useScrollProgress.js'
  import FrameworkStackScene from '../ui/FrameworkStackScene.vue'
  import FunctionsHeroCanvas from '../ui/FunctionsHeroCanvas.vue'
  import { CLIENTS, NavColumn, NavItem } from '../ui/index.js'

  const router = useRouter()
  const goSignup = () => router.push('/signup')

  // ── The client mark seats itself, both ways ───────────────────────────────────
  // The quote band's brand tile rides the scroll: a screen away it rests a third of its own
  // height high, with the strip's grain showing under it, and it comes down to land flush on
  // the frame's bottom rule as the band reaches the middle of the viewport. Scroll back up and
  // it lifts again — the piece is seated by WHERE THE PAGE IS, not by a one-shot that fires
  // when the band is first seen and then never says anything again.
  //
  // `SEAT_SPAN` is how much of that travel happens in the last stretch: seating completes when
  // the tile's centre is 0.55 of a viewport from the middle, so the piece is fully home while
  // the quote is still comfortably on screen rather than at the instant it leaves.
  const LIFT = 34
  const SEAT_SPAN = 0.55

  const tile = ref(null)
  const { progress: tileProgress } = useScrollProgress(tile)

  // 1 when seated, 0 when fully lifted. `progress` is signed — negative once the band is above
  // the middle of the viewport — and clamping the negative side to 0 is what keeps the piece
  // home up there instead of lifting again out the other side.
  const seated = computed(() => {
    const approach = Math.max(0, tileProgress.value)
    return Math.min(1, Math.max(0, 1 - approach / SEAT_SPAN))
  })

  const tileStyle = computed(() => ({
    translate: `0 ${(1 - seated.value) * LIFT}%`
  }))

  // ── The code sample ───────────────────────────────────────────────────────────
  // The design shows a file-upload handler under a `github.com/aziontech/azion-samples`
  // bar, with a second tab for transactional email. Both are written out in full: the
  // panel's whole point is that a reader can copy what it shows, and the hero's own
  // snippet is the middle of the first one — same sample, twice on the page, so the two
  // have to agree line for line.
  //
  // `IMPORT` is spliced in rather than written literally because the reference validator
  // (.claude/hooks/validate-references.mjs) reads any line of this FILE that starts with
  // `import` as an import of this component, and would block the write over `hono` and
  // `azion/storage` — dependencies of the sample, not of the site.
  const IMPORT = 'import'

  const FILE_UPLOAD = `${IMPORT} type { AzionBucketObject, AzionStorageResponse } from "azion/storage";
${IMPORT} { createObject } from "azion/storage";
${IMPORT} { Hono } from "hono";

const app = new Hono();

app.post("/upload", async (c) => {
  const body = await c.req.parseBody();
  const file = body["file"]; // File | string

  // First check if file is a valid File object
  if (
    !file ||
    typeof file !== "object" ||
    typeof file.arrayBuffer !== "function"
  ) {
    return c.json({ message: "Invalid file" }, 400);
  }

  const { data: newObject } = (await createObject({
    bucket: "uploads",
    key: file.name,
    content: await file.arrayBuffer(),
  })) as AzionStorageResponse<AzionBucketObject>;

  return c.json({ key: newObject?.key }, 201, {
    "Content-Type": file.type,
    "Content-Disposition": \`attachment; filename="\${newObject?.key}"\`,
    "Content-Length": newObject?.size?.toString() ?? "0",
  });
});

export default app;`

  const TRANSACTIONAL_EMAIL = `${IMPORT} { Hono } from "hono";

const app = new Hono();

app.post("/welcome", async (c) => {
  const { email, name } = await c.req.json();

  // The API key lives in the workload's environment, never in the bundle
  const sent = await fetch("https://api.provider.com/v1/messages", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${Azion.env.get("EMAIL_API_KEY")}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: email,
      subject: "Welcome aboard",
      text: \`Hi \${name}, your account is ready.\`,
    }),
  });

  if (!sent.ok) {
    return c.json({ message: "Could not send the email" }, 502);
  }

  return c.json({ queued: true }, 202);
});

export default app;`

  // One CodeBlock, two tabs, one file-name bar: the samples live in one repository, so
  // the bar names the repository rather than a file — which is what the design shows.
  const codeTabs = [
    {
      label: 'File upload',
      value: 'file-upload',
      language: 'typescript',
      code: FILE_UPLOAD,
      fileName: 'github.com/aziontech/azion-samples',
      fileIcon: 'pi pi-github'
    },
    {
      label: 'Send transactional emails',
      value: 'transactional-email',
      language: 'typescript',
      code: TRANSACTIONAL_EMAIL,
      fileName: 'github.com/aziontech/azion-samples',
      fileIcon: 'pi pi-github'
    }
  ]

  // ── The platform's primitives ─────────────────────────────────────────────────
  // The design's ProductsMenu: four capability columns, each a list of products with a
  // one-line description. One <NavColumn> per capability, one <NavItem> per product —
  // the site's own link set, built to the Figma pair — exactly as on AzionHome.
  //
  // Every row is a link — the hover state the design draws only exists on one. `href`
  // falls back to the placeholder `#` for products with no page in the sample, the same
  // convention the mega-menu rows in SiteNav use.
  const productGroups = [
    {
      label: 'Compute',
      items: [
        {
          icon: 'ai ai-edge-functions',
          title: 'Functions',
          description: 'Run code globally'
        },
        { icon: 'pi pi-sitemap', title: 'Rules', description: 'Control traffic routing' },
        {
          icon: 'ai ai-load-balancer',
          title: 'Load Balancer',
          description: 'Distribute traffic with high availability'
        },
        {
          icon: 'pi pi-image',
          title: 'Image Processor',
          description: 'Optimize and transform images'
        }
      ]
    },
    {
      label: 'AI',
      items: [
        {
          icon: 'ai ai-edge-ai',
          title: 'AI Inference',
          description: 'Run low-latency models'
        },
        { icon: 'ai ai-gateway', title: 'AI Gateway', description: 'Govern and route LLMs' }
      ]
    },
    {
      label: 'Data',
      items: [
        {
          icon: 'ai ai-edge-storage',
          title: 'Object Storage',
          description: 'Store and deliver globally'
        },
        {
          icon: 'ai ai-edge-sql',
          title: 'SQL Database',
          description: 'Distributed SQL database'
        },
        { icon: 'ai ai-edge-kv', title: 'KV Store', description: 'Key-value data store' },
        {
          icon: 'ai ai-tiered-cache',
          title: 'Cache',
          description: 'Accelerate delivery and availability'
        }
      ]
    },
    {
      label: 'Security',
      items: [
        {
          icon: 'ai ai-waf-rules',
          title: 'Web Application Firewall',
          description: 'Smart way to block threats'
        },
        {
          icon: 'ai ai-azion-api',
          title: 'API Gateway',
          description: 'Authenticate and protect APIs'
        },
        {
          icon: 'pi pi-android',
          title: 'Bot Management',
          description: 'Stop bots, prevent abuse'
        },
        { icon: 'ai ai-edge-dns', title: 'DNS', description: 'High-performance DNS' }
      ]
    }
  ]
</script>

<template>
  <!-- ── Hero — the split band, exactly one viewport tall ──────────────────────
       BannerContainer owns the full-bleed band and the page's top rule; the content is
       its z-10 copy on plain canvas — the band carries no backdrop, the art half brings
       its own. `--banner-offset` is the sticky SiteNav's height (h-14 = 3.5rem), so the
       hero still measures one screen with the nav above it.

       The design splits the 1512px frame down the middle — 756 of copy, 756 of art — so
       from `lg` up the art half takes half the BANNER, not half the band's centered
       column. That is the `right-[calc(50%-50vw)] w-[50vw]` pair below: the copy stays
       registered to the column like every other block on the page, and the field reaches
       the viewport's own edge.

       The band holds THREE things, top to bottom: the copy, the art half beside it, and the
       trust strip standing on the floor. The strip is part of the hero, not a band under it —
       so the wrapper declares the band's own height (`100dvh - --banner-offset`, less the
       container's padding) and hands the leftover to the copy with `justify-between`. That
       makes the band's `justify-center` a no-op instead of something to fight, and it is what
       puts the strip on the bottom edge of one screen rather than a scroll below it. -->
  <BannerContainer
    hero
    max-width="7xl"
    class="[--banner-offset:3.5rem]"
  >
    <div
      class="relative flex min-h-[calc(100dvh-var(--banner-offset,0px)-var(--spacing-xl)*2)] flex-col justify-between gap-(--spacing-xxl)"
    >
      <!-- `grid-cols-1` explicitly, not just the implicit single column: an implicit track is
           `auto`, which sizes to its content's MAX-CONTENT width — and the art half's rows are
           `w-max` and far wider than a phone. That pushed the whole column past the viewport
           and stretched the CTAs off-screen with it. `grid-cols-1` is `minmax(0, 1fr)`, which
           clamps the intrinsic contribution to zero and keeps the column at the band's width. -->
      <div
        class="relative grid flex-1 grid-cols-1 items-center gap-(--spacing-xxl) lg:grid-cols-2"
      >
        <!-- Hero copy anatomy: overline → headline → actions. No description — the design
           opens on the claim alone, and the runtime's own inventory (the pill field in the
           art half) is what elaborates it.

           The headline carries the design's line break as a real newline in the prop, which
           `whitespace-pre-line` on the h1 then honours. It is two sentences, and the break
           is between them — a width cap cannot express that (`Write once. Run` is SHORTER
           than `Run at the edge.`, so any measure that forbids the first allows the second
           and `text-balance` splits them 14/14 instead). -->
        <HeroTitle
          eyebrow="Functions"
          title="Write once.
Run at the edge."
          class="min-w-0 [&>h1]:whitespace-pre-line"
        >
          <template #actions>
            <Button
              label="Start Free"
              kind="secondary"
              size="large"
              @click="goSignup"
            />
            <Button
              label="Docs"
              kind="outlined"
              size="large"
              href="/site/docs"
            />
          </template>
        </HeroTitle>

        <!-- Below `lg` it is the grid's second row, stacked under the copy at the column's
           width. From `lg` it leaves the flow and takes the right half of the viewport:
           `w-[50vw]` for the width, and `right-[calc(50%-50vw)]` to push its right edge out
           to the viewport's — the standard break-out, correct here because the column is
           centered (`mx-auto`), so half the difference between the column and the viewport
           is exactly the inset to cancel. The band's own `overflow-hidden` is what keeps
           50vw from becoming a horizontal scrollbar.

           Its HEIGHT is `inset-y-0` against the COPY GRID, which is the flex column's
           `flex-1` child — so it fills everything the band has left after the trust strip
           takes its own height, and not one pixel more. Declaring the band's full height here
           instead (as an earlier pass did) ran the field down behind the marks; the grid is
           already exactly the region the field is allowed to have.

           The `-translate-y-[xl]` on top of that lifts the whole field one step: seated in
           the grid exactly, its densest rows sat below the headline's own centre line, and the
           band's `overflow-hidden` is what absorbs the step it gains at the top. It moves the
           bottom edge up by the same step, so it stays clear of the trust strip.

           The grid keeps `lg:grid-cols-2` with the field out of flow, so the copy still
           occupies the first column and never runs under it. -->
        <div
          class="lg:absolute lg:inset-y-0 lg:right-[calc(50%-50vw)] lg:w-[50vw] lg:-translate-y-(--spacing-xl)"
        >
          <FunctionsHeroCanvas />
        </div>
      </div>

      <!-- The trust strip, standing on the floor of the band — inside the hero, not a band
           under it, so the whole claim (headline, runtime, proof) is one screen.

           No label — the design's band is the marks alone. `monochrome` is the strip's own
           rule: one ink, so twelve brand palettes in one row do not become the loudest thing
           on the page. -->
      <BrandCarousel
        monochrome
        :clients="CLIENTS"
      />
    </div>
  </BannerContainer>

  <!-- ══ The framed column ═════════════════════════════════════════════════════
       Everything below the hero is a stack of bricks inside one centered column. The column
       carries only `border-x`; its top edge is the hero band's `border-b` and its bottom edge
       the SiteFooter's `border-t`. -->
  <SectionContainer max-width="5xl">
    <!-- The design opens the column with a Spacer. As the first frame in the column its
         `flush` top rule lands on the hero's border-b, and its bottom rule is what
         divides it from the module below — which is why that module passes
         `:divided="false"` and draws none of its own. -->
    <SectionGap hatch />

    <!-- ── Two-up: the two things the runtime is ────────────────────────────────
         Two cells of one frame, each an illustration over its own copy and one action.
         The rule between them is the right cell's (`lg:border-l`); the frame owns the top
         and bottom, the column the sides.

         `justify-between` in each cell is what lines the two halves up: the illustration
         hangs from the top edge, the action stands on the floor, so the headings meet on
         one line however long the paragraphs run. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="grid lg:grid-cols-2">
          <div class="flex flex-col justify-between gap-(--spacing-xxl) p-(--spacing-xl)">
            <div class="flex items-center justify-center py-(--spacing-lg)">
              <FrameworkStackScene />
            </div>

            <div class="flex flex-col items-start gap-(--spacing-lg)">
              <div class="flex flex-col gap-(--spacing-md)">
                <h2 class="m-0 text-balance text-heading-md text-(--text-default)">
                  Build with familiar frameworks
                </h2>
                <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                  Write Functions in TypeScript or JavaScript and ship with the frameworks you
                  already use.
                </p>
              </div>
              <Button
                label="Read Azion Docs"
                kind="outlined"
                size="large"
                icon="pi pi-book"
                href="/site/docs"
              />
            </div>
          </div>

          <div
            class="flex flex-col justify-between gap-(--spacing-xxl) border-t border-(--border-default) p-(--spacing-xl) lg:border-l lg:border-t-0"
          >
            <!-- The `azion-highlight` asset, by name: the mark framed by two offset square
                 scaffolds — the design's own second illustration, already in the library,
                 so it is selected rather than redrawn. -->
            <div class="flex items-center justify-center py-(--spacing-lg)">
              <Illustration
                name="azion-highlight"
                size="large"
                aria-label="The Azion runtime, framed"
              />
            </div>

            <div class="flex flex-col items-start gap-(--spacing-lg)">
              <div class="flex flex-col gap-(--spacing-md)">
                <h2 class="m-0 text-balance text-heading-md text-(--text-default)">
                  Serverless runtime built for modern workloads
                </h2>
                <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                  Use Functions as a programmable layer between users, storefronts, APIs, and
                  origins. Adapt requests in real time without changing your backend architecture.
                </p>
              </div>
              <Button
                label="Read Azion Docs"
                kind="outlined"
                size="large"
                icon="pi pi-book"
                href="/site/docs"
              />
            </div>
          </div>
        </div>
      </FrameBox>
    </SectionModule>

    <!-- ── Code — the argument beside the sample ────────────────────────────────
         No gap between this frame and the one above: the design butts the two together,
         so `flush` lands this frame's top rule on that frame's bottom one.

         The block is deliberately taller than its cell. The design overhangs it (a 576px
         block in a 480px frame) so the snippet reads as a file that continues past the
         page rather than as a listing that happens to end; the cell clips it and a scrim
         fades the cut so it reads as intentional. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="grid lg:grid-cols-[4fr_5fr]">
          <div class="flex flex-col justify-between gap-(--spacing-xxl) p-(--spacing-xl)">
            <div class="flex flex-col gap-(--spacing-lg)">
              <h2 class="m-0 text-balance text-heading-md text-(--text-default)">
                From hello world to full-stack applications
              </h2>
              <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                Run application logic with the resources a full-stack product needs: relational
                data, low-latency state, object storage, and AI responses through Azion libraries.
              </p>
            </div>

            <div
              class="flex flex-col items-stretch gap-(--spacing-sm) sm:flex-row sm:items-center"
            >
              <Button
                label="Read Azion Docs"
                kind="secondary"
                size="large"
                icon="pi pi-book"
                href="/site/docs"
              />
              <Button
                label="See Github"
                kind="outlined"
                size="large"
                icon="pi pi-github"
                href="https://github.com/aziontech"
                target="_blank"
              />
            </div>
          </div>

          <!-- The sample, on the pixelate field the design puts behind it. The cell is
               `overflow-hidden` for both reasons at once: the backdrop is a full-bleed z-0
               layer that needs a positioned box to fill, and it is what crops the block's
               tail at the frame's edge. -->
          <div
            class="relative min-w-0 overflow-hidden border-t border-(--border-default) bg-(--bg-surface) lg:border-l lg:border-t-0"
          >
            <!-- Held down and faded at the edges. At full strength the field is a hard
                 regular grid the whole width of the cell, which competes with the code's
                 own rows; the design's is one soft ellipse behind the block. The mask is
                 what makes it read as a pool rather than as wallpaper. -->
            <div
              aria-hidden="true"
              class="pointer-events-none absolute inset-0 opacity-60 mask-[radial-gradient(120%_100%_at_15%_50%,black_10%,transparent_85%)]"
            >
              <PixelateBanner />
            </div>
            <div class="relative z-10 max-h-[32rem] overflow-hidden p-(--spacing-xl) pb-0">
              <!-- Wrapped so the elevation is cast by a shell of the block's own shape:
                   CodeBlock rounds to --shape-elements and clips its overflow, so the
                   shadow goes on a wrapper at the same radius instead of being clipped
                   away. `animate-lines` is CodeBlock's own staggered line entrance, which
                   ships with its motion-reduce fallback. -->
              <div class="min-w-0 rounded-(--shape-elements) shadow-(--shadow-sm)">
                <CodeBlock
                  :tabs="codeTabs"
                  default-value="file-upload"
                  show-line-numbers
                  animate-lines
                  copy-aria-label="Copy the file upload sample"
                />
              </div>
            </div>
            <!-- The cut, faded: the block ends at the frame's floor, not at a line the
                 reader is meant to read to. -->
            <div
              class="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-(--spacing-xxl) bg-gradient-to-b from-transparent to-(--bg-surface)"
            />
          </div>
        </div>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── One client, one sentence ─────────────────────────────────────────────
         The design's quote band: the sentence held against the left rule, the client's own
         brand tile standing on the pixelate strip that closes the frame. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div class="flex flex-col">
          <!-- `blockquote` and `figcaption` are DIRECT children of the figure — HTML pairs a
               caption with a quotation only at that depth — so the PADDING is the figure's,
               not theirs. Padding on the blockquote would come out of its own measure
               (border-box), which held the quote 200px inside the 576px it declares. The
               strip below is the frame's, not the quotation's, so it sits outside the figure
               and keeps its full bleed. -->
          <figure class="m-0 flex flex-col gap-(--spacing-xl) p-(--spacing-xxl)">
            <!-- 24px on a 1.3 leading is `text-heading-md` — a quotation set at the size of a
                 section's own sub-heading rather than as a display line.

                 No `text-pretty` here, unlike every paragraph on the page: on a five-line
                 quotation Chromium's `pretty` shortens every line to even out the last one,
                 which is a paragraph treatment. Greedy wrapping fills the measure and lands
                 the design's four lines. -->
            <blockquote class="m-0 max-w-[36rem] text-heading-md text-(--text-default)">
              &ldquo;With Azion, Contabilizei improved request delivery at the Edge, reduced
              infrastructure costs, and gained fast access to support whenever needed.&rdquo;
            </blockquote>

            <!-- The signature: the name in the accent, the role beside it in the default ink,
                 both in the overline's mono uppercase — the design's own pairing. -->
            <figcaption
              class="flex flex-col gap-(--spacing-xs) sm:flex-row sm:items-center sm:gap-(--spacing-xl)"
            >
              <Overline>Fabrício Santos</Overline>
              <span class="px-1 text-overline-md uppercase text-(--text-default)">
                DevSecOps Manager at Contabilizei
              </span>
            </figcaption>
          </figure>

          <!-- The strip that closes the frame, and the client's mark as a piece that fits
               into it. The design puts a 178px square at x=794 of 1280 with the pixelate
               field running to either side; here the field is one continuous strip and the
               square sits ON it, at the same 62% — same picture, one fewer seam to keep
               aligned, and the mark is now free to move.

               THE PIECE RIDES THE SCROLL. A screen away it rests a third of its own height
               high, so the strip's grain shows under it and it reads as a piece not yet seated;
               it comes down as the band rises through the viewport and lands flush on the
               frame's bottom rule — square edges, no radius, the strip's dots resuming either
               side of it: a piece pressed into its socket. Scrolling back up lifts it again.

               The offset is an inline `translate` driven by scroll position, with no transition
               on it: a transition would make the piece lag the scroll it is supposed to be
               following. (It is the `translate` property rather than a `transform` because that
               is what Tailwind's own `translate-*` utilities set, so the two can never fight
               over the same element.) -->
          <div class="relative h-[clamp(6rem,14vw,11.125rem)]">
            <div class="absolute inset-0 overflow-hidden [--pixelate-pool-x:50%]">
              <PixelateBanner />
            </div>
            <img
              ref="tile"
              :src="contabilizeiTile"
              :style="tileStyle"
              alt="Contabilizei"
              decoding="async"
              class="absolute bottom-0 left-[62%] h-full w-auto object-contain will-change-transform"
            />
          </div>
        </div>
      </FrameBox>
    </SectionModule>

    <SectionGap hatch />

    <!-- ── The platform, in four columns ────────────────────────────────────────
         SectionTitle is the centered opener (it draws its own top and bottom rules and
         leaves the top pair of marks to the gap above it); the products grid is the body.
         `:padded="false"` because the grid is edge-to-edge and owns its own cell padding,
         so its dividers meet the column's frame with no gutter. -->
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <template #header>
        <SectionTitle
          eyebrow="Complete, not complex"
          title="A full-stack platform that scales instantly"
        />
      </template>

      <!-- Registration-framed band, `y` only: the menu's side edges are the column's own
           border-x, so drawing them here would double them. `flush` and `marks="bottom"`
           say the same about the edge ABOVE — the SectionTitle in the `#header` slot is
           itself a frame and already draws that rule and ticks its two corners, so this
           band takes the junction as given and owns only its floor. -->
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <CardGrid
          variant="divider"
          :columns="4"
          :mobile-columns="2"
        >
          <NavColumn
            v-for="group in productGroups"
            :key="group.label"
            :title="group.label"
          >
            <NavItem
              v-for="product in group.items"
              :key="product.title"
              :icon="product.icon"
              :title="product.title"
              :description="product.description"
              :href="product.href || '#'"
            />
          </NavColumn>
        </CardGrid>
      </FrameBox>
    </SectionModule>

    <!-- The Spacer the design closes the column with, hatched. It ships now — as a bare
         FrameBox at SectionGap's own `medium` height, drawing NO rules: the footer below
         opens with a full-bleed rule (the hero's logic, mirrored), and SectionGap's fixed
         `borders="y"` would land a second hairline on that exact pixel. -->
    <FrameBox
      borders="none"
      marks="none"
      hatch
      class="h-[calc(var(--spacing-xxl)*2)]"
    />
  </SectionContainer>
  <!-- ══ End framed column ═════════════════════════════════════════════════════ -->
</template>
