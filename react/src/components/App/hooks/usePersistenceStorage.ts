import { useLocalStorage } from '../../WebApi/hooks/useLocalStorage';
import { Theme } from '../../Theme/ThemeContext';

export enum PersistenceStorageKeys {
  DEBUG = 'debug',
  THEME = 'my-theme',
}

const migrationKeys: Partial<Record<PersistenceStorageKeys, string>> = {
  [PersistenceStorageKeys.THEME]: 'old-theme-key',
};

export interface PersistenceStorage {
  [PersistenceStorageKeys.DEBUG]: {
    keyPaths: string[];
  };
  [PersistenceStorageKeys.THEME]: Theme;
}

export const usePersistenceStorage = <T extends PersistenceStorageKeys>(
  key: T,
  initialValue?: PersistenceStorage[T],
  options?: Record<string, unknown>,
) =>
  useLocalStorage<PersistenceStorage[T]>(
    key,
    initialValue,
    options,
    migrationKeys[key],
  );

export default usePersistenceStorage;
