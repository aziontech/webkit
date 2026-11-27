<script setup>
  import Button from '@aziontech/ui/button'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <div class="flex flex-wrap items-center gap-(--spacing-md)">
      <Button
        variant="primary"
        label="Continue"
        icon="az az-arrow-right"
      />
      <Button
        variant="secondary"
        label="Continue"
        icon="az az-arrow-right"
      />
      <Button
        variant="outline"
        label="Continue"
        icon="az az-arrow-right"
      />
      <Button
        variant="ghost"
        label="Continue"
        icon="az az-arrow-right"
      />
      <Button
        variant="danger"
        label="Delete"
        icon="az az-trash"
      />
    </div>
    <div class="flex flex-wrap items-center gap-(--spacing-md)">
      <Button
        variant="primary"
        label="Read the guide"
        icon="az az-chevron-right"
        icon-position="trailing"
      />
      <Button
        variant="secondary"
        label="Read the guide"
        icon="az az-chevron-right"
        icon-position="trailing"
      />
      <Button
        variant="outline"
        label="Read the guide"
        icon="az az-chevron-right"
        icon-position="trailing"
      />
      <Button
        variant="ghost"
        label="Read the guide"
        icon="az az-chevron-right"
        icon-position="trailing"
      />
    </div>
    <div class="flex flex-wrap items-center gap-(--spacing-md)">
      <Button
        variant="primary"
        label="Start free trial"
        icon="az az-chevron-right"
        icon-position="trailing"
        animated
      />
      <Button
        variant="outline"
        label="Talk to sales"
        icon="az az-chevron-right"
        icon-position="trailing"
        animated
      />
    </div>
    <div class="flex flex-wrap items-center gap-(--spacing-md)">
      <Button
        variant="outline"
        size="medium"
        label="Deploy now"
        icon="az az-chevron-right"
        icon-position="trailing"
        animated
        #leading
      >
        <i
          class="az az-azion text-(--primary)"
          aria-hidden="true"
        />
      </Button>
    </div>
  </div>
</template>
