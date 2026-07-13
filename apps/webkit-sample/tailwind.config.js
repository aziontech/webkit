import azionPreset from '@aziontech/theme/tailwind-preset'
// The theme ships its `animate-*` utilities + `@keyframes` (popup-scale-in/out,
// fade, slide-down, …) as a Tailwind PLUGIN, not in the preset. Without it the
// webkit overlay/Select open-close transitions resolve to no-op classes.
import { animations } from '@aziontech/theme/tailwind/semantic-animations-plugin'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [azionPreset],
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    // Webkit components ship as Vue source and use Tailwind arbitrary
    // utilities, so Tailwind must scan them to generate their classes.
    // Consumed from this monorepo, so point straight at the workspace source.
    '../../packages/webkit/src/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['Proto Mono', 'monospace'],
      },
    },
  },
  plugins: [animations()],
}
