'use client';

import { useState, useEffect } from 'react';
import {
  WorksheetGeneratorInput,
  SUBJECTS,
  GRADE_LEVELS,
  QUESTION_TYPES,
  DIFFICULTIES,
  LANGUAGES,
  QuestionType,
  Difficulty
} from '@/lib/types';
import { Sparkles, ChevronDown, ChevronUp, Wand2, CreditCard } from 'lucide-react';
import { useModal } from '@/components/Modal';
import { getWorksheetCreditCost } from '@/lib/credits';

interface WorksheetFormProps {
  onGenerate: (input: WorksheetGeneratorInput) => void;
  isGenerating: boolean;
  initialTopic?: string;
  // Focus mode props - for practicing mistakes
  focusMode?: boolean;
  focusMistakes?: string;
  initialSubject?: string;
  initialGradeLevel?: string;
  initialDifficulty?: string;
  initialLanguage?: string;
}

export function WorksheetForm({
  onGenerate,
  isGenerating,
  initialTopic = '',
  focusMode = false,
  focusMistakes = '',
  initialSubject = '',
  initialGradeLevel = '',
  initialDifficulty = '',
  initialLanguage = '',
}: WorksheetFormProps) {
  const { showWarning } = useModal();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formData, setFormData] = useState<WorksheetGeneratorInput>({
    title: '',
    topic: initialTopic,
    subject: initialSubject || 'math',
    grade_level: initialGradeLevel || '5',
    difficulty: (initialDifficulty as Difficulty) || 'medium',
    question_count: focusMode ? 10 : 10, // Default 10 for focus mode
    question_types: ['multiple_choice'],
    language: initialLanguage || 'en',
    include_answer_key: true,
    additional_instructions: focusMode
      ? `FOCUS MODE: Generate questions similar to these that the student got wrong:\n${focusMistakes}\n\nCreate questions that test the same concepts but with different numbers/variations.`
      : '',
  });

  // Update form when initial values change
  useEffect(() => {
    if (initialTopic) {
      setFormData(prev => ({ ...prev, topic: initialTopic }));
    }
  }, [initialTopic]);

  // Set initial values for focus mode
  useEffect(() => {
    if (focusMode && initialTopic) {
      setFormData(prev => ({
        ...prev,
        topic: initialTopic,
        subject: initialSubject || prev.subject,
        grade_level: initialGradeLevel || prev.grade_level,
        difficulty: (initialDifficulty as Difficulty) || prev.difficulty,
        language: initialLanguage || prev.language,
        additional_instructions: `🎯 FOCUS MODE - PRACTICE MISTAKES:
The student got the following questions wrong and needs more practice on these concepts:

${focusMistakes}

INSTRUCTIONS:
1. Generate NEW questions that test the SAME concepts as the mistakes above
2. Use different numbers, examples, or scenarios
3. Keep the same difficulty level but vary the approach
4. Focus on helping the student understand where they went wrong
5. Include helpful hints or step-by-step explanations in the answers`,
      }));
    }
  }, [focusMode, initialTopic, initialSubject, initialGradeLevel, initialDifficulty, initialLanguage, focusMistakes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim()) {
      showWarning('Please enter a topic to generate your worksheet.', 'Topic Required');
      return;
    }
    onGenerate(formData);
  };

  const toggleQuestionType = (type: QuestionType) => {
    setFormData(prev => {
      const types = prev.question_types.includes(type)
        ? prev.question_types.filter(t => t !== type)
        : [...prev.question_types, type];
      return { ...prev, question_types: types.length > 0 ? types : ['multiple_choice'] };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Topic - Hero input */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span className="text-lg">✏️</span> What do you want to teach?
        </label>
        <input
          type="text"
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          placeholder="e.g., Photosynthesis, Fractions, World War II..."
          className="input-field text-lg py-4"
          required
        />
      </div>

      {/* Subject & Grade Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-lg">📚</span> Subject
          </label>
          <select
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="select-field"
          >
            {SUBJECTS.map(subject => (
              <option key={subject.value} value={subject.value}>
                {subject.emoji} {subject.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-lg">🎓</span> Grade Level
          </label>
          <select
            value={formData.grade_level}
            onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
            className="select-field"
          >
            {GRADE_LEVELS.map(grade => (
              <option key={grade.value} value={grade.value}>
                {grade.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span className="text-lg">⚡</span> Difficulty Level
        </label>
        <div className="flex gap-3">
          {DIFFICULTIES.map(diff => (
            <button
              key={diff.value}
              type="button"
              onClick={() => setFormData({ ...formData, difficulty: diff.value as Difficulty })}
              className={`flex-1 py-4 px-4 rounded-xl font-semibold transition-all ${
                formData.difficulty === diff.value
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-700'
              }`}
            >
              {diff.label}
            </button>
          ))}
        </div>
      </div>

      {/* Question Types */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span className="text-lg">❓</span> Question Types
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {QUESTION_TYPES.map(type => (
            <button
              key={type.value}
              type="button"
              onClick={() => toggleQuestionType(type.value as QuestionType)}
              className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                formData.question_types.includes(type.value as QuestionType)
                  ? 'bg-teal-100 text-teal-700 border-2 border-teal-400 shadow-sm'
                  : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200'
              }`}
            >
              <span className="text-lg">{type.emoji}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Number of Questions */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span className="text-lg">🔢</span> Number of Questions
          <span className="ml-auto bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-bold">
            {formData.question_count}
          </span>
        </label>
        <input
          type="range"
          min="5"
          max="30"
          value={formData.question_count}
          onChange={(e) => setFormData({ ...formData, question_count: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
          <span>5 (Quick)</span>
          <span>15 (Standard)</span>
          <span>30 (Comprehensive)</span>
        </div>
      </div>

      {/* Worksheet Language */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span className="text-lg">🌐</span> Worksheet Language
        </label>
        <select
          value={formData.language}
          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
          className="select-field"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.value} value={lang.value}>
              {lang.flag} {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Additional Instructions */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
          <span className="text-lg">✨</span> Special Instructions for AI
          <span className="text-xs font-normal text-gray-500 ml-2">(optional)</span>
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Guide the AI on what to focus on, specific concepts, or teaching style preferences.
        </p>
        <textarea
          value={formData.additional_instructions}
          onChange={(e) => setFormData({ ...formData, additional_instructions: e.target.value })}
          placeholder="Examples:&#10;• Focus on real-world applications&#10;• Include word problems about shopping&#10;• Make questions progressively harder&#10;• Use simple vocabulary for ESL students"
          className="input-field min-h-[120px] resize-none"
        />
      </div>

      {/* Advanced Options Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-teal-600 transition-colors"
      >
        {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        Advanced Options
      </button>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="space-y-4 p-5 bg-gray-50 rounded-2xl animate-fade-in border border-gray-100">
          {/* Include Answer Key */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.include_answer_key}
              onChange={(e) => setFormData({ ...formData, include_answer_key: e.target.checked })}
              className="checkbox-custom"
            />
            <span className="text-gray-700 font-medium group-hover:text-teal-700 transition-colors">
              Include answer key with explanations
            </span>
          </label>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isGenerating || !formData.topic.trim()}
        className={`w-full py-5 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group rounded-xl font-bold text-white shadow-lg transition-all ${
          focusMode
            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-orange-200'
            : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-teal-200'
        }`}
      >
        {isGenerating ? (
          <>
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            <span>Generating your worksheet...</span>
          </>
        ) : focusMode ? (
          <>
            <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>Generate Practice Worksheet</span>
            <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-sm">
              {getWorksheetCreditCost(formData.question_count, formData.grade_level)} credit{getWorksheetCreditCost(formData.question_count, formData.grade_level) > 1 ? 's' : ''}
            </span>
          </>
        ) : (
          <>
            <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>Generate Worksheet</span>
            <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-sm">
              {getWorksheetCreditCost(formData.question_count, formData.grade_level)} credit{getWorksheetCreditCost(formData.question_count, formData.grade_level) > 1 ? 's' : ''}
            </span>
          </>
        )}
      </button>
    </form>
  );
}
