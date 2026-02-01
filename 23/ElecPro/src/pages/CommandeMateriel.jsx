import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Package, Plus, Minus, Calculator, Copy, Share2, Check, ChevronDown, ChevronUp, Wrench, CheckCircle, Circle } from 'lucide-react'
import { typesChantiers, categoriesMateriel, calculerDevis, genererTexte, getOutilsRecommandes } from '../data/commandeMateriel'

function CommandeMateriel() {
  const [typeChantier, setTypeChantier] = useState('renovation-t2')
  const [params, setParams] = useState({
    prises: 12,
    eclairages: 6,
    specialises: 4,
    longueurMoyenne: 18
  })
  const [devis, setDevis] = useState(null)
  const [expandedCat, setExpandedCat] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showOutils, setShowOutils] = useState(false)

  useEffect(() => {
    const chantier = typesChantiers.find(t => t.id === typeChantier)
    if (chantier) {
      setParams(chantier.defauts)
    }
  }, [typeChantier])

  const handleCalcul = () => {
    const result = calculerDevis(params)
    setDevis(result)
    setExpandedCat('cables')
  }

  const handleParamChange = (key, delta) => {
    setParams(prev => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta)
    }))
    setDevis(null)
  }

  const handleCopy = async () => {
    if (!devis) return
    const texte = genererTexte(params, devis)
    try {
      await navigator.clipboard.writeText(texte)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erreur copie:', err)
    }
  }

  const handleShare = async () => {
    if (!devis) return
    const texte = genererTexte(params, devis)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Liste de materiel',
          text: texte
        })
      } catch (err) {
        console.error('Erreur partage:', err)
      }
    } else {
      handleCopy()
    }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Aide a la Commande</h1>
          <p className="text-sm text-gray-500">Calculateur de materiel</p>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Package size={28} />
          </div>
          <div>
            <h2 className="font-bold text-lg">Estimez votre materiel</h2>
            <p className="text-emerald-100 text-sm mt-1">
              Generez une liste de materiel estimee selon votre chantier
            </p>
          </div>
        </div>
      </div>

      {/* Type de chantier */}
      <div className="card">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Type de chantier
        </label>
        <select
          value={typeChantier}
          onChange={(e) => setTypeChantier(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          {typesChantiers.map(type => (
            <option key={type.id} value={type.id}>{type.nom}</option>
          ))}
        </select>
      </div>

      {/* Outils recommandes */}
      <div className="card">
        <button
          onClick={() => setShowOutils(!showOutils)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Wrench size={20} className="text-emerald-600" />
            <span className="font-semibold text-gray-900">Outillage necessaire</span>
          </div>
          {showOutils ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showOutils && (
          <div className="mt-4 space-y-4">
            {getOutilsRecommandes(typeChantier).map((categorie, idx) => (
              <div key={idx}>
                <h4 className="font-medium text-gray-800 mb-2">{categorie.titre}</h4>
                <div className="space-y-1">
                  {categorie.outils.map((outil, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      {outil.obligatoire ? (
                        <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Circle size={14} className="text-gray-300 flex-shrink-0" />
                      )}
                      <span className={outil.obligatoire ? 'text-gray-800' : 'text-gray-500'}>
                        {outil.nom}
                      </span>
                      {outil.obligatoire && (
                        <span className="text-xs text-emerald-600 font-medium">requis</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-400 mt-2">
              Les outils marques "requis" sont indispensables pour ce type de chantier.
            </p>
          </div>
        )}
      </div>

      {/* Parametres */}
      <div className="card space-y-4">
        <h3 className="font-semibold text-gray-900">Quantites</h3>

        {/* Prises */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Prises de courant</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleParamChange('prises', -1)}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center font-semibold text-lg">{params.prises}</span>
            <button
              onClick={() => handleParamChange('prises', 1)}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Eclairages */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Points d'eclairage</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleParamChange('eclairages', -1)}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center font-semibold text-lg">{params.eclairages}</span>
            <button
              onClick={() => handleParamChange('eclairages', 1)}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Specialises */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Circuits specialises</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleParamChange('specialises', -1)}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center font-semibold text-lg">{params.specialises}</span>
            <button
              onClick={() => handleParamChange('specialises', 1)}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Longueur moyenne */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Longueur moyenne (m)</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleParamChange('longueurMoyenne', -2)}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center font-semibold text-lg">{params.longueurMoyenne}</span>
            <button
              onClick={() => handleParamChange('longueurMoyenne', 2)}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bouton calculer */}
      <button
        onClick={handleCalcul}
        className="w-full btn bg-emerald-600 text-white flex items-center justify-center gap-2"
      >
        <Calculator size={20} />
        Calculer le materiel
      </button>

      {/* Resultats */}
      {devis && (
        <div className="space-y-4">
          {/* Total */}
          <div className="card bg-emerald-50 border-emerald-200">
            <div className="text-center">
              <p className="text-sm text-emerald-700 mb-1">Estimation totale</p>
              <p className="text-3xl font-bold text-emerald-800">
                {devis.totalMin}€ - {devis.totalMax}€
              </p>
              <p className="text-xs text-emerald-600 mt-1">Prix indicatifs, hors pose</p>
            </div>
          </div>

          {/* Liste par categorie */}
          <div className="space-y-3">
            {categoriesMateriel.map(cat => {
              const items = devis.parCategorie[cat.id]
              if (!items || items.length === 0) return null

              const isExpanded = expandedCat === cat.id
              const catTotal = items.reduce((s, i) => s + i.prixMinTotal, 0)

              return (
                <div key={cat.id} className="card">
                  <button
                    onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cat.icon}</span>
                      <span className="font-semibold text-gray-900">{cat.nom}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">~{Math.round(catTotal)}€</span>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-2 border-t pt-3">
                      {items.map(item => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{item.nom}</span>
                          <div className="text-right">
                            <span className="font-medium">{item.quantite} {item.unite}</span>
                            <span className="text-gray-400 ml-2">
                              ({item.prixMinTotal}€ - {item.prixMaxTotal}€)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 btn bg-gray-100 text-gray-700 flex items-center justify-center gap-2"
            >
              {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
              {copied ? 'Copie !' : 'Copier'}
            </button>
            <button
              onClick={handleShare}
              className="flex-1 btn bg-emerald-600 text-white flex items-center justify-center gap-2"
            >
              <Share2 size={18} />
              Partager
            </button>
          </div>
        </div>
      )}

      {/* Avertissement */}
      <div className="card bg-amber-50 border-amber-200">
        <h3 className="font-semibold text-amber-800 mb-2">Estimation indicative</h3>
        <p className="text-sm text-amber-700">
          Ces quantites sont des estimations basees sur des moyennes.
          Adaptez selon la configuration reelle du chantier.
          Les prix sont indicatifs et varient selon les fournisseurs.
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 pb-4">
        Aide a la commande - ElecPro
      </div>
    </div>
  )
}

export default CommandeMateriel
