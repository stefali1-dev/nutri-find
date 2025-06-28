import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

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

  const fromEmail = 'support@nutrifind.ro';

  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: subject,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log(`[SendGrid] Email trimis cu succes către: ${toEmail}`);
    return res.status(200).json({ message: 'Email trimis cu succes!' });
  } catch (error: any) {
    console.error(`[SendGrid] Eroare la trimiterea emailului către ${toEmail}:`, error);

    if (error.response) {
      console.error(error.response.body);
      return res.status(error.code || 500).json({
        message: 'Eroare la trimiterea emailului prin SendGrid.',
        details: error.response.body || error.message,
      });
    }

    return res.status(500).json({
      message: 'A apărut o eroare necunoscută la trimiterea emailului.',
      details: error.message || 'Verifică log-urile serverului.',
    });
  }
}