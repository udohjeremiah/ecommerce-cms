import { useMounted } from "@/hooks/use-mounted";

export function useWindowOrigin() {
  const isMounted = useMounted();

  if (!isMounted) {
    return "";
  }

  return window.location.origin;
}
