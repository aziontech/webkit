<script setup lang="ts">
  import { defaultDocument, useEventListener } from '@vueuse/core'
  import { computed, nextTick, onMounted, ref, useAttrs, watch } from 'vue'

  import { useLocale } from '../../../composables/use-locale/use-locale'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Progress from '../../feedback/progress/progress.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import Slider from '../../input/slider/slider.vue'
  import { formatTime } from './lib/format-time'

  defineOptions({ name: 'VideoPlayer', inheritAttrs: false })

  /** Where the video is: waiting to generate, generating, ready to play, or failed. */
  export type VideoPlayerStatus = 'pending' | 'running' | 'success' | 'error'

  /** One caption track of the video. */
  export interface VideoPlayerCaption {
    /** URL of the WebVTT file. */
    src: string
    /** Language of the track, as a BCP 47 tag. */
    srclang: string
    /** Name of the track shown by the browser. */
    label: string
    /** Marks the track shown when captions are on. */
    default?: boolean
  }

  export interface VideoPlayerProps {
    /** URL of the video: https, blob or data. */
    src?: string
    /** Media type, such as video/mp4. */
    mimeType?: string
    /** Still image shown before play. */
    poster?: string
    /** WebVTT caption tracks. */
    captions?: VideoPlayerCaption[]
    /** Generation status; success plays. */
    status?: VideoPlayerStatus
    /** Percent done while generating; unset is indeterminate. */
    progress?: number
    /** Message of the error state. */
    error?: string
    /** Accessible name; empty reads Video. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<VideoPlayerProps>(), {
    src: '',
    mimeType: '',
    poster: '',
    captions: () => [],
    status: 'success',
    progress: undefined,
    error: '',
    ariaLabel: ''
  })

  const attrs = useAttrs()
  const { t, formatNumber } = useLocale({ videoPlayer: en.videoPlayer })

  const rootEl = ref<HTMLDivElement | null>(null)
  const videoEl = ref<HTMLVideoElement | null>(null)
  const mediaFailed = ref(false)
  const paused = ref(true)
  const muted = ref(false)
  const currentTime = ref(0)
  const duration = ref(Number.NaN)
  const volume = ref(100)
  const captionsOn = ref(props.captions.some((caption) => caption.default === true))
  const fullscreen = ref(false)
  const fullscreenAvailable = ref(false)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'video-player'
  )

  const shownStatus = computed<VideoPlayerStatus>(() =>
    props.status === 'error' || mediaFailed.value || (props.status === 'success' && !props.src)
      ? 'error'
      : props.status
  )

  const generating = computed(
    () => shownStatus.value === 'pending' || shownStatus.value === 'running'
  )

  const generatingMessage = computed(() =>
    shownStatus.value === 'pending' ? t('videoPlayer.pending') : t('videoPlayer.running')
  )

  const clampedProgress = computed(() => Math.min(100, Math.max(0, props.progress ?? 0)))

  const progressText = computed(() =>
    formatNumber(clampedProgress.value / 100, { style: 'percent', maximumFractionDigits: 0 })
  )

  const durationKnown = computed(() => Number.isFinite(duration.value) && duration.value > 0)

  const currentText = computed(() => formatTime(currentTime.value, formatNumber))

  const durationText = computed(() => formatTime(duration.value, formatNumber))

  const timeText = computed(() =>
    durationKnown.value ? `${currentText.value} / ${durationText.value}` : currentText.value
  )

  const seekValueText = computed(() =>
    t('videoPlayer.seekValue', { current: currentText.value, duration: durationText.value })
  )

  const volumeValueText = computed(() =>
    formatNumber(volume.value / 100, { style: 'percent', maximumFractionDigits: 0 })
  )

  const activeTrackIndex = computed(() =>
    Math.max(
      0,
      props.captions.findIndex((caption) => caption.default === true)
    )
  )

  watch(
    () => props.src,
    async () => {
      mediaFailed.value = false
      paused.value = true
      currentTime.value = 0
      duration.value = Number.NaN
      await nextTick()
      videoEl.value?.load()
    }
  )

  watch(
    () => props.captions,
    (captions) => {
      captionsOn.value = captions.some((caption) => caption.default === true)
    }
  )

  useEventListener(defaultDocument, 'fullscreenchange', () => {
    fullscreen.value = rootEl.value !== null && defaultDocument?.fullscreenElement === rootEl.value
  })

  onMounted(() => {
    fullscreenAvailable.value = defaultDocument?.fullscreenEnabled === true
  })

  function onPlay() {
    paused.value = false
  }

  function onPause() {
    paused.value = true
  }

  function onTimeupdate() {
    currentTime.value = videoEl.value?.currentTime ?? 0
  }

  function onDurationchange() {
    duration.value = videoEl.value?.duration ?? Number.NaN
  }

  function onVolumechange() {
    const video = videoEl.value
    if (!video) return
    muted.value = video.muted
    volume.value = Math.round(video.volume * 100)
  }

  function onMediaError() {
    mediaFailed.value = true
  }

  function onPlayClick() {
    const video = videoEl.value
    if (!video) return
    if (video.paused) {
      void video.play().catch(() => undefined)
    } else {
      video.pause()
    }
  }

  function onSeek(value: number) {
    const video = videoEl.value
    if (!video) return
    video.currentTime = value
    currentTime.value = value
  }

  function onMuteClick() {
    const video = videoEl.value
    if (!video) return
    video.muted = !video.muted
  }

  function onVolume(value: number) {
    const video = videoEl.value
    volume.value = value
    if (!video) return
    video.volume = value / 100
    if (value > 0 && video.muted) video.muted = false
  }

  function onCaptionsClick() {
    const next = !captionsOn.value
    captionsOn.value = next
    const track = videoEl.value?.textTracks[activeTrackIndex.value]
    if (track) track.mode = next ? 'showing' : 'disabled'
  }

  function onFullscreenClick() {
    if (defaultDocument?.fullscreenElement) {
      void defaultDocument.exitFullscreen().catch(() => undefined)
    } else {
      void rootEl.value?.requestFullscreen().catch(() => undefined)
    }
  }
</script>

<template>
  <div
    ref="rootEl"
    v-bind="$attrs"
    role="group"
    :aria-label="ariaLabel || t('videoPlayer.label')"
    :aria-busy="generating || undefined"
    :data-testid="testId"
    :data-status="shownStatus"
    :data-paused="paused || null"
    :data-muted="muted || null"
    class="@container/video-player flex w-full flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) [&:fullscreen]:rounded-none [&:fullscreen]:border-0"
  >
    <div
      v-if="generating"
      class="relative aspect-video w-full"
    >
      <div class="absolute inset-0">
        <Skeleton
          width="100%"
          height="100%"
        />
      </div>
      <div
        role="status"
        aria-live="polite"
        :data-testid="`${testId}__generating`"
        class="absolute inset-0 flex flex-col items-center justify-center gap-(--spacing-xs) p-(--spacing-md) text-center"
      >
        <p class="text-body-md text-(--text-default)">{{ generatingMessage }}</p>
        <Progress
          class="w-full max-w-60"
          size="small"
          :indeterminate="progress === undefined || shownStatus === 'pending'"
          :value="clampedProgress"
          :aria-label="generatingMessage"
        />
        <p
          v-if="progress !== undefined && shownStatus === 'running'"
          class="text-label-sm text-(--text-muted)"
        >
          {{ progressText }}
        </p>
      </div>
    </div>

    <div
      v-else-if="shownStatus === 'error'"
      class="flex aspect-video w-full items-center justify-center"
    >
      <EmptyState
        :data-testid="`${testId}__error`"
        :title="error || t('videoPlayer.error')"
        icon="az az-circle-alert"
        size="small"
      />
    </div>

    <template v-else>
      <div
        class="aspect-video w-full bg-(--bg-canvas) [:fullscreen_&]:aspect-auto [:fullscreen_&]:min-h-0 [:fullscreen_&]:flex-1"
      >
        <video
          ref="videoEl"
          :data-testid="`${testId}__video`"
          :poster="poster || undefined"
          preload="metadata"
          playsinline
          tabindex="-1"
          class="h-full w-full object-contain"
          @play="onPlay"
          @pause="onPause"
          @timeupdate="onTimeupdate"
          @durationchange="onDurationchange"
          @loadedmetadata="onDurationchange"
          @volumechange="onVolumechange"
          @error="onMediaError"
        >
          <source
            :src="src"
            :type="mimeType || undefined"
            @error="onMediaError"
          />
          <track
            v-for="caption in captions"
            :key="caption.src"
            kind="captions"
            :src="caption.src"
            :srclang="caption.srclang"
            :label="caption.label"
            :default="caption.default === true"
          />
        </video>
      </div>
      <div
        class="flex flex-wrap items-center gap-(--spacing-2xs) px-(--spacing-xs) py-(--spacing-2xs)"
      >
        <IconButton
          :data-testid="`${testId}__play`"
          :icon="paused ? 'az az-play' : 'az az-pause'"
          :aria-label="paused ? t('videoPlayer.play') : t('videoPlayer.pause')"
          variant="ghost"
          size="large"
          @click="onPlayClick"
        />
        <span
          :data-testid="`${testId}__time`"
          aria-hidden="true"
          dir="ltr"
          class="whitespace-nowrap tabular-nums text-label-sm text-(--text-muted)"
        >
          {{ timeText }}
        </span>
        <div
          dir="ltr"
          class="min-w-32 flex-1"
        >
          <Slider
            :data-testid="`${testId}__seek`"
            :min="0"
            :max="durationKnown ? duration : 0"
            :step="1"
            :model-value="currentTime"
            :disabled="!durationKnown"
            :aria-label="t('videoPlayer.seek')"
            :aria-valuetext="seekValueText"
            @update:model-value="onSeek"
          />
        </div>
        <IconButton
          :data-testid="`${testId}__mute`"
          :icon="muted ? 'az az-volume-off' : 'az az-volume-up'"
          :aria-label="t('videoPlayer.mute')"
          :aria-pressed="muted"
          variant="ghost"
          size="large"
          @click="onMuteClick"
        />
        <div class="hidden w-24 @md/video-player:block">
          <Slider
            :data-testid="`${testId}__volume`"
            :min="0"
            :max="100"
            :step="5"
            :model-value="volume"
            :aria-label="t('videoPlayer.volume')"
            :aria-valuetext="volumeValueText"
            @update:model-value="onVolume"
          />
        </div>
        <Button
          v-if="captions.length"
          :data-testid="`${testId}__captions`"
          :label="t('videoPlayer.captionsShort')"
          :aria-label="t('videoPlayer.captions')"
          :aria-pressed="captionsOn"
          variant="ghost"
          size="large"
          @click="onCaptionsClick"
        />
        <IconButton
          v-if="fullscreenAvailable"
          :data-testid="`${testId}__fullscreen`"
          :icon="fullscreen ? 'az az-minimize' : 'az az-maximize'"
          :aria-label="
            fullscreen ? t('videoPlayer.exitFullscreen') : t('videoPlayer.enterFullscreen')
          "
          variant="ghost"
          size="large"
          @click="onFullscreenClick"
        />
      </div>
    </template>
  </div>
</template>
