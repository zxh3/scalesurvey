import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Submit a survey response
export const submit = mutation({
  args: {
    surveyId: v.id("surveys"),
    answers: v.string(), // JSON stringified array of answers
    participantFingerprint: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verify survey exists and is published
    const survey = await ctx.db.get(args.surveyId);

    if (!survey) {
      throw new Error("Survey not found");
    }

    if (survey.status !== "published") {
      throw new Error("Survey is not published");
    }

    // Check if survey is within date range
    const now = Date.now();
    if (survey.startDate && now < survey.startDate) {
      throw new Error("Survey has not started yet");
    }
    if (survey.endDate && now > survey.endDate) {
      throw new Error("Survey has ended");
    }

    // Check for duplicate submission if fingerprint is provided
    if (args.participantFingerprint) {
      const existingResponse = await ctx.db
        .query("responses")
        .withIndex("by_survey_fingerprint", (q) =>
          q
            .eq("surveyId", args.surveyId)
            .eq("participantFingerprint", args.participantFingerprint)
        )
        .first();

      if (existingResponse) {
        throw new Error("You have already submitted a response to this survey");
      }
    }

    // Submit response
    const responseId = await ctx.db.insert("responses", {
      surveyId: args.surveyId,
      answers: args.answers,
      participantFingerprint: args.participantFingerprint,
      submittedAt: now,
    });

    return { responseId };
  },
});

// Get all responses for a survey (admin only)
export const getBySurvey = query({
  args: {
    surveyId: v.id("surveys"),
    adminCode: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify admin code
    const survey = await ctx.db.get(args.surveyId);
    if (!survey || survey.adminCode !== args.adminCode) {
      throw new Error("Invalid admin code");
    }

    return await ctx.db
      .query("responses")
      .withIndex("by_survey", (q) => q.eq("surveyId", args.surveyId))
      .collect();
  },
});

// Get response count for a survey (public if live results enabled)
export const getCount = query({
  args: { surveyId: v.id("surveys") },
  handler: async (ctx, args) => {
    const responses = await ctx.db
      .query("responses")
      .withIndex("by_survey", (q) => q.eq("surveyId", args.surveyId))
      .collect();

    return responses.length;
  },
});

// Get all responses for live results (public if enabled)
export const getForLiveResults = query({
  args: { surveyId: v.id("surveys") },
  handler: async (ctx, args) => {
    // Verify survey allows live results
    const survey = await ctx.db.get(args.surveyId);
    if (!survey) {
      throw new Error("Survey not found");
    }

    if (!survey.allowLiveResults) {
      throw new Error("Live results are not enabled for this survey");
    }

    return await ctx.db
      .query("responses")
      .withIndex("by_survey", (q) => q.eq("surveyId", args.surveyId))
      .collect();
  },
});
