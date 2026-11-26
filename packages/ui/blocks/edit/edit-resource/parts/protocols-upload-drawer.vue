<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import DrawerContent from '@aziontech/ui/drawer-content'
  import DrawerDescription from '@aziontech/ui/drawer-description'
  import Drawer from '@aziontech/ui/drawer-root'
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import Field from '@aziontech/ui/field'
  import FieldError from '@aziontech/ui/field-error'
  import Input from '@aziontech/ui/input'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import Textarea from '@aziontech/ui/textarea'
  import { reactive } from 'vue'

  import type { FieldProblems } from '../use-deploy-on-save'

  const emit = defineEmits<{
    added: [value: string]
  }>()

  const uploadOpen = defineModel<boolean>('open', { default: false })

  const upload = reactive({ name: '', pem: '' })
  const uploadErrors = reactive<FieldProblems>({})

  const nameProblem = (name: string) =>
    name
      ? { type: 'invalid' as const, message: 'Use lowercase letters, numbers and hyphens only.' }
      : { type: 'required' as const, message: 'Enter a name for the certificate.' }
  const pemProblem = (pem: string) =>
    pem
      ? {
          type: 'invalid' as const,
          message: 'Paste a PEM certificate, starting with BEGIN CERTIFICATE.'
        }
      : { type: 'required' as const, message: 'Paste the CA certificate.' }

  const submitUpload = () => {
    Object.keys(uploadErrors).forEach((key) => delete uploadErrors[key])
    if (!/^[a-z0-9-]+$/.test(upload.name.trim()))
      uploadErrors.name = nameProblem(upload.name.trim())
    if (!upload.pem.includes('BEGIN CERTIFICATE')) uploadErrors.pem = pemProblem(upload.pem.trim())
    if (Object.keys(uploadErrors).length) return
    emit('added', upload.name.trim())
    upload.name = ''
    upload.pem = ''
    uploadOpen.value = false
  }
</script>

<template>
  <Drawer
    v-model:open="uploadOpen"
    side="end"
    size="large"
  >
    <DrawerContent>
      <form
        class="flex h-full min-h-0 flex-col"
        novalidate
        @submit.prevent="submitUpload"
      >
        <PanelHeader class="w-full">
          <DrawerTitle>Upload certificate</DrawerTitle>
        </PanelHeader>
        <PanelBody>
          <div class="flex flex-col gap-(--spacing-md)">
            <DrawerDescription>
              A trusted CA certificate in PEM format. It is added to the account and picked for this
              workload.
            </DrawerDescription>
            <Field>
              <Field.Label for="protocols-upload-name">
                <span class="text-label-md">Name</span>
              </Field.Label>
              <Input
                id="protocols-upload-name"
                v-model="upload.name"
                size="large"
                class="w-full"
                placeholder="partners-ca"
                autocomplete="off"
                required
                :invalid="!!uploadErrors.name"
                :aria-describedby="uploadErrors.name ? 'protocols-upload-name-message' : undefined"
              />
              <FieldError
                v-if="uploadErrors.name"
                id="protocols-upload-name-message"
                >{{ uploadErrors.name.message }}</FieldError
              >
            </Field>
            <Field>
              <Field.Label for="protocols-upload-pem">
                <span class="text-label-md">Certificate</span>
              </Field.Label>
              <Textarea
                id="protocols-upload-pem"
                v-model="upload.pem"
                class="w-full"
                :rows="8"
                placeholder="-----BEGIN CERTIFICATE-----"
                required
                :invalid="!!uploadErrors.pem"
                :aria-describedby="uploadErrors.pem ? 'protocols-upload-pem-message' : undefined"
              />
              <FieldError
                v-if="uploadErrors.pem"
                id="protocols-upload-pem-message"
                >{{ uploadErrors.pem.message }}</FieldError
              >
            </Field>
          </div>
        </PanelBody>
        <PanelFooter>
          <div class="flex w-full justify-end gap-(--spacing-xs)">
            <Button
              type="button"
              label="Cancel"
              variant="outline"
              @click="uploadOpen = false"
            />
            <Button
              type="submit"
              label="Upload"
              variant="primary"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
