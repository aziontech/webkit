<script setup>
  import FrameBox from '@aziontech/webkit/frame-box'
  import MediaTabs from '@aziontech/webkit/media-tabs'
  import MiniButton from '@aziontech/webkit/mini-button'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import { useRouter } from 'vue-router'

  import { TRACE_TABS } from '../data/console-trace.js'
  import { ConsoleTraceScene } from '../ui/index.js'

  const STEP_MS = 5200

  const router = useRouter()

  const TAB_ITEMS = TRACE_TABS.map((entry) => ({
    title: entry.label,
    description: entry.description
  }))

  const openConsole = () => router.push('/product-preview')
</script>

<template>
  <SectionModule
    :divided="false"
    :padded="false"
  >
    <template #header>
      <SectionTitle
        kind="left"
        eyebrow="Observability"
        title="Inspect every run end-to-end"
        description="Every invocation of a function is traced on the platform itself — spans, logs and the path the request took. Nothing to configure, no storage to attach. Pick a document to open it."
      />
    </template>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <MediaTabs
        :items="TAB_ITEMS"
        size="small"
        :auto-play-interval="STEP_MS"
        class="[--media-tabs-media-min:24rem]"
      >
        <template #media="{ index }">
          <ConsoleTraceScene
            :tab="TRACE_TABS[index].value"
            class="size-full"
          />
        </template>
      </MediaTabs>

      <div class="p-(--spacing-xl)">
        <MiniButton
          label="Open an invocation"
          show-icon
          icon="pi pi-angle-right"
          @click="openConsole"
        />
      </div>
    </FrameBox>
  </SectionModule>
</template>
