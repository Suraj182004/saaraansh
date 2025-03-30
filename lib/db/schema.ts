import { pgTable, text, timestamp, uuid, varchar, integer, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Plan type enum for subscription levels
export type PlanType = 'free' | 'basic' | 'pro';

// Users table
export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  fullName: varchar('full_name', { length: 255 }),
  customerId: varchar('customer_id', { length: 255 }).unique(),
  priceId: varchar('price_id', { length: 255 }),
  status: varchar('status', { length: 50 }).default('inactive'),
  // New fields for credit system
  plan: varchar('plan', { length: 50 }).default('free'), // 'free', 'basic', 'pro'
  creditsUsed: integer('credits_used').default(0), // Current month usage
  creditsLimit: integer('credits_limit').default(10), // Monthly limit (10 for free tier)
  lastResetDate: timestamp('last_reset_date', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`), // When credits were last reset
  nextResetDate: timestamp('next_reset_date', { withTimezone: true }), // When credits will next reset
  // Stripe subscription details
  subscriptionId: varchar('subscription_id', { length: 255 }),
  subscriptionStatus: varchar('subscription_status', { length: 50 }),
});

// PDF Summaries table
export const pdfSummaries = pgTable('pdf_summaries', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id),
  originalFileUrl: text('original_file_url').notNull(),
  summaryText: text('summary_text').notNull(),
  status: varchar('status', { length: 50 }).default('completed'),
  title: text('title'),
  fileName: text('file_name'),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
});

// Payments table
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  amount: integer('amount').notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  stripePaymentId: varchar('stripe_payment_id', { length: 255 }).notNull().unique(),
  priceId: varchar('price_id', { length: 255 }).notNull(),
  userEmail: varchar('user_email', { length: 255 }).notNull().references(() => users.email),
  createdAt: timestamp('created_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
});

// Note: Drizzle doesn't automatically handle the update triggers defined in SQL.
// The `updatedAt` field will only have its default value on creation.
// You'll need to manually update `updatedAt` in your application code when updating records
// if you need that behavior without relying solely on the SQL trigger. 