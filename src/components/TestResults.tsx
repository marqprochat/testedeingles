import React, { useState } from "react"
import { TestResult, UserInfo } from "../types/test"
import { Trophy, BookOpen, Target, Mail, Download, CheckCircle, AlertCircle, TrendingUp } from "lucide-react"

import { Question } from "../types/test" // Import Question type

interface TestResultsProps {
  result: TestResult
  userInfo: UserInfo
  onRestart: () => void
  questions: Question[]
  userAnswers: number[]
}

export const TestResults: React.FC<TestResultsProps> = ({ result, userInfo, onRestart, questions, userAnswers }) => {
  const [emailSent, setEmailSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [professorEmailSent, setProfessorEmailSent] = useState(false)

  const sendEmail = async (toEmail: string, message: string) => {
    setIsLoading(true)
    try {
      const apiEndpoint = import.meta.env.VITE_EMAIL_API_ENDPOINT
      if (!apiEndpoint) {
        console.error("VITE_EMAIL_API_ENDPOINT is not defined in .env")
        alert("Erro: Endpoint de API de email não configurado.")
        setIsLoading(false)
        return
      }

      // Do not encode the message if it's plain text
      const response = await fetch(
        `${apiEndpoint}?email=${encodeURIComponent(toEmail)}&message=${encodeURIComponent(message)}`,
        {
          method: "GET",
        }
      )

      if (response.ok) {
        console.log(`Email sent successfully to ${toEmail}`)
        return true
      } else {
        console.error(`Failed to send email to ${toEmail}:`, response.status, response.statusText)
        alert(`Falha ao enviar email para ${toEmail}.`)
        return false
      }
    } catch (error) {
      console.error(`Error sending email to ${toEmail}:`, error)
      alert(`Erro ao enviar email para ${toEmail}.`)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendStudentEmail = async () => {
    const success = await sendEmail(
      userInfo.email,
      `Resultados do teste de inglês para ${userInfo.name}: Pontuação ${result.score}/100, Nível ${result.level}.`
    )
    if (success) {
      setEmailSent(true)
    }
  }

  const generateProfessorEmailContent = () => {
    let textContent = `
Resultados do Teste de Inglês

Informações do Aluno:
- Nome: ${userInfo.name}
- Email: ${userInfo.email}
- Telefone: ${userInfo.phone}
- Data de Nascimento: ${userInfo.birthDate}
- Cidade: ${userInfo.city}
- Estado: ${userInfo.state}
- País: ${userInfo.country}
- Segue no Instagram: ${userInfo.followsInstagram}
- Educação: ${userInfo.education}
- Profissão: ${userInfo.profession}
- Empresa: ${userInfo.company}
- Função: ${userInfo.jobFunction}
- Já estudou inglês: ${userInfo.hasStudiedEnglish ? "Sim" : "Não"}
${userInfo.hasStudiedEnglish && userInfo.whereStudied ? `- Onde estudou: ${userInfo.whereStudied}` : ""}
${userInfo.hasStudiedEnglish && userInfo.studyYears ? `- Anos de estudo: ${userInfo.studyYears}` : ""}
- Importância do Inglês: ${userInfo.englishImportance}
- Nível de Conversação: ${userInfo.conversationLevel}
- Nível de Escrita: ${userInfo.writingLevel}
- Nível de Leitura: ${userInfo.readingLevel}
- Nível de Audição: ${userInfo.listeningLevel}
- Nível de Gramática: ${userInfo.grammarLevel}
- Tipo de Estudo Preferido: ${userInfo.preferredStudyType}
- Aulas por Semana: ${userInfo.classesPerWeek}
- Horário Preferido: ${userInfo.preferredSchedule}

Resultados do Teste:
- Pontuação Total: ${result.score}/100
- Respostas Corretas: ${result.correctAnswers} de ${result.totalQuestions}
- Nível Estimado: ${result.level}

Desempenho por Seção:
- Gramática: ${result.sectionScores.grammar}%
- Vocabulário: ${result.sectionScores.vocabulary}%
- Leitura: ${result.sectionScores.reading}%

Detalhes das Perguntas:
`

    questions.forEach((question, index) => {
      const userAnswerIndex = userAnswers[index]
      const isCorrect = userAnswerIndex === question.correct
      const userAnswerText = userAnswerIndex !== undefined ? question.options[userAnswerIndex] : "Não respondido"
      const correctAnswerText = question.options[question.correct]
      const status = isCorrect ? "Correta" : "Incorreta"

      textContent += `
Questão ${index + 1}: ${question.question}
Sua Resposta: ${userAnswerText} (${status})
Resposta Correta: ${correctAnswerText}
`
    })

    textContent += `
Recomendações:
${result.recommendations.map((rec) => `- ${rec}`).join("\n")}
`
    return textContent
  }

  const handleSendProfessorEmail = async () => {
    const professorEmail = import.meta.env.VITE_PROFESSOR_EMAIL
    if (!professorEmail) {
      console.error("VITE_PROFESSOR_EMAIL is not defined in .env")
      alert("Erro: Email do professor não configurado.")
      return
    }
    const emailSubject = `Resultados do Teste de Inglês - ${userInfo.name}`
    const emailBodyText = generateProfessorEmailContent()

    const success = await sendEmail(professorEmail, emailBodyText)
    if (success) {
      setProfessorEmailSent(true)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "A1":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "A2":
        return "bg-stone-100 text-stone-800 border-stone-200"
      case "B1":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getLevelDescription = (level: string) => {
    switch (level) {
      case "A1":
        return "Iniciante - Você tem conhecimentos básicos de inglês"
      case "A2":
        return "Elementar - Você consegue se comunicar em situações simples"
      case "B1":
        return "Intermediário - Você tem um bom domínio do inglês básico"
      default:
        return "Continue estudando para melhorar seu nível"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-amber-600"
    if (score >= 60) return "text-stone-600"
    if (score >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Header with Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src="/logo-preta.png" alt="MoreEnglish Logo" className="h-16 w-auto" />
            </div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
              <Trophy className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">Parabéns, {userInfo.name}!</h1>
            <p className="text-stone-600 text-lg">Você completou o teste de nível de inglês</p>
          </div>

          {/* Main Results */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 mb-1">Sua pontuação</p>
                  <p className="text-4xl font-bold text-white">{result.score}/100</p>
                </div>
                <Target className="w-12 h-12 text-amber-200" />
              </div>
              <p className="text-amber-100 mt-2">
                {result.correctAnswers} de {result.totalQuestions} questões corretas
              </p>
            </div>

            <div className="bg-white border-2 border-dashed border-stone-200 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-stone-600 mb-1">Seu nível</p>
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-xl font-bold border-2 ${getLevelColor(
                      result.level
                    )}`}
                  >
                    {result.level}
                  </span>
                </div>
                <BookOpen className="w-12 h-12 text-stone-400" />
              </div>
              <p className="text-stone-600 text-sm">{getLevelDescription(result.level)}</p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-stone-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Recomendações Personalizadas
            </h3>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <ul className="space-y-3">
                {result.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-stone-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Email Section */}
          <div className="bg-gradient-to-r from-stone-50 to-amber-50 border border-stone-200 p-6 rounded-xl mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Receber Resultados por Email</h3>
                <p className="text-stone-600 text-sm">
                  Enviaremos um relatório detalhado com suas notas, recomendações e informações de contato para:{" "}
                  {userInfo.email}
                </p>
              </div>
              <button
                onClick={handleSendStudentEmail}
                disabled={isLoading || emailSent}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  emailSent
                    ? "bg-green-600 text-white cursor-not-allowed"
                    : isLoading
                    ? "bg-stone-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Enviando...
                  </>
                ) : emailSent ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Email Enviado!
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Enviar Email
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Send to Professor Section */}
          <div className="bg-gradient-to-r from-stone-50 to-amber-50 border border-stone-200 p-6 rounded-xl mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-stone-800 mb-2">Enviar Resultados para o Professor</h3>
                <p className="text-stone-600 text-sm">
                  Envie os resultados deste teste para o email do professor cadastrado.
                </p>
              </div>
              <button
                onClick={handleSendProfessorEmail}
                disabled={isLoading || professorEmailSent}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  professorEmailSent
                    ? "bg-green-600 text-white cursor-not-allowed"
                    : isLoading
                    ? "bg-stone-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Enviando...
                  </>
                ) : professorEmailSent ? (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Email Enviado!
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Enviar para Professor
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRestart}
              className="flex items-center justify-center px-8 py-3 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 transition-colors border border-stone-200"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Fazer Teste Novamente
            </button>
            <button
              className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 transition-colors shadow-lg hover:shadow-xl"
              onClick={() => window.print()}
            >
              <Download className="w-5 h-5 mr-2" />
              Baixar Certificado
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
