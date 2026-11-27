import { computed, type ComputedRef, type MaybeRefOrGetter, toValue } from 'vue'

import type {
  ConversationHistoryItem,
  ConversationHistoryProject,
  ConversationHistoryProjectSort
} from '../lib/types'

export interface ConversationHistoryProjectRow {
  project: ConversationHistoryProject
  index: number
  items: ConversationHistoryItem[]
}

export interface UseConversationHistoryProjectsOptions {
  items: MaybeRefOrGetter<readonly ConversationHistoryItem[]>
  projects: MaybeRefOrGetter<readonly ConversationHistoryProject[]>
  query: MaybeRefOrGetter<string>
  locale: MaybeRefOrGetter<string>
  sort: MaybeRefOrGetter<ConversationHistoryProjectSort>
}

export interface UseConversationHistoryProjectsReturn {
  rows: ComputedRef<ConversationHistoryProjectRow[]>
  outside: ComputedRef<ConversationHistoryItem[]>
  pinned: ComputedRef<ConversationHistoryItem[]>
  archived: ComputedRef<ConversationHistoryItem[]>
  hasMatch: ComputedRef<boolean>
}

export const timeOf = (item: ConversationHistoryItem): number => {
  const time = new Date(item.updatedAt).getTime()
  return Number.isNaN(time) ? 0 : time
}

const newestFirst = (list: ConversationHistoryItem[]): ConversationHistoryItem[] =>
  list
    .map((item) => ({ item, time: timeOf(item) }))
    .sort((a, b) => b.time - a.time)
    .map(({ item }) => item)

interface RankedRow extends ConversationHistoryProjectRow {
  latest: number
}

const projectRows = (
  filed: ConversationHistoryItem[],
  visible: ConversationHistoryItem[],
  projects: readonly ConversationHistoryProject[]
): RankedRow[] => {
  const latest = new Map<string, number>()
  for (const item of filed)
    latest.set(item.projectId!, Math.max(latest.get(item.projectId!) ?? -1, timeOf(item)))
  const byProject = new Map<string, ConversationHistoryItem[]>()
  for (const item of visible) {
    const bucket = byProject.get(item.projectId!) ?? []
    bucket.push(item)
    byProject.set(item.projectId!, bucket)
  }
  return projects.map((project, index) => ({
    project,
    index,
    latest: latest.get(project.id) ?? -1,
    items: newestFirst(byProject.get(project.id) ?? [])
  }))
}

const sortRows = (
  rows: RankedRow[],
  sort: ConversationHistoryProjectSort,
  locale: string
): ConversationHistoryProjectRow[] =>
  rows
    .sort(
      (a, b) =>
        Number(Boolean(b.project.pinned)) - Number(Boolean(a.project.pinned)) ||
        (sort === 'name'
          ? a.project.title.localeCompare(b.project.title, locale)
          : b.latest - a.latest) ||
        a.index - b.index
    )
    .map(({ project, index, items }) => ({ project, index, items }))

export function useConversationHistoryProjects(
  options: UseConversationHistoryProjectsOptions
): UseConversationHistoryProjectsReturn {
  const needle = computed<string>(() =>
    toValue(options.query).trim().toLocaleLowerCase(toValue(options.locale))
  )
  const projectIds = computed(() => new Set(toValue(options.projects).map((project) => project.id)))

  const matches = (item: ConversationHistoryItem): boolean =>
    !needle.value || item.title.toLocaleLowerCase(toValue(options.locale)).includes(needle.value)
  const inProject = (item: ConversationHistoryItem): boolean =>
    item.projectId !== undefined && projectIds.value.has(item.projectId)
  const listed = (item: ConversationHistoryItem): boolean => !item.pinned && !item.archived

  const pinned = computed<ConversationHistoryItem[]>(() =>
    newestFirst(
      toValue(options.items).filter((item) => item.pinned && !item.archived && matches(item))
    )
  )
  const archived = computed<ConversationHistoryItem[]>(() =>
    toValue(options.items).filter((item) => item.archived && matches(item))
  )
  const outside = computed<ConversationHistoryItem[]>(() =>
    toValue(options.items).filter((item) => listed(item) && !inProject(item) && matches(item))
  )

  const rows = computed<ConversationHistoryProjectRow[]>(() => {
    const filed = toValue(options.items).filter(inProject)
    const visible = filed.filter((item) => listed(item) && matches(item))
    const all = projectRows(filed, visible, toValue(options.projects))
    const shown = needle.value ? all.filter((row) => row.items.length) : all
    return sortRows(shown, toValue(options.sort), toValue(options.locale))
  })

  const hasMatch = computed<boolean>(
    () =>
      outside.value.length > 0 ||
      pinned.value.length > 0 ||
      rows.value.some((row) => row.items.length > 0)
  )

  return { rows, outside, pinned, archived, hasMatch }
}
