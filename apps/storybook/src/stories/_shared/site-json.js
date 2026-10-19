/**
 * Docs-only story that carries a block's page-JSON entry as its source.
 *
 * @param {object} section - the `sections[]` entry, `{ _id, props }`.
 * @returns {object} a CSF story; spread it next to a literal `tags: ['!dev']`.
 */
export const siteJsonStory = (section) => ({
  render: () => ({ template: '<div />' }),
  parameters: {
    docs: { source: { code: JSON.stringify(section, null, 2), language: 'json' } }
  }
})
