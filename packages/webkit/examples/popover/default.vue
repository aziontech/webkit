<script setup>
  import Popover, {
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverDescription,
    PopoverClose,
    PopoverFooter
  } from '@aziontech/webkit/popover'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <Button
        kind="secondary"
        label="Open popover"
      />
    </PopoverTrigger>

    <PopoverContent>
      <PopoverHeader>
        <PopoverTitle>Popover title</PopoverTitle>
        <PopoverClose />
      </PopoverHeader>

      <div class="p-(--spacing-md) text-body-sm text-(--text-default)">
        This content is rendered inside the popover panel.
      </div>
    </PopoverContent>
  </Popover>
</template>
