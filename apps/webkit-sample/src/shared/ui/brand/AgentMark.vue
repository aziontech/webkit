<script setup>
  // AgentMark — the brand mark of an AI coding agent, as an inline SVG.
  //
  // Every mark is the design system's agent asset (`@aziontech/webkit/assets/<agent>-symbol-*.svg`): the
  // vendor's published drawing with its fills on its own paths. Claude keeps its brand colour;
  // Cursor, Windsurf, Codex and OpenCode ride `currentColor`; Gemini and Copilot keep their
  // gradients. Each file is inlined `?raw` so those fills and `mono` keep working, and its ids
  // are namespaced per instance below.
  //
  // The root element is an `<svg>` with a `viewBox` and no intrinsic size, so one size
  // class from the caller sizes any mark and `[&>svg]` selectors (DocCard's icon region) match.

  import claudeSvg from '@aziontech/webkit/assets/claude-symbol-color.svg?raw'
  import codexSvg from '@aziontech/webkit/assets/codex-symbol-mono.svg?raw'
  import copilotSvg from '@aziontech/webkit/assets/copilot-symbol-color.svg?raw'
  import cursorSvg from '@aziontech/webkit/assets/cursor-symbol-mono.svg?raw'
  import geminiSvg from '@aziontech/webkit/assets/gemini-symbol-color.svg?raw'
  import opencodeSvg from '@aziontech/webkit/assets/opencode-symbol-mono.svg?raw'
  import windsurfSvg from '@aziontech/webkit/assets/windsurf-symbol-mono.svg?raw'
  import { computed, useId } from 'vue'

  const props = defineProps({
    // Which agent's mark to draw.
    name: {
      type: String,
      required: true,
      validator: (value) =>
        ['claude', 'cursor', 'windsurf', 'codex', 'opencode', 'gemini', 'copilot'].includes(value)
    },
    // Flattens the mark to ONE ink: `currentColor`, whatever the surface holding it is set to.
    // For a drawing where the marks are parts of one diagram rather than a row of logos — one
    // brand colour in there reads as a highlight nobody meant, and it collides with Azion's own
    // orange — and for a surface with its own ink to lend, like the AI pill's white on its dark
    // scrim (ui/CopyPromptButton.vue).
    //
    // The fill is set in CSS (`MONO_INK`): a CSS declaration beats the `fill` presentation
    // attribute each published file ships, so every gradient collapses to the one ink and the
    // overlapping paths union into the mark's silhouette.
    //
    // NOT the client marks' `brightness(0)` + `invert` silhouette (`MONOCHROME_FILTER`): that one
    // is black or white BY THEME, which is what a mark sitting on the page surface needs and the
    // wrong answer on a surface that is dark in both themes — it would paint a black Gemini on
    // the pill in light mode. Asking `currentColor` asks the SURFACE instead of the theme, so
    // both cases are one rule, and a mono full-colour mark now matches the path marks beside it
    // (`--text-muted` in a drawing) instead of going pure black or pure white on its own.
    mono: { type: Boolean, default: false }
  })

  /**
   * A published `.svg` split into the two things the template needs: its `viewBox`, and its
   * body. The wrapper tag is dropped rather than nested, so the mark's own root IS this
   * component's root and the caller's size class lands on the element that scales. The
   * `<title>` goes with it — the root carries the accessible name, and two names on one mark
   * is one too many.
   */
  const parseSvg = (raw) => ({
    viewBox: raw.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 24 24',
    body: raw
      .replace(/^[\s\S]*?<svg[^>]*>/, '')
      .replace(/<\/svg>\s*$/, '')
      .replace(/<title>[\s\S]*?<\/title>/g, '')
  })

  const MARKS = {
    claude: { ...parseSvg(claudeSvg), label: 'Claude' },
    cursor: { ...parseSvg(cursorSvg), label: 'Cursor' },
    windsurf: { ...parseSvg(windsurfSvg), label: 'Windsurf' },
    codex: { ...parseSvg(codexSvg), label: 'Codex' },
    opencode: { ...parseSvg(opencodeSvg), label: 'OpenCode' },
    gemini: { ...parseSvg(geminiSvg), label: 'Gemini' },
    copilot: { ...parseSvg(copilotSvg), label: 'GitHub Copilot' }
  }

  const mark = computed(() => MARKS[props.name])

  /**
   * `mono`'s one ink for a mark whose fills live inside the published file.
   *
   * The blur filters STAY. Turning them off as well (`filter: none`, so the flattened blobs
   * would be crisp) tears a hole through Gemini's star: its blobs only cover the mask once they
   * are blurred, and unblurred they leave a wedge of the star empty. Blurred and flattened, the
   * overlap is solid — measured against the unblurred variant at 80px, where the wedge is
   * obvious, and at the 20px the pill draws them, where neither variant shows a seam.
   *
   * `path` covers every file inlined here; a future mark drawn with another shape element
   * extends this selector.
   */
  const MONO_INK = '[&_path]:fill-current'

  /**
   * A gradient mark carries its own `id`s, and two of the same mark on one page would declare
   * them twice — the second stack then paints from the first one's defs. Every id is suffixed
   * with this instance's own, so each copy references only its own gradients, masks and filters.
   */
  const uid = useId()

  const body = computed(() =>
    mark.value.body
      .replace(/id="([^"]+)"/g, `id="$1-${uid}"`)
      .replace(/url\(#([^)]+)\)/g, `url(#$1-${uid})`)
  )
</script>

<template>
  <svg
    :viewBox="mark.viewBox"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    :aria-label="mark.label"
    :class="['shrink-0', mono && MONO_INK]"
    :innerHTML.prop="body"
  />
</template>
