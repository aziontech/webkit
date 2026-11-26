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
  <div class="flex flex-wrap items-center gap-(--spacing-2xl) p-(--spacing-2xl)">
    <PopoverRoot
      side="bottom"
      align="start"
      size="small"
    >
      <PopoverTrigger>
        <Button
          variant="secondary"
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
    </PopoverRoot>

    <PopoverRoot
      side="bottom"
      align="start"
      size="medium"
    >
      <PopoverTrigger>
        <Button
          variant="secondary"
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
    </PopoverRoot>

    <PopoverRoot
      side="bottom"
      align="start"
      size="large"
    >
      <PopoverTrigger>
        <Button
          variant="secondary"
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
    </PopoverRoot>
  </div>
</template>
