import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["JetBrains Mono", "monospace"],
      },
      colors: {
        "rosewater-light": "#dc8a78",
        "rosewater-dark": "#f5e0dc",
        "flamingo-light": "#dd7878",
        "flamingo-dark": "#f2cdcd",
        "pink-light": "#ea76cb",
        "pink-dark": "#f5c2e7",
        "mauve-light": "#8839ef",
        "mauve-dark": "#cba6f7",
        "red-light": "#d20f39",
        "red-dark": "#f38ba8",
        "maroon-light": "#e64553",
        "maroon-dark": "#eba0ac",
        "peach-light": "#fe640b",
        "peach-dark": "#fab387",
        "yellow-light": "#df8e1d",
        "yellow-dark": "#f9e2af",
        "green-light": "#40a02b",
        "green-dark": "#a6e3a1",
        "teal-light": "#179299",
        "teal-dark": "#94e2d5",
        "sky-light": "#04a5e5",
        "sky-dark": "#89dceb",
        "sapphire-light": "#209fb5",
        "sapphire-dark": "#74c7ec",
        "blue-light": "#74c7ec",
        "blue-dark": "#89b4fa",
        "lavender-light": "#7287fd",
        "lavender-dark": "#b4befe",

        "text-light": "#4c4f69",
        "text-dark": "#cdd6f4",
        "sub-light": "#5c5f77",
        "sub-dark": "#bac2de",
        "sub-secondary-light": "#6c6f85",
        "sub-secondary-dark": "#a6adc8",

        "overlay-light": "#7c7f93",
        "overlay-dark": "#9399b2",
        "overlay-secondary-light": "#8c8fa1",
        "overlay-secondary-dark": "#7f849c",
        "overlay-tertiary-light": "#9ca0b0",
        "overlay-tertiary-dark": "#6c7086",

        "surface-light": "#acb0be",
        "surface-dark": "#585b70",
        "surface-secondary-light": "#bcc0cc",
        "surface-secondary-dark": "#45475a",
        "surface-tertiary-light": "#ccd0da",
        "surface-tertiary-dark": "#313244",

        "base-light": "#eff1f5",
        "base-dark": "#1e1e2e",

        "mantle-light": "#e6e9ef",
        "mantle-dark": "#181825",

        "crust-light": "#dce0e8",
        "crust-dark": "#11111b",
      },
    },
  },
  plugins: [],
} satisfies Config;
