import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { PublicRoutesConfig, PrivateRoutesConfig } from "./routes-config";
import PublicRoute from "./public-route";
import PrivateRoute from "./private-routes";

const AppRoutes: FC = () => {
  return (
    <Routes>
      {PublicRoutesConfig.map(({ title, path, element: Component }) => (
        <Route
          key={`${title}-${path}`}
          path={path}
          element={<PublicRoute element={<Component />} />}
        />
      ))}
      {PrivateRoutesConfig.map(({ title, path, element: Component }) => (
        <Route
          key={`${title}-${path}`}
          path={path}
          element={<PrivateRoute element={<Component />} />}
        />
      ))}
    </Routes>
  );
};

export default AppRoutes;
