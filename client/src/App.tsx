import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import PrimeReact from 'primereact/api';
import 'primereact/resources/themes/bootstrap4-dark-blue/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import Home from './pages/Home/Home';
import Onboarding from './pages/Onboarding/Onboarding';
import Streams from './pages/Streams/Streams';

import { defaultAuthContext, AuthContext } from './context/AuthContext';

PrimeReact.ripple = true;

function App() {
  const [authContext, setAuthContext] = useState(defaultAuthContext);
  useEffect(() => {
    if (typeof (window as any).ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{ ...authContext, setAuthContext: (v) => setAuthContext(v) }}
    >
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/streams" element={<Streams />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
