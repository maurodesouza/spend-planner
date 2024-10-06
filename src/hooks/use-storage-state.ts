import { useState, Dispatch, SetStateAction } from 'react';

import { StorageUtils } from "../utils/storage-utils";

type useStorageStateSettings = {
    storageKey: string
    storageType?: Parameters<typeof StorageUtils.get>[1]
}

type Return<T> = [T, Dispatch<SetStateAction<T>>];

function isSetStateFunction<T>(func: SetStateAction<T>): func is (prevState: T) => T {
    return typeof func === 'function';
  }

export function useStorageState<T>(initialState: T, options: useStorageStateSettings): Return<T>  {
  const [state, set] = useState<T>(() => {
    const storageValue = StorageUtils.get<T>(options.storageKey);

    return storageValue || initialState;
  });

  function setState(value: SetStateAction<T>) {
    set((state) => {
        const result = isSetStateFunction(value) ? value(state) : value

        StorageUtils.set(options.storageKey, result, options.storageType)

        return result
    })
  }

  return [state, setState];
};
