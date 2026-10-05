"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

export async function registerUser(prevState: any, formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const validatedData = registerSchema.safeParse(rawData);

        if (!validatedData.success) {
            return {
                error: "Invalid fields",
                details: validatedData.error.flatten().fieldErrors
            };
        }

        const { name, email, password } = validatedData.data;

        const existingUser = await db.user.findUnique({ where: { email } });
        if (existingUser) {
            return { error: "Email already in use" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                // Start out as member
                role: "RESEARCH_MEMBER"
            }
        });

        return { success: true };
    } catch (err) {
        return { error: "Something went wrong" };
    }
}
