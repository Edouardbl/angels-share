import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { mockData } from '../mockData'
import AIPrompt from '../components/AIPrompt'

const { clients, kegs, bar_insights, offers, tiers, symptom_options, storage_options, brewery } = mockData

const bar = clients.find(c => c.id === 'bar_002')
const barKegs = kegs.filter(k => k.holder === 'bar_002')
const insights = bar_insights['bar_002']

const tierOrder = { silver: 0, gold: 1, platinum: 2 }

const TIER_MILESTONES = [
  { id: 'silver', label: 'Silver', scans: 0 },
  { id: 'gold', label: 'Gold', scans: 10 },
  { id: 'platinum', label: 'Platinum', scans: 25 },
]
const MAX_SCANS = 25

const barInsights = [
  {
    id: 'stock-alert',
    title: 'IPA Mosaic — réapprovisionnement urgent',
    priority: 'high',
    metric: '5 jours restants',
    text: "Votre IPA Mosaic tourne en 4,2j — le plus rapide de votre cave. À ce rythme, vous serez à sec dans 5 jours. Commandez 2× 30L dès maintenant pour éviter la rupture.",
    followUp: "Commande suggérée pour IPA Mosaic",
  },
  {
    id: 'tier-status',
    title: 'Niveau Platinum — 3 offres actives',
    priority: 'medium',
    metric: '31 scans / mois',
    text: "Vous êtes au niveau maximum. La livraison offerte expire bientôt : commandez 5 fûts ou plus pour en profiter. Maintenez 20+ scans/mois pour rester Platinum.",
    followUp: "Comment profiter de mes offres Platinum ?",
  },
  {
    id: 'incident',
    title: 'Incident en cours — KEG-0206',
    priority: 'high',
    metric: '1 incident actif',
    text: "Berliner Weisse Framboise (KEG-0206) : mousse excessive signalée. Remplacement prévu le 16/06 via votre livreur. Aucune action requise de votre côté.",
    followUp: "Quel est le statut de l'incident KEG-0206 ?",
  },
]

const barAIResponse = query => {
  const q = query.toLowerCase()
  if (q.includes('commande') || q.includes('stock') || q.includes('fût')) {
    return "Votre IPA Mosaic tourne en 4,2 jours — le plus rapide de votre cave. À ce rythme, vous serez à sec dans 5 jours. Recommandation : commandez 2× IPA Mosaic 30L dès maintenant. Votre Pale Ale Citra est stable, 1 fût supplémentaire suffit pour 2 semaines."
  }
  if (q.includes('tier') || q.includes('niveau') || q.includes('offre') || q.includes('scan')) {
    return "Vous êtes Platinum avec 31 scans ce mois — niveau maximum ! Vos 3 offres exclusives sont actives. La livraison offerte expire fin juin : commandez 5 fûts ou plus pour en profiter. Conseil : maintenez 20+ scans/mois pour rester Platinum le mois prochain."
  }
  if (q.includes('incident') || q.includes('défectueux') || q.includes('problème')) {
    return "1 incident actif : KEG-0206 (Berliner Weisse Framboise) avec mousse excessive. Remplacement prévu le 16/06. Pour signaler un nouveau problème, utilisez le bouton rouge en bas de page et scannez le fût concerné."
  }
  if (q.includes('rotation') || q.includes('perfor') || q.includes('chiffre')) {
    return "Vos performances ce mois : 31 fûts écoulés — en hausse de 15% vs la semaine dernière. Votre IPA Mosaic tourne 18% plus vite que les bars similaires, Session Blonde 3% plus lentement. Tendance générale : +15% en 6 semaines, cohérent avec la saison estivale."
  }
  return "Synthèse du mois : 31 fûts scannés, niveau Platinum actif, 3 offres exclusives débloquées. Votre cave est bien approvisionnée avec 5 fûts actifs. Prochaine livraison suggérée : IPA Mosaic × 2 + Pale Ale Citra × 1. Voulez-vous une analyse de rotation ou des recommandations de commande ?"
}

