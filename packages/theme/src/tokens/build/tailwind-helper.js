/**
 * Tailwind helper for merging presets.
 */

import { preset } from './preset.js';

export const createTailwindConfig = (user) => ({
  ...user,
  presets: [...(user.presets ?? []), preset],
});

export default createTailwindConfig;
