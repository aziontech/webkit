import type { AlertSeverity } from '@aziontech/ui/alert'
import { DEFAULT_PASSWORD_REQUIREMENTS } from '@aziontech/ui/password-requirements'

import type { SignInFailure, SignInNoticeKind } from '../auth-sign-in.vue'
import type { SignInCopy } from './sign-in-copy'

/** What the card notice shows. */
export interface CardNotice {
  /** The colour of the notice. */
  severity: AlertSeverity
  /** What the notice says. */
  label: string
  /** The notice offers Retry. */
  retry?: boolean
}

type FieldCopy = Pick<
  SignInCopy,
  'emailRequired' | 'passwordRequired' | 'invalidEmail' | 'weakPassword'
>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const emailError = (value: string, copy: FieldCopy) =>
  !value.trim() ? copy.emailRequired : EMAIL_PATTERN.test(value.trim()) ? '' : copy.invalidEmail

export const newPasswordError = (value: string, copy: FieldCopy) =>
  !value
    ? copy.passwordRequired
    : DEFAULT_PASSWORD_REQUIREMENTS.every((rule) => rule.test.test(value))
      ? ''
      : copy.weakPassword

const failureNotices = (copy: SignInCopy): Record<SignInFailure, CardNotice> => ({
  'bad-credentials': { severity: 'danger', label: copy.badCredentials },
  'service-unavailable': { severity: 'warning', label: copy.serviceUnavailable, retry: true },
  'server-error': { severity: 'danger', label: copy.serverError, retry: true },
  timeout: { severity: 'warning', label: copy.timeout, retry: true }
})

const outcomeNotices = (copy: SignInCopy): Record<SignInNoticeKind, CardNotice> => ({
  'session-expired': { severity: 'info', label: copy.sessionExpired },
  'signed-in': { severity: 'success', label: copy.signedIn },
  'password-updated': { severity: 'success', label: copy.passwordUpdated }
})

export const noticeFor = (error: string, notice: string, copy: SignInCopy): CardNotice | null => {
  if (error) {
    return (
      failureNotices(copy)[error as SignInFailure] ?? {
        severity: 'danger',
        label: error,
        retry: true
      }
    )
  }
  if (notice) {
    return outcomeNotices(copy)[notice as SignInNoticeKind] ?? { severity: 'info', label: notice }
  }
  return null
}
