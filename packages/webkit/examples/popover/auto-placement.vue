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
  <div class="relative h-[30rem] w-full border border-dashed border-(--border-muted)">
    <p
      class="absolute top-(--spacing-md) left-1/2 -translate-x-1/2 text-body-sm text-(--text-muted) text-center max-w-md"
    >
      All triggers use placement="auto". Each panel resolves to the best-fitting corner based on its
      position in the viewport.
    </p>

    <div class="absolute top-(--spacing-md) start-(--spacing-md)">
      <PopoverRoot
        :open="true"
        placement="auto"
      >
        <PopoverTrigger>
          <Button
            kind="secondary"
            label="top-left"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Popover</PopoverTitle>
            <PopoverClose />
          </PopoverHeader>
          <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
        </PopoverContent>
      </PopoverRoot>
    </div>

    <div class="absolute top-(--spacing-md) end-(--spacing-md)">
      <PopoverRoot
        :open="true"
        placement="auto"
      >
        <PopoverTrigger>
          <Button
            kind="secondary"
            label="top-right"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Popover</PopoverTitle>
            <PopoverClose />
          </PopoverHeader>
          <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
        </PopoverContent>
      </PopoverRoot>
    </div>

    <div class="absolute bottom-(--spacing-md) start-(--spacing-md)">
      <PopoverRoot
        :open="true"
        placement="auto"
      >
        <PopoverTrigger>
          <Button
            kind="secondary"
            label="bottom-left"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Popover</PopoverTitle>
            <PopoverClose />
          </PopoverHeader>
          <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
        </PopoverContent>
      </PopoverRoot>
    </div>

    <div class="absolute bottom-(--spacing-md) end-(--spacing-md)">
      <PopoverRoot
        :open="true"
        placement="auto"
      >
        <PopoverTrigger>
          <Button
            kind="secondary"
            label="bottom-right"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Popover</PopoverTitle>
            <PopoverClose />
          </PopoverHeader>
          <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Popover content.</div>
        </PopoverContent>
      </PopoverRoot>
    </div>
  </div>
</template>
