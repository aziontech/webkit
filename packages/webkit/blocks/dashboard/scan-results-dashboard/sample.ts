import type { BarListItem } from '@aziontech/webkit/bar-list'
import type { ChartSeries } from '@aziontech/webkit/chart'

import type { ScanResultsSubmission, ScanResultsSummary } from './scan-results-dashboard.vue'

export const sampleSummary: ScanResultsSummary = {
  submitted: 18420,
  analyzing: 37,
  last24h: 1284,
  flagged: 212,
  held: 9,
  heldLast24h: 46,
  alertsOpen: 3,
  alertsTotal: 14
}

export const sampleEmptySummary: ScanResultsSummary = {
  submitted: 0,
  analyzing: 0,
  last24h: 0,
  flagged: 0,
  held: 0,
  heldLast24h: 0,
  alertsOpen: 0,
  alertsTotal: 0
}

export const sampleVerdictSplit: ChartSeries[] = [
  {
    id: 'clean',
    name: 'Clean',
    color: 'success',
    values: [16930]
  },
  {
    id: 'suspicious',
    name: 'Suspicious',
    color: 'warning',
    values: [1241]
  },
  {
    id: 'flagged',
    name: 'Flagged',
    color: 'danger',
    values: [212]
  },
  {
    id: 'pending',
    name: 'Pending',
    color: 'other',
    values: [37]
  }
]

export const sampleSources: BarListItem[] = [
  {
    id: 'inline',
    name: 'Inline scan',
    value: 11640
  },
  {
    id: 'api',
    name: 'API submission',
    value: 4380
  },
  {
    id: 'upload',
    name: 'Manual upload',
    value: 1620
  },
  {
    id: 'scheduled',
    name: 'Scheduled scan',
    value: 780
  }
]

export const sampleSubmissions: ScanResultsSubmission[] = [
  {
    id: 'submission-01',
    name: 'quarterly-report.pdf',
    verdict: 'clean',
    category: 'Document',
    score: 4,
    type: 'PDF',
    size: 2480000,
    source: 'inline',
    submitter: 'ava.wilson',
    lastSeen: '2026-11-10 13:42'
  },
  {
    id: 'submission-02',
    name: 'installer-setup.exe',
    verdict: 'flagged',
    category: 'Trojan',
    score: 96,
    type: 'Executable',
    size: 18300000,
    source: 'inline',
    submitter: 'mark.chen',
    lastSeen: '2026-11-10 13:18'
  },
  {
    id: 'submission-03',
    name: 'invoice-0425.docm',
    verdict: 'suspicious',
    category: 'Macro',
    score: 71,
    type: 'Office document',
    size: 184000,
    source: 'upload',
    submitter: 'lisa.martin',
    lastSeen: '2026-11-10 12:57'
  },
  {
    id: 'submission-04',
    name: 'build-artifacts.zip',
    verdict: 'pending',
    category: '—',
    score: null,
    type: 'Archive',
    size: 46700000,
    source: 'api',
    submitter: 'ci-runner',
    lastSeen: '2026-11-10 12:51'
  },
  {
    id: 'submission-05',
    name: 'team-photo.png',
    verdict: 'clean',
    category: 'Image',
    score: 1,
    type: 'Image',
    size: 3120000,
    source: 'inline',
    submitter: 'sam.okafor',
    lastSeen: '2026-11-10 12:33'
  },
  {
    id: 'submission-06',
    name: 'update-helper.dll',
    verdict: 'flagged',
    category: 'Ransomware',
    score: 99,
    type: 'Library',
    size: 912000,
    source: 'api',
    submitter: 'ci-runner',
    lastSeen: '2026-11-10 11:46'
  },
  {
    id: 'submission-07',
    name: 'pricing-model.xlsx',
    verdict: 'clean',
    category: 'Spreadsheet',
    score: 6,
    type: 'Office document',
    size: 640000,
    source: 'upload',
    submitter: 'priya.nair',
    lastSeen: '2026-11-10 11:20'
  },
  {
    id: 'submission-08',
    name: 'run-me.sh',
    verdict: 'suspicious',
    category: 'Script',
    score: 63,
    type: 'Script',
    size: 4200,
    source: 'inline',
    submitter: 'david.kim',
    lastSeen: '2026-11-10 10:58'
  },
  {
    id: 'submission-09',
    name: 'meeting-notes.txt',
    verdict: 'clean',
    category: 'Text',
    score: 0,
    type: 'Text',
    size: 12800,
    source: 'scheduled',
    submitter: 'scheduler',
    lastSeen: '2026-11-10 10:12'
  },
  {
    id: 'submission-10',
    name: 'browser-extension.crx',
    verdict: 'suspicious',
    category: 'Adware',
    score: 58,
    type: 'Extension',
    size: 1740000,
    source: 'inline',
    submitter: 'mark.chen',
    lastSeen: '2026-11-10 09:47'
  },
  {
    id: 'submission-11',
    name: 'backup-2026-11.tar.gz',
    verdict: 'pending',
    category: '—',
    score: null,
    type: 'Archive',
    size: 128000000,
    source: 'scheduled',
    submitter: 'scheduler',
    lastSeen: '2026-11-10 09:30'
  },
  {
    id: 'submission-12',
    name: 'driver-package.msi',
    verdict: 'clean',
    category: 'Installer',
    score: 9,
    type: 'Installer',
    size: 22600000,
    source: 'api',
    submitter: 'ci-runner',
    lastSeen: '2026-11-10 08:54'
  }
]
