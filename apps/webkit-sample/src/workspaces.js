// Workspaces store — the innermost level of the tenancy chain
// (Organization → Account → Workspace).
//
// A workspace is a partition INSIDE a customer account: one product surface,
// with its own workloads, deployments and metrics. Magalu's storefront and its
// retail-media platform are the same account and the same bill, but they are
// not the same work, and an operator moving between them should not have to
// re-scope every page by hand.
//
// The level exists because the two above it answer different questions: the
// organization is who you belong to, the account is whose infrastructure you
// are operating, and the workspace is which slice of it you are looking at.
//
// Module-level singleton (like accounts.js / organizations.js), so the header
// switcher and anything downstream read one source of truth.
import { computed, ref } from "vue";

import { useAccounts } from "./accounts.js";
import { useSampleMode } from "./lib/sample-mode.js";
import { useOrganizations } from "./organizations.js";

const { accountEmpty } = useSampleMode();

// Workspaces are seeded per account: the key is the account id from
// accounts.js, so a workspace can never dangle off a tenant that isn't there.
// `workloads` is what the switcher shows under the name — the one number that
// says how much lives in a workspace before you enter it.
const seedWorkspaces = {
  // Magalu
  6: [
    { id: "magalu-ecommerce", name: "Ecommerce", workloads: 24 },
    { id: "magalu-marketplace", name: "Marketplace", workloads: 11 },
    { id: "magalu-retail-media", name: "Retail Media", workloads: 6 },
  ],
  // Madeira Madeira
  33024: [
    { id: "mm-storefront", name: "Storefront", workloads: 9 },
    { id: "mm-checkout", name: "Checkout", workloads: 4 },
  ],
  // Tray
  29025: [
    { id: "tray-platform", name: "Platform", workloads: 14 },
    { id: "tray-partners", name: "Partners", workloads: 3 },
  ],
  // LWSA
  5791: [
    { id: "lwsa-hosting", name: "Hosting", workloads: 31 },
    { id: "lwsa-email", name: "Email", workloads: 7 },
  ],
  // iFood
  31204: [
    { id: "ifood-consumer", name: "Consumer App", workloads: 18 },
    { id: "ifood-merchant", name: "Merchant Portal", workloads: 12 },
    { id: "ifood-logistics", name: "Logistics", workloads: 8 },
  ],
  // Caixa Econômica Federal
  28836: [
    { id: "caixa-banking", name: "Internet Banking", workloads: 22 },
    { id: "caixa-public", name: "Public Portal", workloads: 5 },
  ],
};

// An account with no seeded workspaces still has one: every tenant is somewhere.
const DEFAULT_WORKSPACE = { id: "default", name: "Default", workloads: 0 };

// The workspace the operator explicitly picked, or null while they are on
// whatever the current account offers first.
const selectedWorkspaceId = ref(null);

export function useWorkspaces() {
  const { currentAccount } = useAccounts();
  const { currentOrganization } = useOrganizations();

  // An organization created at signup carries its OWN workspaces — the one it
  // was given at onboarding, and any it adds later. It has no client accounts
  // beneath it (that Brand → Reseller → Group → Client tree is the hierarchy the
  // organization model replaces), so the account-keyed seeds below have nothing
  // to say about it, and the workspace the user just named must be what the
  // header shows on their first access.
  //
  // Otherwise: the workspaces of the account currently being operated. Switching
  // account switches the whole list — a workspace is meaningless outside the
  // account that owns it.
  const workspaces = computed(() => {
    // THE EMPTY VERSION HAS ONE WORKSPACE (./lib/sample-mode.js) — the default one
    // every tenant is given, holding nothing. The account-keyed seeds below all
    // describe workspaces full of workloads, which is the opposite of the version
    // being shown; an organization's OWN workspaces are equally seeded lists here.
    if (accountEmpty.value) return [DEFAULT_WORKSPACE];
    const owned = currentOrganization.value?.workspaces;
    if (owned?.length) return owned;
    return seedWorkspaces[currentAccount.value?.id] ?? [DEFAULT_WORKSPACE];
  });

  // Derived, not watched: the pick only counts while it belongs to the account
  // in scope, so switching account lands on that account's first workspace
  // instead of stranding the header on a workspace that isn't there any more.
  const currentWorkspace = computed(
    () =>
      workspaces.value.find((workspace) => workspace.id === selectedWorkspaceId.value) ??
      workspaces.value[0]
  );

  // Idempotent, like the switchers above it: re-picking the current workspace
  // is a no-op the caller can acknowledge instead of silently dismissing.
  const switchWorkspace = (workspace) => {
    const changed = workspace.id !== currentWorkspace.value?.id;
    selectedWorkspaceId.value = workspace.id;
    return changed;
  };

  return { workspaces, currentWorkspace, switchWorkspace };
}
