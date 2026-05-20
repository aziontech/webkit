import Spinner from '@aziontech/webkit/utils/spinner'

export default {
  title: 'Webkit/Utils/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    },
    docs: {
      description: {
        component:
          'Loading indicator used by Webkit action components. Default size is 14px (`size-3.5`); color inherits `currentColor` from the parent.'
      }
    }
  }
}

export const Sizes = {
  render: () => ({
    components: { Spinner },
    template: `
      <Spinner class="size-3.5 text-[var(--text-default)]" />
    `
  })
}
