export const mockData = {
  users: [
    { id: "usr_brewery", role: "brewery", name: "Victor Maës", entity: "brs_001" },
    { id: "usr_distributor", role: "distributor", name: "Julie Rouquette", entity: "dist_001" },
    { id: "usr_bar", role: "bar", name: "Thomas Girard", entity: "bar_002" }
  ],
  brewery: {
    id: "brs_001",
    name: "Brasserie Le Singe Savant",
    city: "Lille",
    fleet_size: 342,
    deposit_amount: 30,
    return_rate_history: [
      { month: "Jan", rate: 94.2 }, { month: "Fév", rate: 94.8 },
      { month: "Mar", rate: 95.1 }, { month: "Avr", rate: 95.6 },
      { month: "Mai", rate: 96.2 }, { month: "Juin", rate: 96.8 }
    ]
  },
  distributor: {
    id: "dist_001",
    name: "Rouquette Distribution",
    city: "Île-de-France",
    kegs_held: 47,
    deposit_balance: 1410,
    scan_count_month: 58,
    tier: "platinum",
    rounds: [
      {
        id: "round_001",
        date: "2025-06-16",
        status: "scheduled",
        stops: [
          { bar_id: "bar_002", bar_name: "Ground Control", action: "deliver_and_collect", kegs: 5, overdue_returns: 2 },
          { bar_id: "bar_003", bar_name: "Le Pavillon des Canaux", action: "collect", kegs: 0, overdue_returns: 1 }
        ]
      }
    ],
    overdue_kegs: [
      { keg_id: "KEG-0205", bar_name: "Ground Control", days_out: 74, beer: "Double IPA" },
      { keg_id: "KEG-0100", bar_name: "Stock entrepôt", days_out: 35, beer: "Saison Fermière" }
    ],
    monthly_return_rate: [
      { month: "Jan", rate: 91 }, { month: "Fév", rate: 92 },
      { month: "Mar", rate: 93 }, { month: "Avr", rate: 94 },
      { month: "Mai", rate: 95 }, { month: "Juin", rate: 96 }
    ]
  },
  clients: [
    { id: "bar_002", name: "Ground Control", type: "bar", city: "Paris 12e", kegs_held: 24, deposit_balance: 720, scan_count_month: 31, tier: "platinum" },
    { id: "bar_003", name: "Le Pavillon des Canaux", type: "bar", city: "Paris 19e", kegs_held: 5, deposit_balance: 150, scan_count_month: 4, tier: "silver" },
    { id: "dist_001", name: "Rouquette Distribution", type: "distributor", city: "Île-de-France", kegs_held: 47, deposit_balance: 1410, scan_count_month: 58, tier: "platinum" }
  ],
  kegs: [
    { id: "KEG-0389", format: "30L", beer: "IPA Mosaic", lot: "LOT-2025-034", status: "at_client", holder: "bar_002", delivered_at: "2025-05-15", days_out: 30 },
    { id: "KEG-0390", format: "30L", beer: "IPA Mosaic", lot: "LOT-2025-034", status: "at_client", holder: "bar_002", delivered_at: "2025-05-15", days_out: 30 },
    { id: "KEG-0391", format: "20L", beer: "Session Blonde", lot: "LOT-2025-036", status: "at_client", holder: "bar_002", delivered_at: "2025-05-28", days_out: 17 },
    { id: "KEG-0256", format: "30L", beer: "Imperial Stout", lot: "LOT-2025-029", status: "flagged", holder: "bar_003", delivered_at: "2025-04-20", days_out: 55, incident_id: "INC-001" },
    { id: "KEG-0344", format: "30L", beer: "Witbier Classique", lot: "LOT-2025-033", status: "at_client", holder: "bar_003", delivered_at: "2025-06-08", days_out: 6 },
    { id: "KEG-0100", format: "30L", beer: "Saison Fermière", lot: "LOT-2025-030", status: "at_client", holder: "dist_001", delivered_at: "2025-05-10", days_out: 35 },
    { id: "KEG-0101", format: "20L", beer: "Pale Ale Citra", lot: "LOT-2025-035", status: "at_client", holder: "dist_001", delivered_at: "2025-05-22", days_out: 23 },
    { id: "KEG-0500", format: "30L", beer: "IPA Mosaic", lot: "LOT-2025-038", status: "at_brewery", holder: null, delivered_at: null, days_out: 0 },
    { id: "KEG-0501", format: "30L", beer: "Pale Ale Citra", lot: "LOT-2025-038", status: "at_brewery", holder: null, delivered_at: null, days_out: 0 },
    { id: "KEG-0502", format: "20L", beer: "Session Blonde", lot: "LOT-2025-038", status: "filled", holder: null, delivered_at: null, days_out: 0 },
    { id: "KEG-0205", format: "30L", beer: "Double IPA", lot: "LOT-2025-031", status: "at_client", holder: "bar_002", delivered_at: "2025-04-01", days_out: 74 },
    { id: "KEG-0206", format: "30L", beer: "Berliner Weisse Framboise", lot: "LOT-2025-032", status: "flagged", holder: "bar_002", delivered_at: "2025-05-20", days_out: 25, incident_id: "INC-002" },
    { id: "KEG-0118", format: "30L", beer: "Witbier Classique", lot: "LOT-2025-033", status: "at_client", holder: "dist_001", delivered_at: "2025-06-01", days_out: 13 },
    { id: "KEG-0503", format: "30L", beer: "Saison Fermière", lot: "LOT-2025-038", status: "at_brewery", holder: null, delivered_at: null, days_out: 0 },
    { id: "KEG-0504", format: "20L", beer: "Double IPA", lot: "LOT-2025-038", status: "filled", holder: null, delivered_at: null, days_out: 0 }
  ],
  incidents: [
    {
      id: "INC-001", keg_id: "KEG-0256", reported_by: "bar_003",
      reporter_name: "Le Pavillon des Canaux", symptom: "off_taste",
      symptom_label: "Goût altéré", storage_condition: "outdoor_sun",
      storage_label: "Extérieur — exposé au soleil",
      status: "open", created_at: "2025-06-10", days_open: 4,
      notes: "Goût acide prononcé, pas normal pour une stout",
      resolution_note: null
    },
    {
      id: "INC-002", keg_id: "KEG-0206", reported_by: "bar_002",
      reporter_name: "Ground Control", symptom: "excessive_foam",
      symptom_label: "Mousse excessive", storage_condition: "indoor_room",
      storage_label: "Intérieur — température ambiante",
      status: "in_progress", created_at: "2025-06-08", days_open: 6,
      notes: "Mousse excessive dès le premier tirage",
      resolution_note: "Remplacement prévu livraison du 16/06"
    }
  ],
  bar_insights: {
    bar_002: {
      top_references: [
        { beer: "IPA Mosaic", rotation_days: 4.2, trend: "up", vs_similar_bars: "+18%" },
        { beer: "Pale Ale Citra", rotation_days: 6.1, trend: "stable", vs_similar_bars: "+5%" },
        { beer: "Session Blonde", rotation_days: 8.3, trend: "down", vs_similar_bars: "-3%" }
      ],
      recommendation: "Votre IPA Mosaic tourne 18% plus vite que les bars similaires. Envisagez de passer à 2 fûts 30L par commande.",
      next_order_suggestion: [
        { beer: "IPA Mosaic", format: "30L", qty: 2 },
        { beer: "Pale Ale Citra", format: "30L", qty: 1 }
      ],
      consumption_history: [
        { week: "S-5", kegs: 18 }, { week: "S-4", kegs: 21 },
        { week: "S-3", kegs: 19 }, { week: "S-2", kegs: 24 },
        { week: "S-1", kegs: 27 }, { week: "Cette sem.", kegs: 31 }
      ]
    }
  },
  offers: [
    { id: "offer_001", title: "-10% sur la Pale Ale Citra", description: "Fût 30L à 135€ au lieu de 150€", min_tier: "silver", type: "promo", expires: "2025-06-30" },
    { id: "offer_002", title: "Avant-première : Berliner Weisse Framboise", description: "Accès avant-première, 12 fûts disponibles", min_tier: "gold", type: "exclusive", expires: "2025-07-15" },
    { id: "offer_003", title: "Livraison offerte", description: "Sur votre prochaine commande de 5 fûts ou plus", min_tier: "platinum", type: "loyalty", expires: "2025-06-30" }
  ],
  tiers: {
    silver: { label: "Silver", min_scans: 0, next_scans: 10, emoji: "🥈" },
    gold: { label: "Gold", min_scans: 10, next_scans: 25, emoji: "🥇" },
    platinum: { label: "Platinum", min_scans: 25, next_scans: null, emoji: "💎" }
  },
  symptom_options: [
    { value: "excessive_foam", label: "Mousse excessive" },
    { value: "off_taste", label: "Goût altéré" },
    { value: "leak", label: "Fuite" },
    { value: "flat", label: "Bière plate" },
    { value: "other", label: "Autre" }
  ],
  storage_options: [
    { value: "cellar", label: "Cave" },
    { value: "indoor_room", label: "Intérieur — température ambiante" },
    { value: "outdoor_shade", label: "Extérieur — à l'ombre" },
    { value: "outdoor_sun", label: "Extérieur — exposé au soleil" },
    { value: "refrigerated", label: "Réfrigéré" }
  ]
}
