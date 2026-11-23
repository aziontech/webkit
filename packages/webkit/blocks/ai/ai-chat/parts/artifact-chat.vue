<script setup lang="ts">
  import ArtifactCanvas from '@aziontech/webkit/artifact-canvas'
  import ArtifactPreview from '@aziontech/webkit/artifact-preview'
  import Button from '@aziontech/webkit/button'
  import ChatMessage, { type ChatMessageFeedbackValue } from '@aziontech/webkit/chat-message'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Conversation from '@aziontech/webkit/conversation'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import type { PromptInputFile } from '@aziontech/webkit/prompt-input'
  import PromptInputAttachButton from '@aziontech/webkit/prompt-input-attach-button'
  import PromptInputDictateButton from '@aziontech/webkit/prompt-input-dictate-button'
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import Resizable from '@aziontech/webkit/resizable'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import SuggestionGroup from '@aziontech/webkit/suggestion-group'
  import Tag from '@aziontech/webkit/tag'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { type AiChatMessage, textOf } from '@aziontech/webkit/utils/ai-chat'
  import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

  import { sampleArtifactFollowUps, sampleArtifactThread, sampleArtifactVersions } from '../sample'

  const ARTIFACT = 'top-orders.sql'
  const turns = sampleArtifactThread
  const versions = sampleArtifactVersions
  const followUps = sampleArtifactFollowUps

  const { formatDate } = useLocale()
  const timeOf = (turn: AiChatMessage) =>
    turn.createdAt ? formatDate(turn.createdAt, { hour: '2-digit', minute: '2-digit' }) : ''

  const version = ref(versions.length - 1)
  const canvasOpen = ref(true)
  const drawerOpen = ref(false)
  const width = ref(440)
  const paneCanvasEl = ref<InstanceType<typeof ArtifactCanvas> | null>(null)
  const drawerCanvasEl = ref<InstanceType<typeof ArtifactCanvas> | null>(null)
  const prompt = ref('')
  const files = ref<PromptInputFile[]>([])
  const ratings = ref<Record<string, ChatMessageFeedbackValue | null>>({})
  const lines = computed(() => versions[version.value].split('\n').length)

  const clearPrompt = () => {
    prompt.value = ''
    files.value = []
  }

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
  const openCanvas = async (event?: Event) => {
    lastOpener = (event?.currentTarget ??
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
  <section
    aria-labelledby="ai-chat-artifact-title"
    data-layout-fill
    class="flex min-h-0 w-full grow basis-0 flex-col"
  >
    <header
      class="flex items-center justify-between gap-(--spacing-sm) px-(--spacing-md) py-(--spacing-xs)"
    >
      <div class="flex items-center gap-(--spacing-xs)">
        <h1
          id="ai-chat-artifact-title"
          class="text-label-md text-(--text-default)"
        >
          AI assistant
        </h1>
        <Tag
          label="Preview"
          severity="info"
          size="small"
        />
      </div>
      <Button
        v-if="!canvasOpen && !narrow"
        label="Show artifact"
        variant="ghost"
        size="small"
        icon="az az-app-window"
        @click="openCanvas"
      />
    </header>
    <div class="flex min-h-0 flex-1">
      <Resizable
        class="w-full"
        aria-label="Conversation and artifact"
      >
        <Resizable.Pane>
          <div class="flex min-h-0 flex-1 flex-col">
            <Conversation aria-label="Conversation with the AI assistant">
              <ChatMessage
                v-for="turn in turns"
                :key="turn.id"
                :from="turn.role === 'user' ? 'user' : 'assistant'"
                :timestamp="timeOf(turn)"
              >
                <template v-if="turn.role === 'user'">{{ textOf(turn, '\n') }}</template>
                <template v-else>
                  <StreamingResponse :content="textOf(turn)" />
                  <div
                    v-if="turn.version !== undefined"
                    data-artifact-open
                  >
                    <ArtifactPreview
                      :title="ARTIFACT"
                      :description="`Version ${(turn.version ?? 0) + 1}`"
                      meta="SQL"
                      icon="az az-code"
                      openable
                      @open="((version = turn.version ?? 0), openCanvas($event))"
                    />
                  </div>
                </template>
                <template
                  v-if="turn.role === 'assistant'"
                  #actions
                >
                  <ChatMessage.Actions
                    show-read-aloud
                    :read-aloud-text="textOf(turn)"
                  >
                    <CopyButton
                      size="large"
                      :value="textOf(turn)"
                    />
                    <ChatMessage.Feedback v-model="ratings[turn.id]" />
                  </ChatMessage.Actions>
                </template>
              </ChatMessage>
              <SuggestionGroup
                :items="followUps"
                aria-label="Follow-up questions"
                @select="(_event, item) => (prompt = item.label)"
              />
              <template #composer>
                <PromptInput
                  v-model="prompt"
                  v-model:files="files"
                  :max-length="4000"
                  placeholder="Ask for a change"
                  accept="image/*,application/pdf"
                  @submit="clearPrompt"
                >
                  <template #actions>
                    <PromptInputAttachButton />
                  </template>
                  <template #end>
                    <PromptInputDictateButton />
                  </template>
                  <template #hint>
                    The AI assistant can make mistakes. Check a query before you run it.
                  </template>
                </PromptInput>
              </template>
            </Conversation>
          </div>
        </Resizable.Pane>
        <Resizable.Handle
          v-if="canvasOpen && !narrow"
          aria-label="Resize the artifact"
        />
        <Resizable.Pane
          v-if="canvasOpen && !narrow"
          v-model:basis="width"
          :min="320"
          :max="880"
          aria-label="Artifact"
        >
          <ArtifactCanvas
            ref="paneCanvasEl"
            v-model:version="version"
            :title="ARTIFACT"
            :meta="`SQL · ${lines} lines`"
            type="code"
            :versions="versions.length"
            :copy-value="versions[version]"
            :download-href="`data:application/sql;charset=utf-8,${encodeURIComponent(versions[version])}`"
            @close="closeCanvas"
          >
            <CodeBlock
              :tabs="[{ label: 'SQL', value: 'sql', code: versions[version], language: 'sql' }]"
              :copyable="false"
              :bordered="false"
            />
          </ArtifactCanvas>
        </Resizable.Pane>
      </Resizable>
    </div>

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
        <ArtifactCanvas
          ref="drawerCanvasEl"
          v-model:version="version"
          :title="ARTIFACT"
          :meta="`SQL · ${lines} lines`"
          type="code"
          :versions="versions.length"
          :copy-value="versions[version]"
          @close="closeCanvas"
        >
          <CodeBlock
            :tabs="[{ label: 'SQL', value: 'sql', code: versions[version], language: 'sql' }]"
            :copyable="false"
            :bordered="false"
          />
        </ArtifactCanvas>
      </DrawerContent>
    </Drawer>
  </section>
</template>
