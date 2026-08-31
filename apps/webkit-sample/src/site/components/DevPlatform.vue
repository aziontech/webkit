<script setup>
  // Complete Development Platform — azion.com/en bands 11 + 12.
  //
  // The source states these as two stacked sections: a centred title band, then a
  // two-column band with the argument on the left and the project's own config file on
  // the right. In this page language that pair IS one module — a `SectionModule` whose
  // `#header` slot holds the title band and whose body holds the split — so the rule
  // between them is the header's `border-b` and nothing draws it twice.
  //
  // THE SPLIT IS THE FUNCTIONS PAGE'S CODE BAND, not a second design for the same idea.
  // That page already answers "argument beside the sample it is talking about" — the 4fr
  // /5fr split, the block sitting on the pixelate field, the overhang cropped at the
  // frame's floor by a scrim — and this band is the same thing about a different sample.
  // The anatomy is carried over whole (see AzionFunctions, "From hello world to
  // full-stack applications"); only the copy and the file are this page's.
  //
  // Source → ours:
  //   • The title band's copy is the source's `h2`, with no eyebrow and no description,
  //     because the source renders neither. `SectionTitle` supplies the boundary.
  //   • The bullet list stays a real `<ul>`: it is a list on the source and reads as one.
  //     It sits where the shared base puts its paragraph — the top group of a
  //     `justify-between` column, with the action standing on the cell's floor.
  //   • The right half is `CodeBlock` with the source's file name and its code verbatim.
  //   • The `Learn more` action is a `MiniButton` on the source's own href.
  import CodeBlock from '@aziontech/webkit/code-block'
  import FrameBox from '@aziontech/webkit/frame-box'
  import MiniButton from '@aziontech/webkit/mini-button'
  import SectionTitle from '@aziontech/webkit/section-title'
  import { PixelateBanner } from '@shared/ui/banners/index.js'
  import { SectionModule } from '@shared/ui/layout/index.js'

  const capabilities = [
    'Automated deployment via Git or CLI',
    'Compatibility with modern web frameworks',
    'APIs for automation and integration',
    'Infrastructure as code with Terraform',
    'Metrics and events via GraphQL API'
  ]

  // The source's file, byte for byte. One tab, because the source shows one.
  const codeTabs = [
    {
      label: 'azion.config.js',
      value: 'config',
      language: 'javascript',
      fileName: 'azion.config.js',
      code: `import { defineConfig } from 'azion'

export default defineConfig({
  build: {
    entry: 'src/index.ts',
    worker: true,
    preset: 'typescript'
  }
})`
    }
  ]
</script>

<template>
  <SectionModule
    :divided="false"
    :padded="false"
  >
    <template #header>
      <SectionTitle title="Complete Development Platform" />
    </template>

    <!-- The split. `flush` leaves the rule above to the header row, `borders="y"` hands
         the vertical rules back to the column, and `marks="bottom"` ticks the one
         junction nothing else draws: this band's floor. The rule BETWEEN the halves is
         the right cell's own — one owner, one line. -->
    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <!-- 50/50 from the TABLET step up: the two halves carry the same weight here (the
           argument is a list, not a paragraph, so it needs the width the sample does),
           and at `md` the column is already wide enough for a five-line list beside a
           nine-line file. Below it they stack and the sample follows the argument. -->
      <div class="grid md:grid-cols-2">
        <div class="flex flex-col justify-between gap-(--spacing-xxl) p-(--spacing-xl)">
          <div class="flex flex-col gap-(--spacing-lg)">
            <h2 class="m-0 text-balance text-heading-md text-(--text-default)">
              From Local Dev to Mission Critical
            </h2>
            <ul class="m-0 flex list-disc flex-col gap-(--spacing-xs) pl-(--spacing-lg)">
              <li
                v-for="capability in capabilities"
                :key="capability"
                class="text-pretty text-body-md text-(--text-muted)"
              >
                {{ capability }}
              </li>
            </ul>
          </div>

          <div>
            <MiniButton
              label="Learn more"
              show-icon
              icon="pi pi-arrow-right"
              href="https://www.azion.com/en/documentation/devtools/"
            />
          </div>
        </div>

        <!-- The sample, on the pixelate field. The cell is `overflow-hidden` for both
             reasons at once: the backdrop is a full-bleed z-0 layer that needs a
             positioned box to fill, and it is what crops the block's tail at the frame's
             edge. -->
        <div
          class="relative min-w-0 overflow-hidden border-t border-(--border-default) bg-(--bg-surface) md:border-l md:border-t-0"
        >
          <!-- Held down and faded at the edges. At full strength the field is a hard
               regular grid the whole width of the cell, which competes with the code's own
               rows; this reads as one soft pool behind the block instead. The opacity and
               the mask geometry are the shared base's — they are fitted to a cell this
               size, and a smaller cell with the same numbers flattens into an even dot
               wash under the copy. -->
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 opacity-60 mask-[radial-gradient(120%_100%_at_15%_50%,black_10%,transparent_85%)]"
          >
            <PixelateBanner />
          </div>
          <div class="relative z-10 max-h-[32rem] overflow-hidden p-(--spacing-xl) pb-0">
            <!-- Wrapped so the elevation is cast by a shell of the block's own shape:
                 CodeBlock rounds to --shape-elements and clips its overflow, so the shadow
                 goes on a wrapper at the same radius instead of being clipped away.
                 `animate-lines` is CodeBlock's own staggered line entrance, which ships
                 with its motion-reduce fallback. -->
            <div class="min-w-0 rounded-(--shape-elements) shadow-(--shadow-sm)">
              <CodeBlock
                :tabs="codeTabs"
                show-line-numbers
                animate-lines
                copy-aria-label="Copy the Azion config sample"
              />
            </div>
          </div>
          <!-- The cut, faded: the block ends at the frame's floor, not at a line the
               reader is meant to read to. -->
          <div
            class="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-(--spacing-xxl) bg-linear-to-b from-transparent to-(--bg-surface)"
          />
        </div>
      </div>
    </FrameBox>
  </SectionModule>
</template>
