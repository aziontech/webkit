# Audio Player

> A compact player for one audio clip: play and pause, a seek bar between the current time and the duration, mute and volume, and, when asked for, a playback speed control, a download link and a transcript. It plays what the app hands it (a URL, an object URL or a `data:` URL built from base64 audio) on the browser's own audio element; it fetches and decodes nothing. It owns the generating, buffering and error states, so an AI reply that speaks, or a stored recording, looks the same everywhere.

- Import: `import AudioPlayer from '@aziontech/ui/audio-player'`
- Category: content · Surface: app · Structure: monolithic
- API as JSON: [audio-player.json](audio-player.json)

## When to use

- An AI reply that carries audio: speech generated from text, generated music or sound, an audio part of a chat message.
- A voice note or recording a person attached to a message or a ticket.
- Previewing one stored audio file in a detail pane or drawer.

## Do

- Build `src` once from the source the app has: a URL as it is, base64 audio as `data:<mimeType>;base64,<value>`, a `Blob` as an object URL (revoke it when the player unmounts).
- Pass `duration` when the generator reports it, so the time shows before the browser has read the file.
- Set `loading` while the audio is being generated, so the player holds its place in the reply instead of appearing when it is done.
- Pass the text the audio speaks as `transcript`; a reader who cannot hear it reads it instead (WCAG 1.2.1).
- Give each player a `title` when a message holds more than one, so each control group has its own name.
- Never start playback on mount; the reader presses Play.
- In a narrow column only Mute is left for the volume; the device volume covers the rest on a phone.

## Don’t

