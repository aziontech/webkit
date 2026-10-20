<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Dialog from '@aziontech/webkit/dialog'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import FieldTextarea from '@aziontech/webkit/field-textarea'
  import Message from '@aziontech/webkit/message'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref } from 'vue'

  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'

  const PURGE_TYPES = [
    {
      value: 'url',
      label: 'URL',
      description: 'Purge specific addresses, one per line.',
      placeholder: 'www.example.com/index.html\nwww.example.com/style.css',
      hint: 'One full URL per line, without the protocol.'
    },
    {
      value: 'cache-key',
      label: 'Cache key',
      description: 'Purge by the key the edge stored the object under.',
      placeholder: 'https://www.example.com/@@ptr_ver=1\nhttps://www.example.com/img@@cookie=abc',
      hint: 'One cache key per line, including any @@ variations.'
    },
    {
      value: 'wildcard',
      label: 'Wildcard',
      description: 'Purge everything matching a pattern. One expression only.',
      placeholder: 'www.example.com/images/*',
      hint: 'A single expression that cannot be undone or narrowed after the purge runs.'
    }
  ]

  const type = ref('url')
  const args = ref('')
  const confirming = ref(false)
  const purging = ref(false)

  const selected = computed(() => PURGE_TYPES.find((entry) => entry.value === type.value))

  const entries = computed(() =>
    args.value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  )

  const canPurge = computed(() => entries.value.length > 0)

  const summary = computed(() => {
    const count = entries.value.length
    const noun = selected.value.label.toLowerCase()
    return count === 1 ? `1 ${noun}` : `${count} ${noun}s`
  })

  const run = async () => {
    purging.value = true
    await new Promise((resolve) => globalThis.setTimeout(resolve, 900))
    purging.value = false
    confirming.value = false
    const purged = summary.value
    args.value = ''
    toast.success(`Purge requested for ${purged}.`, {
      description: 'Objects are evicted from every edge location within seconds.'
    })
  }
</script>

<template>
  <AppLayout
    active="real-time-purge"
    :breadcrumb="[{ label: 'Real-Time Purge' }]"
    :padded="false"
  >
    <div class="flex min-h-full min-w-0 flex-col">
      <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
        <PageHeading
          title="Real-Time Purge"
          description="Evict cached objects from every edge location. Purged content is fetched from your connector on the next request."
        />

        <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
          <Message
            severity="warning"
            size="small"
            label="A purge cannot be undone. Every purged object is re-fetched from your connector on its next request, so a broad purge briefly raises origin traffic."
          />

          <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
            <CardBox>
              <template #content>
                <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                  <fieldset class="flex min-w-0 flex-col gap-(--spacing-sm)">
                    <legend class="text-label-md text-(--text-default)">Purge type</legend>
                    <div class="grid grid-cols-1 gap-(--spacing-xs) md:grid-cols-3">
                      <FieldRadioBlock
                        v-for="entry in PURGE_TYPES"
                        :key="entry.value"
                        v-model="type"
                        name="purge-type"
                        :value="entry.value"
                        :label="entry.label"
                        :description="entry.description"
                      />
                    </div>
                  </fieldset>

                  <FieldTextarea
                    :key="type"
                    v-model="args"
                    :label="`${selected.label} list`"
                    :placeholder="selected.placeholder"
                    :hint="selected.hint"
                    :rows="8"
                  />
                </div>
              </template>
            </CardBox>
          </section>
        </section>
      </div>

      <footer
        class="sticky bottom-0 z-10 border-t border-(--border-default) bg-(--bg-canvas) py-(--spacing-sm)"
      >
        <div class="layout-column-form layout-boundary-inline flex items-center justify-end">
          <Button
            label="Purge"
            kind="primary"
            severity="danger"
            size="large"
            icon="pi pi-trash"
            :disabled="!canPurge"
            @click="confirming = true"
          />
        </div>
      </footer>
    </div>

    <Dialog
      v-model:open="confirming"
      title="Purge cached content?"
      :description="`This purges ${summary} from every edge location. It cannot be undone, and the objects are re-fetched from your connector on their next request.`"
    >
      <template #footer>
        <Button
          label="Cancel"
          kind="outlined"
          size="large"
          :disabled="purging"
          @click="confirming = false"
        />
        <Button
          label="Purge"
          kind="primary"
          severity="danger"
          size="large"
          :loading="purging"
          @click="run"
        />
      </template>
    </Dialog>
  </AppLayout>
</template>
