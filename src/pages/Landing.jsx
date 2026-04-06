import { useState } from 'react'
import { Link } from 'react-router-dom'

const AVG_COST = 130

function RoiCalculator() {
  const [fleet, setFleet] = useState(400)

  const loss = Math.round(fleet * AVG_COST * 0.04)
  const recoverable = Math.round(loss * 0.75)
  const roi = (recoverable / (119 * 12)).toFixed(1)

  return (
    <section id="roi" className="py-20 bg-white">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-[#1A2E44] mb-2">
          Calculez ce qu'Angel's Share vous rapporte
        </h2>
        <p className="text-center text-gray-500 mb-10">Déplacez le curseur pour voir votre ROI en temps réel</p>

        {/* Fleet slider */}
        <div className="mb-10">
          <div className="flex justify-between items-end mb-3">
            <label className="font-semibold text-[#1A2E44]">Nombre de fûts dans votre flotte</label>
            <span className="font-extrabold text-[#1A2E44] text-4xl tabular-nums">{fleet}</span>
          </div>
          <input
            type="range" min="100" max="5000" step="50"
            value={fleet}
            onChange={e => setFleet(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1D9E75]"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>100 fûts</span>
            <span>5 000 fûts</span>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Coût moyen d'un fût dans la filière brassicole française : <strong className="text-gray-500">{AVG_COST}€</strong>
          </p>
        </div>

        {/* Results */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#FFF5F3] border border-[#E85D30]/20 rounded-2xl p-5 text-center">
            <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Perte estimée / an</div>
            <div className="text-3xl font-extrabold text-[#E85D30]">{loss.toLocaleString('fr-FR')}€</div>
            <div className="text-xs text-gray-400 mt-1">≈ 4% de la flotte</div>
          </div>
          <div className="bg-[#F0FBF7] border border-[#1D9E75]/20 rounded-2xl p-5 text-center">
            <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Récupérable</div>
            <div className="text-3xl font-extrabold text-[#1D9E75]">{recoverable.toLocaleString('fr-FR')}€</div>
            <div className="text-xs text-gray-400 mt-1">avec Angel's Share</div>
          </div>
          <div className="bg-[#F0FBF7] border border-[#1D9E75]/30 rounded-2xl p-5 text-center">
            <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">ROI</div>
            <div className="text-3xl font-extrabold text-[#1D9E75]">×{roi}</div>
            <div className="text-xs text-gray-400 mt-1">dès la 1ère année</div>
          </div>
        </div>

        <div className="text-center">
          <button className="bg-[#1D9E75] hover:bg-[#178a64] text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors">
            Démarrer mon essai gratuit
          </button>
        </div>
      </div>
    </section>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1A2E44]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-white font-bold text-xl">Angel's Share</div>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/brewery" className="text-gray-300 hover:text-white text-sm transition-colors">Brasseur</Link>
            <Link to="/distributor" className="text-gray-300 hover:text-white text-sm transition-colors">Distributeur</Link>
            <Link to="/bar" className="text-gray-300 hover:text-white text-sm transition-colors">Bar</Link>
            <Link to="/brewery" className="bg-[#1D9E75] hover:bg-[#178a64] text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
              Voir le dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center" style={{ background: 'linear-gradient(135deg, #1A2E44 0%, #2D5A4E 100%)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1D9E75]/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#F4A623]/8 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block bg-[#1D9E75]/20 text-[#1D9E75] border border-[#1D9E75]/30 rounded-full px-4 py-1 text-sm font-semibold mb-8">
            Traçabilité des fûts pour la filière brassicole française
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Rien ne se perd,<br />
            <span className="text-[#1D9E75]">tout se partage.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            La plateforme qui connecte brasseurs, distributeurs et bars pour éliminer les pertes de fûts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/brewery"
              className="bg-[#1D9E75] hover:bg-[#178a64] text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              Voir le dashboard brasseur
            </Link>
            <a
              href="#roi"
              className="border-2 border-white/40 hover:border-white text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              Calculer mon ROI
            </a>
          </div>
        </div>
      </section>

      {/* Problem statement */}
      <section className="py-20 bg-[#1A2E44]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-300 text-xl mb-8 leading-relaxed">
            3 à 5% des fûts disparaissent chaque année. 100–150€ pièce.<br />
            <strong className="text-white">Personne ne sait où ils sont.</strong>
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 inline-block">
            <div className="text-6xl md:text-7xl font-extrabold text-[#E85D30] mb-3">
              12 000€
            </div>
            <div className="text-white text-xl font-semibold">perdus par an</div>
            <div className="text-gray-400 mt-2">pour une brasserie de 300 fûts</div>
          </div>
        </div>
      </section>

      {/* Value proposition */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#1A2E44] mb-4">Une plateforme pour toute la filière</h2>
          <p className="text-center text-gray-500 mb-14">Chaque acteur y gagne</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                initials: 'BR',
                title: 'Brasseur',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-700',
                border: 'border-blue-100',
                benefits: [
                  'Visibilité temps réel sur toute la flotte',
                  'Alertes automatiques fûts dormants',
                  'Analytics incidents qualité par lot',
                  'ROI ×3 à ×7 vs abonnement',
                ],
                cta: { label: 'Dashboard brasseur', to: '/brewery' }
              },
              {
                initials: 'DI',
                title: 'Distributeur',
                iconBg: 'bg-amber-100',
                iconColor: 'text-amber-700',
                border: 'border-amber-100',
                benefits: [
                  'Réconciliation consignes automatique',
                  'Alertes retards de retour par bar',
                  'Optimisation tournées sur stocks réels',
                  "Moins de litiges, moins d'admin",
                ],
                cta: { label: 'Dashboard distributeur', to: '/distributor' }
              },
              {
                initials: 'BA',
                title: 'Bar',
                iconBg: 'bg-green-100',
                iconColor: 'text-green-700',
                border: 'border-green-100',
                benefits: [
                  'Confirmation livraison en 1 tap',
                  'Signalement incident en 2 taps',
                  'Insights consommation personnalisés',
                  'Offres exclusives débloquées par scans',
                ],
                cta: { label: 'Dashboard bar', to: '/bar' }
              }
            ].map(card => (
              <div key={card.title} className={`bg-white rounded-2xl border-2 ${card.border} p-8 shadow-sm`}>
                <div className={`w-14 h-14 ${card.iconBg} rounded-2xl flex items-center justify-center font-bold text-lg mb-5 ${card.iconColor}`}>
                  {card.initials}
                </div>
                <h3 className="text-xl font-bold text-[#1A2E44] mb-4">{card.title}</h3>
                <ul className="space-y-2.5 mb-6">
                  {card.benefits.map(b => (
                    <li key={b} className="flex items-start gap-2 text-gray-600 text-sm">
                      <span className="text-[#1D9E75] font-bold mt-0.5 shrink-0">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link to={card.cta.to} className="block text-center bg-[#1A2E44] hover:bg-[#243d57] text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
                  {card.cta.label} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <RoiCalculator />

      {/* How it works */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#1A2E44] mb-4">Comment ça marche</h2>
          <p className="text-center text-gray-500 mb-14">3 étapes, 5 secondes par scan</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'QR codes sur les fûts', desc: 'Le brasseur génère les QR codes et les colle sur ses fûts' },
              { step: '2', title: 'Scan à chaque transfert', desc: 'Chaque acteur scanne en 5 secondes à chaque transfert' },
              { step: '3', title: 'Data en temps réel', desc: 'La donnée remonte en temps réel — pertes, incidents, insights' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-[#1A2E44] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-5">
                  {item.step}
                </div>
                <h3 className="font-bold text-[#1A2E44] mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A2E44] py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-white font-bold text-xl mb-1">Angel's Share</div>
            <div className="text-gray-400 text-sm">La traçabilité des fûts pour la filière brassicole française</div>
          </div>
          <div className="flex gap-6">
            <Link to="/brewery" className="text-gray-400 hover:text-white text-sm transition-colors">Brasseur</Link>
            <Link to="/distributor" className="text-gray-400 hover:text-white text-sm transition-colors">Distributeur</Link>
            <Link to="/bar" className="text-gray-400 hover:text-white text-sm transition-colors">Bar</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
