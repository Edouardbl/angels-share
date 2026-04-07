import { useState, useEffect, useRef } from 'react'
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
        <h2 className="text-3xl font-bold text-center text-[#0F172A] mb-2">
          Calculez ce qu'Angel's Share vous rapporte
        </h2>
        <p className="text-center text-slate-500 mb-10">Déplacez le curseur pour voir votre ROI en temps réel</p>

        <div className="mb-10">
          <div className="flex justify-between items-end mb-3">
            <label className="font-semibold text-[#0F172A]">Nombre de fûts dans votre flotte</label>
            <span className="font-extrabold text-[#0F172A] text-4xl tabular-nums">{fleet}</span>
          </div>
          <input
            type="range" min="100" max="5000" step="50"
            value={fleet}
            onChange={e => setFleet(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>100 fûts</span>
            <span>5 000 fûts</span>
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center">
            Coût moyen d'un fût dans la filière brassicole française : <strong className="text-slate-500">{AVG_COST}€</strong>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">
            <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Perte estimée / an</div>
            <div className="text-3xl font-extrabold text-red-500">{loss.toLocaleString('fr-FR')}€</div>
            <div className="text-xs text-slate-400 mt-1">≈ 4% de la flotte</div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center">
            <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Récupérable</div>
            <div className="text-3xl font-extrabold text-blue-600">{recoverable.toLocaleString('fr-FR')}€</div>
            <div className="text-xs text-slate-400 mt-1">avec Angel's Share</div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center">
            <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">ROI</div>
            <div className="text-3xl font-extrabold text-blue-600">×{roi}</div>
            <div className="text-xs text-slate-400 mt-1">dès la 1ère année</div>
          </div>
        </div>

        <div className="text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors">
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
    fleet: "Jusqu'à 200 fûts",
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
    fleet: "Jusqu'à 500 fûts",
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
    fleet: "Jusqu'à 1 500 fûts",
    description: "Pour les brasseries établies avec des besoins avancés d'intégration et d'analyse.",
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
    <section id="pricing" className="py-24 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-3">Des tarifs clairs, sans surprise</h2>
          <p className="text-slate-500 text-lg">Essai gratuit 30 jours · Sans engagement · Résiliable à tout moment</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlight
                  ? 'bg-[#0F172A] text-white shadow-2xl scale-[1.03]'
                  : 'bg-white border border-slate-100 shadow-sm'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                    Le plus populaire
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className={`text-sm font-bold uppercase tracking-wider mb-2 ${plan.highlight ? 'text-blue-400' : 'text-slate-400'}`}>
                  {plan.name}
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <span className={`text-5xl font-extrabold ${plan.highlight ? 'text-white' : 'text-[#0F172A]'}`}>{plan.price}€</span>
                  <span className="text-sm mb-2 text-slate-400">/mois</span>
                </div>
                <div className="text-xs font-semibold text-blue-500 mb-4">{plan.fleet}</div>
                <p className={`text-sm leading-relaxed ${plan.highlight ? 'text-slate-300' : 'text-slate-500'}`}>{plan.description}</p>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-2 text-sm ${
                      f.startsWith('Tout')
                        ? `font-semibold ${plan.highlight ? 'text-slate-200' : 'text-[#0F172A]'}`
                        : plan.highlight ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {!f.startsWith('Tout') && (
                      <span className="text-blue-500 font-bold shrink-0 mt-0.5">✓</span>
                    )}
                    {f}
                  </li>
                ))}
              </ul>

              <button className={`w-full font-bold py-3.5 rounded-xl text-sm transition-colors ${
                plan.highlight
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-[#0F172A] hover:bg-[#1E293B] text-white'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-[#0F172A] text-lg">Enterprise — Sur mesure</div>
            <p className="text-slate-500 text-sm mt-1">Flotte illimitée · Infrastructure dédiée · Contrat personnalisé · Support 24/7</p>
          </div>
          <button className="shrink-0 border-2 border-[#0F172A] text-[#0F172A] hover:bg-[#0F172A] hover:text-white font-bold px-8 py-3 rounded-xl text-sm transition-colors">
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
    subline: "En moyenne, 4% de votre flotte disparaît chaque année. Sans traçabilité, impossible de savoir lesquels, où, ni depuis quand.",
    features: [
      'Suivi temps réel de chaque fût — en brasserie, chez le distributeur, chez le bar',
      'Alertes automatiques dès 30 jours sans retour',
      "Analyse qualité par lot : identifiez les problèmes avant qu'ils s'aggravent",
      "Dashboard centralisé : fûts, consignes, incidents, clients en un coup d'oeil",
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
    subline: "Entre les litiges, les relances et les tableaux Excel, vous perdez un temps précieux sur de l'administratif qui pourrait être automatisé.",
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
    badgeColor: 'bg-emerald-100 text-emerald-700',
    headline: 'Vous manquez de visibilité sur votre cave et vos commandes.',
    subline: "Sans données de rotation, vous commandez à l'aveugle et ratez les opportunités de négociation avec votre brasseur.",
    features: [
      "Confirmation de livraison en 5 secondes — 1 scan et c'est fait",
      'Signalement incident en 2 taps avec identification par QR code',
      'Insights consommation : rotation par bière, comparaison avec bars similaires',
      'Recommandations de commande personnalisées par IA',
      'Programme fidélité : offres exclusives débloquées à chaque scan',
    ],
    stat: { value: '+23%', label: "d'efficacité sur les commandes en moyenne" },
    cta: { label: 'Voir le dashboard bar', to: '/bar' },
    accent: 'border-emerald-100',
    statBg: 'bg-emerald-50 text-emerald-800',
  },
]

function AudienceSection() {
  const [active, setActive] = useState('brewery')
  const current = AUDIENCES.find(a => a.id === active)

  return (
    <section id="audiences" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-3">Fait pour chaque maillon de la filière</h2>
          <p className="text-slate-500">Sélectionnez votre rôle pour voir ce qu'Angel's Share change concrètement.</p>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          {AUDIENCES.map(a => (
            <button
              key={a.id}
              onClick={() => setActive(a.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                active === a.id
                  ? 'bg-[#0F172A] text-white shadow-md'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {a.badge}
            </button>
          ))}
        </div>

        <div key={current.id} className={`bg-white border-2 ${current.accent} rounded-2xl p-8 md:p-10 shadow-sm animate-fade-in`}>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${current.badgeColor}`}>
                {current.badge}
              </span>
              <h3 className="text-2xl font-extrabold text-[#0F172A] mb-3 leading-snug">{current.headline}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">{current.subline}</p>

              <div className={`inline-flex flex-col items-center px-6 py-4 rounded-xl mb-6 ${current.statBg}`}>
                <div className="text-3xl font-extrabold">{current.stat.value}</div>
                <div className="text-xs font-medium mt-0.5 opacity-80 text-center">{current.stat.label}</div>
              </div>

              <Link
                to={current.cta.to}
                className="inline-block bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                {current.cta.label} →
              </Link>
            </div>

            <ul className="space-y-3 mt-2">
              {current.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">✓</span>
                  </span>
                  <span className="text-slate-700 text-sm leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// Animated keg icon
function KegIcon({ className = 'w-8 h-8', color = 'currentColor' }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <rect x="8" y="6" width="24" height="28" rx="5" stroke={color} strokeWidth="2.5" fill="none" />
      <rect x="4" y="12" width="32" height="4" rx="2" fill={color} opacity="0.2" />
      <rect x="4" y="24" width="32" height="4" rx="2" fill={color} opacity="0.2" />
      <line x1="20" y1="6" x2="20" y2="34" stroke={color} strokeWidth="1.5" opacity="0.3" />
    </svg>
  )
}