function Toast({ message, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000)
    return () => clearTimeout(t)
  }, [onDismiss])
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#10B981] text-white font-semibold px-6 py-3 rounded-xl shadow-lg z-50 text-sm animate-fade-in">
      {message}
    </div>
  )
}

// Animated scan counter badge
function ScanCounter({ count, prevCount }) {
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (count !== prevCount) {
      setAnimating(true)
      const t = setTimeout(() => setAnimating(false), 600)
      return () => clearTimeout(t)
    }
  }, [count, prevCount])

  return (
    <div className={`text-right transition-transform ${animating ? 'animate-tier-pop' : ''}`}>
      <div className="text-3xl font-extrabold text-[#10B981]">{count}</div>
      <div className="text-xs text-gray-400">scans ce mois</div>
    </div>
  )
}

// Elegant tier journey progress bar
function TierJourney({ scanCount, currentTier }) {
  const clampedScans = Math.min(scanCount, MAX_SCANS)
  const pct = (clampedScans / MAX_SCANS) * 100

  const nextMilestone = TIER_MILESTONES.find(m => m.scans > scanCount)

  return (
    <div className="mt-4">
      {/* Track */}
      <div className="relative h-2 bg-gray-100 rounded-full mx-1">
        <div
          className="absolute h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #9CA3AF 0%, #F59E0B 40%, #10B981 100%)',
          }}
        />
        {/* Milestone dots */}
        {TIER_MILESTONES.map(m => {
          const dotPct = (m.scans / MAX_SCANS) * 100
          const reached = scanCount >= m.scans
          return (
            <div
              key={m.id}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${dotPct}%` }}
            >
              <div className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                reached
                  ? m.id === 'platinum' ? 'bg-[#10B981] border-[#10B981]'
                    : m.id === 'gold' ? 'bg-[#F59E0B] border-[#F59E0B]'
                    : 'bg-gray-300 border-gray-300'
                  : 'bg-white border-gray-200'
              }`} />
            </div>
          )
        })}
      </div>

      {/* Labels */}
      <div className="relative mt-4 h-8">
        {TIER_MILESTONES.map((m, i) => {
          const dotPct = (m.scans / MAX_SCANS) * 100
          const reached = scanCount >= m.scans
          return (
            <div
              key={m.id}
              className="absolute -translate-x-1/2 text-center"
              style={{ left: `${i === 0 ? 0 : i === TIER_MILESTONES.length - 1 ? 100 : dotPct}%` }}
            >
              <div className={`text-xs font-semibold ${reached ? 'text-[#0F172A]' : 'text-gray-300'}`}>{m.label}</div>
              {m.scans > 0 && (
                <div className={`text-xs ${reached ? 'text-gray-400' : 'text-gray-200'}`}>{m.scans}</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Next step */}
      {nextMilestone ? (
        <div className="mt-2 pt-3 border-t border-gray-100 text-sm text-gray-500">
          Plus que <span className="font-bold text-[#0F172A]">{nextMilestone.scans - scanCount}</span> scan{nextMilestone.scans - scanCount > 1 ? 's' : ''} pour atteindre{' '}
          <span className="font-semibold text-[#0F172A]">{nextMilestone.label}</span>
        </div>
      ) : (
        <div className="mt-2 pt-3 border-t border-gray-100 text-sm font-semibold text-[#10B981]">
          Niveau maximum atteint
        </div>
      )}
    </div>
  )
}

// Scan modal — simulates camera + QR scan
function ScanModal({ onClose, onScanned }) {
  const [phase, setPhase] = useState('scanning') // 'scanning' | 'success'
  const scannedKeg = useRef(barKegs[Math.floor(Math.random() * barKegs.length)])

  useEffect(() => {
    const t = setTimeout(() => setPhase('success'), 2200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (phase === 'success') {
      const t = setTimeout(() => onScanned(scannedKeg.current), 1400)
      return () => clearTimeout(t)
    }
  }, [phase, onScanned])

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>

        {phase === 'scanning' ? (
          <div className="text-center">
            <div className="font-bold text-[#0F172A] text-lg mb-5">Scanner un fût</div>
            {/* Camera viewfinder */}
            <div className="relative w-52 h-52 mx-auto mb-5 rounded-xl overflow-hidden bg-[#0F172A]/5 border-2 border-[#10B981]/20">
              {/* Corner marks */}
              <div className="absolute top-2 left-2 w-7 h-7 border-t-2 border-l-2 border-[#10B981] rounded-tl" />
              <div className="absolute top-2 right-2 w-7 h-7 border-t-2 border-r-2 border-[#10B981] rounded-tr" />
              <div className="absolute bottom-2 left-2 w-7 h-7 border-b-2 border-l-2 border-[#10B981] rounded-bl" />
              <div className="absolute bottom-2 right-2 w-7 h-7 border-b-2 border-r-2 border-[#10B981] rounded-br" />
              {/* Scan line */}
              <div className="absolute left-4 right-4 h-0.5 bg-[#10B981] shadow-lg animate-scan-line opacity-80" />
              {/* Mock QR */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-20 h-20 grid grid-cols-3 gap-1">
                  {[1,0,1,0,1,0,1,0,1].map((v, i) => (
                    <div key={i} className={`rounded-sm ${v ? 'bg-[#0F172A]' : ''}`} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Placez le QR code dans le cadre</p>
          </div>
        ) : (
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-[#10B981] font-bold text-lg mb-1">Fût scanné !</div>
            <div className="font-mono font-bold text-[#0F172A] text-lg">{scannedKeg.current.id}</div>
            <div className="text-gray-500 text-sm mt-0.5">{scannedKeg.current.beer}</div>
          </div>
        )}
      </div>
    </div>
  )
}

// Incident modal — step 1: identify keg, step 2: details
function IncidentModal({ onClose, onSubmit }) {
  const [step, setStep] = useState('identify') // 'identify' | 'scan' | 'details'
  const [selectedKeg, setSelectedKeg] = useState('')
  const [manualRef, setManualRef] = useState('')
  const [scanPhase, setScanPhase] = useState('scanning')
  const scannedRef = useRef(null)
  const [form, setForm] = useState({ symptom: '', storage: '', notes: '' })

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const startScan = () => {
    const keg = barKegs[Math.floor(Math.random() * barKegs.length)]
    scannedRef.current = keg
    setStep('scan')
    setScanPhase('scanning')
    setTimeout(() => {
      setScanPhase('success')
      setSelectedKeg(keg.id)
      setTimeout(() => setStep('details'), 1200)
    }, 2200)
  }

  const submitManual = () => {
    if (manualRef.trim()) {
      setSelectedKeg(manualRef.trim().toUpperCase())
      setStep('details')
    }
  }

  const canSubmit = form.symptom && form.storage
  const kegInfo = barKegs.find(k => k.id === selectedKeg)

  if (step === 'identify') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>
          <h3 className="text-xl font-bold text-[#0F172A] mb-1">Signaler un fût défectueux</h3>
          <p className="text-gray-400 text-sm mb-6">Identifiez d'abord le fût concerné</p>

          {/* Scan CTA */}
          <button
            onClick={startScan}
            className="w-full flex items-center gap-4 p-4 border-2 border-[#10B981] rounded-xl mb-4 hover:bg-[#ECFDF5] transition-colors text-left"
          >
            <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M3 9V5a2 2 0 012-2h4M3 15v4a2 2 0 002 2h4M15 3h4a2 2 0 012 2v4M15 21h4a2 2 0 002-2v-4" strokeLinecap="round" />
                <rect x="7" y="7" width="4" height="4" rx="0.5" />
                <rect x="13" y="13" width="4" height="4" rx="0.5" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-[#0F172A]">Scanner le QR code</div>
              <div className="text-sm text-gray-400">Rapide et sans erreur de saisie</div>
            </div>
            <div className="ml-auto text-gray-300 text-lg">›</div>
          </button>

          {/* Manual entry */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="text-sm font-semibold text-[#0F172A] mb-2">Ou saisir la référence</div>
            <div className="flex gap-2">
              <input
                value={manualRef}
                onChange={e => setManualRef(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submitManual()}
                placeholder="Ex : KEG-0389"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#10B981]"
              />
              <button
                onClick={submitManual}
                disabled={!manualRef.trim()}
                className={`font-semibold px-4 py-2 rounded-lg text-sm transition-colors ${
                  manualRef.trim() ? 'bg-[#0F172A] text-white hover:bg-[#1E293B]' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'scan') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>
          {scanPhase === 'scanning' ? (
            <div className="text-center">
              <div className="font-bold text-[#0F172A] text-lg mb-5">Scannez le fût défectueux</div>
              <div className="relative w-52 h-52 mx-auto mb-5 rounded-xl overflow-hidden bg-[#0F172A]/5 border-2 border-[#EF4444]/30">
                <div className="absolute top-2 left-2 w-7 h-7 border-t-2 border-l-2 border-[#EF4444] rounded-tl" />
                <div className="absolute top-2 right-2 w-7 h-7 border-t-2 border-r-2 border-[#EF4444] rounded-tr" />
                <div className="absolute bottom-2 left-2 w-7 h-7 border-b-2 border-l-2 border-[#EF4444] rounded-bl" />
                <div className="absolute bottom-2 right-2 w-7 h-7 border-b-2 border-r-2 border-[#EF4444] rounded-br" />
                <div className="absolute left-4 right-4 h-0.5 bg-[#EF4444] shadow-lg animate-scan-line opacity-80" />
              </div>
              <p className="text-gray-400 text-sm">Placez le QR code dans le cadre</p>
            </div>
          ) : (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-[#10B981] font-bold text-lg mb-1">Fût identifié</div>
              <div className="font-mono font-bold text-[#0F172A] text-lg">{selectedKeg}</div>
              {scannedRef.current && <div className="text-gray-400 text-sm mt-0.5">{scannedRef.current.beer}</div>}
            </div>
          )}
        </div>
      </div>
    )
  }

  // step === 'details'
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>
        <div className="flex items-center gap-2 mb-5">
          <button onClick={() => setStep('identify')} className="text-gray-400 hover:text-[#0F172A] text-lg transition-colors">←</button>
          <h3 className="text-xl font-bold text-[#0F172A]">Détails de l'incident</h3>
        </div>

        {/* Identified keg */}
        <div className="bg-[#ECFDF5] border border-[#10B981]/20 rounded-xl px-4 py-3 mb-5 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="font-mono font-bold text-[#0F172A] text-sm">{selectedKeg}</div>
            {kegInfo && <div className="text-gray-400 text-xs">{kegInfo.beer}</div>}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1">Symptôme</label>
            <select
              value={form.symptom}
              onChange={e => setForm(f => ({ ...f, symptom: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            >
              <option value="">Choisir un symptôme...</option>
              {symptom_options.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1">Condition de stockage</label>
            <select
              value={form.storage}
              onChange={e => setForm(f => ({ ...f, storage: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            >
              <option value="">Choisir une condition...</option>
              {storage_options.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1">Notes (facultatif)</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Décrivez le problème..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] resize-none"
            />
          </div>
        </div>

        <button
          onClick={() => canSubmit && onSubmit()}
          disabled={!canSubmit}
          className={`w-full mt-5 font-bold py-3 rounded-xl text-sm transition-colors ${
            canSubmit ? 'bg-[#EF4444] hover:bg-[#DC2626] text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Envoyer le signalement
        </button>
      </div>
    </div>
  )
}

const offerTypeBadge = {
  promo: 'bg-[#10B981]/10 text-[#10B981]',
  exclusive: 'bg-purple-100 text-purple-700',
  loyalty: 'bg-[#F59E0B]/20 text-[#a06f0a]',
}
const offerTypeLabel = {
  promo: 'Promo',
  exclusive: 'Exclusif',
  loyalty: 'Fidélité',
}

export default function Bar() {
  const [showIncidentModal, setShowIncidentModal] = useState(false)
  const [showScanModal, setShowScanModal] = useState(false)
  const [toast, setToast] = useState(null)

  const [orderSent, setOrderSent] = useState(false)
  const [scanCount, setScanCount] = useState(bar.scan_count_month)
  const prevScanCount = useRef(bar.scan_count_month)

  const currentTier = scanCount >= 25 ? 'platinum' : scanCount >= 10 ? 'gold' : 'silver'
  const currentTierData = tiers[currentTier]

  const unlockedOffers = offers.filter(o => tierOrder[o.min_tier] <= tierOrder[currentTier])

  const handleScanComplete = (keg) => {
    setShowScanModal(false)
    prevScanCount.current = scanCount
    setScanCount(c => c + 1)
    setToast(`Scan #${scanCount + 1} enregistré — ${keg.id}`)
  }

  const handleOrder = () => {
    setOrderSent(true)
    setToast('Commande transmise à ' + brewery.name)
  }

  const handleIncidentSubmit = () => {
    setShowIncidentModal(false)
    setToast('Signalement envoyé à ' + brewery.name)
  }

  const kegStatusBadge = (status) => {
    if (status === 'flagged') return <span className="bg-[#EF4444]/10 text-[#EF4444] text-xs font-bold px-2 py-1 rounded-full">Incident</span>
    return <span className="bg-[#10B981]/10 text-[#10B981] text-xs font-bold px-2 py-1 rounded-full">En service</span>
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0F172A] shadow-lg">
        <div className="max-w-[480px] mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-white font-bold text-lg">Angel's Share</Link>
          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-sm">{bar.name}</span>
            <span className="bg-[#10B981] text-white text-xs font-bold px-2 py-1 rounded-full">
              {currentTierData.label}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-[480px] mx-auto px-4 pt-20 pb-12 space-y-6">

        {/* Scan CTA */}
        <div className="mt-4">
          <button
            onClick={() => setShowScanModal(true)}
            className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold py-4 rounded-2xl text-base transition-colors shadow-sm flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 9V5a2 2 0 012-2h4M3 15v4a2 2 0 002 2h4M15 3h4a2 2 0 012 2v4M15 21h4a2 2 0 002-2v-4" strokeLinecap="round" />
              <rect x="7" y="7" width="4" height="4" rx="0.5" />
              <rect x="13" y="13" width="4" height="4" rx="0.5" />
            </svg>
            Scanner un fût
          </button>
        </div>

        {/* Tier & progression */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-2xl font-extrabold text-[#0F172A]">{currentTierData.label}</div>
              <div className="text-gray-400 text-sm mt-0.5">{bar.city}</div>
            </div>
            <ScanCounter count={scanCount} prevCount={prevScanCount.current} />
          </div>
          <TierJourney scanCount={scanCount} currentTier={currentTier} />
        </div>

        {/* Offers */}
        <div>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">Vos offres</h2>
          {unlockedOffers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center text-gray-500 text-sm">
              Scannez vos livraisons pour débloquer vos premières offres
            </div>
          ) : (
            <div className="space-y-3">
              {unlockedOffers.map(offer => (
                <div key={offer.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="font-bold text-[#0F172A] text-sm">{offer.title}</div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${offerTypeBadge[offer.type]}`}>
                      {offerTypeLabel[offer.type]}
                    </span>
                  </div>
                  <div className="text-gray-500 text-sm mb-2">{offer.description}</div>
                  <div className="text-xs text-gray-400">Expire le {offer.expires}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Insights */}
        <div>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">Insights consommation</h2>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
            <div className="text-sm font-semibold text-[#0F172A] mb-3">Fûts écoulés par semaine</div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={insights.consumption_history} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => [v + ' fûts', 'Consommation']} />
                <Area type="monotone" dataKey="kegs" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={2.5} dot={{ r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 mb-4">
            {insights.top_references.map(ref => (
              <div key={ref.beer} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-[#0F172A] text-sm">{ref.beer}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Rotation : {ref.rotation_days}j</div>
                </div>
                <div className="text-right">
                  <TrendBadge trend={ref.trend} />
                  <div className="text-xs text-gray-400 mt-1">{ref.vs_similar_bars} vs bars similaires</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-sm text-blue-800">
            <strong>Recommandation Angel's Share</strong>
            <div className="mt-1 text-blue-700">{insights.recommendation}</div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="text-sm font-bold text-[#0F172A] mb-2">Commande suggérée</div>
            <div className="text-sm text-gray-600 mb-3">
              {insights.next_order_suggestion.map((s, i) => (
                <span key={s.beer}>
                  {i > 0 ? ', ' : ''}{s.qty}× {s.beer} {s.format}
                </span>
              ))}
            </div>
            {orderSent ? (
              <div className="text-center text-[#10B981] font-semibold text-sm py-2">Commande transmise !</div>
            ) : (
              <button
                onClick={handleOrder}
                className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                Commander
              </button>
            )}
          </div>
        </div>

        {/* Current stock */}
        <div>
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">Fûts en cave</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-gray-400 font-medium px-4 py-2.5 text-xs">ID</th>
                  <th className="text-left text-gray-400 font-medium px-2 py-2.5 text-xs">Bière</th>
                  <th className="text-left text-gray-400 font-medium px-2 py-2.5 text-xs hidden sm:table-cell">Format</th>
                  <th className="text-left text-gray-400 font-medium px-2 py-2.5 text-xs hidden sm:table-cell">Jours</th>
                  <th className="text-left text-gray-400 font-medium px-2 py-2.5 text-xs">Statut</th>
                </tr>
              </thead>
              <tbody>
                {barKegs.map(keg => (
                  <tr key={keg.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-[#0F172A]">{keg.id}</td>
                    <td className="px-2 py-3 text-xs text-gray-700">{keg.beer}</td>
                    <td className="px-2 py-3 text-xs text-gray-500 hidden sm:table-cell">{keg.format}</td>
                    <td className="px-2 py-3 text-xs font-semibold hidden sm:table-cell">
                      <span className={keg.days_out > 60 ? 'text-[#EF4444]' : keg.days_out > 30 ? 'text-[#F59E0B]' : 'text-gray-600'}>
                        {keg.days_out}j
                      </span>
                    </td>
                    <td className="px-2 py-3">{kegStatusBadge(keg.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Report incident */}
        <div>
          <button
            onClick={() => setShowIncidentModal(true)}
            className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold py-4 rounded-2xl text-base transition-colors shadow-sm"
          >
            Signaler un fût défectueux
          </button>
        </div>

        {/* Nav links */}
        <div className="pt-4 border-t border-gray-200 flex justify-center gap-6 text-sm">
          <Link to="/brewery" className="text-gray-400 hover:text-[#0F172A] transition-colors">Vue Brasseur</Link>
          <Link to="/distributor" className="text-gray-400 hover:text-[#0F172A] transition-colors">Vue Distributeur</Link>
          <Link to="/" className="text-gray-400 hover:text-[#0F172A] transition-colors">Landing</Link>
        </div>
      </div>

      {showScanModal && (
        <ScanModal
          onClose={() => setShowScanModal(false)}
          onScanned={handleScanComplete}
        />
      )}

      {showIncidentModal && (
        <IncidentModal
          onClose={() => setShowIncidentModal(false)}
          onSubmit={handleIncidentSubmit}
        />
      )}

      {toast && (
        <Toast message={toast} onDismiss={() => setToast(null)} />
      )}

      <AIPrompt getResponse={barAIResponse} insights={barInsights} />
    </div>
  )
}

function TrendBadge({ trend }) {
  if (trend === 'up') return <span className="bg-[#10B981]/10 text-[#10B981] text-xs font-bold px-2 py-0.5 rounded-full">↑</span>
  if (trend === 'down') return <span className="bg-[#EF4444]/10 text-[#EF4444] text-xs font-bold px-2 py-0.5 rounded-full">↓</span>
  return <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full">→</span>
}
