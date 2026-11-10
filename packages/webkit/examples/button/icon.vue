<script setup>
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <Button
        kind="primary"
        label="Button"
        icon="pi pi-arrow-right"
      />
      <Button
        kind="secondary"
        label="Button"
        icon="pi pi-arrow-right"
      />
      <Button
        kind="outlined"
        label="Button"
        icon="pi pi-arrow-right"
      />
      <Button
        kind="text"
        label="Button"
        icon="pi pi-arrow-right"
      />
      <Button
        kind="danger"
        label="Button"
        icon="pi pi-trash"
      />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <Button
        kind="primary"
        label="Read the guide"
        icon="pi pi-chevron-right"
        icon-position="trailing"
      />
      <Button
        kind="secondary"
        label="Read the guide"
        icon="pi pi-chevron-right"
        icon-position="trailing"
      />
      <Button
        kind="outlined"
        label="Read the guide"
        icon="pi pi-chevron-right"
        icon-position="trailing"
      />
      <Button
        kind="text"
        label="Read the guide"
        icon="pi pi-chevron-right"
        icon-position="trailing"
      />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <Button
        kind="primary"
        label="Read the guide"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
      />
      <Button
        kind="secondary"
        label="Read the guide"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
      />
      <Button
        kind="outlined"
        label="Read the guide"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
      />
      <Button
        kind="text"
        label="Read the guide"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
      />
    </div>
    <div class="flex flex-wrap items-center gap-4">
      <Button
        kind="outlined"
        size="medium"
        label="Deploy now"
        icon="pi pi-chevron-right"
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
