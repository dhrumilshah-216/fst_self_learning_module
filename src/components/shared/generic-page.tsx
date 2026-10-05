"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export default function GenericPage({ title, description }: { title: string, description: string }) {
    return (
        <div className="space-y-6 h-full flex flex-col">
            <PageHeader
                title={title}
                description={description}
                actions={<Button>New Item</Button>}
            />
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                <EmptyState
                    title={`No ${title} found`}
                    description={`Get started by creating your first item in the ${title} module.`}
                    actionLabel={`Create ${title}`}
                />
            </div>
        </div>
    );
}
