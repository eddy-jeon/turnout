import blessed from "blessed";
import { getConfig, setTarget } from "./config";
import { setProxyTarget } from "./proxy";

const GIT_NAME = "Eddy Jeon";
const GIT_EMAIL = "eddy@chequer.io";

export async function tuiLoop() {
  // Create screen
  const screen = blessed.screen({
    smartCSR: true,
    title: "Turnout - Dynamic API Proxy",
  });

  // Layout ratios
  const leftWidth = "30%";
  const rightWidth = "70%";
  const bottomHeight = 3;

  // Left: 주소 목록 + 입력
  const addressBox = blessed.list({
    label: " 주소 목록 ",
    top: 0,
    left: 0,
    width: leftWidth,
    height: `100%-${bottomHeight}`,
    keys: true,
    mouse: true,
    border: "line",
    style: {
      selected: { bg: "blue" },
      border: { fg: "cyan" },
    },
    items: getConfig().recent,
  });

  const inputBox = blessed.textbox({
    bottom: bottomHeight,
    left: 0,
    width: leftWidth,
    height: 3,
    border: "line",
    label: " 주소 추가 ",
    inputOnFocus: true,
    style: { border: { fg: "green" } },
  });

  // Right: 통신 로그
  const logBox = blessed.log({
    label: " 통신 로그 ",
    top: 0,
    left: leftWidth,
    width: rightWidth,
    height: `100%-${bottomHeight}`,
    border: "line",
    style: { border: { fg: "yellow" } },
    scrollable: true,
    alwaysScroll: true,
    mouse: true,
    keys: true,
    vi: true,
  });

  // Bottom bar
  const bottomBar = blessed.box({
    bottom: 0,
    left: 0,
    width: "100%",
    height: bottomHeight,
    style: { bg: "gray", fg: "black" },
    content: ` {bold}${GIT_NAME} <${GIT_EMAIL}>{/bold}   |   q: 종료 `,
    tags: true,
  });

  // Append to screen
  screen.append(addressBox);
  screen.append(inputBox);
  screen.append(logBox);
  screen.append(bottomBar);

  // Focus management
  addressBox.focus();
  screen.key(["tab"], () => {
    if (screen.focused === addressBox) inputBox.focus();
    else if (screen.focused === inputBox) logBox.focus();
    else addressBox.focus();
  });

  // 종료 단축키
  screen.key(["q", "C-c"], () => process.exit(0));

  screen.render();
}
