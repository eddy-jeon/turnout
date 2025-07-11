import blessed from "blessed";
import { getConfig, setTarget } from "./config";
import { setProxyTarget, setProxyLogCallback } from "./proxy";
import { createAddressBox } from "./ui/addressList";
import { createLogBox } from "./ui/logBox";
import { createFloatInput } from "./ui/floatInput";
import { createBottomBar } from "./ui/bottomBar";

export async function tuiLoop() {
  const screen = blessed.screen({
    smartCSR: true,
    title: "Turnout - Cyberpunk Proxy",
    fullUnicode: true,
    dockBorders: true,
    warnings: false,
  });

  const leftWidth = "30%";
  const rightWidth = "70%";
  const bottomBarHeight = 3;

  let addressItems = getConfig().recent;
  const addressBox = createAddressBox({
    items: addressItems,
    width: leftWidth,
    height: `100%-${bottomBarHeight}`,
  });
  const logBox = createLogBox({
    left: leftWidth,
    width: rightWidth,
    height: `100%-${bottomBarHeight}`,
  });
  const floatInput = createFloatInput();

  const bottomBar = createBottomBar({
    height: bottomBarHeight,
    width: typeof screen.width === "number" ? screen.width : 80,
  });

  screen.append(addressBox);
  screen.append(logBox);
  screen.append(bottomBar);

  addressBox.focus();

  // addressBox 단축키 핸들러 변수 선언
  const handlerJ = () => {
    addressBox.down(1);
    screen.render();
  };
  const handlerK = () => {
    addressBox.up(1);
    screen.render();
  };
  const handlerL = () => {
    const selectedIdx = (addressBox as any).selected as number;
    const selected = addressBox.getItem(selectedIdx)?.content;
    if (selected) {
      setTarget(selected);
      setProxyTarget(selected);
      logBox.log(
        `{#00fff7-fg}Switched target to:{/} {#ff00c8-fg}${selected}{/}`
      );
    }
  };
  const handlerA = () => {
    floatInput.show();
    screen.append(floatInput); // 항상 최상위로
    floatInput.setValue("");
    floatInput.focus();
    setAddressBoxKeys(false); // 입력 중엔 단축키 비활성화
    screen.render();
  };
  const handlerD = () => {
    const selectedIdx = (addressBox as any).selected as number;
    const selected = addressBox.getItem(selectedIdx)?.content;
    if (selected) {
      // config에서 삭제
      addressItems = addressItems.filter((addr) => addr !== selected);
      // config.recent를 직접 수정 (setTarget이 없으므로 직접 파일 갱신 필요)
      const config = getConfig();
      config.recent = addressItems;
      if (config.target === selected) {
        config.target = addressItems[0] || "";
      }
      require("fs").writeFileSync(
        require("path").resolve(__dirname, "../proxy-config.json"),
        JSON.stringify(config, null, 2),
        "utf-8"
      );
      addressBox.setItems(addressItems);
      addressBox.select(
        Math.max(0, selectedIdx - (selectedIdx === addressItems.length ? 1 : 0))
      );
      logBox.log(`{#ff00c8-fg}Deleted:{/} ${selected}`);
      screen.render();
    }
  };

  function setAddressBoxKeys(enabled: boolean) {
    if (enabled) {
      addressBox.key("j", handlerJ);
      addressBox.key("k", handlerK);
      addressBox.key("l", handlerL);
      addressBox.key("a", handlerA);
      addressBox.key("d", handlerD);
    } else {
      addressBox.unkey("j", handlerJ);
      addressBox.unkey("k", handlerK);
      addressBox.unkey("l", handlerL);
      addressBox.unkey("a", handlerA);
      addressBox.unkey("d", handlerD);
    }
  }
  setAddressBoxKeys(true);

  setProxyLogCallback((msg: string) => {
    logBox.log(`{bold}${msg}{/bold}`);
    logBox.setScrollPerc(100);
    logBox.screen.render();
  });

  // 종료 단축키: floatInput 포커스 시 무시
  screen.key(["q", "C-c"], () => {
    if (screen.focused === floatInput) return;
    process.exit(0);
  });

  floatInput.on("submit", (value: string) => {
    floatInput.hide();
    setAddressBoxKeys(true); // 입력 끝나면 단축키 복구
    if (value && !addressItems.includes(value)) {
      setTarget(value); // config에 추가
      addressItems = getConfig().recent; // config에서 최신 목록 불러오기
      addressBox.setItems(addressItems);
      addressBox.select(0); // 새로 추가된 항목 포커싱
      setProxyTarget(value);
      logBox.log(
        `{#ffe600-fg}Added and switched to:{/} {#ff00c8-fg}${value}{/}`
      );
    } else if (value && addressItems.includes(value)) {
      const idx = addressItems.indexOf(value);
      addressBox.select(idx);
      setTarget(value);
      setProxyTarget(value);
      logBox.log(`{#00fff7-fg}Switched target to:{/} {#ff00c8-fg}${value}{/}`);
    }
    addressBox.focus();
    screen.render();
  });

  floatInput.on("cancel", () => {
    floatInput.hide();
    setAddressBoxKeys(true); // 입력 끝나면 단축키 복구
    addressBox.focus();
    screen.render();
  });

  screen.render();
}
