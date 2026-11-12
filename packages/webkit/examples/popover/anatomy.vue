<script setup>
  import Button from '@aziontech/webkit/button'
  import PopoverClose from '@aziontech/webkit/popover-close'
  import PopoverContent from '@aziontech/webkit/popover-content'
  import PopoverDescription from '@aziontech/webkit/popover-description'
  import PopoverFooter from '@aziontech/webkit/popover-footer'
  import PopoverHeader from '@aziontech/webkit/popover-header'
  import PopoverRoot from '@aziontech/webkit/popover-root'
  import PopoverTitle from '@aziontech/webkit/popover-title'
  import PopoverTrigger from '@aziontech/webkit/popover-trigger'
</script>

<template>
  <div class="flex flex-wrap items-start gap-(--spacing-xxl) p-(--spacing-xxl) min-h-[22rem]">
    <PopoverRoot placement="bottom-start">
      <PopoverTrigger>
        <Button
          kind="secondary"
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
            kind="secondary"
            size="medium"
            label="Confirm"
          />
        </PopoverFooter>
      </PopoverContent>
    </PopoverRoot>

    <PopoverRoot placement="bottom-start">
      <PopoverTrigger>
        <Button
          kind="secondary"
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

    <PopoverRoot placement="bottom-start">
      <PopoverTrigger>
        <Button
          kind="secondary"
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
