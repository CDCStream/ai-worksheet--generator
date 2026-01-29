package handlers

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/makosai/backend/internal/ai"
	"github.com/makosai/backend/internal/models"
)

// WorksheetHandler handles worksheet-related requests
type WorksheetHandler struct {
	generator  ai.Generator
	worksheets map[string]*models.Worksheet
}

// NewWorksheetHandler creates a new worksheet handler
func NewWorksheetHandler(generator ai.Generator) *WorksheetHandler {
	return &WorksheetHandler{
		generator:  generator,
		worksheets: make(map[string]*models.Worksheet),
	}
}

// GenerateWorksheet handles POST /api/worksheets/generate
func (h *WorksheetHandler) GenerateWorksheet(c *fiber.Ctx) error {
	var input models.WorksheetGeneratorInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(models.GenerationResponse{
			Success: false,
			Error:   "Invalid request body",
		})
	}

	// Validate required fields
	if input.Topic == "" {
		return c.Status(fiber.StatusBadRequest).JSON(models.GenerationResponse{
			Success: false,
			Error:   "Topic is required",
		})
	}

	// Set defaults
	if input.Subject == "" {
		input.Subject = "general"
	}
	if input.GradeLevel == "" {
		input.GradeLevel = "5"
	}
	if input.Difficulty == "" {
		input.Difficulty = "medium"
	}
	if input.QuestionCount == 0 {
		input.QuestionCount = 10
	}
	if len(input.QuestionTypes) == 0 {
		input.QuestionTypes = []string{"multiple_choice"}
	}
	if input.Language == "" {
		input.Language = "en"
	}

	// Generate worksheet
	log.Printf("🚀 Generating worksheet for topic: %s", input.Topic)
	worksheet, err := h.generator.GenerateWorksheet(c.Context(), input)
	if err != nil {
		log.Printf("❌ Generation error: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(models.GenerationResponse{
			Success: false,
			Error:   "Failed to generate worksheet: " + err.Error(),
		})
	}
	log.Printf("✅ Worksheet generated successfully: %s", worksheet.ID)

	// Store worksheet
	h.worksheets[worksheet.ID] = worksheet

	return c.JSON(models.GenerationResponse{
		Success:   true,
		Worksheet: worksheet,
	})
}

// GetWorksheets handles GET /api/worksheets
func (h *WorksheetHandler) GetWorksheets(c *fiber.Ctx) error {
	worksheets := make([]*models.Worksheet, 0, len(h.worksheets))
	for _, ws := range h.worksheets {
		worksheets = append(worksheets, ws)
	}
	return c.JSON(fiber.Map{
		"success":    true,
		"worksheets": worksheets,
	})
}

// GetWorksheet handles GET /api/worksheets/:id
func (h *WorksheetHandler) GetWorksheet(c *fiber.Ctx) error {
	id := c.Params("id")
	worksheet, exists := h.worksheets[id]
	if !exists {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"error":   "Worksheet not found",
		})
	}
	return c.JSON(fiber.Map{
		"success":   true,
		"worksheet": worksheet,
	})
}

// UpdateWorksheet handles PUT /api/worksheets/:id
func (h *WorksheetHandler) UpdateWorksheet(c *fiber.Ctx) error {
	id := c.Params("id")
	worksheet, exists := h.worksheets[id]
	if !exists {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"error":   "Worksheet not found",
		})
	}

	var updates models.Worksheet
	if err := c.BodyParser(&updates); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "Invalid request body",
		})
	}

	// Update fields
	if updates.Title != "" {
		worksheet.Title = updates.Title
	}
	if updates.Status != "" {
		worksheet.Status = updates.Status
	}
	if len(updates.Questions) > 0 {
		worksheet.Questions = updates.Questions
	}

	return c.JSON(fiber.Map{
		"success":   true,
		"worksheet": worksheet,
	})
}

// DeleteWorksheet handles DELETE /api/worksheets/:id
func (h *WorksheetHandler) DeleteWorksheet(c *fiber.Ctx) error {
	id := c.Params("id")
	if _, exists := h.worksheets[id]; !exists {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"error":   "Worksheet not found",
		})
	}

	delete(h.worksheets, id)
	return c.JSON(fiber.Map{
		"success": true,
		"message": "Worksheet deleted",
	})
}

// ExportWorksheetPDF handles GET /api/worksheets/:id/export/pdf
func (h *WorksheetHandler) ExportWorksheetPDF(c *fiber.Ctx) error {
	id := c.Params("id")
	worksheet, exists := h.worksheets[id]
	if !exists {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"error":   "Worksheet not found",
		})
	}

	// Increment download count
	worksheet.Downloads++

	// For now, return JSON - actual PDF generation would require additional libraries
	return c.JSON(fiber.Map{
		"success":   true,
		"message":   "Use browser print dialog for PDF export",
		"worksheet": worksheet,
	})
}

// GetOptions handles GET /api/worksheets/options
func (h *WorksheetHandler) GetOptions(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"success": true,
		"subjects": []map[string]string{
			{"value": "math", "label": "Mathematics"},
			{"value": "science", "label": "Science"},
			{"value": "english", "label": "English"},
			{"value": "history", "label": "History"},
			{"value": "geography", "label": "Geography"},
			{"value": "biology", "label": "Biology"},
			{"value": "chemistry", "label": "Chemistry"},
			{"value": "physics", "label": "Physics"},
		},
		"grades": []map[string]string{
			{"value": "k", "label": "Kindergarten"},
			{"value": "1", "label": "1st Grade"},
			{"value": "2", "label": "2nd Grade"},
			{"value": "3", "label": "3rd Grade"},
			{"value": "4", "label": "4th Grade"},
			{"value": "5", "label": "5th Grade"},
			{"value": "6", "label": "6th Grade"},
			{"value": "7", "label": "7th Grade"},
			{"value": "8", "label": "8th Grade"},
			{"value": "9", "label": "9th Grade"},
			{"value": "10", "label": "10th Grade"},
			{"value": "11", "label": "11th Grade"},
			{"value": "12", "label": "12th Grade"},
		},
		"question_types": []map[string]string{
			{"value": "multiple_choice", "label": "Multiple Choice"},
			{"value": "fill_blank", "label": "Fill in the Blank"},
			{"value": "true_false", "label": "True/False"},
			{"value": "matching", "label": "Matching"},
			{"value": "short_answer", "label": "Short Answer"},
			{"value": "essay", "label": "Essay"},
		},
		"difficulties": []map[string]string{
			{"value": "easy", "label": "Easy"},
			{"value": "medium", "label": "Medium"},
			{"value": "hard", "label": "Hard"},
		},
	})
}

