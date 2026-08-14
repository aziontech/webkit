<script setup>
// The app's single toast region, and the one place a toast's ANATOMY is
// decided.
//
// The default anatomy carries at most one action, which is right for almost
// every toast: a report the user reads and lets expire. A failed deployment is
// the exception, and the reason this component exists. It reaches the user
// somewhere else in the console, minutes after they left the screen that
// started it, so the toast is the ONLY thing on screen that knows the
// deployment exists. Dismiss it with one action and the failure is gone with
// nowhere to go back to.
//
// So a failed run gets a two-action anatomy, and the two are not
// interchangeable — they answer different questions:
//
//   | Control          | Answers                      | Weight       |
//   | ---------------- | ---------------------------- | ------------ |
//   | Redeploy         | "fix it, from here"          | secondary    |
//   | View deployments | "take me where I can look"   | text link    |
//   | ✕ (close)        | "not now"                    | icon, quiet  |
//
// Redeploy leads because it resolves the failure without a detour. "View
// deployments" is the ESCAPE: the toast is transient, the Deployments module is
// not, so the user is never left holding the only reference to the failure in a
// card that can be closed. And because the error toast never auto-dismisses,
// the close control is mandatory — anything permanent has to be dismissible.
//
// Navigation and retry live HERE rather than in `deploy-runs.js` on purpose:
// the run store owns lifecycle and state, this component owns what the user can
// press and where it takes them (`useRouter` is only available here anyway).
// Every non-deployment toast falls back to the standard anatomy below.
//
// LAYOUT NOTE: the deployment toasts put their actions in a row UNDER the copy
// rather than in ToastItem's `trailing` slot. `trailing` sits beside the text
// and does not shrink, so a second control there costs the message most of the
// card's 356px — measured: the title broke onto four lines. Only the ✕ stays
// beside the text, where a single 24px control is free.
import Button from "@aziontech/webkit/button";
import Toaster from "@aziontech/webkit/toast";
import ToastAction from "@aziontech/webkit/toast-action";
import ToastClose from "@aziontech/webkit/toast-close";
import ToastDescription from "@aziontech/webkit/toast-description";
import ToastItem from "@aziontech/webkit/toast-item";
import ToastTitle from "@aziontech/webkit/toast-title";
import { useRoute, useRouter } from "vue-router";

import { redeployRun, runByToastId } from "../../lib/deploy-runs";

const route = useRoute();
const router = useRouter();

// A run reports through one stable toast id, so the id is the whole lookup.
const failedRun = (entry) => {
  const run = runByToastId(entry.id);
  return run?.status === "error" ? run : null;
};

const successRun = (entry) => {
  const run = runByToastId(entry.id);
  return run?.status === "success" ? run : null;
};

// Keep the signed-in user across the jump, like every other navigation here.
const go = (path, query = {}) =>
  router.push({
    path,
    query: { email: route.query.email || "myemail@azion.com", ...query },
  });

const retry = (run) => redeployRun(run.id);

// Success shortcut: whatever the run actually left behind.
//
//   a resource deploy → the DEPLOYMENT's own page (the pipeline it just ran); the
//     resource already existed, so what is new is this deployment of it;
//   a clone          → the provisioned workload, which is the thing that just
//     went live.
//
// Falls back to the module list if the record is somehow missing.
const openDeployment = (run) => {
  if (run.kind === "resource") return go(`/deployments/${run.deployId}`);
  return run.record
    ? go(`/workloads/${run.record.workload.id}`, { name: run.record.workload.name })
    : go("/deployments");
};
</script>

<template>
  <Toaster position="bottom-right">
    <template #default="{ toast: entry, dismiss }">
      <!-- Failed deployment: the recovery anatomy.
           `items-start` because these cards are always multi-line: the ✕ and
           the severity glyph belong beside the FIRST line, not floating at the
           vertical middle of a three-line card.
           (ToastItem sets `items-center` on its root and does not run consumer
           classes through `cn`, so this override wins on stylesheet order —
           Tailwind v4 emits align-items utilities alphabetically, putting
           `.items-start` after `.items-center`. Verified in the browser.) -->
      <ToastItem key="toast-item-1"
        v-if="failedRun(entry)"
        :type="entry.type"
        class="items-start"
      >
        <ToastTitle>{{ entry.message }}</ToastTitle>
        <ToastDescription v-if="entry.description">
          {{ entry.description }}
        </ToastDescription>
        <div class="flex flex-wrap items-center gap-[var(--spacing-xs)] pt-[var(--spacing-xxs)]">
          <!-- Recovery first: a redeploy settles the failure without leaving
               whatever the user is doing. Outlined, not filled: the toast is
               already a raised surface making its own claim on attention, and a
               solid button on top of it competes with the page's real primary
               action. Outlined reads as the action here without shouting. -->
          <Button
            label="Redeploy"
            kind="outlined"
            size="small"
            @click="retry(failedRun(entry))"
          />
          <!-- The escape hatch — somewhere durable to go before this card is
               dismissed and the failure has no surface left. Text keeps it a
               clear step below Redeploy. -->
          <ToastAction
            label="View deployments"
            @click="
              () => {
                go('/deployments');
                dismiss();
              }
            "
          />
        </div>
        <template #trailing>
          <ToastClose @click="dismiss" />
        </template>
      </ToastItem>

      <!-- Finished deployment: one shortcut to what was just created. Outlined
           for the same reason, so the primary action of a deployment toast
           looks the same whichever way the run ended. -->
      <ToastItem key="toast-item-2"
        v-else-if="successRun(entry)"
        :type="entry.type"
        class="items-start"
      >
        <ToastTitle>{{ entry.message }}</ToastTitle>
        <ToastDescription v-if="entry.description">
          {{ entry.description }}
        </ToastDescription>
        <div class="flex items-center pt-[var(--spacing-xxs)]">
          <Button
            label="View deployment"
            kind="outlined"
            size="small"
            @click="
              () => {
                openDeployment(successRun(entry));
                dismiss();
              }
            "
          />
        </div>
        <template #trailing>
          <ToastClose v-if="entry.closable" @click="dismiss" />
        </template>
      </ToastItem>

      <!-- Everything else: the standard anatomy, unchanged. -->
      <ToastItem key="toast-item-3" v-else :type="entry.type">
        <ToastTitle>{{ entry.message }}</ToastTitle>
        <ToastDescription v-if="entry.description">
          {{ entry.description }}
        </ToastDescription>
        <template v-if="entry.action || entry.closable" #trailing>
          <ToastAction
            v-if="entry.action"
            :label="entry.action.label"
            @click="(event) => entry.action.onClick(event)"
          />
          <ToastClose v-if="entry.closable" @click="dismiss" />
        </template>
      </ToastItem>
    </template>
  </Toaster>
</template>
