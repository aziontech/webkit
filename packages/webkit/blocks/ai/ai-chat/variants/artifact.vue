<script setup lang="ts">
  import ArtifactPreview from '@aziontech/webkit/artifact-preview'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import ResizableHandle from '@aziontech/webkit/resizable-handle'
  import ResizablePane from '@aziontech/webkit/resizable-pane'
  import type { AiChatMessage } from '@aziontech/webkit/utils/ai-chat'
  import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

  import AiChat from '../ai-chat.vue'
  import AiChatArtifact from '../parts/ai-chat-artifact.vue'
  import { sampleArtifactFollowUps, sampleArtifactThread, sampleArtifactVersions } from '../sample'

  const ARTIFACT = 'top-orders.sql'
  const versions = sampleArtifactVersions

  const versionOf = (turn: AiChatMessage) =>
    sampleArtifactThread.find((item) => item.id === turn.id)?.version

  const version = ref(versions.length - 1)
  const canvasOpen = ref(true)
  const drawerOpen = ref(false)
  const width = ref(440)
  const paneCanvasEl = ref<InstanceType<typeof AiChatArtifact> | null>(null)
  const drawerCanvasEl = ref<InstanceType<typeof AiChatArtifact> | null>(null)

  const narrow = ref(false)
  let narrowQuery: MediaQueryList | null = null
  const onNarrowChange = () => {
    narrow.value = !!narrowQuery?.matches
    if (!narrow.value) drawerOpen.value = false
  }
  onMounted(() => {
    narrowQuery = window.matchMedia?.('(max-width: 767px)') ?? null
    narrowQuery?.addEventListener('change', onNarrowChange)
    onNarrowChange()
  })
  onBeforeUnmount(() => narrowQuery?.removeEventListener('change', onNarrowChange))

  let lastOpener: HTMLElement | null = null
  const openCanvas = async (event: Event, turn: AiChatMessage) => {
    version.value = versionOf(turn) ?? 0
    lastOpener = (event.currentTarget ??
      globalThis.document?.activeElement ??
      null) as HTMLElement | null
    if (narrow.value) {
      drawerOpen.value = true
      await nextTick()
      drawerCanvasEl.value?.focus()
      return
    }
    canvasOpen.value = true
    await nextTick()
    paneCanvasEl.value?.focus()
  }
  const closeCanvas = async () => {
    canvasOpen.value = false
    drawerOpen.value = false
    await nextTick()
    const opener =
      lastOpener?.isConnected && lastOpener.tagName === 'BUTTON'
        ? lastOpener
        : globalThis.document?.querySelector<HTMLElement>('[data-artifact-open] button')
    opener?.focus()
  }
</script>

<template>
  <AiChat
    :messages="sampleArtifactThread"
    :follow-ups="sampleArtifactFollowUps"
  >
    <template #turn-end="{ turn }">
      <ArtifactPreview
        v-if="versionOf(turn) !== undefined"
        data-artifact-open
        :title="ARTIFACT"
        :description="`Version ${(versionOf(turn) ?? 0) + 1}`"
        meta="SQL"
        icon="az az-code"
        openable
        @open="openCanvas($event, turn)"
      />
    </template>
    <template #canvas>
      <template v-if="canvasOpen && !narrow">
        <ResizableHandle aria-label="Resize the artifact" />
        <ResizablePane
          v-model:basis="width"
          :min="320"
          :max="880"
          aria-label="Artifact"
        >
          <AiChatArtifact
            ref="paneCanvasEl"
            v-model:version="version"
            :title="ARTIFACT"
            :versions="versions"
            :downloadable="true"
            @close="closeCanvas"
          />
        </ResizablePane>
      </template>
      <Drawer
        v-if="narrow"
        v-model:open="drawerOpen"
        side="end"
        size="large"
      >
        <DrawerContent>
          <div class="sr-only">
            <DrawerTitle>Artifact</DrawerTitle>
          </div>
          <AiChatArtifact
            ref="drawerCanvasEl"
            v-model:version="version"
            :title="ARTIFACT"
            :versions="versions"
            :downloadable="false"
            @close="closeCanvas"
          />
        </DrawerContent>
      </Drawer>
    </template>
  </AiChat>
</template>
