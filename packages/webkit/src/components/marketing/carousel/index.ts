import Carousel from './carousel.vue'
import CarouselItem from './carousel-item/carousel-item.vue'
import CarouselNext from './carousel-next/carousel-next.vue'
import CarouselPrevious from './carousel-previous/carousel-previous.vue'

type CompoundCarousel = typeof Carousel & {
  Item: typeof CarouselItem
  Previous: typeof CarouselPrevious
  Next: typeof CarouselNext
}

const CarouselRoot = Object.assign(Carousel, {
  Item: CarouselItem,
  Previous: CarouselPrevious,
  Next: CarouselNext
}) as CompoundCarousel

export default CarouselRoot
export { CarouselItem, CarouselNext, CarouselPrevious }
