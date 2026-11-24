import type { HtmlTagDescriptor, Plugin } from 'vite'

const PRELOADED_FONT = /(^|\/)rubik-latin-wght-normal-[\w-]+\.woff2$/

export function fontPreloadTags(files: string[], base = '/'): HtmlTagDescriptor[] {
  const file = files.find((name) => PRELOADED_FONT.test(name))
  if (!file) return []
  return [
    {
      tag: 'link',
      attrs: {
        rel: 'preload',
        href: `${base}${file}`,
        as: 'font',
        type: 'font/woff2',
        crossorigin: ''
      },
      injectTo: 'head-prepend'
    }
  ]
}

export function fontPreloadPlugin(): Plugin {
  let base = '/'
  return {
    name: 'docs-font-preload',
    apply: 'build',
    configResolved(config) {
      base = config.base
    },
    transformIndexHtml: {
      order: 'post',
      handler: (_html, ctx) => fontPreloadTags(Object.keys(ctx.bundle ?? {}), base)
    }
  }
}
