import { createContext } from "react";
import { ONBOARDING_STATUS } from "../enums/onboarding-status";

export interface AuthDataI {
  selectedAddress: string;
  onboardingStatus: ONBOARDING_STATUS;
}

const defaultAuthContext: AuthDataI = {
  selectedAddress: "",
  onboardingStatus: ONBOARDING_STATUS.Unboarded,
};

const AuthContext = createContext<AuthDataI>(defaultAuthContext);

export { defaultAuthContext, AuthContext };
