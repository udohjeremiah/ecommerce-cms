"use client";

import { ElementType } from "react";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useMediaQuery } from "@/hooks/use-media-query";

type Theme = "light" | "dark" | "system";

const icons: Record<Theme, ElementType> = {
  light: SunIcon,
  dark: MoonIcon,
  system: MonitorIcon,
};

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const Icon = icons[(theme ?? "system") as Theme];

  if (isDesktop) {
    return (
      <Tabs defaultValue={theme}>
        <TabsList>
          <TabsTrigger asChild value="light">
            <Button variant="ghost" onClick={() => setTheme("light")}>
              <SunIcon className="h-4 w-4" />
              <span className="sr-only">Light</span>
            </Button>
          </TabsTrigger>
          <TabsTrigger asChild value="dark">
            <Button variant="ghost" onClick={() => setTheme("dark")}>
              <MoonIcon className="h-4 w-4" />
              <span className="sr-only">Dark</span>
            </Button>
          </TabsTrigger>
          <TabsTrigger asChild value="system">
            <Button variant="ghost" onClick={() => setTheme("system")}>
              <MonitorIcon className="h-4 w-4" />
              <span className="sr-only">System</span>
            </Button>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Icon className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
