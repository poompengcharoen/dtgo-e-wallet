import { useContext, useState } from "react";

import { AuthPanelContext } from "./LoginRegister";

const Forgot = () => {
  const { setPanel } = useContext(AuthPanelContext);

  const [username, setUsername] = useState(""); // Change 'email' to 'username'
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleBack = () => setPanel("login");

  const handleResetPassword = async () => {
    if (!username) {
      setError("Please enter a username!");
      return;
    }

    setIsEmailSent(true);
    alert(
      "Sorry! This page is mocking only. Its function is not yet implemented."
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot Your Password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your username, and we&apos;ll send you a password reset link.
          </p>
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
                type="text" // Change 'type' to 'text' for the username
                autoComplete="username" // You can use 'username' as the autoComplete value
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username" // Change placeholder text
                value={username} // Update to the 'username' state
                onChange={(e) => setUsername(e.target.value)} // Update state variable and event handler
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {isEmailSent ? (
            <div>
              <div className="text-green-500 text-center">
                We&apos;ve sent you an email with instructions to reset your
                password.
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
          ) : (
            <div>
              <button
                type="button"
                onClick={handleResetPassword}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reset Password
              </button>
              <div className="text-sm text-center mt-4">
                <button
                  type="button"
                  onClick={() => setPanel("login")}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Log in to an existing account
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Forgot;
