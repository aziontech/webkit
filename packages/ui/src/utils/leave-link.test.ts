import { afterEach, describe, expect, it } from 'vitest'

import { leavingLink } from './leave-link'

afterEach(() => {
  document.body.innerHTML = ''
})

function clickOn(selector: string, init: globalThis.MouseEventInit = {}) {
  const element = document.querySelector(selector) as HTMLElement
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, ...init })
  Object.defineProperty(event, 'target', { value: element })
  return event
}

describe('leavingLink', () => {
  it('returns the same-tab link a click follows, from its inner element too', () => {
    document.body.innerHTML = '<nav><a href="/functions"><span>Functions</span></a></nav>'
    expect(leavingLink(clickOn('span'))?.getAttribute('href')).toBe('/functions')
  })

  it('ignores new-tab, download, modified and in-page clicks', () => {
    document.body.innerHTML =
      '<a id="blank" href="https://example.com" target="_blank">Docs</a>' +
      '<a id="file" href="/report.csv" download>CSV</a>' +
      '<a id="plain" href="/functions">Functions</a>' +
      '<a id="hash" href="#arguments">Arguments</a>'
    expect(leavingLink(clickOn('#blank'))).toBeNull()
    expect(leavingLink(clickOn('#file'))).toBeNull()
    expect(leavingLink(clickOn('#plain', { metaKey: true }))).toBeNull()
    expect(leavingLink(clickOn('#hash'))).toBeNull()
  })

  it('leaves a link that is not a web page to the browser, so a script link is never assigned', () => {
    document.body.innerHTML =
      '<a id="script" href="javascript:alert(1)">Run</a>' +
      '<a id="mail" href="mailto:jane.doe@example.com">Mail</a>' +
      '<a id="web" href="https://example.com/teams">Teams</a>'
    expect(leavingLink(clickOn('#script'))).toBeNull()
    expect(leavingLink(clickOn('#mail'))).toBeNull()
    expect(leavingLink(clickOn('#web'))).not.toBeNull()
  })

  it('keeps to the root when one is given', () => {
    document.body.innerHTML =
      '<main><a id="inside" href="/teams">Teams</a></main><a id="outside" href="/home">Home</a>'
    const root = document.querySelector('main') as HTMLElement
    expect(leavingLink(clickOn('#inside'), root)).not.toBeNull()
    expect(leavingLink(clickOn('#outside'), root)).toBeNull()
  })
})
