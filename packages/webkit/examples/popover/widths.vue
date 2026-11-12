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
  <div class="flex flex-wrap items-center gap-(--spacing-xxl) p-(--spacing-xxl)">
    <PopoverRoot
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
    </PopoverRoot>

    <PopoverRoot
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
    </PopoverRoot>

    <PopoverRoot
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
    </PopoverRoot>
  </div>
</template>
