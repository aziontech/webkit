export const UNSAFE_URLS = [
  'javascript:alert(1)',
  'JaVaScRiPt:alert(1)',
  '  javascript:alert(1)',
  'java\tscript:alert(1)',
  '&#106;avascript:alert(1)',
  'javascript&colon;alert(1)',
  'data:text/html,<script>alert(1)</script>',
  'vbscript:msgbox(1)'
]

export const UNSAFE_MARKDOWN_HREFS = [
  'javascript:void0',
  'JaVaScRiPt:void0',
  '&#106;avascript:void0',
  'javascript&colon;void0',
  'data:text/html,hi',
  'vbscript:msgbox'
]
