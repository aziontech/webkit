import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import CustomMessages from '../../../../examples/webkit-provider/custom-messages.vue'
import Default from '../../../../examples/webkit-provider/default.vue'
import RightToLeft from '../../../../examples/webkit-provider/right-to-left.vue'
import { useLocale } from '../../../composables/use-locale'
import { expectNoA11yViolations } from '../../../test/axe'
import Pagination from '../../data/pagination/pagination.vue'
import Chip from '../../inputs/chip/chip.vue'
import PasswordRequirements from '../../inputs/password-requirements/password-requirements.vue'
import Dialog from '../../overlay/dialog/dialog.vue'
import DialogClose from '../../overlay/dialog/dialog-close.vue'
import DialogContent from '../../overlay/dialog/dialog-content.vue'
import DialogPortal from '../../overlay/dialog/dialog-portal.vue'
import DialogTitle from '../../overlay/dialog/dialog-title.vue'
import WebkitProvider from './webkit-provider.vue'

const withProvider = (props: Record<string, unknown>, child: () => ReturnType<typeof h>) =>
  defineComponent({ setup: () => () => h(WebkitProvider, props, { default: child }) })

const settle = async () => {
  await nextTick()
  await nextTick()
}

afterEach(async () => {
  await settle()
})

describe('WebkitProvider', () => {
  describe('root element', () => {
    it('renders a wrapper carrying lang, dir and the default testid', () => {
      const { getByTestId } = render(withProvider({ locale: 'pt-BR' }, () => h('span', 'x')))
      const root = getByTestId('utils-webkit-provider')
      expect(root.getAttribute('lang')).toBe('pt-BR')
      expect(root.getAttribute('dir')).toBe('ltr')
    })

    it('defaults to English, left to right', () => {
      const { getByTestId } = render(WebkitProvider)
      expect(getByTestId('utils-webkit-provider').getAttribute('lang')).toBe('en')
      expect(getByTestId('utils-webkit-provider').getAttribute('dir')).toBe('ltr')
    })

    it('derives dir="rtl" from an Arabic, Hebrew, Persian or Urdu locale', () => {
      for (const locale of ['ar', 'he-IL', 'fa', 'ur-PK']) {
        const { getAllByTestId, unmount } = render(withProvider({ locale }, () => h('span')))
        expect(getAllByTestId('utils-webkit-provider')[0]?.getAttribute('dir')).toBe('rtl')
        unmount()
      }
    })

    it('an explicit dir wins over the locale', () => {
      const { getByTestId } = render(withProvider({ locale: 'ar', dir: 'ltr' }, () => h('span')))
      expect(getByTestId('utils-webkit-provider').getAttribute('dir')).toBe('ltr')
    })

    it('forwards consumer attributes to the wrapper', () => {
      const { getByTestId } = render(WebkitProvider, {
        attrs: { class: 'app-root', 'data-testid': 'root' }
      })
      expect(getByTestId('root').className).toContain('app-root')
    })
  })

  describe('built-in strings', () => {
    it('without a provider, Pagination reads English', () => {
      const { getByTestId, getByLabelText } = render(Pagination, { props: { total: 1200 } })
      expect(getByTestId('data-pagination').getAttribute('aria-label')).toBe('Pagination')
      expect(getByLabelText('Previous page')).toBeTruthy()
      expect(getByLabelText('Next page')).toBeTruthy()
      expect(getByTestId('data-pagination__info').textContent?.trim()).toBe(
        'Showing 1 to 10 of 1,200 entries'
      )
    })

    it('with locale="pt-BR", Pagination reads Portuguese and formats numbers for Brazil', () => {
      const { getByTestId, getByLabelText } = render(
        withProvider({ locale: 'pt-BR' }, () => h(Pagination, { total: 1200 }))
      )
      expect(getByTestId('data-pagination').getAttribute('aria-label')).toBe('Paginação')
      expect(getByLabelText('Página anterior')).toBeTruthy()
      expect(getByLabelText('Próxima página')).toBeTruthy()
      expect(getByLabelText('Linhas por página')).toBeTruthy()
      expect(getByTestId('data-pagination__info').textContent?.trim()).toBe(
        'Mostrando 1 a 10 de 1.200 registros'
      )
    })

    it('a label prop still wins over the catalog', () => {
      const { getByTestId } = render(
        withProvider({ locale: 'pt-BR' }, () => h(Pagination, { ariaLabel: 'Domínios' }))
      )
      expect(getByTestId('data-pagination').getAttribute('aria-label')).toBe('Domínios')
    })

    it('with locale="pt-BR", the Dialog close button is named "Fechar"', async () => {
      const Tree = defineComponent({
        components: { Dialog, DialogPortal, DialogContent, DialogTitle, DialogClose },
        setup: () => ({ open: ref(true) }),
        template: `
          <Dialog v-model:open="open">
            <DialogPortal>
              <DialogContent>
                <DialogTitle>Excluir domínio</DialogTitle>
                <DialogClose />
              </DialogContent>
            </DialogPortal>
          </Dialog>
        `
      })
      render(withProvider({ locale: 'pt-BR' }, () => h(Tree)))
      await settle()
      const close = document.body.querySelector('[data-testid="overlay-dialog__close"]')
      expect(close?.getAttribute('aria-label')).toBe('Fechar')
    })

    it('with locale="pt-BR", Chip and PasswordRequirements read Portuguese', () => {
      const { getByLabelText, getByTestId } = render(
        withProvider({ locale: 'pt-BR' }, () =>
          h('div', [
            h(Chip, { label: 'Produção', removable: true }),
            h(PasswordRequirements, { value: 'abc' })
          ])
        )
      )
      expect(getByLabelText('Remover Produção')).toBeTruthy()
      const requirements = getByTestId('input-password-requirements')
      expect(requirements.textContent).toContain('Deve conter:')
      expect(requirements.textContent).toContain('Letra maiúscula')
    })

    it('a locale with no catalog falls back to the same language, then to English', () => {
      const pt = render(withProvider({ locale: 'pt-PT' }, () => h(Pagination, { total: 5 })))
      expect(pt.getByLabelText('Próxima página')).toBeTruthy()
      pt.unmount()
      const ja = render(withProvider({ locale: 'ja' }, () => h(Pagination, { total: 5 })))
      expect(ja.getByLabelText('Next page')).toBeTruthy()
    })

    it('messages overrides one string and keeps the rest of the catalog', () => {
      const { getByLabelText } = render(
        withProvider({ locale: 'pt-BR', messages: { pagination: { next: 'Seguinte' } } }, () =>
          h(Pagination, { total: 50 })
        )
      )
      expect(getByLabelText('Seguinte')).toBeTruthy()
      expect(getByLabelText('Página anterior')).toBeTruthy()
    })

    it('reacts when the locale changes', async () => {
      const locale = ref('en')
      const Host = defineComponent({
        setup: () => () =>
          h(
            WebkitProvider,
            { locale: locale.value },
            { default: () => h(Pagination, { total: 5 }) }
          )
      })
      const { getByLabelText } = render(Host)
      expect(getByLabelText('Next page')).toBeTruthy()
      locale.value = 'pt-BR'
      await nextTick()
      expect(getByLabelText('Próxima página')).toBeTruthy()
    })
  })

  describe('useLocale inside the provider', () => {
    it('formats numbers, dates, lists, relative times, file sizes and plurals for the locale', () => {
      let helpers: ReturnType<typeof useLocale> | null = null
      const Probe = defineComponent({
        setup() {
          helpers = useLocale()
          return () => h('span')
        }
      })
      render(withProvider({ locale: 'pt-BR' }, () => h(Probe)))
      const l = helpers as unknown as ReturnType<typeof useLocale>
      expect(l.locale.value).toBe('pt-BR')
      expect(l.formatNumber(1234.5)).toBe('1.234,5')
      expect(l.formatDate(new Date(2026, 0, 15), { day: 'numeric', month: 'long' })).toBe(
        '15 de janeiro'
      )
      expect(l.formatList(['a', 'b', 'c'])).toBe('a, b e c')
      expect(l.formatRelativeTime(-1, 'day')).toBe('ontem')
      expect(l.formatFileSize(1536)).toBe('1,5 kB')
      expect(l.plural(1, { one: '{count} item', other: '{count} itens' })).toBe('1 item')
      expect(l.plural(3, { one: '{count} item', other: '{count} itens' })).toBe('3 itens')
      expect(l.t('logView.lines', { count: 2 })).toBe('2 linhas')
    })
  })

  describe('examples', () => {
    it('Default renders Pagination and ConfirmDialog in Portuguese', () => {
      const { getByLabelText } = render(Default)
      expect(getByLabelText('Próxima página')).toBeTruthy()
    })

    it('a Portuguese subtree has no a11y violations', async () => {
      const { container } = render(
        withProvider({ locale: 'pt-BR' }, () => h(Pagination, { total: 48 }))
      )
      await expectNoA11yViolations(container)
    })

    it('CustomMessages replaces the pagination info line', () => {
      const { getByTestId } = render(CustomMessages)
      expect(getByTestId('data-pagination__info').textContent?.trim()).toBe('1–10 de 48 domínios')
    })

    it('RightToLeft turns the subtree right to left', () => {
      const { getByTestId } = render(RightToLeft)
      expect(getByTestId('utils-webkit-provider').getAttribute('dir')).toBe('rtl')
    })
  })
})
