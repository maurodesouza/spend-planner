import { Plus, Trash2 } from "lucide-react";

import { FormEvent, useReducer } from "react";
import { Pie, PieChart } from "recharts";

import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Chart, ChartConfig } from "./components/ui/chart";
import { PaletteInput } from "./components/ui/palette-input";
import { CurrencyInput } from "./components/ui/currency-input";
import { useStorageReducer } from "./hooks/use-storage-reducer";

const COLOR_OPTIONS = [
  "#ffdab9",
  "#b0e57c",
  "#9fe2bf",
  "#87ceeb",
  "#dda0dd",
  "#ffb6c1",
  "#ffcccb",
  "#f0e68c",
  "#add8e6",
  "#ffebcd",
  "#ff7f50",
  "#98fb98",
  "#afeeee",
  "#db7093",
  "#f4a460",
  "#fafad2",
  "#d8bfd8",
  "#e0ffff",
  "#ffe4e1",
  "#ffdead",
  "#e6e6fa",
  "#d3ffce",
  "#ffefd5",
  "#ffc0cb",
  "#f5deb3",
  "#bc8f8f",
  "#f0fff0",
  "#c3b091",
  "#eedd82",
  "#ffb347"
]

type Spent = {
  id?: string
  color: string
  label: string
  amount: number
  fill?: string
}

enum Actions {
  SET_SPENDING = "set-spending",
  ADD_SPENDING = "add-spending",
  REMOVE_SPENDING = "remove-spending",
  UPDATE_SPENDING = "update-spending",
  UPDATE_AVAILABLE_TO_SPENT = "update-available-to-spent",
} 

type Data = {
  availableToSpent: number
  spending: Spent[]
}

type Action = {
  type: Actions,
  payload: any
}

const INITIAL_STATE = {
  availableToSpent: 0,
  spending: []
} satisfies Data

