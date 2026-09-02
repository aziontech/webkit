// PDF EXPORT — the deck through the browser's own print pipeline.
//
// A slide is already a fixed 1920x1080 artboard (lib/deck-canvas.js), so the export is not a
// re-layout: it is the SAME stage at scale 1, one per printed page, with the page box set to
// the canvas. `@page { size: 1920px 1080px }` is what makes that true — without it the sheets
// are laid out on whatever paper the dialog last used, and a 16:9 artboard lands letterboxed
// on A4 with a scale factor nobody chose. Deriving the rule from CANVAS here is the same
// single-source argument the canvas file makes: the PDF page and the artboard cannot disagree.
//
// WHY IT IS INJECTED, AND ONLY WHILE PRINTING. `@page` and the shell overrides below cannot be
// scoped to a component — an at-rule has no selector to scope, and `html`/`body`/`#app` are
// outside every component. Left in the stylesheet they would apply to a print of ANY page of
// the app, so this deck would silently redefine what "print" means for the console. Injecting
// the rules for the duration of the dialog and removing them after keeps the footprint at
// exactly the moment they are wanted.
//
// The shell overrides exist because the app pins html/body/#app to the viewport with overflow
// hidden (see src/style.css — the console layout owns its own scrolling). That is correct on
// screen and fatal in print: a clipped, viewport-tall document prints as one page. Print gets
// the document back — scrollable height, visible overflow — and hides the shell outright, since
// the sheets are teleported to <body> and are the only thing that should reach the paper.
import { CANVAS } from './deck-canvas.js'

/** The print stylesheet, derived from the artboard. */
export const printCss = () => `
  @page { size: ${CANVAS.width}px ${CANVAS.height}px; margin: 0; }

  @media print {
    html, body { height: auto !important; overflow: visible !important; }
    #app { display: none !important; }
  }
`

/**
 * Install the print stylesheet, name the document, and hand back the undo. Call it immediately
 * before `window.print()` and run the returned function once the dialog is done with.
 *
 * The title is not cosmetic: the browser writes `document.title` into the PDF's own metadata AND
 * offers it as the save dialog's default filename. This app's index.html carries one static
 * title for every route, so without the swap the deck saves itself as that — a file whose name
 * says nothing about the deck inside it, on the one artefact that leaves the building.
 */
export const openPrintScope = (title) => {
  const style = document.createElement('style')
  style.dataset.deckPrint = ''
  style.textContent = printCss()
  document.head.append(style)

  const previousTitle = document.title
  if (title) document.title = title

  return () => {
    style.remove()
    document.title = previousTitle
  }
}
