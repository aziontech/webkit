import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import { onRadioListKeydown, radioListTabIndex } from './radio-list'

afterEach(() => {
  document.body.innerHTML = ''
})

function mount(dir = 'ltr', on: 'group' | 'radios' = 'group') {
  document.body.innerHTML =
    `<div role="radiogroup" aria-label="Projects" dir="${dir}">` +
    '<button role="radio" aria-checked="true" tabindex="0">acme-store</button>' +
    '<button role="radio" aria-checked="false" tabindex="-1" disabled>blog</button>' +
    '<button role="radio" aria-checked="false" tabindex="-1">docs-site</button>' +
    '</div>'
  const group = document.querySelector<HTMLElement>('[role="radiogroup"]')!
  const radios = Array.from(group.querySelectorAll<HTMLElement>('[role="radio"]'))
  if (on === 'group') group.addEventListener('keydown', onRadioListKeydown)
  else radios.forEach((radio) => radio.addEventListener('keydown', onRadioListKeydown))
  const clicked: string[] = []
  group.addEventListener('click', (event) =>
    clicked.push((event.target as HTMLElement).textContent ?? '')
  )
  return { radios, clicked }
}

describe('radio list keyboard', () => {
  it('makes the chosen radio, or the first one, the only tab stop', () => {
    const values = ['acme-store', 'docs-site']
    expect(values.map((value) => radioListTabIndex(value, 'docs-site', values))).toEqual([-1, 0])
    expect(values.map((value) => radioListTabIndex(value, '', values))).toEqual([0, -1])
  })

  it('moves and selects with the arrow keys, skipping a disabled radio and wrapping', async () => {
    const { radios, clicked } = mount()
    radios[0]!.focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(radios[2])
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(radios[0])
    await userEvent.keyboard('{ArrowUp}')
    expect(document.activeElement).toBe(radios[2])
    expect(clicked).toEqual(['docs-site', 'acme-store', 'docs-site'])
  })

  it('moves from radio to radio when each radio carries the handler and the group none', async () => {
    const { radios, clicked } = mount('ltr', 'radios')
    radios[0]!.focus()
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(radios[2])
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(radios[0])
    expect(clicked).toEqual(['docs-site', 'acme-store'])
  })

  it('follows the text direction for the left and right arrows', async () => {
    const { radios } = mount('rtl')
    radios[0]!.focus()
    await userEvent.keyboard('{ArrowLeft}')
    expect(document.activeElement).toBe(radios[2])
  })
})
