import { en } from './messages/en'
import { es } from './messages/es'
import { ptBR } from './messages/pt-BR'
import type { Messages } from './types'

export const BUILT_IN_CATALOGS: Record<string, Messages> = { en, 'pt-BR': ptBR, es }

export { en, es, ptBR }
