import Field from './field.vue'
import FieldContent from './field-content/field-content.vue'
import FieldDescription from './field-description/field-description.vue'
import FieldError from './field-error/field-error.vue'
import FieldGroup from './field-group/field-group.vue'
import FieldLabel from './field-label/field-label.vue'
import FieldLegend from './field-legend/field-legend.vue'
import FieldSeparator from './field-separator/field-separator.vue'
import FieldSet from './field-set/field-set.vue'
import FieldTitle from './field-title/field-title.vue'

export default Object.assign(Field, {
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
  Group: FieldGroup,
  Set: FieldSet,
  Legend: FieldLegend,
  Content: FieldContent,
  Title: FieldTitle,
  Separator: FieldSeparator
})

export {
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle
}
export type { FieldLegendKind } from './field-legend/field-legend.vue'
export type { FieldOrientation } from './injection-key'
