<script setup>
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Button
    label="Delete application"
    variant="danger"
    disabled
    disabled-reason="Only an account owner can delete an application."
  />
</template>
