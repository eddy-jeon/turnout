import blessed from "blessed";
import { CYBER, hexTo256Color } from "./theme";

export function createLogBox(opts: {
  top?: number | string;
  left?: number | string;
  width?: number | string;
  height?: number | string;
}): blessed.Widgets.Log {
  return blessed.log({
    label: " ⚡ Proxy Log ",
    top: opts.top ?? 0,
    left: opts.left ?? "30%",
    width: opts.width ?? "70%",
    height: opts.height ?? "100%-1",
    border: { type: "line", fg: hexTo256Color(CYBER.neonYellow) },
    style: {
      fg: CYBER.neonYellow,
      border: { fg: CYBER.neonYellow },
      focus: { border: { fg: CYBER.neonPink } },
      scrollbar: { bg: CYBER.neonPink },
    },
    scrollable: true,
    alwaysScroll: true,
    mouse: true,
    keys: true,
    vi: true,
    tags: true,
  });
}
