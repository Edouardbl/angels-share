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

const distributorAIResponse = query => {
  const q = query.toLowerCase()
  if (q.includes('tournée') || q.includes('livraison') || q.includes('optimis')) {
    return "Optimisation tournée du 16/06 : commencez par Ground Control (priorité retour KEG-0205, 74j). Le Pavillon des Canaux est à 15 min. Suggestion : ajoutez Café République (12 fûts à récupérer, sur le trajet) pour une tournée complète en ~3h. Économie estimée : 45€ de carburant vs 2 tournées séparées."
  }
  if (q.includes('retard') || q.includes('dormant') || q.includes('keg')) {
    return "KEG-0205 est chez Ground Control depuis 74j — au-delà du seuil critique de 60j. Impact sur votre taux : -0,4pt. Contactez Thomas Girard pour confirmer le retour le 16/06. KEG-0100 (35j) est dans votre entrepôt : programmez sa livraison prioritaire dès cette semaine."
  }
  if (q.includes('consigne') || q.includes('dépôt') || q.includes('argent')) {
    return "1 410€ de consigne engagée : 720€ chez Ground Control (24 fûts), 150€ au Pavillon des Canaux (5 fûts), 540€ autres. Récupérez en priorité les 2 fûts en retard pour libérer 60€ et améliorer votre bilan. À ce rythme, votre consigne nette sera proche de 0 d'ici 90 jours si vous maintenez 96% de retour."
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
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Slim sidebar */}
      <aside className="w-16 bg-[#1A2E44] flex flex-col items-center py-5 gap-4 shrink-0">
        <Link to="/" title="Accueil" className="text-2xl mb-2">🍺</Link>
        <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xs" title="Julie Rouquette — Distributeur">
          JR
        </div>
        <div className="flex-1" />
        <div className="flex flex-col items-center gap-2 mb-2">
          <Link to="/brewery" title="Vue Brasseur"
            className="w-9 h-9 bg-white/10 hover:bg-[#F4A623]/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#F4A623] transition-colors text-xs font-bold">
            B
          </Link>
          <Link to="/bar" title="Vue Bar"
            className="w-9 h-9 bg-white/10 hover:bg-[#1D9E75]/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#1D9E75] transition-colors text-xs font-bold">
            G
          </Link>
          <Link to="/" title="Landing"
            className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors text-sm">
            ←
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-5xl space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-[#1A2E44]">Tableau de bord</h1>
            <p className="text-gray-500 text-sm mt-1">Julie Rouquette — {distributor.name} · {distributor.city}</p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                <span>Fûts gérés</span>
              </div>
              <div className="text-3xl font-extrabold text-[#1A2E44]">{distributor.kegs_held}</div>
              <div className="text-xs text-gray-400 mt-1">en circulation</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <span>Taux de retour</span>
                <span className="ml-auto text-xs bg-[#1D9E75]/10 text-[#1D9E75] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">NSM</span>
              </div>
              <div className="text-3xl font-extrabold text-[#1D9E75]">{lastRate}%</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1D9E75] rounded-full"
                    style={{ width: `${((lastRate - 85) / (99 - 85)) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">99%</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="text-gray-500 text-sm mb-2">Consigne en cours</div>
              <div className="text-3xl font-extrabold text-[#1A2E44]">{distributor.deposit_balance.toLocaleString('fr-FR')}€</div>
              <div className="text-xs text-gray-400 mt-1">engagée</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="text-gray-500 text-sm mb-2">Fûts en retard</div>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-extrabold text-[#1A2E44]">{distributor.overdue_kegs.length}</div>
                {distributor.overdue_kegs.length > 0 && (
                  <span className="bg-[#E85D30] text-white text-xs font-bold px-2 py-1 rounded-full">!</span>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-1">plus de 30 jours</div>
            </div>
          </div>

          {/* Return rate chart */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#1A2E44] mb-4">Taux de retour mensuel</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={distributor.monthly_return_rate} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[88, 100]} tick={{ fontSize: 12 }} tickFormatter={v => v + '%'} />
                <Tooltip formatter={v => [v + '%', 'Taux de retour']} />
                <ReferenceLine y={99} stroke="#E85D30" strokeDasharray="6 3" label={{ value: 'Objectif', position: 'right', fontSize: 11, fill: '#E85D30' }} />
                <Line type="monotone" dataKey="rate" stroke="#F4A623" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 bg-[#F0FBF7] border border-[#1D9E75]/20 rounded-xl p-4 text-sm text-[#1D9E75] font-medium">
              +5 points en 6 mois — continuez à scanner à chaque livraison
            </div>
          </div>

          {/* Next round */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#1A2E44] mb-4">Tournée du 16/06/2025</h2>
            <div className="space-y-4">
              {round.stops.map(stop => (
                <div key={stop.bar_id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-bold text-[#1A2E44]">{stop.bar_name}</div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs bg-[#1A2E44]/10 text-[#1A2E44] px-2 py-0.5 rounded-full font-medium">
                          {actionLabels[stop.action]}
                        </span>
                        {stop.kegs > 0 && (
                          <span className="text-xs text-gray-500">{stop.kegs} fût(s)</span>
                        )}
                        {stop.overdue_returns > 0 && (
                          <span className="bg-[#E85D30]/10 text-[#E85D30] text-xs font-bold px-2 py-0.5 rounded-full">
                            {stop.overdue_returns} fût(s) en retard à récupérer en priorité
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleStop(stop.bar_id)}
                      className={`shrink-0 text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                        doneStops[stop.bar_id]
                          ? 'bg-[#1D9E75] text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-[#1A2E44]'
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
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#1A2E44] mb-4">Fûts dormants (&gt;30 jours)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Keg ID', 'Bière', 'Bar', 'Jours dehors'].map(h => (
                      <th key={h} className="text-left text-gray-400 font-medium pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {distributor.overdue_kegs.map(keg => (
                    <tr
                      key={keg.keg_id}
                      className={`border-b border-gray-50 ${keg.days_out > 60 ? 'bg-[#FFF5F3]' : ''}`}
                    >
                      <td className="py-3 pr-4 font-mono font-bold text-[#1A2E44]">{keg.keg_id}</td>
                      <td className="py-3 pr-4 text-gray-600">{keg.beer}</td>
                      <td className="py-3 pr-4 text-gray-600">{keg.bar_name}</td>
                      <td className="py-3 pr-4">
                        <span className={`font-bold ${keg.days_out > 60 ? 'text-[#E85D30]' : 'text-[#F4A623]'}`}>
                          {keg.days_out} jours
                        </span>
                        {keg.days_out > 60 && (
                          <span className="ml-2 bg-[#E85D30]/10 text-[#E85D30] text-xs font-bold px-1.5 py-0.5 rounded-full">!</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-4 italic">
              Ces fûts impactent directement votre taux de retour. À prioriser lors de la prochaine tournée.
            </p>
          </div>

          {/* Deposit summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-[#1A2E44] mb-4">Récapitulatif consignes</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <div className="font-semibold text-[#1A2E44]">{brewery.name}</div>
                <div className="text-2xl font-extrabold text-[#1A2E44] mt-1">
                  {distributor.deposit_balance.toLocaleString('fr-FR')}€
                  <span className="text-sm font-normal text-gray-500 ml-2">de consigne en cours</span>
                </div>
              </div>
              <button
                onClick={() => window.alert('Export en cours de développement')}
                className="bg-[#1A2E44] hover:bg-[#243d57] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
              >
                Exporter
              </button>
            </div>
          </div>
        </div>
      </main>

      <AIPrompt getResponse={distributorAIResponse} />
    </div>
  )
}
