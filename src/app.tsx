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
  const [spending, setSpents] = useState<Spent[]>([])
  const [tick, increaseTick] = useReducer(state => state + 1, 0)

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

    setSpents(cur => [...cur, data])

    increaseTick()
  }

  function onEditSubmit(recordIndex: number) {
    return (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
  
      const form = e.target as HTMLFormElement
      const payload = getDataFromForm(form)
  
      setSpents(cur => cur.map((record, index) => {
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

  function deleteSpent(recordIndex: number) {
    return () => {
      setSpents(cur => cur.filter((_, index) => index !== recordIndex))
    }
  }

  return (
    <div className="h-full p-4">
      <div className="flex items-center justify-between gap-4">
        <form key={tick} className="flex items-center gap-2" onSubmit={onCreateSubmit}>
          <Input type="color" />
          <Input />
          <CurrencyInput onChange={console.log} />

          <Button type="submit">Add</Button>
        </form>
        <div>
          <CurrencyInput onChange={console.log} />
        </div>
      </div>

      <div>
        {spending.map((spend, index) => {
          return (
            <form key={spend.id} className="flex items-center gap-2" onSubmit={onEditSubmit(index)}>
              <Input type="color" defaultValue={spend.color} />
              <Input defaultValue={spend.label} />
              <CurrencyInput defaultValue={spend.amount} />

              <Button type="submit">Edit</Button>
              <Button variant="destructive" onClick={deleteSpent(index)}>Delete</Button>
            </form>
          )
        })}
      </div>
    </div>
  )
}
