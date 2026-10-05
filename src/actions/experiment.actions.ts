"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity";

const expSchema = z.object({
    projectId: z.string(),
    title: z.string().min(3),
    objective: z.string().min(10),
    method: z.string().min(5),
    dataset: z.string().optional(),
    modelOrTechnique: z.string().optional(),
    parameters: z.string().optional(),
});

export async function createExperiment(prevState: any, formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user) return { error: "Unauthorized" };

        const rawData = Object.fromEntries(formData.entries());
        const validated = expSchema.safeParse(rawData);

        if (!validated.success) return { error: "Validation failed" };

        const data = validated.data;

        const exp = await db.experiment.create({
            data: {
                ...data,
                researcherId: session.user.id
            }
        });

        await logActivity(data.projectId, session.user.id, "created an experiment", "EXPERIMENT", data.title);

        revalidatePath(`/research/${data.projectId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to create experiment" };
    }
}
