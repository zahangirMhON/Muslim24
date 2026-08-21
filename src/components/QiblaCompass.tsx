import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Navigation,
  MapPin,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Info,
  Crosshair,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  Layers,
  Sliders,
  Check,
  Sun,
  Sunrise,
  Sunset,
  Globe,
  HelpCircle,
  Eye
} from 'lucide-react';
import { Language, BDLocation } from '../types';
import { translations } from '../locales/translations';
import { BANGLADESH_LOCATIONS, toBengaliDigits } from '../utils/bengaliUtils';

interface QiblaCompassProps {
  lang: Language;
  locationName?: string;
}

// Exact Makkah Kaaba Coordinates (Al-Masjid Al-Haram, Saudi Arabia)
const KAABA_LAT = 21.422487;
const KAABA_LNG = 39.826206;

/**
 * Calculates exact Great Circle Qibla forward azimuth bearing from user's lat & lng
 * @returns Degree from True North (0° - 360°)
 */
export function calculatePreciseQiblaBearing(lat: number, lng: number): number {
  const kaabaLatRad = KAABA_LAT * (Math.PI / 180);
  const kaabaLngRad = KAABA_LNG * (Math.PI / 180);
  const userLatRad = lat * (Math.PI / 180);
  const userLngRad = lng * (Math.PI / 180);

  const deltaLng = kaabaLngRad - userLngRad;
  const y = Math.sin(deltaLng) * Math.cos(kaabaLatRad);
  const x =
    Math.cos(userLatRad) * Math.sin(kaabaLatRad) -
    Math.sin(userLatRad) * Math.cos(kaabaLatRad) * Math.cos(deltaLng);

  const qiblaRad = Math.atan2(y, x);
  const qiblaDeg = ((qiblaRad * 180) / Math.PI + 360) % 360;
  return Number(qiblaDeg.toFixed(1));
}

/**
 * Calculates Great Circle distance to Kaaba in kilometers (Haversine formula)
 */
