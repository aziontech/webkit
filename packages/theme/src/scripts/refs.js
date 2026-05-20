/**
 * Token reference helpers.
 */

export const tokenRef = (path) => ({ __ref: path });

export const isTokenRef = (value) => typeof value === 'object' && value !== null && '__ref' in value;
