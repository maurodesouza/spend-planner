import { Reducer, useReducer } from 'react';
import { StorageUtils } from '../utils/storage-utils';

type UseStorageReducerSettings = {
  storageKey: string;
  storageType?: Parameters<typeof StorageUtils.get>[1];
};

export function useStorageReducer<D, A>(
  reducer: Reducer<D, A>,
  initialData: D,
  options: UseStorageReducerSettings
) {
  function getInitialData() {
    const data = StorageUtils.get<D>(options.storageKey, options.storageType);

    if (data) return data;
    return initialData;
  }

  return useReducer<Reducer<D, A>>((state, action) => {
    const result = reducer(state, action);

    StorageUtils.set(options.storageKey, result, options.storageType);

    return result;
  }, getInitialData());
}
