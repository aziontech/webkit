<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Link from '@aziontech/webkit/link'
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <Alert
      severity="info"
      title="Maintenance scheduled"
      label="The dashboard is read-only on March 4 from 02:00 to 03:00 UTC. Traffic keeps flowing."
    />
    <Alert
      severity="success"
      title="Domain verified"
      label="app.example.com now serves traffic over HTTPS."
    />
    <Alert
      severity="warning"
      title="Request limit at 90%"
      action-label="Upgrade plan"
    >
      Requests above the limit are throttled until the cycle resets.
      <Link
        inline
        href="/billing/usage"
        >Review usage</Link
      >.
    </Alert>
    <Alert
      severity="danger"
      title="Deploy failed"
      label="The build stopped at step 3 of 5. Check the logs and deploy again."
      closable
    />
  </div>
</template>
