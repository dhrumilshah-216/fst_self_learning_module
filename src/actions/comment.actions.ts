"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity";

const commentSchema = z.object({
    projectId: z.string(),
    experimentId: z.string().optional().or(z.literal("")),
    findingId: z.string().optional().or(z.literal("")),
    content: z.string().min(1),
});

export async function addComment(prevState: any, formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user) return { error: "Unauthorized" };

        const rawData = Object.fromEntries(formData.entries());
        const validated = commentSchema.safeParse(rawData);

        if (!validated.success) return { error: "Invalid comment data" };
        const { projectId, experimentId, findingId, content } = validated.data;

        // Must be project member
        const member = await db.projectMember.findUnique({
            where: { projectId_userId: { projectId, userId: session.user.id } }
        });

        if (!member) return { error: "Must be a project member to comment" };

        await db.comment.create({
            data: {
                content,
                projectId,
                experimentId: experimentId || null,
                findingId: findingId || null,
                authorId: session.user.id
            }
        });

        await logActivity(
            projectId,
            session.user.id,
            "added a comment",
            "COMMENT",
            experimentId || findingId || projectId
        );

        // Revalidation fallback
        if (experimentId) {
            revalidatePath(`/research/${projectId}/experiments/${experimentId}`);
        } else {
            revalidatePath(`/research/${projectId}`);
        }

        return { success: true };
    } catch (error) {
        return { error: "Failed to add comment" };
    }
}
