<script setup>
// Create Rule — the Rules Engine create, in a LARGE Drawer. Uses the ItemGroup
// pattern (/form Approach A): each section is an section title above a flush
// CardBox — not a separate padded box. Simple fields (General, Status) are
// Item.List rows; the richer sections (Phase radios, Criteria + Behaviors
// repeaters) are full-width blocks inside their flush card.
//
// Repeater logic: Criteria conditions (joined And/Or, grouped) and Behaviors are
// each add / REMOVE / REORDER (move up/down — no drag lib, per dependencies.md).
// Row controls are size="large" to keep the horizontal rhythm with the large
// fields. Validation on submit only; one `submitting` flag locks the scope.
import { curve, duration } from "@aziontech/theme/animations";
import Button from "@aziontech/webkit/button";
import CardBox from "@aziontech/webkit/card-box";
import Divider from "@aziontech/webkit/divider";
import Drawer from "@aziontech/webkit/drawer";
import DrawerClose from "@aziontech/webkit/drawer-close";
import DrawerContent from "@aziontech/webkit/drawer-content";
import DrawerOverlay from "@aziontech/webkit/drawer-overlay";
import DrawerPortal from "@aziontech/webkit/drawer-portal";
import DrawerTitle from "@aziontech/webkit/drawer-title";
import FieldRadioBlock from "@aziontech/webkit/field-radio-block";
import HelperText from "@aziontech/webkit/helper-text";
import IconButton from "@aziontech/webkit/icon-button";
import InputText from "@aziontech/webkit/input-text";
import Item from "@aziontech/webkit/item";
import PanelContent from "@aziontech/webkit/panel-content";
import PanelFooter from "@aziontech/webkit/panel-footer";
import PanelHeader from "@aziontech/webkit/panel-header";
import Select from "@aziontech/webkit/select";
import Switch from "@aziontech/webkit/switch";
import { toast } from "@aziontech/webkit/toast";
import Tooltip from "@aziontech/webkit/tooltip";
import { computed, reactive, ref, watch } from "vue";

const open = defineModel("open", { type: Boolean, default: false });
const emit = defineEmits(["created"]);

const OPERATORS = [
  { value: "is-equal", label: "is equal" },
  { value: "is-not-equal", label: "is not equal" },
  { value: "matches", label: "matches" },
  { value: "does-not-match", label: "does not match" },
  { value: "starts-with", label: "starts with" },
  { value: "exists", label: "exists" },
];
const operatorLabel = (value) => OPERATORS.find((o) => o.value === value)?.label ?? "";

const BEHAVIORS = [
  { value: "deliver", label: "Deliver" },
  { value: "set-cache-policy", label: "Set Cache Policy" },
  { value: "redirect-301", label: "Redirect (301)" },
  { value: "run-function", label: "Run Function" },
  { value: "deny", label: "Deny access (403 Forbidden)" },
];
const behaviorLabel = (value) => BEHAVIORS.find((b) => b.value === value)?.label ?? "";

// Stable keys for repeater rows (order-independent).
let nextId = 0;
const uid = () => (nextId += 1);

const newCondition = (join = null) => ({
  id: uid(),
  join, // null for the first row of a group; 'and' | 'or' otherwise
  variable: "",
  operator: "is-equal",
  argument: "",
});
const newGroup = () => ({ id: uid(), conditions: [newCondition()] });
const newBehavior = () => ({ id: uid(), type: "deliver" });

const blankForm = () => ({
  name: "",
  description: "",
  phase: "request",
  criteria: [newGroup()],
  behaviors: [newBehavior()],
  active: true,
});

const form = reactive(blankForm());
const submitted = ref(false);
const submitting = ref(false);

