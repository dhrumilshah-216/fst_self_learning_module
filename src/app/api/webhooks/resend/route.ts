import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { db } from '@/lib/db';

const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

export async function POST(req: Request) {
    try {
        const headerPayload = await headers();
        const svix_id = headerPayload.get("svix-id");
        const svix_timestamp = headerPayload.get("svix-timestamp");
        const svix_signature = headerPayload.get("svix-signature");

        if (!svix_id || !svix_timestamp || !svix_signature || !webhookSecret) {
            return new Response('Error: Missing svix headers or secret', { status: 400 });
        }

        const payload = await req.json();
        const body = JSON.stringify(payload);

        const wh = new Webhook(webhookSecret);

        let evt: any;

        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            });
        } catch (err: any) {
            return new Response('Error: Webhook signature verification failed', { status: 400 });
        }

        const { type, data } = evt;
        const emailId = data?.email_id;

        if (!emailId) {
            return new Response('No email ID in payload', { status: 200 });
        }

        let statusUpdate = 'PENDING';
        if (type === 'email.delivered') statusUpdate = 'DELIVERED';
        if (type === 'email.bounced') statusUpdate = 'BOUNCED';
        // Sometimes 'email.failed' depending on Resend API docs
        if (type === 'email.failed' || type === 'email.complained') statusUpdate = 'FAILED';

        if (statusUpdate !== 'PENDING') {
            await db.emailDelivery.updateMany({
                where: { resendId: emailId },
                data: { status: statusUpdate as any },
            });
        }

        return new Response('Webhook processed successfully', { status: 200 });

    } catch (error) {
        console.error('Webhook error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
