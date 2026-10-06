<script setup lang="ts">
  import { computed } from 'vue'

  import ApplicationLayer from '../../../components/application/ApplicationLayer.vue'
  import ResourceBinding from '../../../components/resource/ResourceBinding.vue'
  import { clearScratchErrors } from '../../../lib/data/application-scratch'
  import { resourceBindingIsExisting } from '../../../lib/data/resource-binding'
  import { WORKLOAD_APPLICATIONS } from '../../../lib/data/workload-flows'
  import { useWorkloadForm } from './form-context'

  interface Props {
    disabled?: boolean
  }

  withDefaults(defineProps<Props>(), {
    disabled: false
  })

  const { form, errors } = useWorkloadForm()

  const creating = computed(() => !resourceBindingIsExisting(form.application))
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--layout-section-gap)">
    <ResourceBinding
      v-model="form.application"
      title="Application"
      hint="What this workload serves on each environment, so one workload can serve different applications on Production and Stage."
      :options="WORKLOAD_APPLICATIONS"
      icon="ai ai-edge-application"
      noun="application"
      existing-hint="The release serves the latest ready version of the selected application, and an older one can be pinned from the deployment."
      create-hint="Created and built with the workload, under a name every resource made alongside it shares."
      :message="errors.application"
      :disabled="disabled"
    />

    <ApplicationLayer
      v-if="creating"
      v-model="form.application.scratch"
      :errors="errors"
      :disabled="disabled"
      @clear="clearScratchErrors(errors, $event)"
    />
  </div>
</template>
