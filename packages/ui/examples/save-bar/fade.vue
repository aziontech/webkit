<script setup>
  import Button from '@aziontech/ui/button'
  import SaveBar from '@aziontech/ui/save-bar'
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
