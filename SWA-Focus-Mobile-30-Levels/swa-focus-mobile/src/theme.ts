import { Platform } from "react-native";
export const focusTheme = {
  background: "#F6F7F0",
  surface: "#FFFDF7",
  ink: "#2B3B2D",
  muted: "#5E6E53",
  green: "#526F43",
  line: "#E2E7D8",
  soft: "#E9EFDF",
  peach: "#F4E8DA",
  blue: "#E6EFF0",
  orange: "#A27857",
  notice: "#8C634A",
  serif: Platform.select({
    ios: "Georgia",
    android: "serif",
    default: "Georgia",
  })!,
  sans: Platform.select({
    ios: "System",
    android: "sans-serif",
    default: "system-ui",
  })!,
};
export type FocusTheme = typeof focusTheme;
