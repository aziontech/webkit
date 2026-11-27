<script setup>
  import Button from '@aziontech/ui/button'
  import { toast, Toaster } from '@aziontech/ui/toast'

  const showNeutral = () =>
    toast('Settings saved', { description: 'Changes apply to new requests.' })
  const showSuccess = () =>
    toast.success('Deployment finished', { description: 'acme-store is live on example.com.' })
  const showInfo = () =>
    toast.info('Maintenance on March 4', { description: 'From 02:00 to 03:00 UTC.' })
  const showWarning = () =>
    toast.warning('Request limit at 90%', { description: 'Upgrade the plan to avoid throttling.' })
  const showError = () =>
    toast.error('Deploy failed', { description: 'Check the build log for details.' })
  const showLoading = () => toast.loading('Deploying acme-store…')
</script>

<template>
  <Toaster position="bottom-end" />
  <div class="flex flex-wrap justify-center gap-(--spacing-xs)">
    <Button
      label="Neutral"
      variant="outline"
      @click="showNeutral"
    />
    <Button
      label="Success"
      variant="outline"
      @click="showSuccess"
    />
    <Button
      label="Info"
      variant="outline"
      @click="showInfo"
    />
    <Button
      label="Warning"
      variant="outline"
      @click="showWarning"
    />
    <Button
      label="Error"
      variant="outline"
      @click="showError"
    />
    <Button
      label="Loading"
      variant="outline"
      @click="showLoading"
    />
  </div>
</template>
