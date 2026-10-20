import { inject } from 'vue'

export const VERSION_COMMIT_KEY = Symbol('VersionCommit')

export const VERSION_CHANGE_KEY = Symbol('VersionChange')

export const useVersionChange = () => inject(VERSION_CHANGE_KEY, () => {})
