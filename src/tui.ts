import blessed from "blessed";
import { getConfig, setTarget } from "./config";
import { setProxyTarget, setProxyLogCallback } from "./proxy";
import { createAddressBox } from "./ui/addressList";
import { createLogBox } from "./ui/logBox";
import {
  createFloatInput,
  setFloatInputState,
  getFloatInputState,
} from "./ui/floatInput";
import { createBottomBar } from "./ui/bottomBar";
import { keymap } from "./keymap";

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

  // Helper: Render shortcut string for bottom bar
  function renderShortcuts(box: "addressBox" | "logBox") {
    const colorMap = [
      "#00fff7", // neon cyan
      "#ff00c8", // neon pink
      "#ffe600", // neon yellow
      "#a259ff", // purple
      "#39ff14", // green
    ];
    const km = keymap[box];
    const global = keymap.global;
    return (
      km
        .map(
          (item, i) =>
            `{bold}{${colorMap[i % colorMap.length]}-fg}${item.key}:{/}{${
              colorMap[(i + 1) % colorMap.length]
            }-fg}${item.desc}{/}{/bold}`
        )
        .join("  ") +
      "  " +
      global
        .map(
          (item, i) =>
            `{bold}{${colorMap[(i + 3) % colorMap.length]}-fg}${item.key}:{/}{${
              colorMap[(i + 4) % colorMap.length]
            }-fg}${item.desc}{/}{/bold}`
        )
        .join("  ")
    );
  }

  let focusedBox: "addressBox" | "logBox" = "addressBox";
  const bottomBar = createBottomBar({
    height: bottomBarHeight,
    width: typeof screen.width === "number" ? screen.width : 80,
    shortcuts: renderShortcuts(focusedBox),
  });

  screen.append(addressBox);
  screen.append(logBox);
  screen.append(bottomBar);

  addressBox.focus();

  function updateBottomBarShortcuts() {
    bottomBar.setShortcuts(renderShortcuts(focusedBox));
  }

  addressBox.on("focus", () => {
    focusedBox = "addressBox";
    updateBottomBarShortcuts();
  });
  logBox.on("focus", () => {
    focusedBox = "logBox";
    updateBottomBarShortcuts();
  });

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
  const handlerI = () => {
    const selectedIdx = (addressBox as any).selected as number;
    const selected = addressBox.getItem(selectedIdx)?.content;
    if (selected) {
      floatInput.show();
      screen.append(floatInput);
      floatInput.setValue(selected);
      floatInput.focus();
      setFloatInputState("editingForIdx", selectedIdx); // 글로벌 상태에 저장
      setAddressBoxKeys(false);
      screen.render();
    }
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

  // keymap.addressBox의 key값을 핸들러에 매핑
  const addressBoxKeyHandlers: Record<string, () => void> = {
    j: handlerJ,
    k: handlerK,
    l: handlerL,
    a: handlerA,
    i: handlerI,
    d: handlerD,
    // 확장 가능
  };

  function setAddressBoxKeys(enabled: boolean) {
    if (enabled) {
      for (const item of keymap.addressBox) {
        if (addressBoxKeyHandlers[item.key]) {
          addressBox.key(item.key, addressBoxKeyHandlers[item.key]);
        }
      }
    } else {
      for (const item of keymap.addressBox) {
        if (addressBoxKeyHandlers[item.key]) {
          addressBox.unkey(item.key, addressBoxKeyHandlers[item.key]);
        }
      }
    }
  }
  setAddressBoxKeys(true);

  // logBox 단축키 핸들러 변수 선언 및 바인딩
  const logBoxKeyHandlers: Record<string, () => void> = {
    c: () => {
      (logBox as any).clear();
      screen.render();
    },
    // 확장 가능: j, k, g, G, PgUp, PgDn 등은 blessed가 자체 처리
  };

  function setLogBoxKeys(enabled: boolean) {
    if (enabled) {
      for (const item of keymap.logBox) {
        if (logBoxKeyHandlers[item.key]) {
          logBox.key(item.key, logBoxKeyHandlers[item.key]);
        }
      }
    } else {
      for (const item of keymap.logBox) {
        if (logBoxKeyHandlers[item.key]) {
          logBox.unkey(item.key, logBoxKeyHandlers[item.key]);
        }
      }
    }
  }
  setLogBoxKeys(true);

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

  // Tab 키로 addressBox <-> logBox 포커스 전환 (floatInput 입력 중엔 무시)
  screen.key(["tab"], () => {
    if (screen.focused === floatInput) return;
    if (screen.focused === addressBox) {
      logBox.focus();
    } else {
      addressBox.focus();
    }
    screen.render();
  });

  floatInput.on("submit", (value: string) => {
    floatInput.hide();
    setAddressBoxKeys(true); // 입력 끝나면 단축키 복구
    // 수정 모드인지 확인
    const editIdx = getFloatInputState<number>("editingForIdx");
    setFloatInputState("editingForIdx", undefined);
    if (typeof editIdx === "number") {
      // 수정 모드
      const oldValue = addressItems[editIdx];
      if (!value || value === oldValue) {
        addressBox.focus();
        screen.render();
        return;
      }
      if (addressItems.includes(value)) {
        logBox.log(`{#ff00c8-fg}Already exists:{/} ${value}`);
        addressBox.focus();
        screen.render();
        return;
      }
      addressItems[editIdx] = value;
      // config.recent를 직접 수정
      const config = getConfig();
      config.recent = addressItems;
      if (config.target === oldValue) {
        config.target = value;
      }
      require("fs").writeFileSync(
        require("path").resolve(__dirname, "../proxy-config.json"),
        JSON.stringify(config, null, 2),
        "utf-8"
      );
      addressBox.setItems(addressItems);
      addressBox.select(editIdx);
      setTarget(value);
      setProxyTarget(value);
      logBox.log(
        `{#ffe600-fg}Edited:{/} {#ff00c8-fg}${oldValue}{/} → {#00fff7-fg}${value}{/}`
      );
      addressBox.focus();
      screen.render();
      return;
    }
    // 추가/기존 로직
    if (value && !addressItems.includes(value)) {
      setTarget(value);
      addressItems = getConfig().recent;
      addressBox.setItems(addressItems);
      addressBox.select(0);
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
