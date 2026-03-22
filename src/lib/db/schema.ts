import { pgTable, uuid, text, timestamp, integer, boolean, pgEnum, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const planEnum = pgEnum("plan", ["free", "starter", "pro"]);
export const monitorStatusEnum = pgEnum("monitor_status", ["operational", "degraded", "down", "maintenance", "unknown"]);
export const incidentStatusEnum = pgEnum("incident_status", ["investigating", "identified", "monitoring", "resolved"]);
export const severityEnum = pgEnum("severity", ["minor", "major", "critical"]);
export const checkStatusEnum = pgEnum("check_status", ["up", "down", "degraded"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "canceled", "past_due", "trialing"]);
export const userRoleEnum = pgEnum("user_role", ["owner", "admin", "member"]);

// Tables
export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkOrgId: text("clerk_org_id").unique(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  plan: planEnum("plan").default("free").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").unique().notNull(),
  email: text("email").notNull(),
  name: text("name"),
  orgId: uuid("org_id").references(() => organizations.id),
  role: userRoleEnum("role").default("member").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const monitors = pgTable("monitors", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  method: text("method").default("GET").notNull(),
  intervalSeconds: integer("interval_seconds").default(300).notNull(),
  timeoutMs: integer("timeout_ms").default(10000).notNull(),
  expectedStatus: integer("expected_status").default(200).notNull(),
  isPaused: boolean("is_paused").default(false).notNull(),
  lastCheckedAt: timestamp("last_checked_at"),
  lastStatus: monitorStatusEnum("last_status").default("unknown").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const monitorChecks = pgTable("monitor_checks", {
  id: uuid("id").defaultRandom().primaryKey(),
  monitorId: uuid("monitor_id").references(() => monitors.id, { onDelete: "cascade" }).notNull(),
  status: checkStatusEnum("status").notNull(),
  responseTimeMs: integer("response_time_ms"),
  statusCode: integer("status_code"),
  errorMessage: text("error_message"),
  checkedAt: timestamp("checked_at").defaultNow().notNull(),
});

export const incidents = pgTable("incidents", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  title: text("title").notNull(),
  status: incidentStatusEnum("status").default("investigating").notNull(),
  severity: severityEnum("severity").default("minor").notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const incidentUpdates = pgTable("incident_updates", {
  id: uuid("id").defaultRandom().primaryKey(),
  incidentId: uuid("incident_id").references(() => incidents.id, { onDelete: "cascade" }).notNull(),
  status: incidentStatusEnum("status").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const incidentMonitors = pgTable("incident_monitors", {
  incidentId: uuid("incident_id").references(() => incidents.id, { onDelete: "cascade" }).notNull(),
  monitorId: uuid("monitor_id").references(() => monitors.id, { onDelete: "cascade" }).notNull(),
}, (t) => [primaryKey({ columns: [t.incidentId, t.monitorId] })]);

export const statusPages = pgTable("status_pages", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  customDomain: text("custom_domain"),
  isPublic: boolean("is_public").default(true).notNull(),
  brandingColor: text("branding_color").default("#10B981").notNull(),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const statusPageMonitors = pgTable("status_page_monitors", {
  statusPageId: uuid("status_page_id").references(() => statusPages.id, { onDelete: "cascade" }).notNull(),
  monitorId: uuid("monitor_id").references(() => monitors.id, { onDelete: "cascade" }).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
}, (t) => [primaryKey({ columns: [t.statusPageId, t.monitorId] })]);

export const subscribers = pgTable("subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  statusPageId: uuid("status_page_id").references(() => statusPages.id, { onDelete: "cascade" }).notNull(),
  email: text("email").notNull(),
  verified: boolean("verified").default(false).notNull(),
  verifyToken: text("verify_token").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const apiKeys = pgTable("api_keys", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  keyHash: text("key_hash").notNull(),
  keyPrefix: text("key_prefix").notNull(),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").unique().notNull(),
  status: subscriptionStatusEnum("status").notNull(),
  planId: text("plan_id").notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations (required for Drizzle relational query API)
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  monitors: many(monitors),
  incidents: many(incidents),
  statusPages: many(statusPages),
  apiKeys: many(apiKeys),
  subscriptions: many(subscriptions),
}));

export const usersRelations = relations(users, ({ one }) => ({
  org: one(organizations, { fields: [users.orgId], references: [organizations.id] }),
}));

export const monitorsRelations = relations(monitors, ({ one, many }) => ({
  org: one(organizations, { fields: [monitors.orgId], references: [organizations.id] }),
  checks: many(monitorChecks),
}));

export const monitorChecksRelations = relations(monitorChecks, ({ one }) => ({
  monitor: one(monitors, { fields: [monitorChecks.monitorId], references: [monitors.id] }),
}));

export const incidentsRelations = relations(incidents, ({ one, many }) => ({
  org: one(organizations, { fields: [incidents.orgId], references: [organizations.id] }),
  updates: many(incidentUpdates),
}));

export const incidentUpdatesRelations = relations(incidentUpdates, ({ one }) => ({
  incident: one(incidents, { fields: [incidentUpdates.incidentId], references: [incidents.id] }),
}));

export const statusPagesRelations = relations(statusPages, ({ one, many }) => ({
  org: one(organizations, { fields: [statusPages.orgId], references: [organizations.id] }),
  subscribers: many(subscribers),
}));

export const subscribersRelations = relations(subscribers, ({ one }) => ({
  statusPage: one(statusPages, { fields: [subscribers.statusPageId], references: [statusPages.id] }),
}));
