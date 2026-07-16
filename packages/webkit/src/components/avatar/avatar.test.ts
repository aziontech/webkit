import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../apps/storybook/src/stories/components/content/avatar/Avatar.stories'
import { expectNoA11yViolations } from '../../test/axe'
import Avatar from './avatar.vue'

const { Default } = composeStories(stories)

const KINDS = ['circle', 'square'] as const
const SIZES = ['small', 'medium', 'large'] as const

const SAMPLE_SRC =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face'

describe('Avatar', () => {
  // --- image branch: src wins over label and icon -------------------------
  it('renders an <img> with the src when src is set, and no fallback label/icon', () => {
    const { getByTestId, queryByTestId } = render(Avatar, {
      props: { src: SAMPLE_SRC, alt: 'Portrait', label: 'AB' }
    })

    const img = getByTestId('content-avatar__image')
    expect(img.tagName).toBe('IMG')
    expect(img).toHaveAttribute('src', SAMPLE_SRC)
    expect(img).toHaveAttribute('alt', 'Portrait')

    // src takes precedence: label and icon branches are suppressed
    expect(queryByTestId('content-avatar__label')).toBeNull()
    expect(queryByTestId('content-avatar__icon')).toBeNull()
  })

  it('does not put role="img"/aria-label on the root when an image is present (the <img> alt carries it)', () => {
    const { getByTestId } = render(Avatar, {
      props: { src: SAMPLE_SRC, alt: 'Portrait' }
    })

    const root = getByTestId('content-avatar')
    expect(root).not.toHaveAttribute('role')
    expect(root).not.toHaveAttribute('aria-label')
  })

  it('falls back the image alt to normalized label when alt is empty', () => {
    const { getByTestId } = render(Avatar, {
      props: { src: SAMPLE_SRC, label: 'jd' }
    })

    // imageAlt = alt || normalizedLabel || 'Avatar' ; normalizedLabel('jd') = 'JD'
    expect(getByTestId('content-avatar__image')).toHaveAttribute('alt', 'JD')
  })

  it('falls back the image alt to "Avatar" when neither alt nor label are set', () => {
    const { getByTestId } = render(Avatar, { props: { src: SAMPLE_SRC } })

    expect(getByTestId('content-avatar__image')).toHaveAttribute('alt', 'Avatar')
  })

  // --- label branch: normalized to two uppercase chars --------------------
  it('renders the initials, normalized to two uppercase characters, when there is a label but no src', () => {
    const { getByTestId, queryByTestId } = render(Avatar, { props: { label: 'herbert' } })

    const labelEl = getByTestId('content-avatar__label')
    // slice(0,2).toUpperCase() => 'HE'
    expect(labelEl).toHaveTextContent('HE')

    // no image, no icon
    expect(queryByTestId('content-avatar__image')).toBeNull()
    expect(queryByTestId('content-avatar__icon')).toBeNull()
  })

  it('exposes role="img" and an aria-label equal to the initials on the root when showing a label', () => {
    const { getByTestId } = render(Avatar, { props: { label: 'AB' } })

    const root = getByTestId('content-avatar')
    expect(root).toHaveAttribute('role', 'img')
    // accessibleLabel = normalizedLabel when no image => 'AB'
    expect(root).toHaveAttribute('aria-label', 'AB')
  })

  it('treats a whitespace-only label as empty and falls through to the icon branch', () => {
    const { getByTestId, queryByTestId } = render(Avatar, { props: { label: '   ' } })

    expect(queryByTestId('content-avatar__label')).toBeNull()
    expect(getByTestId('content-avatar__icon')).toBeInTheDocument()
  })

  // --- icon branch: default fallback --------------------------------------
  it('renders the default icon fallback with aria-hidden when no src and no label', () => {
    const { getByTestId, queryByTestId } = render(Avatar, { props: {} })

    const icon = getByTestId('content-avatar__icon')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass('pi', 'pi-user')
    expect(icon).toHaveAttribute('aria-hidden', 'true')

    expect(queryByTestId('content-avatar__image')).toBeNull()
    expect(queryByTestId('content-avatar__label')).toBeNull()
  })

  it('applies a custom icon class on the icon fallback element', () => {
    const { getByTestId } = render(Avatar, { props: { icon: 'pi pi-star' } })

    expect(getByTestId('content-avatar__icon')).toHaveClass('pi', 'pi-star')
  })

  it('labels the icon-only root as "User avatar" via role="img" + aria-label', () => {
    const { getByTestId } = render(Avatar, { props: {} })

    const root = getByTestId('content-avatar')
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

  // --- enum smoke floor (component has no data-kind/data-size attrs) -------
  it.each(KINDS)('renders for kind=%s', (kind) => {
    const { getByTestId } = render(Avatar, { props: { label: 'AB', kind } })
    expect(getByTestId('content-avatar')).toBeInTheDocument()
  })

  it.each(SIZES)('renders for size=%s', (size) => {
    const { getByTestId } = render(Avatar, { props: { label: 'AB', size } })
    expect(getByTestId('content-avatar')).toBeInTheDocument()
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

    const root = getByTestId('content-avatar')
    expect(root).toHaveAttribute('role', 'img')
    expect(root).toHaveAttribute('aria-label', 'AB')
    expect(getByTestId('content-avatar__label')).toHaveTextContent('AB')
  })
})
