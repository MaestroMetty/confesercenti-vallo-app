import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: text('username').notNull(),
    password: text('password').notNull(),
});

export const stores = pgTable('stores', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    address: text('address'),
    city: text('city'),
    province: text('province'),
    postalCode: text('postalCode'),
    phone: text('phone'),
    email: text('email'),
    website: text('website'),
    category: text('category'),
    imageUrl: text('imageUrl'),
    description: text('description').default(''),
});

export const promotions = pgTable('promotions', {
    id: serial('id').primaryKey(),
    storeId: integer('storeId').references(() => stores.id).notNull(),
    name: text('name').notNull(),
    description: text('description'),
    imageUrl: text('imageUrl'),
    startDate: timestamp('startDate'),
    endDate: timestamp('endDate'),
    priority: integer('priority'),
});

export const images = pgTable('images', {
    id: serial('id').primaryKey(),
    url: text('url').notNull(),
});