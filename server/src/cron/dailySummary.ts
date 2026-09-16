import cron from 'node-cron';
import { pool } from '../index';
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

export const startDailySummaryCron = () => {
  // Run every day at 18:00 (6:00 PM)
  cron.schedule('0 18 * * *', async () => {
    console.log('Running daily summary cron job...');
    try {
      // Find all users with notification_preference = 'daily_summary'
      // And join their contributions from the last 24 hours
      const query = `
        SELECT u.email as couple_email, r.couple_names, r.id as registry_id,
               COUNT(c.id) as gift_count,
               SUM(c.amount) as total_amount
        FROM users u
        JOIN registries r ON r.user_id = u.id
        JOIN registry_items ri ON ri.registry_id = r.id
        JOIN contributors c ON c.registry_item_id = ri.id
        WHERE u.notification_preference = 'daily_summary'
          AND c.status = 'completed'
          AND c.created_at >= NOW() - INTERVAL '24 HOURS'
        GROUP BY u.email, r.couple_names, r.id
        HAVING COUNT(c.id) > 0;
      `;
      
      const result = await pool.query(query);
      const emailUser = process.env.EMAIL_USER || process.env.EMAIL_HOST_USER;

      for (const row of result.rows) {
        const mailOptions = {
          from: `"Celebron Support" <${emailUser}>`,
          to: row.couple_email,
          cc: 'info@celebron.co',
          subject: `Daily Gift Summary for ${row.couple_names}!`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
              <h2 style="color: #B8860B;">Your Daily Registry Summary</h2>
              <p>Hello ${row.couple_names},</p>
              <p>You received <strong>${row.gift_count}</strong> new gift(s) in the last 24 hours!</p>
              <p>Total amount received today: <strong>₦${Number(row.total_amount).toLocaleString()}</strong></p>
              <br>
              <p>Log in to your dashboard to view the details and read any messages from your guests.</p>
              <br>
              <p>Best regards,<br>Celebron Team</p>
            </div>
          `,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Sent daily summary to ${row.couple_email}`);
        } catch (emailError) {
          console.error(`Failed to send daily summary to ${row.couple_email}:`, emailError);
        }
      }
      console.log('Daily summary cron job completed.');
    } catch (error) {
      console.error('Error in daily summary cron job:', error);
    }
  });
  console.log('Daily summary cron job scheduled for 18:00 every day.');
};
