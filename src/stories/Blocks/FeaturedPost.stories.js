import FeaturedPost from '../../templates/featuredpost';
import data from '../../mock/featuredPost.js'

export default {
  title: 'Azion Web Kit/Blocks/Featured Post',
  component: FeaturedPost,
  tags: ['autodocs'],
  argTypes: {
    linkTarget: {
      control: {
        type: 'select',
      },
      options: ['_self', '_blank']
    },
  }
};

// More on writing stories with args: https://storybook.js.org/docs/vue/writing-stories/args
export const Default = {
  args: data
};



