<script setup>
// Add Column — appends a column to an existing SQL table, in a MEDIUM right
// Drawer. ItemGroup form (/form Approach A): Item.Title is each field's label and
// the control carries an aria-label. The Type field reuses the shared, searchable
// Postgres type picker (src/lib/postgres-types.js). Validation runs on submit
// only; one `submitting` flag locks the scope; on success it emits the built
// column and the parent appends it to the table.
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import Drawer from "@aziontech/webkit/drawer";
import DrawerClose from "@aziontech/webkit/drawer-close";
import DrawerContent from "@aziontech/webkit/drawer-content";
import DrawerOverlay from "@aziontech/webkit/drawer-overlay";
import DrawerPortal from "@aziontech/webkit/drawer-portal";
import DrawerTitle from "@aziontech/webkit/drawer-title";
import HelperText from "@aziontech/webkit/helper-text";
import InputText from "@aziontech/webkit/input-text";
import Item from "@aziontech/webkit/item";
import PanelContent from "@aziontech/webkit/panel-content";
import PanelFooter from "@aziontech/webkit/panel-footer";
import PanelHeader from "@aziontech/webkit/panel-header";
import Select from "@aziontech/webkit/select";
import Switch from "@aziontech/webkit/switch";
import { toast } from "@aziontech/webkit/toast";
import { computed, reactive, ref, watch } from "vue";

import { filterTypes, glyphOf, typeLabel } from "../lib/postgres-types";

const open = defineModel("open", { type: Boolean, default: false });
defineProps({
  // The table the column is added to; shown in the drawer's description.
  tableName: { type: String, default: "" },
});
const emit = defineEmits(["created"]);

let nextId = 0;
const uid = () => (nextId += 1);

const blankForm = () => ({
  name: "",
  type: "text",
  defaultValue: "",
  primaryKey: false,
  notNull: false,
});
const form = reactive(blankForm());
const submitted = ref(false);
const submitting = ref(false);

const nameError = computed(() => submitted.value && !form.name.trim());

// Searchable Postgres type picker.
const typeQuery = ref("");
const filteredTypes = computed(() => filterTypes(typeQuery.value));

watch(open, (isOpen) => {
  if (isOpen) return;
  Object.assign(form, blankForm());
  submitted.value = false;
  typeQuery.value = "";
});

const cancel = () => {
  open.value = false;
};

const submit = async () => {
  submitted.value = true;
  if (submitting.value) return;
  if (!form.name.trim()) return;

  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 700));
    const name = form.name.trim();
    emit("created", {
      id: `col-${uid()}`,
      name,
      type: form.type,
      primaryKey: form.primaryKey,
      notNull: form.notNull || form.primaryKey,
      defaultValue: form.defaultValue.trim(),
    });
    toast.success(`Column "${name}" added.`);
    open.value = false;
  } catch (error) {
    toast.error("Could not add the column.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => submit() },
    });
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <Drawer v-model:open="open" size="medium" side="right">
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Add column"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
              <DrawerTitle>Add Column</DrawerTitle>
              <p class="text-body-sm text-[var(--text-muted)]">
                {{ tableName ? `Add a new column to "${tableName}".` : "Add a new column to the table." }}
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset
              class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Add column</legend>

              <section class="flex flex-col gap-[var(--spacing-sm)]">
                <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
                  Column
                </p>
                <CardBox :padded="false">
                  <template #content>
                    <Item.List>
                      <Item size="small" class="items-start">
                        <Item.Content>
                          <Item.Title>Name</Item.Title>
                          <Item.Description>A unique column name.</Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <div class="flex w-full max-w-[var(--container-xs)] flex-col gap-[var(--spacing-xs)]">
                            <InputText
                              v-model="form.name"
                              size="large"
                              class="w-full font-code"
                              aria-label="Column name"
                              placeholder="column_name"
                              :disabled="submitting"
                              :required="nameError"
                              :aria-describedby="nameError ? 'add-column-name-error' : undefined"
                            />
                            <HelperText
                              v-if="nameError"
                              id="add-column-name-error"
                              kind="required"
                              label="Name is required."
                            />
                          </div>
                        </Item.Actions>
                      </Item>

                      <Item size="small">
                        <Item.Content>
                          <Item.Title>Type</Item.Title>
                          <Item.Description>The column's data type.</Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <Select
                            v-model="form.type"
                            size="large"
                            class="w-full max-w-[var(--container-xs)]"
                            :disabled="submitting"
                            :display-value="typeLabel"
                          >
                            <Select.Trigger aria-label="Column type">
                              <template #iconLeft>
                                <span
                                  class="shrink-0 font-code text-label-code-sm text-[var(--text-muted)]"
                                  aria-hidden="true"
                                >
                                  {{ glyphOf(form.type) }}
                                </span>
                              </template>
                            </Select.Trigger>
                            <Select.Content
                              class="!z-[1002] min-w-[var(--container-md)] !max-h-[var(--container-md)] [&_[data-testid$='__list']]:!max-h-[var(--container-sm)]"
                            >
                              <template #search>
                                <InputText
                                  v-model="typeQuery"
                                  size="medium"
                                  class="w-full"
                                  placeholder="Search types..."
                                  aria-label="Search types"
                                  @keydown.stop
                                >
                                  <template #iconLeft>
                                    <i class="pi pi-search" aria-hidden="true" />
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
                                      class="shrink-0 font-code text-label-code-sm text-[var(--text-muted)]"
                                      aria-hidden="true"
                                    >
                                      {{ type.glyph }}
                                    </span>
                                  </template>
                                  <span class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                                    <span class="font-code text-label-code-sm text-[var(--text-default)]">
                                      {{ type.label }}
                                    </span>
                                    <span class="truncate text-body-xs text-[var(--text-muted)]">
                                      {{ type.description }}
                                    </span>
                                  </span>
                                </Select.Option>
                              </Select.Group>
                            </Select.Content>
                          </Select>
                        </Item.Actions>
                      </Item>

                      <Item size="small">
                        <Item.Content>
                          <Item.Title>Default Value</Item.Title>
                          <Item.Description>
                            Optional. Leave empty for NULL, or use an expression like now().
                          </Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <InputText
                            v-model="form.defaultValue"
                            size="large"
                            class="w-full max-w-[var(--container-xs)] font-code"
                            aria-label="Default value"
                            placeholder="NULL"
                            :disabled="submitting"
                          />
                        </Item.Actions>
                      </Item>

                      <Item size="small">
                        <Item.Content>
                          <Item.Title>Primary key</Item.Title>
                          <Item.Description>Use this column as the table's primary key.</Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
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
                        <Item.Actions class="flex-1 justify-end">
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
              </section>
            </fieldset>
          </PanelContent>

          <PanelFooter class="flex-col md:flex-row md:justify-end">
            <Button
              class="w-full md:w-auto"
              type="button"
              label="Cancel"
              kind="outlined"
              size="medium"
              :disabled="submitting"
              @click="cancel"
            />
            <Button
              class="w-full md:w-auto"
              label="Save"
              kind="primary"
              size="medium"
              :loading="submitting"
              @click="submit"
            />
            <button type="submit" class="sr-only" tabindex="-1" aria-hidden="true">
              Save
            </button>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>
