import * as React from 'react';
import { Html, Body, Head, Heading, Container, Text, Link, Preview, Section } from '@react-email/components';

interface NotificationEmailProps {
    title: string;
    message: string;
    actorName: string;
    projectName: string;
    actionUrl: string;
}

export const NotificationEmail: React.FC<Readonly<NotificationEmailProps>> = ({
    title,
    message,
    actorName,
    projectName,
    actionUrl,
}) => (
    <Html>
        <Head />
        <Preview>{title}</Preview>
        <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' }}>
            <Container style={{ backgroundColor: '#ffffff', margin: '0 auto', padding: '20px', borderRadius: '5px' }}>
                <Heading style={{ color: '#333', fontSize: '24px', fontWeight: 'bold' }}>ResearchFlow</Heading>
                <Text style={{ fontSize: '16px', color: '#333' }}>
                    <strong>{title}</strong>
                </Text>
                <Text style={{ fontSize: '14px', color: '#555' }}>
                    {message}
                </Text>
                <Section style={{ borderTop: '1px solid #eee', marginTop: '20px', paddingTop: '20px' }}>
                    <Text style={{ fontSize: '14px', color: '#555', margin: '5px 0' }}>
                        <strong>Project:</strong> {projectName}
                    </Text>
                    <Text style={{ fontSize: '14px', color: '#555', margin: '5px 0' }}>
                        <strong>Actor:</strong> {actorName}
                    </Text>
                </Section>
                <Section style={{ marginTop: '30px' }}>
                    <Link href={actionUrl} style={{ backgroundColor: '#000', color: '#fff', padding: '12px 20px', borderRadius: '5px', textDecoration: 'none', display: 'inline-block' }}>
                        View in ResearchFlow
                    </Link>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default NotificationEmail;
