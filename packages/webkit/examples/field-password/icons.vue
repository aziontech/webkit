<script setup>
  import FieldPassword from '@aziontech/webkit/field-password'
</script>

<template>
  <div class="flex flex-col gap-6 w-[320px]">
    <FieldPassword
      label="With leading icon"
      placeholder="Enter your password"
    >
      <template #iconLeft>
        <i class="pi pi-lock" />
      </template>
    </FieldPassword>
  </div>
</template>
