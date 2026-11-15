<script setup>
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <Button
        variant="primary"
        label="Button"
        icon="ai ai-arrow-right"
      />
      <Button
        variant="secondary"
        label="Button"
        icon="ai ai-arrow-right"
      />
      <Button
        variant="outline"
        label="Button"
        icon="ai ai-arrow-right"
      />
      <Button
        variant="ghost"
        label="Button"
        icon="ai ai-arrow-right"
      />
      <Button
        variant="danger"
        label="Button"
        icon="ai ai-trash"
      />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <Button
        variant="primary"
        label="Read the guide"
        icon="ai ai-chevron-right"
        icon-position="trailing"
      />
      <Button
        variant="secondary"
        label="Read the guide"
        icon="ai ai-chevron-right"
        icon-position="trailing"
      />
      <Button
        variant="outline"
        label="Read the guide"
        icon="ai ai-chevron-right"
        icon-position="trailing"
      />
      <Button
        variant="ghost"
        label="Read the guide"
        icon="ai ai-chevron-right"
        icon-position="trailing"
      />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <Button
        variant="primary"
        label="Read the guide"
        icon="ai ai-chevron-right"
        icon-position="trailing"
        animated
      />
      <Button
        variant="secondary"
        label="Read the guide"
        icon="ai ai-chevron-right"
        icon-position="trailing"
        animated
      />
      <Button
        variant="outline"
        label="Read the guide"
        icon="ai ai-chevron-right"
        icon-position="trailing"
        animated
      />
      <Button
        variant="ghost"
        label="Read the guide"
        icon="ai ai-chevron-right"
        icon-position="trailing"
        animated
      />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <Button
        variant="outline"
        size="medium"
        label="Deploy now"
        icon="ai ai-chevron-right"
        icon-position="trailing"
        animated
        #prefix
      >
        <i
          class="ai ai-azion text-(--primary)"
          aria-hidden="true"
        />
      </Button>
    </div>
  </div>
</template>
