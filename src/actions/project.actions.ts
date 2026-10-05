"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const createProjectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    researchArea: z.string().min(2, "Research Area is required"),
    status: z.enum(["PLANNING", "ACTIVE", "PAUSED", "COMPLETED"]).default("PLANNING"),
    startDate: z.string().optional(),
    expectedEndDate: z.string().optional(),
});

export async function createProject(prevState: any, formData: FormData) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return { error: "Unauthorized" };
        }

        if (session.user.role !== "RESEARCH_LEAD" && session.user.role !== "SUPERVISOR") {
            return { error: "Insufficient permissions. Only Research Leads can create projects." };
        }

        const rawData = Object.fromEntries(formData.entries());
        const validatedData = createProjectSchema.safeParse(rawData);

        if (!validatedData.success) {
            return {
                error: "Validation failed",
                details: validatedData.error.flatten().fieldErrors
            };
        }

        const data = validatedData.data;

        const project = await db.researchProject.create({
            data: {
                title: data.title,
                description: data.description,
                researchArea: data.researchArea,
                status: data.status,
                startDate: data.startDate ? new Date(data.startDate) : null,
                expectedEndDate: data.expectedEndDate ? new Date(data.expectedEndDate) : null,
                createdById: session.user.id,
            }
        });

        // Auto-add the creator as the LEAD
        await db.projectMember.create({
            data: {
                projectId: project.id,
                userId: session.user.id,
                role: "LEAD",
            }
        });

        revalidatePath("/dashboard");
        revalidatePath("/research");

        return { success: true, projectId: project.id };
    } catch (error) {
        console.error(error);
        return { error: "Failed to create project" };
    }
}
