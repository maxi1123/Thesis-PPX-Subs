import { FC, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { ONBOARDING_STATUS } from "../enums/onboarding-status";
import { RoutePropsI } from "./interfaces/route-props";

const PublicRoute: FC<RoutePropsI> = ({ element }) => {
  const authData = useContext(AuthContext);

  return authData.onboardingStatus === ONBOARDING_STATUS.Completed ? (
    <Navigate to="/streams" />
  ) : (
    element
  );
};

export default PublicRoute;
