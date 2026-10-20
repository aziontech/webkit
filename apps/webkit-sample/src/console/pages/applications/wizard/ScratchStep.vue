<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'

  import ApplicationLayer from '../../../components/application/ApplicationLayer.vue'
  import FieldStack from '../../../components/form/FieldStack.vue'
  import { clearScratchErrors } from '../../../lib/data/application-scratch'
  import { useCreateForm } from './form-context'

  interface Props {
    disabled?: boolean
  }

  withDefaults(defineProps<Props>(), {
    disabled: false
  })

  const { form, errors } = useCreateForm()
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--layout-section-gap)">
    <CardBox title="Name your application">
      <template #content>
        <FieldStack
          label="Name"
          required
          hint="Names the application, and every resource created alongside it."
          description="Lowercase letters, numbers, and hyphens."
          :message="errors.name"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <InputText
              :id="controlId"
              v-model="form.name"
              size="large"
              class="w-full"
              placeholder="my-application"
              :disabled="disabled"
              :required="!!errors.name"
              :aria-describedby="describedBy"
            />
          </template>
        </FieldStack>
      </template>
    </CardBox>

    <ApplicationLayer
      v-model="form.scratch"
      :errors="errors"
      :disabled="disabled"
      @clear="clearScratchErrors(errors, $event)"
    />
  </div>
</template>
