import { useContext, useState } from "react";

import { AuthContext } from "../App";
import { DashboardPanelContext } from "./Dashboard";
import axios from "axios";

const TopUp = () => {
  const { setPanel } = useContext(DashboardPanelContext);

  const {
    user: { jwt },
  } = useContext(AuthContext);

  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isNumeric = (str) => {
    if (typeof str != "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
  };

  const handleBack = () => setPanel("my-wallet");

  const handleTopUp = async () => {
    setIsLoading(true);
    setError("");

    if (amount === 0 || !isNumeric(amount)) {
      setError("No amount to pay!");
      setIsLoading(false);
      return;
    }

    if (typeof amount === "string")
      try {
        const res = await axios.post(
          "http://localhost:3001/wallet/top-up",
          {
            amount: parseFloat(amount),
          },
          {
            headers: {
              Authorization: jwt,
            },
          }
        );

        if (res.status === 200) {
          setTimeout(() => {
            setIsLoading(false);
            console.log("Top-up successfully");
            handleBack();
          }, 1000);
        }
      } catch (error) {
        setIsLoading(false);
        setError("Top-up failed. Please try again.");
        console.error("Top-up error:", error);

        if (error.response.data.error) {
          setError(error.response.data.error);
        }
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Enter an amount to top-up
          </h2>
        </div>

        <div>
          <input
            id="amount"
            name="amount"
            type="number"
            autoComplete="number"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="mt-6">
            <button
              type="button"
              onClick={handleTopUp}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 8.962 0 014 12H0c0 3.042 1.199 5.874 3.366 8.034l2.27-2.744z"
                  ></path>
                </svg>
              ) : (
                "Top-Up"
              )}
            </button>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            This top-up feature is for testing purpose. It works and functions
            similarly to how you would deposit your money into your bank
            account.
          </p>
        </div>

        <div className="mt-8 space-x-4 flex justify-center">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopUp;
