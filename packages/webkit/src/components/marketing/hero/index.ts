import Hero from './hero.vue'
import HeroTitle from './hero-title/hero-title.vue'

type CompoundHero = typeof Hero & {
  Title: typeof HeroTitle
}

const HeroRoot = Object.assign(Hero, {
  Title: HeroTitle
}) as CompoundHero

export default HeroRoot
