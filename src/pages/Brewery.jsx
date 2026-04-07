import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Legend
} from 'recharts'
import { mockData } from '../mockData'
import AIPrompt from '../components/AIPrompt'

const { brewery, kegs, incidents, clients } = mockData

const statusColors = {
  at_client: '#1D9E75',
  at_brewery: '#3B82F6',
  filled: '#9CA3AF',
  flagged: '#E85D30',
}

const statusLabels = {
  at_client: 'En circulation',
  at_brewery: 'En brasserie',
  filled: 'Prêt à livrer',
  flagged: 'Incident',
}

function AISummary({ text }) {
  return (
    <div className="flex items-start gap-3 bg-gradient-to-r from-[#1D9E75]/8 to-transparent border border-[#1D9E75]/20 rounded-xl p-4 mt-4">
      <span className="text-base shrink-0 mt-0.5 opacity-70">✨</span>
      <p className="text-sm text-[#1A2E44] leading-relaxed">{text}</p>
    </div>
  )
}

function TierBadge({ tier }) {
  if (tier === 'platinum') return <span className="bg-[#1D9E75] text-white text-xs font-bold px-2 py-0.5 rounded-full">💎 Platinum</span>
  if (tier === 'gold') return <span className="bg-[#F4A623]/20 text-[#a06f0a] text-xs font-bold px-2 py-0.5 rounded-full">🥇 Gold</span>
  return <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">🥈 Silver</span>
}

function StatusBadge({ status }) {
  if (status === 'open') return <span className="bg-[#E85D30]/10 text-[#E85D30] text-xs font-bold px-2 py-0.5 rounded-full">Ouvert</span>
  if (status === 'in_progress') return <span className="bg-[#F4A623]/20 text-[#a06f0a] text-xs font-bold px-2 py-0.5 rounded-full">En cours</span>
  return <span className="bg-[#1D9E75]/10 text-[#1D9E75] text-xs font-bold px-2 py-0.5 rounded-full">Résolu</span>
}

function KegModal({ keg, incident, onClose }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const holderName = keg.holder
    ? (clients.find(c => c.id === keg.holder)?.name || keg.holder)
    : '—'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>
        <h3 className="text-xl font-bold text-[#1A2E44] mb-4">{keg.id}</h3>
        <div className="space-y-2 text-sm mb-4">
          {[
            ['Bière', keg.beer], ['Format', keg.format], ['Lot', keg.lot],
            ['Détenteur', holderName], ['Livré le', keg.delivered_at || '—'],
            ['Jours dehors', keg.days_out],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="text-gray-500">{label}</span>
              <span className="font-semibold">{value}</span>
            </div>
          ))}
          <div className="flex justify-between">
            <span className="text-gray-500">Statut</span>
            <span className={`font-semibold ${keg.status === 'flagged' ? 'text-[#E85D30]' : 'text-[#1D9E75]'}`}>
              {statusLabels[keg.status] || keg.status}
            </span>
          </div>
        </div>
        {incident && (
          <div className="bg-[#FFF5F3] border border-[#E85D30]/20 rounded-xl p-4 space-y-2 text-sm">
            <div className="font-bold text-[#E85D30] mb-2">Incident {incident.id}</div>
            {[
              ['Signalé par', incident.reporter_name],
              ['Symptôme', incident.symptom_label],
              ['Stockage', incident.storage_label],
              ['Jours ouverts', incident.days_open],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <span className="text-gray-500 shrink-0">{label}</span>
                <span className="font-semibold text-right">{value}</span>
              </div>
            ))}
            {incident.notes && <div className="text-gray-600 italic mt-2 pt-2 border-t border-gray-200">{incident.notes}</div>}
            {incident.resolution_note && <div className="text-gray-500 italic text-xs mt-1">→ {incident.resolution_note}</div>}
          </div>
        )}
      </div>
    </div>
  )
}

const breweryAIResponse = query => {
  const q = query.toLowerCase()
  if (q.includes('retour') || q.includes('taux') || q.includes('99')) {
    return "Pour atteindre 99% : 1) Récupérez KEG-0205 chez Ground Control — dehors depuis 74j, impact direct de +0,4pt. 2) Résolvez INC-001 rapidement (KEG-0256 exposé au soleil). 3) Mettez en place une alerte automatique à 45j. Ces 3 actions vous feraient gagner +1,2 point, soit 98% dès juillet."
  }
  if (q.includes('incident') || q.includes('qualité') || q.includes('lot')) {
    return "Analyse qualité — LOT-2025-029 : 1 incident (goût altéré, stockage extérieur exposé). Recommandation : indiquer les conditions de stockage recommandées sur vos BL. LOT-2025-032 : mousse excessive — vérifiez réglage pression à la livraison. 0 incident sur les 4 autres lots actifs."
  }
  if (q.includes('client') || q.includes('bar') || q.includes('partenaire')) {
    return "Ground Control (Platinum, 31 scans) est votre meilleur partenaire — taux de retour 96%. Le Pavillon des Canaux (Silver, 4 scans) est sous-utilisé avec 1 incident ouvert : un appel de suivi pourrait doubler leur engagement. Rouquette Distribution est votre relais clé avec 58 scans/mois."
  }
  if (q.includes('flotte') || q.includes('optimis') || q.includes('fût')) {
    return "Sur 342 fûts : 9 ont plus de 30j dehors dont 2 avec incident. Suggestion : réduisez votre seuil d'alerte de 45j à 30j — les fûts 30–45j représentent 60% des pertes annuelles. Aussi : KEG-0205 (74j) représente à lui seul 30€ de consigne bloquée et un risque de perte définitive."
  }
  return "Synthèse : votre taux de retour 96,8% dépasse la moyenne sectorielle de 1,5pt. Prochaine étape vers 99% : récupérer 3 fûts dormants (KEG-0205, KEG-0389, KEG-0390) et clore INC-001. ROI estimé si objectif atteint : +4 200€/an en consignes récupérées. Voulez-vous un plan d'action détaillé ?"
}

