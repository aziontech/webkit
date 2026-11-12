<script setup>
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import RadioButton from '@aziontech/webkit/radio-button'
  import Select from '@aziontech/webkit/select'
  import { ref } from 'vue'

  const region = ref('sa-east')
  const plan = ref('pro')
  const name = ref('')
  const plans = [
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'business', label: 'Business' }
  ]
</script>

<template>
  <Field.Set class="max-w-(--container-sm)">
    <Field.Legend>Deployment</Field.Legend>
    <Field.Description>Where and how the application runs.</Field.Description>
    <Field.Group>
      <Field required>
        <Field.Label>Name</Field.Label>
        <Input
          v-model="name"
          autocomplete="off"
          :spellcheck="false"
        />
      </Field>
      <Field>
        <Field.Label>Region</Field.Label>
        <Select v-model="region">
          <Select.Trigger />
          <Select.Content>
            <Select.Option value="sa-east">sa-east</Select.Option>
            <Select.Option value="us-east">us-east</Select.Option>
            <Select.Option value="eu-west">eu-west</Select.Option>
          </Select.Content>
        </Select>
      </Field>
      <Field.Separator />
      <Field.Set>
        <Field.Legend kind="label">Plan</Field.Legend>
        <Field
          v-for="option in plans"
          :key="option.value"
          orientation="horizontal"
        >
          <RadioButton
            v-model="plan"
            :value="option.value"
            name="plan"
          />
          <Field.Label>{{ option.label }}</Field.Label>
        </Field>
      </Field.Set>
    </Field.Group>
  </Field.Set>
</template>
