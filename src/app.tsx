import { FormEvent, useReducer, useState } from "react";

import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { CurrencyInput } from "./components/ui/currency-input";

type Spent = {
  id?: string
  color: string
  label: string
  amount: number
}

export function App() {
  const [spending, setSpending] = useState<Spent[]>([])
  const [availableToSpent, setAvailableToSpent] = useState<number>(0)
  const [tick, increaseTick] = useReducer(state => state + 1, 0)

  const totalSpending = spending.reduce((amount, spent) => amount + spent.amount, 0)
  const rest = availableToSpent - totalSpending

  function getDataFromForm(form: HTMLFormElement): Spent {
    const fields = [...form] as HTMLInputElement[]

    const color = fields[0].value
    const label = fields[1].value
    let amountString = fields[2].value

    amountString = amountString.replace(/\D/g, '');

    if (amountString.length === 1) 
      amountString = ('0' + amountString);

    const amount = Number(amountString.replace(/(\d{2}$)/, '.$1'));

    return { color, label, amount }
  }

  function onCreateSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = e.target as HTMLFormElement
    const payload = getDataFromForm(form)

    const id = window.crypto.randomUUID()
    const data = { id, ...payload  }

    setSpending(cur => [...cur, data])

    increaseTick()
  }

  function onEditSubmit(recordIndex: number) {
    return (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
  
      const form = e.target as HTMLFormElement
      const payload = getDataFromForm(form)
  
      setSpending(cur => cur.map((record, index) => {
        if (index === recordIndex) {
          return {
            ...record,
            ...payload
          }
        }

        return record
      }))
    }
  }

  function formatToCurrency(value: number) {
    return Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value)
  }

  function deleteSpent(recordIndex: number) {
    return () => {
      setSpending(cur => cur.filter((_, index) => index !== recordIndex))
    }
  }

  const isAvailableDefined = availableToSpent > 0
  const isMissing = isAvailableDefined && rest < 0

  const label =  isMissing ? "Missing" : "Leftover"
  const dangerClasses = isMissing ? "border-destructive focus-visible:ring-destructive" : ""

  return (
    <div className="h-full p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <form key={tick} className="flex items-center gap-2" onSubmit={onCreateSubmit}>
          <Input type="color" className="size-10 flex-shrink-0"/>
          <Input  className="w-full" />
          <CurrencyInput className="max-w-32" />

          <Button type="submit">Add</Button>
        </form>
        <div>
          <CurrencyInput onChange={(v) => setAvailableToSpent(Number(v))} />
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <ul className="flex flex-col gap-2 max-w-xl flex-shrink-0 basis-[576px]">
          {spending.map((spend, index) => {
            return (
              <li key={spend.id} >
                <form className="flex items-center gap-2" onSubmit={onEditSubmit(index)}>
                  <div className="flex items-center gap-2">
                    <Input type="color" defaultValue={spend.color} className="size-10 flex-shrink-0" />
                    <Input defaultValue={spend.label} className="w-full" />
                    <CurrencyInput defaultValue={spend.amount} className="max-w-32" />
                  </div>


                  <Button type="submit">Edit</Button>
                  <Button variant="destructive" onClick={deleteSpent(index)}>Delete</Button>
                </form>
              </li>
            )
          })}
        </ul>

        <div className="flex-1">
          <div className="w-full flex gap-4 justify-between">
            <p className="flex items-center gap-4">
              <strong className="text-nowrap">Total Spending: </strong>

              <Input readOnly value={formatToCurrency(totalSpending)} className={dangerClasses} />
            </p>

            <p className="flex items-center gap-4">
              <strong className="text-nowrap">Available To Spent: </strong>
              <Input readOnly value={formatToCurrency(availableToSpent)} />
            </p>

            {isAvailableDefined && (
              <p className="flex items-center gap-4">
                <strong className="text-nowrap">{label}: </strong>
                <Input readOnly value={formatToCurrency(Math.abs(rest))} className={dangerClasses} />
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
