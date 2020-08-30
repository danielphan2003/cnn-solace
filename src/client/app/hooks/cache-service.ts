import { useState, useEffect } from "preact/compat";
import useLocation from "wouter-preact/use-location";

export const useCachedLocation = () => {
  const [ currentLocation, setLocation ] = useLocation();
  const [ cachedLocation, setCachedLocation ] = useState(CacheService.getUserCache().get("cachedLocation"));
  // const prevCachedLocation = useRef

  useEffect(() => {
    return () => CacheService.getUserCache().put("cachedLocation", currentLocation);

  }, [currentLocation]);

  return cachedLocation;
}