// Morph the repeater lines when they add / remove / reorder. Vue's built-in
// TransitionGroup FLIPs positions via `moveClass`. The azion preset ships no
// named `duration-*`/`ease-*` utilities, so we take the timing from the animate
// tokens (@aziontech/theme/animations) as CSS custom properties (morphStyle,
// set on each TransitionGroup wrapper) and read them via arbitrary utilities —
// no hardcoded ms / cubic-bezier.
const morphStyle = {
  "--tg-move-duration": duration["slow-01"],
  "--tg-move-ease": curve["expressive-entrance"],
  "--tg-enter-duration": duration["moderate-01"],
  "--tg-enter-ease": curve["productive-entrance"],
  "--tg-leave-duration": duration["slow-01"],
  "--tg-leave-ease": curve["productive-exit"],
};
const morphTransition = {
  moveClass:
    "transition-transform duration-[var(--tg-move-duration)] ease-[var(--tg-move-ease)] motion-reduce:transition-none",
  enterActiveClass:
    "transition-all duration-[var(--tg-enter-duration)] ease-[var(--tg-enter-ease)] motion-reduce:transition-none",
  enterFromClass: "-translate-y-[var(--spacing-xxs)] opacity-0",
  // Removal is a plain fade-out (no absolute/translate — that made the leaving
  // row jump to the container origin before fading).
  leaveActiveClass:
    "transition-opacity duration-[var(--tg-leave-duration)] ease-[var(--tg-leave-ease)] motion-reduce:transition-none",
  leaveToClass: "opacity-0",
};

const nameError = computed(() => submitted.value && !form.name.trim());
const totalConditions = computed(() =>
  form.criteria.reduce((sum, group) => sum + group.conditions.length, 0),
);

watch(open, (isOpen) => {
  if (isOpen) return;
  Object.assign(form, blankForm());
  submitted.value = false;
});

// ── Criteria repeater: add / remove / reorder ──
const addCondition = (group, join) => group.conditions.push(newCondition(join));
const addCriteria = () => form.criteria.push(newGroup());

// Reorder whole criteria groups (move up/down — same no-drag-lib pattern as the
// conditions/behaviors). The first group always reads "If", the rest "Or", and
// that label is index-driven, so it stays correct after a move.
const moveCriteria = (index, direction) => {
  const target = index + direction;
  if (target < 0 || target >= form.criteria.length) return;
  const [moved] = form.criteria.splice(index, 1);
  form.criteria.splice(target, 0, moved);
};

const removeCondition = (groupIndex, condIndex) => {
  if (totalConditions.value <= 1) return; // keep at least one condition overall
  const group = form.criteria[groupIndex];
  group.conditions.splice(condIndex, 1);
  if (group.conditions.length === 0) form.criteria.splice(groupIndex, 1);
  else if (condIndex === 0) group.conditions[0].join = null;
};

const moveCondition = (groupIndex, condIndex, direction) => {
  const conditions = form.criteria[groupIndex].conditions;
  const target = condIndex + direction;
  if (target < 0 || target >= conditions.length) return;
  const [moved] = conditions.splice(condIndex, 1);
  conditions.splice(target, 0, moved);
  conditions[0].join = null; // the first row is always the base condition
};

// ── Behaviors repeater: add / remove / reorder ──
const addBehavior = () => form.behaviors.push(newBehavior());
const removeBehavior = (index) => {
  if (form.behaviors.length <= 1) return;
  form.behaviors.splice(index, 1);
};
const moveBehavior = (index, direction) => {
  const target = index + direction;
  if (target < 0 || target >= form.behaviors.length) return;
  const [moved] = form.behaviors.splice(index, 1);
  form.behaviors.splice(target, 0, moved);
};

// ── Native drag-and-drop reorder (no library, per dependencies.md) ──
// A row/group is draggable only while its grip handle is held (mousedown), so
// the inputs stay interactive; the element itself is the drop zone. Reordering
// splices the array, so the same TransitionGroup morph plays. `scope` keeps a
// drag contained to its own list (a condition can't drop into another group).
// Pointer DnD is desktop/mouse; the move buttons remain for click/keyboard/touch.
const dnd = reactive({ scope: null, from: -1, over: -1 });

