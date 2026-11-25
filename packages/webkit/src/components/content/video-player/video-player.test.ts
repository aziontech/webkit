import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { h, nextTick } from 'vue'

import Default from '../../../../examples/video-player/default.vue'
import Statuses from '../../../../examples/video-player/statuses.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import ConfigProvider from '../../provider/config-provider/config-provider.vue'
import { formatTime } from './lib/format-time'
import VideoPlayer from './video-player.vue'

const TEST_ID = 'video-player'

const plainNumber = (value: number, options?: Intl.NumberFormatOptions): string =>
  new Intl.NumberFormat('en-US', options).format(value)

const videoOf = (root: HTMLElement): HTMLVideoElement =>
  root.querySelector('video') as HTMLVideoElement

const metadataLoaded = async (root: HTMLElement): Promise<void> => {
  await waitFor(
    () => {
      const seek = root.querySelector<HTMLInputElement>(`[data-testid="${TEST_ID}__seek__input"]`)
      expect(seek?.disabled).toBe(false)
    },
    { timeout: 5000 }
  )
}

describe('VideoPlayer', () => {
  it('renders a named group with labelled controls and no autoplay', async () => {
    const view = render(Default)
    const root = view.getByTestId(TEST_ID)

    expect(view.getByRole('group', { name: 'Creating an application for Acme Store' })).toBe(root)
    expect(root.getAttribute('data-status')).toBe('success')
    expect(root.hasAttribute('data-paused')).toBe(true)

    const video = videoOf(root)
    expect(video.autoplay).toBe(false)
    expect(video.controls).toBe(false)
    expect(video.getAttribute('preload')).toBe('metadata')
    expect(video.getAttribute('poster')).toBeTruthy()
    expect(video.querySelector('track')?.getAttribute('kind')).toBe('captions')

    expect(view.getByRole('button', { name: 'Play' })).toBeTruthy()
    expect(view.getByRole('slider', { name: 'Seek' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Mute' }).getAttribute('aria-pressed')).toBe('false')
    expect(view.getByRole('slider', { name: 'Volume' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Captions (CC)' }).textContent).toContain('CC')
    await expectNoA11yViolations(view.container)
  })

  it('lets a consumer data-testid win', () => {
    const view = render(VideoPlayer, {
      props: { status: 'pending' },
      attrs: { 'data-testid': 'tour-video' }
    })
    expect(view.getByTestId('tour-video').getAttribute('data-status')).toBe('pending')
    expect(view.getByTestId('tour-video__generating')).toBeTruthy()
  })

  it('names the player Video when no aria-label is given', () => {
    const view = render(VideoPlayer, { props: { status: 'running' } })
    expect(view.getByRole('group', { name: 'Video' })).toBeTruthy()
  })

  it('plays and pauses from the Play button', async () => {
    const view = render(Default)
    const root = view.getByTestId(TEST_ID)
    await metadataLoaded(root)

    await userEvent.click(view.getByRole('button', { name: 'Play' }))
    await waitFor(() => expect(root.hasAttribute('data-paused')).toBe(false))
    expect(videoOf(root).paused).toBe(false)

    await userEvent.click(view.getByRole('button', { name: 'Pause' }))
    await waitFor(() => expect(root.hasAttribute('data-paused')).toBe(true))
    expect(videoOf(root).paused).toBe(true)
  })

  it('seeks from the seek bar and reads the time as text', async () => {
    const view = render(Default)
    const root = view.getByTestId(TEST_ID)
    await metadataLoaded(root)

    const seek = view.getByRole('slider', { name: 'Seek' }) as HTMLInputElement
    expect(seek.getAttribute('aria-valuetext')).toMatch(/^0:00 of \d+:\d{2}$/)

    seek.value = '1'
    await fireEvent.input(seek)
    await waitFor(() => expect(videoOf(root).currentTime).toBeCloseTo(1, 0))
    expect(seek.getAttribute('aria-valuetext')).toMatch(/^0:01 of /)
    expect(view.getByTestId(`${TEST_ID}__time`).textContent?.trim()).toMatch(/^0:01 \/ \d+:\d{2}$/)
    expect(view.getByTestId(`${TEST_ID}__time`).getAttribute('dir')).toBe('ltr')
  })

  it('mutes, and sets the volume from the volume bar', async () => {
    const view = render(Default)
    const root = view.getByTestId(TEST_ID)
    const mute = view.getByRole('button', { name: 'Mute' })

    await fireEvent.click(mute)
    await waitFor(() => expect(mute.getAttribute('aria-pressed')).toBe('true'))
    expect(root.hasAttribute('data-muted')).toBe(true)
    expect(videoOf(root).muted).toBe(true)

    const volume = view.getByRole('slider', { name: 'Volume' }) as HTMLInputElement
    volume.value = '40'
    await fireEvent.input(volume)
    await waitFor(() => expect(videoOf(root).volume).toBeCloseTo(0.4))
    expect(videoOf(root).muted).toBe(false)
    expect(volume.getAttribute('aria-valuetext')).toBe('40%')
  })

  it('turns the default caption track on and off', async () => {
    const view = render(Default)
    const root = view.getByTestId(TEST_ID)
    const captions = view.getByRole('button', { name: 'Captions (CC)' })
    expect(captions.getAttribute('aria-pressed')).toBe('true')

    await fireEvent.click(captions)
    expect(captions.getAttribute('aria-pressed')).toBe('false')
    expect(videoOf(root).textTracks[0]?.mode).toBe('disabled')

    await fireEvent.click(captions)
    expect(captions.getAttribute('aria-pressed')).toBe('true')
    expect(videoOf(root).textTracks[0]?.mode).toBe('showing')
  })

  it('hides the Captions button when there are no tracks', () => {
    const view = render(VideoPlayer, {
      props: { src: 'https://example.com/media/tour.mp4', mimeType: 'video/mp4' }
    })
    expect(view.queryByRole('button', { name: 'Captions (CC)' })).toBeNull()
  })

  it('offers full screen only where the browser does', async () => {
    const view = render(Default)
    await nextTick()
    const button = view.queryByTestId(`${TEST_ID}__fullscreen`)
    expect(button !== null).toBe(document.fullscreenEnabled)
    if (button) expect(button.getAttribute('aria-label')).toBe('Enter full screen')
  })

  it('shows the generating and error states with no controls', async () => {
    const view = render(Statuses)
    const [pending, running, failed] = view.getAllByTestId(TEST_ID) as [
      HTMLElement,
      HTMLElement,
      HTMLElement
    ]

    expect(pending.getAttribute('data-status')).toBe('pending')
    expect(pending.getAttribute('aria-busy')).toBe('true')
    const waiting = pending.querySelector(`[data-testid="${TEST_ID}__generating"]`) as HTMLElement
    expect(waiting.getAttribute('role')).toBe('status')
    expect(waiting.textContent).toContain('Waiting to generate')
    expect(pending.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBeNull()

    expect(running.getAttribute('data-status')).toBe('running')
    const bar = running.querySelector('[role="progressbar"]') as HTMLElement
    expect(bar.getAttribute('aria-label')).toBe('Generating video')
    expect(bar.getAttribute('aria-valuenow')).toBe('42')
    expect(running.textContent).toContain('42%')

    expect(failed.getAttribute('data-status')).toBe('error')
    expect(failed.hasAttribute('aria-busy')).toBe(false)
    expect(failed.textContent).toContain('The model stopped before the video was done')

    for (const root of [pending, running, failed]) {
      expect(root.querySelector('video')).toBeNull()
    }
    expect(pending.querySelector('button')).toBeNull()
    expect(running.querySelector('button')).toBeNull()
    expect(failed.querySelectorAll('button')).toHaveLength(1)
    await expectNoA11yViolations(view.container)

    await userEvent.click(failed.querySelector(`[data-testid="${TEST_ID}__retry"]`) as HTMLElement)
    await waitFor(() => expect(failed.getAttribute('data-status')).toBe('pending'))
  })

  it('emits retry from Try again, and shows it only with a retry listener', async () => {
    const bare = render(VideoPlayer, { props: { status: 'error' } })
    expect(bare.queryByRole('button')).toBeNull()
    bare.unmount()

    const calls: MouseEvent[] = []
    const view = render(VideoPlayer, {
      props: { status: 'error', onRetry: (event: MouseEvent) => calls.push(event) }
    })
    await userEvent.click(view.getByRole('button', { name: 'Try again' }))
    expect(calls).toHaveLength(1)
    expect(calls[0]).toBeInstanceOf(MouseEvent)
  })

  it('shows the error state when a ready video has no src', () => {
    const view = render(VideoPlayer, { props: { status: 'success' } })
    expect(view.getByTestId(TEST_ID).getAttribute('data-status')).toBe('error')
    expect(view.getByText('The video could not load')).toBeTruthy()
  })

  it('shows the error state when the file cannot load', async () => {
    const view = render(VideoPlayer, {
      props: { src: 'data:video/webm;base64,AAAAAAAA', mimeType: 'video/webm' }
    })
    await waitFor(
      () => expect(view.getByTestId(TEST_ID).getAttribute('data-status')).toBe('error'),
      { timeout: 5000 }
    )
    expect(view.getByText('The video could not load')).toBeTruthy()
  })

  it('reads its strings from the ConfigProvider locale', () => {
    const view = render(ConfigProvider, {
      props: { locale: 'pt-BR', catalogs: LOCALES },
      slots: {
        default: () => h(VideoPlayer, { status: 'running', progress: 50 })
      }
    })
    expect(view.getByRole('group', { name: 'Vídeo' })).toBeTruthy()
    expect(view.getByText('Gerando vídeo')).toBeTruthy()
  })

  it('keeps the time left to right and passes axe under rtl', async () => {
    const view = render(ConfigProvider, {
      props: { locale: 'en-US', dir: 'rtl', catalogs: LOCALES },
      slots: { default: () => h(Default) }
    })
    expect(view.getByTestId(`${TEST_ID}__time`).getAttribute('dir')).toBe('ltr')
    expect(view.getByTestId(`${TEST_ID}__seek`).closest('[dir]')).toHaveAttribute('dir', 'ltr')
    expect(view.getByTestId(`${TEST_ID}__volume`).closest('[dir]')).toHaveAttribute('dir', 'rtl')
    await expectNoA11yViolations(view.container)
  })

  describe('formatTime', () => {
    it('reads m:ss, and h:mm:ss from one hour', () => {
      expect(formatTime(0, plainNumber)).toBe('0:00')
      expect(formatTime(65.7, plainNumber)).toBe('1:05')
      expect(formatTime(3725, plainNumber)).toBe('1:02:05')
      expect(formatTime(Number.NaN, plainNumber)).toBe('0:00')
      expect(formatTime(-4, plainNumber)).toBe('0:00')
    })
  })
})
