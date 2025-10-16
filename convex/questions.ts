import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Add a question to a survey
export const add = mutation({
  args: {
    surveyId: v.id("surveys"),
    adminCode: v.string(),
    type: v.union(
      v.literal("single_choice"),
      v.literal("multiple_choice"),
      v.literal("text"),
      v.literal("rating"),
      v.literal("scale")
    ),
    title: v.string(),
    description: v.optional(v.string()),
    required: v.optional(v.boolean()),
    config: v.string(), // JSON stringified config
  },
  handler: async (ctx, args) => {
    // Verify admin code
    const survey = await ctx.db.get(args.surveyId);
    if (!survey || survey.adminCode !== args.adminCode) {
      throw new Error("Invalid admin code");
    }

    // Get current question count to set order
    const existingQuestions = await ctx.db
      .query("questions")
      .withIndex("by_survey", (q) => q.eq("surveyId", args.surveyId))
      .collect();

    const order = existingQuestions.length;

    const questionId = await ctx.db.insert("questions", {
      surveyId: args.surveyId,
      type: args.type,
      title: args.title,
      description: args.description,
      required: args.required ?? false,
      order,
      config: args.config,
    });

    // Update survey's updatedAt
    await ctx.db.patch(args.surveyId, {
      updatedAt: Date.now(),
    });

    return { questionId };
  },
});

// Update a question
export const update = mutation({
  args: {
    questionId: v.id("questions"),
    adminCode: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    required: v.optional(v.boolean()),
    config: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const question = await ctx.db.get(args.questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    // Verify admin code
    const survey = await ctx.db.get(question.surveyId);
    if (!survey || survey.adminCode !== args.adminCode) {
      throw new Error("Invalid admin code");
    }

    const { questionId, adminCode, ...updates } = args;

    await ctx.db.patch(args.questionId, updates);

    // Update survey's updatedAt
    await ctx.db.patch(question.surveyId, {
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Delete a question
export const remove = mutation({
  args: {
    questionId: v.id("questions"),
    adminCode: v.string(),
  },
  handler: async (ctx, args) => {
    const question = await ctx.db.get(args.questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    // Verify admin code
    const survey = await ctx.db.get(question.surveyId);
    if (!survey || survey.adminCode !== args.adminCode) {
      throw new Error("Invalid admin code");
    }

    const deletedOrder = question.order;

    await ctx.db.delete(args.questionId);

    // Reorder remaining questions
    const remainingQuestions = await ctx.db
      .query("questions")
      .withIndex("by_survey", (q) => q.eq("surveyId", question.surveyId))
      .collect();

    for (const q of remainingQuestions) {
      if (q.order > deletedOrder) {
        await ctx.db.patch(q._id, {
          order: q.order - 1,
        });
      }
    }

    // Update survey's updatedAt
    await ctx.db.patch(question.surveyId, {
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Reorder questions (for drag-and-drop)
export const reorder = mutation({
  args: {
    surveyId: v.id("surveys"),
    adminCode: v.string(),
    questionIds: v.array(v.id("questions")), // New order
  },
  handler: async (ctx, args) => {
    // Verify admin code
    const survey = await ctx.db.get(args.surveyId);
    if (!survey || survey.adminCode !== args.adminCode) {
      throw new Error("Invalid admin code");
    }

    // Update order for each question
    for (let i = 0; i < args.questionIds.length; i++) {
      await ctx.db.patch(args.questionIds[i], {
        order: i,
      });
    }

    // Update survey's updatedAt
    await ctx.db.patch(args.surveyId, {
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Get all questions for a survey
export const getBySurvey = query({
  args: { surveyId: v.id("surveys") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("questions")
      .withIndex("by_survey", (q) => q.eq("surveyId", args.surveyId))
      .collect();
  },
});
