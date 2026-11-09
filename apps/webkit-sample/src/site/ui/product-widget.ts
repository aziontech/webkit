import ProductWidget, { type ProductWidgetName } from '@aziontech/webkit/product-widget'
import { type FunctionalComponent, h, markRaw } from 'vue'

export function productWidget(name: ProductWidgetName): FunctionalComponent {
  const Widget: FunctionalComponent = (_props, { attrs }) => h(ProductWidget, { ...attrs, name })
  Widget.displayName = `ProductWidget(${name})`
  return markRaw(Widget)
}
