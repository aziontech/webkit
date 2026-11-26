<script setup>
  import Button from '@aziontech/webkit/button'
  import Dialog from '@aziontech/webkit/dialog'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import { ref } from 'vue'

  const open = ref(false)
  const name = ref('')
</script>

<template>
  <Dialog
    v-model:open="open"
    dismissible
    size="medium"
  >
    <Dialog.Trigger>
      <Button
        label="Rename application"
        variant="primary"
      />
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header class="w-full">
        <Dialog.Title>Rename application</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <div class="flex flex-col gap-(--spacing-md)">
          <Dialog.Description>
            The new name shows in the console and in the API. URLs and domains do not change.
          </Dialog.Description>
          <Field>
            <Field.Label>Name</Field.Label>
            <Input
              v-model="name"
              name="name"
              autocomplete="off"
            />
          </Field>
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
          <Button
            label="Cancel"
            variant="outline"
            @click="open = false"
          />
          <Button
            label="Rename"
            variant="primary"
            @click="open = false"
          />
        </div>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog>
</template>
