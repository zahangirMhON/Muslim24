// Haptic and Sensory Feedback Utility for Tasbih & Dhikr

let audioCtx: AudioContext | null = null;

export function initAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

// Automatically unlock AudioContext on first user interaction
if (typeof window !== 'undefined') {
  const unlockEvents = ['touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown'];
  const unlock = () => {
    initAudioContext();
    unlockEvents.forEach((ev) => window.removeEventListener(ev, unlock));
  };
  unlockEvents.forEach((ev) => window.addEventListener(ev, unlock, { passive: true }));
}

/**
 * Play a subtle, crisp acoustic bead click or chime for sensory feedback
 */
export function playSensoryClick(type: 'tap' | 'milestone' | 'complete' | 'reset' = 'tap', soundEnabled = true) {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    if (type === 'tap') {
      // Crisp acoustic wooden tasbih bead click (dual harmonic pop)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(800, now);
      osc1.frequency.exponentialRampToValueAtTime(220, now + 0.035);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1200, now);
      osc2.frequency.exponentialRampToValueAtTime(350, now + 0.025);

      osc1.connect(gain);
      osc2.connect(gain);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.04);
      osc2.stop(now + 0.04);
    } else if (type === 'milestone') {
      // 33 / 99 milestone bright crystal ping
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.setValueAtTime(987.77, now + 0.05); // B5

      osc.connect(gain);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'complete') {
      // 100 / target celebratory harmonic chime (C-E-G major chord)
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        osc.connect(oGain);
        oGain.connect(ctx.destination);

        const startTime = now + idx * 0.06;
        oGain.gain.setValueAtTime(0.22, startTime);
        oGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } else if (type === 'reset') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
      osc.connect(gain);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch {
    // Gracefully handle browser autoplay restrictions
  }
}

/**
 * Triggers physical device vibration and sensory audio feedback
 */
export function triggerHaptic(
  type: 'tap' | 'milestone' | 'complete' | 'reset' = 'tap',
  vibrationEnabled = true,
  soundEnabled = false
) {
  // 1. Physical Device Vibration
  if (vibrationEnabled && typeof navigator !== 'undefined') {
    try {
      if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
        if (type === 'tap') {
          navigator.vibrate(45); // Clean crisp tap vibration
        } else if (type === 'milestone') {
          navigator.vibrate([70, 40, 90]); // Milestone pattern
        } else if (type === 'complete') {
          navigator.vibrate([90, 50, 120, 50, 180]); // Completion celebratory vibration
        } else if (type === 'reset') {
          navigator.vibrate([35, 35, 35]);
        }
      }
    } catch {
      // Ignore vibration error on unsupported platforms
    }
  }

  // 2. Sensory Click Audio Tone
  if (soundEnabled) {
    playSensoryClick(type, true);
  }
}

export interface LaunchDhikrPayload {
  id?: string;
  titleBn: string;
  titleEn?: string;
  arabicText: string;
  transliterationBn: string;
  translationBn: string;
  targetCount: number;
  recommendedTimeBn?: string;
  prayerSlotBn?: string;
  referenceBn?: string;
}

/**
 * Dispatches a global event to open and pre-select this Dhikr in the Tasbih counter
 */
export function launchDhikrInTasbih(payload: LaunchDhikrPayload) {
  if (typeof window === 'undefined') return;

  const event = new CustomEvent('start-dhikr-tasbih', {
    detail: payload
  });
  window.dispatchEvent(event);

  // Smoothly scroll to the Tasbih card if visible
  const tasbihElement = document.getElementById('tasbih-section-root');
  if (tasbihElement) {
    tasbihElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
