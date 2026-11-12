<script setup>
  import { Toaster, toast } from '@aziontech/webkit/toast'
  import Button from '@aziontech/webkit/button'
</script>

<template>
  <Toaster position="bottom-right" />
  <div class="flex flex-wrap justify-center gap-2">
    <Button
      label="Default"
      kind="secondary"
      @click="
        () =>
          toast('Event has been created', { description: 'Sunday, December 03, 2023 at 9:00 AM' })
      "
    />
    <Button
      label="Success"
      kind="primary"
      @click="
        () =>
          toast.success('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM'
          })
      "
    />
    <Button
      label="Info"
      kind="outlined"
      @click="
        () =>
          toast.info('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM'
          })
      "
    />
    <Button
      label="Warning"
      kind="outlined"
      @click="
        () =>
          toast.warning('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM'
          })
      "
    />
    <Button
      label="Error"
      kind="danger"
      @click="
        () =>
          toast.error('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM'
          })
      "
    />
    <Button
      label="Loading"
      kind="transparent"
      @click="
        () => toast.loading('Loading…', { description: 'Sunday, December 03, 2023 at 9:00 AM' })
      "
    />
  </div>
</template>
