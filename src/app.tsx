import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { CurrencyInput } from "./components/ui/currency-input";

export function App() {
  return (
    <div className="h-full p-4">
      <div className="flex items-center justify-between gap-4">
        <form className="flex items-center gap-2">
          <Input type="color" />
          <Input />
          <CurrencyInput onChange={console.log} />

          <Button type="submit">Add</Button>
        </form>
        <div>
          <CurrencyInput onChange={console.log} />
        </div>
      </div>
    </div>
  )
}
