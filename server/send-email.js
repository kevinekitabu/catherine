import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';

dotenv.config();

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

app.post('/send-feedback-email', async (req, res) => {
  try {
    const { name, email, message, blogPostId, blogPostTitle } = req.body || {};

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        error: 'RESEND_API_KEY not configured on the server.' 
      });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email, and message are required.' 
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'mainairungu99@gmail.com';
    // Use verified domain from environment
    const fromEmail = process.env.FROM_EMAIL || 'noreply@whatsyourstoryafrica.com';
    
    const subject = blogPostId
      ? `New feedback for post: ${blogPostTitle || blogPostId}`
      : 'New site feedback received';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">
          ${subject}
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${name}</p>
          <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
          ${blogPostTitle ? `<p style="margin: 0 0 10px 0;"><strong>Blog Post:</strong> ${blogPostTitle}</p>` : ''}
        </div>
        
        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="color: #374151; margin-top: 0;">Message:</h3>
          <p style="line-height: 1.6; color: #4b5563; white-space: pre-wrap;">${message}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; font-size: 14px; color: #92400e;">
            This feedback was submitted through the What's Your Story Africa website.
          </p>
        </div>
      </div>
    `;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      subject: subject,
      html: htmlContent,
      replyTo: email, // Allow replying directly to the person who submitted feedback
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to send email', 
        details: error 
      });
    }

    console.log('Email sent successfully:', data);
    return res.status(200).json({ 
      success: true, 
      message: 'Feedback email sent successfully',
      emailId: data.id
    });

  } catch (err) {
    console.error('Error sending email via Resend:', err);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error', 
      details: err.message 
    });
  }
});

app.get('/', (req, res) => {
  res.send('Send-email server is running. Use POST /send-feedback-email to send feedback emails.');
});

app.listen(PORT, () => {
  console.log(`Send-email server listening on http://localhost:${PORT}`);
  console.log('Make sure RESEND_API_KEY and ADMIN_EMAIL are set in your environment or .env file.');
});
