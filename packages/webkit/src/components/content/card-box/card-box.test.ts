import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/content/card-box/CardBox.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import CardBox from './card-box.vue'

const { Default } = composeStories(stories)

const TESTID = 'content-card-box'

describe('CardBox', () => {
  it('renders the root section with the default data-testid', () => {
    const { getByTestId } = render(CardBox)
    const root = getByTestId(TESTID)
    expect(root.tagName).toBe('SECTION')
  })

  it('honours a consumer-supplied data-testid on the root and derived regions', () => {
    const { getByTestId } = render(CardBox, {
      attrs: { 'data-testid': 'my-card' },
      props: { title: 'Titled' }
    })
    expect(getByTestId('my-card').tagName).toBe('SECTION')
    // Derived testids follow the overridden root testid.
    expect(getByTestId('my-card__header')).toBeTruthy()
    expect(getByTestId('my-card__title')).toBeTruthy()
    expect(getByTestId('my-card__content')).toBeTruthy()
  })

  it('always renders the content region', () => {
    const { getByTestId } = render(CardBox)
    expect(getByTestId(`${TESTID}__content`)).toBeTruthy()
  })

  it('renders content slot markup inside the content region', () => {
    const { getByTestId, getByText } = render(CardBox, {
      slots: { content: '<p>Body copy</p>' }
    })
    const content = getByTestId(`${TESTID}__content`)
    expect(content.textContent).toContain('Body copy')
    expect(content.contains(getByText('Body copy'))).toBe(true)
  })

  describe('header region', () => {
    it('omits the header region entirely with no title and no header slots', () => {
      const { queryByTestId } = render(CardBox)
      expect(queryByTestId(`${TESTID}__header`)).toBeNull()
    })

    it('omits the header region when title is only whitespace', () => {
      const { queryByTestId } = render(CardBox, { props: { title: '   ' } })
      expect(queryByTestId(`${TESTID}__header`)).toBeNull()
    })

    it('renders the default header with an h2 title when title is set', () => {
      const { getByTestId } = render(CardBox, { props: { title: 'Overview' } })
      const header = getByTestId(`${TESTID}__header`)
      expect(header.tagName).toBe('HEADER')
      const title = getByTestId(`${TESTID}__title`)
      expect(title.tagName).toBe('H2')
      expect(title.textContent).toContain('Overview')
    })

    it('does not render the title node when title is empty', () => {
      const { queryByTestId } = render(CardBox, {
        slots: { 'header-action': '<button>Act</button>' }
      })
      // header region shows (header-action present) but no title element.
      expect(queryByTestId(`${TESTID}__header`)).toBeTruthy()
      expect(queryByTestId(`${TESTID}__title`)).toBeNull()
    })

    it('renders the header-action region in the default header when its slot is provided', () => {
      const { getByTestId, getByText } = render(CardBox, {
        props: { title: 'Overview' },
        slots: { 'header-action': '<button>Edit</button>' }
      })
      const action = getByTestId(`${TESTID}__header-action`)
      expect(action.contains(getByText('Edit'))).toBe(true)
    })

    it('omits the header-action region when its slot is absent', () => {
      const { queryByTestId } = render(CardBox, { props: { title: 'Overview' } })
      expect(queryByTestId(`${TESTID}__header-action`)).toBeNull()
    })

    it('uses the header slot verbatim and suppresses the default title layout', () => {
      const { getByTestId, getByText, queryByTestId } = render(CardBox, {
        props: { title: 'Ignored' },
        slots: { header: '<span>Custom header</span>' }
      })
      const header = getByTestId(`${TESTID}__header`)
      expect(header.contains(getByText('Custom header'))).toBe(true)
      // Default title layout is suppressed when the header slot is used.
      expect(queryByTestId(`${TESTID}__title`)).toBeNull()
      expect(header.textContent).not.toContain('Ignored')
    })
  })

  describe('footer region', () => {
    it('omits the footer region when the footer slot is absent', () => {
      const { queryByTestId } = render(CardBox)
      expect(queryByTestId(`${TESTID}__footer`)).toBeNull()
    })

    it('renders the footer region with slot content when the footer slot is provided', () => {
      const { getByTestId, getByText } = render(CardBox, {
        slots: { footer: '<button>Save</button>' }
      })
      const footer = getByTestId(`${TESTID}__footer`)
      expect(footer.tagName).toBe('FOOTER')
      expect(footer.contains(getByText('Save'))).toBe(true)
    })
  })

  describe('accessibility', () => {
    it('has no violations for the content-only card', async () => {
      const { container } = render(CardBox, {
        slots: { content: '<p>Body copy for the card region.</p>' }
      })
      await expectNoA11yViolations(container)
    })

    it('has no violations with the default header (title) and footer', async () => {
      const { container } = render(CardBox, {
        props: { title: 'Account settings' },
        slots: {
          'header-action': '<button type="button">Edit</button>',
          content: '<p>Body copy for the card region.</p>',
          footer: '<button type="button">Save</button>'
        }
      })
      await expectNoA11yViolations(container)
    })
  })

  it('renders the composed Default story fixture', () => {
    const { getByTestId, getByText } = render(Default)
    expect(getByTestId(TESTID)).toBeTruthy()
    // The story sets title "Card Title" and fills the content slot.
    expect(getByTestId(`${TESTID}__title`).textContent).toContain('Card Title')
    expect(getByText(/Card body content/)).toBeTruthy()
  })
})