// The grip handle IS the drag source (IconButton doesn't forward listeners or
// `draggable`, so the grip is a plain focusable element we control). Only the
// grip is draggable, so the row's inputs stay fully interactive; the row itself
// is the drop zone. Sized to match IconButton large (size-10). Arrow keys on a
// focused grip reorder without a pointer (keyboard a11y).
const GRIP_CLASS =
  "inline-flex shrink-0 cursor-grab items-center justify-center rounded-[var(--shape-button)] " +
  "text-[var(--text-muted)] outline-none transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-default)] " +
  "focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] active:cursor-grabbing motion-reduce:transition-none";

// Row states, keyed off the drag: `dragging` = the lifted source row;
// `drop` = the row currently under the pointer (where it will land).
const isDragging = (scope, index) => dnd.scope === scope && dnd.from === index;
const isDropTarget = (scope, index) =>
  dnd.scope === scope && dnd.over === index && dnd.from !== index;

// Base + state classes shared by every draggable row/group. `dragging` = the
// moved item: dimmed with a DASHED accent border around the whole element (an
// outline, so no layout shift). `drop` = where the item can be placed: a solid
// accent line on TOP (a `before` pseudo, so it never shifts layout).
const dragRowClass =
  "relative rounded-[var(--shape-card)] transition-[opacity,transform,outline-color] " +
  "data-[dragging]:opacity-70 data-[dragging]:scale-[0.98] data-[dragging]:outline-dashed data-[dragging]:outline-2 data-[dragging]:outline-[var(--accent)] " +
  "data-[drop]:before:pointer-events-none data-[drop]:before:absolute data-[drop]:before:inset-x-0 data-[drop]:before:-top-[var(--spacing-xxs)] data-[drop]:before:border-t-2 data-[drop]:before:border-[var(--accent)] data-[drop]:before:content-['']";

const onDragStart = (scope, index, event) => {
  dnd.scope = scope;
  dnd.from = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index)); // Firefox needs data
    // Show the whole row as the drag image, not just the grip.
    const row = event.currentTarget?.closest?.("[data-drag-row]");
    if (row) event.dataTransfer.setDragImage(row, 12, 12);
  }
};
const onDragEnter = (scope, index) => {
  if (dnd.scope === scope) dnd.over = index;
};
const onDragEnd = () => {
  dnd.scope = null;
  dnd.from = -1;
  dnd.over = -1;
};

const reorder = (list, from, to) => {
  if (from < 0 || to < 0 || from === to || from >= list.length || to >= list.length) return;
  const [moved] = list.splice(from, 1);
  list.splice(to, 0, moved);
};
const dropOnCondition = (groupIndex, index) => {
  if (dnd.scope !== "cond-" + groupIndex) return;
  reorder(form.criteria[groupIndex].conditions, dnd.from, index);
  form.criteria[groupIndex].conditions[0].join = null;
  onDragEnd();
};
const dropOnBehavior = (index) => {
  if (dnd.scope !== "behavior") return;
  reorder(form.behaviors, dnd.from, index);
  onDragEnd();
};
const dropOnCriteria = (index) => {
  if (dnd.scope !== "criteria") return;
  reorder(form.criteria, dnd.from, index);
  onDragEnd();
};

const isValid = () => {
  const okName = !!form.name.trim();
  const okCriteria = form.criteria.every((group) =>
    group.conditions.every((c) => c.variable.trim()),
  );
  return okName && okCriteria && form.behaviors.length > 0;
};

const cancel = () => {
  open.value = false;
};

