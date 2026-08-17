<script setup>
  // Developer band — Figma `Illustrations` node 365:114094.
  //
  // A section header over a 50/50 registration-framed panel: the pitch and its action in
  // the header, then the two ways in — AI Prompt, CLI — as one cell each. The design's
  // four corner `Node` instances are FrameBox's corner registration squares, so the frame
  // comes from the layout primitive rather than four hand-placed dots.
  //
  // Figma → ours, where the two disagree:
  //   • The design puts the pitch on the left and one `CodeBlock` over a "Code Snippet
  //     Background" on the right. Per the design-to-code hint order a component instance
  //     resolves to the codebase component, so this is webkit's CodeBlock — carrying the
  //     CLI / AI Prompt pair DocsGetStarted's hero uses, not the design's `file name.js`
  //     placeholder. That pairing is also why line numbers are off here although the
  //     design shows them (01…21): a prompt is prose to read and paste, and numbering
  //     it invites copying the numbers with it.
  //   • That pair is two CELLS here rather than the design's single block, so the band
  //     takes the two-up anatomy AzionFunctions gives its use cases and the pitch moves up
  //     into the section header. See the note on the samples below.
  //   • The design's four checked capabilities are the header's supporting line: with two
  //     cells under it, a checked list would be a third block competing with them.
  //   • The heading is Title Case in Figma. This page sets headings in sentence case,
  //     so it lands as sentence case here.
  //   • Its overline label is an unresolved component prop; `AI` is the page's own word
  //     for what the sample does.
  import Button from '@aziontech/webkit/button'
  import CodeBlock from '@aziontech/webkit/code-block'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionTitle from '@aziontech/webkit/section-title'
  import { PixelateBanner } from '@shared/ui/banners/index.js'
  import { SectionModule } from '@shared/ui/layout/index.js'

  // The capabilities the design lists, each with its check glyph.
  const capabilities = [
    'Compatibility with modern web frameworks',
    'APIs for automation and integration',
    'Infrastructure as code with Terraform',
    'Metrics and events via GraphQL API'
  ]

  // The two ways to hand this platform to a tool, the same pairing DocsGetStarted
  // uses in its hero: `AI Prompt` is pasted into an agent, `CLI` into a terminal.
  //
  // Same job, two audiences — so they are two CELLS of one band rather than two tabs of
  // one block, laid out the way AzionFunctions lays out its two use cases: the sample
  // hangs from the cell's top edge as its art, the copy and one action stand on its
  // floor, and `justify-between` is what lands the two headings on one line however long
  // either sample runs. Tabbed, only one of the two paths was ever on screen; side by
  // side the reader sees that there are two and picks the one that is theirs.
  //
  // The prompt is hard-wrapped at ~64 columns for the same reason it is there:
  // CodeBlock scrolls long lines horizontally, which is right for code and wrong for
  // prose that gets read before it is copied.
  const AGENT_PROMPT = `Deploy this project to Azion and add an inference route.

1. Install the Azion CLI and link this project:
   curl -fsSL https://cli.azion.app/install.sh | bash
   azion link
2. Connect the Azion MCP server (https://mcp.azion.com) so you
   can search current Azion docs while you work.
3. Add a route that answers with a model response, using
   Azion.AI.run from the runtime.
4. Deploy it and report the URL it went live on.`

  const CLI_SNIPPET = `# Install the Azion CLI
curl -fsSL https://cli.azion.app/install.sh | bash

# Link this project, then put it into traffic
azion link
azion deploy`

  // One tab each. CodeBlock draws no tab bar for a single tab, so the `label` never
  // renders — it stays as the tab's identity for the component, and the cell's own
  // heading is what names the sample.
  const promptTabs = [
    { label: 'AI Prompt', value: 'ai-prompt', language: 'markdown', code: AGENT_PROMPT }
  ]

  const cliTabs = [{ label: 'CLI', value: 'cli', language: 'bash', code: CLI_SNIPPET }]

  // The four capabilities the design lists become the header's supporting sentence: the
  // band below it is now two cells of its own, and a checked list in a third block would
  // be a third thing competing with them.
  const CAPABILITIES = capabilities.join(' · ')
</script>

