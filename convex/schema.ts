import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  surveys: defineTable({
    // Basic info
    title: v.string(),
    description: v.optional(v.string()),
    adminCode: v.string(), // Secret code for admin access
    key: v.string(), // Short URL identifier (e.g., "abc123")

    // Status & scheduling
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("closed")
    ),
    startDate: v.optional(v.number()), // Unix timestamp
    endDate: v.optional(v.number()), // Unix timestamp

    // Settings
    allowLiveResults: v.boolean(), // Can participants view results?

    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_key", ["key"])
    .index("by_adminCode", ["adminCode"]),

  questions: defineTable({
    surveyId: v.id("surveys"),

    // Question data
    type: v.union(
      v.literal("single_choice"),
      v.literal("multiple_choice"),
      v.literal("text"),
      v.literal("rating"),
      v.literal("scale")
    ),
    title: v.string(),
    description: v.optional(v.string()),
    optional: v.boolean(), // Changed from 'required' to 'optional'

    // Order
    order: v.number(),

    // Type-specific config (stored as JSON string for flexibility)
    config: v.string(), // JSON stringified config object
  }).index("by_survey", ["surveyId", "order"]),

  responses: defineTable({
    surveyId: v.id("surveys"),

    // Answers stored as JSON string
    answers: v.string(), // JSON stringified array of answers

    // Metadata
    submittedAt: v.number(),
  })
    .index("by_survey", ["surveyId"]),
});