import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {

    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      }
    },

    extend: {
      colors: {
        background: "#000000"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
