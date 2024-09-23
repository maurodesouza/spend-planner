const PREFIX = "@spend-planner:"

const STORAGES = {
    local: localStorage,
    session: sessionStorage
}

function getFullStorageKey(key: string) {
    return `${PREFIX}${key}`
}

class StorageUtilsClass {
    set<T>(key: string, value: T, storageType: keyof typeof STORAGES = "local") {
        const fullKey = getFullStorageKey(key)
        const storage = STORAGES[storageType]

        storage.setItem(fullKey, JSON.stringify(value))
    }

    get<T>(key: string, storageType: keyof typeof STORAGES = "local") {
        const fullKey = getFullStorageKey(key)
        const storage = STORAGES[storageType]

        const value = storage.getItem(fullKey)

        if (!value) return

        return JSON.parse(value) as T
    }
}

export const StorageUtils = new StorageUtilsClass()
