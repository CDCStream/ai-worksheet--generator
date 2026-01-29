package email

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

type ResendClient struct {
	APIKey    string
	FromEmail string
}

type EmailRequest struct {
	From    string   `json:"from"`
	To      []string `json:"to"`
	Subject string   `json:"subject"`
	Html    string   `json:"html"`
}

type EmailResponse struct {
	Id string `json:"id"`
}

func NewResendClient(apiKey, fromEmail string) *ResendClient {
	return &ResendClient{
		APIKey:    apiKey,
		FromEmail: fromEmail,
	}
}

func (r *ResendClient) SendEmail(to, subject, html string) error {
	emailReq := EmailRequest{
		From:    r.FromEmail,
		To:      []string{to},
		Subject: subject,
		Html:    html,
	}

	jsonData, err := json.Marshal(emailReq)
	if err != nil {
		return fmt.Errorf("failed to marshal email request: %w", err)
	}

	req, err := http.NewRequest("POST", "https://api.resend.com/emails", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+r.APIKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return fmt.Errorf("resend API returned status: %d", resp.StatusCode)
	}

	return nil
}

func (r *ResendClient) SendWelcomeEmail(to, userName string) error {
	subject := "Welcome to Makos.ai! 🎉"
	html := generateWelcomeEmailHTML(userName)
	return r.SendEmail(to, subject, html)
}

func generateWelcomeEmailHTML(userName string) string {
	if userName == "" {
		userName = "there"
	}

	return fmt.Sprintf(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Makos.ai</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
    <table role="presentation" style="width: 100%%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%%; max-width: 600px; border-collapse: collapse;">

                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #14b8a6 0%%, #0891b2 100%%); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
                            <img src="https://makos.ai/logo.png" alt="Makos.ai" style="height: 60px; margin-bottom: 20px;">
                            <h1 style="color: #ffffff; font-size: 32px; margin: 0; font-weight: 700;">Welcome aboard! 🎉</h1>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

                            <p style="font-size: 18px; color: #374151; margin: 0 0 20px 0; line-height: 1.6;">
                                Hey %s! 👋
                            </p>

                            <p style="font-size: 16px; color: #6b7280; margin: 0 0 24px 0; line-height: 1.7;">
                                Thanks for joining Makos.ai! We're super excited to have you here. You've just unlocked the power to create amazing worksheets in seconds with AI.
                            </p>

                            <!-- Gift Box -->
                            <table role="presentation" style="width: 100%%; border-collapse: collapse; margin-bottom: 24px;">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #fef3c7 0%%, #fde68a 100%%); padding: 24px; border-radius: 12px; border: 2px solid #f59e0b;">
                                        <table role="presentation" style="width: 100%%;">
                                            <tr>
                                                <td style="width: 60px; vertical-align: top;">
                                                    <div style="font-size: 40px;">🎁</div>
                                                </td>
                                                <td>
                                                    <p style="font-size: 18px; font-weight: 700; color: #92400e; margin: 0 0 8px 0;">Your Welcome Gift</p>
                                                    <p style="font-size: 14px; color: #a16207; margin: 0;">You've got <strong>5 free credits</strong> to create worksheets. Each worksheet costs just 2 credits!</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <p style="font-size: 16px; color: #6b7280; margin: 0 0 24px 0; line-height: 1.7;">
                                Here's what you can do with Makos.ai:
                            </p>

                            <!-- Features List -->
                            <table role="presentation" style="width: 100%%; border-collapse: collapse; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                        <table role="presentation">
                                            <tr>
                                                <td style="width: 40px; font-size: 24px;">✨</td>
                                                <td style="font-size: 15px; color: #374151;"><strong>AI-Powered Generation</strong> - Create worksheets in any subject</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                        <table role="presentation">
                                            <tr>
                                                <td style="width: 40px; font-size: 24px;">📝</td>
                                                <td style="font-size: 15px; color: #374151;"><strong>Multiple Question Types</strong> - MCQ, fill-in-blank, essays & more</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                        <table role="presentation">
                                            <tr>
                                                <td style="width: 40px; font-size: 24px;">🎯</td>
                                                <td style="font-size: 15px; color: #374151;"><strong>Focus on Mistakes</strong> - Practice worksheets from quiz errors</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0;">
                                        <table role="presentation">
                                            <tr>
                                                <td style="width: 40px; font-size: 24px;">🌍</td>
                                                <td style="font-size: 15px; color: #374151;"><strong>40+ Languages</strong> - Generate in your preferred language</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%%; border-collapse: collapse;">
                                <tr>
                                    <td align="center" style="padding: 10px 0;">
                                        <a href="https://makos.ai/generator" style="display: inline-block; background: linear-gradient(135deg, #14b8a6 0%%, #0891b2 100%%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 700; box-shadow: 0 4px 14px rgba(20, 184, 166, 0.4);">
                                            Create Your First Worksheet →
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="font-size: 14px; color: #9ca3af; margin: 24px 0 0 0; text-align: center;">
                                Need help? Just reply to this email - we're always here for you! 💚
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <p style="font-size: 13px; color: #9ca3af; margin: 0 0 10px 0;">
                                Made with ❤️ by the Makos.ai team
                            </p>
                            <p style="font-size: 12px; color: #d1d5db; margin: 0;">
                                © 2026 Makos.ai. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`, userName)
}

