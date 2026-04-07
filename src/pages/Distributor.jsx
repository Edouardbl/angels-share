import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip, ResponsiveContainer
} from 'recharts'
import { mockData } from '../mockData'
import AIPrompt from '../components/AIPrompt'

const { distributor, brewery } = mockData

const actionLabels = {
  deliver: 'Livraison',
  collect: 'Collecte',
  deliver_and_collect: 'Livraison + Collecte',
}

const distributorInsights = [
  {
    id: 'overdue',
    title: 'Fût dormant critique',
    priority: 'high',
    metric: '74 jours',
    text: "KEG-0205 chez Ground Control depuis 74j. Impact -0,4pt sur votre taux de retour. À récupérer le 16/06 en priorité absolue.",
    followUp: "Que faire pour KEG-0205 ?",
  },
  {
    id: 'return-rate',
    title: 'Progression taux de retour',
    priority: 'medium',
    metric: '+5pts en 6 mois',
    text: "Vous êtes à 96% — l'objectif est 99%. 3 actions : récupérer KEG-0205 (+0,4pt), engager Le Pavillon (+0,3pt), réduire rotation à 21j (+0,8pt). Projeté : 99,1% dès septembre.",
    followUp: "Comment atteindre 99% de taux de retour ?",
  },
  {
    id: 'tournee',
    title: 'Optimisation tournée',
    priority: 'low',
    metric: '16/06',
    text: "Commencez par Ground Control (retour KEG-0205 prioritaire). Ajout Café République sur le trajet estimé à ~45€ d'économie vs 2 tournées séparées.",
    followUp: "Optimise ma tournée du 16/06",
  },
]

const distributorAIResponse = query => {
  const q = query.toLowerCase()
  if (q.includes('tournée') || q.includes('livraison') || q.includes('optimis')) {
    return "Optimisation tournée du 16/06 : commencez par Ground Control (priorité retour KEG-0205, 74j). Le Pavillon des Canaux est à 15 min. Suggestion : ajoutez Café République (12 fûts à récupérer, sur le trajet) pour une tournée complète en ~3h. Économie estimée : 45€ de carburant vs 2 tournées séparées."
  }
  if (q.includes('retard') || q.includes('dormant') || q.includes('keg')) {
    return "KEG-0205 est chez Ground Control depuis 74j — au-delà du seuil critique de 60j. Impact sur votre taux : -0,4pt. Contactez Thomas Girard pour confirmer le retour le 16/06. KEG-0100 (35j) est dans votre entrepôt : programmez sa livraison prioritaire dès cette semaine."
  }
  if (q.includes('consigne') || q.includes('dépôt') || q.includes('argent')) {
    return "1 410€ de consigne engagée : 720€ chez Ground Control (24 fûts), 150€ au Pavillon des Canaux (5 fûts), 540€ autres. Récupérez en priorité les 2 fûts en retard pour libérer 60€ et améliorer votre bilan."
  }
  if (q.includes('taux') || q.includes('objectif') || q.includes('99')) {
    return "Vous êtes à 96% de taux de retour — l'objectif est 99%. Pour gagner ces 3 points : 1) Récupérez KEG-0205 (+0,4pt), 2) Engagez Le Pavillon des Canaux sur 6 scans supplémentaires (+0,3pt), 3) Réduisez le délai moyen de rotation de 28j à 21j (+0,8pt annualisé). Projeté : 99,1% dès septembre."
  }
  return "Synthèse : 47 fûts en circulation, taux de retour 96% (+5pts en 6 mois). 2 fûts dormants à récupérer en priorité. Tournée planifiée le 16/06 — optimale si Ground Control en premier. Voulez-vous un focus sur les consignes ou l'optimisation des tournées ?"
}

