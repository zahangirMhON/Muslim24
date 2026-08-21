// Amal Tracker Helper Service

export function getTodayDateKey(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function getTodayAmalCompletion(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const todayKey = getTodayDateKey();
    const stored = localStorage.getItem(`amal_records_${todayKey}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to parse amal completion:', e);
  }
  return {};
}

export function saveTodayAmalCompletion(data: Record<string, boolean>): void {
  if (typeof window === 'undefined') return;
  try {
    const todayKey = getTodayDateKey();
    localStorage.setItem(`amal_records_${todayKey}`, JSON.stringify(data));
    window.dispatchEvent(new Event('amal-updated'));
  } catch (e) {
    console.error('Failed to save amal completion:', e);
  }
}

export function toggleAmalCompletion(id: string): Record<string, boolean> {
  const current = getTodayAmalCompletion();
  const updated = {
    ...current,
    [id]: !current[id]
  };
  saveTodayAmalCompletion(updated);
  return updated;
}

export function promptAmalLoginModal(titleBn?: string, onProceedGuest?: () => void): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('islamic-amal-login-prompt', {
      detail: {
        titleBn: titleBn || 'নফল সালাতের আমল',
        onProceedGuest
      }
    })
  );
}
