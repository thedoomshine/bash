import { defineTokens } from '@pandacss/dev'

import { generateTokens } from '../utils'

const easingTokens = {
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeOutQuart: 'cubic-bezier(0.16, 1, 0.3, 1)',
  linear: 'cubic-bezier(0, 0, 1, 1)',
} as const

export const easings = defineTokens.easings(generateTokens(easingTokens))
