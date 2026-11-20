import { defineAsyncComponent } from 'vue'

import PromptInput from './prompt-input.vue'
import PromptInputAttachButton from './prompt-input-attach-button/prompt-input-attach-button.vue'
import type PromptInputContextPicker from './prompt-input-context-picker/prompt-input-context-picker.vue'
import PromptInputDictateButton from './prompt-input-dictate-button/prompt-input-dictate-button.vue'
import type PromptInputModelPicker from './prompt-input-model-picker/prompt-input-model-picker.vue'
import type PromptInputTools from './prompt-input-tools/prompt-input-tools.vue'

type CompoundPromptInput = typeof PromptInput & {
  AttachButton: typeof PromptInputAttachButton
  DictateButton: typeof PromptInputDictateButton
  ModelPicker: typeof PromptInputModelPicker
  ContextPicker: typeof PromptInputContextPicker
  Tools: typeof PromptInputTools
}

const PromptInputRoot = Object.assign(PromptInput, {
  AttachButton: PromptInputAttachButton,
  DictateButton: PromptInputDictateButton,
  ModelPicker: defineAsyncComponent(
    () => import('./prompt-input-model-picker/prompt-input-model-picker.vue')
  ),
  ContextPicker: defineAsyncComponent(
    () => import('./prompt-input-context-picker/prompt-input-context-picker.vue')
  ),
  Tools: defineAsyncComponent(() => import('./prompt-input-tools/prompt-input-tools.vue'))
}) as CompoundPromptInput

export default PromptInputRoot
export { PromptInputAttachButton, PromptInputDictateButton }
export type {
  PromptInputFile,
  PromptInputMenu,
  PromptInputMenuOption,
  PromptInputProps,
  PromptInputReference,
  PromptInputRejectReason,
  PromptInputStatus
} from './prompt-input.vue'
export type { PromptInputAttachButtonProps } from './prompt-input-attach-button/prompt-input-attach-button.vue'
export type { PromptInputContextPickerProps } from './prompt-input-context-picker/prompt-input-context-picker.vue'
export type {
  PromptInputDictateButtonProps,
  PromptInputDictateTranscriber
} from './prompt-input-dictate-button/prompt-input-dictate-button.vue'
export type { PromptInputModelPickerProps } from './prompt-input-model-picker/prompt-input-model-picker.vue'
export type { PromptInputToolsProps } from './prompt-input-tools/prompt-input-tools.vue'
