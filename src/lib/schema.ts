import { pgTable, uuid, text, integer, numeric, timestamp } from 'drizzle-orm/pg-core'

export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  whatsapp: text('whatsapp').notNull(),
  company: text('company'),
  status: text('status').default('novo'),
  organization_id: text('organization_id').notNull(),
  column_id: uuid('column_id').notNull(),
  position: integer('position').default(0),
  notes: text('notes'),
  value: numeric('value'),
  utm_source: text('utm_source'),
  utm_medium: text('utm_medium'),
  utm_campaign: text('utm_campaign'),
  utm_term: text('utm_term'),
  utm_content: text('utm_content'),
  campaign_source: text('campaign_source'),
  page_path: text('page_path'),
  first_contact_at: timestamp('first_contact_at').defaultNow(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert
