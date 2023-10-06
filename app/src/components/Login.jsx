import { useContext, useState } from "react";

import { AuthContext } from "../App";
import { AuthPanelContext } from "./LoginRegister";
import axios from "axios";
import { decodeToken } from "react-jwt";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const { setPanel } = useContext(AuthPanelContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    if (username === "") {
      setError("Please enter a username!");
      setIsLoading(false);
      return;
    }

    if (password === "") {
      setError("Please enter a password");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/users/login", {
        username,
        password,
      });

      if (res.status === 200 && res.data.token) {
        setTimeout(() => {
          setIsLoading(false);
          setUser({
            jwt: res.data.token,
            data: decodeToken(res.data.token),
          });
          localStorage.setItem(
            "user",
            JSON.stringify({
              jwt: res.data.token,
              data: decodeToken(res.data.token),
            })
          );
          console.log("Logged in successfully");
        }, 1000);
      }
    } catch (error) {
      setIsLoading(false);
      setError("Login failed. Please try again.");
      console.error("Login error:", error);

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
            Log in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-500"
                onClick={() => setPanel("forgot")}
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleLogin}
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
                "Log in"
              )}
            </button>
            <div className="text-sm text-center mt-4">
              <button
                type="button"
                onClick={() => setPanel("register")}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Register an account
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
