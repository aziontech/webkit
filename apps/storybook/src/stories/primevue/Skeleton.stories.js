import Skeleton from '@aziontech/webkit/skeleton';

export default {
  title: 'PrimeVue/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: 'text',
      description: 'Width of the skeleton'
    },
    height: {
      control: 'text',
      description: 'Height of the skeleton'
    },
    shape: {
      control: 'select',
      options: ['rectangle', 'circle'],
      description: 'Shape of the skeleton'
    },
    animation: {
      control: 'select',
      options: ['wave', 'none'],
      description: 'Animation type'
    }
  }
};

export const Basic = {
  args: {
    width: '100%',
    height: '1.5rem'
  }
};

export const Shapes = {
  render: () => ({
    components: { Skeleton },
    template: `
      <div class="flex items-end gap-4">
        <Skeleton width="2rem" height="2rem" shape="circle" />
        <Skeleton width="100px" height="2rem" shape="rectangle" />
      </div>
    `
  })
};

export const CardSkeleton = {
  render: () => ({
    components: {Skeleton},
    template: `
      <div class="border border-surface rounded p-4">
        <div class="flex mb-3">
          <Skeleton shape="circle" size="4rem" class="mr-2" />
          <div class="mt-2">
            <Skeleton width="10rem" class="mb-2" />
            <Skeleton width="5rem" class="mb-2" />
            <Skeleton width="2rem" height=".5rem" />
          </div>
        </div>
        <Skeleton width="100%" height="150px" class="mb-2" />
        <div class="flex justify-content-between mt-3">
          <Skeleton width="5rem" height="2rem" />
          <Skeleton width="5rem" height="2rem" />
        </div>
      </div>
    `
  })
};

export const ListSkeleton = {
  render: () => ({
    components: {Skeleton},
    template: `
      <div class="flex flex-col gap-3">
        <div class="flex items-center">
          <Skeleton shape="circle" size="3rem" class="mr-3" />
          <div class="flex-1">
            <Skeleton width="80%" class="mb-2" />
            <Skeleton width="60%" />
          </div>
        </div>
        <div class="flex items-center">
          <Skeleton shape="circle" size="3rem" class="mr-3" />
          <div class="flex-1">
            <Skeleton width="80%" class="mb-2" />
            <Skeleton width="60%" />
          </div>
        </div>
        <div class="flex items-center">
          <Skeleton shape="circle" size="3rem" class="mr-3" />
          <div class="flex-1">
            <Skeleton width="80%" class="mb-2" />
            <Skeleton width="60%" />
          </div>
        </div>
      </div>
    `
  })
};
