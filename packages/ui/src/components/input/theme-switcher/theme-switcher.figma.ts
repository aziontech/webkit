// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=5721-5138
// source=https://github.com/aziontech/webkit/blob/main/packages/ui/src/components/input/theme-switcher/theme-switcher.vue
// component=ThemeSwitcher
import figma from 'figma'

export default {
  example: figma.code`<ThemeSwitcher v-model="theme" />`,
  imports: ["import ThemeSwitcher from '@aziontech/ui/theme-switcher'"],
  id: 'theme-switcher',
  metadata: { nestable: true }
}
