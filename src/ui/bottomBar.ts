import blessed from "blessed";
import { CYBER, hexTo256Color } from "./theme";
import { shortcuts } from "../keymap";
import { userinfo } from "../user-info";

export function createBottomBar(opts: {
  height: number;
  width: number;
}): blessed.Widgets.BoxElement {
  const screenWidth = opts.width;
  const shortcutsLen = shortcuts.replace(/\{.*?\}/g, "").length;
  const userinfoLen = userinfo.replace(/\{.*?\}/g, "").length;
  const pad = Math.max(1, screenWidth - shortcutsLen - userinfoLen - 2);
  const content = `${shortcuts}${" ".repeat(pad)}${userinfo}`;

  const bar = blessed.box({
    bottom: 0,
    left: 0,
    width: "100%",
    height: opts.height ?? 1,
    style: {
      fg: CYBER.neonYellow,
      bold: true,
      border: { fg: CYBER.neonPink },
    },
    tags: true,
    border: { type: "line", fg: hexTo256Color(CYBER.neonPink) },
    content,
  });

  return bar;
}
