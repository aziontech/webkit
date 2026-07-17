import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../apps/storybook/src/stories/components/content/overline/Overline.stories'
import { expectNoA11yViolations } from '../../test/axe'
import Overline from './overline.vue'

const { Default, Prefixes, Cursor } = composeStories(stories)

describe('Overline', () => {
  it('renders the default slot content', () => {
    const { getByText } = render(Overline, { slots: { default: 'SECTION LABEL' } })
    expect(getByText('SECTION LABEL')).toBeInTheDocument()
  })

  it('does not render a prefix span when prefix is the empty default', () => {
    const { container, queryByText } = render(Overline, { slots: { default: 'NO PREFIX' } })
    // Two spans max: the (absent) prefix and the (present) content span.
    // With the default empty prefix, only the content span is rendered.
    const spans = container.querySelectorAll('span')
    expect(spans).toHaveLength(1)
    expect(queryByText('//')).not.toBeInTheDocument()
  })

  it('renders the prefix text when a prefix is provided', () => {
    const { getByText } = render(Overline, {
      props: { prefix: '//' },
      slots: { default: 'COMMENT STYLE' }
    })
    expect(getByText('//')).toBeInTheDocument()
    expect(getByText('COMMENT STYLE')).toBeInTheDocument()
  })

  it('renders angle-bracket and closing-tag prefixes verbatim', () => {
    const angle = render(Overline, { props: { prefix: '<>' }, slots: { default: 'CODE' } })
    expect(angle.getByText('<>')).toBeInTheDocument()

    const closing = render(Overline, { props: { prefix: '</>' }, slots: { default: 'TAG' } })
    expect(closing.getByText('</>')).toBeInTheDocument()
  })

  it('does not render the cursor span by default (showCursor=false)', () => {
    const { container } = render(Overline, { slots: { default: 'NO CURSOR' } })
    // The cursor is the only span carrying the blink animation utility.
    expect(container.querySelector('.animate-blink')).toBeNull()
  })

  it('renders the cursor span when showCursor is true', () => {
    const { container } = render(Overline, {
      props: { showCursor: true },
      slots: { default: 'WITH CURSOR' }
    })
    expect(container.querySelector('.animate-blink')).not.toBeNull()
  })

  it('renders prefix and cursor together', () => {
    const { getByText, container } = render(Overline, {
      props: { prefix: '//', showCursor: true },
      slots: { default: 'TERMINAL OUTPUT' }
    })
    expect(getByText('//')).toBeInTheDocument()
    expect(getByText('TERMINAL OUTPUT')).toBeInTheDocument()
    expect(container.querySelector('.animate-blink')).not.toBeNull()
  })

  it.each([
    ['', 'PLAIN'],
    ['//', 'DOUBLE SLASH'],
    ['<>', 'ANGLE'],
    ['</>', 'CLOSING']
  ])('renders the slot content for prefix %j', (prefix, label) => {
    const { getByText } = render(Overline, {
      props: { prefix },
      slots: { default: label }
    })
    expect(getByText(label)).toBeInTheDocument()
  })

  it('has no accessibility violations in its default form', async () => {
    const { container } = render(Overline, { slots: { default: 'ACCESSIBLE LABEL' } })
    await expectNoA11yViolations(container)
  })

  it('has no accessibility violations with a prefix and cursor', async () => {
    const { container } = render(Overline, {
      props: { prefix: '</>', showCursor: true },
      slots: { default: 'ACCESSIBLE TERMINAL' }
    })
    await expectNoA11yViolations(container)
  })

  it('composes and renders the Default story', () => {
    const { getByText } = render(Default())
    expect(getByText('OVERLINE TEXT')).toBeInTheDocument()
  })

  it('composes the Cursor story: blinking cursor with and without a prefix', () => {
    const { getByText, container } = render(Cursor())

    // First instance: prefix + text; second: text only, still with its cursor.
    expect(getByText('OVERLINE TEXT')).toBeInTheDocument()
    expect(getByText('//')).toBeInTheDocument()
    expect(getByText('NO PREFIX')).toBeInTheDocument()
    expect(container.querySelectorAll('.animate-blink')).toHaveLength(2)
  })

  it('composes the Prefixes story with all three preset prefixes rendered', () => {
    const { getByText } = render(Prefixes())

    expect(getByText('//')).toBeInTheDocument()
    expect(getByText('COMMENT STYLE')).toBeInTheDocument()
    expect(getByText('<>')).toBeInTheDocument()
    expect(getByText('CODE LABEL')).toBeInTheDocument()
    expect(getByText('</>')).toBeInTheDocument()
    expect(getByText('CLOSING TAG')).toBeInTheDocument()
  })
})
