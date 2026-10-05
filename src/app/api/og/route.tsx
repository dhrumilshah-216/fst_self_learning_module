import { ImageResponse } from 'next/og';
// Next.js Edge API routes
export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Dynamic params
        const title = searchParams.get('title')?.slice(0, 75) || 'ResearchFlow';
        const area = searchParams.get('area') || 'Research Category';
        const status = searchParams.get('status') || 'ACTIVE';

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        backgroundColor: '#09090b', // dark background
                        padding: '80px',
                        fontFamily: 'sans-serif',
                    }}
                >
                    {/* Top subtle branding */}
                    <div style={{ display: 'flex', alignItems: 'center', color: '#a1a1aa' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                        <span style={{ fontSize: 24, marginLeft: 12, fontWeight: 500, letterSpacing: '-0.02em' }}>ResearchFlow</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Status and Area badges */}
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                            <div style={{
                                padding: '8px 16px',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                color: '#e2e8f0',
                                borderRadius: '9999px',
                                fontSize: 20,
                                fontWeight: 600
                            }}>
                                {area}
                            </div>
                            <div style={{
                                padding: '8px 16px',
                                backgroundColor: status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.1)',
                                color: status === 'ACTIVE' ? '#34d399' : '#e2e8f0',
                                borderRadius: '9999px',
                                fontSize: 20,
                                fontWeight: 600
                            }}>
                                {status}
                            </div>
                        </div>

                        {/* Title */}
                        <h1
                            style={{
                                fontSize: 64,
                                fontFamily: 'sans-serif',
                                fontWeight: 700,
                                color: 'white',
                                lineHeight: 1.1,
                                letterSpacing: '-0.04em',
                                margin: 0,
                                padding: 0,
                                maxWidth: '900px'
                            }}
                        >
                            {title}
                        </h1>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
