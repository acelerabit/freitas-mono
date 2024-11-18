import { z } from 'zod'
import { planSchema } from '../models/plan'

export const planSubject = z.tuple(
  [
    z.union([
      z.literal('manage'),
      z.literal('get'),
      z.literal('create'),
      z.literal('update'),
      z.literal('delete'),
    ]),
    z.union([z.literal('Plan'), planSchema])
  ]
)

export type PlanSubject = z.infer<typeof planSubject>