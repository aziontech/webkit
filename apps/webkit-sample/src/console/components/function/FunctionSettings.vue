<script setup>
  // The three bands a function's settings are, shared by the two screens that show them:
  // the create page (../CreateFunction.vue) and the detail page (../FunctionDetail.vue).
  //
  // They are one component because they are one thing — the non-code half of
  // `POST v4/workspace/functions` — and because the console's own promise is that a
  // create page and the settings page it becomes are the same object seen twice: same
  // bands, same rows, same order, same guidance. Two copies of this markup would drift on
  // the first edit to either.
  //
  // The NAME is deliberately not here: it is the one field the two screens place
  // differently — in the commit bar while creating (the only required field, so it stays
  // on screen from any tab) and in a General band once the function exists. Each page
  // renders its own.
  import CardBox from '@aziontech/webkit/card-box'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Switch from '@aziontech/webkit/switch'
  import { useId } from 'vue'

  import FieldRow from '../form/FieldRow.vue'
  import Section from '../page/Section.vue'

  // Three sibling bands, no wrapper: the parent's own column owns the spacing, and
  // Section already spaces itself from the band above it.
  defineOptions({ inheritAttrs: false })

  defineProps({
    /** The runtime, as a person reads it — "JavaScript" / "Lua". */
    runtimeLabel: { type: String, required: true },
    /** Locks every control while a request is in flight. */
    disabled: { type: Boolean, default: false }
  })

  // `execution_environment` and `active`, the two properties these bands own.
  const executionEnvironment = defineModel('executionEnvironment', {
    type: String,
    default: 'application'
  })
  const active = defineModel('active', { type: Boolean, default: true })

  // The radio group's `name` has to be unique per instance, or two functions rendered on
  // one screen would share one group.
  const groupName = useId()
</script>

<template>
  <!-- RUNTIME. `enum(azion_js, azion_lua)`, and the endpoint does not take a change to
       it — the console shows it locked, with the lock glyph, and so does this. A field
       that cannot be answered still answers the first thing a reader asks of a function:
       what runs it. -->
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
    hint="Which product runs the function. The two are not interchangeable: they hand the code a different request."
  >
    <CardBox :padded="false">
      <template #content>
        <Item.List>
          <!-- No row description: the band's hint says what the choice is and each
               option says what it does. A third sentence between them restates both. -->
          <FieldRow
            kind="wide"
            title="Runs on"
          >
            <!-- A radio group is a group, so it gets a real fieldset/legend: the row's
                 title names the decision, the legend is what a screen reader announces
                 before the options. -->
            <fieldset class="m-0 flex w-full flex-col gap-[var(--spacing-sm)] border-0 p-0">
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
