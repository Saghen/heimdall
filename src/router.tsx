import { useRoutes } from "raviger";
import { Header } from "./components/Header";

import Home from "@views/Home";
import Watch from "@views/Watch";
import Search from "./views/Search";

const routes = {
  "/": () => <Home />,
  "/w/:id": ({ id }) => <Watch id={id} />,
  "/s/:query": ({ query }) => <Search query={query} />,
};

export function Router() {
  const Route = useRoutes(routes);
  return (
    <>
      <Header />
      <Route />
    </>
  );
}
