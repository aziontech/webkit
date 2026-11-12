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
  <div
    class="grid grid-cols-2 gap-(--spacing-xxl) place-items-center min-h-[24rem] p-(--spacing-xxl)"
  >
    <PopoverRoot placement="bottom-start">
      <PopoverTrigger>
        <Button
          kind="secondary"
          label="bottom-start"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>bottom-start</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
      </PopoverContent>
    </PopoverRoot>

    <PopoverRoot placement="bottom-end">
      <PopoverTrigger>
        <Button
          kind="secondary"
          label="bottom-end"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>bottom-end</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
      </PopoverContent>
    </PopoverRoot>

    <PopoverRoot placement="top-start">
      <PopoverTrigger>
        <Button
          kind="secondary"
          label="top-start"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>top-start</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
      </PopoverContent>
    </PopoverRoot>

    <PopoverRoot placement="top-end">
      <PopoverTrigger>
        <Button
          kind="secondary"
          label="top-end"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>top-end</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
      </PopoverContent>
    </PopoverRoot>
  </div>
</template>
