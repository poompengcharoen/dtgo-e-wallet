import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../App";
import { DashboardPanelContext } from "./Dashboard";
import QRCode from "react-qr-code";
import axios from "axios";

const MyWallet = () => {
  const { setPanel } = useContext(DashboardPanelContext);

  const {
    user: {
      jwt,
      data: { username },
    },
  } = useContext(AuthContext);

  const [balance, setBalance] = useState(0);

  const fetchBalance = async () => {
    try {
      const res = await axios.get("http://localhost:3001/wallet/balance", {
        headers: {
          Authorization: jwt,
        },
      });

      if (res.status === 200) {
        setBalance(res.data.balance);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    // Fetch the user's balance when the component mounts
    fetchBalance();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            My Wallet
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Balance: ${balance.toFixed(2)} {/* Display the balance */}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-center">
            <QRCode value={username} />
          </div>
          <div className="text-center text-xs text-gray-600 mt-4">
            Scan QR code above to pay me!
          </div>
        </div>

        <div className="mt-8 space-x-4 flex justify-center">
          <button
            type="button"
            onClick={() => setPanel("scanner")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Scan to Pay
          </button>
          <button
            type="button"
            onClick={() => setPanel("top-up")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Top-Up
          </button>
          <button
            type="button"
            onClick={() => fetchBalance()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyWallet;
