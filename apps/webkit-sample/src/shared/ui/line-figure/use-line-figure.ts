import {
  type MaybeRefOrGetter,
  onMounted,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  shallowReadonly,
  shallowRef,
  toValue,
  watch
} from 'vue'

import { parameter } from './engine/intensity'
import { tour, type TourHandle } from './engine/stage'
import type { FigureDefinition, FigureHandle } from './engine/types'
import { resolveLineFigure } from './figures/registry'

export interface UseLineFigureOptions {
  name: MaybeRefOrGetter<string>
  intensity: MaybeRefOrGetter<number>
  play: MaybeRefOrGetter<boolean>
  onRead: (caption: string) => void
}

export interface UseLineFigureReturn {
  definition: Readonly<Ref<FigureDefinition | null>>
  caption: Readonly<Ref<string>>
}

export function useLineFigure(
  stage: Ref<HTMLElement | null>,
  svg: Ref<SVGSVGElement | null>,
  { name, intensity, play, onRead }: UseLineFigureOptions
): UseLineFigureReturn {
  const definition = shallowRef<FigureDefinition | null>(null)
  const caption = ref('')
  let handle: FigureHandle | null = null
  let playing: TourHandle | null = null
  let request = 0

  const readout = {
    get textContent() {
      return caption.value
    },
    set textContent(next: string | null) {
      const text = next ?? ''
      if (text === caption.value) return
      caption.value = text
      onRead(text)
    }
  }

  function syncPlay() {
    const host = stage.value
    const wanted = !!definition.value && !!host && toValue(play)
    if (wanted === !!playing) return
    playing?.stop()
    playing = wanted && host && definition.value ? tour(host, definition.value.tour) : null
  }

  function teardown() {
    playing?.stop()
    playing = null
    handle?.destroy()
    handle = null
    definition.value = null
  }

  async function load(next: string) {
    const ticket = ++request
    teardown()
    const loader = resolveLineFigure(next)
    if (!loader) {
      if (next) console.warn(`[LineFigure] Unknown figure "${next}".`)
      return
    }
    const figure = await loader()
    const host = stage.value
    const target = svg.value
    if (ticket !== request || !host || !target) return
    definition.value = figure
    playing = toValue(play) ? tour(host, figure.tour) : null
    handle = figure.mount(
      { stage: host, svg: target, read: readout },
      parameter(figure.range, toValue(intensity))
    )
    if (!caption.value) readout.textContent = figure.rest
  }

  onMounted(() => {
    watch(() => toValue(name), load, { immediate: true })
    watch(
      () => toValue(intensity),
      (value) => {
        if (handle && definition.value) handle.set(parameter(definition.value.range, value))
      }
    )
    watch(() => toValue(play), syncPlay)
  })

  onScopeDispose(() => {
    request++
    teardown()
  })

  return { definition: shallowReadonly(definition), caption: readonly(caption) }
}
