import { useState, useCallback } from 'react';
import { Question, TestResult, UserInfo } from '../types/test';

export const useTest = (questions: Question[]) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showMarketingPause, setShowMarketingPause] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex];

  const answerQuestion = useCallback((answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  }, [currentQuestionIndex, answers]);

  const nextQuestion = useCallback(() => {
    // Show marketing pause at question 25 (middle of the test)
    if (currentQuestionIndex === 24 && !showMarketingPause) {
      setShowMarketingPause(true);
      return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsComplete(true);
    }
  }, [currentQuestionIndex, questions.length, showMarketingPause]);

  const continueAfterPause = useCallback(() => {
    setShowMarketingPause(false);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }, [currentQuestionIndex]);
  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const calculateResults = useCallback((): TestResult => {
    const correctAnswers = questions.reduce((count, question, index) => {
      return count + (answers[index] === question.correct ? 1 : 0);
    }, 0);

    const score = correctAnswers * 2; // 2 points per question, max 100 points
    
    // Calculate section scores
    const sectionScores = {
      grammar: 0,
      vocabulary: 0,
      reading: 0
    };

    Object.keys(sectionScores).forEach(section => {
      const sectionQuestions = questions.filter(q => q.section === section);
      const sectionCorrect = sectionQuestions.reduce((count, question) => {
        const questionIndex = questions.findIndex(q => q.id === question.id);
        return count + (answers[questionIndex] === question.correct ? 1 : 0);
      }, 0);
      
      sectionScores[section as keyof typeof sectionScores] = 
        Math.round((sectionCorrect / sectionQuestions.length) * 100);
    });

    // Determine level
    let level = 'Beginner';
    if (score >= 80) level = 'A2';
    else if (score >= 60) level = 'A1';
    else level = 'Pre-A1';

    // Generate recommendations
    const recommendations = generateRecommendations(score, sectionScores);

    return {
      totalQuestions: questions.length,
      correctAnswers,
      score,
      level,
      sectionScores,
      recommendations,
      completedAt: new Date()
    };
  }, [questions, answers]);

  const generateRecommendations = (score: number, sectionScores: any): string[] => {
    const recommendations: string[] = [];
    
    if (score >= 80) {
      recommendations.push('Excelente trabalho! Você tem uma base sólida em inglês.');
      recommendations.push('Continue praticando com textos mais complexos para avançar para o nível B1.');
      recommendations.push('O Word Marathon pode ajudar você a expandir seu vocabulário para o próximo nível.');
    } else if (score >= 60) {
      recommendations.push('Bom trabalho! Você tem conhecimentos básicos sólidos.');
      recommendations.push('Foque em expandir seu vocabulário e praticar conversação.');
      recommendations.push('O Word Marathon é perfeito para acelerar seu aprendizado de vocabulário.');
    } else if (score >= 40) {
      recommendations.push('Você está no caminho certo! Continue estudando os fundamentos.');
      recommendations.push('Pratique gramática básica e vocabulário essencial diariamente.');
      recommendations.push('Uma imersão como o Word Marathon pode acelerar significativamente seu progresso.');
    } else {
      recommendations.push('Não se preocupe! Todo mundo começa em algum lugar.');
      recommendations.push('Comece com o alfabeto, números e palavras básicas do dia a dia.');
      recommendations.push('O Word Marathon oferece uma base sólida de vocabulário para iniciantes.');
    }

    // Section-specific recommendations
    if (sectionScores.grammar < 60) {
      recommendations.push('Foque nos tempos verbais básicos: presente simples e contínuo.');
    }
    if (sectionScores.vocabulary < 60) {
      recommendations.push('Aprenda 10 palavras novas por dia e pratique com flashcards.');
      recommendations.push('O Word Marathon ensina vocabulário de forma sistemática e eficiente.');
    }
    if (sectionScores.reading < 60) {
      recommendations.push('Leia textos simples em inglês diariamente, como notícias básicas.');
    }

    // Add personalized recommendations based on user info
    if (userInfo) {
      if (userInfo.preferredStudyType === 'individual') {
        recommendations.push('Considerando sua preferência por aulas individuais, recomendamos um plano personalizado.');
      }
      if (userInfo.preferredStudyType === 'grupo') {
        recommendations.push('Aulas em grupo podem ajudar você a praticar conversação com outros alunos.');
      }
      if (!userInfo.hasStudiedEnglish) {
        recommendations.push('Como é seu primeiro contato formal com inglês, comece com o básico e seja paciente.');
        recommendations.push('O Word Marathon é ideal para quem está começando do zero.');
      }
    }
    return recommendations;
  };

  const startTest = useCallback((info: UserInfo) => {
    setUserInfo(info);
  }, []);

  const resetTest = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setUserInfo(null);
    setIsComplete(false);
    setShowMarketingPause(false);
  }, []);

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
    resetTest
  };
};