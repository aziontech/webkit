// File-type glyph — the mark a file gets in a listing, from its extension.
//
// Two listings ask for it and they ask differently: the bucket browser holds a parsed
// extension per row (../../pages/storage/BucketBrowser.vue), the project drop holds a
// whole filename (../../components/creation/UploadedProject.vue). One map, two doors, so
// a `.svg` is the same glyph in both places instead of whichever map was edited last.
const GLYPHS = {
  svg: 'pi pi-image',
  png: 'pi pi-image',
  jpg: 'pi pi-image',
  jpeg: 'pi pi-image',
  gif: 'pi pi-image',
  webp: 'pi pi-image',
  avif: 'pi pi-image',
  ico: 'pi pi-image',
  html: 'pi pi-code',
  htm: 'pi pi-code',
  css: 'pi pi-code',
  js: 'pi pi-code',
  mjs: 'pi pi-code',
  cjs: 'pi pi-code',
  ts: 'pi pi-code',
  jsx: 'pi pi-code',
  tsx: 'pi pi-code',
  vue: 'pi pi-code',
  json: 'pi pi-database',
  yml: 'pi pi-database',
  yaml: 'pi pi-database',
  toml: 'pi pi-database',
  md: 'pi pi-file-edit',
  mdx: 'pi pi-file-edit',
  txt: 'pi pi-file',
  log: 'pi pi-align-left',
  pdf: 'pi pi-file-pdf',
  zip: 'pi pi-box',
  woff: 'pi pi-star',
  woff2: 'pi pi-star',
  ttf: 'pi pi-star'
}

/** The glyph for an already-parsed extension (`'svg'`, `'html'`). */
export const glyphForExtension = (ext = '') => GLYPHS[ext.toLowerCase()] ?? 'pi pi-file'

/** The glyph for a whole filename (`'logo.svg'`). A file with no extension is a file. */
export const fileGlyph = (name = '') => {
  const dot = name.lastIndexOf('.')
  return glyphForExtension(dot > 0 ? name.slice(dot + 1) : '')
}
