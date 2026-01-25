import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Image, ChevronRight, Filter, X, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { galerieData, getImagesByCategory } from '../data/galerie'

const colorClasses = {
  tableaux: 'bg-blue-500',
  appareillage: 'bg-green-500',
  cablage: 'bg-purple-500',
  defauts: 'bg-red-500',
  chantier: 'bg-amber-500'
}

function Galerie() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  const { categories } = galerieData

  const displayedImages = selectedCategory
    ? getImagesByCategory(selectedCategory)
    : galerieData.images

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-600 to-gray-800 rounded-2xl p-5 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Image size={28} />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Galerie Photos</h2>
            <p className="text-gray-300 text-sm mt-1">
              Exemples d'installations électriques
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                {galerieData.images.length} photos
              </span>
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                CC0 / CC-BY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Photos d'installations pour illustrer les bonnes pratiques et les erreurs à éviter.
            Sources : images libres de droits (Unsplash CC0, Wikimedia CC-BY).
          </p>
        </div>
      </div>

      {/* Category filters */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Filter size={18} className="text-gray-600" />
          <span className="font-semibold text-gray-900">Catégories</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Toutes ({galerieData.images.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? `${colorClasses[cat.id]} text-white`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.titre}
            </button>
          ))}
        </div>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 gap-3">
        {displayedImages.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className="relative aspect-square rounded-xl overflow-hidden group"
          >
            <img
              src={image.src}
              alt={image.titre}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e5e7eb" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12">Image</text></svg>'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <p className="text-white text-xs font-medium line-clamp-2">{image.titre}</p>
            </div>
            {image.danger && (
              <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                <AlertTriangle size={14} />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {displayedImages.length === 0 && (
        <div className="card text-center py-8">
          <Image size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Aucune image dans cette catégorie</p>
        </div>
      )}

      {/* Image modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative">
              <img
                src={selectedImage.src}
                alt={selectedImage.titre}
                className="w-full aspect-video object-cover rounded-t-xl"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23e5e7eb" width="100" height="100"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="12">Image</text></svg>'
                }}
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
              >
                <X size={20} />
              </button>
              {selectedImage.danger && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <AlertTriangle size={12} />
                  DANGER
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{selectedImage.titre}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedImage.description}</p>
              </div>

              {/* Points clés */}
              {selectedImage.points && (
                <div className={`rounded-lg p-3 ${selectedImage.danger ? 'bg-red-50' : 'bg-green-50'}`}>
                  <h4 className={`text-sm font-semibold mb-2 ${selectedImage.danger ? 'text-red-700' : 'text-green-700'}`}>
                    {selectedImage.danger ? 'Points à éviter' : 'Points clés'}
                  </h4>
                  <ul className="space-y-1">
                    {selectedImage.points.map((point, i) => (
                      <li key={i} className={`text-sm flex items-start gap-2 ${selectedImage.danger ? 'text-red-800' : 'text-green-800'}`}>
                        {selectedImage.danger ? (
                          <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle size={14} className="flex-shrink-0 mt-0.5" />
                        )}
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {selectedImage.tags.map((tag, i) => (
                  <span key={i} className="badge bg-gray-100 text-gray-700 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Source */}
              <div className="text-xs text-gray-400 pt-2 border-t">
                Source : {selectedImage.source} • Licence : {selectedImage.license}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer info */}
      <div className="text-center text-xs text-gray-400 pb-4">
        <p>Photos libres de droits - Usage éducatif</p>
        <p className="mt-1">Unsplash (CC0) / Wikimedia Commons</p>
      </div>
    </div>
  )
}

export default Galerie
