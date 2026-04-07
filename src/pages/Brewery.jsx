import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine
} from 'recharts'
import { mockData } from '../mockData'
import AIPrompt from '../components/AIPrompt'

const { brewery, kegs, incidents, clients } = mockData

const statusColors = {
  at_client: '#2563EB',
  at_brewery: '#64748B',
  filled: '#CBD5E1',
  flagged: '#EF4444',
}

const statusLabels = {
  at_client: 'En circulation',
  at_brewery: 'En brasserie',
  filled: 'Prêt à livrer',
  flagged: 'Incident',
}

const breweryInsights = [
  {
    id: 'return-rate',
    title: 'Taux de retour — 3 actions clés',
    priority: 'high',
    metric: '98.1% → 99%',
    text: "KEG-0205 chez Ground Control (74j) est la priorité absolue : +0,4pt dès récupération. Résolvez INC-001 et activez les alertes à 45j. Objectif 99% atteignable dès juillet.",
    followUp: 'Comment atteindre 99% de taux de retour ?',
  },
  {
    id: 'client-risk',
    title: 'Client à risque',
    priority: 'high',
    metric: '4 scans / mois',
    text: "Le Pavillon des Canaux : 1 incident ouvert depuis 4 jours (KEG-0256, goût altéré, stockage soleil) et très faible engagement. Un appel avant le 16/06 peut inverser la tendance.",
    followUp: 'Quels clients prioriser cette semaine ?',
  },
  {
    id: 'incident-trend',
    title: 'Tendance qualité',
    priority: 'medium',
    metric: '2/2 incidents stockage',
    text: "Les 2 incidents actifs sont liés aux conditions de stockage. Inclure une fiche bonnes pratiques dans chaque livraison réduit ce type d'incident de ~35% en 6 mois.",
    followUp: 'Analyser mes incidents qualité',
  },
]

const breweryAIResponse = query => {
  const q = query.toLowerCase()
  if (q.includes('retour') || q.includes('taux') || q.includes('99')) {
    return "Pour atteindre 99% : 1) Récupérez KEG-0205 chez Ground Control — dehors depuis 74j, impact direct +0,4pt. 2) Résolvez INC-001 rapidement. 3) Alerte automatique à 45j. Ces 3 actions = +1,2pt, soit 98,5% dès juillet, 99% en septembre."
  }
  if (q.includes('incident') || q.includes('qualité') || q.includes('lot')) {
    return "LOT-2025-029 : 1 incident (goût altéré, stockage exposé au soleil). LOT-2025-032 : mousse excessive — vérifiez pression à la livraison. Recommandation : fiche bonnes pratiques de stockage sur vos BL. Impact estimé : −35% d'incidents en 6 mois."
  }
  if (q.includes('client') || q.includes('bar') || q.includes('prioriser') || q.includes('ground') || q.includes('pavillon') || q.includes('tigre') || q.includes('capsule')) {
    return "Ground Control (Platinum, 31 scans) et Le Tigre (Platinum, 38 scans) sont vos meilleurs partenaires. Le Pavillon des Canaux (Silver, 4 scans) est sous-utilisé avec 1 incident ouvert : un appel de suivi peut doubler leur engagement. BeerLink Sud gère 83 fûts — votre 2ème plus gros flux."
  }
  if (q.includes('flotte') || q.includes('optimis') || q.includes('fût') || q.includes('dormant')) {
    return "Sur 1 247 fûts : 25 ont un incident actif, ~47 ont plus de 30j dehors. Réduisez votre seuil d'alerte de 45j à 30j — les fûts 30–45j représentent 60% des pertes annuelles. En circulation : 842 (67%) — cible optimale est 70%."
  }
  if (q.includes('économi') || q.includes('saving') || q.includes('roi') || q.includes('argent')) {
    return "Ce mois : 28 fûts récupérés grâce aux alertes proactives = 3 640€. Sur l'année projetée : 43 680€ récupérés. Avant Angel's Share, vos pertes estimées : 65 000€/an. ROI actuel : ×3,1 sur le Plan Pro."
  }
  return "Résumé flotte : 1 247 fûts enregistrés, 842 en circulation (67%), taux de retour 98,1% (+2,3pts vs industrie). 28 fûts récupérés ce mois = 3 640€ d'économies. 2 incidents ouverts à traiter. Projection annuelle : 43 680€ économisés."
}

