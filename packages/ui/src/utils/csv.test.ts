import { describe, expect, it } from 'vitest'

import { splitCsvLine, toCsv } from './csv'

describe('utils/csv', () => {
  it('splits a CSV line, keeping quoted commas and escaped quotes', () => {
    expect(splitCsvLine('1, "kim, j@example.com" ,"say ""hi""",')).toEqual([
      '1',
      'kim, j@example.com',
      'say "hi"',
      ''
    ])
  })

  it('reads back the fields toCsv writes', () => {
    const csv = toCsv({
      columns: [
        { id: 'name', header: 'Name' },
        { id: 'note', header: 'Note' }
      ],
      rows: [{ name: 'Acme, Inc.', note: 'a "quote"' }]
    })
    expect(splitCsvLine(csv.split('\r\n')[1])).toEqual(['Acme, Inc.', 'a "quote"'])
  })
})