const submit = async () => {
  submitted.value = true;
  if (submitting.value) return;
  if (!isValid()) return;

  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 900));
    emit("created", {
      id: `rule-${uid()}`,
      name: form.name.trim(),
      phase: form.phase,
      active: form.active,
    });
    toast.success(`Rule "${form.name.trim()}" created.`);
    open.value = false;
  } catch (error) {
    toast.error("Could not create the rule.", {
      description: error?.message ?? "Check your connection and try again.",
      action: { label: "Retry", onClick: () => submit() },
    });
  } finally {
    submitting.value = false;
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
          aria-label="Create Rule"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-[var(--spacing-xxs)]">
              <DrawerTitle>Create Rule</DrawerTitle>
              <p class="text-body-sm text-[var(--text-muted)]">
                Handle the conditional execution of behaviors through logical operators.
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset
              class="m-0 flex min-w-0 flex-col gap-[var(--spacing-lg)] border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Create rule</legend>

              <!-- Section: General (ItemGroup) -->
              <section class="flex flex-col gap-[var(--spacing-sm)]">
                <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
                  General
                </p>
                <CardBox :padded="false">
                  <template #content>
                    <Item.List>
                      <Item size="small" class="items-start">
                        <Item.Content>
                          <Item.Title>Name</Item.Title>
                          <Item.Description>
                            Give a unique and descriptive name to identify the rule.
                          </Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <div class="flex w-full max-w-[var(--container-sm)] flex-col gap-[var(--spacing-xs)]">
                            <InputText
                              v-model="form.name"
                              size="large"
                              :disabled="submitting"
                              class="w-full"
                              aria-label="Name"
                              placeholder="My rule"
                              :required="nameError"
                              :aria-describedby="nameError ? 'rule-name-error' : undefined"
                            />
                            <HelperText
                              v-if="nameError"
                              id="rule-name-error"
                              kind="required"
                              label="Name is required."
                            />
                          </div>
                        </Item.Actions>
                      </Item>

                      <Item size="small" class="items-start">
                        <Item.Content>
                          <Item.Title>Description</Item.Title>
                          <Item.Description>
                            Add a short description or comment to the rule.
                          </Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <InputText
                            v-model="form.description"
                            size="large"
                            :disabled="submitting"
                            class="w-full max-w-[var(--container-sm)]"
                            aria-label="Description"
                            placeholder="Optional"
                          />
                        </Item.Actions>
                      </Item>
                    </Item.List>
                  </template>
                </CardBox>
              </section>

              <!-- Section: Phase (ItemGroup with radio blocks) -->
              <section class="flex flex-col gap-[var(--spacing-sm)]">
                <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
                  Phase
                </p>
                <CardBox :padded="false">
                  <template #content>
                    <div class="flex flex-col gap-[var(--spacing-md)] p-[var(--spacing-md)]">
                      <p class="text-body-sm text-[var(--text-muted)]">
                        Select the phase of the execution of the rule.
                      </p>
                      <div class="flex flex-col gap-[var(--spacing-xs)]">
                        <FieldRadioBlock
                          v-model="form.phase"
                          value="request"
                          name="rule-phase"
                          input-id="rule-phase-request"
                          label="Request Phase"
                          description="Configure the requests made to the edge."
                          :disabled="submitting"
                        />
                        <FieldRadioBlock
                          v-model="form.phase"
                          value="response"
                          name="rule-phase"
                          input-id="rule-phase-response"
                          label="Response Phase"
                          description="Configure the responses delivered to end-users."
                          :disabled="submitting"
                        />
                      </div>
                    </div>
                  </template>
                </CardBox>
              </section>

              <!-- Section: Criteria (ItemGroup with condition repeater) -->
              <section class="flex flex-col gap-[var(--spacing-sm)]">
                <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
                  Criteria
                </p>
                <CardBox :padded="false">
                  <template #content>
                    <div class="flex flex-col gap-[var(--spacing-lg)] p-[var(--spacing-md)]">
                      <p class="text-body-sm text-[var(--text-muted)]">
                        Set the conditions to execute the rule. Add a variable, the
                        comparison operator and, if prompted, an argument.
                      </p>

                      <TransitionGroup
                        tag="div"
                        class="relative flex flex-col gap-[var(--spacing-lg)]"
                        v-bind="morphTransition"
                        :style="morphStyle"
                      >
                      <div
                        v-for="(group, gIdx) in form.criteria"
                        :key="group.id"
                        data-drag-row
                        :data-dragging="isDragging('criteria', gIdx) || null"
                        :data-drop="isDropTarget('criteria', gIdx) || null"
                        :class="['flex flex-col gap-[var(--spacing-sm)]', dragRowClass]"
                        @dragenter.prevent="onDragEnter('criteria', gIdx)"
                        @dragover.prevent
                        @drop="dropOnCriteria(gIdx)"
                      >
                        <div class="flex items-center gap-[var(--spacing-xs)]">
                          <!-- Grip: hold to drag the whole criteria group; the
                               move buttons remain for click / keyboard / touch. -->
                          <span
                            v-if="form.criteria.length > 1"
                            role="button"
                            tabindex="0"
                            aria-label="Drag to reorder criteria, or use arrow keys"
                            draggable="true"
                            :class="[GRIP_CLASS, 'size-8']"
                            @dragstart="onDragStart('criteria', gIdx, $event)"
                            @dragend="onDragEnd"
                            @keydown.up.prevent="moveCriteria(gIdx, -1)"
                            @keydown.down.prevent="moveCriteria(gIdx, 1)"
                          >
                            <i class="pi pi-bars" aria-hidden="true" />
                          </span>
                          <span class="text-overline-sm text-[var(--text-muted)]">
                            {{ gIdx === 0 ? "If" : "Or" }}
                          </span>
                          <span class="h-px flex-1 bg-[var(--border-default)]" />
                          <!-- Group-level reorder — surfaced only when there is
                               more than one criteria group to move. -->
                          <div
                            v-if="form.criteria.length > 1"
                            class="flex items-center gap-[var(--spacing-xxs)]"
                          >
                            <Tooltip text="Move criteria up">
                              <IconButton
                                icon="pi pi-arrow-up"
                                kind="outlined"
                                size="small"
                                aria-label="Move criteria up"
                                :disabled="submitting || gIdx === 0"
                                @click="moveCriteria(gIdx, -1)"
                              />
                            </Tooltip>
                            <Tooltip text="Move criteria down">
                              <IconButton
                                icon="pi pi-arrow-down"
                                kind="outlined"
                                size="small"
                                aria-label="Move criteria down"
                                :disabled="submitting || gIdx === form.criteria.length - 1"
                                @click="moveCriteria(gIdx, 1)"
                              />
                            </Tooltip>
                          </div>
                        </div>

                        <!-- Nested conditions: a left border rail + indentation
                             segments the group's conditions from the "If"/"Or"
                             header, marking them as nested inside the group. The
                             rail closes with a bottom segment and a rounded
                             bottom-left corner (`--shape-card`), so it reads as
                             one connected bracket wrapping the group rather than a
                             loose vertical line. Border tokens (`--border-muted`)
                             at the default width keep the adornment theme-aware. -->
                        <div class="ml-[var(--spacing-xs)] flex flex-col gap-[var(--spacing-sm)] rounded-bl-[var(--shape-card)] border-b-[length:var(--border-width-default)] border-l-[length:var(--border-width-default)] border-[var(--border-muted)] pb-[var(--spacing-md)] pl-[var(--spacing-md)]">
                        <TransitionGroup
                          tag="div"
                          class="relative flex flex-col gap-[var(--spacing-sm)]"
                          v-bind="morphTransition"
                          :style="morphStyle"
                        >
                          <div
                            v-for="(cond, cIdx) in group.conditions"
                            :key="cond.id"
                            data-drag-row
                            :data-dragging="isDragging('cond-' + gIdx, cIdx) || null"
                            :data-drop="isDropTarget('cond-' + gIdx, cIdx) || null"
                            :class="['flex flex-col gap-[var(--spacing-xxs)]', dragRowClass]"
                            @dragenter.prevent="onDragEnter('cond-' + gIdx, cIdx)"
                            @dragover.prevent
                            @drop="dropOnCondition(gIdx, cIdx)"
                          >
                            <span
                              v-if="cIdx > 0"
                              class="text-label-sm text-[var(--text-muted)]"
                            >
                              {{ cond.join === "or" ? "Or" : "And" }}
                            </span>
                          <div class="grid grid-cols-1 items-start gap-[var(--spacing-xs)] sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
                            <InputText
                              v-model="cond.variable"
                              size="large"
                              class="w-full font-code"
                              aria-label="Variable"
                              placeholder="${uri}"
                              :disabled="submitting"
                              :required="submitted && !cond.variable.trim()"
                            >
                              <template #iconLeft>
                                <i class="pi pi-search" aria-hidden="true" />
                              </template>
                            </InputText>

                            <Select
                              v-model="cond.operator"
                              size="large"
                              class="w-full"
                              :disabled="submitting"
                              :display-value="operatorLabel"
                            >
                              <Select.Trigger aria-label="Operator" />
                              <!-- z workaround: Select.Content teleports to body at
                                   z-50, behind the Drawer panel (z-[1001]). -->
                              <Select.Content class="!z-[1002]">
                                <Select.Option
                                  v-for="op in OPERATORS"
                                  :key="op.value"
                                  :value="op.value"
                                >
                                  {{ op.label }}
                                </Select.Option>
                              </Select.Content>
                            </Select>

                            <InputText
                              v-model="cond.argument"
                              size="large"
                              class="w-full"
                              aria-label="Argument"
                              :disabled="submitting"
                            />

                            <!-- Row controls at the fields' size (large) to keep the
                                 horizontal rhythm: drag grip + reorder + remove. -->
                            <div class="flex items-center gap-[var(--spacing-xxs)]">
                              <span
                                v-if="group.conditions.length > 1"
                                role="button"
                                tabindex="0"
                                aria-label="Drag to reorder condition, or use arrow keys"
                                draggable="true"
                                :class="[GRIP_CLASS, 'size-10']"
                                @dragstart="onDragStart('cond-' + gIdx, cIdx, $event)"
                                @dragend="onDragEnd"
                                @keydown.up.prevent="moveCondition(gIdx, cIdx, -1)"
                                @keydown.down.prevent="moveCondition(gIdx, cIdx, 1)"
                              >
                                <i class="pi pi-bars" aria-hidden="true" />
                              </span>
                              <Tooltip text="Move condition up">
                                <IconButton
                                  icon="pi pi-arrow-up"
                                  kind="outlined"
                                  size="large"
                                  aria-label="Move condition up"
                                  :disabled="submitting || cIdx === 0"
                                  @click="moveCondition(gIdx, cIdx, -1)"
                                />
                              </Tooltip>
                              <Tooltip text="Move condition down">
                                <IconButton
                                  icon="pi pi-arrow-down"
                                  kind="outlined"
                                  size="large"
                                  aria-label="Move condition down"
                                  :disabled="submitting || cIdx === group.conditions.length - 1"
                                  @click="moveCondition(gIdx, cIdx, 1)"
                                />
                              </Tooltip>
                              <Tooltip text="Remove condition">
                                <IconButton
                                  icon="pi pi-trash"
                                  kind="outlined"
                                  size="large"
                                  aria-label="Remove condition"
                                  :disabled="submitting || totalConditions <= 1"
                                  @click="removeCondition(gIdx, cIdx)"
                                />
                              </Tooltip>
                            </div>
                          </div>
                          </div>
                        </TransitionGroup>

                        <div class="flex items-center gap-[var(--spacing-xs)]">
                          <Button
                            type="button"
                            label="And"
                            kind="outlined"
                            size="medium"
                            icon="pi pi-plus-circle"
                            :disabled="submitting"
                            @click="addCondition(group, 'and')"
                          />
                          <Button
                            type="button"
                            label="Or"
                            kind="outlined"
                            size="medium"
                            icon="pi pi-plus-circle"
                            :disabled="submitting"
                            @click="addCondition(group, 'or')"
                          />
                        </div>
                        </div>
                      </div>
                      </TransitionGroup>

                      <Divider />

                      <div>
                        <Button
                          type="button"
                          label="Add Criteria"
                          kind="outlined"
                          size="medium"
                          icon="pi pi-plus-circle"
                          :disabled="submitting"
                          @click="addCriteria"
                        />
                      </div>
                    </div>
                  </template>
                </CardBox>
              </section>

              <!-- Section: Behaviors (ItemGroup with behavior repeater) -->
              <section class="flex flex-col gap-[var(--spacing-sm)]">
                <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
                  Behaviors
                </p>
                <CardBox :padded="false">
                  <template #content>
                    <div class="flex flex-col gap-[var(--spacing-lg)] p-[var(--spacing-md)]">
                      <p class="text-body-sm text-[var(--text-muted)]">
                        Set the behaviors the rule should perform if the conditions
                        defined in the criteria are met.
                      </p>

                      <div class="flex items-center gap-[var(--spacing-xs)]">
                        <span class="text-overline-sm text-[var(--text-muted)]">Then</span>
                        <span class="h-px flex-1 bg-[var(--border-default)]" />
                      </div>

                      <TransitionGroup
                        tag="div"
                        class="relative flex flex-col gap-[var(--spacing-sm)]"
                        v-bind="morphTransition"
                        :style="morphStyle"
                      >
                      <div
                        v-for="(behavior, bIdx) in form.behaviors"
                        :key="behavior.id"
                        data-drag-row
                        :data-dragging="isDragging('behavior', bIdx) || null"
                        :data-drop="isDropTarget('behavior', bIdx) || null"
                        :class="['flex items-start gap-[var(--spacing-xs)]', dragRowClass]"
                        @dragenter.prevent="onDragEnter('behavior', bIdx)"
                        @dragover.prevent
                        @drop="dropOnBehavior(bIdx)"
                      >
                        <Select
                          v-model="behavior.type"
                          size="large"
                          class="w-full min-w-0 flex-1"
                          :disabled="submitting"
                          :display-value="behaviorLabel"
                        >
                          <Select.Trigger aria-label="Behavior" />
                          <Select.Content class="!z-[1002]">
                            <Select.Option
                              v-for="option in BEHAVIORS"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </Select.Option>
                          </Select.Content>
                        </Select>

                        <div class="flex items-center gap-[var(--spacing-xxs)]">
                          <span
                            v-if="form.behaviors.length > 1"
                            role="button"
                            tabindex="0"
                            aria-label="Drag to reorder behavior, or use arrow keys"
                            draggable="true"
                            :class="[GRIP_CLASS, 'size-10']"
                            @dragstart="onDragStart('behavior', bIdx, $event)"
                            @dragend="onDragEnd"
                            @keydown.up.prevent="moveBehavior(bIdx, -1)"
                            @keydown.down.prevent="moveBehavior(bIdx, 1)"
                          >
                            <i class="pi pi-bars" aria-hidden="true" />
                          </span>
                          <Tooltip text="Move behavior up">
                            <IconButton
                              icon="pi pi-arrow-up"
                              kind="outlined"
                              size="large"
                              aria-label="Move behavior up"
                              :disabled="submitting || bIdx === 0"
                              @click="moveBehavior(bIdx, -1)"
                            />
                          </Tooltip>
                          <Tooltip text="Move behavior down">
                            <IconButton
                              icon="pi pi-arrow-down"
                              kind="outlined"
                              size="large"
                              aria-label="Move behavior down"
                              :disabled="submitting || bIdx === form.behaviors.length - 1"
                              @click="moveBehavior(bIdx, 1)"
                            />
                          </Tooltip>
                          <Tooltip text="Remove behavior">
                            <IconButton
                              icon="pi pi-trash"
                              kind="outlined"
                              size="large"
                              aria-label="Remove behavior"
                              :disabled="submitting || form.behaviors.length <= 1"
                              @click="removeBehavior(bIdx)"
                            />
                          </Tooltip>
                        </div>
                      </div>
                      </TransitionGroup>

                      <div>
                        <Button
                          type="button"
                          label="Add Behavior"
                          kind="outlined"
                          size="medium"
                          icon="pi pi-plus-circle"
                          :disabled="submitting"
                          @click="addBehavior"
                        />
                      </div>
                    </div>
                  </template>
                </CardBox>
              </section>

              <!-- Section: Status (ItemGroup) -->
              <section class="flex flex-col gap-[var(--spacing-sm)]">
                <p class="px-[var(--spacing-xs)] text-heading-xxs text-[var(--text-default)]">
                  Status
                </p>
                <CardBox :padded="false">
                  <template #content>
                    <Item.List>
                      <Item size="small">
                        <Item.Content>
                          <Item.Title>Active</Item.Title>
                          <Item.Description>Turn the rule on right after it is created.</Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-1 justify-end">
                          <Switch
                            v-model="form.active"
                            aria-label="Active"
                            :disabled="submitting"
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
