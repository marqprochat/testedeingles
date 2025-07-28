import React from 'react';
import { BookOpen, Target, TrendingUp, ExternalLink, Play, Star, Zap, Clock } from 'lucide-react';

interface MarketingPauseProps {
  onContinue: () => void;
}

export const MarketingPause: React.FC<MarketingPauseProps> = ({ onContinue }) => {
  const handleWordMarathonClick = () => {
    window.open('https://moreenglish.com.br/word-marathon/', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Header with Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/logo-preta.png" 
              alt="MoreEnglish Logo" 
              className="h-12 w-auto"
            />
          </div>

          {/* Progress Indicator */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Clock className="w-4 h-4 mr-2" />
              Metade do teste concluída!
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2 mb-6">
              <div className="bg-gradient-to-r from-amber-600 to-amber-700 h-2 rounded-full w-1/2" />
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              Como seria seu inglês se você fizesse uma 
              <span className="text-amber-600"> imersão completa</span>?
            </h2>
            
            <p className="text-xl text-stone-600 mb-6 leading-relaxed">
              Imagine dominar <strong>vocabulário, verbos e números</strong> que vão acelerar 
              seus conhecimentos em inglês e te levar muito mais próximo da fluência!
            </p>
          </div>

          {/* Word Marathon Highlight */}
          <div className="bg-gradient-to-r from-amber-50 to-stone-50 border-2 border-amber-200 rounded-2xl p-8 mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-600 rounded-full mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-stone-800 mb-2">
                Word Marathon
              </h3>
              <p className="text-amber-700 font-semibold text-lg">
                A imersão ideal para acelerar seu inglês
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full mb-3">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                </div>
                <h4 className="font-semibold text-stone-800 mb-2">Vocabulário Essencial</h4>
                <p className="text-sm text-stone-600">
                  Aprenda as palavras mais importantes de forma sistemática
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full mb-3">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <h4 className="font-semibold text-stone-800 mb-2">Verbos em Ação</h4>
                <p className="text-sm text-stone-600">
                  Domine os verbos mais usados no inglês do dia a dia
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-amber-100 rounded-full mb-3">
                  <Star className="w-5 h-5 text-amber-600" />
                </div>
                <h4 className="font-semibold text-stone-800 mb-2">Números & Mais</h4>
                <p className="text-sm text-stone-600">
                  Números, datas, horas e expressões fundamentais
                </p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleWordMarathonClick}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-semibold text-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <ExternalLink className="w-5 h-5 mr-3" />
                Conhecer o Word Marathon
              </button>
              <p className="text-xs text-stone-500 mt-2">
                Abre em nova aba - seu teste não será perdido
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 mb-8">
            <h4 className="font-semibold text-stone-800 mb-4 text-center">
              Por que uma imersão faz toda a diferença?
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-stone-700">Aprendizado acelerado e focado</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-stone-700">Base sólida para conversação</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-stone-700">Confiança para se expressar</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-stone-700">Resultados em menos tempo</span>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={onContinue}
              className="inline-flex items-center px-8 py-4 bg-stone-600 text-white rounded-xl font-semibold text-lg hover:bg-stone-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Play className="w-5 h-5 mr-3" />
              Continuar o Teste
            </button>
            <p className="text-sm text-stone-500 mt-3">
              Faltam apenas 25 questões para descobrir seu nível!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};