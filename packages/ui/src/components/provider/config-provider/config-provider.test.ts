import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, inject, nextTick, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'

import CustomMessages from '../../../../examples/config-provider/custom-messages.vue'
import Default from '../../../../examples/config-provider/default.vue'
import DeviceLocale from '../../../../examples/config-provider/device-locale.vue'
import Rtl from '../../../../examples/config-provider/rtl.vue'
import { LocaleInjectionKey, useLocale } from '../../../composables/use-locale'
import { ptBR } from '../../../locales/pt-BR'
import { expectNoA11yViolations } from '../../../test/axe'
import Pagination from '../../data/pagination/pagination.vue'
import Chip from '../../input/chip/chip.vue'
import PasswordRequirements from '../../input/password-requirements/password-requirements.vue'
import Dialog from '../../overlay/dialog/dialog.vue'
import DialogClose from '../../overlay/dialog/dialog-close.vue'
import DialogContent from '../../overlay/dialog/dialog-content.vue'
import DialogTitle from '../../overlay/dialog/dialog-title.vue'
import Drawer from '../../overlay/drawer/index'
import ConfigProvider from './config-provider.vue'

const catalogs = { 'pt-BR': ptBR }

const withProvider = (props: Record<string, unknown>, child: () => ReturnType<typeof h>) =>
  defineComponent({
    setup: () => () => h(ConfigProvider, { catalogs, ...props }, { default: child })
  })

const settle = async () => {
  await nextTick()
  await nextTick()
}

afterEach(async () => {
  await settle()
})

