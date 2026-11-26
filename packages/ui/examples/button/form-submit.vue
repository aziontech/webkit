<script setup>
  import Button from '@aziontech/ui/button'
  import Field from '@aziontech/ui/field'
  import Input from '@aziontech/ui/input'
</script>

<template>
  <form
    class="flex w-(--container-2xs) flex-col gap-(--spacing-md)"
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
    <div class="flex gap-(--spacing-xs)">
      <Button
        type="reset"
        label="Clear"
        variant="outline"
        size="medium"
      />
      <Button
        type="submit"
        label="Create"
        variant="primary"
        size="medium"
      />
    </div>
  </form>
</template>
