"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity";

const paperSchema = z.object({
    projectId: z.string(),
    title: z.string().min(3),
    authors: z.string().min(3),
    publicationYear: z.coerce.number().optional(),
    doi: z.string().optional(),
    url: z.string().url().optional().or(z.literal("")),
    researchArea: z.string().optional(),
    tags: z.string(), // comma separated
    readingStatus: z.enum(["TO_READ", "READING", "REVIEWED"]).default("TO_READ"),
});

export async function addPaper(prevState: any, formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user) return { error: "Unauthorized" };

        const rawData = Object.fromEntries(formData.entries());
        const validated = paperSchema.safeParse(rawData);

        if (!validated.success) return { error: "Validation failed" };

        const data = validated.data;
        const tagArray = data.tags.split(',').map(tag => tag.trim()).filter(t => t.length > 0);

        const paper = await db.paper.create({
            data: {
                projectId: data.projectId,
                title: data.title,
                authors: data.authors,
                publicationYear: data.publicationYear,
                doi: data.doi,
                url: data.url || null,
                researchArea: data.researchArea,
                tags: tagArray,
                readingStatus: data.readingStatus,
                addedById: session.user.id,
            }
        });

        await logActivity(data.projectId, session.user.id, "added a paper", "PAPER", data.title);

        revalidatePath(`/research/${data.projectId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to add paper" };
    }
}
