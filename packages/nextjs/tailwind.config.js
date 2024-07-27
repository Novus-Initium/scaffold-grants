/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  styled: true, // include daisyUI colors and design decisions for all components
  utils: true, // adds responsive and modifier utility classes
  prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
  logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
  themeRoot: ":root",
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#008EAF",
"primary-content": "#001016",
"secondary": "#0C7964",
"secondary-content": "#d5e7d1",
"accent": "#3e00ff",
"accent-content": "#cfdaff",
"neutral": "#1b1a1f",
"neutral-content": "#cccbcd",
"base-100": "#e0fffd",
"base-200": "#c3dedc",
"base-300": "#a6bebc",
"base-content": "#121616",
"info": "#40e7b2",
"info-content": "#000c16",
"success": "#00ed6e",
"success-content": "#001404",
"warning": "#ff8b00",
"warning-content": "#160700",
"error": "#ff374b",
"error-content": "#160102",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
      {
        dark: {
          "primary": "#6C877B",
          "primary-content": "#000516",
          "secondary": "#000616",
          "secondary-content": "#d5e7d1",
          "accent": "#ff8000",
          "accent-content": "#000616",
          "neutral": "#222222",
          "neutral-content": "#2C5542",
          "base-100": "#03272b",
          "base-200": "#022024",
          "base-300": "#021a1d",
          "info": "#0080c9",
          "info-content": "#00060f",
          "success": "#85f200",
          "success-content": "#061400",
          "warning": "#ffbf00",
          "warning-content": "#160d00",
          "error": "#f43a57",
          "error-content": "#140103",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--p))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      fontFamily: {
        "bai-jamjuree": ["Bai Jamjuree", "sans-serif"],
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
