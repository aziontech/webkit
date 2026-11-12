<script setup>
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
</script>

<template>
  <form
    class="flex w-80 flex-col gap-4"
    novalidate
    @submit.prevent
  >
    <Field>
      <Field.Label for="button-form-name"> Workspace name </Field.Label>
      <Input
        name="name"
        id="button-form-name"
      />
    </Field>
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
