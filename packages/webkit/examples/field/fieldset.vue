<script setup>
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import Select from '@aziontech/webkit/select'
  import { ref } from 'vue'

  const region = ref('sa-east')
  const plan = ref('pro')
  const name = ref('')
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
        <Field.Legend type="label">Plan</Field.Legend>
        <RadioGroup
          v-model="plan"
          name="plan"
        >
          <RadioGroup.Item
            v-for="option in ['free', 'pro', 'business']"
            :key="option"
            :value="option"
          >
            <span class="capitalize">{{ option }}</span>
          </RadioGroup.Item>
        </RadioGroup>
      </Field.Set>
    </Field.Group>
  </Field.Set>
</template>
