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
        <title>Confirmare Cont NutriFind</title>
        <style>
            body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; }
            .button { background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
            .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.05); }
            .header { text-align: center; color: #10B981; font-size: 24px; font-weight: bold; margin-bottom: 20px;}
            .footer { font-size: 12px; color: #888; text-align: center; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;}
            a { color: #10B981; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">NutriFind</div>
            <p>Salut,</p>
            <p>Contul tău de nutriționist pe platforma NutriFind a fost creat cu succes!</p>
            <p>Ne bucurăm să te avem alături. Poți acum să te autentifici și să-ți completezi profilul pentru a te pregăti să primești clienți.</p>
            <p style="text-align: center; margin-top: 30px;">
                <a href="https://nutrifind.ro/nutritionisti/login" class="button" target="_blank" rel="noopener noreferrer">Autentifică-te Acum</a>
            </p>
            <p style="margin-top: 20px;">Cu drag,<br>Echipa NutriFind</p>
            <div class="footer">
                Acest email a fost trimis automat. Te rugăm să nu răspunzi la el direct. Pentru suport, ne poți contacta la <a href="mailto:support@nutrifind.ro">support@nutrifind.ro</a>.
            </div>
        </div>
    </body>
    </html>
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