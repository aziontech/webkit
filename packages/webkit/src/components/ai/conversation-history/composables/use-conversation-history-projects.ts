import { computed, type ComputedRef, type MaybeRefOrGetter, toValue } from 'vue'

import type {
  ConversationHistoryItem,
  ConversationHistoryProject,
  ConversationHistoryProjectSort
} from '../conversation-history.vue'

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
  hasMatch: ComputedRef<boolean>
}

export const timeOf = (item: ConversationHistoryItem): number => {
  const time = new Date(item.updatedAt).getTime()
  return Number.isNaN(time) ? 0 : time
}

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

  const outside = computed<ConversationHistoryItem[]>(() =>
    toValue(options.items).filter((item) => !inProject(item) && matches(item))
  )

  const rows = computed<ConversationHistoryProjectRow[]>(() => {
    const byProject = new Map<string, { item: ConversationHistoryItem; time: number }[]>()
    for (const item of toValue(options.items)) {
      if (!inProject(item)) continue
      const bucket = byProject.get(item.projectId!) ?? []
      bucket.push({ item, time: timeOf(item) })
      byProject.set(item.projectId!, bucket)
    }
    const all = toValue(options.projects).map((project, index) => {
      const entries = (byProject.get(project.id) ?? []).sort((a, b) => b.time - a.time)
      return {
        project,
        index,
        latest: entries[0]?.time ?? -1,
        items: entries.filter(({ item }) => matches(item)).map(({ item }) => item)
      }
    })
    const shown = needle.value ? all.filter((row) => row.items.length) : all
    const locale = toValue(options.locale)
    const byName = toValue(options.sort) === 'name'
    return shown
      .sort((a, b) =>
        byName
          ? a.project.title.localeCompare(b.project.title, locale) || a.index - b.index
          : b.latest - a.latest || a.index - b.index
      )
      .map(({ project, index, items }) => ({ project, index, items }))
  })

  const hasMatch = computed<boolean>(
    () => outside.value.length > 0 || rows.value.some((row) => row.items.length > 0)
  )

  return { rows, outside, hasMatch }
}
