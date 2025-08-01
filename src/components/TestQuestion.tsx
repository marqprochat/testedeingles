import React, { useState } from "react"
import { Question } from "../types/test"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface TestQuestionProps {
  question: Question
  currentIndex: number
  totalQuestions: number
  onAnswer: (answer: number) => void
  onNext: () => void
  onPrevious: () => void
  selectedAnswer?: number
  canGoNext: boolean
  canGoPrevious: boolean
  onFillAllRandomly: () => void // Add the new prop
}

export const TestQuestion: React.FC<TestQuestionProps> = ({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
  onNext,
  onPrevious,
  selectedAnswer,
  canGoNext,
  canGoPrevious,
  onFillAllRandomly, // Destructure the new prop
}) => {
  const [isAnswering, setIsAnswering] = useState(false)

  const handleAnswer = (answerIndex: number) => {
    setIsAnswering(true)
    setTimeout(() => {
      onAnswer(answerIndex)
      setIsAnswering(false)
    }, 200)
  }

  const progress = ((currentIndex + 1) / totalQuestions) * 100

  const getSectionColor = (section: string) => {
    switch (section) {
      case "grammar":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "vocabulary":
        return "bg-stone-100 text-stone-800 border-stone-200"
      case "reading":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSectionName = (section: string) => {
    switch (section) {
      case "grammar":
        return "Gramática"
      case "vocabulary":
        return "Vocabulário"
      case "reading":
        return "Leitura"
      default:
        return section
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Header with Logo */}
          <div className="flex justify-center mb-6">
            <img src="/logo-preta.png" alt="MoreEnglish Logo" className="h-12 w-auto" />
          </div>

          {/* Progress Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getSectionColor(question.section)}`}
              >
                {getSectionName(question.section)}
              </span>
              <span className="text-sm text-stone-500">
                {currentIndex + 1} de {totalQuestions}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-amber-600 to-amber-700 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-stone-800 mb-6 leading-relaxed">
              {question.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswering}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? "border-amber-500 bg-amber-50 text-amber-800"
                      : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                  } ${isAnswering ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}`}
                >
                  <div className="flex items-center">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                        selectedAnswer === index ? "bg-amber-600 text-white" : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                canGoPrevious
                  ? "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  : "bg-stone-50 text-stone-400 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Anterior
            </button>

            {/* Botão para preencher automaticamente (apenas para testes) 
            <button
              onClick={onFillAllRandomly} // Call the new prop
              className="px-4 py-2 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Preencher Aleatório
            </button> */}

            <button
              onClick={onNext}
              disabled={!canGoNext || selectedAnswer === undefined}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                canGoNext && selectedAnswer !== undefined
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed"
              }`}
            >
              {currentIndex === totalQuestions - 1 ? "Finalizar" : "Próxima"}
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
