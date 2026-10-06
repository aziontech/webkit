import { reactive } from 'vue'

import { applicationById } from '../data/applications'

const saved = reactive(new Map())

export const domainsFor = (applicationId, record) => {
  const key = String(applicationId)
  if (saved.has(key)) return saved.get(key)
  return record?.customDomains ?? applicationById(key)?.customDomains ?? []
}

export const saveDomains = (applicationId, domains) => {
  saved.set(
    String(applicationId),
    domains.map((entry) => ({ ...entry }))
  )
}
