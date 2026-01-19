import { HRVReading, HRVStatus, HRVTrend } from '../types';

// Track previous value for realistic trends
let previousValue = 45;

/**
 * Generate a realistic HRV reading
 * Simulates gradual trends with occasional spikes/drops
 */
export function generateHRVReading(prevReading?: HRVReading): HRVReading {
  const prev = prevReading?.value ?? previousValue;

  // Gradual trend: ±3ms from previous (realistic variation)
  let newValue = prev + (Math.random() * 6 - 3);

  // Occasional spike or drop (10% chance) - simulates stress events or deep relaxation
  if (Math.random() < 0.1) {
    const isSpike = Math.random() < 0.5;
    newValue += isSpike ? -15 : 10;
  }

  // Clamp to realistic range (20-80ms)
  newValue = Math.max(20, Math.min(80, newValue));
  newValue = Math.round(newValue);

  // Update tracking value
  previousValue = newValue;

  // Device connection simulation (90% connected, 10% disconnection events)
  const deviceConnected = Math.random() > 0.1;

  return {
    value: newValue,
    timestamp: new Date().toISOString(),
    status: calculateStatus(newValue),
    deviceConnected,
  };
}

/**
 * Calculate HRV status based on value
 * Red: <30ms (stress/anxiety)
 * Green: 30-60ms (normal/healthy)
 * Blue: >60ms (relaxed)
 */
export function calculateStatus(value: number): HRVStatus {
  if (value < 30) return 'low';
  if (value > 60) return 'high';
  return 'normal';
}

/**
 * Calculate trend based on recent readings
 */
export function calculateTrend(readings: HRVReading[]): HRVTrend {
  if (readings.length < 3) return 'stable';

  const last3 = readings.slice(-3);
  const values = last3.map(r => r.value);
  const first = values[0];
  const last = values[values.length - 1];
  const diff = last - first;

  // Significant change threshold: 3ms
  if (diff > 3) return 'up';
  if (diff < -3) return 'down';
  return 'stable';
}

/**
 * Reset simulator (useful for testing)
 */
export function resetSimulator(startValue: number = 45): void {
  previousValue = startValue;
}

/**
 * Generate HRV reading for a specific zone (manual override mode)
 * Values have slight variation for realistic appearance on charts
 */
export function generateManualReading(zone: HRVStatus): HRVReading {
  let baseValue: number;
  let variation: number;

  switch (zone) {
    case 'low':
      baseValue = 25;
      variation = 3;
      break;
    case 'normal':
      baseValue = 45;
      variation = 5;
      break;
    case 'high':
      baseValue = 70;
      variation = 5;
      break;
  }

  // Add slight random variation for realistic chart appearance
  const newValue = Math.round(baseValue + (Math.random() * variation * 2 - variation));
  const clampedValue = Math.max(20, Math.min(80, newValue));

  // Update tracking value for continuity if switching back to auto mode
  previousValue = clampedValue;

  return {
    value: clampedValue,
    timestamp: new Date().toISOString(),
    status: zone,
    deviceConnected: true, // Always connected in manual mode
  };
}

/**
 * Calculate session metrics from readings
 */
export function calculateMetrics(readings: HRVReading[]): {
  avgHRV: number;
  minHRV: number;
  maxHRV: number;
  hrvVariability: number;
} {
  if (readings.length === 0) {
    return { avgHRV: 0, minHRV: 0, maxHRV: 0, hrvVariability: 0 };
  }

  const values = readings.map(r => r.value);
  const sum = values.reduce((a, b) => a + b, 0);
  const avgHRV = Math.round(sum / values.length);
  const minHRV = Math.min(...values);
  const maxHRV = Math.max(...values);

  // Calculate standard deviation (variability)
  const variance = values.reduce((sum, val) => sum + Math.pow(val - avgHRV, 2), 0) / values.length;
  const hrvVariability = Math.round(Math.sqrt(variance) * 10) / 10;

  return { avgHRV, minHRV, maxHRV, hrvVariability };
}
