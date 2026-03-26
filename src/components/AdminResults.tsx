import React, { useState, useEffect } from "react"
import { TestResult, UserInfo } from "../types/test"
import { questions } from "../data/questions"
import { Lock, Users, Eye, X, Download, CheckCircle, XCircle, FileSpreadsheet, Trash2, FileText } from "lucide-react"

interface SavedResult {
  result: TestResult
  userInfo: UserInfo
  userAnswers: number[]
  createdAt: string
}

export const AdminResults: React.FC = () => {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [results, setResults] = useState<SavedResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedResult, setSelectedResult] = useState<SavedResult | null>(null)

  const SESSION_KEY = "admin_session"
  const SESSION_DURATION = 5 * 60 * 60 * 1000 // 5 horas em ms

  useEffect(() => {
    const checkSession = async () => {
      const savedSession = localStorage.getItem(SESSION_KEY)
      if (savedSession) {
        try {
          const { pwd, expiresAt } = JSON.parse(savedSession)
          if (Date.now() < expiresAt) {
            setPassword(pwd)
            await performLogin(pwd)
          } else {
            localStorage.removeItem(SESSION_KEY)
          }
        } catch (e) {
          localStorage.removeItem(SESSION_KEY)
        }
      }
    }
    checkSession()
  }, [])

  const performLogin = async (pwd: string) => {
    setIsLoading(true)
    setError("")
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001"
      const response = await fetch(`${baseUrl}/api/results?password=${encodeURIComponent(pwd)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.reverse())
        setIsAuthenticated(true)
        
        // Salvar sessão
        localStorage.setItem(SESSION_KEY, JSON.stringify({
          pwd,
          expiresAt: Date.now() + SESSION_DURATION
        }))
      } else {
        const data = await response.json()
        setError(data.error || "Erro ao autenticar")
        localStorage.removeItem(SESSION_KEY)
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    performLogin(password)
  }

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY)
    setIsAuthenticated(false)
    setResults([])
    setPassword("")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR")
  }

  const exportToCSV = () => {
    if (results.length === 0) return

    // Cabeçalhos
    const headers = [
      "Data", "Nome", "Email", "WhatsApp", "Nota", "Nível", 
      "Educação", "Profissão", "Cidade", "Estado", "Como conheceu",
      "Já estudou?", "Anos de Estudo"
    ]

    // Dados
    const rows = results.map(item => [
      new Date(item.createdAt).toLocaleDateString("pt-BR"),
      item.userInfo.name,
      item.userInfo.email,
      item.userInfo.phone,
      `${item.result.score}/100`,
      item.result.level,
      item.userInfo.education,
      item.userInfo.profession || "-",
      item.userInfo.city,
      item.userInfo.state,
      item.userInfo.followsInstagram,
      item.userInfo.hasStudiedEnglish ? "Sim" : "Não",
      item.userInfo.studyYears || "-"
    ])

    // Combinar tudo
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    // Criar download
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `resultados_testes_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = async (createdAt: string) => {
    if (!window.confirm("Certeza que deseja excluir este teste? Esta ação não pode ser desfeita.")) {
      return
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001"
      const response = await fetch(`${baseUrl}/api/results/${createdAt}?password=${encodeURIComponent(password)}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setResults(prev => prev.filter(r => r.createdAt !== createdAt))
        if (selectedResult?.createdAt === createdAt) {
          setSelectedResult(null)
        }
        alert("Resultado excluído com sucesso!")
      } else {
        const data = await response.json()
        alert(data.error || "Erro ao excluir")
      }
    } catch (err) {
      alert("Erro ao conectar ao servidor")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <img src="/logo-preta.png" alt="MoreEnglish Logo" className="h-12 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-stone-800">Painel de Resultados</h1>
            <p className="text-stone-600">Acesso restrito ao professor</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Senha de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder="Digite a senha..."
                  required
                />
              </div>
            </div>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-stone-800 text-white font-bold py-3 rounded-lg hover:bg-stone-900 transition-colors disabled:bg-stone-400"
            >
              {isLoading ? "Autenticando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8 print:p-0 print:bg-white">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          body { 
            background: white !important; 
            margin: 0 !important; 
            padding: 0 !important;
          }
          .modal-print-container { 
            position: static !important;
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
          }
          #printable-report { 
            display: block !important; 
            width: 100% !important; 
            max-width: none !important; 
            max-height: none !important; 
            height: auto !important;
            overflow: visible !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /* Resetar flex para o conteúdo do relatório no print para evitar truncamento */
          #printable-report .flex-col { 
            display: block !important; 
          }
          /* Mas manter grades específicas que cabem em uma página */
          .print-grid-2 { 
            display: grid !important; 
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
          }
          .print-grid-4 { 
            display: grid !important; 
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 1rem !important;
          }
          /* Mas manter a logo e cabeçalho alinhados */
          .print-header { 
            display: flex !important; 
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
          }
          .page-break-before { page-break-before: always; }
          .page-break-inside-avoid { page-break-inside: avoid; }
          @page { 
            margin: 1.5cm; 
            size: auto;
          }
          #printable-report { 
            padding: 0 !important; 
            margin: 0 !important;
          }
          /* Forçar cores no print */
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}} />

      <div className="max-w-7xl mx-auto no-print">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-4">
              <img src="/logo-preta.png" alt="MoreEnglish Logo" className="h-8 md:h-10" />
              <div className="h-8 w-px bg-stone-300 hidden md:block" />
              <h1 className="text-xl md:text-2xl font-bold text-stone-800">Resultados</h1>
            </div>
            <button 
              onClick={handleLogout}
              className="text-stone-500 hover:text-stone-800 md:hidden"
            >
              Sair
            </button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 w-full md:w-auto">
            <div className="bg-white px-4 py-2 rounded-lg border border-stone-200 shadow-sm flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              <span className="font-semibold">{results.length}</span>
              <span className="text-stone-600 text-sm hidden sm:inline">Testes realizados</span>
            </div>
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Exportar CSV
            </button>
            <button 
              onClick={handleLogout}
              className="text-stone-600 hover:text-stone-800 font-medium hidden md:block"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="px-6 py-4 text-sm font-semibold text-stone-600">Data</th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-600">Nome</th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-600">WhatsApp</th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-600">Nota</th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-600">Nível</th>
                  <th className="px-6 py-4 text-sm font-semibold text-stone-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {results.map((item, index) => (
                  <tr key={index} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-stone-600 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-stone-900">{item.userInfo.name}</div>
                      <div className="text-xs text-stone-500">{item.userInfo.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600">
                      {item.userInfo.phone}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${item.result.score >= 70 ? "text-green-600" : "text-amber-600"}`}>
                        {item.result.score}/100
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded uppercase">
                        {item.result.level}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedResult(item)}
                          className="p-2 text-stone-400 hover:text-stone-800 transition-colors"
                          title="Ver Detalhes"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.createdAt)}
                          className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-stone-500">Nenhum resultado encontrado.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4 print:p-0 modal-print-container">
          <div id="printable-report" className="bg-white w-full max-w-5xl h-full md:h-auto md:max-h-[95vh] rounded-none md:rounded-2xl shadow-2xl overflow-hidden flex flex-col print:h-auto print:max-h-none print:shadow-none print:rounded-none print:w-full">
            <div className="p-4 md:p-6 border-b border-stone-200 flex justify-between items-center bg-stone-50 sticky top-0 z-10 no-print">
              <div className="flex flex-col">
                <h2 className="text-lg md:text-xl font-bold text-stone-800 leading-tight">Relatório de {selectedResult.userInfo.name.split(' ')[0]}</h2>
                <span className="text-xs text-stone-500 md:hidden">{formatDate(selectedResult.createdAt)}</span>
              </div>
              <button 
                onClick={() => setSelectedResult(null)}
                className="p-2 hover:bg-stone-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-stone-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-8 print:overflow-visible print:p-0 print:block">
              {/* Logo de Topo para Print */}
              <div className="hidden print:flex items-center justify-between border-b-2 border-stone-800 pb-4 mb-8 print-header">
                <img src="/logo-preta.png" alt="MoreEnglish Logo" className="h-10" />
                <div className="text-right">
                  <h1 className="text-xl font-black text-stone-800 uppercase tracking-tighter">Relatório do Aluno</h1>
                  <p className="text-sm text-stone-600 font-bold">{formatDate(selectedResult.createdAt)}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8 print:gap-12 print-grid-2">
                <div>
                  <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">Informações Pessoais</h3>
                  <div className="space-y-3">
                    <InfoRow label="Email" value={selectedResult.userInfo.email} />
                    <InfoRow label="Telefone" value={selectedResult.userInfo.phone} />
                    <InfoRow label="Nascimento" value={selectedResult.userInfo.birthDate} />
                    <InfoRow label="Local" value={`${selectedResult.userInfo.city}, ${selectedResult.userInfo.state} - ${selectedResult.userInfo.country}`} />
                    <InfoRow label="Nível Educacional" value={selectedResult.userInfo.education} />
                    <InfoRow label="Profissão" value={selectedResult.userInfo.profession} />
                    <InfoRow label="Estudou Inglês antes?" value={selectedResult.userInfo.hasStudiedEnglish ? "Sim" : "Não"} />
                    {selectedResult.userInfo.hasStudiedEnglish && (
                      <>
                        <InfoRow label="Onde Estudou" value={selectedResult.userInfo.whereStudied || "-"} />
                        <InfoRow label="Anos de Estudo" value={selectedResult.userInfo.studyYears?.toString() || "-"} />
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">Auto-Avaliação e Preferências</h3>
                  <div className="space-y-3">
                    <InfoRow label="Importância do Inglês" value={selectedResult.userInfo.englishImportance} />
                    <InfoRow label="Conversação" value={`${selectedResult.userInfo.conversationLevel}/5`} />
                    <InfoRow label="Escrita" value={`${selectedResult.userInfo.writingLevel}/5`} />
                    <InfoRow label="Leitura" value={`${selectedResult.userInfo.readingLevel}/5`} />
                    <InfoRow label="Audição" value={`${selectedResult.userInfo.listeningLevel}/5`} />
                    <InfoRow label="Gramática" value={`${selectedResult.userInfo.grammarLevel}/5`} />
                    <InfoRow label="Tipo de Estudo" value={selectedResult.userInfo.preferredStudyType} />
                    <InfoRow label="Aulas/Semana" value={selectedResult.userInfo.classesPerWeek} />
                    <InfoRow label="Horário" value={selectedResult.userInfo.preferredSchedule} />
                  </div>
                </div>
              </div>

              <div className="border-t border-stone-100 pt-8 mb-8">
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">Resultado do Teste</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 print-grid-4">
                  <ResultCard label="Pontuação" value={`${selectedResult.result.score}/100`} />
                  <ResultCard label="Corretas" value={`${selectedResult.result.correctAnswers}/${selectedResult.result.totalQuestions}`} />
                  <ResultCard label="Nível" value={selectedResult.result.level} />
                  <ResultCard label="Data" value={new Date(selectedResult.createdAt).toLocaleDateString("pt-BR")} />
                </div>

                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">Detalhamento das Questões</h3>
                <div className="space-y-4">
                  {questions.map((q, idx) => {
                    const userAnswerIdx = selectedResult.userAnswers[idx]
                    const isCorrect = userAnswerIdx === q.correct
                    const userAnswerText = userAnswerIdx !== undefined ? q.options[userAnswerIdx] : "Não respondida"
                    const correctAnswerText = q.options[q.correct]

                    return (
                      <div key={q.id} className={`p-4 rounded-lg border page-break-inside-avoid ${isCorrect ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}>
                        <div className="flex items-start gap-3">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-bold text-stone-800 mb-2">
                              {idx + 1}. {q.question}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-stone-500 mr-2">Resposta do aluno:</span>
                                <span className={isCorrect ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                                  {userAnswerText}
                                </span>
                              </div>
                              {!isCorrect && (
                                <div>
                                  <span className="text-stone-500 mr-2">Resposta correta:</span>
                                  <span className="text-green-700 font-medium">{correctAnswerText}</span>
                                </div>
                              )}
                            </div>
                            {q.explanation && !isCorrect && (
                              <p className="mt-2 text-xs text-stone-600 italic">
                                💡 {q.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            
            <div className="p-4 md:p-6 border-t border-stone-200 bg-stone-50 flex flex-wrap gap-4">
              <button 
                onClick={() => handleDelete(selectedResult.createdAt)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Excluir Teste
              </button>
              <div className="flex-1" />
              <button 
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-800 text-white font-bold rounded-lg hover:bg-black transition-colors text-sm"
              >
                <FileText className="w-4 h-4" />
                Salvar em PDF
              </button>
              <button 
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-200 text-stone-700 font-bold rounded-lg hover:bg-stone-300 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Imprimir
              </button>
              <button 
                onClick={() => setSelectedResult(null)}
                className="px-8 py-3 bg-stone-100 text-stone-600 font-bold rounded-lg hover:bg-stone-200 transition-colors text-sm"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-stone-100 pb-2 print:flex-row print:justify-between print:border-stone-200">
    <span className="text-xs font-medium text-stone-500 print:text-stone-600">{label}</span>
    <span className="text-sm font-semibold text-stone-800">{value}</span>
  </div>
)

const ResultCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-center print:bg-white print:border-stone-300">
    <p className="text-xs text-stone-500 mb-1">{label}</p>
    <p className="text-lg font-bold text-stone-800">{value}</p>
  </div>
)