export function App() {
  const [data, dispatch] = useStorageReducer<Data, Action>((state, action) => {
    switch (action.type) {
      case Actions.SET_SPENDING: {
        return {
          ...state,
          spending: action.payload
        }
      }

      case Actions.ADD_SPENDING: {
        return {
          ...state,
          spending: [...state.spending, action.payload]
        }
      }

      case Actions.REMOVE_SPENDING: {
        return {
          ...state,
          spending: state.spending.filter(record => record.id !== action.payload)
        }
      }

      case Actions.UPDATE_SPENDING: {
        return {
          ...state,
          spending: state.spending.map((record) => {
            if (record.id === action.payload.id) {
              return {
                ...record,
                ...action.payload.data
              }
            }
    
            return record
          })
        }
      }

      case Actions.UPDATE_AVAILABLE_TO_SPENT: {
        return {
          ...state,
          availableToSpent: action.payload
        }
      }

      default: {
        return state
      }
    }
  }, INITIAL_STATE, {
    storageKey: "data"
  })

  const [tick, increaseTick] = useReducer(state => state + 1, 0)

  const { availableToSpent, spending } = data

  const totalSpending = spending.reduce((amount, spent) => amount + spent.amount, 0)
  const rest = availableToSpent - totalSpending

  const totalAmount = availableToSpent > totalSpending ? availableToSpent : totalSpending

  function getDataFromForm(form: HTMLFormElement): Spent {
    const fields = [...form] as HTMLInputElement[]

    const color = fields[1].value
    const label = fields[2].value
    let amountString = fields[3].value

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
    const data = { id, fill: `var(--color-${id})`,...payload  }

    dispatch({
      type: Actions.ADD_SPENDING,
      payload: data
    })

    increaseTick()
  }

  function onEditSubmit(id: string) {
    return (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
  
      const form = e.target as HTMLFormElement
      const payload = getDataFromForm(form)

      dispatch({
        type: Actions.UPDATE_SPENDING,
        payload: {
          id,
          data: payload
        }
      })
    }
  }

  function formatToCurrency(value: number) {
    return Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value)
  }

  function deleteSpent(id: string) {
    return () => {
      dispatch({
        type: Actions.REMOVE_SPENDING,
        payload: id
      })
    }
  }

  function getChartData() {
    if (!isAvailableDefined || isMissing) return spending

    const data = [...spending]

    data.push({
      amount: rest,
      color: "#c0c0c0",
      label: "Leftover",
      id: "leftover",
      fill: `var(--color-leftover)`
    })

    return data
  }

  function getDefaultPalette() {
    const min = 0
    const max = COLOR_OPTIONS.length

    const index = Math.floor(Math.random() * (max - min + 1) + min);

    return COLOR_OPTIONS[index]
  }

  const isAvailableDefined = availableToSpent > 0
  const isMissing = isAvailableDefined && rest < 0

  const label =  isMissing ? "Missing" : "Leftover"
  const dangerClasses = isMissing ? "border-destructive focus-visible:ring-destructive" : ""


  const chartConfig = spending.reduce((obj, spent) => {
    obj[spent.id!] = {
      label: spent.label,
      color: spent.color
    }

    return obj
  }, {
    amount: {
      label: "Value"
    },
    leftover: {
      label: "Leftover",
      color: "#c0c0c0"
    }
  } as ChartConfig)

  const chartData = getChartData()

  return (
    <div className="h-full p-4 flex gap-4">
      <div className="flex flex-col h-full justify-between border border-border rounded bg-card max-w-xl flex-shrink-0 basis-[576px] overflow-hidden">
        <ul className="flex flex-col gap-2 p-4 overflow-auto">
          {spending.map((spend) => {
            const percentage = Number((spend.amount * 100 / totalAmount).toFixed(1))

            return (
              <li key={spend.id} >
                <form className="flex items-center gap-2" onSubmit={onEditSubmit(spend.id!)}>
                  <div className="flex items-center gap-2">
                    <PaletteInput options={COLOR_OPTIONS} defaultValue={spend.color} />
                    <Input defaultValue={spend.label} className="w-full" />
                    <CurrencyInput defaultValue={spend.amount} className="max-w-32" />

                    <Input type="number" min="0" max="100" step="0.1" value={percentage} readOnly  className="w-full"  />
                    %
                  </div>


                  <Button type="submit">Edit</Button>
                  <Button variant="destructive" className="px-3" onClick={deleteSpent(spend.id!)}><Trash2 /></Button>
                </form>
              </li>
            )
          })}
        </ul>

        <form key={tick} className="flex items-center gap-2 w-full border-t border-border  p-4" onSubmit={onCreateSubmit}>
          <PaletteInput options={COLOR_OPTIONS} defaultValue={getDefaultPalette()} />
          
          <Input  className="w-full" />
          <CurrencyInput className="max-w-32" />

          <Button className="px-3" type="submit">
            <Plus />
          </Button>
        </form>
      </div>

      <div className="flex-1 border border-border p-4 rounded flex flex-col justify-between">
        <div className="w-full flex flex-wrap gap-4 justify-between">
          <p className="flex items-center gap-4">
            <strong className="text-nowrap">Total Spending: </strong>

            <Input readOnly value={formatToCurrency(totalSpending)} className={dangerClasses} />
          </p>

          <p className="flex items-center gap-4">
            <strong className="text-nowrap">Available To Spent: </strong>
            <CurrencyInput onChange={(v) => dispatch({ type: Actions.UPDATE_AVAILABLE_TO_SPENT, payload: Number(v) })} />
          </p>

          {isAvailableDefined && (
            <p className="flex items-center gap-4">
              <strong className="text-nowrap">{label}: </strong>
              <Input readOnly value={formatToCurrency(Math.abs(rest))} className={dangerClasses} />
            </p>
          )}
        </div>

        {!!spending.length && (
          <div>
              <Chart.Container
                config={chartConfig as ChartConfig}
                className="mx-auto aspect-square w-[clamp(320px,100%,720px)]"
              >
              <PieChart>
                <Chart.Tooltip
                  cursor={false}
                  content={(
                    <Chart.TooltipContent
                      formatter={(value, _, item) => {
                        const formattedValue = Number(`${value}`).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })

                        return (
                          <div className="flex gap-2 items-center">
                            <div style={{ background: item.payload.color }} className="size-3 rounded-sm" />
                            <strong>{item.payload.label}</strong>
                            <p>{formattedValue}</p>
                          </div>
                        )
                      }}
                      hideLabel
                    />
                  )}
                />
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="id"
                  innerRadius="40%"
                  labelLine={false}
                  label={(props) => {
                    return (
                      <text 
                        cx={props.cx}
                        cy={props.cy}
                        x={props.x}
                        y={props.y}
                        textAnchor={props.textAnchor}
                        dominantBaseline={props.dominantBaseline}
                      >
                        {`${(props.percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                />

              <Chart.Legend
                content={<Chart.LegendContent nameKey="id"  />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
              </PieChart>
            </Chart.Container>
          </div>
        )}
      </div>
    </div>
  )
}
