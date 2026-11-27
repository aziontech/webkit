import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/rating/default.vue'
import Disabled from '../../../../examples/rating/disabled.vue'
import Readonly from '../../../../examples/rating/readonly.vue'
import SendOnSelect from '../../../../examples/rating/send-on-select.vue'
import Sizes from '../../../../examples/rating/sizes.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import ConfigProvider from '../../layout/config-provider/config-provider.vue'
import Field from '../field/field.vue'
import FieldDescription from '../field/field-description/field-description.vue'
import FieldError from '../field/field-error/field-error.vue'
import FieldTitle from '../field/field-title/field-title.vue'
import Rating from './rating.vue'

const host = (template: string, setup: () => Record<string, unknown> = () => ({})) =>
  render(
    defineComponent({
      components: { Rating, Field, FieldDescription, FieldError, FieldTitle },
      setup,
      template
    })
  )

const radios = (root: HTMLElement) => within(root).getAllByRole('radio') as HTMLInputElement[]

describe('Rating', () => {
  it('renders a named radiogroup of five stars with the default test ids', () => {
    const view = render(Default)
    const group = view.getByRole('radiogroup', { name: 'Rate this conversation' })
    expect(group.getAttribute('data-testid')).toBe('rating')
    expect(group.getAttribute('data-size')).toBe('medium')
    expect(view.getAllByTestId('rating__star')).toHaveLength(5)
    expect(view.getAllByTestId('rating__control')).toHaveLength(5)
    expect(radios(group).map((radio) => radio.getAttribute('aria-label'))).toEqual([
      '1 star',
      '2 stars',
      '3 stars',
      '4 stars',
      '5 stars'
    ])
  })

  it('honours a consumer data-testid on the root and on its parts', () => {
    const view = host(`<Rating data-testid="csat" aria-label="Score" clearable />`)
    expect(view.getByTestId('csat').getAttribute('role')).toBe('radiogroup')
    expect(view.getAllByTestId('csat__star')).toHaveLength(5)
    expect(view.getByTestId('csat__clear')).toBeTruthy()
  })

  it('maps size to data-size', () => {
    const view = render(Sizes)
    expect(view.getAllByRole('radiogroup').map((group) => group.getAttribute('data-size'))).toEqual(
      ['small', 'medium', 'large']
    )
  })

  it('renders max stars, rounded and kept between 1 and 10', () => {
    for (const [max, stars] of [
      [3, 3],
      [7.6, 8],
      [0, 1],
      [40, 10]
    ]) {
      const view = host(`<Rating :max="max" aria-label="Score" />`, () => ({ max }))
      expect(view.getAllByRole('radio')).toHaveLength(stars)
      view.unmount()
    }
  })

  it('writes the picked star to v-model and fills the stars up to it', async () => {
    const score = ref(0)
    const view = host(`<Rating v-model="score" aria-label="Score" />`, () => ({ score }))
    await fireEvent.click(view.getByRole('radio', { name: '4 stars' }))
    expect(score.value).toBe(4)
    const fills = view
      .getAllByTestId('rating__star')
      .map((star) => star.querySelector('i')?.getAttribute('data-fill'))
    expect(fills).toEqual(['full', 'full', 'full', 'full', 'empty'])
    expect(view.getAllByTestId('rating__star')[3].hasAttribute('data-checked')).toBe(true)
  })

  it('keeps the score when the selected star is picked again', async () => {
    const score = ref(3)
    const view = host(`<Rating v-model="score" aria-label="Score" />`, () => ({ score }))
    await fireEvent.click(view.getByRole('radio', { name: '3 stars' }))
    expect(score.value).toBe(3)
  })

  it('is one tab stop whose arrow keys move the score, then tabs to the clear button', async () => {
    const score = ref(2)
    const view = host(`<Rating v-model="score" aria-label="Score" clearable />`, () => ({
      score
    }))
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(view.getByRole('radio', { name: '2 stars' }))
    await userEvent.keyboard('{ArrowRight}')
    expect(score.value).toBe(3)
    await userEvent.keyboard('{ArrowDown}')
    expect(score.value).toBe(4)
    await userEvent.keyboard('{ArrowLeft}')
    expect(score.value).toBe(3)
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe(view.getByRole('button', { name: 'Clear rating' }))
  })

  it('clears the score with the clear button and moves focus to the first star', async () => {
    const score = ref(4)
    const view = host(`<Rating v-model="score" aria-label="Score" clearable />`, () => ({
      score
    }))
    const clear = view.getByRole('button', { name: 'Clear rating' }) as HTMLButtonElement
    expect(clear.disabled).toBe(false)
    await userEvent.click(clear)
    expect(score.value).toBe(0)
    await nextTick()
    expect(document.activeElement).toBe(view.getByRole('radio', { name: '1 star' }))
    expect(radios(view.getByRole('radiogroup')).every((radio) => !radio.checked)).toBe(true)
    expect(clear.disabled).toBe(true)
  })

  it('shows no clear button unless clearable', () => {
    const view = host(`<Rating :model-value="3" aria-label="Score" />`)
    expect(view.queryByRole('button')).toBeNull()
  })

  it('previews the fill on a mouse hover only, without changing the model', async () => {
    const score = ref(1)
    const view = host(`<Rating v-model="score" aria-label="Score" />`, () => ({ score }))
    const stars = view.getAllByTestId('rating__star')
    const group = view.getByRole('radiogroup')
    await fireEvent.pointerEnter(stars[2], { pointerType: 'touch' })
    expect(group.hasAttribute('data-preview')).toBe(false)
    await fireEvent.pointerEnter(stars[2], { pointerType: 'mouse' })
    expect(group.hasAttribute('data-preview')).toBe(true)
    expect(stars[2].querySelector('i')?.getAttribute('data-fill')).toBe('full')
    expect(score.value).toBe(1)
    await fireEvent.pointerLeave(stars[2].parentElement as HTMLElement)
    expect(group.hasAttribute('data-preview')).toBe(false)
    expect(stars[2].querySelector('i')?.getAttribute('data-fill')).toBe('empty')
  })

  it('disables every star and the clear button, with no preview', async () => {
    const view = render(Disabled)
    const group = view.getByRole('radiogroup')
    expect(group.hasAttribute('data-disabled')).toBe(true)
    expect(radios(group).every((radio) => radio.disabled)).toBe(true)
    await fireEvent.pointerEnter(view.getAllByTestId('rating__star')[4], { pointerType: 'mouse' })
    expect(group.hasAttribute('data-preview')).toBe(false)
  })

  it('does not change a disabled score on click', async () => {
    const score = ref(3)
    const view = host(`<Rating v-model="score" aria-label="Score" disabled clearable />`, () => ({
      score
    }))
    await fireEvent.click(view.getByRole('radio', { name: '5 stars' }))
    expect(score.value).toBe(3)
    expect((view.getByRole('button', { name: 'Clear rating' }) as HTMLButtonElement).disabled).toBe(
      true
    )
  })

  describe('readonly', () => {
    it('renders one image named by the half-rounded score, with no inputs', () => {
      const view = host(`<Rating :model-value="4.37" readonly clearable aria-label="Ignored" />`)
      const image = view.getByRole('img', { name: 'Rated 4.5 out of 5' })
      expect(image.hasAttribute('data-readonly')).toBe(true)
      expect(view.queryAllByRole('radio')).toHaveLength(0)
      expect(view.queryByRole('button')).toBeNull()
      expect(
        view
          .getAllByTestId('rating__star')
          .map((star) => star.querySelector('i')?.getAttribute('data-fill'))
      ).toEqual(['full', 'full', 'full', 'full', 'half'])
    })

    it('announces "Not rated" at 0 and drops required and invalid', () => {
      const view = host(`<Rating :model-value="0" readonly required invalid />`)
      const image = view.getByRole('img', { name: 'Not rated' })
      expect(image.hasAttribute('aria-required')).toBe(false)
      expect(image.hasAttribute('aria-invalid')).toBe(false)
      expect(image.hasAttribute('data-invalid')).toBe(false)
    })

    it('ignores a mouse hover', async () => {
      const view = host(`<Rating :model-value="2" readonly />`)
      await fireEvent.pointerEnter(view.getAllByTestId('rating__star')[4], {
        pointerType: 'mouse'
      })
      expect(view.getByRole('img').hasAttribute('data-preview')).toBe(false)
    })

    it('is named by an enclosing Field title followed by the score', async () => {
      const view = host(
        `<Field><FieldTitle>Average score</FieldTitle><Rating :model-value="3" readonly /></Field>`
      )
      await nextTick()
      expect(view.getByRole('img', { name: 'Average score Rated 3 out of 5' })).toBeTruthy()
    })
  })

  it('takes its name, description, invalid and required from an enclosing Field', async () => {
    const view = host(
      `<Field required>
         <FieldTitle>Support score</FieldTitle>
         <FieldDescription>1 is lowest.</FieldDescription>
         <Rating />
         <FieldError>Pick a score.</FieldError>
       </Field>`
    )
    await nextTick()
    const group = view.getByRole('radiogroup', { name: 'Support score' })
    expect(group.getAttribute('aria-invalid')).toBe('true')
    expect(group.getAttribute('aria-required')).toBe('true')
    expect(group.hasAttribute('data-invalid')).toBe(true)
    expect(group.getAttribute('aria-describedby')).toContain(view.getByRole('alert').id)
    expect(radios(group).every((radio) => radio.required)).toBe(true)
  })

  it('blocks an empty submit when required and posts the score under name', async () => {
    const view = host(`<form><Rating name="csat" aria-label="Score" required /></form>`)
    const form = view.container.querySelector('form') as HTMLFormElement
    expect(form.checkValidity()).toBe(false)
    await fireEvent.click(view.getByRole('radio', { name: '5 stars' }))
    expect(new FormData(form).get('csat')).toBe('5')
    expect(form.checkValidity()).toBe(true)
  })

  it('emits select with the event and the score on a click, without a second click', async () => {
    const score = ref(0)
    const picks: Array<[string, number]> = []
    const view = host(
      `<Rating v-model="score" aria-label="Score" @select="(event, value) => picks.push([event.type, value])" />`,
      () => ({ score, picks })
    )
    await userEvent.click(view.getByRole('radio', { name: '4 stars' }))
    expect(picks).toEqual([['click', 4]])
    expect(score.value).toBe(4)
    await userEvent.click(view.getByRole('radio', { name: '4 stars' }))
    expect(picks).toEqual([
      ['click', 4],
      ['click', 4]
    ])
  })

  it('does not emit select while the arrow keys move the score, and emits it on Enter or Space', async () => {
    const score = ref(2)
    const picks: number[] = []
    const view = host(
      `<Rating v-model="score" aria-label="Score" @select="(_event, value) => picks.push(value)" />`,
      () => ({ score, picks })
    )
    await userEvent.keyboard('{Tab}')
    await userEvent.keyboard('{ArrowRight}')
    await userEvent.keyboard('{ArrowRight}')
    expect(score.value).toBe(4)
    expect(picks).toEqual([])
    await userEvent.keyboard('{Enter}')
    expect(picks).toEqual([4])
    await userEvent.keyboard('{ArrowLeft}')
    await userEvent.keyboard(' ')
    expect(picks).toEqual([4, 3])
    expect(view.getByRole('radio', { name: '3 stars' })).toBe(document.activeElement)
  })

  it('does not emit select while disabled', async () => {
    const picks: number[] = []
    const view = host(
      `<Rating aria-label="Score" disabled @select="(_event, value) => picks.push(value)" />`,
      () => ({ picks })
    )
    await fireEvent.click(view.getByRole('radio', { name: '2 stars' }), { detail: 1 })
    expect(picks).toEqual([])
  })

  it('sends the SendOnSelect rating on the pick and replaces the stars with a focused thank-you', async () => {
    const view = render(SendOnSelect)
    expect(view.queryByRole('button')).toBeNull()
    expect(view.getByRole('status').textContent?.trim()).toBe('')
    await userEvent.click(view.getByRole('radio', { name: '4 stars' }))
    await vi.waitFor(() => expect(view.queryByRole('radiogroup')).toBeNull())
    const status = view.getByRole('status')
    expect(status.textContent).toContain('Thanks, your rating was sent.')
    expect(document.activeElement).toBe(status)
  })

  it('names the stars and the score in the ConfigProvider locale', () => {
    const view = render(
      defineComponent({
        setup: () => () =>
          h(
            ConfigProvider,
            { locale: 'pt-BR', catalogs: LOCALES },
            {
              default: () => [
                h(Rating, { 'aria-label': 'Nota', clearable: true, modelValue: 2 }),
                h(Rating, { readonly: true, modelValue: 4.5 })
              ]
            }
          )
      })
    )
    expect(view.getByRole('radio', { name: '1 estrela' })).toBeTruthy()
    expect(view.getByRole('radio', { name: '5 estrelas' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Limpar avaliação' })).toBeTruthy()
    expect(view.getByRole('img', { name: 'Avaliado em 4,5 de 5' })).toBeTruthy()
  })

  describe('right-to-left', () => {
    it('fills from the inline start, mirrors the half star and raises the score with ArrowLeft', async () => {
      const score = ref(2)
      const view = host(
        `<div dir="rtl">
           <Rating v-model="score" aria-label="Score" />
           <Rating :model-value="2.5" readonly />
         </div>`,
        () => ({ score })
      )
      const half = view.getByRole('img').querySelector('[data-fill="half"]') as HTMLElement
      expect(half.classList.contains('rtl:-scale-x-100')).toBe(true)
      view.getByRole('radio', { name: '2 stars' }).focus()
      await userEvent.keyboard('{ArrowLeft}')
      expect(score.value).toBe(3)
      await expectNoA11yViolations(view.container)
    })
  })

  it('has no axe violations in every example', async () => {
    for (const example of [Default, Sizes, Readonly, Disabled, SendOnSelect]) {
      const view = render(example)
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
  })
})
