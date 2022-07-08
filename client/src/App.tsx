import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import PrimeReact from "primereact/api";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import Home from "./pages/home/home";
import Onboarding from "./pages/onboarding/onboarding";
import Streams from "./pages/streams/streams";
import {
  AuthContext,
  AuthDataI,
  defaultAuthContext,
} from "./context/auth-context";
import { useAuthStatus } from "./hooks/use-auth-status";
import { ProgressSpinner } from "primereact/progressspinner";
import styles from "./app.module.css";

PrimeReact.ripple = true;

function App() {
  const [authContext, setAuthContext] = useState<AuthDataI>(defaultAuthContext);

  useAuthStatus(setAuthContext);

  useEffect(() => {
    if (typeof (window as any).ethereum !== "undefined") {
      console.log("MetaMask is installed!");
    }
    console.log(authContext);
  });
  return (
    <div>
      {authContext === defaultAuthContext && (
        <div className={styles.spinnerWrapper}>
          <ProgressSpinner />
        </div>
      )}
      {authContext !== defaultAuthContext && (
        <AuthContext.Provider
          value={{
            ...authContext,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/streams" element={<Streams />} />
          </Routes>
        </AuthContext.Provider>
      )}
    </div>
  );
}

export default App;
