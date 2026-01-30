package handlers

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/makosai/backend/internal/email"
)

// EmailHandler handles email requests
type EmailHandler struct {
	resendClient *email.ResendClient
}

// NewEmailHandler creates a new email handler
func NewEmailHandler() *EmailHandler {
	apiKey := os.Getenv("RESEND_API_KEY")
	fromEmail := os.Getenv("RESEND_FROM_EMAIL")

	if apiKey == "" {
		apiKey = "re_cLoDy9WK_J4Rq72bHAKaepUEG49bWDN9H"
	}
	if fromEmail == "" {
		fromEmail = "Makos.ai <support@makos.ai>"
	}

	return &EmailHandler{
		resendClient: email.NewResendClient(apiKey, fromEmail),
	}
}

// SendWelcomeEmail handles POST /api/email/welcome
func (h *EmailHandler) SendWelcomeEmail(c *fiber.Ctx) error {
	var input struct {
		Email string `json:"email"`
		Name  string `json:"name"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "Invalid request body",
		})
	}

	if input.Email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "Email is required",
		})
	}

	err := h.resendClient.SendWelcomeEmail(input.Email, input.Name)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   "Failed to send welcome email: " + err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Welcome email sent successfully",
	})
}



