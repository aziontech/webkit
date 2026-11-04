import UseCases from '../use-cases/use-cases.vue'

export type SectionRegistry = {
  'use-cases': typeof UseCases
}

export const registry: SectionRegistry = {
  'use-cases': UseCases
}

export type SectionId = keyof SectionRegistry
