<script setup>
  import Button from '@aziontech/webkit/button'
  import { toast, Toaster } from '@aziontech/webkit/toast'
</script>

<template>
  <Toaster position="bottom-end" />
  <div class="flex flex-wrap justify-center gap-2">
    <Button
      label="Default"
      variant="secondary"
      @click="
        () =>
          toast('Event has been created', { description: 'Sunday, December 03, 2023 at 9:00 AM' })
      "
    />
    <Button
      label="Success"
      variant="primary"
      @click="
        () =>
          toast.success('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM'
          })
      "
    />
    <Button
      label="Info"
      variant="outline"
      @click="
        () =>
          toast.info('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM'
          })
      "
    />
    <Button
      label="Warning"
      variant="outline"
      @click="
        () =>
          toast.warning('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM'
          })
      "
    />
    <Button
      label="Error"
      variant="danger"
      @click="
        () =>
          toast.error('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM'
          })
      "
    />
    <Button
      label="Loading"
      variant="ghost"
      @click="
        () => toast.loading('Loading…', { description: 'Sunday, December 03, 2023 at 9:00 AM' })
      "
    />
  </div>
</template>
