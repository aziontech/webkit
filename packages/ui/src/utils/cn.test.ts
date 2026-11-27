import { typography } from '@aziontech/theme/typography'
import { describe, expect, it } from 'vitest'

import { cn } from './cn'

const sizeRoles = Object.keys(typography).filter((name) => name !== 'text-link')

describe('cn', () => {
  it.each(sizeRoles)('keeps %s next to a text colour', (role) => {
    expect(cn(role, 'text-(--text-default)').split(' ')).toEqual([role, 'text-(--text-default)'])
  })

  it('lets a later type role replace an earlier one', () => {
    expect(cn('text-title-lg text-(--text-default)', 'text-heading-md')).toBe(
      'text-(--text-default) text-heading-md'
    )
  })
})
