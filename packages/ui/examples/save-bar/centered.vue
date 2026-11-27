<script setup>
  import Button from '@aziontech/ui/button'
  import SaveBar from '@aziontech/ui/save-bar'
</script>

<template>
  <SaveBar variant="centered">
    <template #actions>
      <Button
        type="button"
        label="Cancel"
        variant="outline"
        size="medium"
      />
      <Button
        label="Create"
        variant="primary"
        size="medium"
      />
    </template>
  </SaveBar>
</template>
