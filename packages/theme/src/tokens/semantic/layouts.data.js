export const layoutsData = {
  'layout-boundary-inline': 'var(--spacing-lg)',
  'layout-boundary-end': 'var(--spacing-lg)',
  'layout-boundary-start': 'var(--spacing-lg)',

  'layout-section-gap': 'var(--spacing-xl)',
  'layout-group-gap': 'var(--spacing-md)',

  'layout-measure': 'var(--container-7xl)',
  'layout-measure-focused': 'var(--container-4xl)',
  'layout-measure-form': 'var(--container-4xl)',
  'layout-measure-form-create': 'var(--container-5xl)',
  'layout-measure-content': 'var(--container-3xl)',

  'layout-measure-site': 'var(--container-6xl)',
  'layout-measure-site-header': 'var(--container-7xl)',
  'layout-measure-control': 'var(--container-3xs)'
}

const COLUMN_MEASURE = {
  'layout-column': 'var(--layout-measure)',
  'layout-column-focused': 'var(--layout-measure-focused)',
  'layout-column-form': 'var(--layout-measure-form)',
  'layout-form-create': 'var(--layout-measure-form-create)',
  'layout-column-content': 'var(--layout-measure-content)'
}

const columnUtility = (measure, extra) => ({
  '--layout-column-measure': measure,
  ...extra,
  'margin-inline': 'auto',
  width: '100%',
  'max-width': 'var(--layout-column-measure)',
  '&:is(.layout-boundary, .layout-boundary-inline)': {
    'max-width': 'calc(var(--layout-column-measure) + 2 * var(--layout-boundary-inline))'
  }
})

export const layoutsUtilities = {
  'layout-boundary': {
    'padding-inline': 'var(--layout-boundary-inline)',
    'padding-block-start': 'var(--layout-boundary-start)',
    'padding-block-end': 'var(--layout-boundary-end)'
  },

  'layout-boundary-inline': {
    'padding-inline': 'var(--layout-boundary-inline)'
  },

  'layout-section-start': {
    'margin-block-start': 'var(--layout-boundary-start)',
    '&:first-child': { 'margin-block-start': '0' }
  },

  'layout-group-start': {
    'margin-block-start': 'var(--layout-group-gap)',
    '&:first-child': { 'margin-block-start': '0' }
  },

  ...Object.fromEntries(
    Object.entries(COLUMN_MEASURE).map(([name, measure]) => [
      name,
      columnUtility(
        measure,
        name === 'layout-form-create'
          ? { '--layout-measure-control': 'var(--container-md)' }
          : undefined
      )
    ])
  ),

  'layout-column-site': {
    'margin-inline': 'auto',
    width: '100%',
    'max-width': 'min(var(--layout-measure-site), 100% - 2 * var(--layout-boundary-inline))'
  },

  'layout-field-control': {
    '&:not(#\\#)': {
      display: 'flex',
      flex: '1 1 0%',
      'justify-content': 'flex-end',
      'max-width': 'var(--layout-measure-control)'
    }
  }
}

export default { layoutsData, layoutsUtilities }
