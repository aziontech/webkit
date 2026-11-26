<script setup>
  import Button from '@aziontech/ui/button'
  import PopoverClose from '@aziontech/ui/popover-close'
  import PopoverContent from '@aziontech/ui/popover-content'
  import PopoverDescription from '@aziontech/ui/popover-description'
  import PopoverFooter from '@aziontech/ui/popover-footer'
  import PopoverHeader from '@aziontech/ui/popover-header'
  import PopoverRoot from '@aziontech/ui/popover-root'
  import PopoverTitle from '@aziontech/ui/popover-title'
  import PopoverTrigger from '@aziontech/ui/popover-trigger'
</script>

<template>
  <div class="flex flex-wrap items-start gap-(--spacing-2xl) p-(--spacing-2xl) min-h-[22rem]">
    <PopoverRoot
      side="bottom"
      align="start"
    >
      <PopoverTrigger>
        <Button
          variant="secondary"
          label="Full"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Popover title</PopoverTitle>
          <PopoverDescription>A short description of the popover.</PopoverDescription>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">
          Body content composed by the consumer.
        </div>
        <PopoverFooter>
          <Button
            variant="secondary"
            size="medium"
            label="Confirm"
          />
        </PopoverFooter>
      </PopoverContent>
    </PopoverRoot>

    <PopoverRoot
      side="bottom"
      align="start"
    >
      <PopoverTrigger>
        <Button
          variant="secondary"
          label="Title only"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Popover title</PopoverTitle>
          <PopoverClose />
        </PopoverHeader>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">Body content.</div>
      </PopoverContent>
    </PopoverRoot>

    <PopoverRoot
      side="bottom"
      align="start"
    >
      <PopoverTrigger>
        <Button
          variant="secondary"
          label="Body only"
        />
      </PopoverTrigger>
      <PopoverContent>
        <div class="p-(--spacing-md) text-body-sm text-(--text-default)">
          Just body content — no header or footer.
        </div>
      </PopoverContent>
    </PopoverRoot>
  </div>
</template>
