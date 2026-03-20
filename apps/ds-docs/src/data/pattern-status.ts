/**
 * Pattern Status Data
 *
 * Centralized data source for tracking pattern progress across design and code.
 * Same structure as component-status for use with ComponentsStatusTable.
 */

import type { ComponentStatusItem } from './component-status';

/**
 * Pattern status data for the Patterns Status table.
 * Reuses ComponentStatusItem shape so we can use ComponentsStatusTable.
 */
export const patternStatusData: ComponentStatusItem[] = [
  {
    name: 'Criação com Sucesso',
    slug: 'success-creation',
    href: '/patterns/success-creation/',
    designStatus: 'done',
    codeStatus: 'documenting',
    launchVersion: null,
    planned: false,
    category: 'feedback',
  },
];
