// Shared filter-control helpers for the console's list and catalog views.

/**
 * A `:display-value` resolver for a multiple `<Select>` used as a filter.
 *
 * No selection means "no narrowing", so the placeholder ("All Authors") reads as
 * the state of the data rather than as an empty field. One selection shows that
 * option's label; more than one collapses to "N selected" so the trigger cannot
 * outgrow its column.
 *
 * @param {string} allLabel Label for the empty (unfiltered) state.
 * @param {Array<{ value: unknown, label: string }>} options
 * @returns {(values: unknown[]) => string}
 */
export const filterDisplay = (allLabel, options) => (values) => {
  if (!values.length) return allLabel;
  if (values.length === 1) {
    const match = options.find((option) => option.value === values[0]);
    return match ? match.label : String(values[0]);
  }
  return `${values.length} selected`;
};
