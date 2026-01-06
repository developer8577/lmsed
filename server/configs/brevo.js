import SibApiV3Sdk from 'sib-api-v3-sdk';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendEmail = async (to, subject, htmlContent) => {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: "LMS Platform", email: process.env.SENDER_EMAIL || "no-reply@example.com" };
    sendSmtpEmail.to = [{ email: to }];

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully:', data);
        return data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export default apiInstance;
