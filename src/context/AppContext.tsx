import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Role, Theme } from '@/types';
import { api } from '@/api';

interface AppCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  currentUser: Role;
  setCurrentUser: (r: Role) => void;
  unreadEscalations: number;
  clearNotifications: () => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [currentUser, setCurrentUserRole] = useState<Role>('Field Engineer');
  const [unreadEscalations, setUnread] = useState(1);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const setCurrentUser = (r: Role) => {
    setCurrentUserRole(r);
    api.setCurrentUser(r);
  };
  const clearNotifications = () => setUnread(0);

  return (
    <Ctx.Provider value={{ theme, setTheme, currentUser, setCurrentUser, unreadEscalations, clearNotifications }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp(): AppCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