export function calculateKaabaDistanceKm(lat: number, lng: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((KAABA_LAT - lat) * Math.PI) / 180;
  const dLng = ((KAABA_LNG - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((KAABA_LAT * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Finds the closest Bangladesh district for a given lat/lng
 */
function findNearestDistrict(lat: number, lng: number): BDLocation {
  let closest = BANGLADESH_LOCATIONS[0];
  let minDistance = Infinity;

  for (const loc of BANGLADESH_LOCATIONS) {
    const dLat = loc.lat - lat;
    const dLng = loc.lng - lng;
    const distSq = dLat * dLat + dLng * dLng;
    if (distSq < minDistance) {
      minDistance = distSq;
      closest = loc;
    }
  }
  return closest;
}

export const QiblaCompass: React.FC<QiblaCompassProps> = ({ lang, locationName }) => {
  const t = translations[lang];

  // Default to Kushtia (or provided locationName if matched)
  const initialDistrict = (() => {
    try {
      const saved = localStorage.getItem('qibla_selected_district');
      if (saved) return saved;
    } catch (e) {}
    if (locationName) return locationName;
    return 'কুষ্টিয়া';
  })();

  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict);
  const [qiblaDegree, setQiblaDegree] = useState<number>(277.1); // Kushtia default: ~277.1°
  const [kaabaDistance, setKaabaDistance] = useState<number>(5047);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: 23.9013,
    lng: 89.1204
  }); // Kushtia coords

  // Sensor Inversion Setting (to fix devices where Alpha rotates counter-clockwise or inverted)
  const [isInvertedSensor, setIsInvertedSensor] = useState<boolean>(() => {
    try {
      return localStorage.getItem('qibla_sensor_inverted') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Compass heading and sensor states
  const [rawHeading, setRawHeading] = useState<number | null>(null);
  const [smoothedHeading, setSmoothedHeading] = useState<number>(0);
  const [sensorStatus, setSensorStatus] = useState<'idle' | 'active' | 'denied' | 'unsupported'>('idle');
  const [sensorType, setSensorType] = useState<'absolute' | 'webkit' | 'standard' | 'manual'>('manual');
  
  // GPS & Location States
  const [isFetchingGps, setIsFetchingGps] = useState<boolean>(false);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);
  const [gpsAccuracyMeters, setGpsAccuracyMeters] = useState<number | null>(null);
  const [useGps, setUseGps] = useState<boolean>(false);
  const [locationSource, setLocationSource] = useState<'preset' | 'gps' | 'ip'>('preset');

  // Manual fallback & Calibration
  const [manualHeading, setManualHeading] = useState<number>(277);
  const [showCalibrationHelp, setShowCalibrationHelp] = useState<boolean>(false);
  const [showSunReference, setShowSunReference] = useState<boolean>(true);
  const [isAligned, setIsAligned] = useState<boolean>(false);
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(true);
  const [compassViewMode, setCompassViewMode] = useState<'dial' | 'pointer'>('dial');

  // Low-pass filter refs
  const lastHeadingRef = useRef<number>(0);
  const hasVibratedRef = useRef<boolean>(false);
  const hasAbsoluteSensorRef = useRef<boolean>(false);

  // Load saved location on mount
  useEffect(() => {
    try {
      const savedGps = localStorage.getItem('qibla_custom_gps');
      if (savedGps) {
        const parsed = JSON.parse(savedGps);
        if (parsed?.lat && parsed?.lng) {
          setCurrentCoords({ lat: parsed.lat, lng: parsed.lng });
          const bearing = calculatePreciseQiblaBearing(parsed.lat, parsed.lng);
          const dist = calculateKaabaDistanceKm(parsed.lat, parsed.lng);
          setQiblaDegree(bearing);
          setKaabaDistance(dist);
          setUseGps(true);
          setLocationSource('gps');
          return;
        }
      }
    } catch (e) {}

    // Find district coordinates (Default Kushtia)
    const loc =
      BANGLADESH_LOCATIONS.find(
        (l) =>
          l.districtBn === selectedDistrict ||
          l.district.toLowerCase() === selectedDistrict.toLowerCase()
      ) || BANGLADESH_LOCATIONS.find((l) => l.districtBn === 'কুষ্টিয়া') || BANGLADESH_LOCATIONS[0];

    if (loc) {
      setCurrentCoords({ lat: loc.lat, lng: loc.lng });
      const bearing = calculatePreciseQiblaBearing(loc.lat, loc.lng);
      const dist = calculateKaabaDistanceKm(loc.lat, loc.lng);
      setQiblaDegree(bearing);
      setKaabaDistance(dist);
    }
  }, [selectedDistrict]);

  // Handle District Selection
  const handleSelectDistrict = (districtBn: string) => {
    setSelectedDistrict(districtBn);
    setUseGps(false);
    setLocationSource('preset');
    setGpsStatusMessage(null);
    try {
      localStorage.setItem('qibla_selected_district', districtBn);
      localStorage.removeItem('qibla_custom_gps');
    } catch (e) {}

    const loc = BANGLADESH_LOCATIONS.find((l) => l.districtBn === districtBn);
    if (loc) {
      setCurrentCoords({ lat: loc.lat, lng: loc.lng });
      const bearing = calculatePreciseQiblaBearing(loc.lat, loc.lng);
      const dist = calculateKaabaDistanceKm(loc.lat, loc.lng);
      setQiblaDegree(bearing);
      setKaabaDistance(dist);
    }
  };

  // 1-Click Select Kushtia (Khulna)
  const handleSelectKushtia = () => {
    handleSelectDistrict('কুষ্টিয়া');
  };

  // Toggle Sensor Direction Inversion (fixes East/West swapped on some Android browsers)
  const toggleSensorInversion = () => {
    const nextVal = !isInvertedSensor;
    setIsInvertedSensor(nextVal);
    try {
      localStorage.setItem('qibla_sensor_inverted', String(nextVal));
    } catch (e) {}
  };

  // Robust GPS Geolocation Fetch with IP Network Fallback
  const handleFetchGpsLocation = async () => {
    setIsFetchingGps(true);
    setGpsStatusMessage('জিপিএস স্যাটেলাইট সংযোগ অনুসন্ধান করা হচ্ছে...');

    const applyCoords = (lat: number, lng: number, accuracy: number | null, source: 'gps' | 'ip', customName?: string) => {
      setCurrentCoords({ lat, lng });
      setGpsAccuracyMeters(accuracy);

      const nearest = findNearestDistrict(lat, lng);
      setSelectedDistrict(nearest.districtBn);
      setUseGps(true);
      setLocationSource(source);

      const bearing = calculatePreciseQiblaBearing(lat, lng);
      const dist = calculateKaabaDistanceKm(lat, lng);
      setQiblaDegree(bearing);
      setKaabaDistance(dist);

      try {
        localStorage.setItem('qibla_custom_gps', JSON.stringify({ lat, lng, districtBn: nearest.districtBn }));
        localStorage.setItem('qibla_selected_district', nearest.districtBn);
      } catch (e) {}

      setIsFetchingGps(false);
      const accText = accuracy ? ` (±${toBengaliDigits(accuracy)} মি.)` : '';
      setGpsStatusMessage(`✅ অবস্থান নির্ণয় সফল! নিকটস্থ জেলা: ${nearest.districtBn} (${nearest.divisionBn})${accText}`);
    };

    // IP Geolocation Fallback
    const tryIpGeolocation = async () => {
      try {
        setGpsStatusMessage('স্যাটেলাইট সংযোগ বিলম্বিত হচ্ছে, নেটওয়ার্ক আইপি লোকেশন চেক করা হচ্ছে...');
        const res = await fetch('https://ipapi.co/json/', { cache: 'no-cache' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.latitude && data.longitude) {
            applyCoords(data.latitude, data.longitude, 1000, 'ip', data.city);
            return;
          }
        }
      } catch (e) {
        console.warn('IP location fetch fallback error:', e);
      }

      // If all failed, default to Kushtia (Khulna) with guidance
      setIsFetchingGps(false);
      handleSelectKushtia();
      setGpsStatusMessage('জিপিএস বা নেটওয়ার্ক লোকেশন অনুপলব্ধ। কুষ্টিয়া জেলা (খুলনা) এর নির্ভুল স্থানাঙ্ক স্বয়ংক্রিয়ভাবে লোড করা হয়েছে।');
    };

    if (!navigator.geolocation) {
      await tryIpGeolocation();
      return;
    }

    const onGpsSuccess = (position: GeolocationPosition) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const accuracy = Math.round(position.coords.accuracy || 0);
      applyCoords(lat, lng, accuracy, 'gps');
    };

    const onGpsError = (err: GeolocationPositionError) => {
      console.warn('High accuracy GPS error, trying low accuracy...', err);
      navigator.geolocation.getCurrentPosition(
        onGpsSuccess,
        async (fallbackError) => {
          console.warn('Standard GPS failed, trying IP fallback:', fallbackError);
          await tryIpGeolocation();
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
      );
    };

    navigator.geolocation.getCurrentPosition(onGpsSuccess, onGpsError, {
      enableHighAccuracy: true,
      timeout: 7000,
      maximumAge: 0
    });
  };

  // Device Orientation Listener & Inversion-Safe Angle Processor
  const initCompassSensor = async () => {
    if (typeof window === 'undefined') return;

    if (!('DeviceOrientationEvent' in window)) {
      setSensorStatus('unsupported');
      setSensorType('manual');
      return;
    }

    try {
      // iOS 13+ Safari Permission Request
      const requestPermission = (DeviceOrientationEvent as any).requestPermission;
      if (typeof requestPermission === 'function') {
        const response = await requestPermission();
        if (response !== 'granted') {
          setSensorStatus('denied');
          return;
        }
      }

      const handleOrientation = (e: DeviceOrientationEvent) => {
        let heading: number | null = null;
        let type: 'absolute' | 'webkit' | 'standard' = 'standard';

        // 1. iOS Safari (webkitCompassHeading) - 0° is Magnetic North directly (clockwise)
        if ((e as any).webkitCompassHeading !== undefined && (e as any).webkitCompassHeading !== null) {
          const webkitHeading = Number((e as any).webkitCompassHeading);
          heading = isInvertedSensor ? (360 - webkitHeading + 360) % 360 : webkitHeading;
          type = 'webkit';
        }
        // 2. Android Chrome Absolute Orientation
        else if (e.alpha !== null) {
          let screenAngle = 0;
          if (typeof window.screen?.orientation?.angle === 'number') {
            screenAngle = window.screen.orientation.angle;
          } else if (typeof (window as any).orientation === 'number') {
            screenAngle = (window as any).orientation;
          }

          const alpha = Number(e.alpha);
          
          // Standard W3C: alpha is counter-clockwise (0° North, 90° West, 270° East) -> heading = 360 - alpha
          // Inverted/Alternate Android drivers: alpha is clockwise -> heading = alpha
          if (isInvertedSensor) {
            heading = (alpha + screenAngle + 360) % 360;
          } else {
            heading = (360 - alpha + screenAngle + 360) % 360;
          }

          if (e.absolute) {
            hasAbsoluteSensorRef.current = true;
            type = 'absolute';
          } else {
            type = 'standard';
          }
        }

        if (heading !== null && !isNaN(heading)) {
          const raw = (heading + 360) % 360;
          setRawHeading(raw);
          setSensorStatus('active');
          setSensorType(type);

          // Angle-Safe Exponential Smoothing (handles 359° <-> 0° boundary seamlessly)
          const prev = lastHeadingRef.current;
          let diff = raw - prev;
          while (diff < -180) diff += 360;
          while (diff > 180) diff -= 360;

          // Responsive smoothing factor
          const smoothed = (prev + diff * 0.4 + 360) % 360;
          lastHeadingRef.current = smoothed;
          setSmoothedHeading(Number(smoothed.toFixed(1)));
        }
      };

      // Prioritize deviceorientationabsolute on Android
      window.addEventListener('deviceorientationabsolute', handleOrientation as any, true);
      window.addEventListener('deviceorientation', (e) => {
        // If absolute orientation is already active, don't let relative event overwrite it
        if (!hasAbsoluteSensorRef.current) {
          handleOrientation(e);
        }
      }, true);

      setSensorStatus('active');
    } catch (err) {
      console.error('Compass sensor initialization error:', err);
      setSensorStatus('denied');
    }
  };

  useEffect(() => {
    initCompassSensor();
  }, [isInvertedSensor]);

  // Effective Heading: Sensor smoothed heading or Manual Slider Heading
  const currentHeading = sensorStatus === 'active' ? smoothedHeading : manualHeading;

  // Relative angle from current phone top heading to Kaaba
  // 0° = User is pointing directly at Kaaba
  const relativeAngle = (qiblaDegree - currentHeading + 360) % 360;

  // Shortest turn angle to Kaaba (-180° to +180°)
  // Positive = Turn Right (ডানে), Negative = Turn Left (বামে)
  let turnOffset = relativeAngle > 180 ? relativeAngle - 360 : relativeAngle;
  const absOffset = Math.abs(turnOffset);

  // Check alignment within ±3.5 degrees
  useEffect(() => {
    const alignedNow = absOffset <= 3.5;
    setIsAligned(alignedNow);

    if (alignedNow) {
      if (!hasVibratedRef.current && hapticEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([100, 50, 100]);
        } catch (e) {}
        hasVibratedRef.current = true;
      }
    } else {
      hasVibratedRef.current = false;
    }
  }, [absOffset, hapticEnabled]);

  return (
    <div
      id="qibla-compass-section"
      className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-emerald-600/60 relative overflow-hidden space-y-5"
    >
      {/* Background Decorative Lighting */}
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-amber-400/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-emerald-800/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border-2 border-amber-400/60 flex items-center justify-center text-amber-300 text-2xl shadow-lg shadow-amber-950/40">
            <Compass className="w-7 h-7 text-amber-300 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-amber-200 tracking-wide">
                ডিজিটাল কিবলা কম্পাস ও ক্বাবা দিকনির্দেশ
              </h2>
            </div>
            <p className="text-xs text-emerald-200/90 font-medium mt-0.5">
              স্যাটেলাইট জিপিএস, ম্যাগনেটিক সেন্সর ও সূর্য সূর্যাস্ত ভিত্তিক ১০০% নির্ভুল ক্বাবা অবস্থান
            </p>
          </div>
        </div>

        {/* Quick Kushtia & Location Badges */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
          <button
            type="button"
            onClick={handleSelectKushtia}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md ${
              selectedDistrict === 'কুষ্টিয়া' && locationSource === 'preset'
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                : 'bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-amber-400/40'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>কুষ্টিয়া (খুলনা)</span>
            {selectedDistrict === 'কুষ্টিয়া' && locationSource === 'preset' && <Check className="w-3.5 h-3.5" />}
          </button>

          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-emerald-600/70 text-xs font-bold text-emerald-200 flex items-center gap-1.5 shadow-sm">
            <span>🕋 কিবলা:</span>
            <span className="text-amber-300 font-black font-mono text-sm">{toBengaliDigits(qiblaDegree)}°</span>
          </div>
        </div>
      </div>

      {/* LOCATION SELECTION & GPS CONTROLS */}
      <div className="bg-black/40 rounded-2xl p-3 sm:p-4 border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* District Picker */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>বর্তমান জেলা:</span>
            </span>

            <select
              value={selectedDistrict}
              onChange={(e) => handleSelectDistrict(e.target.value)}
              className="bg-emerald-950 border border-emerald-600/80 rounded-xl px-3 py-1.5 text-xs text-amber-200 font-bold outline-none cursor-pointer hover:border-amber-400 transition"
            >
              {BANGLADESH_LOCATIONS.map((loc, idx) => (
                <option key={`${loc.districtBn}-${idx}`} value={loc.districtBn}>
                  {loc.districtBn} ({loc.divisionBn}) — {loc.district}
                </option>
              ))}
            </select>
          </div>

          {/* GPS Auto-detect Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isFetchingGps}
              onClick={handleFetchGpsLocation}
              className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                locationSource === 'gps' || locationSource === 'ip'
                  ? 'bg-teal-400 text-slate-950 ring-2 ring-teal-200'
                  : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white border border-teal-400/50'
              }`}
            >
              <Crosshair className={`w-4 h-4 ${isFetchingGps ? 'animate-spin' : ''}`} />
              <span>{isFetchingGps ? 'জিপিএস / নেটওয়ার্ক সংযোগ হচ্ছে...' : locationSource === 'gps' ? '📍 লাইভ GPS সক্রিয়' : locationSource === 'ip' ? '🌐 নেটওয়ার্ক লোকেশন সক্রিয়' : 'জিপিএস দিয়ে কিবলা নির্ণয় করুন'}</span>
            </button>
          </div>
        </div>

        {/* GPS Status Message Strip */}
        {gpsStatusMessage && (
          <div className="text-xs p-2.5 rounded-xl bg-teal-950/80 border border-teal-500/50 text-teal-200 flex items-center justify-between gap-2 flex-wrap">
            <span>{gpsStatusMessage}</span>
            <span className="font-mono text-[11px] bg-teal-900/80 px-2 py-0.5 rounded text-teal-300 shrink-0">
              {currentCoords.lat.toFixed(4)}° N, {currentCoords.lng.toFixed(4)}° E
            </span>
          </div>
        )}

        {/* Location Technical Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-emerald-200/90 border-t border-white/10">
          <div className="bg-emerald-950/50 p-2 rounded-xl border border-white/5">
            <span className="text-gray-400 block">নির্বাচিত স্থান:</span>
            <span className="font-bold text-amber-300 text-xs">{selectedDistrict} ({locationSource === 'gps' ? 'GPS' : locationSource === 'ip' ? 'IP' : 'খুলনা/বিভাগ'})</span>
          </div>
          <div className="bg-emerald-950/50 p-2 rounded-xl border border-white/5">
            <span className="text-gray-400 block">কিবলা কোণ (দিক):</span>
            <span className="font-bold text-emerald-300 font-mono text-xs">{toBengaliDigits(qiblaDegree)}° (পশ্চিম-উত্তর)</span>
          </div>
          <div className="bg-emerald-950/50 p-2 rounded-xl border border-white/5">
            <span className="text-gray-400 block">মক্কার দূরত্ব:</span>
            <span className="font-bold text-amber-300 font-mono text-xs">{toBengaliDigits(kaabaDistance)} কি.মি.</span>
          </div>
          <div className="bg-emerald-950/50 p-2 rounded-xl border border-white/5">
            <span className="text-gray-400 block">সেন্সর ডিরেকশন:</span>
            <span className="font-bold text-teal-300 text-xs">
              {isInvertedSensor ? '🔄 রিভার্স মোড' : 'নরমাল মোড ✓'}
            </span>
          </div>
        </div>
      </div>

      {/* SENSOR CONTROLS & REVERSE/FLIP TOGGLE STRIP */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs p-3 rounded-2xl bg-black/40 border border-white/10">
        <div className="flex items-center gap-2">
          {sensorStatus === 'active' ? (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-300 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>মোবাইল কম্পাস সেন্সর সক্রিয় (হেডিং: <span className="font-mono text-amber-300">{toBengaliDigits(Math.round(currentHeading))}°</span>)</span>
              </span>
            </div>
          ) : (
            <div className="text-amber-300 font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
              <span>মোবাইল সেন্সর সচল করতে 'সেন্সর সক্রিয়' চাপুন অথবা নিচের স্লাইডার ঘুরান।</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* CRITICAL FIX: Sensor Inversion / Flip Direction Button */}
          <button
            type="button"
            onClick={toggleSensorInversion}
            title="যদি আপনার ফোনে পূর্ব ও পশ্চিম উল্টো মনে হয়, তবে এই বাটনে চাপ দিন"
            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md ${
              isInvertedSensor
                ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                : 'bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 border border-amber-400/50'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isInvertedSensor ? '🔄 সেন্সর রিভার্স করা আছে (স্বাভাবিক করতে চাপুন)' : '🔄 পূর্ব-পশ্চিম উল্টো হলে এখানে চাপুন'}</span>
          </button>

          <button
            type="button"
            onClick={initCompassSensor}
            className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-emerald-600 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
            <span>সেন্সর রিফ্রেশ</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCalibrationHelp(!showCalibrationHelp)}
            className="px-3 py-1.5 rounded-xl bg-black/50 hover:bg-emerald-900 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-amber-400/40"
          >
            <Info className="w-3.5 h-3.5" />
            <span>৮-শেপ ক্যালিব্রেশন</span>
          </button>
        </div>
      </div>

      {/* SUNSET & ISLAMIC HORIZON REFERENCE CARD */}
      <div className="bg-gradient-to-r from-amber-950/60 via-emerald-950/80 to-slate-950 p-3.5 sm:p-4 rounded-2xl border border-amber-400/50 text-xs space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-black text-amber-300 text-sm">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>সূর্যোদয়, সূর্যাস্ত ও কুষ্টিয়ার ক্বাবা দিক নির্দেশিকা:</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/60 border border-amber-400/30 text-amber-200 font-mono">
            কুষ্টিয়া কিবলা: ২৭৭.১°
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-black/40 p-2.5 rounded-xl border border-white/10 flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
              <Sunrise className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-amber-300 block">পূর্ব দিক (৯০°)</span>
              <p className="text-[11px] text-gray-300">যেদিকে প্রতিদিন সকালে সূর্য ওঠে (সূর্যোদয়)।</p>
            </div>
          </div>

          <div className="bg-black/40 p-2.5 rounded-xl border border-white/10 flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-500/20 text-orange-300">
              <Sunset className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-orange-300 block">পশ্চিম দিক (২৭০°)</span>
              <p className="text-[11px] text-gray-300">যেদিকে প্রতিদিন বিকেলে সূর্য অস্ত যায় (সূর্যাস্ত)।</p>
            </div>
          </div>

          <div className="bg-black/40 p-2.5 rounded-xl border border-amber-400/40 flex items-center gap-2.5 bg-amber-950/30">
            <div className="p-2 rounded-lg bg-amber-400/20 text-amber-300 text-lg">
              🕋
            </div>
            <div>
              <span className="font-black text-amber-300 block">পবিত্র ক্বাবা শরীফ (২৭৭.১°)</span>
              <p className="text-[11px] text-emerald-200">সূর্যাস্তের পশ্চিম দিক থেকে মাত্র ৭° ডান দিকে (উত্তর)।</p>
            </div>
          </div>
        </div>
      </div>

      {/* CALIBRATION GUIDE ACCORDION */}
      {showCalibrationHelp && (
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 p-4 rounded-2xl border border-amber-400/60 text-xs text-emerald-100 space-y-3 animate-fade-in shadow-xl">
          <div className="font-bold text-amber-300 flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>মোবাইল কম্পাস সেন্সর নিখুঁত করার নিয়ম (৮-শেপ ক্যালিব্রেশন):</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-emerald-200">
            <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1">
              <span className="font-bold text-amber-300 block">১. সোজা ও সমতল রাখুন</span>
              <p>মোবাইল ফোনটি আপনার হাতের তালুতে অথবা টেবিলের উপর সমতলভাবে (Flat) সোজা রাখুন।</p>
            </div>
            <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1">
              <span className="font-bold text-amber-300 block">২. বাতাসে '8' ঘুরান</span>
              <p>ফোনটি হাতে নিয়ে বাতাসে ইংরেজি <strong>'8' (আট)</strong> অক্ষরের মত ২-৩ বার ঘুরিয়ে আনুন।</p>
            </div>
            <div className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1">
              <span className="font-bold text-amber-300 block">৩. মেটাল বা চুম্বক দূরে রাখুন</span>
              <p>মোবাইলের কভারে মেটাল রিং বা ম্যাগনেটিক ওয়াললেট থাকলে সেন্সর ভুল দিক দেখাতে পারে, তা সরিয়ে নিন।</p>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC TURN GUIDANCE BANNER */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <div
          className={`w-full max-w-lg px-4 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 transition-all shadow-xl ${
            isAligned
              ? 'bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-300 text-slate-950 ring-4 ring-amber-300/60 shadow-amber-400/30 animate-pulse'
              : absOffset <= 20
              ? 'bg-teal-500 text-slate-950 ring-2 ring-teal-300'
              : 'bg-black/60 text-amber-300 border border-amber-400/40'
          }`}
        >
          {isAligned ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-slate-950 fill-emerald-200" />
              <span>✅ মাশাআল্লাহ! আপনি সরাসরি ক্বাবা শরীফের মুখোমুখি আছেন ({toBengaliDigits(qiblaDegree)}° কুষ্টিয়া)</span>
            </>
          ) : turnOffset > 0 ? (
            <>
              <ArrowRight className="w-5 h-5 text-amber-400 animate-bounce" />
              <span>ডান দিকে {toBengaliDigits(Math.round(absOffset))}° ঘুরুন (ক্বাবার দিকে যেতে)</span>
            </>
          ) : (
            <>
              <ArrowLeft className="w-5 h-5 text-amber-400 animate-bounce" />
              <span>বাম দিকে {toBengaliDigits(Math.round(absOffset))}° ঘুরুন (ক্বাবার দিকে যেতে)</span>
            </>
          )}
        </div>
      </div>

      {/* MAIN 360° REALISTIC ROTATING COMPASS DIAL */}
      <div className="flex flex-col items-center justify-center py-4 relative">
        
        {/* TOP DEVICE NOTCH (Fixed Phone Direction Pointer) */}
        <div className="flex flex-col items-center -mb-2 z-30">
          <span className="text-[11px] font-black text-amber-300 uppercase tracking-widest bg-black/80 px-3 py-0.5 rounded-full border border-amber-400/40 shadow">
            মোবাইলের অগ্রভাগ
          </span>
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-amber-400 drop-shadow-md" />
        </div>

        {/* Outer Bezel */}
        <div
          className={`relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-4 transition-all duration-300 bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950 flex items-center justify-center shadow-2xl p-4 select-none ${
            isAligned
              ? 'border-amber-400 ring-8 ring-amber-400/30 shadow-amber-400/40'
              : 'border-emerald-600/80 shadow-emerald-950/80'
          }`}
        >
          {/* ROTATING COMPASS ROSE (Dial rotates so that True North stays pointed North) */}
          <div
            className="absolute inset-2 rounded-full transition-transform duration-200 ease-out flex items-center justify-center"
            style={{ transform: `rotate(${-currentHeading}deg)` }}
          >
            {/* Degree Tick Marks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <div
                key={deg}
                className="absolute w-full h-full flex justify-center items-start"
                style={{ transform: `rotate(${deg}deg)` }}
              >
                <div className={`w-0.5 ${deg % 90 === 0 ? 'h-3 bg-amber-300' : 'h-1.5 bg-emerald-500/60'}`} />
              </div>
            ))}

            {/* Cardinals on Dial (Clockwise: N=0°, E=90°, S=180°, W=270°) */}
            {/* North (0° - Top) */}
            <div className="absolute top-3 flex flex-col items-center">
              <span className="text-xs font-black text-rose-400 font-mono tracking-tighter">N</span>
              <span className="text-[9px] text-rose-300 font-bold">উত্তর</span>
            </div>

            {/* East (90° - Right / সূর্যোদয়) */}
            <div className="absolute right-3 flex flex-col items-center">
              <span className="text-xs font-black text-emerald-300 font-mono tracking-tighter">E</span>
              <span className="text-[9px] text-emerald-400 font-bold">পূর্ব (সূর্য)</span>
            </div>

            {/* South (180° - Bottom) */}
            <div className="absolute bottom-3 flex flex-col items-center">
              <span className="text-xs font-black text-emerald-300 font-mono tracking-tighter">S</span>
              <span className="text-[9px] text-emerald-400 font-bold">দক্ষিণ</span>
            </div>

            {/* West (270° - Left / সূর্যাস্ত) */}
            <div className="absolute left-3 flex flex-col items-center">
              <span className="text-xs font-black text-amber-300 font-mono tracking-tighter">W</span>
              <span className="text-[9px] text-amber-300 font-bold">পশ্চিম</span>
            </div>

            {/* KAABA POSITION MARKER ON DIAL (Fixed at qiblaDegree on the dial, e.g. 277.1°) */}
            <div
              className="absolute w-full h-full flex justify-center items-start pointer-events-none"
              style={{ transform: `rotate(${qiblaDegree}deg)` }}
            >
              <div className="flex flex-col items-center -mt-2.5 z-20">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xl border-2 transition-all ${
                    isAligned
                      ? 'bg-amber-400 border-white text-2xl scale-125 shadow-amber-400/80 ring-4 ring-amber-300'
                      : 'bg-emerald-900 border-amber-400 text-xl ring-2 ring-emerald-950'
                  }`}
                >
                  🕋
                </div>
                <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full mt-0.5 shadow font-mono">
                  ক্বাবা {toBengaliDigits(qiblaDegree)}°
                </span>
              </div>
            </div>
          </div>

          {/* STATIC OVERLAY: Dynamic Kaaba Direction Needle */}
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-200 ease-out pointer-events-none"
            style={{ transform: `rotate(${relativeAngle}deg)` }}
          >
            <div className="relative w-4 h-full flex items-center justify-center">
              {/* Pointer Head Arrow to Kaaba */}
              <div className="absolute top-8 flex flex-col items-center z-20">
                <div className={`w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[18px] transition-all ${
                  isAligned ? 'border-b-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]' : 'border-b-teal-400'
                }`} />
              </div>

              {/* Glowing Needle Body */}
              <div
                className={`w-2 h-1/2 rounded-t-full transition-all ${
                  isAligned
                    ? 'bg-gradient-to-t from-amber-500 via-amber-300 to-amber-200 shadow-lg shadow-amber-400/60'
                    : 'bg-gradient-to-t from-emerald-800 via-teal-400 to-teal-200'
                }`}
              />
              <div className="w-1.5 h-1/2 bg-slate-800/80 rounded-b-full" />
            </div>
          </div>

          {/* Center Hub Indicator */}
          <div className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-emerald-950 z-20 shadow-2xl flex flex-col items-center justify-center text-slate-950 font-black">
            <span className="text-[11px] font-mono leading-none">
              {toBengaliDigits(Math.round(currentHeading))}°
            </span>
            <span className="text-[8px] uppercase tracking-tighter opacity-80">
              হেডিং
            </span>
          </div>
        </div>

        {/* Manual Degree Slider fallback & Quick Testing Buttons */}
        {sensorStatus !== 'active' && (
          <div className="w-full max-w-sm bg-black/50 p-4 rounded-2xl border border-white/10 space-y-2.5 text-center mt-4 shadow-lg">
            <div className="flex justify-between items-center text-xs">
              <span className="text-emerald-300 font-bold flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-amber-300" />
                <span>ম্যানুয়াল হেডিং স্লাইডার:</span>
              </span>
              <span className="font-black text-amber-300 font-mono bg-black/60 px-2 py-0.5 rounded border border-amber-400/30">
                {toBengaliDigits(manualHeading)}° ({manualHeading === 277 ? 'ক্বাবামুখী' : manualHeading > 260 && manualHeading < 290 ? 'পশ্চিম' : 'হেডিং'})
              </span>
            </div>
            
            <input
              type="range"
              min="0"
              max="360"
              value={manualHeading}
              onChange={(e) => setManualHeading(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-emerald-950 rounded-lg"
            />
            
            <div className="flex justify-between text-[10px] text-emerald-300/80 font-mono flex-wrap gap-1">
              <button onClick={() => setManualHeading(0)} className="px-2 py-1 rounded bg-black/40 hover:text-amber-300 cursor-pointer">উত্তর (০°)</button>
              <button onClick={() => setManualHeading(90)} className="px-2 py-1 rounded bg-black/40 hover:text-amber-300 cursor-pointer">পূর্ব (৯০°)</button>
              <button onClick={() => setManualHeading(180)} className="px-2 py-1 rounded bg-black/40 hover:text-amber-300 cursor-pointer">দক্ষিণ (১৮০°)</button>
              <button onClick={() => setManualHeading(270)} className="px-2 py-1 rounded bg-black/40 hover:text-amber-300 cursor-pointer">পশ্চিম (২৭০°)</button>
              <button onClick={() => setManualHeading(Math.round(qiblaDegree))} className="px-2 py-1 rounded bg-amber-400 text-slate-950 font-bold cursor-pointer">ক্বাবা ({toBengaliDigits(qiblaDegree)}°)</button>
            </div>
            
            <p className="text-[11px] text-emerald-300/90 pt-1">
              * ডিভাইসে ম্যাগনেটিক সেন্সর বন্ধ থাকলে স্লাইডারটি ঘুরিয়ে ক্বাবা কোণ মিলিয়ে নিতে পারেন।
            </p>
          </div>
        )}
      </div>

      {/* QUICK SUMMARY & ISLAMIC GUIDELINES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10 space-y-1.5">
          <div className="font-bold text-amber-300 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>কুষ্টিয়া ও দক্ষিণ-পশ্চিমাঞ্চলের কিবলা দিক:</span>
          </div>
          <p className="text-emerald-200/90 leading-relaxed">
            কুষ্টিয়া (খুলনা বিভাগ) থেকে ক্বাবা শরীফের দিক হলো <strong>২৭৭.১° (পশ্চিম থেকে ৭.১° উত্তর দিকে)</strong>। সূর্যাস্তের সময় যেদিকে সূর্য ডোবে (পশ্চিম), তা থেকে হাতের ডান দিকে সামান্য (৭ ডিগ্রি) ঘুরে দাঁড়ালে সরাসরি ক্বাবা শরীফ মুখী সালাত আদায় হবে।
          </p>
        </div>

        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10 space-y-1.5">
          <div className="font-bold text-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>দিক উল্টো হওয়ার সমাধান:</span>
          </div>
          <p className="text-emerald-200/90 leading-relaxed">
            কিছু অ্যান্ড্রয়েড ফোনে সেন্সর আলফা ক্লকওয়াইজ রিড করে। যদি আপনার ফোনে পূর্ব ও পশ্চিম উল্টো মনে হয়, তবে উপরে দেওয়া <strong>"🔄 পূর্ব-পশ্চিম উল্টো হলে এখানে চাপুন"</strong> বাটনে একটি ক্লিক করলেই তাৎক্ষণিক দিক স্বাভাবিক হয়ে যাবে।
          </p>
        </div>
      </div>
    </div>
  );
};
