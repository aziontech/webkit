import caixa from './caixa.svg'
import gpa from './gpa.svg'
import ifood from './ifood.svg'
import itau from './itau.svg'
import tray from './tray.svg'

export const normalizeClientName = (name: string | null | undefined): string =>
  (name ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

export const CLIENT_SYMBOLS: Record<string, string> = {
  caixaeconomicafederal: caixa,
  gpa,
  ifood,
  itau,
  tray
}

export const clientSymbolFor = (name: string | null | undefined): string | null =>
  CLIENT_SYMBOLS[normalizeClientName(name)] ?? null
