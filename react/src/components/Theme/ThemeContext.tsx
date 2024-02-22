import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
} from 'react';
import {
  PersistenceStorageKeys,
  usePersistenceStorage,
} from '../App/hooks/usePersistenceStorage';

export type Theme = 'light' | 'dark';
type ThemeContext = { theme: Theme; setTheme: (theme: Theme) => void };

export const ThemeContext = createContext<ThemeContext>({
  theme: 'light',
  setTheme: () => undefined,
});

export const ThemeContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [myTheme, setMyTheme] = usePersistenceStorage(
    PersistenceStorageKeys.THEME,
    'light',
  );

  useEffect(() => {
    const theme =
      myTheme ??
      (window.matchMedia('(prefers-color-scheme: dark)')?.matches
        ? 'dark'
        : 'light');
    setMyTheme(theme);

    // For backwards compatibility with emotion
    if (theme === 'dark') document.body.classList.add('darkMode');
    else document.body.classList.remove('darkMode');
  }, [myTheme]);

  if (!myTheme) return null;
  return (
    <ThemeContext.Provider value={{ theme: myTheme, setTheme: setMyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContext => useContext(ThemeContext);
