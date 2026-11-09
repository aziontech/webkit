<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import FlowAnchor from '@aziontech/webkit/flow-anchor'
  import FlowNode from '@aziontech/webkit/flow-node'
  import FlowRoot from '@aziontech/webkit/flow-root'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { functionRuns, RUN_FUNCTION, runById, runPath } from '@shared/ui/trace/run-trace.js'
  import RunLogs from '@shared/ui/trace/RunLogs.vue'
  import RunTrace from '@shared/ui/trace/RunTrace.vue'
  import { computed, nextTick, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import FunctionRunSummary from '../../components/function/FunctionRunSummary.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => String(route.query.email ?? ''))

  const runId = computed({
    get: () => runById(String(route.query.run ?? '')).id,
    set: (value) => router.replace({ query: { ...route.query, run: value } })
  })

  const run = computed(() => runById(runId.value))
  const path = computed(() => runPath(run.value))

  const selectedSpan = ref('')
  const traceRef = ref(null)

  const showSpan = async (spanId) => {
    selectedSpan.value = spanId
    await nextTick()
    const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    traceRef.value?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
  }

  const notImplemented = (what) => toast.info(`${what} is not wired up in this preview.`)

  const openFunctionSettings = () =>
    router.push({
      path: `/functions/${RUN_FUNCTION.id}`,
      query: { tab: 'settings', email: userEmail.value || undefined }
    })

  const openEvents = () =>
    router.push({ path: '/real-time-events', query: { email: userEmail.value || undefined } })
</script>

<template>
  <AppLayout
    active="functions"
    :breadcrumb="[
      { label: 'Functions', href: '/functions' },
      { label: RUN_FUNCTION.name, href: `/functions/${RUN_FUNCTION.id}` },
      { label: 'Invocations' }
    ]"
  >
    <main class="layout-column flex min-h-full flex-col">
      <PageHeading
        size="medium"
        title="Invocations"
        description="Every run of this function, end-to-end: the path the request took and what each step cost. Nothing to configure, nothing to attach."
      />

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <FunctionRunSummary
          v-model:run-id="runId"
          :run="run"
          :runs="functionRuns"
          :fn="RUN_FUNCTION"
          :email="userEmail"
          @replay="notImplemented('Replay')"
          @logs="openEvents"
          @settings="openFunctionSettings"
        />

        <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <PageHeading
            title="Request path"
            description="The resources this invocation travelled, and the time it spent in each one."
            size="small"
          />
          <CardBox
            :padded="false"
            class="overflow-x-auto bg-(--bg-surface-raised)"
          >
            <template #content>
              <FlowRoot
                align="start"
                class="[&>div]:w-full"
              >
                <FlowNode
                  v-for="node in path"
                  :key="node.key"
                  unstyled
                  :terminal="Boolean(node.terminal)"
                  class="w-full min-w-(--size-56) flex-1"
                >
                  <div
                    class="flex w-full min-w-0 flex-col rounded-(--shape-card) border-(length:--border-width-default) border-(--border-default) bg-(--bg-surface) shadow-(--shadow-xs) transition-colors duration-moderate-01 ease-productive-entrance hover:border-(--border-strong) has-[:focus-visible]:border-(--border-strong) motion-reduce:transition-none"
                  >
                    <FlowAnchor>
                      <div
                        class="flex w-full items-center gap-(--spacing-xxs) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-xxs)"
                      >
                        <i
                          :class="node.icon"
                          aria-hidden="true"
                          class="shrink-0 text-label-sm leading-none text-(--text-muted)"
                        />
                        <span class="truncate text-label-sm text-(--text-muted)">{{
                          node.eyebrow
                        }}</span>
                        <Tag
                          class="ml-auto shrink-0"
                          :severity="node.severity || 'secondary'"
                          :label="node.label"
                          size="small"
                        />
                      </div>
                    </FlowAnchor>

                    <div
                      class="flex min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-sm)"
                    >
                      <span class="min-w-0 truncate text-label-sm text-(--text-default)">{{
                        node.title
                      }}</span>
                      <span
                        v-if="node.spanId"
                        class="ml-auto flex shrink-0 items-center"
                      >
                        <Tooltip text="Show this hop in the trace">
                          <IconButton
                            icon="pi pi-align-left"
                            kind="outlined"
                            size="small"
                            :aria-label="`Show ${node.title} in the trace`"
                            @click="showSpan(node.spanId)"
                          />
                        </Tooltip>
                      </span>
                    </div>

                    <div
                      v-if="node.fields?.length"
                      class="flex flex-col gap-(--spacing-sm) border-t border-(--border-muted) p-(--spacing-md)"
                    >
                      <div
                        v-for="field in node.fields"
                        :key="field.label"
                        class="flex min-w-0 flex-col gap-(--spacing-xxs)"
                      >
                        <span class="text-label-sm text-(--text-muted)">{{ field.label }}</span>
                        <span class="truncate text-body-xs text-(--text-default)">
                          {{ field.value }}
                        </span>
                      </div>
                    </div>
                  </div>
                </FlowNode>
              </FlowRoot>
            </template>
          </CardBox>
        </div>

        <div
          ref="traceRef"
          class="flex min-w-0 flex-col gap-(--layout-group-gap)"
        >
          <PageHeading
            title="Trace"
            description="One row per span, placed against the run's own clock. Select a row to read what it measured."
            size="small"
          />
          <RunTrace
            v-model:selected="selectedSpan"
            :spans="run.spans"
            :total="run.duration"
          />
        </div>

        <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <PageHeading
            title="Logs"
            description="What the function printed while it ran, on the same clock as the trace above."
            size="small"
          />
          <RunLogs :logs="run.logs" />
        </div>
      </section>
    </main>
  </AppLayout>
</template>
