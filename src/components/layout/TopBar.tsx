import { Bell, Sun, Moon, Globe, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/i18n';
import { useApp } from '@/context/AppContext';
import type { Lang, Role } from '@/types';

const roles: Role[] = ['Operator', 'Field Engineer', 'Line Leader', 'Quality Engineer'];
const roleKeys: Record<Role, string> = {
  Operator: 'role.operator',
  'Field Engineer': 'role.fieldEngineer',
  'Line Leader': 'role.lineLeader',
  'Quality Engineer': 'role.qualityEngineer',
};

export function TopBar({ title }: { title: string }) {
  const { t, lang, setLang } = useI18n();
  const { theme, setTheme, currentUser, setCurrentUser, unreadEscalations, clearNotifications } = useApp();
  const [roleOpen, setRoleOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const roleRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-800">
      <h2 className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100">{title}</h2>
      <div className="flex items-center gap-2.5">
        {/* Language toggle */}
        <div className="flex items-center gap-1.5">
          <Globe className="h-4 w-4 text-slate-400" />
          <div className="flex overflow-hidden rounded-md border border-slate-200 dark:border-slate-600">
            {(['en', 'te'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 text-xs font-semibold uppercase transition-colors focus:outline-none ${
                  lang === l
                    ? 'bg-slate-800 text-white dark:bg-slate-600'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
                }`}
                aria-label={l === 'en' ? 'English' : 'Telugu'}
              >
                {l === 'en' ? 'EN' : 'TE'}
              </button>
            ))}
          </div>
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-400 dark:hover:bg-slate-700"
          aria-label={theme === 'light' ? t('theme.dark') : t('theme.light')}
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {/* Notification bell */}
        <div ref={bellRef} className="relative">
          <button
            onClick={() => {
              setBellOpen(!bellOpen);
              if (!bellOpen) clearNotifications();
            }}
            className="relative rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-400 dark:hover:bg-slate-700"
            aria-label={t('topbar.notifications')}
          >
            <Bell className="h-4 w-4" />
            {unreadEscalations > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-800">
                {unreadEscalations}
              </span>
            )}
          </button>
          {bellOpen && (
            <div className="absolute right-0 top-full mt-1 w-64 animate-slide-down rounded-lg border border-slate-200 bg-white p-3 shadow-dropdown dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('topbar.unreadEscalations')}: <span className="font-semibold text-slate-700 dark:text-slate-300">{unreadEscalations}</span></p>
            </div>
          )}
        </div>

        {/* User switcher */}
        <div ref={roleRef} className="relative">
          <button
            onClick={() => setRoleOpen(!roleOpen)}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/50"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-white">
              {currentUser.split(' ').map((w) => w[0]).join('')}
            </span>
            <span>{t(roleKeys[currentUser])}</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${roleOpen ? 'rotate-180' : ''}`} />
          </button>
          {roleOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 animate-slide-down overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-dropdown dark:border-slate-700 dark:bg-slate-800">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setCurrentUser(r);
                    setRoleOpen(false);
                  }}
                  className={`block w-full px-3 py-1.5 text-left text-xs transition-colors hover:bg-slate-50 focus:outline-none dark:hover:bg-slate-700/50 ${
                    currentUser === r ? 'font-semibold text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {t(roleKeys[r])}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
