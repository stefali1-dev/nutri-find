import type { NextApiRequest, NextApiResponse } from 'next';

interface SendEmailRequestBody {
  toEmail: string;
  subject: string;
  htmlContent: string;
  // adăuga și alte câmpuri, cum ar fi `fromEmail` sau `replyTo` dacă vrei să le controlezi din client
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Metodă nepermisă. Doar POST este permis.' });
  }

  const { toEmail, subject, htmlContent }: SendEmailRequestBody = req.body;

  if (!toEmail || !subject || !htmlContent) {
    return res.status(400).json({ message: 'Lipsesc câmpuri esențiale pentru trimiterea emailului (toEmail, subject, htmlContent).' });
  }

  const fromEmail = 'NutriFind <support@nutrifind.ro>';
  const apiKey = process.env.SELFMAILKIT_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ message: 'Cheia API SelfMailKit nu este configurată.' });
  }

  const emailData = {
    to: [toEmail],
    from: fromEmail,
    subject: subject,
    html: htmlContent,
  };

  try {
    const response = await fetch('https://api.selfmailkit.com/v1/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`[SelfMailKit] Eroare la trimiterea emailului către ${toEmail}:`, errorData);
      return res.status(response.status).json({
        message: 'Eroare la trimiterea emailului prin SelfMailKit.',
        details: errorData.message || `HTTP ${response.status}`,
      });
    }

    const result = await response.json();
    console.log(`[SelfMailKit] Email trimis cu succes către: ${toEmail}`);
    return res.status(200).json({ message: 'Email trimis cu succes!' });
  } catch (error: any) {
    console.error(`[SelfMailKit] Eroare la trimiterea emailului către ${toEmail}:`, error);

    return res.status(500).json({
      message: 'A apărut o eroare necunoscută la trimiterea emailului.',
      details: error.message || 'Verifică log-urile serverului.',
    });
  }
}