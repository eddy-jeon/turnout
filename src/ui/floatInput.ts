import blessed from "blessed";
import { CYBER, hexTo256Color } from "./theme";

// Global state for floatInput custom properties
const floatInputState: Record<string, any> = {};

export function setFloatInputState(key: string, value: any) {
  floatInputState[key] = value;
}

export function getFloatInputState<T = any>(key: string): T | undefined {
  return floatInputState[key];
}

export function createFloatInput(opts?: {
  label?: string;
}): blessed.Widgets.TextboxElement {
  return blessed.textbox({
    top: "center",
    left: "center",
    width: "50%",
    height: 3,
    border: { type: "line", fg: hexTo256Color(CYBER.neonGreen) },
    label: opts?.label ?? " {#39ff14-fg}Add Address{/} ",
    inputOnFocus: true,
    style: {
      fg: CYBER.neonPink,
      border: { fg: hexTo256Color(CYBER.neonGreen) },
      focus: { border: { fg: hexTo256Color(CYBER.neonYellow) } },
      bold: true,
    },
    hidden: true,
    tags: true,
  });
}
