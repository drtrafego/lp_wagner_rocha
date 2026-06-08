import { z } from 'zod'

export const StandardEvents = ['PageView', 'Lead', 'Contact'] as const

export const TrackPayloadSchema = z.object({
  event_name: z.enum(StandardEvents),
  event_id: z.string().min(1).max(120),
  value: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  content_name: z.string().optional(),
  content_category: z.string().optional(),
  lead_type: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  name: z.string().optional(),
  test_event_code: z.string().optional(),
})

export type TrackPayload = z.infer<typeof TrackPayloadSchema>

export const DebugPayloadSchema = z.object({
  event_name: z.enum(StandardEvents).default('PageView'),
  event_id: z.string().min(1).max(120).optional(),
  value: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  content_name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  name: z.string().optional(),
  test_event_code: z.string().optional(),
})

export type DebugPayload = z.infer<typeof DebugPayloadSchema>
