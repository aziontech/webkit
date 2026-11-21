import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import {
  type ChartCardContext,
  ChartCardInjectionKey
} from '../../components/chart/chart-card/injection-key'
import { useChartLabelling, type UseChartLabellingReturn } from './index'

function setup(ariaLabel: string, card?: Partial<ChartCardContext>): UseChartLabellingReturn {
  let api: UseChartLabellingReturn | undefined
  render(
    defineComponent({
      setup() {
        api = useChartLabelling(() => ariaLabel, 'summary')
        return () => h('div')
      }
    }),
    card ? { global: { provide: { [ChartCardInjectionKey as symbol]: card } } } : {}
  )
  return api!
}

const card = (hasTitle: boolean, hasDescription: boolean): Partial<ChartCardContext> => ({
  titleId: 'title',
  descriptionId: 'description',
  hasTitle: ref(hasTitle),
  hasDescription: ref(hasDescription)
})

describe('useChartLabelling', () => {
  it('names the chart from its label and describes it with the summary outside a card', () => {
    const api = setup('Requests')
    expect(api.accessibleName.value).toBe('Requests')
    expect(api.labelledBy.value).toBeUndefined()
    expect(api.describedBy.value).toBe('summary')
  })

  it('takes the name from the card title when the chart has no label', () => {
    const api = setup('', card(true, true))
    expect(api.accessibleName.value).toBeUndefined()
    expect(api.labelledBy.value).toBe('title')
    expect(api.describedBy.value).toBe('description summary')
  })

  it('keeps its own label over the card title', () => {
    const api = setup('Requests', card(true, false))
    expect(api.accessibleName.value).toBe('Requests')
    expect(api.labelledBy.value).toBeUndefined()
    expect(api.describedBy.value).toBe('summary')
  })
})
