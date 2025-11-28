import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, service, userName, userEmail, requestId } = body;

        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'cakajalmalde08@gmail.com';
        const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@cakajalmalde.com';

        if (type === 'new_request') {
            // Send email to admin
            const adminMessage = {
                to: adminEmail,
                from: fromEmail,
                subject: `New Service Request - ${service}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0c4a6e 100%); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">New Service Request</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1e3a8a;">Service Request Details</h2>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 10px 0; font-weight: bold;">Service:</td>
                  <td style="padding: 10px 0;">${service}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 10px 0; font-weight: bold;">Requested By:</td>
                  <td style="padding: 10px 0;">${userName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 10px 0; font-weight: bold;">Email:</td>
                  <td style="padding: 10px 0;">${userEmail}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 10px 0; font-weight: bold;">Request ID:</td>
                  <td style="padding: 10px 0;">${requestId}</td>
                </tr>
              </table>
              <p style="margin-top: 20px; color: #6b7280;">
                Please log in to your admin dashboard to view and respond to this request.
              </p>
            </div>
          </div>
        `,
            };

            // Send confirmation email to user
            const userMessage = {
                to: userEmail,
                from: fromEmail,
                subject: `Service Request Confirmation - ${service}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0c4a6e 100%); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">Request Confirmed!</h1>
            </div>
            <div style="padding: 30px; background: #f9fafb;">
              <p style="font-size: 16px; color: #374151;">Dear ${userName},</p>
              <p style="font-size: 16px; color: #374151;">
                Thank you for requesting our service: <strong>${service}</strong>
              </p>
              <p style="font-size: 16px; color: #374151;">
                We have received your request and will get back to you soon. You can track the status
                of your request in your dashboard.
              </p>
              <div style="margin: 30px 0; padding: 20px; background: white; border-left: 4px solid #1e3a8a; border-radius: 4px;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  <strong>Request ID:</strong> ${requestId}
                </p>
              </div>
              <p style="font-size: 14px; color: #6b7280;">
                Best regards,<br/>
                <strong>CA Kajal Malde</strong>
              </p>
            </div>
          </div>
        `,
            };

            if (process.env.SENDGRID_API_KEY) {
                await sgMail.send(adminMessage);
                await sgMail.send(userMessage);
            } else {
                console.warn('SendGrid not configured. Email notifications skipped.');
                console.log('Admin email:', adminMessage);
                console.log('User email:', userMessage);
            }

            // TODO: Add Twilio SMS/WhatsApp notifications here if needed
            // This would require additional configuration with Twilio

            return NextResponse.json({ success: true, message: 'Notifications sent' });
        }

        return NextResponse.json({ success: false, message: 'Invalid notification type' });
    } catch (error: any) {
        console.error('Notification error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