describe('ConfigProvider', () => {
  describe('root element', () => {
    it('renders a wrapper carrying lang, dir and the default testid', () => {
      const { getByTestId } = render(withProvider({ locale: 'pt-BR' }, () => h('span', 'x')))
      const root = getByTestId('config-provider')
      expect(root.getAttribute('lang')).toBe('pt-BR')
      expect(root.getAttribute('dir')).toBe('ltr')
    })

    it('defaults to the device locale (pinned to en-US in this suite) and sets no direction', () => {
      const { getByTestId } = render(ConfigProvider)
      expect(getByTestId('config-provider').getAttribute('lang')).toBe('en-US')
      expect(getByTestId('config-provider').hasAttribute('dir')).toBe(false)
    })

    it('inherits a right-to-left page when it sets only now or timeZone', () => {
      const Probe = defineComponent({
        setup: () => {
          const { dir } = useLocale()
          return () => h('span', { 'data-testid': 'probe' }, dir.value)
        }
      })
      const { getAllByTestId, getByTestId } = render(
        withProvider({ dir: 'rtl' }, () =>
          h(ConfigProvider, { timeZone: 'UTC', now: 0 }, { default: () => h(Probe) })
        )
      )
      const inner = getAllByTestId('config-provider')[1]!
      expect(inner.hasAttribute('dir')).toBe(false)
      expect(inner.closest('[dir]')?.getAttribute('dir')).toBe('rtl')
      expect(getByTestId('probe').textContent).toBe('rtl')
    })

    it('lets a nested provider inherit the locale, catalogs, messages and now it does not set', () => {
      const Probe = defineComponent({
        setup: () => {
          const { locale, t, formatRelativeTime } = useLocale()
          return () =>
            h(
              'span',
              { 'data-testid': 'probe' },
              [
                locale.value,
                t('chip.remove'),
                t('toolApproval.deny'),
                t('toolApproval.approve'),
                formatRelativeTime(new Date('2026-11-11T14:00:00Z'))
              ].join('|')
            )
        }
      })
      const { getAllByTestId, getByTestId } = render(
        withProvider(
          {
            locale: 'pt-BR',
            messages: { toolApproval: { deny: 'Recusar' } },
            now: '2026-11-11T15:00:00Z'
          },
          () =>
            h(
              ConfigProvider,
              { messages: { toolApproval: { approve: 'Confirmar' } } },
              { default: () => h(Probe) }
            )
        )
      )
      expect(getAllByTestId('config-provider')[1]!.getAttribute('lang')).toBe('pt-BR')
      expect(getByTestId('probe').textContent).toBe('pt-BR|Remover|Recusar|Confirmar|há 1 hora')
    })

    it('derives dir="rtl" from an Arabic, Hebrew, Persian or Urdu locale', () => {
      for (const locale of ['ar', 'he-IL', 'fa', 'ur-PK']) {
        const { getAllByTestId, unmount } = render(withProvider({ locale }, () => h('span')))
        expect(getAllByTestId('config-provider')[0]?.getAttribute('dir')).toBe('rtl')
        unmount()
      }
    })

    it('an explicit dir wins over the locale', () => {
      const { getByTestId } = render(withProvider({ locale: 'ar', dir: 'ltr' }, () => h('span')))
      expect(getByTestId('config-provider').getAttribute('dir')).toBe('ltr')
    })

    it('forwards consumer attributes to the wrapper', () => {
      const { getByTestId } = render(ConfigProvider, {
        attrs: { class: 'app-root', 'data-testid': 'root' }
      })
      expect(getByTestId('root').className).toContain('app-root')
    })
  })

  describe('built-in strings', () => {
    it('without a provider, Pagination reads English', () => {
      const { getByTestId, getByLabelText } = render(Pagination, { props: { total: 1200 } })
      expect(getByTestId('pagination').getAttribute('aria-label')).toBe('Pagination')
      expect(getByLabelText('Previous page')).toBeTruthy()
      expect(getByLabelText('Next page')).toBeTruthy()
      expect(getByTestId('pagination-description').textContent?.trim()).toBe(
        'Showing 1 to 10 of 1,200 entries'
      )
    })

    it('with locale="pt-BR", Pagination reads Portuguese and formats numbers for Brazil', () => {
      const { getByTestId, getByLabelText } = render(
        withProvider({ locale: 'pt-BR' }, () => h(Pagination, { total: 1200 }))
      )
      expect(getByTestId('pagination').getAttribute('aria-label')).toBe('Paginação')
      expect(getByLabelText('Página anterior')).toBeTruthy()
      expect(getByLabelText('Próxima página')).toBeTruthy()
      expect(getByLabelText('Linhas por página')).toBeTruthy()
      expect(getByTestId('pagination-description').textContent?.trim()).toBe(
        'Mostrando 1 a 10 de 1.200 registros'
      )
    })

    it('a label prop still wins over the catalog', () => {
      const { getByTestId } = render(
        withProvider({ locale: 'pt-BR' }, () => h(Pagination, { ariaLabel: 'Domínios' }))
      )
      expect(getByTestId('pagination').getAttribute('aria-label')).toBe('Domínios')
    })

    it('with locale="pt-BR", the Dialog close button is named "Fechar"', async () => {
      const Tree = defineComponent({
        components: { Dialog, DialogContent, DialogTitle, DialogClose },
        setup: () => ({ open: ref(true) }),
        template: `
          <Dialog v-model:open="open">
            <DialogContent>
              <DialogTitle>Excluir domínio</DialogTitle>
              <DialogClose />
            </DialogContent>
          </Dialog>
        `
      })
      render(withProvider({ locale: 'pt-BR' }, () => h(Tree)))
      await settle()
      const close = document.body.querySelector('[data-testid="dialog-close"]')
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
      const requirements = getByTestId('password-requirements')
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

    it('an unregistered pt-BR falls back to English with a dev warning naming the locale entry', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      try {
        const view = render(
          withProvider({ locale: 'pt-BR', catalogs: {} }, () => h(Pagination, { total: 5 }))
        )
        expect(view.getByLabelText('Next page')).toBeTruthy()
        expect(view.getByTestId('config-provider').getAttribute('lang')).toBe('pt-BR')
        expect(warn.mock.calls.map((c) => String(c[0])).join('\n')).toContain(
          '@aziontech/ui/locales/pt-BR'
        )
      } finally {
        warn.mockRestore()
      }
    })

    it('a registered pt-BR renders Portuguese on the server and hydrates without mismatches', async () => {
      const App = withProvider({ locale: 'pt-BR' }, () => h(Pagination, { total: 1200 }))
      const html = await renderToString(createSSRApp(App))
      expect(html).toContain('Próxima página')
      expect(html).toContain('Mostrando 1 a 10 de 1.200 registros')
      const host = document.createElement('div')
      host.innerHTML = html
      document.body.appendChild(host)
      const messages: string[] = []
      const collect = (...args: unknown[]) => messages.push(args.map(String).join(' '))
      const warn = vi.spyOn(console, 'warn').mockImplementation(collect)
      const error = vi.spyOn(console, 'error').mockImplementation(collect)
      try {
        const app = createSSRApp(App)
        app.mount(host)
        await settle()
        expect(messages.filter((m) => /hydration/i.test(m))).toEqual([])
        expect(host.querySelector('[aria-label="Próxima página"]')).toBeTruthy()
        app.unmount()
      } finally {
        warn.mockRestore()
        error.mockRestore()
        host.remove()
      }
    })

    it('with no locale, renders en-US on the server, hydrates cleanly, then follows the device', async () => {
      vi.spyOn(navigator, 'language', 'get').mockReturnValue('pt-BR')
      const App = withProvider({}, () => h(Pagination, { total: 1200 }))
      const html = await renderToString(createSSRApp(App))
      expect(html).toContain('lang="en-US"')
      expect(html).toContain('Showing 1 to 10 of 1,200 entries')
      const host = document.createElement('div')
      host.innerHTML = html
      document.body.appendChild(host)
      const messages: string[] = []
      const collect = (...args: unknown[]) => messages.push(args.map(String).join(' '))
      vi.spyOn(console, 'warn').mockImplementation(collect)
      vi.spyOn(console, 'error').mockImplementation(collect)
      try {
        const app = createSSRApp(App)
        app.mount(host)
        await settle()
        expect(messages.filter((m) => /hydration/i.test(m))).toEqual([])
        expect(host.querySelector('[lang]')?.getAttribute('lang')).toBe('pt-BR')
        expect(host.querySelector('[aria-label="Próxima página"]')).toBeTruthy()
        expect(host.textContent).toContain('1.200')
        app.unmount()
      } finally {
        vi.restoreAllMocks()
        host.remove()
      }
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
            ConfigProvider,
            { locale: locale.value, catalogs },
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
      expect(l.t('logViewer.lines', { count: 2 })).toBe('2 linhas')
    })
  })

  describe('now', () => {
    it('gives every relative time below it one reference time, reactively', async () => {
      const NOW = Date.UTC(2026, 10, 10, 12)
      const now = ref<number | undefined>(NOW)
      let helpers: ReturnType<typeof useLocale> | null = null
      const Probe = defineComponent({
        setup() {
          helpers = useLocale()
          return () => h('span')
        }
      })
      const Host = defineComponent({
        setup: () => () => h(ConfigProvider, { now: now.value }, { default: () => h(Probe) })
      })
      render(Host)
      const l = helpers as unknown as ReturnType<typeof useLocale>
      const target = new Date(NOW - 3 * 86_400_000)
      expect(l.formatRelativeTime(target)).toBe('3 days ago')
      now.value = NOW + 4 * 86_400_000
      await nextTick()
      expect(l.formatRelativeTime(target)).toBe('last week')
      now.value = undefined
      await nextTick()
      expect(l.formatRelativeTime(new Date(Date.now() - 86_400_000))).toBe('yesterday')
    })
  })

  describe('inheritance', () => {
    const NOW = Date.UTC(2026, 10, 10, 12)

    const DirProbe = defineComponent({
      setup: () => {
        const { dir } = useLocale()
        return () => h('span', { 'data-testid': 'probe' }, dir.value)
      }
    })

    const ValueProbe = defineComponent({
      setup: () => {
        const context = inject(LocaleInjectionKey, null)
        const { locale, t, formatRelativeTime } = useLocale()
        return () =>
          h(
            'span',
            { 'data-testid': 'probe' },
            [
              locale.value,
              context?.timeZone?.value ?? '',
              t('pagination.next'),
              formatRelativeTime(new Date(NOW - 3 * 86_400_000))
            ].join('|')
          )
      }
    })

    const drawer = () =>
      h(Drawer, { open: true, side: 'end' }, () =>
        h(Drawer.Content, null, () => h(Drawer.Title, null, () => 'Ticket details'))
      )

    const panelDir = () =>
      document.body
        .querySelector('[data-testid="drawer-content"]')
        ?.closest('[dir]')
        ?.getAttribute('dir')

    const onPage = async (dir: 'rtl', run: () => Promise<void>) => {
      document.documentElement.setAttribute('dir', dir)
      try {
        await run()
      } finally {
        document.documentElement.removeAttribute('dir')
      }
    }

    it('a root provider with no dir or locale leaves a teleported Drawer to the page direction', () =>
      onPage('rtl', async () => {
        const { getByTestId } = render(withProvider({}, () => h('div', [h(DirProbe), drawer()])))
        await settle()
        const portal = document.body.querySelector('[data-testid="drawer-content__portal"]')
        expect(portal?.hasAttribute('dir')).toBe(false)
        expect(panelDir()).toBe('rtl')
        expect(getByTestId('probe').textContent).toBe('rtl')
      }))

    it('follows the page when its direction changes after mount', () =>
      onPage('rtl', async () => {
        const { getByTestId } = render(withProvider({}, () => h(DirProbe)))
        await settle()
        expect(getByTestId('probe').textContent).toBe('rtl')
        document.documentElement.setAttribute('dir', 'ltr')
        await settle()
        expect(getByTestId('probe').textContent).toBe('ltr')
      }))

    it('an explicit dir or locale still writes its direction on the teleported panel', () =>
      onPage('rtl', async () => {
        const ltr = render(withProvider({ dir: 'ltr' }, () => drawer()))
        await settle()
        expect(panelDir()).toBe('ltr')
        ltr.unmount()
        document.documentElement.removeAttribute('dir')
        render(withProvider({ locale: 'ar' }, () => drawer()))
        await settle()
        expect(panelDir()).toBe('rtl')
      }))

    it('renders no dir on the server under a right-to-left page and hydrates without mismatches', () =>
      onPage('rtl', async () => {
        const App = withProvider({}, () => h(DirProbe))
        const html = await renderToString(createSSRApp(App))
        expect(html).not.toContain('dir=')
        expect(html).toContain('>ltr<')
        const host = document.createElement('div')
        host.innerHTML = html
        document.body.appendChild(host)
        const messages: string[] = []
        const collect = (...args: unknown[]) => messages.push(args.map(String).join(' '))
        const warn = vi.spyOn(console, 'warn').mockImplementation(collect)
        const error = vi.spyOn(console, 'error').mockImplementation(collect)
        try {
          const app = createSSRApp(App)
          app.mount(host)
          await settle()
          expect(messages.filter((m) => /hydration/i.test(m))).toEqual([])
          expect(host.querySelector('[data-testid="probe"]')?.textContent).toBe('rtl')
          app.unmount()
        } finally {
          warn.mockRestore()
          error.mockRestore()
          host.remove()
        }
      }))

    it('a nested provider that sets only now keeps the locale, catalogs, overrides and time zone above it', () => {
      const { getAllByTestId, getByLabelText, getByTestId } = render(
        withProvider(
          {
            locale: 'pt-BR',
            timeZone: 'America/New_York',
            messages: { pagination: { previous: 'Voltar' } }
          },
          () =>
            h(
              ConfigProvider,
              { now: NOW },
              { default: () => h('div', [h(ValueProbe), h(Pagination, { total: 50 })]) }
            )
        )
      )
      expect(getByTestId('probe').textContent).toBe(
        'pt-BR|America/New_York|Próxima página|há 3 dias'
      )
      expect(getByLabelText('Voltar')).toBeTruthy()
      expect(getAllByTestId('config-provider')[1]?.getAttribute('lang')).toBe('pt-BR')
    })

    it('a nested provider inherits now and adds its own catalogs and overrides', () => {
      const { getByTestId } = render(
        withProvider({ now: NOW }, () =>
          h(
            ConfigProvider,
            { locale: 'pt-BR', catalogs: {}, messages: { pagination: { next: 'Seguinte' } } },
            { default: () => h(ValueProbe) }
          )
        )
      )
      expect(getByTestId('probe').textContent).toBe('pt-BR||Seguinte|há 3 dias')
    })

    it('explicit props on the nested provider win over the ones above', () => {
      const { getAllByTestId, getByTestId } = render(
        withProvider({ locale: 'pt-BR', timeZone: 'America/New_York', now: 0 }, () =>
          h(
            ConfigProvider,
            {
              locale: 'en',
              timeZone: 'UTC',
              now: NOW,
              dir: 'rtl',
              messages: { pagination: { next: 'Forward' } }
            },
            { default: () => h(ValueProbe) }
          )
        )
      )
      expect(getByTestId('probe').textContent).toBe('en|UTC|Forward|3 days ago')
      expect(getAllByTestId('config-provider')[1]?.getAttribute('dir')).toBe('rtl')
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
      expect(getByTestId('pagination-description').textContent?.trim()).toBe('1–10 de 48 domínios')
    })

    it('Rtl turns the subtree right to left', () => {
      const { getByTestId } = render(Rtl)
      expect(getByTestId('config-provider').getAttribute('dir')).toBe('rtl')
    })

    it('DeviceLocale prints the range for the device and keeps ISO instants in the value', async () => {
      vi.spyOn(navigator, 'language', 'get').mockReturnValue('pt-BR')
      try {
        const view = render(DeviceLocale)
        await settle()
        expect(view.getByTestId('config-provider').getAttribute('lang')).toBe('pt-BR')
        expect(view.container.textContent).toContain('nov.')
        expect(view.container.textContent).toContain(
          'Sent to the server: 2026-11-10T12:00:00.000Z to 2026-11-10T18:30:00.000Z'
        )
      } finally {
        vi.restoreAllMocks()
      }
    })
  })
})
