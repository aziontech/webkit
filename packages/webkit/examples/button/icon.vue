<script setup>
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <Button
        kind="primary"
        label="Button"
        icon="ai ai-arrow-right"
      />
      <Button
        kind="secondary"
        label="Button"
        icon="ai ai-arrow-right"
      />
      <Button
        kind="outlined"
        label="Button"
        icon="ai ai-arrow-right"
      />
      <Button
        kind="transparent"
        label="Button"
        icon="ai ai-arrow-right"
      />
      <Button
        kind="danger"
        label="Button"
        icon="ai ai-trash"
      />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <Button
        kind="primary"
        label="Read the guide"
        icon="ai ai-chevron-right"
        icon-position="trailing"
      />
      <Button
        kind="secondary"
        label="Read the guide"
        icon="ai ai-chevron-right"
        icon-position="trailing"
      />
      <Button
        kind="outlined"
        label="Read the guide"
        icon="ai ai-chevron-right"
        icon-position="trailing"
      />
      <Button
        kind="transparent"
        label="Read the guide"
        icon="ai ai-chevron-right"
        icon-position="trailing"
      />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <Button
        kind="primary"
        label="Read the guide"
        icon="ai ai-chevron-right"
        icon-position="trailing"
        animated
      />
      <Button
        kind="secondary"
        label="Read the guide"
        icon="ai ai-chevron-right"
        icon-position="trailing"
        animated
      />
      <Button
        kind="outlined"
        label="Read the guide"
        icon="ai ai-chevron-right"
        icon-position="trailing"
        animated
      />
      <Button
        kind="transparent"
        label="Read the guide"
        icon="ai ai-chevron-right"
        icon-position="trailing"
        animated
      />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <Button
        kind="outlined"
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
