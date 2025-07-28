import React, { useState } from 'react';
import { BookOpen, Users, Clock, Mail, ChevronRight, ChevronLeft, User, Phone, MapPin, GraduationCap, Briefcase, MessageCircle, Calendar, Star } from 'lucide-react';
import { UserInfo } from '../types/test';

interface WelcomeScreenProps {
  onStart: (userInfo: UserInfo) => void;
}

const brazilianStates = [
  'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
  'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
  'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
  'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
  'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
];

const countries = [
  'Brasil', 'Argentina', 'Chile', 'Colômbia', 'Peru', 'Uruguai', 'Paraguai',
  'Bolívia', 'Venezuela', 'Equador', 'Estados Unidos', 'Canadá', 'México',
  'Portugal', 'Espanha', 'França', 'Alemanha', 'Itália', 'Reino Unido', 'Outro'
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    city: '',
    state: '',
    country: 'Brasil',
    followsInstagram: '',
    education: '',
    profession: '',
    company: '',
    jobFunction: '',
    hasStudiedEnglish: false,
    whereStudied: '',
    studyYears: 1,
    englishImportance: '',
    conversationLevel: 1,
    writingLevel: 1,
    readingLevel: 1,
    listeningLevel: 1,
    grammarLevel: 1,
    preferredStudyType: '',
    classesPerWeek: '',
    preferredSchedule: ''
  });

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(userInfo);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return userInfo.name && userInfo.email && userInfo.phone && userInfo.birthDate;
      case 1:
        return userInfo.city && userInfo.state && userInfo.country;
      case 2:
        return userInfo.followsInstagram && userInfo.education;
      case 3:
        return userInfo.profession && userInfo.company && userInfo.jobFunction;
      case 4:
        return userInfo.englishImportance;
      case 5:
        return userInfo.preferredStudyType && userInfo.classesPerWeek && userInfo.preferredSchedule;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-stone-800">Informações Pessoais</h2>
              <p className="text-stone-600">Vamos começar com seus dados básicos</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Nome completo *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="Seu nome completo"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="seu@email.com"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Telefone de contato *
              </label>
              <input
                type="tel"
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="(11) 99999-9999"
                value={userInfo.phone}
                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Data de nascimento *
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                value={userInfo.birthDate}
                onChange={(e) => setUserInfo({ ...userInfo, birthDate: e.target.value })}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-stone-800">Localização</h2>
              <p className="text-stone-600">Onde você está localizado?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Cidade *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="Sua cidade"
                value={userInfo.city}
                onChange={(e) => setUserInfo({ ...userInfo, city: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Estado *
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                value={userInfo.state}
                onChange={(e) => setUserInfo({ ...userInfo, state: e.target.value })}
              >
                <option value="">Selecione seu estado</option>
                {brazilianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                País *
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                value={userInfo.country}
                onChange={(e) => setUserInfo({ ...userInfo, country: e.target.value })}
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MessageCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-stone-800">Redes Sociais e Educação</h2>
              <p className="text-stone-600">Queremos conhecer você melhor</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Já segue o perfil @moreenglishbr no Instagram? *
              </label>
              <div className="space-y-2">
                {[
                  { value: 'sim', label: 'Sim' },
                  { value: 'vou-seguir', label: 'Vou seguir' },
                  { value: 'nao', label: 'Não' },
                  { value: 'nao-uso', label: 'Não uso Instagram' }
                ].map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="instagram"
                      value={option.value}
                      checked={userInfo.followsInstagram === option.value}
                      onChange={(e) => setUserInfo({ ...userInfo, followsInstagram: e.target.value })}
                      className="mr-3 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-stone-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Minha escolaridade *
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                value={userInfo.education}
                onChange={(e) => setUserInfo({ ...userInfo, education: e.target.value })}
              >
                <option value="">Selecione sua escolaridade</option>
                <option value="fundamental">Fundamental completo</option>
                <option value="medio">Ensino médio completo</option>
                <option value="superior">Ensino superior completo</option>
                <option value="mestrado">Mestrado completo</option>
                <option value="doutorado">Doutorado completo</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Briefcase className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-stone-800">Informações Profissionais</h2>
              <p className="text-stone-600">Conte-nos sobre sua carreira</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Profissão *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="Sua profissão"
                value={userInfo.profession}
                onChange={(e) => setUserInfo({ ...userInfo, profession: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Empresa/Instituição *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="Nome da empresa ou instituição"
                value={userInfo.company}
                onChange={(e) => setUserInfo({ ...userInfo, company: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Função *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="Sua função atual"
                value={userInfo.jobFunction}
                onChange={(e) => setUserInfo({ ...userInfo, jobFunction: e.target.value })}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <BookOpen className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-stone-800">Experiência com Inglês</h2>
              <p className="text-stone-600">Vamos entender seu histórico</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Você já estudou inglês antes? *
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasStudied"
                    value="true"
                    checked={userInfo.hasStudiedEnglish === true}
                    onChange={() => setUserInfo({ ...userInfo, hasStudiedEnglish: true })}
                    className="mr-3 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-stone-700">Sim</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasStudied"
                    value="false"
                    checked={userInfo.hasStudiedEnglish === false}
                    onChange={() => setUserInfo({ ...userInfo, hasStudiedEnglish: false })}
                    className="mr-3 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-stone-700">Não</span>
                </label>
              </div>
            </div>

            {userInfo.hasStudiedEnglish && (
              <>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Onde?
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="Conte onde você estudou inglês..."
                    rows={3}
                    value={userInfo.whereStudied}
                    onChange={(e) => setUserInfo({ ...userInfo, whereStudied: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Quanto tempo (em anos)?
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    value={userInfo.studyYears}
                    onChange={(e) => setUserInfo({ ...userInfo, studyYears: parseInt(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5].map(year => (
                      <option key={year} value={year}>{year} ano{year > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                No que hoje o inglês pode agregar na sua vida pessoal ou profissional? *
              </label>
              <textarea
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                placeholder="Descreva como o inglês pode ajudar você..."
                rows={4}
                value={userInfo.englishImportance}
                onChange={(e) => setUserInfo({ ...userInfo, englishImportance: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-stone-800">Autoavaliação (1 = ruim, 5 = excelente)</h3>
              
              {[
                { key: 'conversationLevel', label: 'Como é sua conversação em inglês?' },
                { key: 'writingLevel', label: 'Como é sua escrita em inglês?' },
                { key: 'readingLevel', label: 'Como é sua leitura em inglês?' },
                { key: 'listeningLevel', label: 'Como é seu entendimento em inglês?' },
                { key: 'grammarLevel', label: 'Como é sua gramática em inglês?' }
              ].map(item => (
                <div key={item.key}>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    {item.label}
                  </label>
                  <div className="flex space-x-4">
                    {[1, 2, 3, 4, 5].map(level => (
                      <label key={level} className="flex items-center">
                        <input
                          type="radio"
                          name={item.key}
                          value={level}
                          checked={userInfo[item.key as keyof UserInfo] === level}
                          onChange={() => setUserInfo({ ...userInfo, [item.key]: level })}
                          className="mr-2 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-stone-700">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Calendar className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-stone-800">Preferências de Estudo</h2>
              <p className="text-stone-600">Como você gostaria de estudar?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Você prefere estudar em grupo ou em aulas individuais? *
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="studyType"
                    value="grupo"
                    checked={userInfo.preferredStudyType === 'grupo'}
                    onChange={(e) => setUserInfo({ ...userInfo, preferredStudyType: e.target.value })}
                    className="mr-3 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-stone-700">Em grupo</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="studyType"
                    value="individual"
                    checked={userInfo.preferredStudyType === 'individual'}
                    onChange={(e) => setUserInfo({ ...userInfo, preferredStudyType: e.target.value })}
                    className="mr-3 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-stone-700">Aulas individuais com professor exclusivo</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Quantas aulas na semana você gostaria de ter? *
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                value={userInfo.classesPerWeek}
                onChange={(e) => setUserInfo({ ...userInfo, classesPerWeek: e.target.value })}
              >
                <option value="">Selecione</option>
                <option value="1">1 aula por semana</option>
                <option value="2">2 aulas por semana</option>
                <option value="3">3 aulas por semana</option>
                <option value="4">4 aulas por semana</option>
                <option value="5">5 aulas por semana</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Qual o período de interesse? *
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                value={userInfo.preferredSchedule}
                onChange={(e) => setUserInfo({ ...userInfo, preferredSchedule: e.target.value })}
              >
                <option value="">Selecione o horário</option>
                <option value="7:30-9:30">Entre 7:30 e 9:30 da manhã</option>
                <option value="9:30-11:30">Entre 9:30 e 11:30</option>
                <option value="11:30-13:30">Entre 11:30 e 13:30</option>
                <option value="15:00-17:00">Entre 15:00 e 17:00</option>
                <option value="18:00-20:00">Entre 18:00 e 20:00</option>
                <option value="20:00-22:00">Entre 20:00 e 22:00</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <img 
                  src="/logo-preta.png" 
                  alt="MoreEnglish Logo" 
                  className="h-20 w-auto"
                />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">
                Teste seu Inglês Gratuitamente
              </h1>
              <p className="text-stone-600 text-lg">
                Descubra seu nível de inglês com nosso teste completo
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-100">
                <Users className="w-8 h-8 text-amber-700 mx-auto mb-2" />
                <h3 className="font-semibold text-stone-800">50 Questões</h3>
                <p className="text-sm text-stone-600">Gramática, vocabulário e leitura</p>
              </div>
              <div className="text-center p-4 bg-stone-50 rounded-xl border border-stone-100">
                <Clock className="w-8 h-8 text-stone-700 mx-auto mb-2" />
                <h3 className="font-semibold text-stone-800">40 Minutos</h3>
                <p className="text-sm text-stone-600">Tempo estimado</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-100">
                <Mail className="w-8 h-8 text-amber-700 mx-auto mb-2" />
                <h3 className="font-semibold text-stone-800">Resultado</h3>
                <p className="text-sm text-stone-600">Enviado por email</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-amber-800 mb-2">Instruções:</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Preencha todas as informações solicitadas</li>
                <li>• Leia cada questão cuidadosamente</li>
                <li>• Escolha a melhor resposta para cada pergunta</li>
                <li>• Não se preocupe se não souber todas as respostas</li>
                <li>• Seus resultados serão enviados por email</li>
              </ul>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-amber-700 hover:to-amber-800 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              Começar Cadastro
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="flex justify-center mb-6">
            <img 
              src="/logo-preta.png" 
              alt="MoreEnglish Logo" 
              className="h-12 w-auto"
            />
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-stone-500">
                Etapa {currentStep + 1} de {totalSteps}
              </span>
              <span className="text-sm text-stone-500">
                {Math.round(((currentStep + 1) / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-amber-600 to-amber-700 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {renderStep()}

            <div className="flex justify-between items-center mt-8">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentStep === 0
                    ? 'bg-stone-50 text-stone-400 cursor-not-allowed'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Anterior
              </button>

              {currentStep === totalSteps - 1 ? (
                <button
                  type="submit"
                  disabled={!isStepValid()}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    isStepValid()
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  Iniciar Teste
                  <Star className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    isStepValid()
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  Próxima
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};