import React from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastAlert {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  timestamp: string;
}

interface NotificationToastProps {
  notifications: ToastAlert[];
  onDismiss: (id: string) => void;
  isOpen: boolean;
  onClosePanel: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notifications,
  onDismiss,
  isOpen,
  onClosePanel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-20 right-4 z-50 w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 text-slate-100">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            System Alerts & Transaction Audit
          </h4>
        </div>
        <button
          onClick={onClosePanel}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-xs text-slate-500 py-4 text-center">
          No new system alerts at this moment.
        </p>
      ) : (
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-xl border text-xs relative flex items-start gap-2.5 transition-all ${
                n.type === 'success'
                  ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-200'
                  : n.type === 'warning'
                  ? 'bg-rose-950/60 border-rose-800/80 text-rose-200'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300'
              }`}
            >
              {n.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : n.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              )}

              <div className="pr-4">
                <span className="font-bold block text-xs">{n.title}</span>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{n.message}</p>
                <span className="text-[9px] text-slate-500 block mt-1">{n.timestamp}</span>
              </div>

              <button
                onClick={() => onDismiss(n.id)}
                className="absolute top-2 right-2 text-slate-500 hover:text-slate-300 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
