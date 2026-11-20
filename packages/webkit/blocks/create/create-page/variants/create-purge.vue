<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import AppHeader from '@aziontech/webkit/app-header'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import FieldDescription from '@aziontech/webkit/field-description'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import { useEscapeToCancel } from '@aziontech/webkit/use-escape-to-cancel'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import { computed, reactive, ref, watch } from 'vue'

  interface PurgeError {
    type: 'helper' | 'invalid' | 'required'
    message: string
  }

  const breadcrumb = [{ label: 'Cache', href: '/cache' }, { label: 'Create Purge' }]
  const layers = [
    {
      value: 'cache',
      label: 'Cache',
      description: 'Evicts the objects from the cache layer, in every location.'
    },
    {
      value: 'tiered_cache',
      label: 'Tiered Cache',
      description:
        'Evicts the objects from the tiered cache layer that sits between the cache and your origin.'
    }
  ]
  const types = [
    {
      value: 'cachekey',
      label: 'Cache key',
      noun: 'cache key',
      description: 'The exact keys objects were cached under, including any @@ variations.',
      placeholder: 'www.example.com/images/image.jpg@@cookie_name=value',
      helper: 'One cache key per line, without the protocol.'
    },
    {
      value: 'url',
      label: 'URL',
      noun: 'URL',
      description: 'Every cached variation of each address.',
      placeholder: 'www.example.com/index.html\nwww.example.com/styles/main.css',
      helper: 'One URL per line, without the protocol.'
    },
    {
      value: 'wildcard',
      label: 'Wildcard',
      noun: 'wildcard expression',
      description: 'Everything that matches a pattern, where an asterisk matches any path.',
      placeholder: 'www.example.com/images/*',
      helper: 'One expression per line. An asterisk matches any sequence of characters.'
    }
  ]
  const TIERED_CACHE_TYPES = ['cachekey']

  const form = reactive({ layer: 'cache', type: 'url', arguments: '' })
  const error = reactive<PurgeError>({ type: 'required', message: '' })

  const tiered = computed(() => form.layer === 'tiered_cache')
  const typeAllowed = (value: string) => !tiered.value || TIERED_CACHE_TYPES.includes(value)

  watch(tiered, () => {
    if (!typeAllowed(form.type)) form.type = TIERED_CACHE_TYPES[0]
  })

  watch(
    () => [form.type, form.arguments],
    () => {
      error.message = ''
    }
  )

  const selectedType = computed(() => types.find((type) => type.value === form.type) ?? types[1])
  const entries = computed(() =>
    form.arguments
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  )

  const guidance = computed(() => error.message || selectedType.value.helper)

  const lineIssue = (line: string, index: number) => {
    const at = entries.value.length > 1 ? 'Line ' + (index + 1) : 'The argument'
    if (/^https?:\/\//i.test(line)) return at + ' starts with a protocol. Remove it.'
    if (form.type === 'wildcard' && !line.includes('*'))
      return at + ' has no asterisk. Select URL to purge an exact address.'
    if (form.type === 'url' && line.includes('*'))
      return at + ' contains an asterisk. Select Wildcard to purge a pattern.'
    return ''
  }

  const validate = () => {
    if (!entries.value.length) {
      error.type = 'required'
      error.message = 'This field is required.'
      return false
    }
    const issue = entries.value.map(lineIssue).find(Boolean)
    if (issue) {
      error.type = 'invalid'
      error.message = issue
      return false
    }
    return true
  }

  const submitting = ref(false)

  const guard = useUnsavedChanges(() => form, {
    enabled: () => !submitting.value
  })
  const discardDialog = guard.dialogProps
  const discardLabels = guard.labels

  const onLeave = () => guard.confirmLeave()

  useEscapeToCancel(onLeave)
  const SAVE_FAILURES = 0
  let failuresLeft = SAVE_FAILURES

  const sendRequest = () =>
    new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (failuresLeft > 0) {
          failuresLeft -= 1
          reject(new Error('The service did not answer. Check your connection and try again.'))
          return
        }
        resolve()
      }, 900)
    })

  const submit = async () => {
    if (submitting.value || !validate()) return
    submitting.value = true
    try {
      await sendRequest()
      toast.success(
        `Purge started for ${entries.value.length} ${entries.value.length === 1 ? 'entry' : 'entries'}.`
      )
    } catch (error) {
      toast.error('Could not start the purge.', {
        description: error instanceof Error ? error.message : 'Try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <AppHeader aria-label="Console">
      <AppHeader.Start>
        <IconButton
          icon="az az-chevron-left"
          aria-label="Back to Cache"
          variant="outline"
          size="small"
          @click="onLeave"
        />
        <AppHeader.Brand
          href="/home"
          aria-label="Azion home"
        >
          <Brand
            variant="default"
            size="small"
          />
        </AppHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </AppHeader.Start>
      <AppHeader.Center />
      <AppHeader.End>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            variant="square"
          />
        </button>
      </AppHeader.End>
    </AppHeader>

    <main class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col">
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-labelledby="create-purge-title"
        novalidate
        @submit.prevent="submit"
      >
        <div class="flex min-h-0 flex-1 flex-col overflow-auto">
          <div
            class="layout-column-form layout-boundary-inline flex flex-1 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeader
              title="Create Purge"
              description="Evict cached objects from every location. Each one is fetched from your origin again on its next request."
              size="small"
              title-id="create-purge-title"
            />

            <fieldset
              :disabled="submitting"
              class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
            >
              <legend class="sr-only">Create Purge</legend>

              <SettingsGroup
                label="Target"
                hint="Where the objects are evicted from, and how this purge identifies them."
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        title="Layer"
                        description="The cache layer the objects are evicted from."
                        variant="stacked"
                      >
                        <RadioGroup
                          v-model="form.layer"
                          variant="card"
                          class="w-full"
                          name="purge-layer"
                          aria-label="Layer"
                        >
                          <RadioGroup.Item
                            v-for="option in layers"
                            :key="option.value"
                            :value="option.value"
                            :description="option.description"
                            >{{ option.label }}</RadioGroup.Item
                          >
                        </RadioGroup>
                      </SettingsRow>
                      <SettingsRow
                        title="Purge type"
                        description="How the arguments below identify the objects."
                        variant="stacked"
                      >
                        <RadioGroup
                          v-model="form.type"
                          variant="card"
                          class="w-full"
                          name="purge-type"
                          aria-label="Purge type"
                        >
                          <RadioGroup.Item
                            v-for="option in types"
                            :key="option.value"
                            :value="option.value"
                            :description="
                              typeAllowed(option.value)
                                ? option.description
                                : option.description + ' Tiered Cache purges by cache key only.'
                            "
                            :disabled="!typeAllowed(option.value)"
                            >{{ option.label }}</RadioGroup.Item
                          >
                        </RadioGroup>
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>
              </SettingsGroup>

              <SettingsGroup
                label="Arguments"
                :hint="'The ' + selectedType.noun + 's to purge, one per line.'"
              >
                <Card :padded="false">
                  <template #default>
                    <Item.List>
                      <SettingsRow
                        title="List"
                        :description="selectedType.description"
                        variant="stacked"
                      >
                        <template #title> {{ selectedType.label }} List </template>
                        <Textarea
                          monospace
                          v-model="form.arguments"
                          class="w-full"
                          :rows="6"
                          :aria-label="selectedType.label + ' list'"
                          :placeholder="selectedType.placeholder"
                          required
                          :invalid="!!error.message"
                          aria-describedby="create-purge-arguments-message"
                          :spellcheck="false"
                          autocomplete="off"
                        />

                        <FieldDescription id="create-purge-arguments-message">{{
                          guidance
                        }}</FieldDescription>
                      </SettingsRow>
                    </Item.List>
                  </template>
                </Card>

                <Alert
                  severity="warning"
                  size="small"
                  label="A purge cannot be undone. A broad one briefly raises the traffic that reaches your origin, while the cache fills again."
                />
              </SettingsGroup>
            </fieldset>
          </div>
          <SaveBar variant="centered">
            <template #actions>
              <Button
                type="button"
                label="Cancel"
                variant="outline"
                size="medium"
                @click="onLeave"
              />
              <Button
                label="Purge"
                variant="primary"
                size="medium"
                type="submit"
                :loading="submitting"
              />
            </template>
          </SaveBar>
        </div>
      </form>
    </main>
    <ConfirmDialog
      v-bind="discardDialog"
      data-testid="unsaved-changes-dialog"
    >
      <template #actions>
        <Button
          :label="discardLabels.keepEditing"
          variant="ghost"
          size="medium"
          data-autofocus
          @click="guard.keepEditing"
        />
        <Button
          :label="discardLabels.discard"
          variant="danger"
          size="medium"
          @click="guard.discardAndLeave"
        />
      </template>
    </ConfirmDialog>
  </div>
</template>
