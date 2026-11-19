import './reflow.css'

import userEvent from '@testing-library/user-event'
import { render, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { commands } from 'vitest/browser'
import type { Component } from 'vue'

import CodeEditorDefault from '../../examples/code-editor/default.vue'
import CommandDefault from '../../examples/command/default.vue'
import InputDefault from '../../examples/input/default.vue'
import InputGroupWithAll from '../../examples/input-group/with-all.vue'
import MultiSelectSearchable from '../../examples/multi-select/searchable.vue'
import NumberInputDefault from '../../examples/number-input/default.vue'
import OtpInputDefault from '../../examples/otp-input/default.vue'
import PasswordInputMonospace from '../../examples/password-input/monospace.vue'
import PhoneInputDefault from '../../examples/phone-input/default.vue'
import TextareaDefault from '../../examples/textarea/default.vue'
import TextareaMonospace from '../../examples/textarea/monospace.vue'
import Input from '../components/input/input/input.vue'

const TYPED =
  'input:not([type=checkbox],[type=radio],[type=range],[type=file],[type=hidden]), textarea'

const fontSize = (el: Element) => parseFloat(getComputedStyle(el).fontSize)

const typedControls = (container: Element) =>
  [...container.querySelectorAll(TYPED)].filter((el) => !el.closest('[inert]'))

const FIXTURES: [string, Component][] = [
  ['CodeEditor', CodeEditorDefault],
  ['Input', InputDefault],
  ['InputGroup', InputGroupWithAll],
  ['MultiSelect (searchable)', MultiSelectSearchable],
  ['NumberInput', NumberInputDefault],
  ['OtpInput', OtpInputDefault],
  ['PasswordInput (monospace)', PasswordInputMonospace],
  ['PhoneInput', PhoneInputDefault],
  ['Textarea', TextareaDefault],
  ['Textarea (monospace)', TextareaMonospace]
]

describe('typed text on touch screens (styled)', () => {
  afterEach(async () => {
    await commands.emulateTouch(false)
  })

  describe('with a coarse pointer', () => {
    beforeEach(async () => {
      await commands.emulateTouch(true)
    })

    it('matches the coarse pointer media query', () => {
      expect(matchMedia('(pointer: coarse)').matches).toBe(true)
    })

    it.each(FIXTURES)(
      '%s renders its typed text at 16px or more, so iOS does not zoom',
      (_, fixture) => {
        const { container } = render(fixture)
        const controls = typedControls(container)

        expect(controls.length).toBeGreaterThan(0)
        for (const control of controls) expect(fontSize(control)).toBeGreaterThanOrEqual(16)
      }
    )

    it('the command palette search field renders at 16px once the palette opens', async () => {
      const { getByRole } = render(CommandDefault)
      await userEvent.click(getByRole('button', { name: /search/i }))

      await waitFor(() => expect(typedControls(document.body).length).toBeGreaterThan(0))
      for (const control of typedControls(document.body)) {
        expect(fontSize(control)).toBeGreaterThanOrEqual(16)
      }
    })

    it('keeps a monospace Input in the code face at 16px', () => {
      const { getByRole } = render(Input, { props: { monospace: true, ariaLabel: 'Slug' } })
      const control = getByRole('textbox')

      expect(fontSize(control)).toBe(16)
      expect(getComputedStyle(control).fontFamily).toMatch(/mono/i)
    })
  })

  describe('with a fine pointer', () => {
    it('keeps the dense 12px field text on desktop', () => {
      expect(matchMedia('(pointer: coarse)').matches).toBe(false)
      const { container } = render(InputDefault)

      for (const control of typedControls(container)) expect(fontSize(control)).toBe(12)
    })
  })
})
