import { useState } from 'react'
import { Link } from 'react-router-dom'

const AVG_COST = 130

// ─── Lead gen modal ──────────────────────────────────────────────────────────

function LeadGenModal({ onClose }) {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', company: '', fleet: '' })

  const canSubmit = form.name.trim() && form.email.includes('@') && form.company.trim()

  const handleSubmit = e => {
    e.preventDefault()
    if (!canSubmit) return
    setSent(true)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-lg">✕</button>

        {sent ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] mb-2">Demande reçue !</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Merci <strong>{form.name}</strong>. Notre équipe vous recontacte sous 24h à <strong>{form.email}</strong> pour organiser votre démonstration.
            </p>
            <button onClick={onClose} className="mt-6 bg-[#0F172A] text-white font-semibold px-8 py-3 rounded-xl text-sm transition-colors hover:bg-[#1E293B]">
              Fermer
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-[#0F172A] mb-1">Démarrer votre essai gratuit</h3>
            <p className="text-slate-500 text-sm mb-6">30 jours gratuits · Sans engagement · Réponse sous 24h</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">Prénom &amp; Nom *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Victor Maës"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">Email professionnel *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="victor@brasserie.fr"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Brasserie / Entreprise *</label>
                <input
                  value={form.company}
                  onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  placeholder="Brasserie du Singe Savant"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">Taille de flotte</label>
                <select
                  value={form.fleet}
                  onChange={e => setForm(f => ({ ...f, fleet: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 bg-white"
                >
                  <option value="">Sélectionner...</option>
                  <option value="<200">Moins de 200 fûts</option>
                  <option value="200-500">200 à 500 fûts</option>
                  <option value="500-1500">500 à 1 500 fûts</option>
                  <option value=">1500">Plus de 1 500 fûts</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full font-bold py-3.5 rounded-xl text-sm transition-colors ${
                  canSubmit ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Démarrer mon essai gratuit
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// ─── ROI Calculator ───────────────────────────────────────────────────────────

function RoiCalculator({ onOpenLead }) {
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
          <button
            onClick={onOpenLead}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors"
          >
            Démarrer mon essai gratuit
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

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
      'Intégrations ERP (Sage, Cegid, Odoo…)',
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

function PricingSection({ onOpenLead }) {
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
                  <li key={i} className={`flex items-start gap-2 text-sm ${
                    f.startsWith('Tout')
                      ? `font-semibold ${plan.highlight ? 'text-slate-200' : 'text-[#0F172A]'}`
                      : plan.highlight ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {!f.startsWith('Tout') && <span className="text-blue-500 font-bold shrink-0 mt-0.5">✓</span>}
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={onOpenLead}
                className={`w-full font-bold py-3.5 rounded-xl text-sm transition-colors ${
                  plan.highlight ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-[#0F172A] hover:bg-[#1E293B] text-white'
                }`}
              >
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

// ─── Audience section ─────────────────────────────────────────────────────────

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
                active === a.id ? 'bg-[#0F172A] text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
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
              <Link to={current.cta.to} className="inline-block bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
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

// ─── How it works ─────────────────────────────────────────────────────────────

function KegFlowDiagram() {
  const [step, setStep] = useState(0)
  const steps = [
    { from: 0, to: 1, label: 'Remplissage & QR code collé' },
    { from: 1, to: 2, label: 'Scan livraison distributeur' },
    { from: 2, to: 3, label: 'Scan livraison bar' },
    { from: 3, to: 0, label: 'Retour brasserie confirmé' },
  ]
  const actors = [
    { label: 'Brasserie', icon: '🏭', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'Stock', icon: '📦', bg: 'bg-amber-50', border: 'border-amber-200' },
    { label: 'Distributeur', icon: '🚚', bg: 'bg-purple-50', border: 'border-purple-200' },
    { label: 'Bar', icon: '🍺', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  ]

  const currentStep = steps[step]

  return (
    <div className="max-w-3xl mx-auto">
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

      <div className="relative h-16 mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-0.5 bg-slate-200" />
        </div>
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out"
          style={{ left: `calc(${(currentStep.to / 3) * 100}% - 16px)` }}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-200">
            <svg className="w-4 h-4 text-white" viewBox="0 0 40 40" fill="none">
              <rect x="8" y="6" width="24" height="28" rx="5" stroke="white" strokeWidth="2.5" />
              <rect x="4" y="12" width="32" height="4" rx="2" fill="white" opacity="0.3" />
              <rect x="4" y="24" width="32" height="4" rx="2" fill="white" opacity="0.3" />
            </svg>
          </div>
        </div>
      </div>

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
              className={`h-1.5 rounded-full transition-all ${i === step ? 'bg-blue-600 w-4' : 'bg-slate-300 w-1.5'}`}
            />
          ))}
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
            { step: '1', title: 'QR codes sur les fûts', desc: 'Le brasseur génère et colle les QR codes sur ses fûts. Chaque fût obtient une identité digitale unique.', color: 'bg-blue-600' },
            { step: '2', title: 'Scan à chaque transfert', desc: "Chaque acteur scanne en 5 secondes à chaque mouvement. L'application fonctionne sur n'importe quel smartphone.", color: 'bg-purple-500' },
            { step: '3', title: 'Data en temps réel', desc: 'La donnée remonte instantanément — localisation, durée, incidents, insights IA. Plus aucun fût ne disparaît silencieusement.', color: 'bg-emerald-500' },
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
      </div>
    </section>
  )
}

// ─── Data benefits ────────────────────────────────────────────────────────────

const DATA_BENEFITS = [
  {
    actor: 'Brasseur',
    icon: '🏭',
    color: 'blue',
    headline: 'Moins de pertes, plus de décisions data-driven',
    benefits: [
      { title: 'Moins de fûts perdus', desc: 'Les alertes proactives à 30j permettent de récupérer les fûts avant qu\'ils disparaissent. Taux de retour moyen de nos clients : 98,7%.' },
      { title: 'Lancez vos brassins au bon moment', desc: 'La donnée de consommation remontée par les bars vous indique quand votre stock va s\'épuiser. Fini les ruptures ou la surproduction.' },
      { title: 'Qualité lot par lot', desc: 'Corrélation automatique entre incidents signalés et numéros de lot. Identifiez un problème de recette ou de conditionnement en quelques heures, pas en semaines.' },
    ],
  },
  {
    actor: 'Distributeur',
    icon: '🚚',
    color: 'purple',
    headline: 'Tournées optimisées, litiges éliminés',
    benefits: [
      { title: 'Données de stock réelles à J-0', desc: 'Chaque scan mis à jour en temps réel. Vos tournées sont planifiées sur des données exactes, pas des estimations.' },
      { title: 'Fin des litiges de consigne', desc: 'Chaque mouvement est horodaté et signé par le scan. La réconciliation prend 2 minutes au lieu de 2 heures.' },
      { title: 'Priorisation automatique', desc: 'Les fûts en retard sont classés par impact sur votre taux de retour. Vous savez toujours quoi récupérer en priorité.' },
    ],
  },
  {
    actor: 'Bar',
    icon: '🍺',
    color: 'emerald',
    headline: 'Zéro rupture, meilleures offres',
    benefits: [
      { title: 'Approvisionnement guidé par la donnée', desc: 'Commandez le bon volume, au bon moment. Les recommandations IA tiennent compte de votre rotation réelle et de la saisonnalité.' },
      { title: 'Offres commerciales personnalisées', desc: 'Plus vous scannez, plus vous débloquez des offres exclusives. Le brasseur récompense votre engagement avec des remises ciblées.' },
      { title: 'Visibilité sur votre cave', desc: 'Âge de chaque fût, alertes de fraîcheur, rotation par bière. Votre cave devient un atout, pas une boîte noire.' },
    ],
  },
]

function DataBenefitsSection() {
  const colorMap = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-100', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-100', badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-3">La data partagée profite à toute la chaîne</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Chaque scan enrichit une base de données commune. Plus vous utilisez la plateforme, plus vos décisions deviennent précises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {DATA_BENEFITS.map(actor => {
            const c = colorMap[actor.color]
            return (
              <div key={actor.actor} className={`rounded-2xl border ${c.border} p-6 ${c.bg}`}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl">{actor.icon}</span>
                  <div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.badge}`}>{actor.actor}</span>
                    <p className="text-sm font-semibold text-[#0F172A] mt-1 leading-snug">{actor.headline}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {actor.benefits.map(b => (
                    <div key={b.title} className="flex gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${c.dot} mt-2 shrink-0`} />
                      <div>
                        <div className="text-xs font-bold text-[#0F172A] mb-0.5">{b.title}</div>
                        <div className="text-xs text-slate-600 leading-relaxed">{b.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-10 bg-[#0F172A] rounded-2xl p-8 text-center">
          <div className="text-white text-xl font-bold mb-2">L'effet réseau Angel's Share</div>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-6">
            Plus vos partenaires utilisent la plateforme, plus les données sont précises — et plus les insights de l'IA deviennent pertinents pour tous.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { v: '< 5s', l: 'par scan' },
              { v: '98,7%', l: 'taux de retour moyen' },
              { v: '×4,2', l: 'ROI moyen an 1' },
            ].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-2xl font-extrabold text-white">{s.v}</div>
                <div className="text-xs text-slate-400 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Dashboard previews (north star) ─────────────────────────────────────────

const DASHBOARD_CARDS = [
  {
    actor: 'Brasseur',
    icon: '🏭',
    color: 'blue',
    northStar: 'Récupérez jusqu\'à 43 000€/an',
    metric: '98,7% de taux de retour',
    subMetrics: [
      { label: 'Alertes proactives à 30j', value: '100%' },
      { label: 'Fûts récupérés ce mois', value: '28' },
      { label: 'Incidents traités', value: '< 48h' },
    ],
    to: '/brewery',
    cta: 'Voir le dashboard brasseur',
  },
  {
    actor: 'Distributeur',
    icon: '🚚',
    color: 'purple',
    northStar: '−60% de temps sur les consignes',
    metric: 'Tournées optimisées en temps réel',
    subMetrics: [
      { label: 'Réconciliation automatique', value: '100%' },
      { label: 'Litiges évités / mois', value: '12' },
      { label: 'Économies carburant', value: '~45€/tournée' },
    ],
    to: '/distributor',
    cta: 'Voir le dashboard distributeur',
  },
  {
    actor: 'Bar',
    icon: '🍺',
    color: 'emerald',
    northStar: 'Zéro rupture, commandes optimisées',
    metric: '+23% d\'efficacité sur les commandes',
    subMetrics: [
      { label: 'Recommandations IA', value: 'hebdo' },
      { label: 'Offres exclusives débloquées', value: '3' },
      { label: 'Rotation IPA Mosaic', value: '4,2 jours' },
    ],
    to: '/bar',
    cta: 'Voir le dashboard bar',
  },
]

function DashboardPreviewSection() {
  const colorMap = {
    blue: { badge: 'bg-blue-100 text-blue-700', border: 'border-blue-100', star: 'text-blue-600', btn: 'bg-blue-600 hover:bg-blue-700' },
    purple: { badge: 'bg-purple-100 text-purple-700', border: 'border-purple-100', star: 'text-purple-600', btn: 'bg-purple-600 hover:bg-purple-700' },
    emerald: { badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-100', star: 'text-emerald-600', btn: 'bg-emerald-600 hover:bg-emerald-700' },
  }

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-3">Un tableau de bord par acteur</h2>
          <p className="text-slate-500 text-lg">Chaque dashboard est conçu pour une seule chose : votre métrique principale.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {DASHBOARD_CARDS.map(card => {
            const c = colorMap[card.color]
            return (
              <div key={card.actor} className={`bg-white rounded-2xl border ${c.border} shadow-sm overflow-hidden flex flex-col`}>
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">{card.icon}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.badge}`}>{card.actor}</span>
                  </div>
                  <div className={`text-2xl font-extrabold ${c.star} mb-1 leading-snug`}>{card.northStar}</div>
                  <div className="text-sm text-slate-500 mb-5">{card.metric}</div>

                  <div className="space-y-2">
                    {card.subMetrics.map(m => (
                      <div key={m.label} className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">{m.label}</span>
                        <span className="font-bold text-[#0F172A]">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 border-t border-slate-100">
                  <Link to={card.to} className={`block text-center text-white text-sm font-semibold py-2.5 rounded-xl transition-colors ${c.btn}`}>
                    {card.cta} →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── ERP / Technical integrations ────────────────────────────────────────────

const ERP_SYSTEMS = [
  { name: 'Sage', logo: 'S', color: 'bg-green-100 text-green-700' },
  { name: 'Cegid', logo: 'C', color: 'bg-blue-100 text-blue-700' },
  { name: 'Odoo', logo: 'O', color: 'bg-purple-100 text-purple-700' },
  { name: 'SAP', logo: 'SAP', color: 'bg-amber-100 text-amber-700' },
  { name: 'Pennylane', logo: 'P', color: 'bg-pink-100 text-pink-700' },
  { name: 'QuickBooks', logo: 'QB', color: 'bg-slate-100 text-slate-600' },
]

const INTEGRATION_METHODS = [
  {
    title: 'API REST',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 9l3 3-3 3M13 15h3M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    desc: 'Endpoints documentés (OpenAPI). Poussez ou récupérez vos données fûts, consignes et incidents en temps réel depuis n\'importe quel système.',
  },
  {
    title: 'Webhooks',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    desc: 'Déclenchez des événements dans vos outils dès qu\'un fût est scanné, un incident ouvert ou un seuil de retard atteint.',
  },
  {
    title: 'Export CSV / Excel',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    desc: 'Export planifié ou manuel vers vos outils de reporting existants. Compatible Excel, Google Sheets, Power BI.',
  },
  {
    title: 'Connecteurs ERP',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    desc: 'Connecteurs natifs pour Sage, Cegid, Odoo et SAP. Synchronisation bidirectionnelle des articles, mouvements de stock et écritures comptables.',
  },
]

function ErpSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-block bg-slate-100 text-slate-600 rounded-full px-4 py-1 text-sm font-semibold mb-4">Technique</div>
          <h2 className="text-3xl font-bold text-[#0F172A] mb-3">S'intègre dans votre écosystème</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Angel's Share se connecte à vos outils existants. Pas de double saisie, pas de rupture de workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-12">
          {INTEGRATION_METHODS.map(m => (
            <div key={m.title} className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-6 flex gap-4">
              <div className="w-10 h-10 bg-[#0F172A] text-white rounded-xl flex items-center justify-center shrink-0">
                {m.icon}
              </div>
              <div>
                <div className="font-bold text-[#0F172A] mb-1">{m.title}</div>
                <p className="text-slate-500 text-sm leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="font-bold text-[#0F172A] mb-1">Connecteurs disponibles</div>
            <p className="text-slate-500 text-sm">Intégrations certifiées, mises à jour et maintenues par notre équipe</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {ERP_SYSTEMS.map(erp => (
              <div key={erp.name} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold ${erp.color}`}>
                  {erp.logo}
                </div>
                <span className="text-sm font-semibold text-[#0F172A]">{erp.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-lg">+</div>
              <span className="text-sm text-slate-400 font-medium">Et plus...</span>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">Votre ERP n'est pas dans la liste ? <a href="#" className="text-blue-600 font-semibold hover:text-blue-700">Contactez-nous</a> — nous développons des connecteurs sur demande.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Landing ──────────────────────────────────────────────────────────────────

export default function Landing() {
  const [leadOpen, setLeadOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-white font-bold text-xl">Angel's Share</div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#audiences" className="text-slate-300 hover:text-white text-sm transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="text-slate-300 hover:text-white text-sm transition-colors">Tarifs</a>
            <button
              onClick={() => setLeadOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Essai gratuit
            </button>
          </div>
        </div>
      </nav>

      {/* 1. Hero */}
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
            <button
              onClick={() => setLeadOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
            >
              Démarrer mon essai gratuit
            </button>
            <a href="#audiences" className="border-2 border-white/20 hover:border-white/50 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors">
              Découvrir la plateforme
            </a>
          </div>
        </div>
      </section>

      {/* 2. Problem stat */}
      <section className="py-20 bg-[#0A0F1A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-slate-300 text-xl mb-8 leading-relaxed">
            3 à 5% des fûts disparaissent chaque année. Pertes, litiges de consigne, coûts de remplacement.<br />
            <strong className="text-white">Personne ne sait où ils sont.</strong>
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 inline-block">
            <div className="text-6xl md:text-7xl font-extrabold text-red-400 mb-3">52 000€</div>
            <div className="text-white text-xl font-semibold">d'impact annuel</div>
            <div className="text-slate-400 mt-2">pour une brasserie de 1 000 fûts</div>
            <div className="text-slate-500 text-xs mt-1">pertes + litiges consignes + coûts de remplacement</div>
          </div>
        </div>
      </section>

      {/* 3. Social proof bar */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '98,7%', label: 'taux de retour moyen de nos clients' },
            { value: '< 5s', label: 'par scan à chaque transfert' },
            { value: '×4,2', label: 'ROI moyen dès la 1ère année' },
            { value: '100%', label: 'de la logistique circulaire tracée en temps réel' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-[#0F172A] mb-1">{s.value}</div>
              <div className="text-xs text-slate-400 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Audience section */}
      <AudienceSection />

      {/* 5. How it works */}
      <HowItWorksSection />

      {/* 6. Data benefits */}
      <DataBenefitsSection />

      {/* 7. ROI Calculator */}
      <RoiCalculator onOpenLead={() => setLeadOpen(true)} />

      {/* 8. Pricing */}
      <PricingSection onOpenLead={() => setLeadOpen(true)} />

      {/* 9. Dashboard previews — penultimate */}
      <DashboardPreviewSection />

      {/* 10. ERP / Technical — last */}
      <ErpSection />

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

      {leadOpen && <LeadGenModal onClose={() => setLeadOpen(false)} />}
    </div>
  )
}
