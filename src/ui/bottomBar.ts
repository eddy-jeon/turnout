import blessed from "blessed";
import { CYBER, hexTo256Color } from "./theme";
import { userinfo } from "../user-info";

export function createBottomBar(opts: {
  height: number;
  width: number;
  shortcuts: string;
}): blessed.Widgets.BoxElement & { setShortcuts: (shortcuts: string) => void } {
  const screenWidth = opts.width;
  let shortcuts = opts.shortcuts;
  const userinfoLen = userinfo.replace(/\{.*?\}/g, "").length;

  function getContent(shortcuts: string) {
    const shortcutsLen = shortcuts.replace(/\{.*?\}/g, "").length;
    const pad = Math.max(1, screenWidth - shortcutsLen - userinfoLen - 2);
    return `${shortcuts}${" ".repeat(pad)}${userinfo}`;
  }

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
    content: getContent(shortcuts),
  }) as blessed.Widgets.BoxElement & {
    setShortcuts: (shortcuts: string) => void;
  };

  bar.setShortcuts = (newShortcuts: string) => {
    shortcuts = newShortcuts;
    bar.setContent(getContent(shortcuts));
    bar.screen.render();
  };

  return bar;
}