- Video, or audio that needs a picture → use `DocFrame` (a captured clip) or `Embed` (a hosted player).
- Recording audio or a live voice conversation → use `PromptInput` and its dictate button.
- A file of any type with a type-aware fallback → use `FilePreview`.
- Background or decorative sound that the reader did not ask for → do not autoplay audio; leave it out.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- `FilePreview` — the preview of a stored file of any type; an audio file can open in an `AudioPlayer` instead.
- `ChatMessage` — the message an audio reply sits in.
- `Slider` — the seek and volume controls inside this component.
- `IconButton` — the play, mute and download controls inside this component.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `src` | `string` | `''` | false | Audio source: a URL, an object URL or a data URL built from base64 audio. Empty disables the controls. |
| `title` | `string` | `''` | false | Name of the clip, shown above the controls and used as the accessible name of the control group. |
| `duration` | `number` | `undefined` | false | Length of the clip in seconds, shown until the browser reads it from the file. Unset shows a placeholder. |
| `transcript` | `string` | `''` | false | Text the audio speaks, shown in a collapsible Transcript section under the controls. Empty hides the section. |
| `playbackRates` | `number[]` | `[]` | false | Playback speeds the speed control cycles through, in order. Empty hides it; it starts at 1 when listed, else the first. |
| `downloadable` | `boolean` | `false` | false | Shows a Download link to `src`. |
| `fileName` | `string` | `''` | false | File name the Download link saves the audio as. Empty lets the browser pick one. |
| `loading` | `boolean` | `false` | false | The audio is still being generated or fetched: the play control shows a spinner and the other controls are disabled. |
| `error` | `string` | `''` | false | Why the audio cannot play. Set, the controls are disabled and this text replaces the time. |
| `disabled` | `boolean` | `false` | false | Disables every control and applies the disabled tokens. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the control group when there is no `title`. Empty falls back to the catalog's Audio player. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `play` | `Event` | Playback started (the audio element's `play` event). |
| `pause` | `Event` | Playback paused, by the reader or because the clip reached its end (the element's `pause` event). |
| `retry` | `MouseEvent` | Try again in the error state was pressed. The button renders only when this event has a listener; an error the audio element reported is cleared and the element loads `src` again, and the app clears or keeps `error`. |

## States

- `data-playing` is set while the audio plays; the play control shows Pause.
- `data-loading` mirrors `loading` (the audio is still being generated or fetched): the play control shows a `Spinner` (through `IconButton`'s `loading`) and is inert, every other control is disabled, the root has `aria-busy`, and a visually hidden `role="status"` line says Loading audio.
- `data-buffering` is set while the browser waits for data after Play (the audio element's `waiting` until `playing`): a small `Spinner` replaces the current time, the root has `aria-busy` and the status line says Loading audio, and every control stays enabled; Play keeps its Pause name so the reader can stop a stalled clip.
- `data-error` is set when `error` is set or the audio element reports an error; the controls are disabled and the error line (`role="alert"`) replaces the time. The app's text wins; with no text the catalog's message shows. With a `retry` listener a small outline Try again `Button` (`az az-refresh`) sits at the end of the error line.
- `data-disabled` mirrors `disabled`; it is also set when `src` is empty and nothing is loading.
- `data-muted` is set while the audio is muted; the mute control shows Unmute and the volume slider reads 0.
- Empty: `src` empty with `loading` false sets `data-disabled`; the times show `--:--` and the Download link is not rendered.
- Unknown duration (no `duration` and the file not read yet): the times show `--:--` and the seek bar is disabled until the browser reports the length.
- The transcript is a native `details` disclosure, closed by default; its `open` attribute is the only open state, with no `data-state` on the root. On a coarse pointer an invisible layer (`data-slot="touch-target"`) extends the summary's hit area to 40 px tall.
- Not applicable: `readonly` and `invalid` (the player takes no value input).
- A new `src` resets the time, the playing state and the error.

## Accessibility

- The root is a `role="group"` named by `title` (`aria-labelledby`), else `ariaLabel`, else the catalog's Audio player.
- Visible focus: every control is an `IconButton`, `Button` or `Slider` with the ring token.
- Play is one toggle `IconButton` whose name follows its state (Play / Pause); its glyph is decorative. It is inert only under `loading`, `error`, `disabled` or an empty `src`; while buffering it stays operable.
- The seek bar is a `Slider` named Seek, from 0 to the duration in whole seconds, with a spoken `aria-valuetext` (`42 seconds of 3 minutes, 5 seconds`); it changes once a second at most.
- Mute is a toggle named Mute / Unmute; volume is a `Slider` named Volume, 0 to 100, with `aria-valuetext` from `formatNumber` (`style: 'percent'`).
- The speed control is a `Button` whose visible text is the rate (`1.5×`) and whose name is Playback speed 1.5×, so the name contains the visible text.
- Patterns (WAI-ARIA APG): Slider for seek and volume; Button with a name that follows its state for Play/Pause and Mute/Unmute; Button for speed; Link for Download; Disclosure for the transcript.
- Download is an anchor with the `download` attribute, named Download audio.
- The transcript is a native `details`/`summary` disclosure, so it opens with Enter or Space and announces its expanded state.
- Keyboard: `Tab` moves through Play, Seek, Mute, Volume, Speed, Download, Transcript; `Enter`/`Space` press the buttons; on the sliders the arrow keys step 1 second (seek) or 1 % (volume), `PageUp`/`PageDown` take larger steps, `Home`/`End` go to the start or the end.
- No autoplay (WCAG 1.4.2); the audio never starts without a press on Play.
- Contrast ≥4.5:1 for the title, the time and the error line; ≥3:1 for the glyphs and the slider tracks. Disabled controls render `--text-disabled` on `--bg-disabled` through `IconButton`, `Button` and `Slider`; inactive controls are exempt from 1.4.3 and 1.4.11.
- Touch target: Play is drawn 40 × 40 px and the other buttons 32 × 32 px (above the 24 px minimum, WCAG 2.5.8); on `pointer: coarse` `IconButton` and `Button` add their 44 × 44 px hit area, and the `Slider` inputs are 40 px tall.

## Right-to-left

- Layout: logical utilities only (`gap`, `ps-`/`pe-`, `text-start`); the control row mirrors. The timeline row (current time, seek bar, duration) does not: it is one `dir="ltr"` box, so the current time stays on the left at the start of the bar and the duration on the right at its end, as VideoPlayer and the browsers' own players do. The error line that replaces it keeps the page direction.
- Icons: none mirrored; play, pause, volume and download glyphs keep their shape (media glyphs do not flip).
- Seek bar: media time does not mirror. The seek slider sits in that `dir="ltr"` row, so it fills from the left and `ArrowRight` moves forward in every direction, as Material's media progress and the browsers' own players do (spec_version 2).
- Keyboard: the volume slider follows `Slider`'s right-to-left map (`ArrowLeft` raises it in right-to-left).
- User data: the times and the speed label are wrapped in `bdi` so `0:42` and `1.5×` keep their order; the title and the transcript are `dir="auto"`.

## Internationalization

| Key                         | English source              | Override prop |
| --------------------------- | --------------------------- | ------------- |
| `audioPlayer.label`         | `Audio player`              | `ariaLabel`   |
| `audioPlayer.play`          | `Play`                      | —             |
| `audioPlayer.pause`         | `Pause`                     | —             |
| `audioPlayer.seek`          | `Seek`                      | —             |
| `audioPlayer.position`      | `{current} of {total}`      | —             |
| `audioPlayer.mute`          | `Mute`                      | —             |
| `audioPlayer.unmute`        | `Unmute`                    | —             |
| `audioPlayer.volume`        | `Volume`                    | —             |
| `audioPlayer.rate`          | `{rate}×`                   | —             |
| `audioPlayer.speed`         | `Playback speed {rate}`     | —             |
| `audioPlayer.download`      | `Download audio`            | —             |
| `audioPlayer.downloadTitle` | `Download {title}`          | —             |
| `audioPlayer.loading`       | `Loading audio`             | —             |
| `audioPlayer.error`         | `The audio could not play.` | `error`       |
| `audioPlayer.transcript`    | `Transcript`                | —             |
| `audioPlayer.retry`         | `Try again`                 | —             |

- Formatting: `formatNumber` (`Intl.NumberFormat`, the `ConfigProvider` locale) for the shown time, `m:ss` under an hour and `h:mm:ss` from an hour on, and for the rate inside `audioPlayer.rate` (a locale can move the sign: `×1,5`). The spoken `aria-valuetext` uses `formatNumber` with `style: 'unit'` (`hour`, `minute`, `second`, long) joined by `formatList` (`type: 'unit'`). An unknown duration shows `--:--`; the seek bar is disabled then, so it announces nothing. `audioPlayer.downloadTitle` names the link when `title` is set (the title fills `{title}`), so two players in one message have distinct link names.

## Responsive

- Layout: two rows at every width. The top row holds Play, the title (it takes the free space and truncates), Mute, the volume slider, Speed and Download; the bottom row holds the current time, the seek bar and the duration, so the seek bar always has the full width of the player.
- Container queries: the root is the `audio-player` container; under `@sm` (24rem) the volume slider hides and Mute stays. The volume slider is 6rem wide.
- Narrow (≤ 640 px or a narrow container): at a 244 px content width the top row needs about 190 px (40 + 32 + 64 + 32 and the gaps) and the bottom row keeps a seek bar of at least 6rem between the two times; the title truncates with an ellipsis.
- Touch: 44 × 44 px hit areas on `pointer: coarse` through `IconButton` and `Button`, 40 px tall `Slider` inputs; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px or at 200 % zoom; the seek bar is the part that shrinks (`min-w-0`).

## Examples

### Default

```vue
<script setup>
  import speech from '@aziontech/ui/assets/placeholder-clip.webm'
  import AudioPlayer from '@aziontech/ui/audio-player'
</script>

<template>
  <AudioPlayer
    :src="speech"
    title="Deployment summary"
    :duration="1.9"
    transcript="Your application acme-store is live. The last deploy finished in 42 seconds and every check passed."
  />
</template>
```

### Playback rates

```vue
<script setup>
  import speech from '@aziontech/ui/assets/placeholder-clip.webm'
  import AudioPlayer from '@aziontech/ui/audio-player'
</script>

<template>
  <AudioPlayer
    :src="speech"
    title="Weekly traffic report"
    :playback-rates="[0.75, 1, 1.5, 2]"
    downloadable
    file-name="weekly-traffic-report.webm"
  />
</template>
```

### Loading

```vue
<script setup>
  import AudioPlayer from '@aziontech/ui/audio-player'
</script>

<template>
  <AudioPlayer
    title="Deployment summary"
    loading
  />
</template>
```
