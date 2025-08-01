import { useState, useCallback } from "react"
import { Question, TestResult, UserInfo } from "../types/test"

export const useTest = (questions: Question[]) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [showMarketingPause, setShowMarketingPause] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const selectedAnswer = answers[currentQuestionIndex]

  const answerQuestion = useCallback(
    (answerIndex: number) => {
      const newAnswers = [...answers]
      newAnswers[currentQuestionIndex] = answerIndex
      setAnswers(newAnswers)
    },
    [currentQuestionIndex, answers]
  )

  const nextQuestion = useCallback(() => {
    // Show marketing pause at question 25 (middle of the test)
    if (currentQuestionIndex === 24 && !showMarketingPause) {
      setShowMarketingPause(true)
      return
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setIsComplete(true)
    }
  }, [currentQuestionIndex, questions.length, showMarketingPause])

  const continueAfterPause = useCallback(() => {
    setShowMarketingPause(false)
    setCurrentQuestionIndex(currentQuestionIndex + 1)
  }, [currentQuestionIndex])

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }, [currentQuestionIndex])

  const fillAllRandomly = useCallback(() => {
    const newAnswers = [...answers]
    for (let i = currentQuestionIndex; i < questions.length; i++) {
      if (newAnswers[i] === undefined) {
        // Only fill if not already answered
        const randomAnswer = Math.floor(Math.random() * questions[i].options.length)
        newAnswers[i] = randomAnswer
      }
    }
    setAnswers(newAnswers)
    setIsComplete(true) // Mark test as complete after filling all
  }, [currentQuestionIndex, questions, answers])

  const calculateResults = useCallback((): TestResult => {
    const correctAnswers = questions.reduce((count, question, index) => {
      return count + (answers[index] === question.correct ? 1 : 0)
    }, 0)

    const score = correctAnswers * 2 // 2 points per question, max 100 points

    // Calculate section scores
    const sectionScores = {
      grammar: 0,
      vocabulary: 0,
      reading: 0,
    }

    Object.keys(sectionScores).forEach((section) => {
      const sectionQuestions = questions.filter((q) => q.section === section)
      const sectionCorrect = sectionQuestions.reduce((count, question) => {
        const questionIndex = questions.findIndex((q) => q.id === question.id)
        return count + (answers[questionIndex] === question.correct ? 1 : 0)
      }, 0)

      sectionScores[section as keyof typeof sectionScores] = Math.round(
        (sectionCorrect / sectionQuestions.length) * 100
      )
    })

    // Determine level based on score percentage
    let level = "A1" // Default to A1 if score is 0-10%
    if (score > 90) level = "C2"
    else if (score > 70) level = "C1"
    else if (score > 50) level = "B2"
    else if (score > 35) level = "B1"
    else if (score > 10) level = "A2"
    else level = "A1"

    // Generate recommendations
    const recommendations = generateRecommendations(score, sectionScores)

    return {
      totalQuestions: questions.length,
      correctAnswers,
      score,
      level,
      sectionScores,
      recommendations,
      completedAt: new Date(),
    }
  }, [questions, answers])

  const generateRecommendations = (score: number, sectionScores: any): string[] => {
    const recommendations: string[] = []

    if (score > 90) {
      recommendations.push("Excelente trabalho! vc é fluente em ingles.")
      recommendations.push(
        "Para assegurar isso oferecemos uma avaliação de conversação gratuita. Entre em contato e agende a sua avaliação. +55 11 99672-7007."
      )
    } else if (score > 70) {
      recommendations.push("Seu nível de inglês é avançado (C1). Você se comunica com fluência e eficácia.")
      recommendations.push(
        "Foque em nuances da língua e vocabulário específico para contextos acadêmicos ou profissionais."
      )
    } else if (score > 50) {
      recommendations.push(
        "Seu nível de inglês é intermediário superior (B2). Você já consegue se comunicar com fluência e espontaneidade."
      )
      recommendations.push(
        "Pratique a conversação em situações diversas e aprofunde seus conhecimentos em áreas específicas."
      )
    } else if (score > 35) {
      recommendations.push("Seu nível de inglês é intermediário (B1). Você tem um bom domínio do inglês básico.")
      recommendations.push("Foque em expandir seu vocabulário e praticar conversação para avançar.")
      recommendations.push("O Word Marathon é perfeito para acelerar seu aprendizado de vocabulário.")
    } else if (score > 10) {
      recommendations.push("Seu nível de inglês é elementar (A2). Você consegue se comunicar em situações simples.")
      recommendations.push(
        "Continue estudando os fundamentos e pratique gramática básica e vocabulário essencial diariamente."
      )
      recommendations.push("Uma imersão como o Word Marathon pode acelerar significativamente seu progresso.")
    } else {
      recommendations.push("Seu nível de inglês é iniciante (A1). Não se preocupe! Todo mundo começa em algum lugar.")
      recommendations.push("Comece com o alfabeto, números e palavras básicas do dia a dia.")
      recommendations.push("O Word Marathon oferece uma base sólida de vocabulário para iniciantes.")
    }

    // Add personalized recommendations based on user info
    if (userInfo) {
      if (userInfo.preferredStudyType === "individual") {
        recommendations.push("Considerando sua preferência por aulas individuais, recomendamos um plano personalizado.")
      }
      if (userInfo.preferredStudyType === "grupo") {
        recommendations.push("Aulas em grupo podem ajudar você a praticar conversação com outros alunos.")
      }
      if (!userInfo.hasStudiedEnglish) {
        recommendations.push("Como é seu primeiro contato formal com inglês, comece com o básico e seja paciente.")
        recommendations.push("O Word Marathon é ideal para quem está começando do zero.")
      }
    }
    return recommendations
  }

  const startTest = useCallback((info: UserInfo) => {
    setUserInfo(info)
  }, [])

  const resetTest = useCallback(() => {
    setCurrentQuestionIndex(0)
    setAnswers([])
    setUserInfo(null)
    setIsComplete(false)
    setShowMarketingPause(false)
  }, [])

  return {
    currentQuestion,
    currentQuestionIndex,
    selectedAnswer,
    isComplete,
    userInfo,
    showMarketingPause,
    canGoNext: currentQuestionIndex < questions.length - 1 || selectedAnswer !== undefined,
    canGoPrevious: currentQuestionIndex > 0,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    continueAfterPause,
    calculateResults,
    startTest,
    resetTest,
    fillAllRandomly, // Expose the new function
    answers, // Expose answers from the hook
  }
}
