import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
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
}

export const sendContributionNotification = async (details: ContributionDetails) => {
  const emailUser = process.env.EMAIL_USER || process.env.EMAIL_HOST_USER;
  const mailOptions = {
    from: `"The Wedding Place Support" <${emailUser}>`,
    to: 'mafaefoods@gmail.com',
    subject: `New Contribution Received for ${details.registryName}!`,
    html: `
      <h2>New Contribution Alert!</h2>
      <p>A new contribution has been made to the <strong>${details.registryName}</strong> registry.</p>
      <ul>
        <li><strong>Item:</strong> ${details.itemName}</li>
        <li><strong>Amount:</strong> ₦${details.amount.toLocaleString()}</li>
        <li><strong>Contributor:</strong> ${details.contributorName} (${details.contributorEmail})</li>
      </ul>
      <p>This is an automated notification from the BlissGifts application.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log('Contribution notification email sent successfully.');
};

export const sendPasswordResetEmail = async (email: string, resetLink: string) => {
  const emailUser = process.env.EMAIL_USER || process.env.EMAIL_HOST_USER;
  const mailOptions = {
    from: `"The Wedding Place Support" <${emailUser}>`,
    to: email,
    subject: "Reset Your Password - The Wedding Place",
    html: `
      <h2>Password Reset Request</h2>
      <p>We received a request to reset the password for your account on The Wedding Place.</p>
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