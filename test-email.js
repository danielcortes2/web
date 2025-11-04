// Test email service
const emailService = require('./utils/emailService-sendgrid');

async function testEmail() {
    try {
        console.log('Testing email service...');
        const result = await emailService.sendContactFormEmail({
            name: 'Test User',
            email: 'test@example.com',
            phone: '+1234567890',
            budget: '1000-3000',
            timeline: '1-mes',
            message: 'This is a test email from the email service',
            priority: 'Media'
        });
        console.log('✅ Email sent successfully:', result);
    } catch (error) {
        console.error('❌ Email failed:', error.message);
    }
}

testEmail();