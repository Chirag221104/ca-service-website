import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { sendEmail, emailTemplates } from './emailService';

admin.initializeApp();

// Trigger: When a new service request is created
export const onServiceRequestCreated = functions.firestore
    .document('serviceRequests/{requestId}')
    .onCreate(async (snap, context) => {
        const data = snap.data();
        const requestId = context.params.requestId;

        const { userName, userEmail, serviceName } = data;

        // 1. Send email to Admin
        const adminEmailData = emailTemplates.newRequestAdmin(userName, serviceName, userEmail, requestId);
        await sendEmail(adminEmailData);

        // 2. Send confirmation email to User
        const userEmailData = {
            to: userEmail,
            ...emailTemplates.requestReceivedUser(userName, serviceName),
        };
        await sendEmail(userEmailData);
    });

// Trigger: When a service request is updated
export const onServiceRequestUpdated = functions.firestore
    .document('serviceRequests/{requestId}')
    .onUpdate(async (change, context) => {
        const before = change.before.data();
        const after = change.after.data();
        const { userName, userEmail, serviceName } = after;

        // Check if 'seenByAdmin' changed from false to true
        if (!before.seenByAdmin && after.seenByAdmin) {
            const emailData = {
                to: userEmail,
                ...emailTemplates.adminReviewedUser(userName, serviceName),
            };
            await sendEmail(emailData);
        }

        // Check if 'status' changed
        if (before.status !== after.status) {
            const emailData = {
                to: userEmail,
                ...emailTemplates.statusChangedUser(userName, serviceName, after.status, after.estimatedTime),
            };
            await sendEmail(emailData);
        }
    });
