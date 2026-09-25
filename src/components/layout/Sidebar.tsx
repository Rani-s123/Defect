import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ClipboardPlus, Bell, BookOpen, ScrollText, Settings, ShieldAlert } from 'lucide-react';
import { useI18n } from '@/i18n';

const navItems = [
  { to: '/', icon: LayoutDashboard, key: 'nav.dashboard' },
  { to: '/log-defect', icon: ClipboardPlus, key: 'nav.logDefect' },
  { to: '/alerts', icon: Bell, key: 'nav.alerts' },
  { to: '/knowledge-base', icon: BookOpen, key: 'nav.knowledgeBase' },
  { to: '/audit', icon: ScrollText, key: 'nav.auditTrail' },
  { to: '/settings', icon: Settings, key: 'nav.settings' },
];

export function Sidebar() {
  const { t } = useI18n();
  return (
    <aside className="flex h-screen w-56 flex-col border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2.5 border-b border-slate-200 px-4 py-4 dark:border-slate-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 dark:bg-slate-700">
          <ShieldAlert className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold leading-tight tracking-tight text-slate-800 dark:text-slate-100">{t('app.title')}</h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('app.subtitle')}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-3" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm dark:bg-slate-700'
                    : 'text-slate-600 hover:bg-slate-200/70 dark:text-slate-400 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {t(item.key)}
            </NavLink>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          System Online
        </div>
      </div>
    </aside>
  );
}