export default function Brewery() {
  const [selectedKeg, setSelectedKeg] = useState(null)

  const inCirculation = kegs.filter(k => k.status === 'at_client').length
  const openIncidents = incidents.filter(i => i.status !== 'resolved').length
  const currentRate = brewery.return_rate_history[brewery.return_rate_history.length - 1].rate

  const statusGroups = {}
  kegs.forEach(k => { statusGroups[k.status] = (statusGroups[k.status] || 0) + 1 })
  const donutData = Object.entries(statusGroups).map(([status, count]) => ({
    name: statusLabels[status] || status,
    value: count,
    color: statusColors[status] || '#ccc'
  }))

  const alertKegs = kegs.filter(k => k.days_out > 30 || k.status === 'flagged')
  const selectedIncident = selectedKeg ? incidents.find(i => i.id === selectedKeg.incident_id) : null

  const clientIncidentCount = {}
  incidents.filter(i => i.status !== 'resolved').forEach(inc => {
    clientIncidentCount[inc.reported_by] = (clientIncidentCount[inc.reported_by] || 0) + 1
  })

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Slim sidebar */}
      <aside className="w-16 bg-[#1A2E44] flex flex-col items-center py-5 gap-4 shrink-0">
        <Link to="/" title="Accueil" className="text-2xl mb-2">🍺</Link>
        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xs" title="Victor Maës — Brasseur">
          VM
        </div>
        <div className="flex-1" />
        <div className="flex flex-col items-center gap-2 mb-2">
          <Link to="/distributor" title="Vue Distributeur"
            className="w-9 h-9 bg-white/10 hover:bg-[#F4A623]/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#F4A623] transition-colors text-xs font-bold">
            D
          </Link>
          <Link to="/bar" title="Vue Bar"
            className="w-9 h-9 bg-white/10 hover:bg-[#1D9E75]/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#1D9E75] transition-colors text-xs font-bold">
            B
          </Link>
          <Link to="/" title="Landing"
            className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors text-sm">
            ←
          </Link>
        </div>
      </aside>

      {/* Main content — all sections, single scroll */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-5xl space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-[#1A2E44]">Tableau de bord</h1>
            <p className="text-gray-500 text-sm mt-1">Victor Maës — {brewery.name} · {brewery.city}</p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="text-gray-400 text-xs mb-2">FLOTTE TOTALE</div>
              <div className="text-3xl font-extrabold text-[#1A2E44]">{brewery.fleet_size}</div>
              <div className="text-xs text-gray-400 mt-1">fûts enregistrés</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="text-gray-400 text-xs mb-2">EN CIRCULATION</div>
              <div className="text-3xl font-extrabold text-[#1A2E44]">{inCirculation}</div>
              <div className="text-xs text-gray-400 mt-1">chez des clients</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 xl:col-span-1">
              <div className="flex items-center justify-between mb-1">
                <div className="text-gray-400 text-xs">TAUX DE RETOUR</div>
                <span className="text-xs bg-[#1D9E75]/10 text-[#1D9E75] px-2 py-0.5 rounded-full font-semibold">NSM</span>
              </div>
              <div className="text-3xl font-extrabold text-[#1D9E75]">{currentRate}%</div>
              <div className="text-xs text-[#1D9E75] mb-2">+ 0.6% ce mois</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1D9E75] rounded-full" style={{ width: `${((currentRate - 90) / 9) * 100}%` }} />
                </div>
                <span className="text-xs text-gray-400">99%</span>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="text-gray-400 text-xs mb-2">INCIDENTS OUVERTS</div>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-extrabold text-[#1A2E44]">{openIncidents}</div>
                {openIncidents > 0 && <span className="bg-[#E85D30] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">!</span>}
              </div>
              <div className="text-xs text-gray-400 mt-1">à traiter</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid xl:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-[#1A2E44] mb-4">Répartition de la flotte</h2>
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={58} outerRadius={86} paddingAngle={3} dataKey="value">
                    {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v + ' fûts', n]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-[#1A2E44] mb-4">Évolution du taux de retour</h2>
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={brewery.return_rate_history} margin={{ top: 5, right: 24, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis domain={[93, 100]} tick={{ fontSize: 12 }} tickFormatter={v => v + '%'} />
                  <Tooltip formatter={v => [v + '%', 'Taux']} />
                  <ReferenceLine y={99} stroke="#E85D30" strokeDasharray="5 3" label={{ value: 'Objectif', position: 'right', fontSize: 11, fill: '#E85D30' }} />
                  <Line type="monotone" dataKey="rate" stroke="#1D9E75" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Clients */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#1A2E44] mb-4">Clients</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Nom', 'Type', 'Ville', 'Fûts', 'Consigne', 'Scans/mois', 'Tier', 'Incidents actifs'].map(h => (
                      <th key={h} className="text-left text-gray-400 font-medium pb-3 pr-4 text-xs uppercase tracking-wide">{h}</th>
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
                        <tr key={client.id} className={`border-b border-gray-50 hover:bg-gray-50 ${incCount > 0 ? 'bg-[#FFF9F7]' : ''}`}>
                          <td className="py-3 pr-4 font-semibold text-[#1A2E44]">{client.name}</td>
                          <td className="py-3 pr-4 text-gray-500">{client.type === 'bar' ? 'Bar' : 'Distributeur'}</td>
                          <td className="py-3 pr-4 text-gray-500">{client.city}</td>
                          <td className="py-3 pr-4 font-semibold">{client.kegs_held}</td>
                          <td className="py-3 pr-4 text-gray-600">{client.deposit_balance}€</td>
                          <td className="py-3 pr-4 text-gray-600">{client.scan_count_month}</td>
                          <td className="py-3 pr-4"><TierBadge tier={client.tier} /></td>
                          <td className="py-3">
                            {incCount > 0
                              ? <span className="inline-flex items-center gap-1.5 bg-[#E85D30] text-white text-xs font-bold px-2.5 py-1 rounded-full">{incCount} incident{incCount > 1 ? 's' : ''}</span>
                              : <span className="text-gray-300 text-xs font-medium">—</span>}
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
            <AISummary text="Le Pavillon des Canaux requiert une attention urgente : 1 incident ouvert depuis 4 jours (KEG-0256, goût altéré, stockage exposé au soleil) et faible engagement (4 scans/mois). Un appel avant la tournée du 16/06 pourrait prévenir une aggravation et doubler leur activité de scan." />
          </div>

          {/* Alert kegs */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#1A2E44] mb-4">Fûts à surveiller</h2>
            <div className="space-y-2">
              {alertKegs.map(keg => {
                const holder = keg.holder ? (clients.find(c => c.id === keg.holder)?.name || keg.holder) : '—'
                return (
                  <div key={keg.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="font-mono text-sm font-bold text-[#1A2E44] w-24 shrink-0">{keg.id}</span>
                    <span className="flex-1 text-sm text-gray-600 truncate">{keg.beer}</span>
                    <span className="text-sm text-gray-400 w-36 hidden md:block truncate">{holder}</span>
                    <span className={`text-sm font-bold w-14 text-right ${keg.days_out > 60 ? 'text-[#E85D30]' : 'text-[#F4A623]'}`}>{keg.days_out}j</span>
                    <div className="w-20 flex justify-end">
                      {keg.status === 'flagged'
                        ? <span className="bg-[#E85D30]/10 text-[#E85D30] text-xs font-bold px-2 py-0.5 rounded-full">Incident</span>
                        : <span className="bg-[#F4A623]/15 text-[#a06f0a] text-xs font-bold px-2 py-0.5 rounded-full">Dormant</span>}
                    </div>
                    <button onClick={() => setSelectedKeg(keg)} className="text-xs bg-[#1A2E44] hover:bg-[#243d57] text-white px-3 py-1.5 rounded-lg transition-colors shrink-0">
                      Détail
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Incidents */}
          <div>
            <h2 className="font-bold text-[#1A2E44] mb-4">Incidents ouverts</h2>
            <AISummary text="Tendance détectée : les 2 incidents actifs impliquent des problèmes de stockage (exposition soleil + température ambiante). Recommandation : joindre une fiche de bonnes pratiques de stockage à chaque livraison — ce type d'action réduit les incidents liés au stockage de 30 à 40% en moyenne sur 6 mois." />
            <div className="grid md:grid-cols-2 gap-4">
              {incidents.filter(i => i.status !== 'resolved').map(inc => (
                <div key={inc.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                    <span className="font-bold text-[#1A2E44]">{inc.id}</span>
                    <StatusBadge status={inc.status} />
                  </div>
                  <div className="px-5 py-4 space-y-2 text-sm">
                    {[
                      ['Fût', inc.keg_id], ['Bière', kegs.find(k => k.id === inc.keg_id)?.beer],
                      ['Signalé par', inc.reporter_name], ['Symptôme', inc.symptom_label],
                      ['Stockage', inc.storage_label], ['Ouvert depuis', inc.days_open + ' jours'],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4">
                        <span className="text-gray-500 shrink-0">{label}</span>
                        <span className="font-semibold text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                  {inc.resolution_note && (
                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-sm text-gray-500 italic">
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

      <AIPrompt getResponse={breweryAIResponse} />
    </div>
  )
}
