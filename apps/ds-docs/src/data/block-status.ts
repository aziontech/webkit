/**
 * Block Status Data
 *
 * Centralized data source for tracking block progress across design and code.
 * Same structure as component-status for use with ComponentsStatusTable.
 */

import type { ComponentStatusItem } from './component-status';

/**
 * Block status data for the Blocks Status table.
 * Reuses ComponentStatusItem shape so we can use ComponentsStatusTable.
 */
export const blockStatusData: ComponentStatusItem[] = [
  {
    name: 'Toast',
    slug: 'toast',
    href: '/blocks/toast/',
    designStatus: 'done',
    codeStatus: 'documenting',
    launchVersion: null,
    planned: false,
    category: 'feedback',
  },
];
