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
  <div
    class="grid grid-cols-2 gap-(--spacing-2xl) place-items-center min-h-[24rem] p-(--spacing-2xl)"
  >
    <PopoverRoot
      side="bottom"
      align="start"
    >
      <PopoverTrigger>
        <Button
          variant="secondary"
          label="bottom · start"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>bottom · start</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
      </PopoverContent>
    </PopoverRoot>

    <PopoverRoot
      side="bottom"
      align="end"
    >
      <PopoverTrigger>
        <Button
          variant="secondary"
          label="bottom · end"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>bottom · end</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
      </PopoverContent>
    </PopoverRoot>

    <PopoverRoot
      side="top"
      align="start"
    >
      <PopoverTrigger>
        <Button
          variant="secondary"
          label="top · start"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>top · start</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
      </PopoverContent>
    </PopoverRoot>

    <PopoverRoot
      side="top"
      align="end"
    >
      <PopoverTrigger>
        <Button
          variant="secondary"
          label="top · end"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>top · end</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
      </PopoverContent>
    </PopoverRoot>

    <PopoverRoot
      side="end"
      align="start"
    >
      <PopoverTrigger>
        <Button
          variant="secondary"
          label="end · start"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>end · start</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
      </PopoverContent>
    </PopoverRoot>

    <PopoverRoot
      side="start"
      align="start"
    >
      <PopoverTrigger>
        <Button
          variant="secondary"
          label="start · start"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>start · start</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
      </PopoverContent>
    </PopoverRoot>
  </div>
</template>
