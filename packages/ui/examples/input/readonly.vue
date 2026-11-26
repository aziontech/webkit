<script setup>
  import CopyButton from '@aziontech/ui/copy-button'
  import Input from '@aziontech/ui/input'
  import InputGroupRoot from '@aziontech/ui/input-group-root'
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
      <Input
        model-value="azion create edge-function"
        class="min-w-0 flex-1"
        aria-label="Create function command"
        :spellcheck="false"
        readonly
        monospace
      />
      <CopyButton
        value="azion create edge-function"
        aria-label="Copy the create function command"
        copied-label="Command copied"
        size="small"
      />
    </InputGroupRoot>
  </div>
</template>
