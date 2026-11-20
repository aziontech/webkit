import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/language-select/default.vue'
import Options from '../../../../examples/language-select/options.vue'
import Rtl from '../../../../examples/language-select/rtl.vue'
import Variants from '../../../../examples/language-select/variants.vue'
import { es } from '../../../locales/es'
import { ptBR } from '../../../locales/pt-BR'
import { expectNoA11yViolations } from '../../../test/axe'
import ConfigProvider from '../../provider/config-provider/config-provider.vue'
import Field from '../field/field.vue'
import FieldLabel from '../field/field-label/field-label.vue'
import LanguageSelect from './language-select.vue'

const content = () =>
  document.body.querySelector('[data-testid="language-select__content"]') as HTMLElement | null

const items = () =>
  Array.from(
    document.body.querySelectorAll('[data-testid="language-select__item"]')
  ) as HTMLElement[]

const waitFor = async (check: () => boolean) => {
  for (let i = 0; i < 50 && !check(); i++) await new Promise((r) => setTimeout(r, 10))
}

const searchInput = () => document.activeElement as HTMLInputElement

afterEach(() => {
  document.body
    .querySelectorAll('[data-testid="select-content"], [data-testid="language-select__content"]')
    .forEach((el) => el.remove())
})

describe('LanguageSelect', () => {
  it('renders with its test id fallback, and a consumer test id wins', () => {
    const first = render(LanguageSelect)
    expect(first.getByTestId('language-select')).toBeTruthy()
    first.unmount()
    const second = render(LanguageSelect, { attrs: { 'data-testid': 'app-language' } })
    expect(second.getByTestId('app-language')).toBeTruthy()
    expect(second.getByTestId('app-language__trigger')).toBeTruthy()
  })

  it('names the trigger with the catalog label and shows it as the placeholder', () => {
    const { getByRole } = render(LanguageSelect)
    const trigger = getByRole('combobox', { name: 'Language' })
    expect(trigger.textContent).toContain('Language')
  })

  it('prefers aria-label and placeholder props over the catalog', () => {
    const { getByRole } = render(LanguageSelect, {
      props: { ariaLabel: 'Interface language', placeholder: 'Pick one' }
    })
    const trigger = getByRole('combobox', { name: 'Interface language' })
    expect(trigger.textContent).toContain('Pick one')
  })

  it.each(['small', 'medium', 'large'] as const)('forwards size %s to the trigger', (size) => {
    const { getByRole } = render(LanguageSelect, { props: { size } })
    expect(getByRole('combobox').dataset.size).toBe(size)
  })

  it('shows the picked language name and its flag on the trigger', () => {
    const { getByRole, getByTestId } = render(LanguageSelect, { props: { modelValue: 'pt-BR' } })
    expect(getByRole('combobox').textContent).toContain('Português (Brasil)')
    expect(getByTestId('language-select__selected-flag').dataset.country).toBe('BR')
  })

  it('offers the shipped languages with their round flag and no tag', async () => {
    const user = userEvent.setup()
    const { getByRole } = render(LanguageSelect)
    await user.click(getByRole('combobox'))
    await waitFor(() => items().length === 3)
    expect(items().map((item) => item.querySelector('[lang]')?.textContent?.trim())).toEqual([
      'English (United States)',
      'Português (Brasil)',
      'Español (España)'
    ])
    expect(items().map((item) => item.querySelector('[lang]')?.getAttribute('lang'))).toEqual([
      'en-US',
      'pt-BR',
      'es-ES'
    ])
    const flags = Array.from(
      document.body.querySelectorAll('[data-testid="language-select__flag"]')
    ) as HTMLElement[]
    expect(flags.map((flag) => flag.dataset.country)).toEqual(['US', 'BR', 'ES'])
    expect(flags.every((flag) => flag.getAttribute('aria-hidden') === 'true')).toBe(true)
    expect(flags.every((flag) => flag.style.backgroundPosition.startsWith('50%'))).toBe(true)
    expect(document.body.querySelector('[data-testid="language-select__tag"]')).toBeNull()
  })

  it('emits update:modelValue with the tag of the clicked language', async () => {
    const user = userEvent.setup()
    const { getByRole, emitted } = render(LanguageSelect)
    await user.click(getByRole('combobox'))
    await waitFor(() => items().length === 3)
    await user.click(items()[2])
    expect(emitted()['update:modelValue']).toEqual([['es-ES']])
  })

  it('filters by name, tag and country, and picks with Enter', async () => {
    const user = userEvent.setup()
    const { getByRole, emitted } = render(LanguageSelect)
    getByRole('combobox').focus()
    await user.keyboard('{Enter}')
    await waitFor(() => items().length === 3)
    await user.keyboard('brazil')
    await waitFor(() => items().length === 1)
    expect(items()[0].textContent).toContain('Português (Brasil)')
    await user.clear(searchInput())
    await user.keyboard('espan')
    await waitFor(() => items().length === 1)
    expect(items()[0].textContent).toContain('Español')
    await user.keyboard('{Enter}')
    expect(emitted()['update:modelValue']).toEqual([['es-ES']])
    await waitFor(() => document.activeElement === getByRole('combobox'))
    expect(document.activeElement).toBe(getByRole('combobox'))
  })

  it('shows the empty line as a status when nothing matches', async () => {
    const user = userEvent.setup()
    const { getByRole } = render(LanguageSelect, { props: { emptyTitle: 'Nothing here' } })
    await user.click(getByRole('combobox'))
    await waitFor(() => items().length === 3)
    await user.keyboard('zzz')
    await waitFor(() => items().length === 0)
    const empty = document.body.querySelector(
      '[data-testid="language-select__search-empty"]'
    ) as HTMLElement
    expect(empty.getAttribute('role')).toBe('status')
    expect(empty.textContent?.trim()).toBe('Nothing here')
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup()
    const { getByRole } = render(LanguageSelect)
    const trigger = getByRole('combobox')
    await user.click(trigger)
    await waitFor(() => trigger.getAttribute('aria-expanded') === 'true')
    await user.keyboard('{Escape}')
    await waitFor(() => trigger.getAttribute('aria-expanded') === 'false')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger)
  })

  it('does not open or emit while disabled', async () => {
    const user = userEvent.setup()
    const { getByRole, emitted } = render(LanguageSelect, {
      props: { disabled: true, modelValue: 'es-ES' }
    })
    const trigger = getByRole('combobox')
    await user.click(trigger)
    await nextTick()
    expect(trigger.getAttribute('aria-expanded')).not.toBe('true')
    expect(content()).toBeNull()
    expect(emitted()['update:modelValue']).toBeUndefined()
  })

  it('takes the flag from country, the tag region or its likely region', async () => {
    const user = userEvent.setup()
    const { getByRole, getByTestId } = render(LanguageSelect, {
      props: {
        modelValue: 'en',
        options: [{ value: 'en' }, { value: 'fr-CA' }, { value: 'ar', country: 'sa' }]
      }
    })
    expect(getByTestId('language-select__selected-flag').dataset.country).toBe('US')
    await user.click(getByRole('combobox'))
    await waitFor(() => items().length === 3)
    const flags = Array.from(
      document.body.querySelectorAll('[data-testid="language-select__flag"]')
    ) as HTMLElement[]
    expect(flags.map((flag) => flag.dataset.country)).toEqual(['US', 'CA', 'SA'])
  })

  it('names an option with no label in its own language', async () => {
    const user = userEvent.setup()
    const { getByRole } = render(LanguageSelect, {
      props: { options: [{ value: 'fr-CA' }, { value: 'de-DE', label: 'Deutsch' }] }
    })
    await user.click(getByRole('combobox'))
    await waitFor(() => items().length === 2)
    expect(items().map((item) => item.querySelector('[lang]')?.textContent?.trim())).toEqual([
      'Français (Canada)',
      'Deutsch'
    ])
  })

  it('offers every region of the Options example, and filters by a derived name', async () => {
    const user = userEvent.setup()
    const { getAllByRole } = render(Options)
    await user.click(getAllByRole('combobox')[1])
    await waitFor(() => items().length === 16)
    await user.keyboard('italiano')
    await waitFor(() => items().length === 1)
    expect(items()[0].textContent).toContain('Italiano (Italia)')
  })

  it('shows the round flag and the country code in the ghost variant, and keeps the name for assistive tech', () => {
    const { getByRole, getByTestId } = render(LanguageSelect, {
      props: { variant: 'ghost', modelValue: 'pt-BR' }
    })
    const trigger = getByRole('combobox', { name: 'Language' })
    expect(trigger.dataset.variant).toBe('ghost')
    expect(getByTestId('language-select').dataset.variant).toBe('ghost')
    const code = getByTestId('language-select__code')
    expect(code.textContent).toBe('BR')
    expect(code.getAttribute('aria-hidden')).toBe('true')
    expect(getByTestId('language-select__trigger__value').textContent).toContain(
      'Português (Brasil)'
    )
    expect(getByTestId('language-select__selected-flag').dataset.country).toBe('BR')
  })

  it('shows the whole tag as the code when two options share a country', () => {
    const { getByTestId } = render(LanguageSelect, {
      props: {
        variant: 'ghost',
        modelValue: 'fr-CA',
        options: [{ value: 'en-CA' }, { value: 'fr-CA' }, { value: 'eo', label: 'Esperanto' }]
      }
    })
    expect(getByTestId('language-select__code').textContent).toBe('FR-CA')
  })

  it('falls back to the language code when no country resolves', () => {
    const { getByTestId, queryByTestId } = render(LanguageSelect, {
      props: { variant: 'ghost', modelValue: 'eo', options: [{ value: 'eo', label: 'Esperanto' }] }
    })
    expect(queryByTestId('language-select__selected-flag')).toBeNull()
    expect(getByTestId('language-select__code').textContent).toBe('EO')
  })

  it('shows no code in the outline variant', () => {
    const { queryByTestId, getByRole } = render(LanguageSelect, { props: { modelValue: 'en-US' } })
    expect(getByRole('combobox').dataset.variant).toBe('outline')
    expect(queryByTestId('language-select__code')).toBeNull()
  })

  it('is named by an enclosing Field.Label', () => {
    const Wrapper = defineComponent({
      setup: () => () =>
        h(Field, null, () => [h(FieldLabel, null, () => 'App language'), h(LanguageSelect)])
    })
    const { getByRole } = render(Wrapper)
    expect(getByRole('combobox', { name: 'App language' })).toBeTruthy()
  })

  it('translates its own strings under ConfigProvider', async () => {
    const user = userEvent.setup()
    const Wrapper = defineComponent({
      setup: () => () =>
        h(ConfigProvider, { locale: 'pt-BR', catalogs: { 'pt-BR': ptBR, es } }, () =>
          h(LanguageSelect)
        )
    })
    const { getByRole } = render(Wrapper)
    const trigger = getByRole('combobox', { name: 'Idioma' })
    await user.click(trigger)
    await waitFor(() => items().length === 3)
    expect(searchInput().getAttribute('placeholder')).toBe('Buscar idioma')
  })

  it('round-trips v-model with ConfigProvider in the Default example', async () => {
    const user = userEvent.setup()
    const { getByRole, getByTestId } = render(Default)
    expect(getByTestId('config-provider').getAttribute('lang')).toBe('en-US')
    await user.click(getByRole('combobox', { name: 'Language' }))
    await waitFor(() => items().length === 3)
    await user.click(items()[1])
    await waitFor(() => getByTestId('config-provider').getAttribute('lang') === 'pt-BR')
    expect(getByTestId('config-provider').getAttribute('lang')).toBe('pt-BR')
  })

  it('keeps the short code left-to-right under dir rtl', async () => {
    const value = ref('pt-BR')
    const Wrapper = defineComponent({
      setup: () => () =>
        h(ConfigProvider, { dir: 'rtl', locale: 'en' }, () =>
          h(LanguageSelect, {
            variant: 'ghost',
            modelValue: value.value,
            'onUpdate:modelValue': (next: string) => (value.value = next)
          })
        )
    })
    const { getByTestId } = render(Wrapper)
    expect(getByTestId('config-provider').getAttribute('dir')).toBe('rtl')
    expect(getByTestId('language-select__code').getAttribute('dir')).toBe('ltr')
  })

  it('has no axe violations closed, open, and in the Default example', async () => {
    const user = userEvent.setup()
    const closed = render(LanguageSelect, { props: { modelValue: 'en-US' } })
    await expectNoA11yViolations(closed.container)
    await user.click(closed.getByRole('combobox'))
    await waitFor(() => items().length === 3)
    await expectNoA11yViolations(content() as HTMLElement)
    closed.unmount()
    const example = render(Default)
    await expectNoA11yViolations(example.container)
    example.unmount()
    const variants = render(Variants)
    await expectNoA11yViolations(variants.container)
    variants.unmount()
    const rtl = render(Rtl)
    await expectNoA11yViolations(rtl.container)
  })
})
