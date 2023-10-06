import { createContext, useEffect, useState } from "react";

import Dashboard from "./components/Dashboard";
import LoginRegister from "./components/LoginRegister";
import { decodeToken } from "react-jwt";

export const AuthContext = createContext();

const App = () => {
  const [user, setUser] = useState(null);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload(false);
  };

  const isTokenExpired = (token) => {
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (token && token.exp) {
      return token.exp < currentTimestamp;
    }

    return true;
  };

  const loadExistingSession = () => {
    const sessionUserStr = localStorage.getItem("user");
    if (sessionUserStr) {
      const sessionUser = JSON.parse(sessionUserStr);
      const tokenData = decodeToken(sessionUser.jwt);
      const isExpired = isTokenExpired(tokenData);

      if (isExpired) {
        logout();
      } else {
        setUser(sessionUser);
      }
    }
  };

  useEffect(() => {
    loadExistingSession();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <div className="absolute top-5 left-5">
        <div className="text-center text-4xl text-indigo-600 font-extrabold">
          {user?.data?.username && (
            <span className="italic font-serif">
              {user?.data?.username + "'s"}{" "}
            </span>
          )}
          E-Wallet
        </div>
      </div>
      {user && (
        <div className="absolute top-5 right-5">
          <button
            type="button"
            onClick={() => logout()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Log Out
          </button>
        </div>
      )}
      {user ? <Dashboard /> : <LoginRegister />}
    </AuthContext.Provider>
  );
};

export default App;
