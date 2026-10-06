<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import FlowRoot from '@aziontech/webkit/flow-root'
  import IconButton from '@aziontech/webkit/icon-button'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import FlowCard from '@shared/ui/flow/FlowCard.vue'
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
                <FlowCard
                  v-for="node in path"
                  :key="node.key"
                  :eyebrow="node.eyebrow"
                  :icon="node.icon"
                  :title="node.title"
                  :label="node.label"
                  :severity="node.severity"
                  :terminal="Boolean(node.terminal)"
                  class="min-w-(--size-56) flex-1"
                >
                  <template
                    v-if="node.spanId"
                    #actions
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
                  </template>

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
                </FlowCard>
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
