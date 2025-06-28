// lib/emailService.ts

interface SendWelcomeEmailParams {
    toEmail: string;
}

export async function sendAccountConfirmationEmail({ toEmail }: SendWelcomeEmailParams): Promise<{ success: boolean; message: string }> {
    const subject = 'Bun Venit pe NutriFind! Contul Tău a fost Creat!';

    const htmlContent = `
    <!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Bun Venit pe NutriFind! Contul Tău a fost Creat!</title>
    <style type="text/css">
        /* Resetări de bază și font stack */
        body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; line-height: 1.6; color: #4a5568; background-color: #f4f7f6; }
        table { border-spacing: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        table td { border-collapse: collapse; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        a { text-decoration: none; color: #10B981; }

        /* Stiluri specifice emailului */
        .email-container { max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05); }
        .header-section { padding: 30px 20px; text-align: center; background-color: #ffffff; }
        .content-section { padding: 20px 40px; text-align: left; }
        .button-wrapper { text-align: center; margin-top: 30px; margin-bottom: 20px; }
        .button { background-color: #10B981; color: #ffffff; padding: 14px 30px; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px; transition: background-color 0.2s ease; }
        .button:hover { background-color: #0d9d6e; } /* Efect hover (s-ar putea să nu funcționeze în toți clienții) */
        .footer-section { padding: 20px 40px; text-align: center; font-size: 12px; color: #718096; background-color: #f8f8f8; border-top: 1px solid #edf2f7; border-radius: 0 0 8px 8px; }

        /* Responsive Styles */
        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; border-radius: 0 !important; }
            .content-section { padding: 15px 25px !important; }
            .header-section { padding: 20px 15px !important; }
            .footer-section { padding: 15px 25px !important; }
            .button { width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; box-sizing: border-box; }
            .button-wrapper { margin-top: 20px !important; margin-bottom: 15px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; min-width: 100%; background-color: #f4f7f6;">
    <center style="width: 100%; background-color: #f4f7f6;">
        <div style="display: none; font-size: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
            Bun venit pe NutriFind! Contul tău de nutriționist a fost creat cu succes.
        </div>

        <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container">
            <tr>
                <td class="header-section">
                    <h1 style="margin: 0; font-size: 32px; line-height: 1; font-weight: 700; color: #10B981;">NutriFind</h1>
  `;

    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/api/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ toEmail, subject, htmlContent }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error(`[EmailService] Eroare la trimiterea emailului de confirmare către ${toEmail}:`, result.message, result.details);
            return { success: false, message: result.message || 'Eroare la trimiterea emailului.' };
        }

        console.log(`[EmailService] Email de confirmare trimis cu succes către ${toEmail}.`);
        return { success: true, message: 'Email de confirmare trimis cu succes!' };

    } catch (error: any) {
        console.error(`[EmailService] Eroare la apelarea API-ului de trimitere email:`, error);
        return { success: false, message: `Eroare internă: ${error.message || 'A apărut o eroare.'}` };
    }
}