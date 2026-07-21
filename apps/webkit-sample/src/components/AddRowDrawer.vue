<script setup>
// Insert Row — adds a row to the selected SQL table, in a MEDIUM right Drawer.
// ItemGroup form (/form Approach A): one field per column, its label the column
// name + type. A primary-key integer column is auto-generated (disabled input,
// note); a column with a default is prefilled with it; everything else is
// optional and becomes NULL when left blank. Validation is minimal (values are
// coerced on insert); one `submitting` flag locks the scope; on success it emits
// the entered values and the parent builds + appends the row.
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import Drawer from "@aziontech/webkit/drawer";
import DrawerClose from "@aziontech/webkit/drawer-close";
import DrawerContent from "@aziontech/webkit/drawer-content";
import DrawerOverlay from "@aziontech/webkit/drawer-overlay";
import DrawerPortal from "@aziontech/webkit/drawer-portal";
import DrawerTitle from "@aziontech/webkit/drawer-title";
import InputText from "@aziontech/webkit/input-text";
import Item from "@aziontech/webkit/item";
import PanelContent from "@aziontech/webkit/panel-content";
import PanelFooter from "@aziontech/webkit/panel-footer";
import PanelHeader from "@aziontech/webkit/panel-header";
import { toast } from "@aziontech/webkit/toast";
import { reactive, ref, watch } from "vue";

import { isIntegerType } from "../lib/postgres-types";

const open = defineModel("open", { type: Boolean, default: false });
const props = defineProps({
  // The table being inserted into: { name, columns: [{ name, type, primaryKey, defaultValue }] }.
  table: { type: Object, default: null },
});
const emit = defineEmits(["created"]);

const columns = () => props.table?.columns ?? [];
// A primary-key integer column is generated on insert (not typed by the user).
const isAuto = (column) => column.primaryKey && isIntegerType(column.type);

const form = reactive({});
const submitting = ref(false);

// Seed the form each time the drawer opens: defaults prefilled, auto columns blank.
watch(open, (isOpen) => {
  if (!isOpen) return;
  for (const key of Object.keys(form)) delete form[key];
  for (const column of columns()) {
    form[column.name] = isAuto(column) ? "" : column.defaultValue || "";
  }
});

const placeholderFor = (column) => {
  if (isAuto(column)) return "Automatically generated";
  if (column.defaultValue) return column.defaultValue;
  return "NULL";
};

const cancel = () => {
  open.value = false;
};

const submit = async () => {
  if (submitting.value) return;
  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 600));
    emit("created", { ...form });
    toast.success("Row inserted.");
    open.value = false;
  } catch (error) {
    toast.error("Could not insert the row.", {
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
          aria-label="Insert row"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
              <DrawerTitle>Insert Row</DrawerTitle>
              <p class="text-body-sm text-[var(--text-muted)]">
                {{ table ? `Add a new row to "${table.name}".` : "Add a new row to the table." }}
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset
              class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Insert row</legend>

              <section class="flex flex-col gap-[var(--spacing-sm)]">
                <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
                  Values
                </p>
                <CardBox :padded="false">
                  <template #content>
                    <Item.List>
                      <Item
                        v-for="column in columns()"
                        :key="column.name"
                        size="small"
                        class="items-start"
                      >
                        <Item.Content>
                          <Item.Title>
                            <span class="font-code">{{ column.name }}</span>
                            <span class="ml-[var(--spacing-xxs)] font-code text-body-xs text-[var(--text-muted)]">
                              {{ column.type }}
                            </span>
                          </Item.Title>
                          <Item.Description>
                            {{ isAuto(column) ? "Automatically generated." : column.defaultValue ? `Default: ${column.defaultValue}` : "Optional — leave empty for NULL." }}
                          </Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <InputText
                            v-model="form[column.name]"
                            size="large"
                            class="w-full max-w-[var(--container-xs)] font-code"
                            :aria-label="column.name"
                            :placeholder="placeholderFor(column)"
                            :disabled="submitting || isAuto(column)"
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
