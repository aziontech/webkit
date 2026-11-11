<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import { encodeQr, type QrErrorCorrection } from './qr-encode'

  export type { QrErrorCorrection }
  export type QrCodeSize = 'small' | 'medium' | 'large'

  defineOptions({
    name: 'QrCode',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** The text the code carries (a URI, a key), encoded as UTF-8 bytes. */
      value: string
      /** Accessible name of the image. Empty uses the catalog's `QR code`; name it after what the scan does. */
      label?: string
      /** Error-correction level: `L` 7 %, `M` 15 %, `Q` 25 %, `H` 30 % of the code can be lost and still read. Higher levels make denser codes. */
      errorCorrection?: QrErrorCorrection
      /** Rendered width: `small` 128 px, `medium` 160 px, `large` 224 px, quiet zone included. */
      size?: QrCodeSize
    }>(),
    {
      label: undefined,
      errorCorrection: 'M',
      size: 'medium'
    }
  )

  const QUIET = 4

  const attrs = useAttrs()
  const { t } = useTranslate({ qrCode: en.qrCode })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-qr-code'
  )

  const grid = computed<boolean[][] | null>(() => {
    if (!props.value) return null
    try {
      return encodeQr(props.value, props.errorCorrection)
    } catch (error) {
      globalThis.console?.warn(`[QrCode] ${(error as Error).message}`)
      return null
    }
  })

  const modules = computed<number>(() => grid.value?.length ?? 21)

  const path = computed<string>(() => {
    if (!grid.value) return ''
    let d = ''
    grid.value.forEach((row, y) => {
      let x = 0
      while (x < row.length) {
        if (!row[x]) {
          x++
          continue
        }
        const start = x
        while (x < row.length && row[x]) x++
        d += `M${start + QUIET} ${y + QUIET}h${x - start}v1h${start - x}z`
      }
    })
    return d
  })

  const name = computed<string>(() => props.label || t('qrCode.label'))
</script>

<template>
  <span
    v-bind="$attrs"
    role="img"
    :aria-label="name"
    :data-testid="testId"
    :data-size="size"
    :data-version="grid ? (modules - 17) / 4 : undefined"
    :data-modules="grid ? modules : undefined"
    data-theme="light"
    :class="attrs.class"
    class="inline-flex aspect-square max-w-full shrink-0 overflow-clip rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) text-(--text-default) forced-color-adjust-none data-[size=small]:w-32 data-[size=medium]:w-40 data-[size=large]:w-56"
  >
    <svg
      :viewBox="`0 0 ${modules + QUIET * 2} ${modules + QUIET * 2}`"
      dir="ltr"
      class="block size-full"
      shape-rendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <path
        v-if="path"
        :d="path"
        fill="currentColor"
      />
    </svg>
  </span>
</template>
