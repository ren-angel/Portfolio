export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { heading: ["var(--font-heading)"], body: ["var(--font-body)"] },
      colors: Object.fromEntries(
        ["background", "foreground", "border", "primary", "primary-foreground", "input", "accent", "accent-foreground", "muted-foreground"]
          .map((name) => [name, `hsl(var(--${name}) / <alpha-value>)`])
      ),
    },
  },
};
