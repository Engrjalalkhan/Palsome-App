type TextAlign = 'left' | 'center' | 'right'

type TextAlignValues = {
    textAlign: string,
}

export const alignment: Record<TextAlign, TextAlignValues> = {
    left: { textAlign: 'left' },
    center: { textAlign: 'center' },
    right: { textAlign: 'right' },
}