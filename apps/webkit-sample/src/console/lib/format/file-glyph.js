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

export const glyphForExtension = (ext = '') => GLYPHS[ext.toLowerCase()] ?? 'pi pi-file'

export const fileGlyph = (name = '') => {
  const dot = name.lastIndexOf('.')
  return glyphForExtension(dot > 0 ? name.slice(dot + 1) : '')
}
