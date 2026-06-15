import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
  date,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["client", "artist", "admin"]);
export const artworkStatus = pgEnum("artwork_status", ["available", "sold", "reserved", "draft"]);
export const orderStatus = pgEnum("order_status", ["pending", "paid", "shipped", "delivered", "cancelled"]);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  role: userRole("role").default("client").notNull(),
  fullName: text("full_name").notNull(),
  avatarUrl: text("avatar_url"),
  phone: text("phone"),
  country: text("country"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const artists = pgTable("artists", {
  id: uuid("id").primaryKey().references(() => profiles.id, { onDelete: "cascade" }),
  slug: text("slug").unique().notNull(),
  bio: text("bio").notNull(),
  lineage: text("lineage"),
  specialization: text("specialization").array(),
  experienceYears: integer("experience_years"),
  location: text("location"),
  awards: jsonb("awards"),
  studioImages: text("studio_images").array(),
  isVerified: boolean("is_verified").default(false),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const certificates = pgTable("certificates", {
  id: uuid("id").primaryKey().defaultRandom(),
  artworkId: uuid("artwork_id").references(() => artworks.id, { onDelete: "cascade" }).unique(),
  certificateNo: text("certificate_no").unique().notNull(),
  issuedDate: date("issued_date").notNull(),
  materialsAudit: jsonb("materials_audit"),
  blockchainRef: text("blockchain_ref"),
  qrCodeUrl: text("qr_code_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const artworks = pgTable("artworks", {
  id: uuid("id").primaryKey().defaultRandom(),
  artistId: uuid("artist_id").references(() => artists.id, { onDelete: "cascade" }).notNull(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  deity: text("deity"),
  style: text("style"),
  medium: text("medium"),
  materials: text("materials").array(),
  dimensionsCm: jsonb("dimensions_cm"),
  priceNpr: integer("price_npr").notNull(),
  priceUsd: integer("price_usd"),
  yearCreated: integer("year_created"),
  images: text("images").array().notNull(),
  status: artworkStatus("status").default("draft").notNull(),
  isVerified: boolean("is_verified").default(false),
  certificateId: uuid("certificate_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const artworkCategories = pgTable("artwork_categories", {
  artworkId: uuid("artwork_id").references(() => artworks.id, { onDelete: "cascade" }).notNull(),
  category: text("category").notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.artworkId, table.category] }),
}));

export const creationSteps = pgTable("creation_steps", {
  id: uuid("id").primaryKey().defaultRandom(),
  artworkId: uuid("artwork_id").references(() => artworks.id, { onDelete: "cascade" }).notNull(),
  stepNumber: integer("step_number").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  durationDays: integer("duration_days"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => profiles.id),
  status: orderStatus("status").default("pending").notNull(),
  totalNpr: integer("total_npr").notNull(),
  totalUsd: integer("total_usd"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  currency: text("currency").default("npr"),
  paymentMethod: text("payment_method"),
  paymentId: text("payment_id"),
  shippingName: text("shipping_name").notNull(),
  shippingAddress: jsonb("shipping_address").notNull(),
  shippingPhone: text("shipping_phone"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  artworkId: uuid("artwork_id").references(() => artworks.id).notNull(),
  priceNpr: integer("price_npr").notNull(),
  priceAtPurchase: integer("price_at_purchase"),
  quantity: integer("quantity").default(1),
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  artworkId: uuid("artwork_id").references(() => artworks.id, { onDelete: "cascade" }).notNull(),
  addedAt: timestamp("added_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueUserArtwork: unique().on(table.userId, table.artworkId),
}));

export const wishlistItems = pgTable("wishlist_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  artworkId: uuid("artwork_id").references(() => artworks.id, { onDelete: "cascade" }).notNull(),
  addedAt: timestamp("added_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqueUserArtwork: unique().on(table.userId, table.artworkId),
}));

export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  category: text("category"),
  authorName: text("author_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  isPublished: boolean("is_published").default(false),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  quote: text("quote").notNull(),
  authorName: text("author_name").notNull(),
  authorLocation: text("author_location"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Artist = typeof artists.$inferSelect;
export type NewArtist = typeof artists.$inferInsert;
export type Artwork = typeof artworks.$inferSelect;
export type NewArtwork = typeof artworks.$inferInsert;
export type Certificate = typeof certificates.$inferSelect;
export type NewCertificate = typeof certificates.$inferInsert;
export type CreationStep = typeof creationSteps.$inferSelect;
export type NewCreationStep = typeof creationSteps.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;
export type WishlistItem = typeof wishlistItems.$inferSelect;
export type NewWishlistItem = typeof wishlistItems.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
