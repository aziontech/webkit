<script setup>
  import SubagentCard from '@aziontech/ui/subagent-card'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-xs)">
    <SubagentCard
      name="deployer"
      title="Deploying the new cache rules"
      description="Waiting for you to allow the deploy to production."
      status="pending"
      :duration="18"
    />
    <SubagentCard
      name="researcher"
      title="Comparing cache plans"
      description="Reading the pricing page of each plan."
      status="running"
      :duration="42"
    />
    <SubagentCard
      name="reviewer"
      title="Reviewing the function code"
      description="Found two places that read the request body twice."
      status="success"
      :duration="95"
    />
    <SubagentCard
      name="analyst"
      title="Reading the error rate of www.example.com"
      description="The metrics service did not answer in 30 seconds."
      status="error"
      :duration="31"
    />
    <SubagentCard
      name="planner"
      title="Planning the migration of acme-store"
      description="Stopped by Jane Doe."
      status="canceled"
      :duration="7"
    />
  </div>
</template>
