<script setup>
  import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'
  import FieldText from '@aziontech/webkit/field-text'
</script>

<template>
  <div class="flex flex-col gap-4 w-[480px]">
    <div class="grid grid-cols-2 gap-4">
      <FieldText
        label="Company"
        size="small"
      />
      <FieldPhoneNumber
        label="Phone"
        size="small"
      />
    </div>
    <div class="grid grid-cols-2 gap-4">
      <FieldText
        label="Company"
        size="medium"
      />
      <FieldPhoneNumber
        label="Phone"
        size="medium"
      />
    </div>
    <div class="grid grid-cols-2 gap-4">
      <FieldText
        label="Company"
        size="large"
      />
      <FieldPhoneNumber
        label="Phone"
        size="large"
      />
    </div>
  </div>
</template>
