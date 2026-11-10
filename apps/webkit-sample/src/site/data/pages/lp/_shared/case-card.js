import { successCaseLink } from '../../../success-case-articles.js'
import { SUCCESS_CASES } from '../../../success-cases.js'

export const caseCard = (key, { title, description = '', meta, linked = true }) => {
  const story = SUCCESS_CASES.find((entry) => entry.key === key)
  return {
    key,
    ...(linked ? successCaseLink(story) : {}),
    title,
    description,
    meta,
    mark: story.client
  }
}
