import { createContext } from 'react';

interface AuthContext {
  address?: string;
  setAuthContext?: (v: any) => void;
}
export const defaultAuthContext: AuthContext = {};

export const AuthContext = createContext(defaultAuthContext);
