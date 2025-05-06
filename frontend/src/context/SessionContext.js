import React, { createContext, useState, useContext, useEffect } from 'react';
import SessionExpired from '../components/SessionExpired';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [sessionExpired, setSessionExpired] = useState(false);

  // Listen for session expiration event from axios
  useEffect(() => {
    const handleExpire = () => setSessionExpired(true);
    window.addEventListener('session-expired', handleExpire);

    return () => window.removeEventListener('session-expired', handleExpire);
  }, []);

  return (
    <SessionContext.Provider value={{ sessionExpired, setSessionExpired }}>
      {sessionExpired && <SessionExpired />}
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);