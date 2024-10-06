import { Planner } from "../types";
import { useStorageState } from "./use-storage-state";

export function usePlanners() {
    const [planners, setPlanners] = useStorageState<Planner[]>([], {
        storageKey: "planners"
    })

    function addPlanner(data: Omit<Planner, "id">) {
        const payload = {
            ...data,
            id: window.crypto.randomUUID()
        }

        setPlanners(state => [...state, payload])

        return payload
    }

    function updatePlanner(id: string, data: Planner) {
        setPlanners(state => state.map(planner => planner.id === id ? { ...planner, ...data } : planner))

    }


    return {
        addPlanner,
        updatePlanner,

        planners,
    }
}