import Carousel from '@aziontech/webkit/carousel';

export default {
  title: 'Core/PrimeVue/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  argTypes: {
    numVisible: {
      control: 'number',
      description: 'Number of visible items'
    },
    numScroll: {
      control: 'number',
      description: 'Number of items to scroll'
    },
    circular: {
      control: 'boolean',
      description: 'Enable circular navigation'
    },
    autoplayInterval: {
      control: 'number',
      description: 'Autoplay interval in milliseconds'
    }
  }
};

export const Basic = {
  render: () => ({
    components: { Carousel },
    data() {
      return {
        products: [
          { name: 'Product 1', price: '$10' },
          { name: 'Product 2', price: '$20' },
          { name: 'Product 3', price: '$30' },
          { name: 'Product 4', price: '$40' },
          { name: 'Product 5', price: '$50' }
        ]
      };
    },
    template: `
      <Carousel :value="products" :numVisible="3" :numScroll="1" :responsiveOptions="[]">
        <template #item="slotProps">
          <div class="border border-surface rounded p-4 m-2">
            <h3>{{ slotProps.data.name }}</h3>
            <p>{{ slotProps.data.price }}</p>
          </div>
        </template>
      </Carousel>
    `
  })
};

export const Circular = {
  render: () => ({
    components: { Carousel },
    data() {
      return {
        items: Array.from({ length: 9 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }))
      };
    },
    template: `
      <Carousel :value="items" :numVisible="2" :numScroll="1" :circular="true">
        <template #item="slotProps">
          <div class="border border-surface rounded p-4 m-2 text-center">
            {{ slotProps.data.name }}
          </div>
        </template>
      </Carousel>
    `
  })
};

export const WithAutoplay = {
  render: () => ({
    components: { Carousel },
    data() {
      return {
        images: [
          'https://picsum.photos/200/300?random=1',
          'https://picsum.photos/200/300?random=2',
          'https://picsum.photos/200/300?random=3',
          'https://picsum.photos/200/300?random=4'
        ]
      };
    },
    template: `
      <Carousel :value="images" :numVisible="1" :numScroll="1" :circular="true" :autoplayInterval="3000">
        <template #item="slotProps">
          <div class="m-2">
            <img :src="slotProps.data" alt="Image" class="w-full rounded" />
          </div>
        </template>
      </Carousel>
    `
  })
};
