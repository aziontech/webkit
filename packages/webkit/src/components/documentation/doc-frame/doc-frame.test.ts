import { userEvent } from '@storybook/test'
import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/documentation/doc-frame/DocFrame.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import DocFrame from './doc-frame.vue'

// .claude/rules/testing.md: Vitest browser mode (real Chromium) loads NO Tailwind, so the
// frame's border, the badge fade and the FLIP travel emit nothing here — those belong to
// the visual gate. What is real without CSS is what decides the component's semantics:
// which element a source renders as (image vs player, decided by the extension), the
// zoom trigger being a real button, the Teleported dialog with its role and label, focus
// moving in and back out, and the testid family.
//
// The lightbox tests run under an emulated reduced-motion preference (a matchMedia
// override — a media preference, not layout/focus/Teleport, which all stay real). Two
// reasons: the close path unmounts on `transitionend`, which never fires in an unstyled
// DOM because the transition class emits no CSS; and the component deliberately skips
// the FLIP in JS for exactly this preference, so the path under test is a real user
// path, not a test-only shortcut.

const { Default, Media } = composeStories(stories)

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

const emulateReducedMotion = () => {
  const original = window.matchMedia
  const stub = (query: string) =>
    ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false
    }) as unknown as MediaQueryList
  window.matchMedia = stub as typeof window.matchMedia
  return () => {
    window.matchMedia = original
  }
}

const zoomDialog = () =>
  document.body.querySelector('[data-testid="documentation-doc-frame__zoom"]')

