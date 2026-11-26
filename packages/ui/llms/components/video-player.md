# Video Player

> A native video player with play and pause, seek with time, mute and volume, captions and full screen. It also shows the states of a generated video before it plays: generating (with an optional percentage) and error. It plays the URL the app hands it (https, `blob:` or `data:`) and fetches nothing.

- Import: `import VideoPlayer from '@aziontech/webkit/video-player'`
- Category: content · Surface: app · Structure: monolithic
- API as JSON: [video-player.json](video-player.json)

## When to use

- A generated or attached video in a chat message or artifact, from generating to playing.
- A recorded clip in an app screen.

## Do

- Give a `poster` and an `aria-label`.
- Mark the caption track in the page's language as `default`.
- Pass `progress` only when the generator reports one.

## Don’t

- A third-party player page (YouTube, Vimeo) → use `embed`.
- A docs clip → use `doc-frame`.
- A stored file of any type → use `file-preview`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [embed](embed.md) — third-party players.
- [file-preview](file-preview.md) — stored files of any type.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `src` | `string` | `''` | false | URL of the video: https, blob or data. |
| `mimeType` | `string` | `''` | false | Media type, such as video/mp4. |
| `poster` | `string` | `''` | false | Still image shown before play. |
| `captions` | `VideoPlayerCaption[]` | `[]` | false | WebVTT caption tracks. |
| `status` | `'pending' \| 'running' \| 'success' \| 'error'` | `'success'` | false | Generation status; success plays. |
| `progress` | `number` | `undefined` | false | Percent done while generating; unset is indeterminate. |
| `error` | `string` | `''` | false | Message of the error state. |
| `ariaLabel` | `string` | `''` | false | Accessible name; empty reads Video. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `retry` | `MouseEvent` | Try again in the error state was pressed. The button renders only when this event has a listener; a file that failed to load is loaded again, and the app sets `status` back to `pending` or `running` when it generates the video again. |

## States

- `data-status` mirrors `status`; a file that fails to load, or no `src`, shows `error`.
- `pending` / `running`: `Skeleton`, a `role="status"` message, `Progress` and the percentage; no controls.
- `error`: `EmptyState` with `error` or the default message; no playback controls. With a `retry` listener it shows a Try again `Button` (`az az-refresh`, outline, medium) under the message.
- `success`: the video and its controls; `data-paused`, `data-muted`.

## Accessibility

- `role="group"` named by `ariaLabel` (or Video). Native buttons and range inputs, each labelled; the seek bar reads like 1:05 of 3:20.
- Keyboard: `Tab`, `Enter` / `Space`, arrows (seek 1 s, volume 5), `Home` / `End`; `Esc` leaves full screen.
- No autoplay; status changes are announced, never move focus. Buttons 40 px (44 px coarse), bars 40 px.

## Right-to-left

- Layout: logical utilities only (`gap`, `ps-`/`pe-`, `text-start`); the controls bar mirrors, so Play sits at the start edge.
- Icons: none mirrored (play, pause, volume and full screen glyphs are not directional).
- Seek bar: media time does not mirror. The seek slider sits in a `dir="ltr"` box, so it fills from the left and `ArrowRight` moves forward in every direction, as Material's media progress and the browsers' own players do (spec_version 2).
- Keyboard: the volume bar fills from the start edge; `Slider` maps `ArrowLeft` to louder under right-to-left.
- User data: the time is wrapped in `dir="ltr"` so `1:05 / 3:20` keeps its order (the ` / ` is punctuation, the same in every shipped locale; screen readers get `videoPlayer.seekValue` instead, and the visible time is `aria-hidden`); caption text follows the track's own language.

## Internationalization

| Key                          | English source           | Override prop |
| ---------------------------- | ------------------------ | ------------- |
| `videoPlayer.label`          | `Video`                  | `ariaLabel`   |
| `videoPlayer.play`           | `Play`                   | —             |
| `videoPlayer.pause`          | `Pause`                  | —             |
| `videoPlayer.seek`           | `Seek`                   | —             |
| `videoPlayer.seekValue`      | `{current} of {duration}`| —             |
| `videoPlayer.mute`           | `Mute`                   | —             |
| `videoPlayer.volume`         | `Volume`                 | —             |
| `videoPlayer.captions`       | `Captions (CC)`          | —             |
| `videoPlayer.captionsShort`  | `CC` (the visible text of the Captions button; its accessible name is `videoPlayer.captions`, which contains it) | — |
| `videoPlayer.enterFullscreen`| `Enter full screen`      | —             |
| `videoPlayer.exitFullscreen` | `Exit full screen`       | —             |
| `videoPlayer.pending`        | `Waiting to generate`    | —             |
| `videoPlayer.running`        | `Generating video`       | —             |
| `videoPlayer.error`          | `The video could not load` | `error`     |
| `videoPlayer.retry`          | `Try again`              | —             |

- Formatting: the percentage goes through `formatNumber` with `style: 'percent'` and the `ConfigProvider` locale (so `42 %` or `%42` where a locale writes it so); the time digits through `formatNumber`, reading `m:ss` (`h:mm:ss` from one hour).

## Responsive

- Container queries: the root is a container; below `@md` the volume bar is hidden (Mute stays) and the seek bar takes the remaining width.
- Narrow (≤ 640 px or a narrow chat bubble): the frame keeps a 16:9 ratio and scales down; the controls stay on one row.
- Touch: 40 px targets; the buttons take a 44 px hit area under `pointer: coarse`, the two bars stay 40 px tall (see Accessibility); no hover-only affordance (the controls are always visible under the video).
- Reflow: no horizontal scroll at 320 px or at 200 % zoom; the controls bar wraps (`flex-wrap`), putting the seek bar on its own full-width row when the row runs out of room, and the time text does not wrap inside itself (`whitespace-nowrap`). Mute carries `ms-auto`, so when Mute, Captions and full screen wrap to a second row (a 320 px column) they sit together at the inline end instead of scattering from the start.

## Examples

### Default

```vue
<script setup>
  import placeholderClip from '@aziontech/webkit/assets/placeholder-clip.webm'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
  import VideoPlayer from '@aziontech/webkit/video-player'

  const vtt = 'WEBVTT\n\n00:00.000 --> 00:05.000\nCreate an application for Acme Store.'
  const captions = [
    {
      src: `data:text/vtt,${encodeURIComponent(vtt)}`,
      srclang: 'en',
      label: 'English',
      default: true
    }
  ]
</script>

<template>
  <VideoPlayer
    class="max-w-(--container-xl)"
    :src="placeholderClip"
    mime-type="video/webm"
    :poster="placeholderImage"
    :captions="captions"
    aria-label="Creating an application for Acme Store"
  />
</template>
```

### Statuses

```vue
<script setup>
  import VideoPlayer from '@aziontech/webkit/video-player'
  import { ref } from 'vue'

  const failedStatus = ref('error')

  const onRetry = () => {
    failedStatus.value = 'pending'
  }
</script>

<template>
  <div class="grid w-full gap-(--spacing-md) md:grid-cols-3">
    <VideoPlayer
      status="pending"
      aria-label="Product tour, waiting to generate"
    />
    <VideoPlayer
      status="running"
      :progress="42"
      aria-label="Product tour, generating"
    />
    <VideoPlayer
      :status="failedStatus"
      error="The model stopped before the video was done, so nothing was saved."
      aria-label="Product tour, failed"
      @retry="onRetry"
    />
  </div>
</template>
```
