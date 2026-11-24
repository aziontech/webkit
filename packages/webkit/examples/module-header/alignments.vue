<script setup>
  import ModuleHeader from '@aziontech/webkit/module-header'
</script>

<template>
  <div>
    <ModuleHeader
      align="center"
      eyebrow="Platform"
      title="Build once, run everywhere"
      description="One deploy serves your application from every region, with no servers to manage."
    />
    <ModuleHeader
      align="start"
      eyebrow="Observability"
      title="See every request as it happens"
      description="Logs, metrics and traces stream to one place, ready to query in seconds."
    />
    <ModuleHeader
      align="split"
      eyebrow="Security"
      title="Protect every request"
      description="Firewall rules, bot protection and DDoS mitigation run before your code, on the same network, so a blocked request never costs you compute."
    />
  </div>
</template>
