import { Platform } from "react-native";

// Font utility for platform-specific font selection
export const getFontFamily = (baseFontName: string) => {
  // For most cases, you can use the same font across platforms
  // But if you need platform-specific fonts, you can do:

  switch (baseFontName) {
    case "SFPro":
      return Platform.select({
        ios: "SFPro", // or 'SF Pro Display' if using system font
        android: "SFPro",
        default: "SFPro",
      });

    case "SpaceMono":
      return Platform.select({
        ios: "SpaceMono",
        android: "SpaceMono",
        default: "SpaceMono",
      });

    default:
      return Platform.select({
        ios: "System", // iOS system font
        android: "Roboto", // Android system font
        default: "System",
      });
  }
};

// Pre-defined font families for easy use
export const FontFamilies = {
  primary: getFontFamily("SFPro"),
  monospace: getFontFamily("SpaceMono"),
  system: getFontFamily("system"),
};

// Font weights that work across platforms
export const FontWeights = {
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  heavy: "800" as const,
};
