// CANARY — must keep failing `prettier --check`.
// Semicolons, double quotes and 4-space indent violate .prettierrc.json
// (semi: false, singleQuote: true, tabWidth: 2).
// This tree is listed in the root .prettierignore, so repo-wide
// `prettier --write` sweeps never "fix" it; the canary runner bypasses the
// ignore file with --ignore-path=/dev/null.
import { computed } from "vue";

const SIZES = ["small", "medium", "large"];

export const label = computed(() => {
    return SIZES[0];
});
