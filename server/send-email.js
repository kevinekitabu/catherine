import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.post('/send-feedback-email', async (req, res) => {
  const { name, email, message, blogPostId, blogPostTitle } = req.body || {};

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY not configured on the server.' });
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'feedback@example.com';
  // Use the user's entered email as the sender
  const fromEmail = email || process.env.ADMIN_EMAIL || 'mainairungu99@gmail.com';
  const subject = blogPostId
    ? `New feedback for post: ${blogPostTitle || blogPostId}`
    : 'New site feedback';

  const text = `Name: ${name || '—'}\nEmail: ${email || '—'}\n\nMessage:\n${message || '—'}`;
  const html = `
    <h2>${subject}</h2>
    <p><strong>Name:</strong> ${name || '—'}</p>
    <p><strong>Email:</strong> ${email || '—'}</p>
    <hr />
    <pre style="white-space:pre-wrap">${message || '—'}</pre>
  `;

  // build recipients: admin always, and optionally the submitter
  const recipients = [adminEmail];
  if (email && typeof email === 'string') {
    // avoid duplicating admin if same
    if (!recipients.includes(email)) recipients.push(email);
  }

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: recipients,
        subject,
        text,
        html,
      }),
    });

    const bodyText = await resp.text();
    let data;
    try { data = JSON.parse(bodyText); } catch (e) { data = bodyText; }

    if (!resp.ok) {
      console.error('Resend error response:', data);
      return res.status(502).json({ error: 'Resend API returned an error', details: data });
    }

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error('Error sending email via Resend:', err);
    return res.status(500).json({ error: 'Failed to send email', details: String(err) });
  }
});

app.get('/', (req, res) => {
  res.send('Send-email server is running. Use POST /send-feedback-email to send feedback emails.');
});

app.listen(PORT, () => {
  console.log(`Send-email server listening on http://localhost:${PORT}`);
  console.log('Make sure RESEND_API_KEY and ADMIN_EMAIL are set in your environment or .env file.');
});
