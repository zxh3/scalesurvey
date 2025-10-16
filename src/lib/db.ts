import Dexie, { type Table } from "dexie";

export interface LocalSurvey {
	id?: number;
	surveyId: string;
	adminCode: string;
	key: string;
	title: string;
	description?: string;
	status: "draft" | "published" | "closed";
	createdAt: number;
	lastAccessedAt: number;
}

export class SurveyDatabase extends Dexie {
	surveys!: Table<LocalSurvey>;

	constructor() {
		super("ScaleSurveyDB");
		this.version(1).stores({
			surveys: "++id, surveyId, adminCode, key, lastAccessedAt, createdAt",
		});
	}
}

export const db = new SurveyDatabase();

// Helper functions for working with local surveys
export async function saveSurvey(
	survey: Omit<LocalSurvey, "id" | "lastAccessedAt">,
): Promise<number> {
	return await db.surveys.add({
		...survey,
		lastAccessedAt: Date.now(),
	});
}

export async function getSurveyByKey(
	key: string,
): Promise<LocalSurvey | undefined> {
	return await db.surveys.where("key").equals(key).first();
}

export async function getSurveyBySurveyId(
	surveyId: string,
): Promise<LocalSurvey | undefined> {
	return await db.surveys.where("surveyId").equals(surveyId).first();
}

export async function getAllSurveys(): Promise<LocalSurvey[]> {
	return await db.surveys.orderBy("lastAccessedAt").reverse().toArray();
}

export async function updateSurveyAccess(surveyId: string): Promise<void> {
	const survey = await getSurveyBySurveyId(surveyId);
	if (survey?.id) {
		await db.surveys.update(survey.id, {
			lastAccessedAt: Date.now(),
		});
	}
}

export async function updateSurveyStatus(
	surveyId: string,
	status: LocalSurvey["status"],
): Promise<void> {
	const survey = await getSurveyBySurveyId(surveyId);
	if (survey?.id) {
		await db.surveys.update(survey.id, {
			status,
			lastAccessedAt: Date.now(),
		});
	}
}

export async function deleteSurvey(surveyId: string): Promise<void> {
	const survey = await getSurveyBySurveyId(surveyId);
	if (survey?.id) {
		await db.surveys.delete(survey.id);
	}
}
