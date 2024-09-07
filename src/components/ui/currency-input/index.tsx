import * as React from "react"

import { Input } from "../input"

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    onChange: (value: string) => void
  }

function CurrencyInput({ type, onChange, ...props }: InputProps) {
  const [value, setValue] = React.useState("0")

  function formatInput(value: string) {

    value = value.replace(/\D/g, '');

    if (value.length == 1) 
      value = ('0' + value);

    value = value.replace(/(\d{2}$)/, '.$1');

    return Number(`${value}`).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function formatOutput(value: string) {
    return value.replace(/\D/g, '').replace(/(\d{2}$)/, '.$1');
  }

  function onValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = formatOutput(e.target.value)

    setValue(value)
    onChange(value)
  }

  return (
    <Input
      type={type}
      value={formatInput(value)}
      onChange={onValueChange}
      {...props}
    />
  )
}


export { CurrencyInput }
