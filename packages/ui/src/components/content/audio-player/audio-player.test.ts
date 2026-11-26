import placeholderClip from '@aziontech/webkit/assets/placeholder-clip.webm'
import userEvent from '@testing-library/user-event'
import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent as browserUser } from 'vitest/browser'
import { h } from 'vue'

import Default from '../../../../examples/audio-player/default.vue'
import Disabled from '../../../../examples/audio-player/disabled.vue'
import ErrorExample from '../../../../examples/audio-player/error.vue'
import Loading from '../../../../examples/audio-player/loading.vue'
import PlaybackRates from '../../../../examples/audio-player/playback-rates.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import ConfigProvider from '../../provider/config-provider/config-provider.vue'
import AudioPlayer from './audio-player.vue'

const TEST_ID = 'audio-player'

const seekInput = (view: ReturnType<typeof render>) =>
  view.getByTestId(`${TEST_ID}__seek__input`) as HTMLInputElement

const audioOf = (view: ReturnType<typeof render>) =>
  view.getByTestId(TEST_ID).querySelector('audio') as HTMLAudioElement

describe('AudioPlayer', () => {
  it('renders a group named by its title, with the test id fallback', async () => {
    const view = render(Default)
    const root = view.getByTestId(TEST_ID)

    expect(view.getByRole('group', { name: 'Deployment summary' })).toBe(root)
    expect(view.getByRole('button', { name: 'Play' })).toBeTruthy()
    expect(view.getByRole('slider', { name: 'Seek' })).toBeTruthy()
    expect(view.getByRole('slider', { name: 'Volume' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Mute' })).toBeTruthy()
    await expectNoA11yViolations(view.container)
  })

  it('lets a consumer data-testid win and falls back to the catalog name', () => {
    const view = render(AudioPlayer, {
      props: { src: placeholderClip },
      attrs: { 'data-testid': 'reply-audio' }
    })
    const root = view.getByTestId('reply-audio')
    expect(root.getAttribute('aria-label')).toBe('Audio player')
    expect(view.getByTestId('reply-audio__play')).toBeTruthy()
  })

  it('uses ariaLabel when there is no title', () => {
    const view = render(AudioPlayer, {
      props: { src: placeholderClip },
      attrs: { 'aria-label': 'Spoken answer' }
    })
    expect(view.getByRole('group', { name: 'Spoken answer' })).toBeTruthy()
  })

  it('reads the duration from the file and gives the seek bar a spoken value', async () => {
    const view = render(Default)
    await waitFor(() => expect(seekInput(view).disabled).toBe(false))
    expect(view.getByTestId(`${TEST_ID}__duration`).textContent).toMatch(/^\d+:\d{2}$/)
    expect(view.getByTestId(`${TEST_ID}__time`).textContent).toBe('0:00')
    expect(seekInput(view).getAttribute('aria-valuetext')).toMatch(/^0 seconds of .*second/)
  })

  it('shows the duration prop until the file is read', () => {
    const view = render(AudioPlayer, {
      props: { src: 'data:audio/wav;base64,', duration: 3725, loading: true }
    })
    expect(view.getByTestId(`${TEST_ID}__duration`).textContent).toBe('1:02:05')
  })

  it('plays and pauses, emitting play and pause with the media event', async () => {
    const view = render(AudioPlayer, { props: { src: placeholderClip, title: 'Clip' } })
    audioOf(view).muted = true
    await waitFor(() => expect(seekInput(view).disabled).toBe(false))

    await browserUser.click(view.getByRole('button', { name: 'Play' }))
    await waitFor(() => expect(view.emitted('play')).toHaveLength(1))
    expect((view.emitted('play') as [Event][])[0][0].type).toBe('play')
    expect(view.getByTestId(TEST_ID).hasAttribute('data-playing')).toBe(true)

    await browserUser.click(view.getByRole('button', { name: 'Pause' }))
    await waitFor(() => expect(view.emitted('pause')).toHaveLength(1))
    expect((view.emitted('pause') as [Event][])[0][0].type).toBe('pause')
    expect(view.getByTestId(TEST_ID).hasAttribute('data-playing')).toBe(false)
    expect(view.getByRole('button', { name: 'Play' })).toBeTruthy()
  })

  it('seeks the audio element from the seek bar', async () => {
    const view = render(Default)
    await waitFor(() => expect(seekInput(view).disabled).toBe(false))
    const input = seekInput(view)
    input.focus()
    await browserUser.keyboard('{ArrowRight}')
    await waitFor(() => expect(audioOf(view).currentTime).toBeGreaterThan(0))
  })

  it('mutes and unmutes', async () => {
    const user = userEvent.setup()
    const view = render(Default)
    await waitFor(() => expect(seekInput(view).disabled).toBe(false))

    await user.click(view.getByRole('button', { name: 'Mute' }))
    expect(audioOf(view).muted).toBe(true)
    expect(view.getByTestId(TEST_ID).hasAttribute('data-muted')).toBe(true)
    expect(view.getByRole('slider', { name: 'Volume' }).getAttribute('aria-valuetext')).toBe('0%')

    await user.click(view.getByRole('button', { name: 'Unmute' }))
    expect(audioOf(view).muted).toBe(false)
    expect(view.getByRole('slider', { name: 'Volume' }).getAttribute('aria-valuetext')).toBe('100%')
  })

  it('cycles the playback speed and offers a named download link', async () => {
    const user = userEvent.setup()
    const view = render(PlaybackRates)
    const speed = view.getByRole('button', { name: 'Playback speed 1×' })
    expect(speed.textContent?.trim()).toBe('1×')

    await user.click(speed)
    expect(view.getByRole('button', { name: 'Playback speed 1.5×' })).toBeTruthy()
    expect(audioOf(view).playbackRate).toBe(1.5)
    await user.click(view.getByRole('button', { name: 'Playback speed 1.5×' }))
    await user.click(view.getByRole('button', { name: 'Playback speed 2×' }))
    expect(view.getByRole('button', { name: 'Playback speed 0.75×' })).toBeTruthy()

    const download = view.getByRole('link', { name: 'Download Weekly traffic report' })
    expect(download.getAttribute('download')).toBe('weekly-traffic-report.webm')
    expect(download.getAttribute('href')).toBe(placeholderClip)
    await expectNoA11yViolations(view.container)
  })

  it('starts the speed at the first rate when 1 is not listed', () => {
    const view = render(AudioPlayer, {
      props: { src: placeholderClip, playbackRates: [1.25, 2] }
    })
    expect(view.getByRole('button', { name: 'Playback speed 1.25×' })).toBeTruthy()
  })

  it('holds its place while loading: Play spins and the controls wait', async () => {
    const view = render(Loading)
    const root = view.getByTestId(TEST_ID)
    expect(root.hasAttribute('data-loading')).toBe(true)
    expect(root.getAttribute('aria-busy')).toBe('true')
    expect(view.getByTestId(`${TEST_ID}__play__loading`)).toBeTruthy()
    expect(view.getByRole('status').textContent?.trim()).toBe('Loading audio')
    expect((view.getByRole('button', { name: 'Mute' }) as HTMLButtonElement).disabled).toBe(true)
    expect(seekInput(view).disabled).toBe(true)
    expect(view.getByTestId(`${TEST_ID}__duration`).textContent).toBe('--:--')
    await expectNoA11yViolations(view.container)
  })

  it('shows the app error and disables the controls', async () => {
    const view = render(ErrorExample)
    const root = view.getByTestId(TEST_ID)
    expect(root.hasAttribute('data-error')).toBe(true)
    expect(view.getByRole('alert').textContent).toContain('The speech service did not answer')
    expect(view.getByRole('button', { name: 'Play' }).hasAttribute('disabled')).toBe(true)
    expect(view.queryByTestId(`${TEST_ID}__seek`)).toBeNull()
    await expectNoA11yViolations(view.container)

    await browserUser.click(view.getByRole('button', { name: 'Try again' }))
    await waitFor(() => expect(root.hasAttribute('data-error')).toBe(false))
    expect(root.hasAttribute('data-loading')).toBe(true)
  })

  it('emits retry from Try again, and shows it only with a retry listener', async () => {
    const bare = render(AudioPlayer, {
      props: { src: 'https://example.com/a.mp3', error: 'No audio.' }
    })
    expect(bare.queryByRole('button', { name: 'Try again' })).toBeNull()
    bare.unmount()

    const calls: MouseEvent[] = []
    const view = render(AudioPlayer, {
      props: {
        src: 'https://example.com/a.mp3',
        error: 'No audio.',
        onRetry: (event: MouseEvent) => calls.push(event)
      }
    })
    await browserUser.click(view.getByTestId(`${TEST_ID}__retry`))
    expect(calls).toHaveLength(1)
    expect(calls[0]).toBeInstanceOf(MouseEvent)
  })

  it('falls back to the catalog error when the audio element fails', async () => {
    const view = render(AudioPlayer, { props: { src: 'data:audio/wav;base64,AAAA' } })
    await waitFor(() =>
      expect(view.getByRole('alert').textContent).toContain('The audio could not play.')
    )
    expect(view.getByTestId(TEST_ID).hasAttribute('data-error')).toBe(true)
  })

  it('disables every control when disabled or when there is no source', () => {
    const disabled = render(Disabled)
    const root = disabled.getByTestId(TEST_ID)
    expect(root.hasAttribute('data-disabled')).toBe(true)
    expect(disabled.getByRole('button', { name: 'Play' }).hasAttribute('disabled')).toBe(true)
    expect((disabled.getByRole('button', { name: 'Mute' }) as HTMLButtonElement).disabled).toBe(
      true
    )
    disabled.unmount()

    const empty = render(AudioPlayer, { props: { downloadable: true } })
    expect(empty.getByTestId(TEST_ID).hasAttribute('data-disabled')).toBe(true)
    expect(empty.queryByTestId(`${TEST_ID}__download`)).toBeNull()
    expect(empty.getByTestId(`${TEST_ID}__time`).textContent).toBe('--:--')
  })

  it('shows the transcript in a closed disclosure', async () => {
    const user = userEvent.setup()
    const view = render(Default)
    const details = view.getByTestId(`${TEST_ID}__transcript`) as HTMLDetailsElement
    expect(details.open).toBe(false)
    await user.click(view.getByText('Transcript'))
    expect(details.open).toBe(true)
    expect(details.textContent).toContain('acme-store is live')
  })

  it('gives the transcript summary a 40 px hit area on a coarse pointer', () => {
    const view = render(Default)
    const summary = view.getByTestId(`${TEST_ID}__transcript`).querySelector('summary')!
    const layer = summary.querySelector('[data-slot="touch-target"]')
    expect(summary.classList.contains('relative')).toBe(true)
    expect(layer?.getAttribute('aria-hidden')).toBe('true')
    expect(layer?.classList.contains('pointer-coarse:block')).toBe(true)
    expect(layer?.classList.contains('inset-y-[min(0rem,calc(50%-20px))]')).toBe(true)
    expect(summary.textContent?.trim()).toBe('Transcript')
  })

  it('reads its strings from the ConfigProvider locale', () => {
    const view = render(ConfigProvider, {
      props: { locale: 'pt-BR', catalogs: LOCALES },
      slots: {
        default: () => h(AudioPlayer, { src: placeholderClip, playbackRates: [1, 1.5] })
      }
    })
    expect(view.getByRole('group', { name: 'Player de áudio' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Reproduzir' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Velocidade de reprodução 1×' })).toBeTruthy()
  })

  it('renders right to left with its times isolated', async () => {
    const view = render(ConfigProvider, {
      props: { locale: 'en-US', dir: 'rtl', catalogs: LOCALES },
      slots: { default: () => h(Default) }
    })
    const root = view.getByTestId(TEST_ID)
    expect(root.closest('[dir="rtl"]')).toBeTruthy()
    expect(view.getByTestId(`${TEST_ID}__time`).querySelector('bdi')).toBeTruthy()
    const timeline = view.getByTestId(`${TEST_ID}__seek`).closest('[dir]')
    expect(timeline).toHaveAttribute('dir', 'ltr')
    expect(timeline).toContainElement(view.getByTestId(`${TEST_ID}__time`))
    expect(timeline).toContainElement(view.getByTestId(`${TEST_ID}__duration`))
    await expectNoA11yViolations(view.container)
  })
})
