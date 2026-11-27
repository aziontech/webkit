import { describe, expect, it } from 'vitest'
import { ref } from 'vue'

import { useCommandPages } from './use-command-pages'

const setup = () => {
  const pageModel = ref('')
  const pages = useCommandPages(pageModel, (name) => {
    pageModel.value = name
  })
  return { pageModel, pages }
}

describe('useCommandPages', () => {
  it('pushes nested pages and pops back through them', () => {
    const { pageModel, pages } = setup()
    pages.pushPage('dns')
    pages.pushPage('dns')
    pages.pushPage('records')
    expect(pageModel.value).toBe('records')
    expect(pages.popPage()).toBe(true)
    expect(pages.page.value).toBe('dns')
    expect(pages.popPage()).toBe(true)
    expect(pages.popPage()).toBe(false)
    expect(pageModel.value).toBe('')
  })

  it('names the page by its registered heading until it unregisters', () => {
    const { pages } = setup()
    pages.pushPage('dns')
    expect(pages.pageHeading.value).toBe('dns')
    const unregister = pages.registerPage('dns', ref('DNS zones'))
    expect(pages.pageHeading.value).toBe('DNS zones')
    unregister()
    expect(pages.pageHeading.value).toBe('dns')
  })

  it('forgets the page history on reset', () => {
    const { pageModel, pages } = setup()
    pages.pushPage('dns')
    pages.resetPages()
    expect(pages.popPage()).toBe(true)
    expect(pageModel.value).toBe('')
  })
})
