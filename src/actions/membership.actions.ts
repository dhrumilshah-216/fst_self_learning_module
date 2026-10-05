"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const addMemberSchema = z.object({
    projectId: z.string(),
    email: z.string().email(),
    role: z.enum(["LEAD", "MEMBER", "SUPERVISOR"]).default("MEMBER"),
});

export async function addProjectMember(prevState: any, formData: FormData) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return { error: "Unauthorized" };
        }

        const rawData = Object.fromEntries(formData.entries());
        const validatedData = addMemberSchema.safeParse(rawData);

        if (!validatedData.success) {
            return { error: "Validation failed" };
        }

        const { projectId, email, role } = validatedData.data;

        // Verify current user is LEAD of the project
        const currentMember = await db.projectMember.findUnique({
            where: {
                projectId_userId: { projectId, userId: session.user.id }
            }
        });

        if (!currentMember || currentMember.role !== "LEAD") {
            return { error: "Only project leads can add members" };
        }

        // Find the user to add
        const userToAdd = await db.user.findUnique({ where: { email } });
        if (!userToAdd) {
            return { error: "User with this email not found" };
        }

        // Add them
        await db.projectMember.upsert({
            where: {
                projectId_userId: { projectId, userId: userToAdd.id }
            },
            update: {
                role: role
            },
            create: {
                projectId,
                userId: userToAdd.id,
                role: role
            }
        });

        revalidatePath(`/research/${projectId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to add member" };
    }
}
