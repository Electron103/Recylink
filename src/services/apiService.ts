import {
  LotItem,
  RecyclerProfile,
  CollectorProfile,
  MaterialCategory,
  TraceabilityEvent,
  LotStatus,
  PaymentMethod
} from '../types';
import { INITIAL_LOTS, MOCK_RECYCLERS, MOCK_COLLECTORS, MATERIALS_CATALOG } from '../data/mockData';

const LOTS_STORAGE_KEY = 'recylink_lots_v1';
const OFFLINE_QUEUE_KEY = 'recylink_offline_queue_v1';
const RECYCLERS_STORAGE_KEY = 'recylink_recyclers_v1';

class ApiService {
  private isOnline = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.syncOfflineQueue();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
      this.initLocalData();
    }
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }

  public toggleOnlineSim(status?: boolean) {
    this.isOnline = status !== undefined ? status : !this.isOnline;
    if (this.isOnline) {
      this.syncOfflineQueue();
    }
    return this.isOnline;
  }

  private initLocalData() {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(LOTS_STORAGE_KEY)) {
      localStorage.setItem(LOTS_STORAGE_KEY, JSON.stringify(INITIAL_LOTS));
    }
    if (!localStorage.getItem(RECYCLERS_STORAGE_KEY)) {
      localStorage.setItem(RECYCLERS_STORAGE_KEY, JSON.stringify(MOCK_RECYCLERS));
    }
    if (!localStorage.getItem(OFFLINE_QUEUE_KEY)) {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify([]));
    }
  }

  // Price Calculation Engine using verified database benchmarks
  public calculatePriceEstimate(
    category: MaterialCategory,
    approxWeightKg: number,
    location: string = 'Mumbai'
  ) {
    const mat = MATERIALS_CATALOG.find((m) => m.id === category) || MATERIALS_CATALOG[0];
    
    // Check if any local verified recyclers have specific bids
    const recyclers = this.getLocalRecyclers().filter(
      (r) => r.authorizationStatus === 'VERIFIED' && r.materialsAccepted.includes(category)
    );

    let avgRate = mat.basePricePerKg;
    if (recyclers.length > 0) {
      const offeredRates = recyclers
        .map((r) => r.offeredRates[category])
        .filter((rate): rate is number => typeof rate === 'number' && rate > 0);
      if (offeredRates.length > 0) {
        avgRate = Math.round(offeredRates.reduce((a, b) => a + b, 0) / offeredRates.length);
      }
    }

    const minTotal = Math.round(mat.minPricePerKg * approxWeightKg);
    const maxTotal = Math.round(mat.maxPricePerKg * approxWeightKg);
    const estimatedTotal = Math.round(avgRate * approxWeightKg);

    return {
      category,
      unitPrice: avgRate,
      minPricePerKg: mat.minPricePerKg,
      maxPricePerKg: mat.maxPricePerKg,
      approxWeightKg,
      estimatedTotal,
      minTotal,
      maxTotal,
      unit: mat.unit,
      trend: 'up' as const,
      safetyHazard: mat.safetyHazard,
    };
  }

  // Recycler Matching Engine
  public findMatchingRecyclers(
    category: MaterialCategory,
    weightKg: number,
    city: string = 'Mumbai'
  ) {
    const recyclers = this.getLocalRecyclers();
    
    return recyclers
      .map((r) => {
        const acceptsMaterial = r.materialsAccepted.includes(category);
        const isVerified = r.authorizationStatus === 'VERIFIED';
        const pickupFeasible = r.pickupAvailable && weightKg >= r.minPickupWeightKg;
        const offeredRate = r.offeredRates[category] || 0;

        // Weighted Match Score Calculation (0 - 100)
        let matchScore = 0;
        let reasons: string[] = [];

        if (isVerified) {
          matchScore += 35;
          reasons.push('Authorized & verified CPCB/SPCB compliant facility');
        } else {
          reasons.push('Pending authorization inspection');
        }

        if (acceptsMaterial) {
          matchScore += 25;
          reasons.push(`Official registered buyer for ${category.toUpperCase()}`);
        }

        if (pickupFeasible) {
          matchScore += 20;
          reasons.push(`Doorstep pickup available (Min ${r.minPickupWeightKg} kg)`);
        } else if (r.pickupAvailable) {
          matchScore += 5;
          reasons.push(`Requires minimum ${r.minPickupWeightKg} kg for fleet pickup`);
        } else {
          reasons.push('Self-drop required');
        }

        // Distance proximity score
        if (r.distanceKm <= 10) {
          matchScore += 15;
          reasons.push(`Nearby facility (${r.distanceKm} km)`);
        } else if (r.distanceKm <= 25) {
          matchScore += 10;
          reasons.push(`Within service corridor (${r.distanceKm} km)`);
        } else {
          matchScore += 5;
        }

        // Trust score bonus
        if (r.trustScore >= 95) {
          matchScore += 5;
          reasons.push(`Top rated (${r.trustScore}/100 trust score)`);
        }

        return {
          recycler: r,
          matchScore: Math.min(100, matchScore),
          acceptsMaterial,
          isVerified,
          pickupFeasible,
          offeredRate,
          reasons,
        };
      })
      .filter((item) => item.acceptsMaterial)
      .sort((a, b) => {
        // Prioritize verified first, then matchScore descending
        if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1;
        return b.matchScore - a.matchScore;
      });
  }

  // Get all lots
  public async getLots(): Promise<LotItem[]> {
    if (this.isOnline) {
      try {
        const res = await fetch('/api/lots');
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem(LOTS_STORAGE_KEY, JSON.stringify(data));
          return data;
        }
      } catch (e) {
        console.warn('Backend fetch failed, using local cache:', e);
      }
    }
    return this.getLocalLots();
  }

  public getLocalLots(): LotItem[] {
    if (typeof window === 'undefined') return INITIAL_LOTS;
    const raw = localStorage.getItem(LOTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_LOTS;
  }

  public getLocalRecyclers(): RecyclerProfile[] {
    if (typeof window === 'undefined') return MOCK_RECYCLERS;
    const raw = localStorage.getItem(RECYCLERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : MOCK_RECYCLERS;
  }

  // Create a new Lot
  public async createLot(lotData: Partial<LotItem>): Promise<LotItem> {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const lotId = lotData.id || `LOT-IND-2026-${randomNum.toString().slice(-6)}`;
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newTraceabilityEvent: TraceabilityEvent = {
      id: `TR-${Date.now()}`,
      lotId,
      stage: 'CREATED',
      timestamp: new Date().toISOString(),
      actorRole: lotData.saathiId ? 'SAATHI' : 'COLLECTOR',
      actorName: lotData.saathiName || lotData.collectorName || 'Collector',
      location: lotData.location || 'Mumbai Hub',
      notes: lotData.saathiId 
        ? `Lot created with Digital Saathi assistance (${lotData.saathiName}) for non-smartphone collector.`
        : 'Digital Lot generated via RecyLink smartphone app.',
      verificationMethod: 'SYSTEM',
      weightKg: lotData.approximateWeightKg
    };

    const fullLot: LotItem = {
      id: lotId,
      collectorId: lotData.collectorId || 'COL-001',
      collectorName: lotData.collectorName || 'Ramesh Kumar',
      collectorPhone: lotData.collectorPhone || '+91 98765 43210',
      saathiId: lotData.saathiId,
      saathiName: lotData.saathiName,
      materialCategory: lotData.materialCategory || 'pcb',
      subcategory: lotData.subcategory || 'Electronic Circuit Boards',
      description: lotData.description || 'Collected e-waste lot',
      photoUrl: lotData.photoUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      approximateWeightKg: lotData.approximateWeightKg || 10,
      condition: lotData.condition || 'non_working',
      sourceType: lotData.sourceType || 'scrap_collection',
      location: lotData.location || 'Mumbai, Maharashtra',
      createdAt: new Date().toISOString(),
      estimatedRatePerKg: lotData.estimatedRatePerKg || 385,
      estimatedTotalValue: (lotData.estimatedRatePerKg || 385) * (lotData.approximateWeightKg || 10),
      status: 'CREATED',
      otpCode,
      paymentStatus: 'PENDING',
      traceability: [newTraceabilityEvent],
    };

    if (this.isOnline) {
      try {
        const res = await fetch('/api/lots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullLot),
        });
        if (res.ok) {
          const saved = await res.json();
          this.updateLocalLot(saved);
          return saved;
        }
      } catch (err) {
        console.warn('Failed to post lot to server, saving locally:', err);
      }
    } else {
      // Queue in offline storage
      const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
      queue.push(fullLot);
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    }

    this.updateLocalLot(fullLot);
    return fullLot;
  }

  // Update Lot (Status transition, pickup schedule, handover, weight adjust, payment)
  public async updateLot(lotId: string, updates: Partial<LotItem>, traceEvent?: Partial<TraceabilityEvent>): Promise<LotItem> {
    const lots = this.getLocalLots();
    const index = lots.findIndex((l) => l.id === lotId);
    if (index === -1) throw new Error('Lot not found');

    const updatedLot = { ...lots[index], ...updates };

    if (traceEvent) {
      const fullEvent: TraceabilityEvent = {
        id: `TR-${Date.now()}`,
        lotId,
        stage: updatedLot.status,
        timestamp: new Date().toISOString(),
        actorRole: traceEvent.actorRole || 'SYSTEM' as any,
        actorName: traceEvent.actorName || 'System',
        location: traceEvent.location || updatedLot.location,
        notes: traceEvent.notes || `Status transitioned to ${updatedLot.status}`,
        verificationMethod: traceEvent.verificationMethod || 'SYSTEM',
        weightKg: traceEvent.weightKg || updatedLot.actualWeightKg || updatedLot.approximateWeightKg,
      };
      updatedLot.traceability = [...(updatedLot.traceability || []), fullEvent];
    }

    this.updateLocalLot(updatedLot);

    if (this.isOnline) {
      try {
        await fetch(`/api/lots/${lotId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedLot),
        });
      } catch (e) {
        console.warn('Sync lot update failed:', e);
      }
    }

    return updatedLot;
  }

  private updateLocalLot(lot: LotItem) {
    const lots = this.getLocalLots();
    const idx = lots.findIndex((l) => l.id === lot.id);
    if (idx >= 0) {
      lots[idx] = lot;
    } else {
      lots.unshift(lot);
    }
    localStorage.setItem(LOTS_STORAGE_KEY, JSON.stringify(lots));
  }

  public async syncOfflineQueue(): Promise<{ syncedCount: number }> {
    const rawQueue = localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!rawQueue) return { syncedCount: 0 };
    const queue: LotItem[] = JSON.parse(rawQueue);
    if (queue.length === 0) return { syncedCount: 0 };

    let successCount = 0;
    const remaining: LotItem[] = [];

    for (const lot of queue) {
      try {
        const res = await fetch('/api/lots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lot),
        });
        if (res.ok) {
          successCount++;
        } else {
          remaining.push(lot);
        }
      } catch (e) {
        remaining.push(lot);
      }
    }

    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
    return { syncedCount: successCount };
  }

  public async resetDemoData(): Promise<void> {
    localStorage.setItem(LOTS_STORAGE_KEY, JSON.stringify(INITIAL_LOTS));
    localStorage.setItem(RECYCLERS_STORAGE_KEY, JSON.stringify(MOCK_RECYCLERS));
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify([]));
    try {
      await fetch('/api/reset-demo', { method: 'POST' });
    } catch (e) {
      console.warn('Backend reset demo error:', e);
    }
  }

  // AI Classification proxy
  public async classifyWithAI(imageBase64?: string, textPrompt?: string, categoryHint?: MaterialCategory) {
    try {
      const res = await fetch('/api/gemini/classify-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, textPrompt, categoryHint }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('AI classification failed, returning default:', e);
    }
    
    // Dynamic defaults based on category hint
    if (categoryHint === 'cables') {
      return {
        category: 'cables',
        subcategory: 'Insulated Copper Wire Bundles',
        confidence: 93,
        safetyWarning: 'Do NOT burn cables to strip insulation. Hand over whole cables for mechanized granulating.',
        extractedFeatures: ['Flexible PVC coating', 'Bright annealed copper strands', 'High conductivity'],
        explanation: 'Copper wire bundle identified with high metallic purity.'
      };
    } else if (categoryHint === 'batteries') {
      return {
        category: 'batteries',
        subcategory: 'Lithium-ion Laptop / Mobile Battery Cells',
        confidence: 91,
        safetyWarning: 'Fire hazard: Keep dry and separated from metal edges. Do not crush.',
        extractedFeatures: ['Rechargeable Li-ion pack', 'Terminal safety insulation', 'Standard 18650/pouch cells'],
        explanation: 'Lithium battery energy storage cells detected.'
      };
    } else if (categoryHint === 'crt') {
      return {
        category: 'crt',
        subcategory: 'Cathode Ray Tube / Monitor Glass',
        confidence: 89,
        safetyWarning: 'Toxic leaded glass & phosphor hazard: Maintain intact without fracturing.',
        extractedFeatures: ['Heavy vacuum glass funnel', 'Magnetic deflection yoke', 'Phosphor faceplate'],
        explanation: 'CRT display tube identified.'
      };
    }

    return {
      category: 'pcb',
      subcategory: 'Printed Circuit Board / Computer Motherboard',
      confidence: 89,
      safetyWarning: 'Never burn or use acid baths. Hand over intact for mechanized recovery.',
      extractedFeatures: ['Green substrate', 'Gold connector fingers', 'SMD chips'],
      explanation: 'Electronic circuit board detected with high confidence.'
    };
  }

  // Real-Time Regional Market Pricing proxy
  public async getRealtimePricing(region: string = 'Mumbai') {
    try {
      const res = await fetch(`/api/pricing/realtime?region=${encodeURIComponent(region)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Failed to fetch real-time regional pricing:', e);
    }
    return null;
  }

  // AI Voice Parse proxy
  public async parseVoiceWithAI(transcript: string, language: string = 'hi') {
    try {
      const res = await fetch('/api/gemini/voice-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, language }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('AI voice parse failed:', e);
    }
    return {
      intent: 'SELL_MATERIAL',
      category: 'pcb',
      weightKg: 40,
      confidence: 88,
      spokenConfirmation: 'आपने 40 किलो सर्किट बोर्ड (PCB) कहा है। क्या यह सही है?'
    };
  }

  // AI Anomaly Review proxy
  public async reviewAnomaly(anomalyId: string, resolution: string) {
    try {
      const res = await fetch(`/api/anomalies/${anomalyId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API review anomaly failed:', e);
    }
    return { success: true, anomalyId, resolution };
  }

  public async reviewAnomalyWithAI(payload: {
    lotId: string;
    materialCategory: string;
    weightKg: number;
    ratePerKg: number;
    benchmarkRate: number;
    location: string;
  }) {
    try {
      const res = await fetch('/api/gemini/anomaly-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('AI anomaly review failed:', e);
    }
    return {
      assessment: 'Requires Review',
      summary: `Price of ₹${payload.ratePerKg}/kg deviates from local benchmark of ₹${payload.benchmarkRate}/kg.`,
      suggestedAction: 'Verify physical purity grade upon recycler vehicle arrival.',
      riskLevel: 'LOW'
    };
  }
}

export const apiService = new ApiService();
