import React from "react"
import { WelcomeScreen } from "./components/WelcomeScreen"
import { TestQuestion } from "./components/TestQuestion"
import { TestResults } from "./components/TestResults"
import { MarketingPause } from "./components/MarketingPause"
import { useTest } from "./hooks/useTest"
import { questions } from "./data/questions"

function App() {
  const {
    currentQuestion,
    currentQuestionIndex,
    selectedAnswer,
    isComplete,
    userInfo,
    showMarketingPause,
    canGoNext,
    canGoPrevious,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    continueAfterPause,
    calculateResults,
    startTest,
    resetTest,
    fillAllRandomly, // Destructure the new function
    answers, // Destructure answers from useTest
  } = useTest(questions)

  if (!userInfo) {
    return <WelcomeScreen onStart={startTest} />
  }

  if (showMarketingPause) {
    return <MarketingPause onContinue={continueAfterPause} />
  }
  if (isComplete) {
    const results = calculateResults()
    return (
      <TestResults
        result={results}
        userInfo={userInfo}
        onRestart={resetTest}
        questions={questions}
        userAnswers={answers}
      />
    )
  }

  return (
    <TestQuestion
      question={currentQuestion}
      currentIndex={currentQuestionIndex}
      totalQuestions={questions.length}
      onAnswer={answerQuestion}
      onNext={nextQuestion}
      onPrevious={previousQuestion}
      selectedAnswer={selectedAnswer}
      canGoNext={canGoNext}
      canGoPrevious={canGoPrevious}
      onFillAllRandomly={fillAllRandomly} // Pass the new function
    />
  )
}

export default App
