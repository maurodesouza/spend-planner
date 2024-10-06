export type Spent = {
    id?: string
    color: string
    label: string
    amount: number
    fill?: string
  }

export type Planner = {
    id: string
    title: string
    availableToSpent: number
    spending: Spent[]
}

export type DraftPlanner = {
    title?: string
    availableToSpent: number
    spending: Spent[]
}