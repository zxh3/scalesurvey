import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { nanoid } from "nanoid";

// Generate a secure admin code (format: XXXX-XXXX)
function generateAdminCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed similar-looking chars
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
    if (i === 3) code += "-";
  }
  return code;
}

// Generate a short URL key (6 characters, alphanumeric only)
function generateSurveyKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < 6; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}

// Create a new survey
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    allowLiveResults: v.optional(v.boolean()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const adminCode = generateAdminCode();
    const key = generateSurveyKey();

    const surveyId = await ctx.db.insert("surveys", {
      title: args.title,
      description: args.description,
      adminCode,
      key,
      status: "draft",
      startDate: args.startDate,
      endDate: args.endDate,
      allowLiveResults: args.allowLiveResults ?? false,
      createdAt: now,
      updatedAt: now,
    });

    return {
      surveyId,
      adminCode,
      key,
    };
  },
});

// Get survey by key (public access)
export const getByKey = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const survey = await ctx.db
      .query("surveys")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (!survey) return null;

    // Don't return admin code to public
    const { adminCode, ...publicSurvey } = survey;
    return publicSurvey;
  },
});

// Get survey by admin code (admin access)
export const getByAdminCode = query({
  args: { adminCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("surveys")
      .withIndex("by_adminCode", (q) => q.eq("adminCode", args.adminCode))
      .first();
  },
});

// Update survey (requires admin code)
export const update = mutation({
  args: {
    surveyId: v.id("surveys"),
    adminCode: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    allowLiveResults: v.optional(v.boolean()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const survey = await ctx.db.get(args.surveyId);

    if (!survey || survey.adminCode !== args.adminCode) {
      throw new Error("Invalid admin code");
    }

    const { surveyId, adminCode, ...updates } = args;

    await ctx.db.patch(args.surveyId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Publish survey
export const publish = mutation({
  args: {
    surveyId: v.id("surveys"),
    adminCode: v.string(),
  },
  handler: async (ctx, args) => {
    const survey = await ctx.db.get(args.surveyId);

    if (!survey || survey.adminCode !== args.adminCode) {
      throw new Error("Invalid admin code");
    }

    // Check if survey has at least one question
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_survey", (q) => q.eq("surveyId", args.surveyId))
      .collect();

    if (questions.length === 0) {
      throw new Error("Cannot publish survey without questions");
    }

    await ctx.db.patch(args.surveyId, {
      status: "published",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Close survey
export const close = mutation({
  args: {
    surveyId: v.id("surveys"),
    adminCode: v.string(),
  },
  handler: async (ctx, args) => {
    const survey = await ctx.db.get(args.surveyId);

    if (!survey || survey.adminCode !== args.adminCode) {
      throw new Error("Invalid admin code");
    }

    await ctx.db.patch(args.surveyId, {
      status: "closed",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
