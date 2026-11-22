import { computed, type ComputedRef, type Ref } from 'vue'

import {
  diffLines,
  type LineDiffChange,
  type LineDiffLine,
  pairDiffLines
} from '../../../../utils/line-diff'
import type { CodeBlockTab } from '../code-block.vue'
import { type CodeBlockHighlightToken, highlightCode, plainLines } from '../lib/highlight-code'
import {
  buildLineChangeMap,
  type CodeBlockLineState,
  resolveLineState
} from '../lib/line-decorations'

export interface CodeBlockDisplayLine {
  tokens: CodeBlockHighlightToken[]
  number: number
  state: CodeBlockLineState
}

export interface CodeBlockSplitRow {
  start: CodeBlockDisplayLine | null | undefined
  end: CodeBlockDisplayLine | null | undefined
}

export interface UseCodeBlockLinesReturn {
  isDiff: ComputedRef<boolean>
  isSplit: ComputedRef<boolean>
  showDiffGutter: ComputedRef<boolean>
  displayLines: ComputedRef<CodeBlockDisplayLine[]>
  splitRows: ComputedRef<CodeBlockSplitRow[]>
}

const diffState = (
  change: LineDiffChange,
  number: number | null,
  highlighted: number | undefined
): CodeBlockLineState => {
  if (change !== 'unchanged') return change
  return number !== null && number === highlighted ? 'highlighted' : 'default'
}

function pairRows(
  rows: LineDiffLine[],
  original: CodeBlockHighlightToken[][],
  highlighted: CodeBlockHighlightToken[][],
  mark: number | undefined
): CodeBlockSplitRow[] {
  return pairDiffLines(rows).map((pair) => ({
    start: pair.left && {
      tokens: original[pair.left.number - 1] ?? [],
      number: pair.left.number,
      state: pair.left.change === 'removed' ? 'removed' : 'default'
    },
    end: pair.right && {
      tokens: highlighted[pair.right.number - 1] ?? [],
      number: pair.right.number,
      state: diffState(pair.right.change, pair.right.number, mark)
    }
  }))
}

export function useCodeBlockLines(
  activeTab: Readonly<Ref<CodeBlockTab | null>>,
  isOutput: Readonly<Ref<boolean>>,
  split: () => boolean
): UseCodeBlockLinesReturn {
  const isDiff = computed(() => typeof activeTab.value?.original === 'string')
  const highlighted = computed(() => {
    const tab = activeTab.value
    if (!tab) return [] as CodeBlockHighlightToken[][]
    return isOutput.value ? plainLines(tab.code) : highlightCode(tab.code, tab.language)
  })
  const original = computed(() =>
    isDiff.value ? highlightCode(activeTab.value?.original ?? '', activeTab.value?.language) : []
  )
  const rows = computed(() =>
    isDiff.value ? diffLines(activeTab.value?.original ?? '', activeTab.value?.code ?? '') : []
  )
  const changes = computed(() => buildLineChangeMap(activeTab.value?.lineChanges))
  const displayLines = computed<CodeBlockDisplayLine[]>(() => {
    const mark = activeTab.value?.highlightedLine
    if (!isDiff.value)
      return highlighted.value.map((tokens, index) => ({
        tokens,
        number: index + 1,
        state: resolveLineState(index + 1, changes.value, mark)
      }))
    return rows.value.map((row) => {
      const removed = row.change === 'removed'
      const number = (removed ? row.oldNumber : row.newNumber) ?? 0
      return {
        tokens: (removed ? original.value : highlighted.value)[number - 1] ?? [],
        number,
        state: diffState(row.change, row.newNumber, mark)
      }
    })
  })
  const isSplit = computed(() => isDiff.value && split())
  const splitRows = computed<CodeBlockSplitRow[]>(() =>
    isSplit.value
      ? pairRows(rows.value, original.value, highlighted.value, activeTab.value?.highlightedLine)
      : []
  )
  return {
    isDiff,
    isSplit,
    showDiffGutter: computed(() => isDiff.value || (activeTab.value?.lineChanges?.length ?? 0) > 0),
    displayLines,
    splitRows
  }
}
