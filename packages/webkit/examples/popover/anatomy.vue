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
  <div class="flex flex-wrap items-start gap-(--spacing-xxl) p-(--spacing-xxl) min-h-[22rem]">
    <Popover placement="bottom-start">
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
    </Popover>

    <Popover placement="bottom-start">
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
    </Popover>

    <Popover placement="bottom-start">
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
    </Popover>
  </div>
</template>
