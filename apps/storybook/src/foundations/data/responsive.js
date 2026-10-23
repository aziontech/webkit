import { breakpointSteps, declarations, toPx } from './theme-css.js'

const STEPS = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl']

function responsiveFamily({ title, description = '', pattern, preview, tailwind }) {
  const tokens = [...declarations]
    .filter(([name]) => pattern.test(name))
    .map(([name, value]) => ({
      name,
      value: `var(${name})`,
      px: toPx(value),
      tailwind: tailwind(name),
      css: `var(${name})`,
      raw: [value, ...breakpointSteps(name).map((step) => `${step.breakpoint} ${step.value}`)].join(
        ' → '
      )
    }))
    .sort((a, b) => STEPS.indexOf(a.name.split('-').pop()) - STEPS.indexOf(b.name.split('-').pop()))
  return { title, description, preview, largest: 0, tokens }
}

export const responsiveFamilies = {
  'responsive-spacing': responsiveFamily({
    title: 'Spacing',
    pattern: new RegExp(`^--spacing-(${STEPS.join('|')})$`),
    preview: 'length',
    tailwind: (name) => `p-(${name})`
  })
}
