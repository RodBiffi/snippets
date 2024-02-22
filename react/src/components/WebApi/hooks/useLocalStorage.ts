import { Dispatch, useEffect, useState } from 'react';
import { useWindow } from './useWindow';

export function useLocalStorage<T>(
  key: string,
  initialValue?: T,
  { serialize = JSON.stringify, deserialize = JSON.parse } = {},
  migrateFromKey = '',
): [T, Dispatch<T>] {
  const windowApi = useWindow();
  let valueInLocalStorage = windowApi.localStorage.getItem(key);
  if (migrateFromKey) {
    const valueInOldKey = windowApi.localStorage.getItem(migrateFromKey);
    if (valueInOldKey) {
      valueInLocalStorage = valueInOldKey;
      windowApi.localStorage.setItem(key, valueInOldKey);
      windowApi.localStorage.removeItem(migrateFromKey);
    }
  }
  const [item, setItem] = useState(
    valueInLocalStorage ? deserialize(valueInLocalStorage) : initialValue,
  );

  useEffect(() => {
    windowApi.localStorage.setItem(key, serialize(item));
  }, [windowApi, key, item, serialize]);

  return [item as T, setItem as Dispatch<T>];
}
