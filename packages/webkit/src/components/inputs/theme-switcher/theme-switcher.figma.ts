// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=5721-5138
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/inputs/theme-switcher/theme-switcher.vue
// component=ThemeSwitcher
import figma from 'figma'

export default {
  example: figma.code`<ThemeSwitcher v-model:value="theme" />`,
  imports: ["import ThemeSwitcher from '@aziontech/webkit/theme-switcher'"],
  id: 'theme-switcher',
  metadata: { nestable: true }
}
