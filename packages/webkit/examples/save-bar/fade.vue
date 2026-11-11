<script setup>
  import Button from '@aziontech/webkit/button'
  import SaveBar from '@aziontech/webkit/save-bar'
</script>

<template>
  <SaveBar kind="fade">
    <template #leading>
      <Button
        type="button"
        label="Back"
        kind="outlined"
        size="medium"
      />
    </template>
    <template #actions>
      <Button
        label="Continue"
        kind="primary"
        size="medium"
      />
    </template>
  </SaveBar>
</template>
