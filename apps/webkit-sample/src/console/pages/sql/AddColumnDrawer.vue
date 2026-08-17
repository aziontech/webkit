<script setup>
  // Add Column — appends a column to an existing SQL table, in a MEDIUM right Drawer.
  //
  // TWO BANDS, TWO SHAPES, and the shape is the point. The three things the reader TYPES
  // OR PICKS — name, type, default — are separated fields (./ui/FieldStack.vue, the
  // Variables shape): a real `<Label for>` over a full-width control. The two things
  // they TOGGLE stay an ItemGroup, control pinned right with its consequence beside it,
  // because a switch is read rather than filled in. Putting all five in one column of
  // 256px right-aligned controls made the type picker — the widest thing on the form —
  // the narrowest, and gave the name a label the reader could not click.
  //
  // The Type field reuses the shared, searchable Postgres type picker
  // (src/lib/postgres-types.js). Validation runs on submit only; one `submitting` flag
  // locks the scope; on success it emits the built column and the parent appends it.
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref, watch } from 'vue'

  import FieldStack from '../../components/form/FieldStack.vue'
  import ResourceDrawer from '../../components/form/ResourceDrawer.vue'
  import Section from '../../components/page/Section.vue'
  import { filterTypes, glyphOf, typeLabel } from '../../lib/format/postgres-types'

  const open = defineModel('open', { type: Boolean, default: false })
  defineProps({
    // The table the column is added to; shown in the drawer's description.
    tableName: { type: String, default: '' }
  })
  const emit = defineEmits(['created'])

  let nextId = 0
  const uid = () => (nextId += 1)

  const blankForm = () => ({
    name: '',
    type: 'text',
    defaultValue: '',
    primaryKey: false,
    notNull: false
  })
  const form = reactive(blankForm())
  const submitted = ref(false)
  const submitting = ref(false)

  const nameError = computed(() => submitted.value && !form.name.trim())

  // Searchable Postgres type picker.
  const typeQuery = ref('')
  const filteredTypes = computed(() => filterTypes(typeQuery.value))

  watch(open, (isOpen) => {
    if (isOpen) return
    Object.assign(form, blankForm())
    submitted.value = false
    typeQuery.value = ''
  })

  const submit = async () => {
    submitted.value = true
    if (submitting.value) return
    if (!form.name.trim()) return

    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 700))
      const name = form.name.trim()
      emit('created', {
        id: `col-${uid()}`,
        name,
        type: form.type,
        primaryKey: form.primaryKey,
        notNull: form.notNull || form.primaryKey,
        defaultValue: form.defaultValue.trim()
      })
      toast.success(`Column "${name}" added.`)
      open.value = false
    } catch (error) {
      toast.error('Could not add the column.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <ResourceDrawer
    v-model:open="open"
    size="medium"
    title="Add Column"
    save-label="Save"
    :submitting="submitting"
    @submit="submit"
  >
    <!-- The three TYPED fields, separated: label over a full-width control. -->
    <Section
      stacked
      :divided="false"
      title="Column"
      hint="A column is added to the end of the table. The name and the type are what every query against it will use; the default applies to rows that do not supply a value."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <FieldStack
          label="Name"
          :message="nameError ? 'Name is required.' : ''"
          message-kind="required"
        >
          <template #default="{ controlId, describedBy }">
            <InputText
              :id="controlId"
              v-model="form.name"
              size="large"
              class="w-full font-code"
              placeholder="column_name"
              :disabled="submitting"
              :required="nameError"
              :aria-describedby="describedBy"
            />
          </template>
        </FieldStack>

        <FieldStack label="Type">
          <template #default="{ controlId }">
            <Select
              v-model="form.type"
              size="large"
              class="w-full"
              :disabled="submitting"
              :display-value="typeLabel"
            >
              <Select.Trigger
                :id="controlId"
                aria-label="Column type"
              >
                <template #iconLeft>
                  <span
                    class="shrink-0 font-code text-label-code-sm text-(--text-muted)"
                    aria-hidden="true"
                  >
                    {{ glyphOf(form.type) }}
                  </span>
                </template>
              </Select.Trigger>
              <Select.Content
                class="min-w-(--container-md) max-h-(--container-md)! [&_[data-testid$='__list']]:max-h-(--container-sm)!"
              >
                <template #search>
                  <InputText
                    v-model="typeQuery"
                    size="medium"
                    class="w-full"
                    placeholder="Search types"
                    aria-label="Search types"
                    @keydown.stop
                  >
                    <template #iconLeft>
                      <i
                        class="pi pi-search"
                        aria-hidden="true"
                      />
                    </template>
                  </InputText>
                </template>
                <Select.Group label="Postgres data types">
                  <Select.Option
                    v-for="type in filteredTypes"
                    :key="type.value"
                    :value="type.value"
                  >
                    <template #left>
                      <span
                        class="shrink-0 font-code text-label-code-sm text-(--text-muted)"
                        aria-hidden="true"
                      >
                        {{ type.glyph }}
                      </span>
                    </template>
                    <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <span class="font-code text-label-code-sm text-(--text-default)">
                        {{ type.label }}
                      </span>
                      <span class="truncate text-body-xs text-(--text-muted)">
                        {{ type.description }}
                      </span>
                    </span>
                  </Select.Option>
                </Select.Group>
              </Select.Content>
            </Select>
          </template>
        </FieldStack>

        <FieldStack
          label="Default value"
          description="Leave empty for NULL, or use an expression like now()."
        >
          <template #default="{ controlId }">
            <InputText
              :id="controlId"
              v-model="form.defaultValue"
              size="large"
              class="w-full font-code"
              placeholder="NULL"
              :disabled="submitting"
            />
          </template>
        </FieldStack>
      </div>
    </Section>

    <!-- The two CONSTRAINTS stay an ItemGroup. A switch is not a field the reader types
         into — it is a setting they read the current state of — so the compact row, with
         the control pinned right and its consequence beside it, is the correct shape.
         Mixing the two on one form is deliberate: the shape says which kind of thing it
         is. -->
    <Section
      stacked
      :divided="false"
      title="Constraints"
      hint="A primary key is implicitly NOT NULL, so turning it on takes the second switch out of your hands."
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <Item size="small">
              <Item.Content>
                <Item.Title>Primary key</Item.Title>
                <Item.Description>Use this column as the table's primary key.</Item.Description>
              </Item.Content>
              <Item.Actions class="justify-end">
                <Switch
                  v-model="form.primaryKey"
                  aria-label="Primary key"
                  :disabled="submitting"
                />
              </Item.Actions>
            </Item>

            <Item size="small">
              <Item.Content>
                <Item.Title>Not null</Item.Title>
                <Item.Description>Require a value for every row.</Item.Description>
              </Item.Content>
              <Item.Actions class="justify-end">
                <Switch
                  v-model="form.notNull"
                  aria-label="Not null"
                  :disabled="submitting || form.primaryKey"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </CardBox>
    </Section>
  </ResourceDrawer>
</template>
