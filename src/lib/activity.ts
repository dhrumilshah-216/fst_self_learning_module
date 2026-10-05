import { db } from "@/lib/db";
import { sendTransactionalEmail } from "@/lib/email";

export async function logActivity(
    projectId: string,
    actorId: string,
    action: string,
    entityType: 'PAPER' | 'EXPERIMENT' | 'TASK' | 'FINDING' | 'QUESTION' | 'OBSERVATION' | 'PROJECT' | 'REVIEW' | 'COMMENT',
    entityId?: string,
    entityTitle?: string,
    metadata?: any
) {
    try {
        await db.activityLog.create({
            data: {
                projectId,
                actorId,
                action,
                entityType,
                entityId,
                entityTitle,
                metadata: metadata ? JSON.stringify(metadata) : null,
            }
        });
    } catch (error) {
        console.error("Failed to log activity", error);
    }
}

export async function createNotification(
    userId: string,
    type: 'INVITE' | 'REVIEW_REQUEST' | 'REVIEW_APPROVED' | 'REVIEW_CHANGES' | 'TASK_ASSIGN' | 'TASK_DEADLINE' | 'GENERAL',
    title: string,
    message: string,
    link: string,
    // Email options
    triggerEmail?: boolean,
    emailProps?: {
        actorName: string;
        projectName: string;
    }
) {
    try {
        const notification = await db.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                link,
            }
        });

        if (triggerEmail && emailProps) {
            // Dispatch email asynchronously so it doesn't block the request
            sendTransactionalEmail({
                toUserId: userId,
                notificationId: notification.id,
                subject: title,
                title,
                message,
                actorName: emailProps.actorName,
                projectName: emailProps.projectName,
                actionUrl: `https://researchflow.dev${link}`, // dummy domain
            });
        }

    } catch (err) {
        console.error("Failed to create notification", err);
    }
}
