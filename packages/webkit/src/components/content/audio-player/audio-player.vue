<script setup lang="ts">
  import { computed, ref, useAttrs, useId, watch } from 'vue'

  import { useLocale } from '../../../composables/use-locale/use-locale'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import Spinner from '../../feedback/spinner/spinner.vue'
  import Slider from '../../input/slider/slider.vue'

  defineOptions({
    name: 'AudioPlayer',
    inheritAttrs: false
  })

  export interface AudioPlayerProps {
    /** Audio source: a URL, an object URL or a data URL built from base64 audio. Empty disables the controls. */
    src?: string
    /** Name of the clip, shown above the controls and used as the accessible name of the control group. */
    title?: string
    /** Length of the clip in seconds, shown until the browser reads it from the file. Unset shows a placeholder. */
    duration?: number
    /** Text the audio speaks, shown in a collapsible Transcript section under the controls. Empty hides the section. */
    transcript?: string
    /** Playback speeds the speed control cycles through, in order. Empty hides it; it starts at 1 when listed, else the first. */
    playbackRates?: number[]
    /** Shows a Download link to `src`. */
    downloadable?: boolean
    /** File name the Download link saves the audio as. Empty lets the browser pick one. */
    fileName?: string
    /** The audio is still being generated or fetched: the play control shows a spinner and the other controls are disabled. */
    loading?: boolean
    /** Why the audio cannot play. Set, the controls are disabled and this text replaces the time. */
    error?: string
    /** Disables every control and applies the disabled tokens. */
    disabled?: boolean
    /** Accessible name of the control group when there is no `title`. Empty falls back to the catalog's Audio player. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<AudioPlayerProps>(), {
    src: '',
    title: '',
    duration: undefined,
    transcript: '',
    playbackRates: () => [],
    downloadable: false,
    fileName: '',
    loading: false,
    error: '',
    disabled: false,
    ariaLabel: ''
  })

  const emit = defineEmits<{
    /** Playback started (the audio element's play event). */
    play: [event: Event]
    /** Playback paused, by the reader or because the clip reached its end. */
    pause: [event: Event]
  }>()

  const attrs = useAttrs()
  const { t, formatNumber, formatList } = useLocale({ audioPlayer: en.audioPlayer })
  const titleId = useId()

  const audioEl = ref<globalThis.HTMLAudioElement | null>(null)
  const playing = ref(false)
  const buffering = ref(false)
  const mediaError = ref(false)
  const muted = ref(false)
  const volume = ref(1)
  const currentTime = ref(0)
  const mediaDuration = ref<number | undefined>(undefined)

  const initialRate = (rates: number[]): number => (rates.includes(1) ? 1 : (rates[0] ?? 1))
  const rate = ref(initialRate(props.playbackRates))

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'audio-player'
  )

  const knownDuration = computed<number | undefined>(() => {
    if (mediaDuration.value !== undefined) return mediaDuration.value
    return typeof props.duration === 'number' && Number.isFinite(props.duration)
      ? props.duration
      : undefined
  })

  const hasError = computed(() => Boolean(props.error) || mediaError.value)
  const isEmpty = computed(() => !props.src && !props.loading)
  const inert = computed(() => props.disabled || isEmpty.value || hasError.value)
  const controlsDisabled = computed(() => inert.value || props.loading)

  const seekMax = computed(() => Math.max(1, Math.floor(knownDuration.value ?? 0)))
  const seekValue = computed(() => Math.min(seekMax.value, Math.floor(currentTime.value)))
  const volumeValue = computed(() => (muted.value ? 0 : Math.round(volume.value * 100)))

  const showDownload = computed(
    () => props.downloadable && Boolean(props.src) && !props.loading && !hasError.value
  )

  function clock(seconds: number | undefined): string {
    if (seconds === undefined || !Number.isFinite(seconds)) return '--:--'
    const total = Math.max(0, Math.floor(seconds))
    const hours = Math.floor(total / 3600)
    const minutes = Math.floor((total % 3600) / 60)
    const secs = total % 60
    const padded = (value: number) =>
      formatNumber(value, { minimumIntegerDigits: 2, useGrouping: false })
    if (hours > 0) {
      return `${formatNumber(hours, { useGrouping: false })}:${padded(minutes)}:${padded(secs)}`
    }
    return `${formatNumber(minutes, { useGrouping: false })}:${padded(secs)}`
  }

  function spoken(seconds: number): string {
    const total = Math.max(0, Math.floor(seconds))
    const units: Array<[number, string]> = [
      [Math.floor(total / 3600), 'hour'],
      [Math.floor((total % 3600) / 60), 'minute'],
      [total % 60, 'second']
    ]
    const parts = units
      .filter(([value]) => value > 0)
      .map(([value, unit]) => formatNumber(value, { style: 'unit', unit, unitDisplay: 'long' }))
    if (!parts.length) {
      return formatNumber(0, { style: 'unit', unit: 'second', unitDisplay: 'long' })
    }
    return formatList(parts, { type: 'unit', style: 'long' })
  }

  const currentLabel = computed(() =>
    knownDuration.value === undefined ? clock(undefined) : clock(currentTime.value)
  )
  const durationLabel = computed(() => clock(knownDuration.value))

  const positionText = computed(() =>
    knownDuration.value === undefined
      ? undefined
      : t('audioPlayer.position', {
          current: spoken(seekValue.value),
          total: spoken(knownDuration.value)
        })
  )

  const volumeText = computed(() => formatNumber(volumeValue.value / 100, { style: 'percent' }))

  const rateLabel = computed(() => t('audioPlayer.rate', { rate: formatNumber(rate.value) }))

  const downloadLabel = computed(() =>
    props.title ? t('audioPlayer.downloadTitle', { title: props.title }) : t('audioPlayer.download')
  )

  const errorText = computed(() => props.error || t('audioPlayer.error'))

  watch(
    () => props.src,
    () => {
      currentTime.value = 0
      playing.value = false
      buffering.value = false
      mediaError.value = false
      mediaDuration.value = undefined
    }
  )

  watch(
    () => props.playbackRates,
    (rates) => {
      rate.value = initialRate(rates)
      if (audioEl.value) audioEl.value.playbackRate = rate.value
    }
  )

  function readDuration() {
    const value = audioEl.value?.duration
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
      mediaDuration.value = value
    }
  }

  function onLoadedmetadata() {
    readDuration()
    if (audioEl.value) audioEl.value.playbackRate = rate.value
  }

  function onDurationchange() {
    readDuration()
  }

  function onTimeupdate() {
    currentTime.value = audioEl.value?.currentTime ?? 0
  }

  function onPlay(event: Event) {
    playing.value = true
    emit('play', event)
  }

  function onPause(event: Event) {
    playing.value = false
    buffering.value = false
    emit('pause', event)
  }

  function onWaiting() {
    buffering.value = true
  }

  function onPlaying() {
    buffering.value = false
  }

  function onCanplay() {
    buffering.value = false
  }

  function onError() {
    mediaError.value = true
    buffering.value = false
  }

  function onVolumechange() {
    if (!audioEl.value) return
    muted.value = audioEl.value.muted
    volume.value = audioEl.value.volume
  }

  function onPlayClick() {
    const el = audioEl.value
    if (!el || inert.value || props.loading) return
    if (el.paused) {
      el.play()?.catch(() => undefined)
    } else {
      el.pause()
    }
  }

  function onMuteClick() {
    const next = !muted.value
    muted.value = next
    if (audioEl.value) audioEl.value.muted = next
  }

  function onVolumeUpdate(value: number) {
    volume.value = value / 100
    if (audioEl.value) audioEl.value.volume = value / 100
    if (value > 0 && muted.value) {
      muted.value = false
      if (audioEl.value) audioEl.value.muted = false
    }
  }

  function onSeekUpdate(value: number) {
    currentTime.value = value
    if (audioEl.value) audioEl.value.currentTime = value
  }

  function onSpeedClick() {
    const rates = props.playbackRates
    if (!rates.length) return
    const index = rates.indexOf(rate.value)
    rate.value = rates[(index + 1) % rates.length] ?? rates[0] ?? 1
    if (audioEl.value) audioEl.value.playbackRate = rate.value
  }

  const TRANSCRIPT_SUMMARY_CLASS =
    'cursor-pointer rounded-(--shape-control) text-label-sm text-(--text-default) ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)'
