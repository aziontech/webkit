<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import Field from '@aziontech/webkit/field'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed, nextTick, ref, watch } from 'vue'

  import type { WafTuningMatch } from '../view-waf-tuning.vue'

  const props = defineProps<{
    selected: WafTuningMatch[]
    pathCount: number
    allowing: boolean
    allowError: string
  }>()

  const emit = defineEmits<{
    allow: [event: Event, reason: string]
  }>()

  const open = defineModel<boolean>('open', { default: false })

  const allowFailed = ref(props.allowError !== '')
  const reason = ref('')
  const submitted = ref(false)
  const reasonMissing = computed(() => submitted.value && !reason.value.trim())
  const reasonFieldEl = ref<HTMLElement | null>(null)

  const allow = (event: Event) => {
    submitted.value = true
    if (props.allowing) return
    if (!reason.value.trim()) {
      nextTick(() => reasonFieldEl.value?.querySelector('textarea')?.focus())
      return
    }
    allowFailed.value = false
    emit('allow', event, reason.value.trim())
  }

  watch(open, (now) => {
    if (!now) return
    reason.value = ''
    submitted.value = false
    allowFailed.value = false
  })

  watch(
    () => props.allowError,
    (next) => {
      allowFailed.value = next !== ''
    }
  )

  watch(
    () => props.allowing,
    (now, before) => {
      if (before && !now && props.allowError) allowFailed.value = true
    }
  )
</script>

<template>
  <Dialog
    v-model:open="open"
    :dismissible="!allowing"
    :closable="!allowing"
    size="medium"
  >
    <DialogContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        novalidate
        aria-labelledby="waf-allow-title"
        @submit.prevent="allow"
      >
        <PanelHeader class="w-full">
          <DialogTitle id="waf-allow-title">
            Allow {{ selected.length }} {{ selected.length === 1 ? 'rule' : 'rules' }}
          </DialogTitle>
        </PanelHeader>
        <PanelBody>
          <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
            <Alert
              v-if="allowFailed"
              severity="danger"
              :label="allowError"
            />
            <DialogDescription>
              Requests these rules matched on their paths will no longer be blocked. One allowed
              rule is created for each rule and path:
              {{ pathCount }} in all.
            </DialogDescription>
            <ul class="m-0 flex list-none flex-col gap-(--spacing-2xs) p-0">
              <li
                v-for="row in selected"
                :key="row.ruleId"
                class="flex min-w-0 items-center gap-(--spacing-xs) text-body-sm text-(--text-muted)"
              >
                <span class="shrink-0 font-code text-(--text-default)">{{ row.ruleId }}</span>
                <span class="min-w-0 truncate"
                  >{{ row.threat }} on {{ row.paths.length }}
                  {{ row.paths.length === 1 ? 'path' : 'paths' }}</span
                >
              </li>
            </ul>
            <div ref="reasonFieldEl">
              <Field
                required
                :invalid="reasonMissing"
                :disabled="allowing"
              >
                <Field.Label>Reason</Field.Label>
                <Textarea
                  v-model="reason"
                  :rows="4"
                  placeholder="Search accepts quotes in free-text queries."
                />
                <Field.Description
                  >Kept with the allowed rules, so the next person knows why.</Field.Description
                >
                <Field.Error v-if="reasonMissing"
                  >Enter why these requests are legitimate.</Field.Error
                >
              </Field>
            </div>
          </div>
        </PanelBody>
        <PanelFooter
          ><div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                type="button"
                label="Cancel"
                variant="outline"
                :disabled="allowing"
                @click="open = false"
              />
            </div>
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                type="submit"
                :label="allowFailed ? 'Try again' : 'Allow rules'"
                variant="primary"
                :loading="allowing"
              />
            </div></div
        ></PanelFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
