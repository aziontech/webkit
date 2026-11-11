import { render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import { es } from '../../locales/es'
import { ptBR } from '../../locales/pt-BR'
import {
  BUILT_IN_CATALOGS,
  directionOf,
  en,
  mergeMessages,
  type MessageKey,
  pickCatalog,
  provideLocale,
  useLocale
} from './index'
import { createMessageHelpers, intlLocale, useTranslate } from './use-translate'

const ALL = { ...BUILT_IN_CATALOGS, 'pt-BR': ptBR, es }

function probe(setupParent?: () => void) {
  let helpers: ReturnType<typeof useLocale> | null = null
  const Child = defineComponent({
    setup() {
      helpers = useLocale(en)
      return () => h('span')
    }
  })
  const Parent = defineComponent({
    setup() {
      setupParent?.()
      return () => h(Child)
    }
  })
  render(Parent)
  return helpers as unknown as ReturnType<typeof useLocale>
}

describe('useLocale', () => {
  describe('without a provider', () => {
    it('falls back to English, left to right', () => {
      const l = probe()
      expect(l.locale.value).toBe('en')
      expect(l.dir.value).toBe('ltr')
      expect(l.t('pagination.next')).toBe('Next page')
      expect(l.t('dialog.close')).toBe('Close')
    })

    it('fills {name} placeholders and formats numeric params', () => {
      const l = probe()
      expect(l.t('pagination.info', { start: 1, end: 10, total: 1200 })).toBe(
        'Showing 1 to 10 of 1,200 entries'
      )
      expect(l.t('chip.removeNamed', { label: 'prod' })).toBe('Remove prod')
    })

    it('picks a plural form by count', () => {
      const l = probe()
      expect(l.t('logView.lines', { count: 1 })).toBe('1 line')
      expect(l.t('logView.lines', { count: 4 })).toBe('4 lines')
      expect(l.plural(0, { zero: 'none', one: 'one', other: 'many' })).toBe('none')
    })

    it('reads only the fallback it is given', () => {
      let bare: ReturnType<typeof useLocale> | null = null
      render(
        defineComponent({
          setup() {
            bare = useLocale({ dialog: en.dialog })
            return () => h('span')
          }
        })
      )
      const l = bare as unknown as ReturnType<typeof useLocale>
      expect(l.t('dialog.close')).toBe('Close')
      expect(l.t('pagination.next')).toBe('pagination.next')
    })

    it('returns the key itself for an unknown key', () => {
      const l = probe()
      expect(l.t('nope.missing' as MessageKey)).toBe('nope.missing')
    })

    it('formats with Intl in English', () => {
      const l = probe()
      expect(l.formatNumber(1234.5)).toBe('1,234.5')
      expect(l.formatList(['a', 'b'])).toBe('a and b')
      expect(l.formatRelativeTime(2, 'hour')).toBe('in 2 hours')
      expect(l.formatRelativeTime(new Date(Date.now() - 3 * 86_400_000))).toBe('3 days ago')
      expect(l.formatFileSize(0)).toBe('0 byte')
      expect(l.formatFileSize(5 * 1024 * 1024)).toBe('5 MB')
      expect(l.formatDate(new Date(2026, 5, 1), { month: 'short', day: 'numeric' })).toBe('Jun 1')
    })
  })

  describe('under provideLocale', () => {
    it('reads the provided catalog and direction', () => {
      const l = probe(() =>
        provideLocale({ locale: 'ar', catalogs: BUILT_IN_CATALOGS, dir: 'auto' })
      )
      expect(l.dir.value).toBe('rtl')
      expect(l.t('dialog.close')).toBe('Close')
    })

    it('reads Portuguese for pt-BR', () => {
      const l = probe(() => provideLocale({ locale: 'pt-BR', catalogs: ALL }))
      expect(l.t('dialog.close')).toBe('Fechar')
      expect(l.t('wizard.stepOf', { step: 2, total: 4 })).toBe('Etapa 2 de 4')
    })

    it('ships only English built in: an unregistered es falls back to English with one dev warning', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      try {
        expect(Object.keys(BUILT_IN_CATALOGS)).toEqual(['en'])
        const l = probe(() => provideLocale({ locale: 'es-AR', catalogs: BUILT_IN_CATALOGS }))
        expect(l.t('dialog.close')).toBe('Close')
        probe(() => provideLocale({ locale: 'es-AR', catalogs: BUILT_IN_CATALOGS }))
        expect(warn).toHaveBeenCalledTimes(1)
        expect(String(warn.mock.calls[0]?.[0])).toContain('@aziontech/webkit/locales/es')
      } finally {
        warn.mockRestore()
      }
    })

    it('does not warn for a locale WebKit ships no catalog for', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      try {
        const l = probe(() => provideLocale({ locale: 'ja', catalogs: BUILT_IN_CATALOGS }))
        expect(l.t('dialog.close')).toBe('Close')
        expect(warn).not.toHaveBeenCalled()
      } finally {
        warn.mockRestore()
      }
    })
  })

  describe('helpers', () => {
    it('directionOf: ar, he, fa, ur are right to left', () => {
      expect(directionOf('ar-EG')).toBe('rtl')
      expect(directionOf('he')).toBe('rtl')
      expect(directionOf('fa-IR')).toBe('rtl')
      expect(directionOf('ur')).toBe('rtl')
      expect(directionOf('pt-BR')).toBe('ltr')
      expect(directionOf('en')).toBe('ltr')
    })

    it('pickCatalog: exact tag, then language, then English', () => {
      expect(pickCatalog('pt-BR', ALL)).toBe(ptBR)
      expect(pickCatalog('pt-pt', ALL)).toBe(ptBR)
      expect(pickCatalog('en-GB', ALL)).toBe(en)
      expect(pickCatalog('de', ALL)).toBe(en)
    })

    it('mergeMessages deep-merges one group without mutating the base', () => {
      const merged = mergeMessages(ptBR, { pagination: { next: 'Seguinte' } })
      expect(merged.pagination.next).toBe('Seguinte')
      expect(merged.pagination.previous).toBe('Página anterior')
      expect(ptBR.pagination.next).toBe('Próxima página')
    })
  })

  describe('useTranslate', () => {
    function lean(setupParent?: () => void) {
      let helpers: ReturnType<typeof useTranslate> | null = null
      let full: ReturnType<typeof useLocale> | null = null
      const Child = defineComponent({
        setup() {
          helpers = useTranslate(en)
          full = useLocale(en)
          return () => h('span')
        }
      })
      render(
        defineComponent({
          setup() {
            setupParent?.()
            return () => h(Child)
          }
        })
      )
      return {
        l: helpers as unknown as ReturnType<typeof useTranslate>,
        full: full as unknown as ReturnType<typeof useLocale>
      }
    }

    it('reads, fills, formats and pluralizes like useLocale', () => {
      const { l, full } = lean()
      expect(l.locale.value).toBe('en')
      expect(l.dir.value).toBe('ltr')
      const cases: [MessageKey, Record<string, string | number>?][] = [
        ['pagination.next'],
        ['pagination.info', { start: 1, end: 10, total: 1200 }],
        ['chip.removeNamed', { label: 'prod' }],
        ['logView.lines', { count: 1 }],
        ['logView.lines', { count: 4 }],
        ['nope.missing' as MessageKey]
      ]
      for (const [key, params] of cases) expect(l.t(key, params)).toBe(full.t(key, params))
      expect(l.t('pagination.info', { start: 1, end: 10, total: 1200 })).toBe(
        'Showing 1 to 10 of 1,200 entries'
      )
    })

    it('follows the provider', () => {
      const { l } = lean(() => provideLocale({ locale: 'pt-BR', catalogs: ALL }))
      expect(l.locale.value).toBe('pt-BR')
      expect(l.t('wizard.stepOf', { step: 2, total: 4 })).toBe('Etapa 2 de 4')
    })
  })
})

describe('intlLocale — the same digits on the server and in every engine', () => {
  it('pins Latin digits unless the tag picks a numbering system', () => {
    expect(intlLocale('ar')).toBe('ar-u-nu-latn')
    expect(intlLocale('pt-BR')).toBe('pt-BR-u-nu-latn')
    expect(intlLocale('ar-u-ca-islamic')).toBe('ar-u-nu-latn-ca-islamic')
    expect(intlLocale('ar-u-nu-arab')).toBe('ar-u-nu-arab')
    expect(intlLocale('ar-u-ca-islamic-nu-arab')).toBe('ar-u-ca-islamic-nu-arab')
  })

  it('formats an Arabic page with Latin digits, as Node renders it', () => {
    const { formatNumber } = createMessageHelpers(
      () => 'ar',
      () => ({})
    )
    expect(formatNumber(48)).toBe('48')
    expect(new Intl.NumberFormat(intlLocale('ar-u-nu-arab')).format(48)).toBe('٤٨')
  })
})
