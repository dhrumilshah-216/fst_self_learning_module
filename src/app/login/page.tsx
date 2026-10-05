"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid credentials");
            setIsLoading(false);
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-muted/20">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
                <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">Welcome back</h1>
                <p className="text-sm text-muted-foreground mb-6">Log in to your ResearchFlow account.</p>

                {error && (
                    <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="jane@university.edu" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Log in"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="font-medium text-primary hover:underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