// Animated keg flow diagram
function KegFlowDiagram() {
  const [step, setStep] = useState(0)
  const steps = [
    { from: 0, to: 1, label: 'Remplissage & QR code collé' },
    { from: 1, to: 2, label: 'Scan livraison distributeur' },
    { from: 2, to: 3, label: 'Scan livraison bar' },
    { from: 3, to: 0, label: 'Retour brasserie confirmé' },
  ]
  const actors = [
    { label: 'Brasserie', icon: '🏭', color: '#2563EB', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'Stock', icon: '📦', color: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-200' },
    { label: 'Distributeur', icon: '🚚', color: '#8B5CF6', bg: 'bg-purple-50', border: 'border-purple-200' },
    { label: 'Bar', icon: '🍺', color: '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  ]

  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % steps.length), 2000)
    return () => clearInterval(t)
  }, [])

  const currentStep = steps[step]

  return (
    <div className="max-w-3xl mx-auto">
      {/* Actors row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {actors.map((actor, i) => (
          <div
            key={actor.label}
            className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-500 ${
              i === currentStep.from || i === currentStep.to
                ? `${actor.bg} ${actor.border} shadow-md scale-105`
                : 'bg-white border-slate-100'
            }`}
          >
            <span className="text-2xl mb-1">{actor.icon}</span>
            <span className="text-xs font-semibold text-[#0F172A] text-center">{actor.label}</span>
            {(i === currentStep.from || i === currentStep.to) && (
              <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-blue-600 animate-pulse" />
            )}
          </div>
        ))}
      </div>

      {/* Animated keg path */}
      <div className="relative h-16 mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-0.5 bg-slate-200 relative">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 flex items-center"
                style={{ left: `${(i / 3) * 100 + 16.6}%` }}
              >
                <svg className="w-3 h-3 text-slate-300" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            ))}
          </div>
        </div>
        {/* Moving keg */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out"
          style={{ left: `calc(${(currentStep.to / 3) * 100}% - 16px)` }}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-200">
            <KegIcon className="w-5 h-5" color="white" />
          </div>
        </div>
      </div>

      {/* Step label */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-5 py-2">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-sm font-semibold text-[#0F172A]">{currentStep.label}</span>
        </div>
        <div className="flex justify-center gap-1.5 mt-3">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === step ? 'bg-blue-600 w-4' : 'bg-slate-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Mini dashboard mockups
function DashboardMockups() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mt-16">
      {/* Brewery mockup */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-[#0F172A] px-4 py-3 flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-white text-xs font-semibold">Brasseur</span>
          <span className="ml-auto text-slate-500 text-xs">Brasserie Le Singe Savant</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {[{ v: '342', l: 'Flotte' }, { v: '96.8%', l: 'Retour' }, { v: '2', l: 'Incidents' }].map(k => (
              <div key={k.l} className="bg-slate-50 rounded-lg p-2 text-center">
                <div className="font-extrabold text-[#0F172A] text-sm">{k.v}</div>
                <div className="text-xs text-slate-400">{k.l}</div>
              </div>
            ))}
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs font-semibold text-[#0F172A] mb-2">Clients</div>
            {[
              { name: 'Ground Control', kegs: 24, inc: 1 },
              { name: 'Rouquette Dist.', kegs: 47, inc: 0 },
            ].map(c => (
              <div key={c.name} className="flex items-center justify-between py-1 text-xs">
                <span className="text-slate-600">{c.name}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">{c.kegs} fûts</span>
                  {c.inc > 0 && <span className="bg-red-100 text-red-500 font-bold px-1.5 py-0.5 rounded-full">{c.inc}</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg px-3 py-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Analyses IA disponibles
          </div>
        </div>
      </div>

      {/* Distributor mockup */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-[#0F172A] px-4 py-3 flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-purple-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13" rx="1" strokeLinecap="round" />
              <path d="M16 8h4l3 5v3h-7V8z" strokeLinecap="round" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <span className="text-white text-xs font-semibold">Distributeur</span>
          <span className="ml-auto text-slate-500 text-xs">Rouquette Dist.</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {[{ v: '47', l: 'Fûts' }, { v: '96%', l: 'Retour' }, { v: '1 410€', l: 'Consigne' }].map(k => (
              <div key={k.l} className="bg-slate-50 rounded-lg p-2 text-center">
                <div className="font-extrabold text-[#0F172A] text-sm">{k.v}</div>
                <div className="text-xs text-slate-400">{k.l}</div>
              </div>
            ))}
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs font-semibold text-[#0F172A] mb-2">Tournée 16/06</div>
            {[
              { name: 'Ground Control', tag: 'Livraison + Collecte', urgent: true },
              { name: 'Le Pavillon', tag: 'Collecte', urgent: false },
            ].map(s => (
              <div key={s.name} className="flex items-center justify-between py-1 text-xs">
                <span className="text-slate-600">{s.name}</span>
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${s.urgent ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'}`}>{s.tag}</span>
              </div>
            ))}
          </div>
          <div className="bg-red-50 text-red-600 text-xs font-semibold rounded-lg px-3 py-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            KEG-0205 dormant : 74 jours
          </div>
        </div>
      </div>

      {/* Bar mockup */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-[#0F172A] px-4 py-3 flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-white text-xs font-semibold">Bar</span>
          <span className="ml-auto text-slate-500 text-xs">Ground Control</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {[{ v: '24', l: 'Fûts' }, { v: '31', l: 'Scans' }, { v: '💎', l: 'Platinum' }].map(k => (
              <div key={k.l} className="bg-slate-50 rounded-lg p-2 text-center">
                <div className="font-extrabold text-[#0F172A] text-sm">{k.v}</div>
                <div className="text-xs text-slate-400">{k.l}</div>
              </div>
            ))}
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs font-semibold text-[#0F172A] mb-2">Rotation</div>
            {[
              { beer: 'IPA Mosaic', days: '4,2j', trend: 'up' },
              { beer: 'Pale Ale Citra', days: '6,1j', trend: 'stable' },
            ].map(r => (
              <div key={r.beer} className="flex items-center justify-between py-1 text-xs">
                <span className="text-slate-600">{r.beer}</span>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">{r.days}</span>
                  <span className={r.trend === 'up' ? 'text-emerald-500' : 'text-slate-400'}>{r.trend === 'up' ? '↑' : '→'}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg px-3 py-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            3 offres Platinum débloquées
          </div>
        </div>
      </div>
    </div>
  )
}

function HowItWorksSection() {
  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-3">Comment ça marche</h2>
          <p className="text-slate-500 text-lg">Un fût scanné à chaque transfert. Zéro perte silencieuse.</p>
        </div>

        <KegFlowDiagram />

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            {
              step: '1',
              title: 'QR codes sur les fûts',
              desc: 'Le brasseur génère et colle les QR codes sur ses fûts. Chaque fût obtient une identité digitale unique.',
              color: 'bg-blue-600',
            },
            {
              step: '2',
              title: 'Scan à chaque transfert',
              desc: "Chaque acteur scanne en 5 secondes à chaque mouvement. L'application fonctionne sur n'importe quel smartphone.",
              color: 'bg-purple-500',
            },
            {
              step: '3',
              title: 'Data en temps réel',
              desc: 'La donnée remonte instantanément — localisation, durée, incidents, insights IA. Plus aucun fût ne disparaît silencieusement.',
              color: 'bg-emerald-500',
            },
          ].map(item => (
            <div key={item.step} className="text-center">
              <div className={`w-12 h-12 ${item.color} text-white rounded-xl flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-lg`}>
                {item.step}
              </div>
              <h3 className="font-bold text-[#0F172A] mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 mb-4">
          <p className="text-slate-500 font-medium">Aperçu des tableaux de bord par acteur</p>
        </div>

        <DashboardMockups />

        <div className="flex justify-center gap-4 mt-10">
          <Link to="/brewery" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Dashboard Brasseur →
          </Link>
          <Link to="/distributor" className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors">
            Dashboard Distributeur →
          </Link>
          <Link to="/bar" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
            Dashboard Bar →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-white font-bold text-xl">Angel's Share</div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#audiences" className="text-slate-300 hover:text-white text-sm transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="text-slate-300 hover:text-white text-sm transition-colors">Tarifs</a>
            <Link to="/brewery" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
              Voir les dashboards
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center bg-[#0F172A]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-800/10 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full px-4 py-1 text-sm font-semibold mb-8">
            Traçabilité des fûts pour la filière brassicole française
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Rien ne se perd,<br />
            <span className="text-blue-400">tout se partage.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            La plateforme qui connecte brasseurs, distributeurs et bars pour éliminer les pertes de fûts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#audiences" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors">
              Découvrir la plateforme
            </a>
            <a href="#roi" className="border-2 border-white/20 hover:border-white/50 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors">
              Calculer mon ROI
            </a>
          </div>
        </div>
      </section>

      {/* Problem stat */}
      <section className="py-20 bg-[#0A0F1A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-slate-300 text-xl mb-8 leading-relaxed">
            3 à 5% des fûts disparaissent chaque année. 100–150€ pièce.<br />
            <strong className="text-white">Personne ne sait où ils sont.</strong>
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 inline-block">
            <div className="text-6xl md:text-7xl font-extrabold text-red-400 mb-3">12 000€</div>
            <div className="text-white text-xl font-semibold">perdus par an</div>
            <div className="text-slate-400 mt-2">pour une brasserie de 300 fûts</div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '97,3%', label: 'taux de retour moyen de nos clients' },
            { value: '< 5s', label: 'par scan à chaque transfert' },
            { value: '×4,2', label: 'ROI moyen dès la 1ère année' },
            { value: '3 acteurs', label: 'connectés sur une seule plateforme' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-[#0F172A] mb-1">{s.value}</div>
              <div className="text-xs text-slate-400 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <AudienceSection />

      <HowItWorksSection />

      <RoiCalculator />

      <PricingSection />

      <footer className="bg-[#0F172A] py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-white font-bold text-xl mb-1">Angel's Share</div>
            <div className="text-slate-400 text-sm">La traçabilité des fûts pour la filière brassicole française</div>
          </div>
          <div className="flex gap-6">
            <a href="#audiences" className="text-slate-400 hover:text-white text-sm transition-colors">Fonctionnalités</a>
            <a href="#roi" className="text-slate-400 hover:text-white text-sm transition-colors">ROI</a>
            <a href="#pricing" className="text-slate-400 hover:text-white text-sm transition-colors">Tarifs</a>
            <Link to="/brewery" className="text-slate-400 hover:text-white text-sm transition-colors">Dashboards</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
