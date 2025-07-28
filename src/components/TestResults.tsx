import React, { useState } from 'react';
import { TestResult, UserInfo } from '../types/test';
import { 
  Trophy, 
  BookOpen, 
  Target, 
  Mail, 
  Download, 
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

interface TestResultsProps {
  result: TestResult;
  userInfo: UserInfo;
  onRestart: () => void;
}

export const TestResults: React.FC<TestResultsProps> = ({ 
  result, 
  userInfo, 
  onRestart 
}) => {
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async () => {
    setIsLoading(true);
    // Simulate email sending
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
    }, 2000);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A1':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'A2':
        return 'bg-stone-100 text-stone-800 border-stone-200';
      case 'B1':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelDescription = (level: string) => {
    switch (level) {
      case 'A1':
        return 'Iniciante - Você tem conhecimentos básicos de inglês';
      case 'A2':
        return 'Elementar - Você consegue se comunicar em situações simples';
      case 'B1':
        return 'Intermediário - Você tem um bom domínio do inglês básico';
      default:
        return 'Continue estudando para melhorar seu nível';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-amber-600';
    if (score >= 60) return 'text-stone-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Header with Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/logo-preta.png" 
                alt="MoreEnglish Logo" 
                className="h-16 w-auto"
              />
            </div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
              <Trophy className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">
              Parabéns, {userInfo.name}!
            </h1>
            <p className="text-stone-600 text-lg">
              Você completou o teste de nível de inglês
            </p>
          </div>

          {/* Main Results */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 mb-1">Sua pontuação</p>
                  <p className="text-4xl font-bold text-white">
                    {result.score}/100
                  </p>
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
                  <span className={`inline-block px-4 py-2 rounded-full text-xl font-bold border-2 ${getLevelColor(result.level)}`}>
                    {result.level}
                  </span>
                </div>
                <BookOpen className="w-12 h-12 text-stone-400" />
              </div>
              <p className="text-stone-600 text-sm">
                {getLevelDescription(result.level)}
              </p>
            </div>
          </div>

          {/* Section Breakdown */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-stone-800 mb-4">Desempenho por Seção</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(result.sectionScores).map(([section, score]) => (
                <div key={section} className="bg-stone-50 border border-stone-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-stone-700 capitalize">
                      {section === 'grammar' ? 'Gramática' : 
                       section === 'vocabulary' ? 'Vocabulário' : 'Leitura'}
                    </span>
                    <span className={`font-bold ${getScoreColor(score)}`}>
                      {score}%
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        score >= 80 ? 'bg-amber-500' :
                        score >= 60 ? 'bg-stone-500' :
                        score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
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
                <h3 className="text-lg font-semibold text-stone-800 mb-2">
                  Receber Resultados por Email
                </h3>
                <p className="text-stone-600 text-sm">
                  Enviaremos um relatório detalhado com suas notas, recomendações e informações de contato para: {userInfo.email}
                </p>
              </div>
              <button
                onClick={handleSendEmail}
                disabled={isLoading || emailSent}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  emailSent 
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : isLoading
                    ? 'bg-stone-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl'
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
  );
};