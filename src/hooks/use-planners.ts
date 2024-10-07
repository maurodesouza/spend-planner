import { Planner } from '../types';
import { useStorageState } from './use-storage-state';

export function usePlanners() {
  const [planners, setPlanners] = useStorageState<Planner[]>([], {
    storageKey: 'planners',
  });

  function addPlanner(data: Omit<Planner, 'id'>) {
    const payload = {
      ...data,
      id: window.crypto.randomUUID(),
    };

    setPlanners(state => [...state, payload]);

    return payload;
  }

  function updatePlanner(id: string, data: Planner) {
    setPlanners(state =>
      state.map(planner =>
        planner.id === id ? { ...planner, ...data } : planner
      )
    );
  }

  function removePlanner(id: string) {
    setPlanners(state => state.filter(planner => planner.id !== id));
  }

  return {
    addPlanner,
    updatePlanner,
    removePlanner,

    planners,
  };
}
