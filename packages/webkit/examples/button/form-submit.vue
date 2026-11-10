<script setup>
  import Button from '@aziontech/webkit/button'
  import FieldText from '@aziontech/webkit/field-text'
</script>

<template>
  <form
    class="flex w-80 flex-col gap-4"
    novalidate
    @submit.prevent
  >
    <FieldText
      label="Workspace name"
      input-id="button-form-name"
      name="name"
    />
    <div class="flex gap-2">
      <Button
        type="reset"
        label="Clear"
        kind="outlined"
        size="medium"
      />
      <Button
        type="submit"
        label="Create"
        kind="primary"
        size="medium"
      />
    </div>
  </form>
</template>
