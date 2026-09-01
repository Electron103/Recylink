import React from 'react';
import { NotificationItem } from '../types';
import { Bell, X, CheckCheck, Clock, ShieldCheck, Truck, Wallet } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#ffffff] border border-[#e2e0d4] rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-[#2d2d2a] max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#f5f5f0] hover:bg-stone-200 text-stone-600 hover:text-[#2d2d2a] transition cursor-pointer border border-[#e2e0d4]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#e2e0d4]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#2d5a3f]" />
            <h3 className="text-base font-extrabold text-[#2d2d2a]">Notifications & Alerts</h3>
          </div>

          <button
            onClick={onMarkAllRead}
            className="text-xs text-[#2d5a3f] hover:text-[#234e36] hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition ${
                notif.read
                  ? 'bg-[#f5f5f0] border-[#e2e0d4] text-stone-600'
                  : 'bg-[#e8f5ec] border-[#badfca] text-[#2d2d2a] shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-bold text-xs text-[#2d2d2a] flex items-center gap-1.5">
                  {!notif.read && <span className="w-2 h-2 rounded-full bg-[#2d5a3f]"></span>}
                  {notif.title}
                </h4>
                <span className="text-[10px] text-stone-500 font-mono">
                  {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-stone-700">{notif.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