describe('DocFrame', () => {
  describe('rendering & testid', () => {
    it('renders with the derived testid and derives every part from it', () => {
      const { getByTestId } = render(DocFrame, {
        props: {
          src: '/docs/shot.png',
          alt: 'A capture',
          caption: 'The caption',
          hint: 'The hint:'
        }
      })
      expect(getByTestId('documentation-doc-frame')).toBeInTheDocument()
      expect(getByTestId('documentation-doc-frame__hint')).toBeInTheDocument()
      expect(getByTestId('documentation-doc-frame__caption')).toBeInTheDocument()
      expect(getByTestId('documentation-doc-frame__zoom-trigger')).toBeInTheDocument()
      expect(getByTestId('documentation-doc-frame__zoom-hint')).toBeInTheDocument()
    })

    it('lets a consumer-supplied data-testid win, renaming the whole family', () => {
      const { getByTestId, queryByTestId } = render(DocFrame, {
        attrs: { 'data-testid': 'first-deploy-shot' },
        props: { src: '/docs/shot.png', alt: 'A capture', caption: 'The caption' }
      })
      expect(getByTestId('first-deploy-shot')).toBeInTheDocument()
      expect(getByTestId('first-deploy-shot__caption')).toBeInTheDocument()
      expect(getByTestId('first-deploy-shot__zoom-trigger')).toBeInTheDocument()
      expect(queryByTestId('documentation-doc-frame')).not.toBeInTheDocument()
    })

    it('renders no hint or caption region when neither prop nor slot is given', () => {
      const { queryByTestId } = render(DocFrame, { props: { src: '/docs/shot.png', alt: 'A' } })
      expect(queryByTestId('documentation-doc-frame__hint')).not.toBeInTheDocument()
      expect(queryByTestId('documentation-doc-frame__caption')).not.toBeInTheDocument()
    })
  })

  describe('caption and hint: prop fallback, slot override', () => {
    it('renders the string props as plain text', () => {
      const { getByText } = render(DocFrame, {
        props: {
          src: '/docs/shot.png',
          alt: 'A',
          caption: 'Console, + Create',
          hint: 'Start here:'
        }
      })
      expect(getByText('Console, + Create')).toBeInTheDocument()
      expect(getByText('Start here:')).toBeInTheDocument()
    })

    it('lets the caption and hint slots override the props', () => {
      const { getByText, queryByText } = render(DocFrame, {
        props: { src: '/docs/shot.png', alt: 'A', caption: 'Plain caption', hint: 'Plain hint' },
        slots: { caption: 'Rich caption', hint: 'Rich hint' }
      })
      expect(getByText('Rich caption')).toBeInTheDocument()
      expect(getByText('Rich hint')).toBeInTheDocument()
      expect(queryByText('Plain caption')).not.toBeInTheDocument()
      expect(queryByText('Plain hint')).not.toBeInTheDocument()
    })
  })

  describe('the source decides the element', () => {
    it('renders a still as an image inside a real zoom trigger button', () => {
      const { getByTestId, getByAltText } = render(DocFrame, {
        props: { src: '/docs/shot.png', alt: 'Step 3 of Create application' }
      })
      const trigger = getByTestId('documentation-doc-frame__zoom-trigger')
      expect(trigger.tagName).toBe('BUTTON')
      expect(trigger.getAttribute('type')).toBe('button')
      expect(trigger.getAttribute('aria-label')).toBe(
        'View full screen: Step 3 of Create application'
      )
      expect(getByAltText('Step 3 of Create application')).toBeInTheDocument()
    })

    it('renders a clip source as a labelled player with controls, and no zoom trigger', () => {
      const { container, queryByTestId } = render(DocFrame, {
        props: { src: '/media/flow.webm', alt: 'The flow' }
      })
      const video = container.querySelector('video')
      expect(video).not.toBeNull()
      expect(video?.getAttribute('aria-label')).toBe('The flow')
      expect(video?.hasAttribute('controls')).toBe(true)
      expect(video?.hasAttribute('loop')).toBe(false)
      expect(queryByTestId('documentation-doc-frame__zoom-trigger')).not.toBeInTheDocument()
    })

    it('autoplay implies inline and looping and drops the controls', () => {
      const { container } = render(DocFrame, {
        props: { src: '/media/loop.webm', alt: 'The loop', autoplay: true }
      })
      const video = container.querySelector('video')
      expect(video?.hasAttribute('autoplay')).toBe(true)
      expect(video?.hasAttribute('loop')).toBe(true)
      expect(video?.hasAttribute('playsinline')).toBe(true)
      expect(video?.hasAttribute('controls')).toBe(false)
    })

    it('frames composed slot content with no zoom trigger and no player', () => {
      const { getByText, queryByTestId, container } = render(DocFrame, {
        slots: { default: '<p>Composed markup</p>' }
      })
      expect(getByText('Composed markup')).toBeInTheDocument()
      expect(queryByTestId('documentation-doc-frame__zoom-trigger')).not.toBeInTheDocument()
      expect(container.querySelector('video')).toBeNull()
    })
  })

  describe('the lightbox', () => {
    it('opens on activation as a Teleported dialog and moves focus in', async () => {
      const restore = emulateReducedMotion()
      try {
        const { getByTestId } = render(DocFrame, {
          props: { src: '/docs/shot.png', alt: 'A capture' }
        })
        await userEvent.click(getByTestId('documentation-doc-frame__zoom-trigger'))
        await flush()
        await flush()
        const dialog = zoomDialog()
        expect(dialog).not.toBeNull()
        expect(dialog?.getAttribute('role')).toBe('dialog')
        expect(dialog?.getAttribute('aria-modal')).toBe('true')
        expect(dialog?.getAttribute('data-state')).toBe('open')
        expect(dialog?.getAttribute('aria-label')).toBe('A capture')
        const closeButton = document.body.querySelector(
          '[data-testid="documentation-doc-frame__zoom-close"]'
        )
        expect(closeButton).not.toBeNull()
        expect(document.activeElement).toBe(closeButton)
      } finally {
        restore()
      }
    })

    it('closes on Escape and returns focus to the trigger', async () => {
      const restore = emulateReducedMotion()
      try {
        const { getByTestId } = render(DocFrame, {
          props: { src: '/docs/shot.png', alt: 'A capture' }
        })
        const trigger = getByTestId('documentation-doc-frame__zoom-trigger')
        await userEvent.click(trigger)
        await flush()
        await flush()
        expect(zoomDialog()).not.toBeNull()
        await userEvent.keyboard('{Escape}')
        await flush()
        await flush()
        expect(zoomDialog()).toBeNull()
        expect(document.activeElement).toBe(trigger)
      } finally {
        restore()
      }
    })

    it('closes on a backdrop click', async () => {
      const restore = emulateReducedMotion()
      try {
        const { getByTestId } = render(DocFrame, {
          props: { src: '/docs/shot.png', alt: 'A capture' }
        })
        await userEvent.click(getByTestId('documentation-doc-frame__zoom-trigger'))
        await flush()
        const backdrop = document.body.querySelector(
          '[data-testid="documentation-doc-frame__zoom-backdrop"]'
        )
        expect(backdrop).not.toBeNull()
        await fireEvent.click(backdrop as Element)
        await flush()
        expect(zoomDialog()).toBeNull()
      } finally {
        restore()
      }
    })

    it('closes from the close control', async () => {
      const restore = emulateReducedMotion()
      try {
        const { getByTestId } = render(DocFrame, {
          props: { src: '/docs/shot.png', alt: 'A capture' }
        })
        await userEvent.click(getByTestId('documentation-doc-frame__zoom-trigger'))
        await flush()
        const closeButton = document.body.querySelector(
          '[data-testid="documentation-doc-frame__zoom-close"]'
        )
        await fireEvent.click(closeButton as Element)
        await flush()
        expect(zoomDialog()).toBeNull()
      } finally {
        restore()
      }
    })
  })

  describe('accessibility', () => {
    it('has no violations on the default render', async () => {
      const { container } = render(Default())
      await expectNoA11yViolations(container)
    })

    it('has no violations across the media variants', async () => {
      const { container } = render(Media())
      await expectNoA11yViolations(container)
    })

    it('has no violations with the lightbox open', async () => {
      const restore = emulateReducedMotion()
      try {
        const { getByTestId } = render(DocFrame, {
          props: { src: '/docs/shot.png', alt: 'A capture' }
        })
        await userEvent.click(getByTestId('documentation-doc-frame__zoom-trigger'))
        await flush()
        await flush()
        const dialog = zoomDialog()
        expect(dialog).not.toBeNull()
        await expectNoA11yViolations(dialog as Element)
      } finally {
        restore()
      }
    })
  })
})
