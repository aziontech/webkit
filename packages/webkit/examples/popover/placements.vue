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
  <div
    class="grid grid-cols-2 gap-(--spacing-xxl) place-items-center min-h-[24rem] p-(--spacing-xxl)"
  >
    <Popover placement="bottom-start">
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
    </Popover>

    <Popover placement="bottom-end">
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
    </Popover>

    <Popover placement="top-start">
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
    </Popover>

    <Popover placement="top-end">
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
    </Popover>
  </div>
</template>