<template>
  <SectionModule
    :divided="false"
    :padded="false"
  >
    <!-- The pitch is the section's header now, not a third cell competing with the two
         paths below it — and it takes SectionTitle's default `centered` layout, the one
         every other section on this page opens with, so the band reads as one of the
         column's bricks rather than as its own kind of thing. SectionTitle is itself a
         FrameBox, so the header arrives framed: its own rules top and bottom, its bottom
         pair of ticks registering the junction with the two-up below. -->
    <template #header>
      <SectionTitle
        eyebrow="AI"
        title="From local dev to mission critical"
        :description="CAPABILITIES"
      >
        <template #actions>
          <Button
            label="Learn more"
            kind="outlined"
            size="large"
            href="#"
          />
        </template>
      </SectionTitle>
    </template>

    <!-- The two ways in, side by side — the same two-up AzionFunctions uses for its use
         cases: sample on top as the cell's art, copy and one action standing on the floor,
         `justify-between` lining the two headings up however long either sample runs. The
         rule between the halves is the right cell's; the frame owns the outer edges, and
         `flush` + `marks="bottom"` leave the junction above to the SectionTitle, which
         already draws that rule and ticks its corners. -->
    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <div class="grid lg:grid-cols-2">
        <div
          class="relative flex flex-col justify-between gap-(--spacing-xxl) overflow-hidden p-(--spacing-xl)"
        >
          <!-- THE PIXELATE FIELD, as this cell's ground — the same backdrop the
               Functions page pools behind its code sample (AzionFunctions.vue), used
               the same way: held down and masked to one soft ellipse so it reads as a
               pool of light behind the block rather than as wallpaper competing with
               the code's own rows.

               The two cells MIRROR each other: this one is lit from the leading edge
               (`--pixelate-pool-x: 14%` moves the banner's pools with the mask), its
               pair from the trailing edge. So the light sits under each sample and the
               rule between them stays in the trough, instead of both pools crowding
               the same seam. -->
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 opacity-60 [--pixelate-pool-x:14%] mask-[radial-gradient(120%_100%_at_15%_45%,black_10%,transparent_85%)]"
          >
            <PixelateBanner />
          </div>

          <!-- Wrapped so the elevation is cast by a shell of the block's own shape:
               CodeBlock rounds to --shape-elements and clips its overflow, so the shadow
               goes on a wrapper at the same radius instead of being clipped away.
               `animate-lines` is CodeBlock's own staggered line entrance, which ships with
               its motion-reduce fallback. -->
          <div class="relative z-10 flex items-start py-(--spacing-lg)">
            <div class="w-full min-w-0 rounded-(--shape-elements) shadow-(--shadow-sm)">
              <CodeBlock
                :tabs="promptTabs"
                default-value="ai-prompt"
                :show-line-numbers="false"
                animate-lines
                copy-aria-label="Copy the agent prompt"
              />
            </div>
          </div>

          <div class="relative z-10 flex flex-col items-start gap-(--spacing-lg)">
            <div class="flex flex-col gap-(--spacing-md)">
              <!-- `h3`, not `h2`: the SectionTitle above already opens this section with
                   one. Same `heading-md` token the Functions use cases set, so the two
                   pages read identically while the outline stays honest. -->
              <h3 class="m-0 text-balance text-heading-md text-(--text-default)">
                Hand the project to an agent
              </h3>
              <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                One prompt links the project, connects the MCP server so the agent works from
                current Azion docs, adds an inference route, and deploys it.
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
          class="relative flex flex-col justify-between gap-(--spacing-xxl) overflow-hidden border-t border-(--border-default) p-(--spacing-xl) lg:border-l lg:border-t-0"
        >
          <!-- The mirror of the cell beside it: lit from the TRAILING edge, so the two
               pools sit under their own samples and the rule between the halves stays
               in the trough. -->
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 opacity-60 [--pixelate-pool-x:86%] mask-[radial-gradient(120%_100%_at_85%_45%,black_10%,transparent_85%)]"
          >
            <PixelateBanner />
          </div>

          <div class="relative z-10 flex items-start py-(--spacing-lg)">
            <div class="w-full min-w-0 rounded-(--shape-elements) shadow-(--shadow-sm)">
              <CodeBlock
                :tabs="cliTabs"
                default-value="cli"
                :show-line-numbers="false"
                animate-lines
                copy-aria-label="Copy the CLI commands"
              />
            </div>
          </div>

          <div class="relative z-10 flex flex-col items-start gap-(--spacing-lg)">
            <div class="flex flex-col gap-(--spacing-md)">
              <h3 class="m-0 text-balance text-heading-md text-(--text-default)">
                Or ship it from your terminal
              </h3>
              <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                Install and link the CLI, then put the project into traffic — the same two commands
                whether it is the first deploy or the hundredth.
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
</template>
