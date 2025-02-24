export default {
  breakpoints: {
    desk: 1201,
    laptop: 1025,
    smallLaptop: 769,
    largeMobile: 601,
    mobile: 0,
  },

  theme: {
    dark: "dark",
    darkHighContrast: "dark-high-contrast",
    darkMediumContrast: "dark-medium-contrast",

    light: "light",
    lightHighContrast: "light-high-contrast",
    lightMediumContrast: "light-medium-contrast",
  },

  css: {
    variables: {
      primary: "--md-sys-color-primary",
      onPrimary: "--md-sys-color-on-primary",
      primaryContainer: "--md-sys-color-primary-container",
      onPrimaryContainer: "--md-sys-color-on-primary-container",
      secondary: "--md-sys-color-secondary",
      onSecondary: "--md-sys-color-on-secondary",
      secondaryContainer: "--md-sys-color-secondary-container",
      onSecondaryContainer: "--md-sys-color-on-secondary-container",
      tertiary: "--md-sys-color-tertiary",
      onTertiary: "--md-sys-color-on-tertiary",
      tertiaryContainer: "--md-sys-color-tertiary-container",
      onTertiaryContainer: "--md-sys-color-on-tertiary-container",
      error: "--md-sys-color-error",
      onError: "--md-sys-color-on-error",
      errorContainer: "--md-sys-color-error-container",
      onErrorContainer: "--md-sys-color-on-error-container",
      background: "--md-sys-color-background",
      onBackground: "--md-sys-color-on-background",
      surfaceTint: "--md-sys-color-surface-tint",
      surface: "--md-sys-color-surface",
      onSurface: "--md-sys-color-on-surface",
      surfaceVariant: "--md-sys-color-surface-variant",
      onSurfaceVariant: "--md-sys-color-on-surface-variant",
      outline: "--md-sys-color-outline",
      outlineVariant: "--md-sys-color-outline-variant",
      shadow: "--md-sys-color-shadow",
      scrim: "--md-sys-color-scrim",
      inverseSurface: "--md-sys-color-inverse-surface",
      onInverseSurface: "--md-sys-color-inverse-on-surface",
      inversePrimary: "--md-sys-color-inverse-primary",
      primaryFixed: "--md-sys-color-primary-fixed",
      onPrimaryFixed: "--md-sys-color-on-primary-fixed",
      primaryFixedDIM: "--md-sys-color-primary-fixed-dim",
      onPrimaryFixedVariant: "--md-sys-color-on-primary-fixed-variant",
      secondaryFixed: "--md-sys-color-secondary-fixed",
      onSecondaryFixed: "--md-sys-color-on-secondary-fixed",
      secondaryFixedDIM: "--md-sys-color-secondary-fixed-dim",
      onSecondaryFixedVariant: "--md-sys-color-on-secondary-fixed-variant",
      tertiaryFixed: "--md-sys-color-tertiary-fixed",
      onTertiaryFixed: "--md-sys-color-on-tertiary-fixed",
      tertiaryFixedDIM: "--md-sys-color-tertiary-fixed-dim",
      onTertiaryFixedVariant: "--md-sys-color-on-tertiary-fixed-variant",
      surfaceDIM: "--md-sys-color-surface-dim",
      surfaceBright: "--md-sys-color-surface-bright",
      surfaceContainerLowest: "--md-sys-color-surface-container-lowest",
      surfaceContainerLow: "--md-sys-color-surface-container-low",
      surfaceContainer: "--md-sys-color-surface-container",
      surfaceContainerHigh: "--md-sys-color-surface-container-high",
      surfaceContainerHighest: "--md-sys-color-surface-container-highest",
      extendedColor: "--md-extended-color-custom-color-color",
      extendedOnColor: "--md-extended-color-custom-color-on-color",
      extendedColorContainer:
        "--md-extended-color-custom-color-color-container",
      extendedColorOnContainer:
        "--md-extended-color-custom-color-on-color-container",
    },

    local: {
      shadow: "--smooth-shadow",
      waveTile: "--wave-tile",
      waveTileHover: "--wave-tile-hover",
      waveTilePlayed: "--wave-tile-played",
      waveBackgroundTop: "--wave-background-top",
      waveBackgroundBottom: "--wave-background-bottom",
      bodyHeight: "--body-height",
      bodyWidth: "--body-width",
      contentHeight: "--content-height",
      contentWidth: "--content-width",
      horbarHeight: "--horbar-height",
      horbarWidth: "--horbar-width",
      sidebarHeight: "--sidebar-height",
      sidebarWidth: "--sidebar-width",
    },
    typography: {
      labelSmall: "label-small",
      labelMedium: "label-medium",
      labelLarge: "label-large",
      bodySmall: "body-small",
      bodyMedium: "body-medium",
      bodyLarge: "body-large",
      titleSmall: "title-Small",
      titleMedium: "title-medium",
      titleLarge: "title-large",
      headlineSmall: "headline-small",
      headlineMedium: "headline-medium",
      headlineLarge: "headline-large",
      displaySmall: "display-small",
      displayMedium: "display-medium",
      displayLarge: "display-large",
    },

    state: {
      hover: "hover-state-layer",
      pressed: "pressed-state-layer",
      dragged: "dragged-state-layer",
      focus: "focus-state-layer",
    },

    colors: {
      primary: "primary",
      onPrimary: "on-primary",
      primaryContainer: "primary-container",
      onPrimaryContainer: "on-primary-container",
      secondary: "secondary",
      onSecondary: "on-secondary",
      secondaryContainer: "secondary-container",
      onSecondaryContainer: "on-secondary-container",
      tertiary: "tertiary",
      onTertiary: "on-tertiary",
      tertiaryContainer: "tertiary-container",
      onTertiaryContainer: "on-tertiary-container",
      background: "background",
      surface: "surface",
      surfaceVariant: "surface-variant",
      onSurfaceVariant: "on-surface-variant",
      outline: "outline",
      inverseSurface: "inverse-surface",
      onInverseSurface: "on-inverse-surface",
      inversePrimary: "inverse-primary",
      onInversePrimary: "on-inverse-primary",
      surfaceTint: "surface-tint",
      error: "error",
      onError: "on-error",
      errorContainer: "error-container",
      onErrorContainer: "on-error-container",
      black: "black",
      blackText: "black-text",
      white: "white",
      whiteText: "white-text",
    },

    elevation: {
      elevationZero: "elevation-0",
      elevationOne: "elevation-1",
      elevationTwo: "elevation-2",
      elevationThree: "elevation-3",
      elevationFour: "elevation-4",
      elevationFive: "elevation-5",
    },

    motion: {
      duration50: "duration-50",
      duration100: "duration-100",
      duration150: "duration-150",
      duration200: "duration-200",
      duration250: "duration-250",
      duration300: "duration-300",
      duration350: "duration-350",
      duration400: "duration-400",
      duration450: "duration-450",
      duration500: "duration-500",
      duration550: "duration-550",
      duration600: "duration-600",
      duration700: "duration-700",
      duration800: "duration-800",
      duration900: "duration-900",
      duration1000: "duration-1000",
      ease: "easing-standard",
      easeLinear: "easing-linear",
      easeAccelerate: "easing-standard-accelerate",
      easeDecelerate: "easing-standard-decelerate",
      easeEmphasized: "easing-emphasized",
    },

    shape: {
      none: "shape-none",
      xs: "shape-extra-small",
      s: "shape-small",
      m: "shape-medium",
      l: "shape-large",
      xl: "shape-extra-large",
      xs_top: "extra-small-top",
      l_end: "large-end",
      l_top: "large-top",
      xl_top: "extra-large-top",
    },
  },
};
