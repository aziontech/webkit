<script setup>
// Create Record — the Edge DNS zone "add record" flow, in a MEDIUM right Drawer
// opened from the zone detail's Records tab. ItemGroup form (/form Approach A):
// each section is a section title above a flush CardBox whose body is an
// Item.List — Item.Title is the field label, its guidance is Item.Description,
// and the control lives on the right in Item.Actions. Two sections: Settings
// (the record itself) and Policy (how Edge DNS answers with it).
//
// The Name field's zone-domain suffix is an InputGroup addon (".edgeflow.com");
// the Value field's placeholder + guidance switch with the selected Record Type
// (src/lib/edge-dns.js), and the Weight field only appears for the WEIGHTED
// policy. Validation runs on submit only — empty required fields reveal the amber
// `required` state (a prompt, not the red `invalid` error), shown as a HelperText
// under the control. One `submitting` flag locks the whole scope (fieldset
// :disabled + every control :disabled + Save :loading, the /usability Pattern 1
// lock); on success it emits the built record and the parent appends it.
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import Drawer from "@aziontech/webkit/drawer";
import DrawerClose from "@aziontech/webkit/drawer-close";
import DrawerContent from "@aziontech/webkit/drawer-content";
import DrawerOverlay from "@aziontech/webkit/drawer-overlay";
import DrawerPortal from "@aziontech/webkit/drawer-portal";
import DrawerTitle from "@aziontech/webkit/drawer-title";
import HelperText from "@aziontech/webkit/helper-text";
import InputGroup, { InputGroupAddon } from "@aziontech/webkit/input-group";
import InputNumber from "@aziontech/webkit/input-number";
import InputText from "@aziontech/webkit/input-text";
import Item from "@aziontech/webkit/item";
import Link from "@aziontech/webkit/link";
import PanelContent from "@aziontech/webkit/panel-content";
import PanelFooter from "@aziontech/webkit/panel-footer";
import PanelHeader from "@aziontech/webkit/panel-header";
import Select from "@aziontech/webkit/select";
import Textarea from "@aziontech/webkit/textarea";
import { toast } from "@aziontech/webkit/toast";
import { computed, reactive, ref, watch } from "vue";

import { POLICY_TYPES, RECORD_TYPES, recordType } from "../lib/edge-dns";

const open = defineModel("open", { type: Boolean, default: false });
const props = defineProps({
  // The zone's root domain, shown as the Name field's InputGroup addon.
  domain: { type: String, default: "" },
});
const emit = defineEmits(["created"]);

const blankForm = () => ({
  name: "",
  type: "A",
  ttl: 3600,
  value: "",
  description: "",
  policy: "simple",
  weight: 100,
});

const form = reactive(blankForm());
const errors = reactive({ name: "", value: "" });
const submitting = ref(false);

const selectedType = computed(() => recordType(form.type));
const isWeighted = computed(() => form.policy === "weighted");

const typeLabel = (value) => recordType(value).label;
const policyLabelOf = (value) =>
  POLICY_TYPES.find((policy) => policy.value === value)?.label ?? "";

// Reset the form each time the drawer closes so the next open starts clean.
watch(open, (isOpen) => {
  if (isOpen) return;
  Object.assign(form, blankForm());
  errors.name = "";
  errors.value = "";
});

const validate = () => {
  errors.name = form.name.trim() ? "" : "This field is required.";
  errors.value = form.value.trim() ? "" : "This field is required.";
  return !errors.name && !errors.value;
};

const cancel = () => {
  open.value = false;
};

const submit = async () => {
  if (submitting.value) return; // re-entrancy lock
  if (!validate()) return; // feedback is now on the fields themselves

  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const name = form.name.trim();
    emit("created", {
      id: String(Math.floor(100000 + Math.random() * 900000)),
      name,
      type: form.type,
      value: form.value.trim(),
      ttl: form.ttl,
      description: form.description.trim(),
      policy: form.policy,
      weight: isWeighted.value ? form.weight : null,
    });
    toast.success(`Record "${name}" created.`);
    open.value = false;
  } catch (error) {
    toast.error("Could not create the record.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => submit() },
    });
  } finally {
    submitting.value = false; // release on success AND failure
  }
};
</script>

