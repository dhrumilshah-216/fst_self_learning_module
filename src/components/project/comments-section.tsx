"use client";

import { useActionState } from "react";
import { addComment } from "@/actions/comment.actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CommentsSection({
    projectId,
    experimentId,
    findingId,
    comments
}: {
    projectId: string,
    experimentId?: string,
    findingId?: string,
    comments: any[]
}) {
    const [state, action, isPending] = useActionState(addComment, null);

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Discussion</h3>
                {comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No comments yet. Start the conversation.</p>
                ) : (
                    <div className="space-y-4">
                        {comments.map((comment, index) => (
                            <div key={index} className="p-4 rounded-lg bg-muted text-sm flex gap-3 text-foreground">
                                <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                                    {comment.author?.name?.charAt(0) || "U"}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                                        <span className="font-medium text-foreground">{comment.author?.name}</span>
                                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p>{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <form action={action} className="space-y-3">
                <input type="hidden" name="projectId" value={projectId} />
                {experimentId && <input type="hidden" name="experimentId" value={experimentId} />}
                {findingId && <input type="hidden" name="findingId" value={findingId} />}

                {state?.error && (
                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                        {state.error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="content" className="sr-only">Add a comment</Label>
                    <Textarea
                        id="content"
                        name="content"
                        placeholder="Write a comment..."
                        className="min-h-[80px]"
                        required
                    />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Posting..." : "Post Comment"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
