import { FormEvent, useReducer, useState } from "react";

import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { CurrencyInput } from "./components/ui/currency-input";

type Spent = {
  color: string
  label: string
  amount: number
}

export function App() {
  const [spending, setSpents] = useState<Spent[]>([])
  const [tick, increaseTick] = useReducer(state => state + 1, 0)

  function onSumit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = e.target as HTMLFormElement
    const fields = [...form] as HTMLInputElement[]

    const color = fields[0].value
    const label = fields[1].value
    let amountString = fields[2].value

    amountString = amountString.replace(/\D/g, '');

    if (amountString.length === 1) 
      amountString = ('0' + amountString);

    const amount = Number(amountString.replace(/(\d{2}$)/, '.$1'));

    const payload = { color, label, amount }

    setSpents(cur => [...cur, payload])

    increaseTick()
  }

  return (
    <div className="h-full p-4">
      <div className="flex items-center justify-between gap-4">
        <form key={tick} className="flex items-center gap-2" onSubmit={onSumit}>
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
        {spending.map(spend => {
          return (
            <form className="flex items-center gap-2" onSubmit={onSumit}>
              <Input type="color" defaultValue={spend.color} />
              <Input defaultValue={spend.label} />
              <CurrencyInput defaultValue={spend.amount} />
            </form>
          )
        })}
      </div>
    </div>
  )
}
