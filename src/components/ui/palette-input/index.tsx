import { useEffect, useState } from "react";

import { Popover } from "../popover";

type PaletteInputProps = {
    onChange?: (rgba: string) => void
    value?: string
    options: string[]
    defaultValue?: string
}

export function PaletteInput({
  options,
  onChange,
  value: outsideValue,
  defaultValue = options[0],
}: PaletteInputProps) {
  const [color, setColor] = useState(defaultValue);

  function onSelectColor (color: string) {
    return () => {
        setColor(color);
        onChange?.(color)
    }
  };

  useEffect(() => {
    setColor(outsideValue ?? defaultValue);
  }, [outsideValue]);

  return (
    <Popover.Provider>
        <Popover.Trigger>
          <>
            <div
                className="size-10 rounded-sm"
                style={{ background: color }}
            />

            <input type="color" value={color} readOnly className="hidden" />
          </>
        </Popover.Trigger>

        <Popover.Content>
            <div className="flex flex-wrap">
                {options.map(color => <button key={color} className="h-10 grow basis-10" style={{ background: color }} onClick={onSelectColor(color)} />)}
            </div>
        </Popover.Content>
    </Popover.Provider>

  );
}
