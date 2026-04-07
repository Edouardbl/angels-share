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

const PLANS = [
  {
    name: 'Essentiel',
    price: '59',
    fleet: 'Jusqu'à 200 fûts',
    description: 'Pour les brasseries artisanales qui veulent reprendre le contrôle de leur flotte.',
    features: [
      'Application scan iOS & Android',
      'Tableau de bord brasseur',
      'Alertes fûts dormants (> 30 jours)',
      'Gestion des incidents qualité',
      'Historique 12 mois',
      'Support email (réponse 48h)',
    ],
    cta: 'Commencer',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '119',
    fleet: 'Jusqu'à 500 fûts',
    description: 'Pour les brasseries en croissance qui veulent impliquer leur réseau de distribution.',
    features: [
      'Tout Essentiel, plus :',
      'Portail distributeur',
      'Portail bar + programme fidélité',
      'Insights consommation par IA',
      'Assistant IA dans les tableaux de bord',
      'Signalement incidents avec suivi',
      'Exports CSV / Excel',
      'Support prioritaire (réponse 24h)',
    ],
    cta: 'Commencer',
    highlight: true,
  },
  {
    name: 'Scale',
    price: '199',
    fleet: 'Jusqu'à 1 500 fûts',
    description: 'Pour les brasseries établies avec des besoins avancés d'intégration et d'analyse.',
    features: [
      'Tout Pro, plus :',
      'Intégrations ERP (Sage, Cegid…)',
      'Analytics avancées par lot',
      'API & webhooks',
      'Gestionnaire de compte dédié',
      'SLA 99,9%',
      'Formation et onboarding sur site',
    ],
    cta: 'Nous contacter',
    highlight: false,
  },
]

