<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import { computed } from 'vue'

  import MockupPart from '../MockupPart.vue'
  import ShellMockup from '../ShellMockup.vue'

  defineOptions({ name: 'BotManagerTrafficFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the Bad Bot slice is brought forward while it is, and the rest of the traffic dims. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true

  const SLICES = [
    {
      key: 'legitimate',
      label: 'Legitimate',
      requests: '1,315,410',
      share: 71.4
    },
    {
      key: 'bad-bot',
      label: 'Bad Bot',
      requests: '256,081',
      share: 13.9
    },
    {
      key: 'good-bot',
      label: 'Good Bot',
      requests: '222,919',
      share: 12.1
    },
    {
      key: 'under-evaluation',
      label: 'Under Evaluation',
      requests: '47,900',
      share: 2.6
    }
  ]

  const FOCUS = 'bad-bot'

  const ARCS = SLICES.map((slice, index) => ({
    ...slice,
    offset: 25 - SLICES.slice(0, index).reduce((total, previous) => total + previous.share, 0)
  }))

  const focused = computed(() => props.active && (props.hover || !canHover))

  const dimmed = (key: string) => focused.value && key !== FOCUS
</script>

<template>
  <ShellMockup
    kind="bare"
    shell="legacy"
    fade="bottom"
    class="[--mockup-fade-start:80%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div class="py-(--spacing-xs)">
      <MockupPart :order="0">
        <CardBox>
          <template #content>
            <div class="flex flex-col gap-(--spacing-md)">
              <div class="flex flex-col gap-(--spacing-xxs)">
                <span class="flex items-center gap-(--spacing-xs)">
                  <span class="text-label-md text-(--text-default)">Top Bot Traffic</span>
                  <i
                    class="pi pi-info-circle text-body-sm leading-none text-(--text-muted)"
                    aria-hidden="true"
                  />
                </span>
                <span class="text-body-xs text-(--text-muted)">
                  Sum of requests grouped by identifying traffic as Legitimate, Bad Bot, Good Bot,
                  and Under Evaluation.
                </span>
              </div>

              <div class="flex items-center gap-(--spacing-lg)">
                <span class="relative grid size-36 shrink-0 place-items-center">
                  <svg
                    viewBox="0 0 42 42"
                    class="absolute inset-0 size-full"
                    aria-hidden="true"
                  >
                    <circle
                      v-for="arc in ARCS"
                      :key="arc.key"
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="5"
                      :stroke-dasharray="`${arc.share} ${100 - arc.share}`"
                      :stroke-dashoffset="arc.offset"
                      :data-slice="arc.key"
                      :data-dimmed="dimmed(arc.key) || null"
                      class="text-(--border-default) transition-opacity duration-moderate-02 ease-productive-entrance data-dimmed:opacity-30 data-[slice=bad-bot]:text-(--primary) data-[slice=good-bot]:text-(--text-default) data-[slice=legitimate]:text-(--text-muted) motion-reduce:transition-none"
                    />
                  </svg>
                  <span class="grid place-items-center text-center">
                    <span
                      :data-shown="!focused || null"
                      class="col-start-1 row-start-1 flex flex-col opacity-0 transition-opacity duration-moderate-02 ease-productive-entrance data-shown:opacity-100 motion-reduce:transition-none"
                    >
                      <span class="text-label-md text-(--text-default)">1,842,310</span>
                      <span class="text-body-xs text-(--text-muted)">Requests</span>
                    </span>
                    <span
                      :data-shown="focused || null"
                      class="col-start-1 row-start-1 flex flex-col opacity-0 transition-opacity duration-moderate-02 ease-productive-entrance data-shown:opacity-100 motion-reduce:transition-none"
                    >
                      <span class="text-label-md text-(--text-default)">13.9%</span>
                      <span class="text-body-xs text-(--text-muted)">Bad Bot</span>
                    </span>
                  </span>
                </span>

                <ul class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
                  <li
                    v-for="slice in SLICES"
                    :key="slice.key"
                    :data-dimmed="dimmed(slice.key) || null"
                    :data-focused="(focused && slice.key === FOCUS) || null"
                    class="flex items-center gap-(--spacing-xs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) transition-[opacity,background-color] duration-moderate-02 ease-productive-entrance data-dimmed:opacity-50 data-focused:bg-(--bg-hover) motion-reduce:transition-none"
                  >
                    <span
                      :data-slice="slice.key"
                      class="size-2.5 shrink-0 rounded-(--shape-elements) bg-(--border-default) data-[slice=bad-bot]:bg-(--primary) data-[slice=good-bot]:bg-(--text-default) data-[slice=legitimate]:bg-(--text-muted)"
                    />
                    <span class="min-w-0 flex-1 truncate text-body-sm text-(--text-default)">
                      {{ slice.label }}
                    </span>
                    <span class="shrink-0 text-body-xs text-(--text-muted)">
                      {{ slice.requests }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </template>
        </CardBox>
      </MockupPart>
    </div>
  </ShellMockup>
</template>
