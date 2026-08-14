// Shared form plumbing for the console's settings pages.
//
// A settings page commits as ONE PAGE: its bands describe one record, so they share one
// submitting flag, one baseline and one bar (../components/ui/SettingsSaveBar.vue). The
// two helpers below are that plumbing — `saveGroup` commits a scope, `useBaseline` decides
// when there is anything to commit.
//
// The name `saveGroup` is historical: it was written for the retired
// "ItemGroup with independent saves" shape, where each band owned a footer Save. Every
// internal settings surface now passes it the WHOLE page. The /forms pattern gallery still
// uses it per band, which is what keeps the name honest — it commits a scope, and on a
// settings page that scope is the page.
import { toast } from "@aziontech/webkit/toast";
import { computed, ref } from "vue";

// Stand-in for a request round-trip, so a save can be seen locking its group.
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Commit one scope — on a settings page, the whole page.
 *
 * The scope owns a `submitting` flag: its fields and its Save disable while the request
 * runs. The flag is also the re-entrancy lock, and it is released in `finally` — on success
 * AND on failure — so a failed save never leaves the page permanently disabled.
 *
 * `commit` refreshes the saved baseline, which is what takes the save bar away again until
 * the next edit (an unchanged page has nothing to save). It runs only on success, so a
 * failed save keeps the page dirty and retryable.
 *
 * @param {import('vue').Ref<boolean>} flag The scope's `submitting` ref.
 * @param {string} message Success toast.
 * @param {() => void} commit Refreshes the group's dirty-tracking baseline.
 */
export const saveGroup = async (flag, message, commit) => {
  if (flag.value) return; // per-group re-entrancy lock
  flag.value = true;
  try {
    await sleep(900);
    commit();
    toast.success(message);
  } catch (error) {
    toast.error("Could not save the settings.", {
      description: error?.message ?? "Check your connection and try again.",
    });
  } finally {
    flag.value = false; // release on success AND failure
  }
};

/**
 * Snapshot-based dirty tracking for one editable scope.
 *
 * The scope is dirty only while its live values diverge from the last committed snapshot —
 * so the save bar is absent on arrival, mounts on the first real edit, and leaves the
 * moment the save lands. Pair with `saveGroup`, passing `commit` as its third argument.
 *
 * It reports dirtiness but does not hand the snapshot back, so a page that offers Discard
 * keeps its own copy to restore from.
 *
 * The same `dirty` is what the leave guard reads
 * (../components/ui/UnsavedChangesGuard.vue). On a page whose commit CREATES something —
 * a create page — nothing re-snapshots on its own, so `commit()` is called on the way OUT
 * of a successful create: the page's own navigation must not be stopped by the guard that
 * exists to protect the input that create just consumed.
 *
 * @param {object | (() => object)} group The reactive object being edited, or a getter
 *   returning one — for a page whose fields are separate refs rather than a single
 *   reactive record (a `ref` inside a plain object does not serialize to its value).
 * @returns {{ dirty: import('vue').ComputedRef<boolean>, commit: () => void }}
 */
export const useBaseline = (group) => {
  const snapshot = () => JSON.stringify(typeof group === "function" ? group() : group);
  const baseline = ref(snapshot());
  return {
    dirty: computed(() => snapshot() !== baseline.value),
    commit: () => {
      baseline.value = snapshot();
    },
  };
};