</script>

<template>
  <div
    v-bind="$attrs"
    role="group"
    :aria-labelledby="title ? titleId : undefined"
    :aria-label="title ? undefined : ariaLabel || t('audioPlayer.label')"
    :aria-busy="loading || buffering || undefined"
    :data-testid="testId"
    :data-playing="playing || null"
    :data-loading="loading || null"
    :data-buffering="buffering || null"
    :data-error="hasError || null"
    :data-disabled="disabled || isEmpty || null"
    :data-muted="muted || null"
    class="group/audio-player @container/audio-player flex w-full min-w-0 flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-sm)"
  >
    <audio
      ref="audioEl"
      :src="src || undefined"
      preload="metadata"
      class="hidden"
      @loadedmetadata="onLoadedmetadata"
      @durationchange="onDurationchange"
      @timeupdate="onTimeupdate"
      @play="onPlay"
      @pause="onPause"
      @waiting="onWaiting"
      @playing="onPlaying"
      @canplay="onCanplay"
      @error="onError"
      @volumechange="onVolumechange"
    />
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <IconButton
        :icon="playing ? 'az az-pause' : 'az az-play'"
        :aria-label="playing ? t('audioPlayer.pause') : t('audioPlayer.play')"
        variant="secondary"
        size="large"
        :loading="loading"
        :disabled="inert"
        :data-testid="`${testId}__play`"
        @click="onPlayClick"
      />
      <span
        v-if="title"
        :id="titleId"
        :data-testid="`${testId}__title`"
        class="min-w-0 flex-1 truncate text-label-md text-(--text-default)"
      >
        <bdi>{{ title }}</bdi>
      </span>
      <span
        v-else
        aria-hidden="true"
        class="min-w-0 flex-1"
      />
      <IconButton
        :icon="muted ? 'az az-volume-off' : 'az az-volume-up'"
        :aria-label="muted ? t('audioPlayer.unmute') : t('audioPlayer.mute')"
        variant="ghost"
        size="medium"
        :disabled="controlsDisabled"
        :data-testid="`${testId}__mute`"
        @click="onMuteClick"
      />
      <div class="hidden w-24 shrink-0 @sm/audio-player:block">
        <Slider
          :model-value="volumeValue"
          :min="0"
          :max="100"
          :step="1"
          :disabled="controlsDisabled"
          :aria-label="t('audioPlayer.volume')"
          :aria-valuetext="volumeText"
          :data-testid="`${testId}__volume`"
          @update:model-value="onVolumeUpdate"
        />
      </div>
      <Button
        v-if="playbackRates.length"
        variant="ghost"
        size="medium"
        :disabled="controlsDisabled"
        :aria-label="t('audioPlayer.speed', { rate: rateLabel })"
        :data-testid="`${testId}__speed`"
        @click="onSpeedClick"
      >
        <bdi>{{ rateLabel }}</bdi>
      </Button>
      <IconButton
        v-if="showDownload"
        icon="az az-download"
        :aria-label="downloadLabel"
        variant="ghost"
        size="medium"
        :href="src"
        :download="fileName || ''"
        :disabled="disabled"
        :data-testid="`${testId}__download`"
      />
    </div>
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <p
        v-if="hasError"
        role="alert"
        :data-testid="`${testId}__error`"
        class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-danger)"
      >
        <i
          class="az az-circle-alert shrink-0"
          aria-hidden="true"
        />
        <bdi class="min-w-0">{{ errorText }}</bdi>
      </p>
      <template v-else>
        <span
          :data-testid="`${testId}__time`"
          class="inline-flex shrink-0 items-center text-body-xs text-(--text-muted) tabular-nums"
        >
          <Spinner
            v-if="buffering"
            class="size-3"
          />
          <bdi v-else>{{ currentLabel }}</bdi>
        </span>
        <div
          dir="ltr"
          class="min-w-24 flex-1"
        >
          <Slider
            :model-value="seekValue"
            :min="0"
            :max="seekMax"
            :step="1"
            :disabled="controlsDisabled || knownDuration === undefined"
            :aria-label="t('audioPlayer.seek')"
            :aria-valuetext="positionText"
            :data-testid="`${testId}__seek`"
            @update:model-value="onSeekUpdate"
          />
        </div>
        <span
          :data-testid="`${testId}__duration`"
          class="shrink-0 text-body-xs text-(--text-muted) tabular-nums"
        >
          <bdi>{{ durationLabel }}</bdi>
        </span>
      </template>
    </div>
    <span
      role="status"
      :data-testid="`${testId}__status`"
      class="sr-only"
    >
      {{ loading || buffering ? t('audioPlayer.loading') : '' }}
    </span>
    <details
      v-if="transcript"
      :data-testid="`${testId}__transcript`"
    >
      <summary :class="TRANSCRIPT_SUMMARY_CLASS">
        {{ t('audioPlayer.transcript') }}
      </summary>
      <p
        dir="auto"
        class="mt-(--spacing-2xs) whitespace-pre-line text-body-sm text-(--text-muted)"
      >
        {{ transcript }}
      </p>
    </details>
  </div>
</template>
