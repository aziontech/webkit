import type {
  ConversationHistoryItem,
  ConversationHistoryProject
} from '@aziontech/webkit/conversation-history'
import { ref } from 'vue'

import { sampleHistory, sampleProjects } from '../blocks/ai-chat.sample'

export const copilotChats = ref<ConversationHistoryItem[]>(
  sampleHistory.map((item) => ({ ...item }))
)

export const copilotProjects = ref<ConversationHistoryProject[]>(
  sampleProjects.map((project) => ({ ...project }))
)

export const copilotOpenKeys = ref<string[]>(['storefront'])
