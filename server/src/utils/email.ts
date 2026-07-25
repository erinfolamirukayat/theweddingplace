import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface ContributionDetails {
  itemName: string;
  amount: number;
  contributorName: string;
  contributorEmail: string;
  registryName: string;
}

export const sendContributionNotification = async (details: ContributionDetails) => {
  const mailOptions = {
    from: `"BlissGifts Notifier" <${process.env.EMAIL_USER}>`,
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