import { render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/avatar/default.vue'
import Pattern from '../../../../examples/avatar/pattern.vue'
import Presence from '../../../../examples/avatar/presence.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Avatar from './avatar.vue'

const VARIANTS = ['circle', 'square'] as const
const SIZES = ['small', 'medium', 'large'] as const

const SAMPLE_SRC =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face'

describe('Avatar', () => {
  it('lets a consumer aria-label name the fallback', () => {
    const { getByTestId } = render(Avatar, {
      props: { label: 'IB' },
      attrs: { 'aria-label': 'Account menu' }
    })
    expect(getByTestId('avatar')).toHaveAttribute('aria-label', 'Account menu')
  })

  // --- image branch: src wins over label and icon -------------------------
  it('renders an <img> with the src when src is set, and no fallback label/icon', () => {
    const { getByTestId, queryByTestId } = render(Avatar, {
      props: { src: SAMPLE_SRC, alt: 'Portrait', label: 'AB' }
    })

    const img = getByTestId('avatar__image')
    expect(img.tagName).toBe('IMG')
    expect(img).toHaveAttribute('src', SAMPLE_SRC)
    expect(img).toHaveAttribute('alt', 'Portrait')

    // src takes precedence: label and icon branches are suppressed
    expect(queryByTestId('avatar__label')).toBeNull()
    expect(queryByTestId('avatar__icon')).toBeNull()
  })

  it('does not put role="img"/aria-label on the root when an image is present (the <img> alt carries it)', () => {
    const { getByTestId } = render(Avatar, {
      props: { src: SAMPLE_SRC, alt: 'Portrait' }
    })

    const root = getByTestId('avatar')
    expect(root).not.toHaveAttribute('role')
    expect(root).not.toHaveAttribute('aria-label')
  })

  it('falls back the image alt to normalized label when alt is empty', () => {
    const { getByTestId } = render(Avatar, {
      props: { src: SAMPLE_SRC, label: 'jd' }
    })

    // imageAlt = alt || normalizedLabel || 'Avatar' ; normalizedLabel('jd') = 'JD'
    expect(getByTestId('avatar__image')).toHaveAttribute('alt', 'JD')
  })

  it('falls back the image alt to "Avatar" when neither alt nor label are set', () => {
    const { getByTestId } = render(Avatar, { props: { src: SAMPLE_SRC } })

    expect(getByTestId('avatar__image')).toHaveAttribute('alt', 'Avatar')
  })

  // --- label branch: normalized to two uppercase chars --------------------
  it('renders the initials, normalized to two uppercase characters, when there is a label but no src', () => {
    const { getByTestId, queryByTestId } = render(Avatar, { props: { label: 'herbert' } })

    const labelEl = getByTestId('avatar__label')
    expect(labelEl).toHaveTextContent('HE')

    // no image, no icon
    expect(queryByTestId('avatar__image')).toBeNull()
    expect(queryByTestId('avatar__icon')).toBeNull()
  })

  it('draws the initials of a full name from its first and last word', () => {
    const { getByTestId } = render(Avatar, { props: { label: 'Jane Doe' } })

    expect(getByTestId('avatar__label')).toHaveTextContent('JD')
  })

  it('exposes role="img" and an aria-label equal to the initials on the root when showing a label', () => {
    const { getByTestId } = render(Avatar, { props: { label: 'AB' } })

    const root = getByTestId('avatar')
    expect(root).toHaveAttribute('role', 'img')
    // accessibleLabel = normalizedLabel when no image => 'AB'
    expect(root).toHaveAttribute('aria-label', 'AB')
  })

  it('names the initials and icon fallbacks with alt when it is given', () => {
    const initials = render(Avatar, { props: { label: 'JD', alt: 'Jane Doe' } })
    expect(initials.getByTestId('avatar')).toHaveAttribute('aria-label', 'Jane Doe')
    initials.unmount()
    const icon = render(Avatar, { props: { alt: 'Jane Doe' } })
    expect(icon.getByTestId('avatar')).toHaveAttribute('aria-label', 'Jane Doe')
  })

  it('treats a whitespace-only label as empty and falls through to the icon branch', () => {
    const { getByTestId, queryByTestId } = render(Avatar, { props: { label: '   ' } })

    expect(queryByTestId('avatar__label')).toBeNull()
    expect(getByTestId('avatar__icon')).toBeInTheDocument()
  })

  // --- icon branch: default fallback --------------------------------------
  it('renders the default icon fallback with aria-hidden when no src and no label', () => {
    const { getByTestId, queryByTestId } = render(Avatar, { props: {} })

    const icon = getByTestId('avatar__icon')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass('az', 'az-user')
    expect(icon).toHaveAttribute('aria-hidden', 'true')

    expect(queryByTestId('avatar__image')).toBeNull()
    expect(queryByTestId('avatar__label')).toBeNull()
  })

  it('applies a custom icon class on the icon fallback element', () => {
    const { getByTestId } = render(Avatar, { props: { icon: 'az az-star' } })

    expect(getByTestId('avatar__icon')).toHaveClass('az', 'az-star')
  })

  it('labels the icon-only root as "User avatar" via role="img" + aria-label', () => {
    const { getByTestId } = render(Avatar, { props: {} })

    const root = getByTestId('avatar')
    expect(root).toHaveAttribute('role', 'img')
    // accessibleLabel = 'User avatar' when no image and no label
    expect(root).toHaveAttribute('aria-label', 'User avatar')
  })

  // --- consumer-supplied testid derives the sub-testids -------------------
  it('honors a consumer data-testid on the root and derives the child testids from it', () => {
    const { getByTestId } = render(Avatar, {
      props: { label: 'AB' },
      attrs: { 'data-testid': 'my-avatar' }
    })

    expect(getByTestId('my-avatar')).toBeInTheDocument()
    expect(getByTestId('my-avatar__label')).toHaveTextContent('AB')
  })

  it.each(VARIANTS)('mirrors variant=%s on data-variant', (variant) => {
    const { getByTestId } = render(Avatar, { props: { label: 'AB', variant: variant } })
    expect(getByTestId('avatar')).toHaveAttribute('data-variant', variant)
  })

  it.each(SIZES)('mirrors size=%s on data-size', (size) => {
    const { getByTestId } = render(Avatar, { props: { label: 'AB', size } })
    expect(getByTestId('avatar')).toHaveAttribute('data-size', size)
  })

  it('names the rendered content on data-content', () => {
    expect(render(Avatar, { props: { label: 'AB' } }).getByTestId('avatar')).toHaveAttribute(
      'data-content',
      'label'
    )
  })

  it('forwards consumer attributes and listeners to the root', async () => {
    let clicks = 0
    const { getByTestId } = render(Avatar, {
      props: { label: 'AB' },
      attrs: { id: 'owner', title: 'Jane Doe', 'aria-describedby': 'hint', onClick: () => clicks++ }
    })
    const root = getByTestId('avatar')
    expect(root).toHaveAttribute('id', 'owner')
    expect(root).toHaveAttribute('title', 'Jane Doe')
    expect(root).toHaveAttribute('aria-describedby', 'hint')
    root.click()
    expect(clicks).toBe(1)
  })

  it('falls back to the initials when the image fails to load', async () => {
    const { getByTestId, findByTestId, queryByTestId } = render(Avatar, {
      props: { src: 'data:image/png;base64,broken', alt: 'Jane Doe', label: 'JD' }
    })
    expect(await findByTestId('avatar__label')).toHaveTextContent('JD')
    expect(queryByTestId('avatar__image')).toBeNull()
    const root = getByTestId('avatar')
    expect(root).toHaveAttribute('role', 'img')
    expect(root).toHaveAttribute('aria-label', 'Jane Doe')
    expect(root).toHaveAttribute('data-content', 'label')
  })

  it('tries the image again when src changes after a failure', async () => {
    const { findByTestId, rerender } = render(Avatar, {
      props: { src: 'data:image/png;base64,broken', label: 'JD' }
    })
    await findByTestId('avatar__label')
    const pixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    await rerender({ src: pixel, label: 'JD' })
    expect(await findByTestId('avatar__image')).toHaveAttribute('src', pixel)
  })

  // --- accessibility ------------------------------------------------------
  it('has no accessibility violations for the label (role=img) render', async () => {
    const { container } = render(Avatar, { props: { label: 'AB' } })
    await expectNoA11yViolations(container)
  })

  it('has no accessibility violations for the icon fallback render', async () => {
    const { container } = render(Avatar, { props: {} })
    await expectNoA11yViolations(container)
  })

  it('has no accessibility violations for the image render', async () => {
    const { container } = render(Avatar, {
      props: { src: SAMPLE_SRC, alt: 'Portrait of a user' }
    })
    await expectNoA11yViolations(container)
  })

  // --- composed story fixture ---------------------------------------------
  it('renders the composed Default story fixture (initials AB, circle, medium)', () => {
    const { getByTestId } = render(Default)

    const root = getByTestId('avatar')
    expect(root).toHaveAttribute('role', 'img')
    expect(root).toHaveAttribute('aria-label', 'AB')
    expect(getByTestId('avatar__label')).toHaveTextContent('AB')
  })

  it('draws the marble pattern in place of the initials and names it with the full label', async () => {
    const { findByTestId, getByTestId, queryByTestId } = render(Avatar, {
      props: { label: 'Acme Inc.', pattern: 'marble' }
    })

    const root = getByTestId('avatar')
    expect(root).toHaveAttribute('data-pattern', 'marble')
    expect(root).toHaveAttribute('role', 'img')
    expect(root).toHaveAttribute('aria-label', 'Acme Inc.')
    expect(await findByTestId('avatar__pattern')).toHaveAttribute('aria-hidden', 'true')
    expect(queryByTestId('avatar__label')).toBeNull()
    expect(queryByTestId('avatar__icon')).toBeNull()
  })

  it('lets src win over the pattern', () => {
    const { getByTestId, queryByTestId } = render(Avatar, {
      props: { src: SAMPLE_SRC, alt: 'Acme Inc.', label: 'Acme Inc.', pattern: 'marble' }
    })

    expect(getByTestId('avatar__image')).toBeTruthy()
    expect(queryByTestId('avatar__pattern')).toBeNull()
    expect(getByTestId('avatar')).not.toHaveAttribute('data-pattern')
  })

  it('paints the pattern only with the given colors and draws the same mark for the same name', async () => {
    const colors = ['var(--accent)', 'var(--info)', 'var(--success)']
    const fills = async (label: string) =>
      Array.from(
        (
          await within(
            render(Avatar, { props: { label, pattern: 'marble', colors } }).container as HTMLElement
          ).findByTestId('avatar__pattern')
        ).querySelectorAll<SVGElement>('rect, path')
      ).map((node) => [node.style.fill, node.getAttribute('transform')])

    const first = await fills('Acme Inc.')
    expect(first).toHaveLength(3)
    for (const [fill] of first) expect(colors).toContain(fill)
    expect(await fills('Acme Inc.')).toEqual(first)
    expect(await fills('Acme Labs')).not.toEqual(first)
  })

  it('points every blurred layer at its own filter', async () => {
    const { findByTestId } = render(Avatar, { props: { label: 'Acme Inc.', pattern: 'marble' } })
    const svg = await findByTestId('avatar__pattern')
    const id = svg.querySelector('filter')!.id

    expect(id).not.toBe('')
    for (const path of svg.querySelectorAll('path')) {
      expect(path.getAttribute('filter')).toBe(`url(#${id})`)
    }
  })

  it('has no accessibility violations for the pattern example', async () => {
    const { container, getAllByTestId } = render(Pattern)

    await waitFor(() => expect(getAllByTestId('avatar__pattern')).toHaveLength(6))
    await expectNoA11yViolations(container)
  })

  it('draws no presence dot by default', () => {
    const { getByTestId, queryByTestId } = render(Avatar, { props: { label: 'Jane Doe' } })

    expect(queryByTestId('avatar__presence')).toBeNull()
    expect(getByTestId('avatar')).not.toHaveAttribute('data-presence')
    expect(getByTestId('avatar')).toHaveAttribute('aria-label', 'JD')
  })

  it.each([
    ['online', 'Jane Doe, online'],
    ['away', 'Jane Doe, away'],
    ['busy', 'Jane Doe, busy'],
    ['offline', 'Jane Doe, offline']
  ] as const)('draws the %s dot and adds it to the accessible name', (presence, name) => {
    const { getByTestId } = render(Avatar, {
      props: { label: 'Jane Doe', alt: 'Jane Doe', presence }
    })

    const root = getByTestId('avatar')
    const dot = getByTestId('avatar__presence')
    expect(root).toHaveAttribute('data-presence', presence)
    expect(root).toHaveAttribute('aria-label', name)
    expect(dot).toHaveAttribute('data-presence', presence)
    expect(dot).toHaveAttribute('data-slot', 'presence')
    expect(dot).toHaveAttribute('aria-hidden', 'true')
  })

  it('gives every value but online a cut-out glyph, so colour is not the only signal', () => {
    for (const presence of ['away', 'busy', 'offline'] as const) {
      const { getByTestId, unmount } = render(Avatar, { props: { label: 'JD', presence } })
      const glyph = getByTestId('avatar__presence').firstElementChild
      expect(glyph).not.toBeNull()
      expect(glyph).toHaveAttribute('data-presence', presence)
      unmount()
    }
    const { getByTestId } = render(Avatar, { props: { label: 'JD', presence: 'online' } })
    expect(getByTestId('avatar__presence').firstElementChild).toBeNull()
  })

  it('adds the presence to the image alt and to the fallback name', () => {
    const image = render(Avatar, { props: { src: SAMPLE_SRC, alt: 'Jane Doe', presence: 'busy' } })
    expect(image.getByTestId('avatar__image')).toHaveAttribute('alt', 'Jane Doe, busy')
    image.unmount()

    const { getByTestId } = render(Avatar, { props: { presence: 'offline' } })
    expect(getByTestId('avatar')).toHaveAttribute('aria-label', 'User avatar, offline')
  })

  it('draws the dot at every size and shape, under a consumer test id', () => {
    for (const variant of VARIANTS) {
      for (const size of SIZES) {
        const { getByTestId, unmount } = render(Avatar, {
          props: { label: 'JD', variant, size, presence: 'away' },
          attrs: { 'data-testid': 'agent-avatar' }
        })
        expect(getByTestId('agent-avatar')).toHaveAttribute('data-size', size)
        expect(getByTestId('agent-avatar')).toHaveAttribute('data-variant', variant)
        expect(getByTestId('agent-avatar__presence')).toHaveAttribute('data-presence', 'away')
        unmount()
      }
    }
  })

  it('pins the dot to the logical inline-end side, so it follows right-to-left', () => {
    const { getByTestId } = render(Avatar, { props: { label: 'JD', presence: 'online' } })

    expect(getByTestId('avatar__presence').classList.contains('end-0')).toBe(true)
  })

  it('has no accessibility violations for the presence example', async () => {
    const { container, getAllByTestId } = render(Presence)

    expect(getAllByTestId('avatar__presence')).toHaveLength(10)
    expect(getAllByTestId('avatar')[1]).toHaveAttribute('aria-label', 'John Smith, away')
    await expectNoA11yViolations(container)
  })
})
