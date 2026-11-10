<script setup>
  import { ref } from 'vue'
  import FieldFileUpload from '@aziontech/webkit/field-file-upload'

  const files = ref([])
  const invalid = ref(false)
  const helperText = ref('PNG or JPG, up to 2 MB.')

  function onReject(event, rejected) {
    invalid.value = true
    helperText.value = `${rejected[0].name} is not a PNG or JPG under 2 MB.`
  }
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <FieldFileUpload
      v-model="files"
      label="Logo"
      accept=".png,.jpg,image/png,image/jpeg"
      :max-size="2 * 1024 * 1024"
      :helper-text="helperText"
      :invalid="invalid"
      @reject="onReject"
    />
  </div>
</template>
