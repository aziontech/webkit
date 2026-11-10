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
  <div class="relative h-[30rem] w-full border border-dashed border-(--border-muted)">
    <p
      class="absolute top-(--spacing-md) left-1/2 -translate-x-1/2 text-body-sm text-(--text-muted) text-center max-w-md"
    >
      All triggers use placement="auto". Each panel resolves to the best-fitting corner based on its
      position in the viewport.
    </p>

    <div class="absolute top-(--spacing-md) left-(--spacing-md)">
      <Popover
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
      </Popover>
    </div>

    <div class="absolute top-(--spacing-md) right-(--spacing-md)">
      <Popover
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
      </Popover>
    </div>

    <div class="absolute bottom-(--spacing-md) left-(--spacing-md)">
      <Popover
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
      </Popover>
    </div>

    <div class="absolute bottom-(--spacing-md) right-(--spacing-md)">
      <Popover
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
      </Popover>
    </div>
  </div>
</template>
