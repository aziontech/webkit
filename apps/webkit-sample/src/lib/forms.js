// Shared form plumbing for the console's "ItemGroup with independent saves"
// pattern (the /form skill's Approach A).
import { toast } from "@aziontech/webkit/toast";
import { computed, ref } from "vue";

// Stand-in for a request round-trip, so a save can be seen locking its group.
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Commit ONE topic group independently.
 *
 * Every group on a settings page owns its own `submitting` flag: that group's
 * fields and its footer Save disable while its request runs, and the groups
 * beside it stay live. The flag is also the re-entrancy lock, and it is released
 * in `finally` — on success AND on failure — so a failed save never leaves a
 * group permanently disabled.
 *
 * `commit` refreshes the group's saved baseline, which is what makes its Save
 * disable again until the next edit (an unchanged group has nothing to save).
 * It runs only on success, so a failed save keeps the group dirty and retryable.
 *
 * @param {import('vue').Ref<boolean>} flag That group's `submitting` ref.
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
 * Snapshot-based dirty tracking for one editable group.
 *
 * A group is dirty only while its live values diverge from the last committed
 * snapshot — so its Save is disabled on arrival, enables on the first real edit,
 * and disables again the moment the save lands. Pair with `saveGroup`, passing
 * `commit` as its third argument.
 *
 * @param {object} group The reactive group being edited.
 * @returns {{ dirty: import('vue').ComputedRef<boolean>, commit: () => void }}
 */
export const useBaseline = (group) => {
  const baseline = ref(JSON.stringify(group));
  return {
    dirty: computed(() => JSON.stringify(group) !== baseline.value),
    commit: () => {
      baseline.value = JSON.stringify(group);
    },
  };
};
