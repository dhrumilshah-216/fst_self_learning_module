import * as React from 'react';
import { Resend } from 'resend';
import { NotificationEmail } from '@/emails/NotificationEmail';
import { db } from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');

interface SendEmailProps {
    toUserId: string;
    notificationId: string;
    subject: string;
    title: string;
    message: string;
    actorName: string;
    projectName: string;
    actionUrl: string;
}

export async function sendTransactionalEmail(props: SendEmailProps) {
    try {
        const user = await db.user.findUnique({ where: { id: props.toUserId } });
        if (!user) return;

        if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('dummy')) {
            console.log(`[Email Suppressed] To: ${user.email}, Subject: ${props.subject}`);
            return;
        }

        const { data, error } = await resend.emails.send({
            from: 'ResearchFlow <notifications@researchflow.dev>',
            to: [user.email],
            subject: props.subject,
            react: (
                <NotificationEmail
                    title={props.title}
                    message={props.message}
                    actorName={props.actorName}
                    projectName={props.projectName}
                    actionUrl={props.actionUrl}
                />
            ),
        });

        if (error) {
            console.error('Email send failed:', error);
            return;
        }

        if (data?.id) {
            await db.emailDelivery.create({
                data: {
                    notificationId: props.notificationId,
                    resendId: data.id,
                    status: 'PENDING'
                }
            });
        }

    } catch (error) {
        console.error('Unhandled email exception', error);
    }
}
