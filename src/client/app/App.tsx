import React from "preact";

import { Suspense } from "preact/compat";
import { Route, Switch, useLocation } from "wouter-preact";

import { WelcomePage, UpdatePage, HomePage, NotFoundPage } from "./screens";
import { Nav } from "./components";

const FallbackCard = () => "Loading...";

export const App = () => {
  const [ currentLocation, setLocation ] = useLocation();

  // const cachedLocation = CacheService.getUserCache().get("location") ?? "/";
  // if (cachedLocation == "") {
  //   setLocation("/");
  // } else {
  //   setLocation(cachedLocation);
  // }
  // useCallback(() => {
  //   CacheService.getUserCache().put("cachedLocation", currentLocation);
  // }, [currentLocation]);
  // useEffect(() => CacheService.getUserCache().put("cachedLocation", currentLocation));

  return (
    <>
      <nav>
        <Nav />
      </nav>
      <main>
        <Suspense fallback={FallbackCard}>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/update/:action" component={UpdatePage} />
            <Route path="/welcome" component={WelcomePage} />

            {/* will match everything else */}
            <Route component={NotFoundPage} />
          </Switch>
        </Suspense>
      </main>
    </>
  )
};