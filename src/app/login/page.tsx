"use client";

import { useWixClient } from "@/hooks/useWixClient";
import { LoginState } from "@wix/sdk";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

enum MODE {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  RESET_PASSWORD = "RESET_PASSWORD",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

const LoginPage = () => {
  const getWixClient = useWixClient(); // This returns a Promise
  const router = useRouter();
  const pathName = usePathname();

  const [wixClient, setWixClient] = useState<any>(null); // Initialize with null
  const [mode, setMode] = useState(MODE.LOGIN);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Resolve the Promise and set the client
    const initializeClient = async () => {
      const client = await getWixClient;
      setWixClient(client);
    };

    initializeClient();
  }, [getWixClient]);

  useEffect(() => {
    if (wixClient && wixClient.auth.loggedIn()) {
      router.push("/");
    }
  }, [wixClient, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wixClient) {
      setError("Wix client not initialized.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      let response;

      switch (mode) {
        case MODE.LOGIN:
          response = await wixClient.auth.login({ email, password });
          break;
        case MODE.REGISTER:
          response = await wixClient.auth.register({
            email,
            password,
            profile: { nickname: username },
          });
          break;
        case MODE.RESET_PASSWORD:
          await wixClient.auth.sendPasswordResetEmail(email, `${window.location.origin}${pathName}`);
          setMessage("Password reset email sent. Please check your email.");
          setIsLoading(false);
          return;
        case MODE.EMAIL_VERIFICATION:
          response = await wixClient.auth.processVerification({ verificationCode: emailCode });
          break;
        default:
          throw new Error("Invalid mode");
      }

      if (!response) throw new Error("No response received");

      // Handle login states
      switch (response.loginState) {
        case LoginState.SUCCESS:
          const tokens = await wixClient.auth.getMemberTokensForDirectLogin(response.data.sessionToken!);
          Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), { expires: 2 });
          wixClient.auth.setTokens(tokens);
          router.push("/");
          break;
        case LoginState.EMAIL_VERIFICATION_REQUIRED:
          setMode(MODE.EMAIL_VERIFICATION);
          setMessage("Verification code required. Please check your email.");
          break;
        case LoginState.FAILURE:
          setError("Invalid credentials or action failed.");
          break;
        case LoginState.OWNER_APPROVAL_REQUIRED:
          setMessage("Your account is pending approval.");
          break;
        default:
          throw new Error("Unexpected login state");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold">
          {mode === MODE.LOGIN
            ? "Log in"
            : mode === MODE.REGISTER
            ? "Register"
            : mode === MODE.RESET_PASSWORD
            ? "Reset your password"
            : "Verify your email"}
        </h1>
        {mode === MODE.REGISTER && (
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Your Name"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}
        {mode !== MODE.EMAIL_VERIFICATION ? (
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@example.com"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label htmlFor="emailCode" className="text-sm text-gray-700">
              Verification Code
            </label>
            <input
              type="text"
              name="emailCode"
              placeholder="Enter Code"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => setEmailCode(e.target.value)}
            />
          </div>
        )}
        {(mode === MODE.LOGIN || mode === MODE.REGISTER) && (
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="ring-2 ring-gray-300 rounded-md p-4"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}
        {mode === MODE.LOGIN && (
          <div className="text-sm underline cursor-pointer" onClick={() => setMode(MODE.RESET_PASSWORD)}>
            Forgot Password?
          </div>
        )}
        <button
          className="bg-lama text-white p-2 rounded-md disabled:bg-blue-200 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : mode === MODE.LOGIN ? "Login" : mode === MODE.REGISTER ? "Register" : "Submit"}
        </button>
        {error && <div className="text-red-600">{error}</div>}
        {message && <div className="text-green-600">{message}</div>}
        <div className="text-sm underline cursor-pointer" onClick={() => setMode(MODE.LOGIN)}>
          {mode === MODE.REGISTER || mode === MODE.RESET_PASSWORD
            ? "Back to Login"
            : "Don't have an account? Register here."}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
