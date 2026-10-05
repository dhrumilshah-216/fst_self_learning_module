import { db } from "@/lib/db";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export async function LiteratureTab({ projectId }: { projectId: string }) {
    const papers = await db.paper.findMany({
        where: { projectId },
        include: { addedBy: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
    });

    if (papers.length === 0) {
        return (
            <EmptyState
                title="No Literature Saved"
                description="Add papers, journals, and articles relevant to this research."
                actionLabel="Add Literature"
            />
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Saved Literature</h3>
                <Button>Add Paper</Button>
            </div>
            <div className="grid gap-4">
                {papers.map((paper) => (
                    <div key={paper.id} className="p-4 bg-card border rounded-lg shadow-sm flex flex-col gap-2">
                        <h4 className="font-medium text-lg leading-tight">{paper.title}</h4>
                        <p className="text-sm text-muted-foreground">{paper.authors} {paper.publicationYear && `(${paper.publicationYear})`}</p>
                        <div className="flex gap-2 text-xs mt-2">
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">{paper.readingStatus}</span>
                            {paper.researchArea && <span className="bg-muted px-2 py-0.5 rounded-full">{paper.researchArea}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
