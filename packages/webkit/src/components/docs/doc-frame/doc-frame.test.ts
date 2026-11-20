import placeholderClip from '@aziontech/webkit/assets/placeholder-clip.webm'
import userEvent from '@testing-library/user-event'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Autoplay from '../../../../examples/doc-frame/autoplay.vue'
import Default from '../../../../examples/doc-frame/default.vue'
import Media from '../../../../examples/doc-frame/media.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import DocFrame from './doc-frame.vue'

// Browser mode loads no Tailwind — border/fade/FLIP belong to the visual gate; asserted
// here: element choice per source, dialog semantics, focus, and the testid family.
// Lightbox tests emulate reduced motion (matchMedia override only): the close path
// unmounts on `transitionend`, which never fires in an unstyled DOM, and the component
// skips the FLIP under this preference — so the tested path is a real user path.

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

const zoomDialog = () => document.body.querySelector('[data-testid="doc-frame__zoom"]')

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
      expect(getByTestId('doc-frame')).toBeInTheDocument()
      expect(getByTestId('doc-frame__hint')).toBeInTheDocument()
      expect(getByTestId('doc-frame__caption')).toBeInTheDocument()
      expect(getByTestId('doc-frame__zoom-trigger')).toBeInTheDocument()
      expect(getByTestId('doc-frame__zoom-hint')).toBeInTheDocument()
    })

    it('lets a consumer-supplied data-testid win, renaming the whole family', () => {
      const { getByTestId, queryByTestId } = render(DocFrame, {
        attrs: { 'data-testid': 'first-deploy-shot' },
        props: { src: '/docs/shot.png', alt: 'A capture', caption: 'The caption' }
      })
      expect(getByTestId('first-deploy-shot')).toBeInTheDocument()
      expect(getByTestId('first-deploy-shot__caption')).toBeInTheDocument()
      expect(getByTestId('first-deploy-shot__zoom-trigger')).toBeInTheDocument()
      expect(queryByTestId('doc-frame')).not.toBeInTheDocument()
    })

    it('renders no hint or caption region when neither prop nor slot is given', () => {
      const { queryByTestId } = render(DocFrame, { props: { src: '/docs/shot.png', alt: 'A' } })
      expect(queryByTestId('doc-frame__hint')).not.toBeInTheDocument()
      expect(queryByTestId('doc-frame__caption')).not.toBeInTheDocument()
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
      const trigger = getByTestId('doc-frame__zoom-trigger')
      expect(trigger.tagName).toBe('BUTTON')
      expect(trigger.getAttribute('type')).toBe('button')
      expect(trigger.getAttribute('aria-label')).toBe(
        'View full screen: Step 3 of Create application'
      )
      expect(getByAltText('Step 3 of Create application')).toBeInTheDocument()
    })

    it('renders a clip source as a labelled player with controls, and no zoom trigger', () => {
      const { container, queryByTestId } = render(DocFrame, {
        props: { src: '/media/flow-diagram.webm', alt: 'The flow' }
      })
      const video = container.querySelector('video')
      expect(video).not.toBeNull()
      expect(video?.getAttribute('aria-label')).toBe('The flow')
      expect(video?.hasAttribute('controls')).toBe(true)
      expect(video?.hasAttribute('loop')).toBe(false)
      expect(queryByTestId('doc-frame__zoom-trigger')).not.toBeInTheDocument()
    })

    it('autoplay implies muted, inline and looping and drops the controls', () => {
      const { container } = render(DocFrame, {
        props: { src: '/media/loop.webm', alt: 'The loop', autoplay: true }
      })
      const video = container.querySelector('video')
      expect(video?.hasAttribute('data-autoplay')).toBe(true)
      expect(video?.muted).toBe(true)
      expect(video?.hasAttribute('loop')).toBe(true)
      expect(video?.hasAttribute('playsinline')).toBe(true)
      expect(video?.hasAttribute('controls')).toBe(false)
    })

    it('frames composed slot content with no zoom trigger and no player', () => {
      const { getByText, queryByTestId, container } = render(DocFrame, {
        slots: { default: '<p>Composed markup</p>' }
      })
      expect(getByText('Composed markup')).toBeInTheDocument()
      expect(queryByTestId('doc-frame__zoom-trigger')).not.toBeInTheDocument()
      expect(container.querySelector('video')).toBeNull()
    })
  })

  describe('autoplay: pausable, and still under reduced motion', () => {
    const clips = (container: Element) => Array.from(container.querySelectorAll('video'))
    const pauseControls = () =>
      Array.from(
        document.body.querySelectorAll<HTMLButtonElement>('[data-testid="doc-frame__pause"]')
      )

    it('plays both authoring paths on mount and shows a named pause control on each', async () => {
      const { container } = render(Autoplay)
      await flush()
      const videos = clips(container)
      expect(videos).toHaveLength(2)
      for (const video of videos) {
        expect(video.paused).toBe(false)
        expect(video.hasAttribute('controls')).toBe(false)
        expect(video.hasAttribute('autoplay')).toBe(false)
      }
      const controls = pauseControls()
      expect(controls).toHaveLength(2)
      for (const control of controls) expect(control.tagName).toBe('BUTTON')
      expect(controls.map((control) => control.getAttribute('aria-label'))).toEqual([
        'Pause animation: Landing on step 3 of Create application',
        'Pause animation: Opening the Rules engine tab'
      ])
    })

    it('falls back to the bare label when the clip has no text', async () => {
      render(DocFrame, { props: { src: placeholderClip, autoplay: true } })
      await flush()
      expect(pauseControls()[0]?.getAttribute('aria-label')).toBe('Pause animation')
    })

    it('names a hand-written clip by its title when it has no aria-label', async () => {
      render(DocFrame, {
        slots: { default: `<video autoplay src="${placeholderClip}" title="The loop"></video>` }
      })
      await flush()
      expect(pauseControls()[0]?.getAttribute('aria-label')).toBe('Pause animation: The loop')
    })

    it('pauses and plays again from the keyboard, switching the label', async () => {
      const { container } = render(DocFrame, {
        props: { src: placeholderClip, alt: 'The loop', autoplay: true }
      })
      await flush()
      const video = container.querySelector('video') as HTMLVideoElement
      const control = pauseControls()[0] as HTMLButtonElement
      control.focus()
      expect(document.activeElement).toBe(control)
      await userEvent.keyboard('{Enter}')
      await flush()
      expect(video.paused).toBe(true)
      expect(control.getAttribute('aria-label')).toBe('Play animation: The loop')
      await userEvent.keyboard(' ')
      await flush()
      expect(video.paused).toBe(false)
      expect(control.getAttribute('aria-label')).toBe('Pause animation: The loop')
    })

    it('does not play under reduced motion and offers the play control', async () => {
      const restore = emulateReducedMotion()
      try {
        const { container } = render(Autoplay)
        await flush()
        for (const video of clips(container)) expect(video.paused).toBe(true)
        const controls = pauseControls()
        expect(controls).toHaveLength(2)
        expect(controls[0]?.getAttribute('aria-label')).toBe(
          'Play animation: Landing on step 3 of Create application'
        )
        await userEvent.click(controls[0] as HTMLButtonElement)
        await flush()
        expect(clips(container)[0]?.paused).toBe(false)
      } finally {
        restore()
      }
    })

    it('shows no pause control on a clip the reader plays with its own controls', () => {
      render(DocFrame, { props: { src: '/media/flow-diagram.webm', alt: 'The flow' } })
      expect(pauseControls()).toHaveLength(0)
    })

    it('has no violations with the pause control shown', async () => {
      const { container } = render(Autoplay)
      await flush()
      await expectNoA11yViolations(container)
    })
  })

  describe('the lightbox', () => {
    it('opens on activation as a Teleported dialog and moves focus in', async () => {
      const restore = emulateReducedMotion()
      try {
        const { getByTestId } = render(DocFrame, {
          props: { src: '/docs/shot.png', alt: 'A capture' }
        })
        await userEvent.click(getByTestId('doc-frame__zoom-trigger'))
        await flush()
        await flush()
        const dialog = zoomDialog()
        expect(dialog).not.toBeNull()
        expect(dialog?.getAttribute('role')).toBe('dialog')
        expect(dialog?.getAttribute('aria-modal')).toBe('true')
        expect(dialog?.getAttribute('data-state')).toBe('open')
        expect(dialog?.getAttribute('aria-label')).toBe('A capture')
        const closeButton = document.body.querySelector('[data-testid="doc-frame__zoom-close"]')
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
        const trigger = getByTestId('doc-frame__zoom-trigger')
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
        await userEvent.click(getByTestId('doc-frame__zoom-trigger'))
        await flush()
        const backdrop = document.body.querySelector('[data-testid="doc-frame__zoom-backdrop"]')
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
        await userEvent.click(getByTestId('doc-frame__zoom-trigger'))
        await flush()
        const closeButton = document.body.querySelector('[data-testid="doc-frame__zoom-close"]')
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
      const { container } = render(Default)
      await expectNoA11yViolations(container)
    })

    it('has no violations across the media variants', async () => {
      const { container } = render(Media)
      await expectNoA11yViolations(container)
    })

    it('has no violations with the lightbox open', async () => {
      const restore = emulateReducedMotion()
      try {
        const { getByTestId } = render(DocFrame, {
          props: { src: '/docs/shot.png', alt: 'A capture' }
        })
        await userEvent.click(getByTestId('doc-frame__zoom-trigger'))
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
