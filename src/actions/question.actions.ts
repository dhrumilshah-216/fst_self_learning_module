"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity";

export async function addQuestion(prevState: any, formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user) return { error: "Unauthorized" };

        const projectId = formData.get("projectId") as string;
        const question = formData.get("question") as string;

        if (!question || question.length < 5) return { error: "Question too short" };

        await db.researchQuestion.create({
            data: { projectId, question }
        });

        await logActivity(projectId, session.user.id, "created a research question", "QUESTION", question);
        revalidatePath(`/research/${projectId}`);

        return { success: true };
    } catch (error) {
        return { error: "Failed to add question" };
    }
}
