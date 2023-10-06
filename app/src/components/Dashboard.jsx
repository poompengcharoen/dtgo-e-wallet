import { createContext, useState } from "react";

import MyWallet from "./MyWallet";
import Scanner from "./Scanner";
import TopUp from "./TopUp";

export const DashboardPanelContext = createContext();

const Dashboard = () => {
  const [panel, setPanel] = useState("my-wallet");

  return (
    <DashboardPanelContext.Provider value={{ panel, setPanel }}>
      {panel === "scanner" ? (
        <Scanner />
      ) : panel === "top-up" ? (
        <TopUp />
      ) : (
        <MyWallet />
      )}
    </DashboardPanelContext.Provider>
  );
};

export default Dashboard;
