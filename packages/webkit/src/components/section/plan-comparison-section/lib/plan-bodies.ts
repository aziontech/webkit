import type {
  PlanComparisonSectionRow,
  PlanComparisonSectionSection
} from '../plan-comparison-section.vue'

export const isCategory = (row: PlanComparisonSectionRow) =>
  Boolean(row.group) && row.values.every((value) => value === '' || value === undefined)

export const bodiesOf = (section: PlanComparisonSectionSection) =>
  section.rows.reduce<
    { start: number; rows: { row: PlanComparisonSectionRow; rowIndex: number }[] }[]
  >(
    (bodies, row, rowIndex) => {
      if (isCategory(row)) bodies.push({ start: rowIndex, rows: [] })
      bodies[bodies.length - 1]?.rows.push({ row, rowIndex })
      return bodies
    },
    [{ start: -1, rows: [] }]
  )
