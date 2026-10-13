import type { FigureDefinition } from '../engine/types'

export const lineFigures = {
  'azion-404': () => import('./azion-404').then((m) => m.azion404),
  'build-terminal': () => import('./build-terminal').then((m) => m.buildTerminal),
  'secure-shield': () => import('./secure-shield').then((m) => m.secureShield),
  'infra-workloads': () => import('./infra-workloads').then((m) => m.infraWorkloads),
  'ai-versioning': () => import('./ai-versioning').then((m) => m.aiVersioning),
  'store-replicas': () => import('./store-replicas').then((m) => m.storeReplicas),
  'observe-stream': () => import('./observe-stream').then((m) => m.observeStream),
  'platform-edge': () => import('./platform-edge').then((m) => m.platformEdge),
  'cache-ttl': () => import('./cache-ttl').then((m) => m.cacheTtl),
  'lb-rotor': () => import('./lb-rotor').then((m) => m.lbRotor),
  'ddos-flood': () => import('./ddos-flood').then((m) => m.ddosFlood),
  'bot-lineup': () => import('./bot-lineup').then((m) => m.botLineup),
  'dns-lookup': () => import('./dns-lookup').then((m) => m.dnsLookup),
  'metrics-gauge': () => import('./metrics-gauge').then((m) => m.metricsGauge),
  'image-variants': () => import('./image-variants').then((m) => m.imageVariants),
  'orchestrator-scale': () => import('./orchestrator-scale').then((m) => m.orchestratorScale)
} satisfies Record<string, () => Promise<FigureDefinition>>

export type LineFigureName = keyof typeof lineFigures

export const lineFigureNames = Object.keys(lineFigures) as LineFigureName[]

export function resolveLineFigure(name: string): (() => Promise<FigureDefinition>) | null {
  return name in lineFigures ? lineFigures[name as LineFigureName] : null
}
