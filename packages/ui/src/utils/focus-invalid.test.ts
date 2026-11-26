import { afterEach, describe, expect, it } from 'vitest'

import { focusFirstInvalid } from './focus-invalid'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('focusFirstInvalid', () => {
  it('focuses the first invalid control inside the root', async () => {
    document.body.innerHTML =
      '<form><input aria-label="Valid"><input aria-label="Name" aria-invalid="true">' +
      '<input aria-label="Domain" aria-invalid="true"></form>'
    const form = document.querySelector('form') as HTMLFormElement
    expect(await focusFirstInvalid(form)).toBe(true)
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Name')
  })

  it('skips an invalid control that is disabled or hidden', async () => {
    document.body.innerHTML =
      '<form><input aria-label="Key" aria-invalid="true" disabled>' +
      '<input aria-label="Hidden" aria-invalid="true" style="display: none">' +
      '<input aria-label="Value" aria-invalid="true"></form>'
    expect(await focusFirstInvalid(document.querySelector('form'))).toBe(true)
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Value')
  })

  it('leaves focus alone when nothing is invalid or there is no root', async () => {
    document.body.innerHTML = '<form><input aria-label="Name"><button>Save</button></form>'
    const button = document.querySelector('button') as HTMLButtonElement
    button.focus()
    expect(await focusFirstInvalid(document.querySelector('form'))).toBe(false)
    expect(await focusFirstInvalid(null)).toBe(false)
    expect(document.activeElement).toBe(button)
  })
})
