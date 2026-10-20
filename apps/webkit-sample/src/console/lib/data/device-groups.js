import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt } from '@shared/lib/people'
import { ref } from 'vue'

export const DEVICE_GROUP_NAME_PATTERN = /^[a-z0-9]+$/

export const DEVICE_GROUP_NAME_RULE =
  'Lowercase letters and numbers only. Spaces, uppercase and special characters are rejected.'

const decorate = ({ modifiedAt, ...group }, index = 0) => {
  const person = authorAt(index)
  return {
    ...group,
    modifiedAt,
    lastModified: formatListDate(modifiedAt),
    author: person.name,
    authorAvatar: person.avatar
  }
}

const deviceGroups = ref(
  [
    {
      id: 'dg-mobile',
      name: 'mobiledevices',
      userAgent: '(Mobile|iPhone|Android|BlackBerry)',
      modifiedAt: daysAgo(18)
    },
    {
      id: 'dg-desktop',
      name: 'desktop',
      userAgent: 'Mozilla.*(Windows|Macintosh)',
      modifiedAt: daysAgo(44)
    }
  ].map(decorate)
)

export const useDeviceGroups = () => deviceGroups

export const addDeviceGroup = ({ name, userAgent }) => {
  const modifiedAt = new Date()
  const record = decorate({ id: `dg-${modifiedAt.getTime()}`, name, userAgent, modifiedAt })
  deviceGroups.value = [record, ...deviceGroups.value]
  return record
}

export const updateDeviceGroup = (id, { name, userAgent }) => {
  const modifiedAt = new Date()
  let updated
  deviceGroups.value = deviceGroups.value.map((group) => {
    if (group.id !== id) return group
    updated = decorate({ id, name, userAgent, modifiedAt })
    return updated
  })
  return updated
}

export const deviceGroupOptions = () =>
  deviceGroups.value.map((group) => ({ label: group.name, value: group.id }))
