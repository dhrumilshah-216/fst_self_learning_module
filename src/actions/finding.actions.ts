"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity";

const findingSchema = z.object({
    projectId: z.string(),
    title: z.string().min(3),
    description: z.string().min(10),
    experimentId: z.string().optional().or(z.literal("")),
});

export async function createFinding(prevState: any, formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user) return { error: "Unauthorized" };

        const rawData = Object.fromEntries(formData.entries());
        const validated = findingSchema.safeParse(rawData);

        if (!validated.success) return { error: "Validation failed" };

        const data = validated.data;
        const projectMember = await db.projectMember.findUnique({
            where: { projectId_userId: { projectId: data.projectId, userId: session.user.id } }
        });

        if (!projectMember) return { error: "Not part of project" };

        await db.finding.create({
            data: {
                projectId: data.projectId,
                title: data.title,
                description: data.description,
                experimentId: data.experimentId || null,
                authorId: session.user.id
            }
        });

        await logActivity(data.projectId, session.user.id, "logged finding", "FINDING", data.title);

        revalidatePath(`/research/${data.projectId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to log finding" };
    }
}
