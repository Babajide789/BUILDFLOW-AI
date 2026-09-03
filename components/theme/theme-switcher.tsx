"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const themes = [
  {
    value: "light",
    label: "Light",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    icon: Monitor,
  },
] as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const currentTheme =
    themes.find((item) => item.value === theme) ?? themes[2];

  const Icon = currentTheme.icon;

  return (
    <label className="relative">
      <span className="sr-only">
        Select theme
      </span>

      <select
        value={theme ?? "system"}
        onChange={(event) => setTheme(event.target.value)}
        aria-label="Select theme"
        className="h-10 appearance-none rounded-md border border-border bg-background pl-9 pr-8 text-sm font-medium text-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        {themes.map((item) => (
          <option
            key={item.value}
            value={item.value}
          >
            {item.label}
          </option>
        ))}
      </select>

      <Icon
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </label>
  );
}