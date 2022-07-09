import { useEffect, useRef, useState } from "react";
import PrimeReact from "primereact/api";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import {
  AuthContext,
  AuthDataI,
  defaultAuthContext,
} from "./context/auth-context";
import { useAuthStatus } from "./hooks/use-auth-status";
import { ProgressSpinner } from "primereact/progressspinner";
import styles from "./app.module.css";
import AppRoutes from "./routes/app-routes";

PrimeReact.ripple = true;

function App() {
  const [authContext, setAuthContext] = useState<AuthDataI>(defaultAuthContext);

  useAuthStatus(setAuthContext);

  useEffect(() => {
    if (typeof (window as any).ethereum !== "undefined") {
      console.log("MetaMask is installed!");
    }
  });
  return (
    <AuthContext.Provider
      value={{
        ...authContext,
      }}
    >
      <div style={{ height: "100%" }}>
        {authContext === defaultAuthContext && (
          <div className={styles.spinnerWrapper}>
            <ProgressSpinner />
          </div>
        )}
        {authContext !== defaultAuthContext && <AppRoutes />}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
