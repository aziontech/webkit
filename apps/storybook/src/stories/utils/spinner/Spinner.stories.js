import Spinner from '@aziontech/webkit/utils/spinner'

export default {
  title: 'Utils/Spinner',
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
          'Loading indicator used by Webkit action components. Size via theme `size-*` scale (e.g. `size-4` for large buttons); color inherits `currentColor` from the parent.'
      }
    }
  }
}

export const Sizes = {
  render: () => ({
    components: { Spinner },
    template: `
      <Spinner class="size-4 text-[var(--text-default)]" />
    `
  })
}
