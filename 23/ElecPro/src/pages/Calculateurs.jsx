import { useState } from 'react'
import { Calculator, Zap, Cable, Battery, Info } from 'lucide-react'

function Calculateurs() {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900">Calculateurs</h2>
        <p className="text-sm text-gray-500">Outils de dimensionnement</p>
      </div>

      {/* Calculators */}
      <CalculateurPuissance />
      <CalculateurSection />
      <CalculateurChuteTension />

      {/* Formules */}
      <div className="card space-y-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Info size={18} />
          Formules utiles
        </h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-mono text-blue-600">P = U × I × cos(φ)</p>
            <p className="text-xs text-gray-500 mt-1">Puissance monophasée (cos φ ≈ 1 pour résistif)</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-mono text-blue-600">P = U × I × √3 × cos(φ)</p>
            <p className="text-xs text-gray-500 mt-1">Puissance triphasée (U = tension composée)</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-mono text-blue-600">ΔU = 2 × ρ × L × I / S</p>
            <p className="text-xs text-gray-500 mt-1">Chute de tension (ρ Cu = 0.0225 Ω.mm²/m)</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-mono text-blue-600">ΔU% = (ΔU / U) × 100</p>
            <p className="text-xs text-gray-500 mt-1">Limite : 3% éclairage, 5% autres usages</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CalculateurPuissance() {
  const [puissance, setPuissance] = useState('')
  const [tension, setTension] = useState('230')
  const [type, setType] = useState('mono')
  const [cosφ, setCosφ] = useState('1')

  const calculerIntensite = () => {
    const P = parseFloat(puissance)
    const U = parseFloat(tension)
    const cos = parseFloat(cosφ)
    if (!P || !U || !cos) return null

    if (type === 'mono') {
      return P / (U * cos)
    } else {
      return P / (U * Math.sqrt(3) * cos)
    }
  }

  const intensite = calculerIntensite()

  const getDisjoncteur = (i) => {
    if (!i) return null
    const calibres = [2, 6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100]
    return calibres.find(c => c >= i) || '>100A'
  }

  return (
    <div className="card space-y-4">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <Zap size={18} className="text-amber-500" />
        Puissance → Intensité
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Puissance (W)</label>
          <input
            type="number"
            value={puissance}
            onChange={(e) => setPuissance(e.target.value)}
            placeholder="Ex: 3000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Tension (V)</label>
          <select
            value={tension}
            onChange={(e) => setTension(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="230">230V (mono)</option>
            <option value="400">400V (tri)</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="mono">Monophasé</option>
            <option value="tri">Triphasé</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Cos φ</label>
          <select
            value={cosφ}
            onChange={(e) => setCosφ(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">1.0 (résistif)</option>
            <option value="0.9">0.9</option>
            <option value="0.85">0.85</option>
            <option value="0.8">0.8 (moteur)</option>
          </select>
        </div>
      </div>

      {intensite && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">Intensité calculée</span>
            <span className="text-2xl font-bold text-blue-600">{intensite.toFixed(2)} A</span>
          </div>
          <div className="flex items-center justify-between mt-2 text-sm">
            <span className="text-blue-700">Disjoncteur recommandé</span>
            <span className="font-bold text-blue-600">{getDisjoncteur(intensite)} A</span>
          </div>
        </div>
      )}
    </div>
  )
}

function CalculateurSection() {
  const [intensite, setIntensite] = useState('')
  const [mode, setMode] = useState('mono')

  const getSectionMono = (i) => {
    if (i <= 10) return { section: '1.5', disj: '10' }
    if (i <= 16) return { section: '1.5', disj: '16' }
    if (i <= 20) return { section: '2.5', disj: '20' }
    if (i <= 25) return { section: '4', disj: '25' }
    if (i <= 32) return { section: '6', disj: '32' }
    if (i <= 40) return { section: '10', disj: '40' }
    if (i <= 50) return { section: '16', disj: '50' }
    if (i <= 63) return { section: '16', disj: '63' }
    return { section: '25+', disj: '>63' }
  }

  const result = intensite ? getSectionMono(parseFloat(intensite)) : null

  return (
    <div className="card space-y-4">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <Cable size={18} className="text-emerald-500" />
        Intensité → Section
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Intensité (A)</label>
          <input
            type="number"
            value={intensite}
            onChange={(e) => setIntensite(e.target.value)}
            placeholder="Ex: 16"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Mode de pose</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="mono">Encastré / conduit</option>
            <option value="apparent">Apparent</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-emerald-800">Section minimum</span>
            <span className="text-2xl font-bold text-emerald-600">{result.section} mm²</span>
          </div>
          <div className="flex items-center justify-between mt-2 text-sm">
            <span className="text-emerald-700">Protection</span>
            <span className="font-bold text-emerald-600">{result.disj} A</span>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Note : valeurs pour câbles cuivre en installation encastrée. Consulter les tableaux NF C 15-100 pour autres cas.
      </p>
    </div>
  )
}

function CalculateurChuteTension() {
  const [intensite, setIntensite] = useState('')
  const [longueur, setLongueur] = useState('')
  const [section, setSection] = useState('2.5')
  const [tension, setTension] = useState('230')

  const RHO_CUIVRE = 0.0225 // Ω.mm²/m à 20°C

  const calculerChute = () => {
    const I = parseFloat(intensite)
    const L = parseFloat(longueur)
    const S = parseFloat(section)
    const U = parseFloat(tension)

    if (!I || !L || !S || !U) return null

    const deltaU = 2 * RHO_CUIVRE * L * I / S
    const deltaPourcent = (deltaU / U) * 100

    return { deltaU, deltaPourcent }
  }

  const result = calculerChute()

  return (
    <div className="card space-y-4">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <Battery size={18} className="text-purple-500" />
        Chute de tension
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Intensité (A)</label>
          <input
            type="number"
            value={intensite}
            onChange={(e) => setIntensite(e.target.value)}
            placeholder="Ex: 16"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Longueur (m)</label>
          <input
            type="number"
            value={longueur}
            onChange={(e) => setLongueur(e.target.value)}
            placeholder="Ex: 25"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Section (mm²)</label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="1.5">1.5 mm²</option>
            <option value="2.5">2.5 mm²</option>
            <option value="4">4 mm²</option>
            <option value="6">6 mm²</option>
            <option value="10">10 mm²</option>
            <option value="16">16 mm²</option>
            <option value="25">25 mm²</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Tension (V)</label>
          <select
            value={tension}
            onChange={(e) => setTension(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="230">230V</option>
            <option value="400">400V</option>
          </select>
        </div>
      </div>

      {result && (
        <div className={`p-4 rounded-lg border ${
          result.deltaPourcent <= 3 ? 'bg-green-50 border-green-200' :
          result.deltaPourcent <= 5 ? 'bg-amber-50 border-amber-200' :
          'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className={
              result.deltaPourcent <= 3 ? 'text-green-800' :
              result.deltaPourcent <= 5 ? 'text-amber-800' : 'text-red-800'
            }>Chute de tension</span>
            <span className={`text-2xl font-bold ${
              result.deltaPourcent <= 3 ? 'text-green-600' :
              result.deltaPourcent <= 5 ? 'text-amber-600' : 'text-red-600'
            }`}>{result.deltaU.toFixed(2)} V</span>
          </div>
          <div className="flex items-center justify-between mt-2 text-sm">
            <span className={
              result.deltaPourcent <= 3 ? 'text-green-700' :
              result.deltaPourcent <= 5 ? 'text-amber-700' : 'text-red-700'
            }>Pourcentage</span>
            <span className={`font-bold ${
              result.deltaPourcent <= 3 ? 'text-green-600' :
              result.deltaPourcent <= 5 ? 'text-amber-600' : 'text-red-600'
            }`}>{result.deltaPourcent.toFixed(2)} %</span>
          </div>
          <p className={`text-xs mt-2 ${
            result.deltaPourcent <= 3 ? 'text-green-600' :
            result.deltaPourcent <= 5 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {result.deltaPourcent <= 3 ? '✓ OK pour éclairage et autres usages' :
             result.deltaPourcent <= 5 ? '⚠ OK pour usages autres que éclairage' :
             '✗ Chute excessive - Augmenter la section'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Calculateurs
