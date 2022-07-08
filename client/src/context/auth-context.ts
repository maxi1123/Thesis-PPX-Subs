import { createContext } from "react";
import { OnboardingStatus } from "../enums/onboarding-status";

export interface AuthDataI {
  selectedAddress: string;
  onboardingStatus: OnboardingStatus;
}

const defaultAuthContext: AuthDataI = {
  selectedAddress: "",
  onboardingStatus: OnboardingStatus.Unboarded,
};

const AuthContext = createContext<AuthDataI>(defaultAuthContext);

export { defaultAuthContext, AuthContext };
