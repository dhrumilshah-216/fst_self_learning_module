import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

    const notifications = await db.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 10
    });

    return Response.json(notifications);
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

    const { id } = await req.json();

    if (id) {
        await db.notification.update({
            where: { id },
            data: { isRead: true }
        });
    } else {
        await db.notification.updateMany({
            where: { userId: session.user.id },
            data: { isRead: true }
        });
    }

    return Response.json({ success: true });
}
