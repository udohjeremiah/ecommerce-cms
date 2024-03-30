export const routes = [
  {
    href: "",
    label: "Overview",
    active: (pathName: string, route: string) => pathName === route,
  },
  {
    href: "billboards",
    label: "Billboards",
    active: (pathName: string, route: string) => pathName.startsWith(route),
  },
  {
    href: "categories",
    label: "Categories",
    active: (pathName: string, route: string) => pathName.startsWith(route),
  },
  {
    href: "sizes",
    label: "Sizes",
    active: (pathName: string, route: string) => pathName.startsWith(route),
  },
  {
    href: "colors",
    label: "Colors",
    active: (pathName: string, route: string) => pathName.startsWith(route),
  },
  {
    href: "settings",
    label: "Settings",
    active: (pathName: string, route: string) => pathName.startsWith(route),
  },
];
