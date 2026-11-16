import type { WafTuningMatch } from './waf-tuning.vue'

export const sampleMatches: WafTuningMatch[] = [
  {
    ruleId: '1005',
    threat: 'SQL injection',
    hits: 18432,
    ips: ['203.0.113.41', '198.51.100.7', '203.0.113.90', '192.0.2.15'],
    countries: ['United States', 'Brazil', 'Germany'],
    paths: ['/api/v1/search', '/api/v1/login', '/checkout']
  },
  {
    ruleId: '1015',
    threat: 'Unwanted access',
    hits: 6210,
    ips: ['198.51.100.22', '203.0.113.8'],
    countries: ['United States', 'Netherlands'],
    paths: ['/admin', '/wp-login.php']
  },
  {
    ruleId: '1201',
    threat: 'Cross-site scripting',
    hits: 2288,
    ips: ['192.0.2.31', '198.51.100.12', '203.0.113.77'],
    countries: ['Singapore', 'India'],
    paths: ['/v2/comments', '/v2/profile', '/search']
  },
  {
    ruleId: '1302',
    threat: 'File upload',
    hits: 934,
    ips: ['192.0.2.77'],
    countries: ['Ireland'],
    paths: ['/api/v1/upload']
  },
  {
    ruleId: '1402',
    threat: 'Evading tricks',
    hits: 120,
    ips: ['203.0.113.5', '198.51.100.61'],
    countries: ['Chile'],
    paths: ['/v2/graphql']
  }
]
