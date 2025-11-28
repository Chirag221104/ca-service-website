import * as sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@cakajalmalde.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'cakajalmalde08@gmail.com';

if (SENDGRID_API_KEY) {
    sgMail.setApiKey(SENDGRID_API_KEY);
} else {
    console.warn('SENDGRID_API_KEY is not set in environment variables.');
}

interface EmailData {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail(data: EmailData) {
    if (!SENDGRID_API_KEY) {
        console.log('Mocking email send (no API key):', data);
        return;
    }

    const msg = {
        to: data.to,
        from: SENDGRID_FROM_EMAIL,
        subject: data.subject,
        html: data.html,
    };

    try {
        await sgMail.send(msg);
        console.log(`Email sent to ${data.to}`);
    } catch (error: any) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error(error.response.body);
        }
    }
}

export const emailTemplates = {
    newRequestAdmin: (userName: string, serviceName: string, userEmail: string, requestId: string) => ({
        to: ADMIN_EMAIL,
        subject: `New Service Request: ${serviceName}`,
        html: `
            <h2>New Service Request</h2>
            <p><strong>User:</strong> ${userName} (${userEmail})</p>
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Request ID:</strong> ${requestId}</p>
            <p>Please log in to the admin dashboard to review this request.</p>
        `,
    }),

    requestReceivedUser: (userName: string, serviceName: string) => ({
        subject: `We received your request: ${serviceName}`,
        html: `
            <h2>Hello ${userName},</h2>
            <p>Thank you for requesting <strong>${serviceName}</strong>.</p>
            <p>We have received your request and will review it shortly.</p>
            <p>You can track the status of your request in your dashboard.</p>
        `,
    }),

    adminReviewedUser: (userName: string, serviceName: string) => ({
        subject: `Update on your request: ${serviceName}`,
        html: `
            <h2>Hello ${userName},</h2>
            <p>Your request for <strong>${serviceName}</strong> has been reviewed by our admin.</p>
            <p>We are currently processing it and will update you with the next steps soon.</p>
        `,
    }),

    statusChangedUser: (userName: string, serviceName: string, status: string, estimatedTime?: string) => {
        let statusMessage = '';
        if (status === 'in_progress') {
            statusMessage = 'is now <strong>In Progress</strong>.';
        } else if (status === 'resolved') {
            statusMessage = 'has been <strong>Resolved</strong>.';
        } else {
            statusMessage = `status has been updated to <strong>${status}</strong>.`;
        }

        return {
            subject: `Status Update: ${serviceName}`,
            html: `
                <h2>Hello ${userName},</h2>
                <p>Your request for <strong>${serviceName}</strong> ${statusMessage}</p>
                ${estimatedTime ? `<p><strong>Estimated Completion:</strong> ${estimatedTime}</p>` : ''}
                <p>Visit your dashboard for more details.</p>
            `,
        };
    },
};
