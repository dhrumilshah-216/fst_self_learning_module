"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { createProject } from "@/actions/project.actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const createProjectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    researchArea: z.string().min(2, "Research Area is required"),
    status: z.enum(["PLANNING", "ACTIVE", "PAUSED", "COMPLETED"]),
    startDate: z.string().optional(),
    expectedEndDate: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof createProjectSchema>;

export default function NewProjectPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProjectFormValues>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            status: "PLANNING",
        }
    });

    const onSubmit = async (data: ProjectFormValues) => {
        setServerError(null);

        // Convert to FormData to use Server Action properly
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value) formData.append(key, value);
        });

        const result = await createProject(null, formData);

        if (result.error) {
            setServerError(result.error);
        } else if (result.success) {
            router.push(`/research/${result.projectId}`);
            router.refresh();
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Research Project</h1>
                <p className="text-muted-foreground mt-2">Initialize a new research initiative and configure its metadata.</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                {serverError && (
                    <div className="mb-6 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Project Title</Label>
                        <Input id="title" {...register("title")} placeholder="Quantum Computing Error Rates" />
                        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description & Abstract</Label>
                        <Textarea id="description" {...register("description")} placeholder="Provide a brief summary of the project goals..." />
                        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="researchArea">Research Area</Label>
                            <Input id="researchArea" {...register("researchArea")} placeholder="Physics / Comp Sci" />
                            {errors.researchArea && <p className="text-xs text-destructive">{errors.researchArea.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Initial Status</Label>
                            <select
                                id="status"
                                {...register("status")}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="PLANNING">Planning</option>
                                <option value="ACTIVE">Active</option>
                            </select>
                            {errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input id="startDate" type="date" {...register("startDate")} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="expectedEndDate">Expected End Date</Label>
                            <Input id="expectedEndDate" type="date" {...register("expectedEndDate")} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Project
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
