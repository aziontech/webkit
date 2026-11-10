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
  <div class="flex items-center gap-(--spacing-xxl) p-(--spacing-xxl)">
    <Popover
      placement="bottom-start"
      width="small"
    >
      <PopoverTrigger>
        <Button
          kind="secondary"
          label="small"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>small</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">
          Panel width is var(--container-xs) (348px).
        </div>
      </PopoverContent>
    </Popover>

    <Popover
      placement="bottom-start"
      width="medium"
    >
      <PopoverTrigger>
        <Button
          kind="secondary"
          label="medium"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>medium</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">
          Panel width is var(--container-sm) (408px).
        </div>
      </PopoverContent>
    </Popover>

    <Popover
      placement="bottom-start"
      width="large"
    >
      <PopoverTrigger>
        <Button
          kind="secondary"
          label="large"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>large</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">
          Panel width is var(--container-md) (472px).
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>
