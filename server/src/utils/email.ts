import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || process.env.EMAIL_HOST_USER,
    pass: process.env.EMAIL_PASS || process.env.EMAIL_HOST_PASSWORD,
  },
  connectionTimeout: 10000, // 10 seconds timeout
});

interface ContributionDetails {
  itemName: string;
  amount: number;
  contributorName: string;
  contributorEmail: string;
  registryName: string;
  coupleEmail: string;
}

export const sendContributionNotification = async (details: ContributionDetails) => {
  const emailUser = process.env.EMAIL_USER || process.env.EMAIL_HOST_USER;
  const mailOptions = {
    from: `"Celebron Support" <${emailUser}>`,
    to: details.coupleEmail,
    cc: 'info@celebron.co',
    subject: `New Contribution Received for ${details.registryName}!`,
    html: `
      <h2>New Contribution Alert!</h2>
      <p>A new contribution has been made to the <strong>${details.registryName}</strong> registry.</p>
      <ul>
        <li><strong>Item:</strong> ${details.itemName}</li>
        <li><strong>Amount:</strong> ₦${details.amount.toLocaleString()}</li>
        <li><strong>Contributor:</strong> ${details.contributorName} (${details.contributorEmail})</li>
      </ul>
      <p>Log in to your dashboard to view more details!</p>
      <br>
      <p>Best regards,<br>Celebron Team</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Contribution notification email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending contribution notification email:', error);
    throw error;
  }
};

export const sendThankYouToContributor = async (details: ContributionDetails) => {
  const emailUser = process.env.EMAIL_USER || process.env.EMAIL_HOST_USER;
  const mailOptions = {
    from: `"Celebron" <${emailUser}>`,
    to: details.contributorEmail,
    subject: `Thank you for your gift to ${details.registryName}!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #B8860B;">Thank You, ${details.contributorName}!</h2>
        <p>Your generous contribution of <strong>₦${details.amount.toLocaleString()}</strong> towards the <strong>${details.itemName}</strong> has been successfully received.</p>
        <p>The couple (${details.registryName}) has been notified of your wonderful gift.</p>
        <br>
        <p>If you left a message, it has been saved to their registry guestbook.</p>
        <br>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <p style="font-size: 12px; color: #777;">
          This is an automated receipt from Celebron.co. If you have any questions, please reply to this email.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Thank you email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending thank you email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string, resetLink: string) => {
  const emailUser = process.env.EMAIL_USER || process.env.EMAIL_HOST_USER;
  const mailOptions = {
    from: `"Celebron Support" <${emailUser}>`,
    to: email,
    subject: "Reset Your Password - Celebron",
    html: `
      <h2>Password Reset Request</h2>
      <p>We received a request to reset the password for your account on Celebron.</p>
      <p>Click the button below to reset your password (valid for 15 minutes):</p>
      <div style="margin: 20px 0;">
        <a href="${resetLink}" style="padding: 12px 24px; background-color: #B8860B; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log('Password reset email sent successfully.');
};

export const sendVerificationEmail = async (email: string, firstName: string, verificationLink: string) => {
  const emailUser = process.env.EMAIL_USER || process.env.EMAIL_HOST_USER;
  const mailOptions = {
    from: `"Celebron Support" <${emailUser}>`,
    to: email,
    subject: "Verify Your Email Address - Celebron",
    html: `
      <h2>Welcome to Celebron, ${firstName}!</h2>
      <p>We're thrilled to have you here. Please verify your email address to get the most out of your account.</p>
      <div style="margin: 20px 0;">
        <a href="${verificationLink}" style="padding: 12px 24px; background-color: #B8860B; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Verify Email Address</a>
      </div>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p>${verificationLink}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log('Verification email sent successfully.');
};