function TierBadge({ tier }) {
  if (tier === 'platinum') return <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">Platinum</span>
  if (tier === 'gold') return <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">Gold</span>
  return <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">Silver</span>
}

function StatusBadge({ status }) {
  if (status === 'open') return <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">Ouvert</span>
  if (status === 'in_progress') return <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">En cours</span>
  return <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-0.5 rounded-full">Résolu</span>
}

function AIButton({ onClick, label = "Analyser avec l'IA" }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
    >
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
      {label}
    </button>
  )
}

function KegModal({ keg, incident, onClose }) {
  const holderName = keg.holder ? (clients.find(c => c.id === keg.holder)?.name || keg.holder) : '—'

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-fade-in border border-slate-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">✕</button>
        <h3 className="text-lg font-bold text-[#0F172A] mb-4 font-mono">{keg.id}</h3>
        <div className="space-y-2 text-sm mb-4">
          {[
            ['Bière', keg.beer], ['Format', keg.format], ['Lot', keg.lot],
            ['Détenteur', holderName], ['Livré le', keg.delivered_at || '—'],
            ['Jours dehors', keg.days_out],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-slate-500">{label}</span>
              <span className="font-semibold text-[#0F172A]">{value}</span>
            </div>
          ))}
          <div className="flex justify-between">
            <span className="text-slate-500">Statut</span>
            <span className={`font-semibold ${keg.status === 'flagged' ? 'text-red-500' : 'text-blue-600'}`}>
              {statusLabels[keg.status] || keg.status}
            </span>
          </div>
        </div>
        {incident && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-2 text-sm">
            <div className="font-bold text-red-600 mb-2">{incident.id}</div>
            {[
              ['Signalé par', incident.reporter_name], ['Symptôme', incident.symptom_label],
              ['Stockage', incident.storage_label], ['Jours ouverts', incident.days_open],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <span className="text-slate-500 shrink-0">{label}</span>
                <span className="font-semibold text-right text-[#0F172A]">{value}</span>
              </div>
            ))}
            {incident.notes && <div className="text-slate-500 italic mt-2 pt-2 border-t border-red-100 text-xs">{incident.notes}</div>}
            {incident.resolution_note && <div className="text-slate-400 italic text-xs mt-1">→ {incident.resolution_note}</div>}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Brewery() {
  const [selectedKeg, setSelectedKeg] = useState(null)
  const [aiTrigger, setAiTrigger] = useState(null)

  const triggerAI = (text) => setAiTrigger(prev => ({ key: (prev?.key ?? 0) + 1, text }))

  const openIncidents = incidents.filter(i => i.status !== 'resolved').length
  const currentRate = brewery.return_rate_history[brewery.return_rate_history.length - 1].rate

  const donutData = Object.entries(brewery.fleet_distribution).map(([status, count]) => ({
    name: statusLabels[status] || status,
    value: count,
    color: statusColors[status] || '#ccc',
  }))

  const alertKegs = kegs.filter(k => k.days_out > 30 || k.status === 'flagged')
  const selectedIncident = selectedKeg ? incidents.find(i => i.id === selectedKeg.incident_id) : null

  const clientIncidentCount = {}
  incidents.filter(i => i.status !== 'resolved').forEach(inc => {
    clientIncidentCount[inc.reported_by] = (clientIncidentCount[inc.reported_by] || 0) + 1
  })

  const { savings } = brewery

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Slim sidebar */}
      <aside className="w-16 bg-[#0F172A] flex flex-col items-center py-5 gap-4 shrink-0">
        <Link to="/" title="Accueil" className="w-8 h-8 flex items-center justify-center mb-2">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white font-bold text-xs border border-white/10" title="Victor Maës — Brasseur">
          VM
        </div>
        <div className="flex-1" />
        <div className="flex flex-col items-center gap-2 mb-2">
          <Link to="/distributor" title="Vue Distributeur"
            className="w-9 h-9 bg-white/5 hover:bg-blue-500/20 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-400 transition-colors text-xs font-bold">
            D
          </Link>
          <Link to="/bar" title="Vue Bar"
            className="w-9 h-9 bg-white/5 hover:bg-emerald-500/20 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-colors text-xs font-bold">
            B
          </Link>
          <Link to="/" title="Landing"
            className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors text-sm">
            ←
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-5xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Tableau de bord</h1>
            <p className="text-slate-400 text-sm mt-1">Victor Maës — {brewery.name} · {brewery.city}</p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">Flotte totale</div>
              <div className="text-3xl font-extrabold text-[#0F172A]">{brewery.fleet_size.toLocaleString('fr-FR')}</div>
              <div className="text-xs text-slate-400 mt-1">fûts enregistrés</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">En circulation</div>
              <div className="text-3xl font-extrabold text-[#0F172A]">{brewery.fleet_distribution.at_client.toLocaleString('fr-FR')}</div>
              <div className="text-xs text-slate-400 mt-1">chez des clients</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-1">
                <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">Taux de retour</div>
                <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">NSM</span>
              </div>
              <div className="text-3xl font-extrabold text-emerald-500">{currentRate}%</div>
              <div className="text-xs text-emerald-500 mb-2">{savings.vs_industry_avg} vs secteur</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${((currentRate - 90) / 9) * 100}%` }} />
                </div>
                <span className="text-xs text-slate-400">99%</span>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <div className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">Incidents ouverts</div>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-extrabold text-[#0F172A]">{openIncidents}</div>
                {openIncidents > 0 && <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">!</span>}
              </div>
              <div className="text-xs text-slate-400 mt-1">à traiter</div>
            </div>
          </div>

          {/* Savings dashboard */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-[#0F172A] text-sm">Économies réalisées grâce à Angel's Share</h2>
                <p className="text-slate-500 text-xs mt-0.5">Fûts récupérés via alertes proactives · Consignes tracées · Incidents évités</p>
              </div>
              <AIButton onClick={() => triggerAI("Analyse mes économies et mon ROI avec Angel's Share")} label="Analyser" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-emerald-100 p-4 text-center">
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Fûts récupérés ce mois</div>
                <div className="text-3xl font-extrabold text-emerald-600">{savings.monthly_kegs_recovered}</div>
                <div className="text-sm font-semibold text-emerald-600 mt-1">+{savings.monthly_euros_saved.toLocaleString('fr-FR')}€</div>
              </div>
              <div className="bg-white rounded-xl border border-blue-100 p-4 text-center">
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Projection annuelle</div>
                <div className="text-3xl font-extrabold text-blue-600">{savings.annual_projected.toLocaleString('fr-FR')}€</div>
                <div className="text-xs text-slate-400 mt-1">économisés cette année</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Jamais perdus YTD</div>
                <div className="text-3xl font-extrabold text-[#0F172A]">{savings.kegs_never_lost_ytd}</div>
                <div className="text-xs text-slate-400 mt-1">fûts tracés en temps réel</div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid xl:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <h2 className="font-semibold text-[#0F172A] mb-4 text-sm">Répartition de la flotte</h2>
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} cx="50%" cy="45%" innerRadius={55} outerRadius={82} paddingAngle={3} dataKey="value">
                      {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v, n) => [v.toLocaleString('fr-FR') + ' fûts', n]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {donutData.map(d => (
                  <div key={d.name} className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span>{d.name}</span>
                    <span className="ml-auto font-semibold text-[#0F172A]">{d.value.toLocaleString('fr-FR')}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <h2 className="font-semibold text-[#0F172A] mb-4 text-sm">Évolution du taux de retour</h2>
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={brewery.return_rate_history} margin={{ top: 5, right: 24, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[94, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={v => v + '%'} axisLine={false} tickLine={false} />
                    <Tooltip formatter={v => [v + '%', 'Taux']} contentStyle={{ border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }} />
                    <ReferenceLine y={99} stroke="#EF4444" strokeDasharray="5 3" label={{ value: 'Objectif', position: 'right', fontSize: 10, fill: '#EF4444' }} />
                    <Line type="monotone" dataKey="rate" stroke="#2563EB" strokeWidth={2} dot={{ r: 3, fill: '#2563EB' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Clients */}
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#0F172A] text-sm">Clients</h2>
              <AIButton onClick={() => triggerAI('Quels clients devrais-je prioriser cette semaine ? Analyse engagement, fûts et incidents.')} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Nom', 'Type', 'Ville', 'Fûts', 'Consigne', 'Scans/mois', 'Tier', 'Incidents', ''].map(h => (
                      <th key={h} className="text-left text-slate-400 font-medium pb-3 pr-3 text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clients
                    .slice()
                    .sort((a, b) => (clientIncidentCount[b.id] || 0) - (clientIncidentCount[a.id] || 0))
                    .map(client => {
                      const incCount = clientIncidentCount[client.id] || 0
                      return (
                        <tr key={client.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${incCount > 0 ? 'bg-red-50/40' : ''}`}>
                          <td className="py-3 pr-3 font-semibold text-[#0F172A]">{client.name}</td>
                          <td className="py-3 pr-3 text-slate-400 text-xs">{client.type === 'bar' ? 'Bar' : 'Distributeur'}</td>
                          <td className="py-3 pr-3 text-slate-400 text-xs">{client.city}</td>
                          <td className="py-3 pr-3 font-semibold text-[#0F172A]">{client.kegs_held}</td>
                          <td className="py-3 pr-3 text-slate-500">{client.deposit_balance}€</td>
                          <td className="py-3 pr-3 text-slate-500">{client.scan_count_month}</td>
                          <td className="py-3 pr-3"><TierBadge tier={client.tier} /></td>
                          <td className="py-3 pr-3">
                            {incCount > 0
                              ? <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{incCount}</span>
                              : <span className="text-slate-300 text-xs">—</span>}
                          </td>
                          <td className="py-3">
                            <AIButton
                              onClick={() => triggerAI(`Analyse le client ${client.name} : ${client.kegs_held} fûts, ${client.scan_count_month} scans/mois, tier ${client.tier}${incCount > 0 ? `, ${incCount} incident(s) actif(s)` : ''}`)}
                              label="IA"
                            />
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alert kegs */}
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#0F172A] text-sm">Fûts à surveiller</h2>
              <AIButton onClick={() => triggerAI('Quels fûts dormants devrais-je prioriser cette semaine ? Analyse par durée et impact sur le taux de retour.')} />
            </div>
            <div className="space-y-2">
              {alertKegs.map(keg => {
                const holder = keg.holder ? (clients.find(c => c.id === keg.holder)?.name || keg.holder) : '—'
                return (
                  <div key={keg.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <span className="font-mono text-xs font-bold text-[#0F172A] w-24 shrink-0">{keg.id}</span>
                    <span className="flex-1 text-sm text-slate-600 truncate">{keg.beer}</span>
                    <span className="text-xs text-slate-400 w-36 hidden md:block truncate">{holder}</span>
                    <span className={`text-sm font-bold w-14 text-right ${keg.days_out > 60 ? 'text-red-500' : 'text-amber-500'}`}>{keg.days_out}j</span>
                    <div className="w-20 flex justify-end">
                      {keg.status === 'flagged'
                        ? <span className="bg-red-50 text-red-500 text-xs font-bold px-2 py-0.5 rounded-full">Incident</span>
                        : <span className="bg-amber-50 text-amber-600 text-xs font-bold px-2 py-0.5 rounded-full">Dormant</span>}
                    </div>
                    <button onClick={() => setSelectedKeg(keg)} className="text-xs bg-[#0F172A] hover:bg-[#1E293B] text-white px-3 py-1.5 rounded-lg transition-colors shrink-0">
                      Détail
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Incidents */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#0F172A] text-sm">Incidents ouverts</h2>
              <AIButton onClick={() => triggerAI('Analyse mes incidents qualité actuels. Quelles causes communes et recommandations préventives ?')} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {incidents.filter(i => i.status !== 'resolved').map(inc => (
                <div key={inc.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                    <span className="font-bold text-[#0F172A] text-sm">{inc.id}</span>
                    <StatusBadge status={inc.status} />
                  </div>
                  <div className="px-5 py-4 space-y-2 text-sm">
                    {[
                      ['Fût', inc.keg_id], ['Bière', kegs.find(k => k.id === inc.keg_id)?.beer],
                      ['Signalé par', inc.reporter_name], ['Symptôme', inc.symptom_label],
                      ['Stockage', inc.storage_label], ['Ouvert depuis', inc.days_open + ' jours'],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4">
                        <span className="text-slate-400 shrink-0">{label}</span>
                        <span className="font-semibold text-right text-[#0F172A]">{value}</span>
                      </div>
                    ))}
                  </div>
                  {inc.resolution_note && (
                    <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 italic">
                      → {inc.resolution_note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {selectedKeg && (
        <KegModal keg={selectedKeg} incident={selectedIncident} onClose={() => setSelectedKeg(null)} />
      )}

      <AIPrompt getResponse={breweryAIResponse} insights={breweryInsights} triggerQuery={aiTrigger} />
    </div>
  )
}
