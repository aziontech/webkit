<script setup>
  import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'
</script>

<template>
  <div class="flex flex-col gap-4 w-[360px]">
    <FieldPhoneNumber
      label="BR mobile"
      model-value="11999999999"
      country="BR"
    />
    <FieldPhoneNumber
      label="BR landline"
      model-value="1133334444"
      country="BR"
    />
    <FieldPhoneNumber
      label="US phone"
      model-value="5555550123"
      country="US"
    />
    <FieldPhoneNumber
      label="UK phone"
      model-value="7911123456"
      country="GB"
    />
  </div>
</template>
