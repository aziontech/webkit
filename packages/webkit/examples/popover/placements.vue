<script setup>
  import Button from '@aziontech/webkit/button'
  import PopoverClose from '@aziontech/webkit/popover-close'
  import PopoverContent from '@aziontech/webkit/popover-content'
  import PopoverHeader from '@aziontech/webkit/popover-header'
  import PopoverRoot from '@aziontech/webkit/popover-root'
  import PopoverTitle from '@aziontech/webkit/popover-title'
  import PopoverTrigger from '@aziontech/webkit/popover-trigger'
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

    <PopoverRoot placement="right-start">
      <PopoverTrigger>
        <Button
          kind="secondary"
          label="right-start"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>right-start</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
      </PopoverContent>
    </PopoverRoot>

    <PopoverRoot placement="left-start">
      <PopoverTrigger>
        <Button
          kind="secondary"
          label="left-start"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>left-start</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
      </PopoverContent>
    </PopoverRoot>
  </div>
</template>
