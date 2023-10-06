import { createContext, useState } from "react";

import Forgot from "./Forgot";
import Login from "./Login";
import Register from "./Register";

export const AuthPanelContext = createContext();

const LoginRegister = () => {
  const [panel, setPanel] = useState("login");

  return (
    <AuthPanelContext.Provider value={{ panel, setPanel }}>
      {panel === "login" ? (
        <Login />
      ) : panel === "forgot" ? (
        <Forgot />
      ) : (
        <Register />
      )}
    </AuthPanelContext.Provider>
  );
};

export default LoginRegister;