function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-[#F8F9FA]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[#1A2E44] mb-3">Des tarifs clairs, sans surprise</h2>
          <p className="text-gray-500 text-lg">Essai gratuit 30 jours · Sans engagement · Résiliable à tout moment</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlight
                  ? 'bg-[#1A2E44] text-white shadow-2xl scale-[1.03]'
                  : 'bg-white border border-gray-100 shadow-sm'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#1D9E75] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                    Le plus populaire
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className={`text-sm font-bold uppercase tracking-wider mb-2 ${plan.highlight ? 'text-[#1D9E75]' : 'text-gray-400'}`}>
                  {plan.name}
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <span className={`text-5xl font-extrabold ${plan.highlight ? 'text-white' : 'text-[#1A2E44]'}`}>{plan.price}€</span>
                  <span className={`text-sm mb-2 ${plan.highlight ? 'text-gray-400' : 'text-gray-400'}`}>/mois</span>
                </div>
                <div className={`text-xs font-semibold mb-4 ${plan.highlight ? 'text-[#1D9E75]' : 'text-[#1D9E75]'}`}>{plan.fleet}</div>
                <p className={`text-sm leading-relaxed ${plan.highlight ? 'text-gray-300' : 'text-gray-500'}`}>{plan.description}</p>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className={`flex items-start gap-2 text-sm ${
                    f.startsWith('Tout') ? `font-semibold ${plan.highlight ? 'text-gray-200' : 'text-[#1A2E44]'}` : plan.highlight ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {!f.startsWith('Tout') && (
                      <span className={`font-bold shrink-0 mt-0.5 ${plan.highlight ? 'text-[#1D9E75]' : 'text-[#1D9E75]'}`}>✓</span>
                    )}
                    {f}
                  </li>
                ))}
              </ul>

              <button className={`w-full font-bold py-3.5 rounded-xl text-sm transition-colors ${
                plan.highlight
                  ? 'bg-[#1D9E75] hover:bg-[#178a64] text-white'
                  : 'bg-[#1A2E44] hover:bg-[#243d57] text-white'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Enterprise row */}
        <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-[#1A2E44] text-lg">Enterprise — Sur mesure</div>
            <p className="text-gray-500 text-sm mt-1">Flotte illimitée · Infrastructure dédiée · Contrat personnalisé · Support 24/7</p>
          </div>
          <button className="shrink-0 border-2 border-[#1A2E44] text-[#1A2E44] hover:bg-[#1A2E44] hover:text-white font-bold px-8 py-3 rounded-xl text-sm transition-colors">
            Parler à un expert
          </button>
        </div>
      </div>
    </section>
  )
}

const AUDIENCES = [
  {
    id: 'brewery',
    badge: 'Brasseur',
    badgeColor: 'bg-blue-100 text-blue-700',
    headline: 'Vous ne savez pas où sont vos fûts.',
    subline: 'En moyenne, 4% de votre flotte disparaît chaque année. Sans traçabilité, impossible de savoir lesquels, où, ni depuis quand.',
    features: [
      'Suivi temps réel de chaque fût — en brasserie, chez le distributeur, chez le bar',
      'Alertes automatiques dès 30 jours sans retour',
      'Analyse qualité par lot : identifiez les problèmes avant qu'ils s'aggravent',
      'Dashboard centralisé : fûts, consignes, incidents, clients en un coup d'œil',
      'Assistant IA pour des recommandations actionnables',
    ],
    stat: { value: '×4,2', label: 'ROI moyen la première année' },
    cta: { label: 'Voir le dashboard brasseur', to: '/brewery' },
    accent: 'border-blue-100',
    statBg: 'bg-blue-50 text-blue-800',
  },
  {
    id: 'distributor',
    badge: 'Distributeur',
    badgeColor: 'bg-amber-100 text-amber-700',
    headline: 'La réconciliation des consignes vous prend des heures.',
    subline: 'Entre les litiges, les relances et les tableaux Excel, vous perdez un temps précieux sur de l'administratif qui pourrait être automatisé.',
    features: [
      'Réconciliation automatique des consignes à chaque scan',
      'Tournées optimisées sur les stocks réels — plus de mauvaises surprises',
      'Alertes par bar sur les retards de retour, priorisées par impact',
      'Tableau de bord partagé avec la brasserie — fini les allers-retours par email',
      'Réduction des litiges : chaque mouvement est tracé et horodaté',
    ],
    stat: { value: '−60%', label: 'de temps sur la gestion des consignes' },
    cta: { label: 'Voir le dashboard distributeur', to: '/distributor' },
    accent: 'border-amber-100',
    statBg: 'bg-amber-50 text-amber-800',
  },
  {
    id: 'bar',
    badge: 'Bar',
    badgeColor: 'bg-green-100 text-green-700',
    headline: 'Vous manquez de visibilité sur votre cave et vos commandes.',
    subline: 'Sans données de rotation, vous commandez à l'aveugle et ratez les opportunités de négociation avec votre brasseur.',
    features: [
      'Confirmation de livraison en 5 secondes — 1 scan et c'est fait',
      'Signalement incident en 2 taps avec identification par QR code',
      'Insights consommation : rotation par bière, comparaison avec bars similaires',
      'Recommandations de commande personnalisées par IA',
      'Programme fidélité : offres exclusives débloquées à chaque scan',
    ],
    stat: { value: '+23%', label: 'd'efficacité sur les commandes en moyenne' },
    cta: { label: 'Voir le dashboard bar', to: '/bar' },
    accent: 'border-green-100',
    statBg: 'bg-green-50 text-green-800',
  },
]

function AudienceSection() {
  const [active, setActive] = useState('brewery')
  const current = AUDIENCES.find(a => a.id === active)

  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1A2E44] mb-3">Fait pour chaque maillon de la filière</h2>
          <p className="text-gray-500">Sélectionnez votre rôle pour voir ce qu'Angel's Share change concrètement.</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {AUDIENCES.map(a => (
            <button
              key={a.id}
              onClick={() => setActive(a.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                active === a.id
                  ? 'bg-[#1A2E44] text-white shadow-md'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {a.badge}
            </button>
          ))}
        </div>

        {/* Content */}
        <div key={current.id} className={`bg-white border-2 ${current.accent} rounded-2xl p-8 md:p-10 shadow-sm animate-fade-in`}>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${current.badgeColor}`}>
                {current.badge}
              </span>
              <h3 className="text-2xl font-extrabold text-[#1A2E44] mb-3 leading-snug">{current.headline}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{current.subline}</p>

              <div className={`inline-flex flex-col items-center px-6 py-4 rounded-xl mb-6 ${current.statBg}`}>
                <div className="text-3xl font-extrabold">{current.stat.value}</div>
                <div className="text-xs font-medium mt-0.5 opacity-80 text-center">{current.stat.label}</div>
              </div>

              <Link
                to={current.cta.to}
                className="inline-block bg-[#1A2E44] hover:bg-[#243d57] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                {current.cta.label} →
              </Link>
            </div>

            <ul className="space-y-3 mt-2">
              {current.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#1D9E75]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[#1D9E75] text-xs font-bold">✓</span>
                  </span>
                  <span className="text-gray-700 text-sm leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </div>
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
            <a href="#audiences" className="text-gray-300 hover:text-white text-sm transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="text-gray-300 hover:text-white text-sm transition-colors">Tarifs</a>
            <Link to="/brewery" className="bg-[#1D9E75] hover:bg-[#178a64] text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
              Voir les dashboards
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
            <a
              href="#audiences"
              className="bg-[#1D9E75] hover:bg-[#178a64] text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              Découvrir la plateforme
            </a>
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
            <div className="text-6xl md:text-7xl font-extrabold text-[#E85D30] mb-3">12 000€</div>
            <div className="text-white text-xl font-semibold">perdus par an</div>
            <div className="text-gray-400 mt-2">pour une brasserie de 300 fûts</div>
          </div>
        </div>
      </section>

      {/* Key stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '97,3%', label: 'taux de retour moyen de nos clients' },
            { value: '< 5s', label: 'par scan à chaque transfert' },
            { value: '×4,2', label: 'ROI moyen dès la 1ère année' },
            { value: '3 acteurs', label: 'connectés sur une seule plateforme' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-[#1A2E44] mb-1">{s.value}</div>
              <div className="text-xs text-gray-400 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Audience sections */}
      <div id="audiences">
        <AudienceSection />
      </div>

      {/* ROI Calculator */}
      <RoiCalculator />

      {/* Pricing */}
      <PricingSection />

      {/* How it works */}
      <section className="py-20 bg-white">
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
            <a href="#audiences" className="text-gray-400 hover:text-white text-sm transition-colors">Fonctionnalités</a>
            <a href="#roi" className="text-gray-400 hover:text-white text-sm transition-colors">ROI</a>
            <a href="#pricing" className="text-gray-400 hover:text-white text-sm transition-colors">Tarifs</a>
            <Link to="/brewery" className="text-gray-400 hover:text-white text-sm transition-colors">Dashboards</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
