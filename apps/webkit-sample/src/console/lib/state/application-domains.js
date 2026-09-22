import { reactive } from 'vue'

import { applicationById } from '../data/applications'

const saved = reactive(new Map())

/**
 * The custom domains bound to an application — what this session saved, or the seed.
 *
 * @param {string} applicationId
 * @param {{ customDomains?: object[] }} [record] The application when it is not seeded,
 *   so one provisioned in this session still reads its own list.
 * @returns {{ id: string, domain: string, certificate: string }[]}
 */
export const domainsFor = (applicationId, record) => {
  const key = String(applicationId)
  if (saved.has(key)) return saved.get(key)
  return record?.customDomains ?? applicationById(key)?.customDomains ?? []
}

/**
 * Replace an application's custom domains — the Settings tab's commit.
 *
 * @param {string} applicationId
 * @param {object[]} domains
 */
export const saveDomains = (applicationId, domains) => {
  saved.set(
    String(applicationId),
    domains.map((entry) => ({ ...entry }))
  )
}
