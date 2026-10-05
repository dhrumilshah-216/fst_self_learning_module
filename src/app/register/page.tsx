"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/actions/auth.actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterPage() {
    const [state, action, isPending] = useActionState(registerUser, null);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            router.push("/login?registered=true");
        }
    }, [state, router]);

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-muted/20">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
                <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">Create an account</h1>
                <p className="text-sm text-muted-foreground mb-6">Enter your details below to register.</p>

                {state?.error && (
                    <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                        {state.error}
                    </div>
                )}

                <form action={action} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" type="text" placeholder="Dr. Jane Doe" required />
                        {state?.details?.name && <p className="text-xs text-destructive">{state.details.name[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="jane@university.edu" required />
                        {state?.details?.email && <p className="text-xs text-destructive">{state.details.email[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                        {state?.details?.password && <p className="text-xs text-destructive">{state.details.password[0]}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Creating account..." : "Sign up"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-primary hover:underline">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}
