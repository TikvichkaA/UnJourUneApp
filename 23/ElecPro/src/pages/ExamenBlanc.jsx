import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ClipboardCheck, Clock, ChevronRight, Trophy, TrendingUp, AlertTriangle, History, Trash2 } from 'lucide-react'
import { examConfig, getExamHistory, getExamStats, clearExamHistory, categoryNames } from '../data/examen'

function ExamenBlanc() {
  const navigate = useNavigate()
  const [showHistory, setShowHistory] = useState(false)
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  const history = getExamHistory()
  const stats = getExamStats()

  const startExam = (dureeId) => {
    navigate(`/examen/session?duree=${dureeId}`)
  }

  const handleClearHistory = () => {
    clearExamHistory()
    setShowConfirmClear(false)
    window.location.reload()
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <ClipboardCheck size={28} />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Examen Blanc</h2>
            <p className="text-rose-200 text-sm mt-1">
              Simulation des conditions d'examen
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                Seuil: {examConfig.seuilReussite}%
              </span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                Chronométré
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats globales si historique existe */}
      {stats && (
        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <TrendingUp size={18} />
            Vos statistiques
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalExams}</div>
              <div className="text-xs text-blue-500">Examens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.averageScore}%</div>
              <div className="text-xs text-emerald-500">Moyenne</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{stats.passRate}%</div>
              <div className="text-xs text-amber-500">Réussite</div>
            </div>
          </div>

          {/* Points faibles */}
          {Object.entries(stats.weakCategories)
            .filter(([_, data]) => data.percentage < 60 && data.total >= 3)
            .length > 0 && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-blue-600 mb-2 flex items-center gap-1">
                <AlertTriangle size={12} />
                Points à améliorer :
              </p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(stats.weakCategories)
                  .filter(([_, data]) => data.percentage < 60 && data.total >= 3)
                  .sort((a, b) => a[1].percentage - b[1].percentage)
                  .slice(0, 3)
                  .map(([cat, data]) => (
                    <span key={cat} className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded">
                      {categoryNames[cat]} ({data.percentage}%)
                    </span>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sélection durée */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Clock size={18} />
          Choisissez une durée
        </h3>
        <div className="space-y-3">
          {examConfig.durees.map((duree) => (
            <button
              key={duree.id}
              onClick={() => startExam(duree.id)}
              className="w-full card card-hover flex items-center gap-4 text-left"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                duree.id === 'express' ? 'bg-green-500' :
                duree.id === 'court' ? 'bg-blue-500' :
                duree.id === 'moyen' ? 'bg-purple-500' : 'bg-rose-500'
              }`}>
                <span className="text-white font-bold text-sm">{duree.label}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900">{duree.description}</h4>
                <p className="text-sm text-gray-500">{duree.questions} questions</p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Historique */}
      {history.length > 0 && (
        <div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-gray-700 font-semibold mb-3"
          >
            <History size={18} />
            Historique ({history.length})
            <ChevronRight size={16} className={`transition-transform ${showHistory ? 'rotate-90' : ''}`} />
          </button>

          {showHistory && (
            <div className="space-y-2">
              {history.slice(0, 10).map((exam, index) => (
                <div
                  key={index}
                  className={`card py-3 flex items-center justify-between ${
                    exam.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      {exam.passed ? (
                        <Trophy size={16} className="text-green-600" />
                      ) : (
                        <AlertTriangle size={16} className="text-red-600" />
                      )}
                      <span className={`font-bold ${exam.passed ? 'text-green-700' : 'text-red-700'}`}>
                        {exam.percentage}%
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({exam.correct}/{exam.total})
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(exam.savedAt)} - {exam.duree?.label || 'N/A'}
                    </p>
                  </div>
                </div>
              ))}

              {/* Bouton effacer historique */}
              <button
                onClick={() => setShowConfirmClear(true)}
                className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center gap-2"
              >
                <Trash2 size={14} />
                Effacer l'historique
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confirmation effacement */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-lg mb-2">Effacer l'historique ?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Cette action est irréversible. Toutes vos statistiques seront perdues.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 btn bg-gray-100 text-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={handleClearHistory}
                className="flex-1 btn bg-red-500 text-white"
              >
                Effacer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conseils */}
      <div className="card bg-amber-50 border-amber-200">
        <h4 className="font-semibold text-amber-800 mb-2">Conseils pour l'examen</h4>
        <ul className="space-y-1 text-sm text-amber-700">
          <li>1. Lisez chaque question attentivement</li>
          <li>2. Ne restez pas bloqué, passez et revenez</li>
          <li>3. Vérifiez vos réponses si le temps le permet</li>
          <li>4. Gérez votre temps : ~1min par question</li>
        </ul>
      </div>

      {/* Répartition des questions */}
      <div className="card">
        <h4 className="font-semibold text-gray-800 mb-3">Répartition des questions</h4>
        <div className="space-y-2">
          {Object.entries(examConfig.repartition).map(([cat, percent]) => (
            <div key={cat} className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{categoryNames[cat]}</span>
                  <span className="text-gray-500">{percent}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 pb-4">
        <p>Simulation d'examen - Conditions réelles</p>
      </div>
    </div>
  )
}

export default ExamenBlanc
