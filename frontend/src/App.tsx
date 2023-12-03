import Home from "./components/Home";
import Dockyard from "./components/Dockyard";

import { createHashRouter, Outlet, RouterProvider } from "react-router-dom";

function Root() {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}

function App() {
  const router = createHashRouter([
    {
      children: [
        { element: <Home />, path: "/" },
        { element: <Dockyard />, path: "/dockyard" },
      ],
      element: <Root />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
