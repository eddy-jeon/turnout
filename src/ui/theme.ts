// 사이버펑크 네온 컬러 팔레트 및 256컬러 변환 유틸
export const CYBER = {
  bg: "#0f1021",
  neonBlue: "#00fff7",
  neonPink: "#ff00c8",
  neonYellow: "#ffe600",
  neonPurple: "#a259ff",
  neonGreen: "#39ff14",
  gray: "#23243a",
  white: "#f4f4f4",
};

export function hexTo256Color(hex: string): number {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const r6 = Math.round((r / 255) * 5);
  const g6 = Math.round((g / 255) * 5);
  const b6 = Math.round((b / 255) * 5);
  return 16 + 36 * r6 + 6 * g6 + b6;
}
