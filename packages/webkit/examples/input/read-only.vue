<script setup>
  import CopyButton from '@aziontech/webkit/copy-button'
  import Input from '@aziontech/webkit/input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
</script>

<template>
  <div class="flex w-full max-w-(--container-xs) flex-col gap-(--spacing-md)">
    <Input
      model-value="9757a"
      aria-label="Client ID"
      :spellcheck="false"
      readonly
      monospace
    />
    <InputGroupRoot class="w-full">
      <div class="flex min-w-0 flex-1">
        <Input
          model-value="azion create edge-function"
          size="large"
          class="w-full"
          aria-label="Create function command"
          :spellcheck="false"
          readonly
          monospace
        />
      </div>
      <CopyButton
        value="azion create edge-function"
        aria-label="Copy the create function command"
        copied-label="Command copied"
      />
    </InputGroupRoot>
  </div>
</template>
