import { z } from 'zod'

export const planSchema = z.object({
  __typename: z.literal('Plan').default('Plan'),
  id: z.string(),
})

export type Plan = z.infer<typeof planSchema>