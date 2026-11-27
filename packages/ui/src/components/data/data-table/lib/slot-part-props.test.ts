import { describe, expect, it } from 'vitest'
import { defineComponent, Fragment, h, type Slot, type VNode, withCtx } from 'vue'

import { slotPartProps } from './slot-part-props'

const Part = defineComponent({ name: 'DataTablePagination', render: () => null })
const compiled = (render: () => VNode[]): Slot => withCtx(render) as Slot

describe('slotPartProps', () => {
  it('reads the camelized props of the named part from a compiled slot, through fragments', () => {
    const slot = compiled(() => [h(Fragment, [h(Part, { 'page-size': 5, manual: '' })])])
    expect(slotPartProps(slot, 'DataTablePagination')).toEqual({ pageSize: 5, manual: '' })
  })

  it('reads nothing from a missing part, a missing slot or a render-function slot', () => {
    expect(
      slotPartProps(
        compiled(() => [h('div')]),
        'DataTablePagination'
      )
    ).toBeUndefined()
    expect(slotPartProps(undefined, 'DataTablePagination')).toBeUndefined()
    const raw = Object.assign(() => [h(Part, { page: 2 })], { _c: false })
    expect(slotPartProps(raw, 'DataTablePagination')).toBeUndefined()
  })
})
