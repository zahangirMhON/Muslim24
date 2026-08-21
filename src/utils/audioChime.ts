// Web Audio API Islamic Notification Chime & Beep Synthesizer
// Works reliably offline and on all modern mobile and desktop browsers without external network dependencies

class SoundNotificationEngine {
  private audioCtx: AudioContext | null = null;

  public initContext() {
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
    } catch (e) {
      console.log('AudioContext init note:', e);
    }
  }

  /**
   * Plays a crisp, short countdown tick sound
   */
  public playTick(frequency: number = 650) {
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {
      console.log('Tick sound error:', e);
    }
  }

  /**
   * Plays a gentle, pleasant dual-tone Islamic notification chime
   */
  public playChime(type: 'gentle' | 'azan' | 'success' | 'alert' = 'gentle') {
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      if (type === 'azan') {
        // Grand 3-chord harmonic tone
        const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);

          gain.gain.setValueAtTime(0.001, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.12 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 1.25);
        });
      } else {
        // Dual-tone gentle bell chime (587Hz -> 880Hz)
        const notes = [
          { freq: 587.33, start: 0, duration: 0.6, vol: 0.18 }, // D5
          { freq: 880.00, start: 0.18, duration: 0.9, vol: 0.22 }  // A5
        ];

        notes.forEach(n => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(n.freq, now + n.start);

          gain.gain.setValueAtTime(0.001, now + n.start);
          gain.gain.exponentialRampToValueAtTime(n.vol, now + n.start + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + n.start);
          osc.stop(now + n.start + n.duration + 0.05);
        });
      }
    } catch (e) {
      console.log('Audio chime error:', e);
    }
  }
}

export const notificationSound = new SoundNotificationEngine();
