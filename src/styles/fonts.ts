type FontSize =
  | 'xmini'
  | 'mini'
  | 'xsmall'
  | 'small'
  | 'normal'
  | 'medium'
  | 'xmedium'
  | 'large'

type FontSizeValues = {
  fontSize: number
  lineHeight: number
}

export const size: Record<FontSize, FontSizeValues> = {
  xmini: { fontSize: 8, lineHeight: 10 },
  mini: { fontSize: 10, lineHeight: 12 },
  xsmall: { fontSize: 12, lineHeight: 14 },
  small: { fontSize: 14, lineHeight: 16.8 },
  normal: { fontSize: 16, lineHeight: 18 },
  medium: { fontSize: 20, lineHeight: 21.8 },
  xmedium: { fontSize: 24, lineHeight: 29.66 },
  large: { fontSize: 34, lineHeight: 42.02 },
}
