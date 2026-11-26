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
  <div class="relative h-[30rem] w-full border border-dashed border-(--border-muted)">
    <p
      class="absolute inset-x-(--spacing-md) top-1/2 mx-auto max-w-(--container-md) -translate-y-1/2 text-center text-body-sm text-(--text-muted)"
    >
      All triggers use side="auto". Click one: its panel opens on the side with the most room for
      its place in the viewport.
    </p>

    <div class="absolute top-(--spacing-md) start-(--spacing-md)">
      <PopoverRoot side="auto">
        <PopoverTrigger>
          <Button
            variant="secondary"
            label="Open at top start"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Popover</PopoverTitle>
            <PopoverClose />
          </PopoverHeader>
          <div class="p-(--spacing-md) text-body-sm text-(--text-default)">
            This panel opened on the side with the most room.
          </div>
        </PopoverContent>
      </PopoverRoot>
    </div>

    <div class="absolute top-(--spacing-md) end-(--spacing-md)">
      <PopoverRoot side="auto">
        <PopoverTrigger>
          <Button
            variant="secondary"
            label="Open at top end"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Popover</PopoverTitle>
            <PopoverClose />
          </PopoverHeader>
          <div class="p-(--spacing-md) text-body-sm text-(--text-default)">
            This panel opened on the side with the most room.
          </div>
        </PopoverContent>
      </PopoverRoot>
    </div>

    <div class="absolute bottom-(--spacing-md) start-(--spacing-md)">
      <PopoverRoot side="auto">
        <PopoverTrigger>
          <Button
            variant="secondary"
            label="Open at bottom start"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Popover</PopoverTitle>
            <PopoverClose />
          </PopoverHeader>
          <div class="p-(--spacing-md) text-body-sm text-(--text-default)">
            This panel opened on the side with the most room.
          </div>
        </PopoverContent>
      </PopoverRoot>
    </div>

    <div class="absolute bottom-(--spacing-md) end-(--spacing-md)">
      <PopoverRoot side="auto">
        <PopoverTrigger>
          <Button
            variant="secondary"
            label="Open at bottom end"
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Popover</PopoverTitle>
            <PopoverClose />
          </PopoverHeader>
          <div class="p-(--spacing-md) text-body-sm text-(--text-default)">
            This panel opened on the side with the most room.
          </div>
        </PopoverContent>
      </PopoverRoot>
    </div>
  </div>
</template>
