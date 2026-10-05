"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { logActivity, createNotification } from "@/lib/activity";

const taskSchema = z.object({
    projectId: z.string(),
    title: z.string().min(3),
    description: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
    dueDate: z.string().optional().or(z.literal("")),
    assigneeId: z.string().optional().or(z.literal("")),
});

export async function createTask(prevState: any, formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user) return { error: "Unauthorized" };

        const rawData = Object.fromEntries(formData.entries());
        const validated = taskSchema.safeParse(rawData);

        if (!validated.success) return { error: "Validation failed" };

        const data = validated.data;

        await db.task.create({
            data: {
                projectId: data.projectId,
                title: data.title,
                description: data.description,
                priority: data.priority,
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
                assigneeId: data.assigneeId || null,
                createdById: session.user.id
            }
        });

        if (data.assigneeId && data.assigneeId !== session.user.id) {
            const prj = await db.researchProject.findUnique({ where: { id: data.projectId } });
            await createNotification(
                data.assigneeId,
                "TASK_ASSIGN",
                "New Task Assigned",
                `${session.user.name || "A user"} assigned you to task "${data.title}"`,
                `/research/${data.projectId}?tab=tasks`,
                true,
                { actorName: session.user.name || "A user", projectName: prj?.title || "Project" }
            );
        }

        await logActivity(data.projectId, session.user.id, "created a task", "TASK", undefined, data.title);

        revalidatePath(`/research/${data.projectId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to create task" };
    }
}

export async function updateTaskStatus(taskId: string, projectId: string, status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE") {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
    await db.task.update({ where: { id: taskId }, data: { status } });

    if (status === "DONE") {
        const t = await db.task.findUnique({ where: { id: taskId } });
        if (t) await logActivity(projectId, session.user.id, "completed a task", "TASK", t.title);
    }
    revalidatePath(`/research/${projectId}`);
}
