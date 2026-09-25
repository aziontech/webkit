// Compound API (see .claude/rules/compound-api.md). The explicit CompoundHero
// annotation makes declaration emit reference the sub-component types instead
// of expanding the root's private Props.
import Hero from './hero.vue'
import HeroTitle from './hero-title/hero-title.vue'

type CompoundHero = typeof Hero & {
  Title: typeof HeroTitle
}

const HeroRoot = Object.assign(Hero, {
  Title: HeroTitle
}) as CompoundHero

export default HeroRoot
