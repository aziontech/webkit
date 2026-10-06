<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { computed, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  import HomeWire from '../home/HomeWire.vue'

  const route = useRoute()

  const HEADER_FALLBACK = 56
  const headerHeight = ref(HEADER_FALLBACK)
  const railWidth = ref(0)

  onMounted(() => {
    const header = document.querySelector('[data-testid="layout-global-header"]')
    if (header) headerHeight.value = Math.round(header.getBoundingClientRect().height)

    const rail = [...document.querySelectorAll('[data-testid="layout-sidebar"]')]
      .map((node) => node.getBoundingClientRect())
      .find((rect) => rect.width > 0 && rect.left < 100)
    if (rail) railWidth.value = Math.round(rail.width)
  })

  const FAMILIES = [
    [/^(home|dashboard)$/, 'home'],
    [/(-new|-edit)$|^(create|deploy|release-composer|forms-.*)$/, 'form'],
    [/(-detail)$|^(bucket-browser|account|account-.*|resources)$/, 'detail']
  ]

  const family = computed(() => {
    const name = String(route.name ?? '')
    return FAMILIES.find(([pattern]) => pattern.test(name))?.[1] ?? 'list'
  })

  const columnClass = computed(
    () =>
      ({
        home: 'layout-column',
        form: 'layout-form-create',
        detail: 'layout-column',
        list: 'layout-column'
      })[family.value]
  )

  const NAV_GROUPS = [
    { id: 'top', labelled: false, items: ['40%', '52%', '58%', '56%'] },
    { id: 'build', labelled: true, items: ['62%', '46%', '48%', '54%', '66%'] },
    { id: 'store', labelled: true, items: ['64%', '58%'] },
    { id: 'secure', labelled: true, items: ['42%', '50%', '54%', '72%', '60%'] }
  ]

  const TABLE_CELLS = ['18%', '15%', '9%', '17%', '11%', '8%']
  const TABLE_ROWS = 8

  const FORM_SECTIONS = 2
  const FORM_ROWS = ['58%', '44%', '66%']

  const DETAIL_TABS = ['6rem', '3rem', '7.5rem', '8rem', '9rem', '6.5rem']
</script>

<template>
  <div
    role="status"
    aria-live="polite"
    aria-busy="true"
    data-testid="session-wire"
    class="fixed inset-0 z-[1200] flex flex-col overflow-hidden bg-(--bg-canvas) animate-fade-in motion-reduce:animate-none"
  >
    <span class="sr-only">Session expired. Signing you out.</span>

    <div
      class="flex shrink-0 items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) px-(--spacing-md)"
      :style="{ height: `${headerHeight}px` }"
    >
      <Skeleton
        width="1.25rem"
        height="1.25rem"
      />
      <Skeleton
        width="5rem"
        height="0.875rem"
      />
      <Skeleton
        width="4.5rem"
        height="0.875rem"
      />
      <Skeleton
        class="hidden md:block"
        width="6rem"
        height="0.875rem"
      />
      <Skeleton
        class="hidden lg:block"
        width="8rem"
        height="0.875rem"
      />

      <div class="ml-auto flex items-center gap-(--spacing-xs)">
        <Skeleton
          width="5.5rem"
          height="2rem"
        />
        <Skeleton
          class="hidden md:block"
          width="4.5rem"
          height="2rem"
        />
        <Skeleton
          kind="circle"
          width="2rem"
          height="2rem"
        />
      </div>
    </div>

    <div class="flex min-h-0 flex-1">
      <div
        v-if="railWidth > 0"
        class="flex shrink-0 flex-col gap-(--spacing-lg) overflow-hidden border-r-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) p-(--spacing-sm)"
        :style="{ width: `${railWidth}px` }"
      >
        <Skeleton height="2.5rem" />

        <div
          v-for="group in NAV_GROUPS"
          :key="group.id"
          class="flex flex-col gap-(--spacing-md)"
        >
          <Skeleton
            v-if="group.labelled"
            width="30%"
            height="0.5rem"
          />
          <Skeleton
            v-for="(item, index) in group.items"
            :key="index"
            :width="item"
            height="0.875rem"
          />
        </div>

        <div class="mt-auto flex items-center gap-(--spacing-xs)">
          <Skeleton
            width="1.5rem"
            height="1.5rem"
          />
          <Skeleton
            width="50%"
            height="0.75rem"
          />
        </div>
      </div>

      <div class="flex min-w-0 flex-1 flex-col">
        <div
          v-if="family === 'detail'"
          class="layout-boundary-inline flex h-14 shrink-0 items-center gap-(--spacing-lg) border-b-(length:--border-width-default) border-(--border-muted)"
        >
          <Skeleton
            v-for="(tab, index) in DETAIL_TABS"
            :key="index"
            :width="tab"
            height="0.875rem"
          />
        </div>

        <div class="layout-boundary min-h-0 flex-1 overflow-hidden">
          <div
            v-if="family === 'list'"
            :class="columnClass"
            class="flex min-w-0 flex-col gap-(--layout-group-gap)"
          >
            <div class="flex items-center gap-(--spacing-sm)">
              <Skeleton
                width="2.5rem"
                height="2.5rem"
              />
              <Skeleton
                class="grow"
                height="2.5rem"
              />
              <Skeleton
                width="10rem"
                height="2.5rem"
              />
            </div>

            <CardBox :padded="false">
              <template #content>
                <div
                  class="flex items-center gap-(--spacing-md) border-b-(length:--border-width-default) border-(--border-default) px-(--spacing-md) py-(--spacing-md)"
                >
                  <Skeleton
                    v-for="(cell, index) in TABLE_CELLS"
                    :key="index"
                    :width="cell"
                    height="0.75rem"
                  />
                </div>
                <div
                  v-for="row in TABLE_ROWS"
                  :key="row"
                  class="flex items-center gap-(--spacing-md) px-(--spacing-md) py-(--spacing-md)"
                >
                  <Skeleton
                    v-for="(cell, index) in TABLE_CELLS"
                    :key="index"
                    :width="cell"
                    height="0.875rem"
                  />
                </div>
                <div
                  class="flex items-center justify-between gap-(--spacing-md) border-t-(length:--border-width-default) border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
                >
                  <Skeleton
                    width="11rem"
                    height="0.75rem"
                  />
                  <div class="flex items-center gap-(--spacing-xs)">
                    <Skeleton
                      v-for="index in 4"
                      :key="index"
                      width="2rem"
                      height="2rem"
                    />
                  </div>
                </div>
              </template>
            </CardBox>
          </div>

          <div
            v-else-if="family === 'form' || family === 'detail'"
            :class="columnClass"
            class="flex min-w-0 flex-col"
          >
            <div class="flex flex-col gap-(--spacing-xs)">
              <Skeleton
                width="14rem"
                height="1.5rem"
              />
              <Skeleton
                width="26rem"
                height="0.875rem"
              />
            </div>

            <div class="layout-section-start flex flex-col gap-(--layout-section-gap)">
              <div
                v-for="section in FORM_SECTIONS"
                :key="section"
                class="flex flex-col gap-(--layout-group-gap)"
              >
                <Skeleton
                  width="7rem"
                  height="1rem"
                />
                <CardBox :padded="false">
                  <template #content>
                    <div
                      v-for="(field, index) in FORM_ROWS"
                      :key="index"
                      class="flex items-center gap-(--spacing-md) px-(--spacing-md) py-(--spacing-md)"
                      :class="
                        index > 0
                          ? 'border-t-(length:--border-width-default) border-(--border-default)'
                          : ''
                      "
                    >
                      <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xs)">
                        <Skeleton
                          width="6rem"
                          height="0.875rem"
                        />
                        <Skeleton
                          :width="field"
                          height="0.75rem"
                        />
                      </div>
                      <div class="layout-field-control">
                        <Skeleton height="2.5rem" />
                      </div>
                    </div>
                  </template>
                </CardBox>
              </div>
            </div>
          </div>

          <div
            v-else
            :class="columnClass"
            class="flex min-h-full min-w-0 flex-col justify-center"
          >
            <HomeWire />
          </div>
        </div>

        <div
          v-if="family === 'form'"
          class="layout-boundary-inline flex shrink-0 items-center justify-end gap-(--spacing-sm) border-t-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) py-(--spacing-sm)"
        >
          <Skeleton
            width="5.5rem"
            height="2.5rem"
          />
          <Skeleton
            width="7rem"
            height="2.5rem"
          />
        </div>
      </div>
    </div>
  </div>
</template>
