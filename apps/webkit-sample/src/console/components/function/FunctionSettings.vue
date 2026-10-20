<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Switch from '@aziontech/webkit/switch'
  import { useId } from 'vue'

  import FieldRow from '../form/FieldRow.vue'
  import Section from '../page/Section.vue'

  defineOptions({ inheritAttrs: false })

  interface Props {
    runtimeLabel: string
    disabled?: boolean
  }

  withDefaults(defineProps<Props>(), {
    disabled: false
  })

  const executionEnvironment = defineModel('executionEnvironment', {
    type: String,
    default: 'application'
  })
  const active = defineModel('active', { type: Boolean, default: true })

  const groupName = useId()
</script>

<template>
  <Section
    stacked
    :divided="false"
    title="Runtime"
  >
    <CardBox :padded="false">
      <template #content>
        <Item.List>
          <FieldRow
            title="Runtime"
            description="The runtime isn't editable after the function is created."
          >
            <InputText
              :model-value="runtimeLabel"
              size="large"
              class="w-full"
              aria-label="Runtime"
              readonly
              disabled
            >
              <template #iconRight>
                <i
                  class="pi pi-lock"
                  aria-hidden="true"
                />
              </template>
            </InputText>
          </FieldRow>
        </Item.List>
      </template>
    </CardBox>
  </Section>

  <Section
    stacked
    :divided="false"
    title="Execution environment"
    hint="Which product runs the function, each handing the code a different request."
  >
    <CardBox :padded="false">
      <template #content>
        <Item.List>
          <FieldRow
            kind="wide"
            title="Runs on"
          >
            <fieldset class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0">
              <legend class="sr-only">Execution environment</legend>
              <FieldRadioBlock
                v-model="executionEnvironment"
                value="application"
                :name="groupName"
                label="Application"
                description="Runs on requests an application serves, after routing."
                :disabled="disabled"
              />
              <FieldRadioBlock
                v-model="executionEnvironment"
                value="firewall"
                :name="groupName"
                label="Firewall"
                description="Runs inside Firewall, before the request reaches an application, where a request can still be refused."
                :disabled="disabled"
              />
            </fieldset>
          </FieldRow>
        </Item.List>
      </template>
    </CardBox>
  </Section>

  <Section
    stacked
    :divided="false"
    title="Status"
  >
    <CardBox :padded="false">
      <template #content>
        <Item.List>
          <FieldRow
            kind="compact"
            title="Active"
            description="An inactive function keeps its code and stops running."
          >
            <Switch
              v-model="active"
              aria-label="Active"
              :disabled="disabled"
            />
          </FieldRow>
        </Item.List>
      </template>
    </CardBox>
  </Section>
</template>
