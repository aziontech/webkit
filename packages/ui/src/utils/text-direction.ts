const LETTER = /\p{L}/u

export const labelDirection = (text: string): 'ltr' | 'auto' => (LETTER.test(text) ? 'auto' : 'ltr')
