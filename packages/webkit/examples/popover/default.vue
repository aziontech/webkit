<script setup>
  import PopoverRoot from '@aziontech/webkit/popover-root'
  import PopoverTrigger from '@aziontech/webkit/popover-trigger'
  import PopoverContent from '@aziontech/webkit/popover-content'
  import PopoverHeader from '@aziontech/webkit/popover-header'
  import PopoverTitle from '@aziontech/webkit/popover-title'
  import PopoverDescription from '@aziontech/webkit/popover-description'
  import PopoverClose from '@aziontech/webkit/popover-close'
  import PopoverFooter from '@aziontech/webkit/popover-footer'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <PopoverRoot>
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
  </PopoverRoot>
</template>
