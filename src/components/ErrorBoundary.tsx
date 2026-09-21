import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle, Trash2, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCacheAndReload = () => {
    try {
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
      // Preserve important settings but clear transient caches
      const zoom = localStorage.getItem('islamic_app_ui_zoom');
      sessionStorage.clear();
      localStorage.clear();
      if (zoom) localStorage.setItem('islamic_app_ui_zoom', zoom);
    } catch (e) {
      console.error('Error clearing caches:', e);
    }
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-emerald-950 text-emerald-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-emerald-900/90 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto border border-amber-400/40 text-3xl">
              ⚠️
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-amber-300">
                অ্যাপসটি লোড হতে সমস্যা হচ্ছে
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200">
                ব্রাউজারের পুরোনো ক্যাশ বা সাময়িক নেটওয়ার্ক ত্রুটির কারণে সমস্যা হতে পারে। অনুগ্রহ করে নিচের বাটনে ক্লিক করে পুনরায় লোড করুন।
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>পুনরায় অ্যাপ লোড করুন (Reload)</span>
              </button>

              <button
                onClick={this.handleResetCacheAndReload}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-950 hover:bg-emerald-800 text-emerald-300 hover:text-white border border-emerald-700 font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-amber-400" />
                <span>ক্যাশ পরিষ্কার করে ফ্রেশ রিস্টার্ট করুন</span>
              </button>
            </div>

            {this.state.error && (
              <details className="text-left mt-4 text-[11px] text-emerald-400/80 bg-emerald-950/80 p-3 rounded-xl border border-emerald-800/80 overflow-auto max-h-32">
                <summary className="cursor-pointer font-medium text-emerald-300 hover:text-amber-300">
                  কারিগরি বিবরণ (Error Details)
                </summary>
                <pre className="mt-2 text-rose-300 whitespace-pre-wrap font-mono">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
