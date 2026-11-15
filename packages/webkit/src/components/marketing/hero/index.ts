import Hero from './hero.vue'
import HeroTitle from './hero-title/hero-title.vue'

type CompoundHero = typeof Hero & {
  Title: typeof HeroTitle
}

const HeroRoot = Object.assign(Hero, {
  Title: HeroTitle
}) as CompoundHero

export default HeroRoot
export { HeroTitle }
export type { HeroAlign, HeroKind, HeroMediaAlign, HeroSize, HeroWidth } from './hero.vue'
export type {
  HeroTitleAlign,
  HeroTitleEyebrowPrefix,
  HeroTitleSize,
  HeroTitleWidth
} from './hero-title/hero-title.vue'
