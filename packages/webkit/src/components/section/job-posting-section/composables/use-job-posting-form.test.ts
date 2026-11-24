import { describe, expect, it } from 'vitest'

import type { JobPostingSectionField, JobPostingSectionMessages } from '../job-posting-section.vue'
import { useJobPostingForm } from './use-job-posting-form'

const messages: JobPostingSectionMessages = {
  missing: 'Required',
  invalidEmail: 'Bad email',
  invalidUrl: 'Bad URL',
  error: 'Failed',
  successTitle: 'Sent',
  successDescription: 'Thanks',
  done: 'Done',
  browse: 'Browse'
}

const fields: JobPostingSectionField[] = [
  { name: 'name', type: 'text', label: 'Name', required: true },
  { name: 'email', type: 'email', label: 'Email', required: true },
  { name: 'site', type: 'url', label: 'Site' },
  { name: 'phone', type: 'phone', label: 'Phone' },
  { name: 'resume', type: 'file', label: 'Resume' }
]

const setup = () =>
  useJobPostingForm(
    'apply',
    () => fields,
    () => messages
  )

describe('useJobPostingForm', () => {
  it('reports a message per invalid field and the first one to focus', () => {
    const form = setup()
    form.setValue(fields[1]!, 'not-an-email')
    form.setValue(fields[2]!, 'example.com')
    const result = form.validate()
    expect(form.errors.value).toEqual({ name: 'Required', email: 'Bad email', site: 'Bad URL' })
    expect(result.first?.name).toBe('name')
    expect(form.emptyRequired(fields[0]!)).toBe(true)
    expect(form.malformed(fields[1]!)).toBe(true)
  })

  it('clears a field error on edit and collects trimmed values with the dial code', () => {
    const form = setup()
    form.validate()
    form.setValue(fields[0]!, '  Jane Doe ')
    expect(form.errors.value['name']).toBe('')
    form.setValue(fields[1]!, 'jane.doe@example.com')
    form.setValue(fields[3]!, '4155550100')
    const { values, first } = form.validate()
    expect(first).toBeUndefined()
    expect(values['name']).toBe('Jane Doe')
    expect(values['phone']).toBe('+14155550100')
  })

  it('holds one file per file field, named in the values, and resets everything', () => {
    const form = setup()
    const file = new File(['cv'], 'resume.pdf')
    form.setFile(fields[4]!, file)
    expect(form.values.value['resume']).toBe('resume.pdf')
    expect(form.fileTokens(fields[4]!)).toEqual([{ file }])
    expect(form.focusTarget(fields[4]!)).toBe('apply-resume-browse')
    form.reset()
    expect(form.files.value).toEqual({})
    expect(form.values.value).toEqual({})
  })
})
