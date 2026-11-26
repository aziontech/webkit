<script setup>
  import Button from '@aziontech/webkit/button'
  import SaveBar from '@aziontech/webkit/save-bar'
</script>

<template>
  <SaveBar variant="fade">
    <template #leading>
      <Button
        type="button"
        label="Back"
        variant="outline"
        size="medium"
      />
    </template>
    <template #actions>
      <Button
        label="Continue"
        variant="primary"
        size="medium"
      />
    </template>
  </SaveBar>
</template>