export default function Distributor() {
  const [doneStops, setDoneStops] = useState({})

  const lastRate = distributor.monthly_return_rate[distributor.monthly_return_rate.length - 1].rate
  const round = distributor.rounds[0]

  const toggleStop = (barId) => {
    setDoneStops(prev => ({ ...prev, [barId]: !prev[barId] }))
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Slim sidebar */}
      <aside className="w-16 bg-[#0F172A] flex flex-col items-center py-5 gap-4 shrink-0">
        <Link to="/" title="Accueil" className="mb-2">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0" title="Julie Rouquette — Distributeur">
          JR
        </div>
        <div className="flex-1" />
        <div className="flex flex-col items-center gap-2 mb-2">
          <Link to="/brewery" title="Vue Brasseur"
            className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors text-xs font-bold">
            B
          </Link>
          <Link to="/bar" title="Vue Bar"
            className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors text-xs font-bold">
            G
          </Link>
          <Link to="/" title="Retour"
            className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors text-sm">
            ←
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-5xl space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">Tableau de bord</h1>
            <p className="text-slate-500 text-sm mt-1">Julie Rouquette — {distributor.name} · {distributor.city}</p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className="text-slate-500 text-sm mb-2">Fûts gérés</div>
              <div className="text-3xl font-extrabold text-[#0F172A]">{distributor.kegs_held}</div>
              <div className="text-xs text-slate-400 mt-1">en circulation</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                <span>Taux de retour</span>
                <span className="ml-auto text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">NSM</span>
              </div>
              <div className="text-3xl font-extrabold text-emerald-500">{lastRate}%</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${((lastRate - 85) / (99 - 85)) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400">99%</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className="text-slate-500 text-sm mb-2">Consigne en cours</div>
              <div className="text-3xl font-extrabold text-[#0F172A]">{distributor.deposit_balance.toLocaleString('fr-FR')}€</div>
              <div className="text-xs text-slate-400 mt-1">engagée</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className="text-slate-500 text-sm mb-2">Fûts en retard</div>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-extrabold text-[#0F172A]">{distributor.overdue_kegs.length}</div>
                {distributor.overdue_kegs.length > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">!</span>
                )}
              </div>
              <div className="text-xs text-slate-400 mt-1">plus de 30 jours</div>
            </div>
          </div>

          {/* Return rate chart */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-[#0F172A] mb-4">Taux de retour mensuel</h2>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={distributor.monthly_return_rate} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[88, 100]} tick={{ fontSize: 12, fill: '#94A3B8' }} tickFormatter={v => v + '%'} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={v => [v + '%', 'Taux de retour']}
                    contentStyle={{ border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 13 }}
                  />
                  <ReferenceLine y={99} stroke="#EF4444" strokeDasharray="6 3" label={{ value: 'Objectif 99%', position: 'right', fontSize: 11, fill: '#EF4444' }} />
                  <Line type="monotone" dataKey="rate" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4, fill: '#2563EB', strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-700 font-medium">
              +5 points en 6 mois — continuez à scanner à chaque livraison
            </div>
          </div>

          {/* Next round */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-[#0F172A] mb-4">Tournée du 16/06/2025</h2>
            <div className="space-y-4">
              {round.stops.map(stop => (
                <div key={stop.bar_id} className="border border-slate-100 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-bold text-[#0F172A]">{stop.bar_name}</div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                          {actionLabels[stop.action]}
                        </span>
                        {stop.kegs > 0 && (
                          <span className="text-xs text-slate-500">{stop.kegs} fût(s)</span>
                        )}
                        {stop.overdue_returns > 0 && (
                          <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            {stop.overdue_returns} fût(s) en retard à récupérer en priorité
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleStop(stop.bar_id)}
                      className={`shrink-0 text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                        doneStops[stop.bar_id]
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-[#0F172A]'
                      }`}
                    >
                      {doneStops[stop.bar_id] ? '✓ Fait' : 'Marquer comme fait'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overdue kegs */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-[#0F172A] mb-4">Fûts dormants (&gt;30 jours)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Keg ID', 'Bière', 'Bar', 'Jours dehors'].map(h => (
                      <th key={h} className="text-left text-slate-400 font-medium pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {distributor.overdue_kegs.map(keg => (
                    <tr
                      key={keg.keg_id}
                      className={`border-b border-slate-50 ${keg.days_out > 60 ? 'bg-red-50/40' : ''}`}
                    >
                      <td className="py-3 pr-4 font-mono font-bold text-[#0F172A]">{keg.keg_id}</td>
                      <td className="py-3 pr-4 text-slate-600">{keg.beer}</td>
                      <td className="py-3 pr-4 text-slate-600">{keg.bar_name}</td>
                      <td className="py-3 pr-4">
                        <span className={`font-bold ${keg.days_out > 60 ? 'text-red-500' : 'text-amber-500'}`}>
                          {keg.days_out} jours
                        </span>
                        {keg.days_out > 60 && (
                          <span className="ml-2 bg-red-100 text-red-500 text-xs font-bold px-1.5 py-0.5 rounded-full">!</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-slate-500 mt-4 italic">
              Ces fûts impactent directement votre taux de retour. À prioriser lors de la prochaine tournée.
            </p>
          </div>

          {/* Deposit summary */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-[#0F172A] mb-4">Récapitulatif consignes</h2>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <div className="font-semibold text-[#0F172A]">{brewery.name}</div>
                <div className="text-2xl font-extrabold text-[#0F172A] mt-1">
                  {distributor.deposit_balance.toLocaleString('fr-FR')}€
                  <span className="text-sm font-normal text-slate-500 ml-2">de consigne en cours</span>
                </div>
              </div>
              <button
                onClick={() => window.alert('Export en cours de développement')}
                className="bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
              >
                Exporter
              </button>
            </div>
          </div>
        </div>
      </main>

      <AIPrompt getResponse={distributorAIResponse} insights={distributorInsights} />
    </div>
  )
}
