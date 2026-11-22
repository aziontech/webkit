<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import Field from '@aziontech/webkit/field'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PasswordInput from '@aziontech/webkit/password-input'
  import { computed, ref } from 'vue'

  import type { PersonalTokensSecret } from '../account-personal-tokens.vue'

  const secretModel = defineModel<PersonalTokensSecret | null>('secret', { required: true })

  const revealOpen = computed(() => secretModel.value !== null)
  const revealed = computed(() => secretModel.value ?? { name: '', secret: '' })

  const copied = ref(false)
  const onCopied = () => {
    copied.value = true
  }
  const closeReveal = () => {
    secretModel.value = null
    copied.value = false
  }
</script>

<template>
  <Dialog
    :open="revealOpen"
    size="medium"
    :dismissible="false"
    :closable="false"
    @update:open="(open) => !open && closeReveal()"
  >
    <DialogContent>
      <PanelHeader class="w-full">
        <DialogTitle>Copy your new token</DialogTitle>
      </PanelHeader>
      <PanelBody>
        <div class="flex flex-col gap-(--spacing-md)">
          <DialogDescription>
            “{{ revealed.name }}” is ready. This is the only time the token is shown.
          </DialogDescription>
          <Alert
            severity="warning"
            size="small"
            label="Copy the token and store it somewhere safe, such as a secret manager. After you close this dialog, it cannot be shown again; create a new one if it is lost."
          />
          <Field>
            <Field.Label for="token-secret">Token</Field.Label>
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <div class="min-w-0 grow">
                <PasswordInput
                  id="token-secret"
                  :model-value="revealed.secret"
                  readonly
                  autocomplete="off"
                  class="w-full"
                />
              </div>
              <CopyButton
                :value="revealed.secret"
                variant="outline"
                size="large"
                aria-label="Copy token"
                copied-label="Token copied"
                @copy="onCopied"
              />
            </div>
            <p
              v-if="copied"
              class="text-body-xs text-(--text-muted)"
              aria-hidden="true"
            >
              Copied to the clipboard.
            </p>
          </Field>
        </div>
      </PanelBody>
      <PanelFooter>
        <div class="flex w-full justify-end">
          <Button
            :label="copied ? 'Done' : 'I copied the token'"
            variant="primary"
            size="medium"
            @click="closeReveal"
          />
        </div>
      </PanelFooter>
    </DialogContent>
  </Dialog>
</template>
