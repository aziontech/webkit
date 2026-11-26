<script setup>
  import Button from '@aziontech/ui/button'
  import PopoverClose from '@aziontech/ui/popover-close'
  import PopoverContent from '@aziontech/ui/popover-content'
  import PopoverHeader from '@aziontech/ui/popover-header'
  import PopoverRoot from '@aziontech/ui/popover-root'
  import PopoverTitle from '@aziontech/ui/popover-title'
  import PopoverTrigger from '@aziontech/ui/popover-trigger'
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger>
      <Button
        variant="secondary"
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
  </PopoverRoot>
</template>
