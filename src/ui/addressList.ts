import blessed from "blessed";
import { CYBER, hexTo256Color } from "./theme";

export function createAddressBox({
  items,
  width,
  height,
}: {
  items: string[];
  width: string;
  height: string;
}): blessed.Widgets.ListElement {
  return blessed.list({
    label: "  Address List ",
    top: 0,
    left: 0,
    width,
    height,
    keys: false,
    mouse: true,
    border: { type: "line", fg: hexTo256Color(CYBER.neonBlue) },
    style: {
      fg: CYBER.neonBlue,
      selected: {
        bg: CYBER.neonPink, // 확실한 네온핑크 배경
        fg: CYBER.white,
        bold: true,
      },
      item: { fg: CYBER.neonBlue },
      border: { fg: CYBER.neonBlue },
      focus: { border: { fg: CYBER.neonPink } },
    },
    items,
    vi: false,
    tags: true,
  });
}
