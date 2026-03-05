import { config } from '@vue/test-utils';

// Disable transitions globally to avoid DOM manipulation issues
config.global.stubs = {
  transition: false,
  'transition-group': false,
};