<template>
  <Drawer v-model:open="open" size="large" side="right">
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Create Record"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
              <DrawerTitle>Create Record</DrawerTitle>
              <p class="text-body-sm text-[var(--text-muted)]">
                Add a DNS record and choose how Edge DNS should answer requests
                for it.
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset
              class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Create record</legend>

              <!-- Section: Settings -->
              <section class="flex flex-col gap-[var(--spacing-sm)]">
                <div class="flex flex-col gap-[var(--spacing-xxs)] px-[var(--spacing-xs)]">
                  <p class="text-heading-xxs text-[var(--text-default)]">Settings</p>
                  <p class="text-body-sm text-[var(--text-muted)]">
                    Specify which IPs are associated with the domain and how Edge
                    DNS should handle requests. The accepted value's format varies
                    according to the chosen record type.
                  </p>
                </div>
                <CardBox :padded="false">
                  <template #content>
                    <Item.List>
                      <!-- Name: subdomain + the zone's root domain as an addon. -->
                      <Item size="small" class="items-start">
                        <Item.Content>
                          <Item.Title>Name</Item.Title>
                          <Item.Description>
                            Use @ to create a record for the root domain.
                          </Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <div class="flex w-full max-w-[var(--container-sm)] flex-col gap-[var(--spacing-xs)]">
                            <InputGroup :disabled="submitting" :required="!!errors.name">
                              <InputText
                                v-model="form.name"
                                size="large"
                                class="flex-1"
                                placeholder="subdomain"
                                autocomplete="off"
                                aria-label="Name"
                                :disabled="submitting"
                                :required="!!errors.name"
                                :aria-describedby="errors.name ? 'record-name-error' : undefined"
                                @update:model-value="errors.name = ''"
                              />
                              <InputGroupAddon v-if="domain">.{{ domain }}</InputGroupAddon>
                            </InputGroup>
                            <HelperText
                              v-if="errors.name"
                              id="record-name-error"
                              kind="required"
                              :label="errors.name"
                            />
                          </div>
                        </Item.Actions>
                      </Item>

                      <!-- Record Type -->
                      <Item size="small" class="items-start">
                        <Item.Content>
                          <Item.Title>Record Type</Item.Title>
                          <Item.Description>
                            <Link
                              label="Read more about Record Types"
                              size="medium"
                              href="https://www.azion.com/en/documentation/products/secure/edge-dns/"
                              target="_blank"
                            />
                          </Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <Select
                            v-model="form.type"
                            size="large"
                            class="w-full max-w-[var(--container-sm)]"
                            :disabled="submitting"
                            :display-value="typeLabel"
                          >
                            <Select.Trigger aria-label="Record Type" />
                            <!-- z workaround: Select.Content teleports to body at
                                 z-50, behind the Drawer panel (z-[1001]). -->
                            <Select.Content class="!z-[1002]">
                              <Select.Option
                                v-for="type in RECORD_TYPES"
                                :key="type.value"
                                :value="type.value"
                              >
                                {{ type.label }}
                              </Select.Option>
                            </Select.Content>
                          </Select>
                        </Item.Actions>
                      </Item>

                      <!-- TTL -->
                      <Item size="small" class="items-start">
                        <Item.Content>
                          <Item.Title>TTL (seconds)</Item.Title>
                          <Item.Description>
                            Time-to-live a response can be cached for on a resolver
                            server.
                          </Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <InputNumber
                            v-model="form.ttl"
                            size="large"
                            class="w-full max-w-[var(--container-sm)]"
                            :min="0"
                            :disabled="submitting"
                            aria-label="TTL in seconds"
                          />
                        </Item.Actions>
                      </Item>

                      <!-- Value: placeholder + guidance switch with the record type. -->
                      <Item size="small" class="items-start">
                        <Item.Content>
                          <Item.Title>Value</Item.Title>
                          <Item.Description>{{ selectedType.valueHelper }}</Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <div class="flex w-full max-w-[var(--container-sm)] flex-col gap-[var(--spacing-xs)]">
                            <Textarea
                              v-model="form.value"
                              class="w-full"
                              :placeholder="selectedType.placeholder"
                              aria-label="Value"
                              :disabled="submitting"
                              :required="!!errors.value"
                              :aria-describedby="errors.value ? 'record-value-error' : undefined"
                              @update:model-value="errors.value = ''"
                            />
                            <HelperText
                              v-if="errors.value"
                              id="record-value-error"
                              kind="required"
                              :label="errors.value"
                            />
                          </div>
                        </Item.Actions>
                      </Item>

                      <!-- Description (optional) -->
                      <Item size="small" class="items-start">
                        <Item.Content>
                          <Item.Title>Description</Item.Title>
                          <Item.Description>
                            An optional note to help identify this record.
                          </Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <InputText
                            v-model="form.description"
                            size="large"
                            class="w-full max-w-[var(--container-sm)]"
                            placeholder="Optional description"
                            autocomplete="off"
                            aria-label="Description"
                            :disabled="submitting"
                          />
                        </Item.Actions>
                      </Item>
                    </Item.List>
                  </template>
                </CardBox>
              </section>

              <!-- Section: Policy -->
              <section class="flex flex-col gap-[var(--spacing-sm)]">
                <div class="flex flex-col gap-[var(--spacing-xxs)] px-[var(--spacing-xs)]">
                  <p class="text-heading-xxs text-[var(--text-default)]">Policy</p>
                  <p class="text-body-sm text-[var(--text-muted)]">
                    Choose the policy type to specify how Edge DNS should deal with
                    requests answered by this record.
                  </p>
                </div>
                <CardBox :padded="false">
                  <template #content>
                    <Item.List>
                      <Item size="small" class="items-start">
                        <Item.Content>
                          <Item.Title>Policy Type</Item.Title>
                          <Item.Description>
                            Choose SIMPLE for standard DNS resolution, or WEIGHTED
                            to distribute answers across records by weight.
                          </Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <Select
                            v-model="form.policy"
                            size="large"
                            class="w-full max-w-[var(--container-sm)]"
                            :disabled="submitting"
                            :display-value="policyLabelOf"
                          >
                            <Select.Trigger aria-label="Policy Type" />
                            <Select.Content class="!z-[1002]">
                              <Select.Option
                                v-for="policy in POLICY_TYPES"
                                :key="policy.value"
                                :value="policy.value"
                              >
                                {{ policy.label }}
                              </Select.Option>
                            </Select.Content>
                          </Select>
                        </Item.Actions>
                      </Item>

                      <!-- Weight only applies to the WEIGHTED policy. -->
                      <Item v-if="isWeighted" size="small" class="items-start">
                        <Item.Content>
                          <Item.Title>Weight</Item.Title>
                          <Item.Description>
                            Relative weight (0–255) for this record within the
                            weighted set.
                          </Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <InputNumber
                            v-model="form.weight"
                            size="large"
                            class="w-full max-w-[var(--container-sm)]"
                            :min="0"
                            :max="255"
                            :disabled="submitting"
                            aria-label="Weight"
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
