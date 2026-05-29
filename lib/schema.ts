import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['patient', 'doctor'] }).default('patient').notNull(),
  specialization: text('specialization'), // Only for doctors
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
