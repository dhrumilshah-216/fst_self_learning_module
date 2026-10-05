"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { logActivity, createNotification } from "@/lib/activity";

const reviewSchema = z.object({
    experimentId: z.string(),
    projectId: z.string(),
    status: z.enum(["APPROVED", "CHANGES_REQUESTED"]),
    comment: z.string().optional(),
});

export async function submitReview(prevState: any, formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user) return { error: "Unauthorized" };

        if (session.user.role !== "SUPERVISOR") {
            return { error: "Only global Supervisors can submit official reviews." };
        }

        const rawData = Object.fromEntries(formData.entries());
        const validated = reviewSchema.safeParse(rawData);

        if (!validated.success) return { error: "Invalid review formatting" };
        const { experimentId, projectId, status, comment } = validated.data;

        // Ensure they are attached to project
        const member = await db.projectMember.findUnique({ where: { projectId_userId: { projectId, userId: session.user.id } } });
        if (!member || member.role !== "SUPERVISOR") {
            return { error: "You must be designated as a Supervisor on this specific project to review." };
        }

        const exp = await db.experiment.findUnique({
            where: { id: experimentId },
            include: { project: true }
        });

        if (!exp) return { error: "Experiment not found" };

        await db.review.create({
            data: {
                experimentId,
                reviewerId: session.user.id,
                status,
                comment,
                reviewedAt: new Date()
            }
        });

        const actionText = status === "APPROVED" ? "approved the experiment" : "requested changes for the experiment";

        await logActivity(
            projectId,
            session.user.id,
            actionText,
            "REVIEW",
            experimentId,
            exp.title
        );

        if (exp.researcherId) {
            await createNotification(
                exp.researcherId,
                status === "APPROVED" ? "REVIEW_APPROVED" : "REVIEW_CHANGES",
                `Experiment ${status.toLowerCase()}`,
                `${session.user.name} has ${actionText} "${exp.title}".`,
                `/research/${projectId}/experiments/${experimentId}`,
                true, // trigger email
                { actorName: session.user.name || "A user", projectName: exp.project.title }
            );
        }

        revalidatePath(`/research/${projectId}/experiments/${experimentId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to submit review" };
    }
}

// Additional utility logic to ask for review
export async function requestReview(experimentId: string, projectId: string) {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const supervisors = await db.projectMember.findMany({
        where: { projectId, role: "SUPERVISOR" },
        include: { user: true, project: true }
    });

    const exp = await db.experiment.findUnique({ where: { id: experimentId } });
    if (!exp) throw new Error("Experiment missing");

    for (const sup of supervisors) {
        await createNotification(
            sup.userId,
            "REVIEW_REQUEST",
            "Review Requested",
            `${session.user.name} has requested a review on experiment "${exp.title}".`,
            `/research/${projectId}/experiments/${experimentId}`,
            true,
            { actorName: session.user.name || "A user", projectName: sup.project.title }
        );
    }

    await logActivity(projectId, session.user.id, "requested experiment review", "EXPERIMENT", experimentId, exp.title);
    revalidatePath(`/research/${projectId}/experiments/${experimentId}`);
}
