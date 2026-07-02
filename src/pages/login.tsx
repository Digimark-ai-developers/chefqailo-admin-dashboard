import { type FormEvent, useEffect, useState } from "react";

import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import LoginIconImg from "@/assets/img/login2.svg";
import LoginImg from "@/assets/img/login.svg";
import ModeToggle from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import CustomToast from "@/components/ui/custom-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  clearAdminSession,
  extractAdminAccessToken,
  extractAdminEmail,
  extractAdminRefreshToken,
  isAdminAuthenticated,
  setAdminSession,
} from "@/lib/admin-auth";
import { useAdminLoginMutation } from "@/store/services/auth";

const getLoginErrorMessage = (error: unknown) => {
  const fallback =
    "Invalid email or password. Please check your details and try again.";

  if (!error || typeof error !== "object" || !("data" in error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const data = (error as { data?: unknown }).data;

  if (typeof data === "string") {
    return data || fallback;
  }

  if (!data || typeof data !== "object") {
    return fallback;
  }

  const record = data as Record<string, unknown>;
  const preferredKeys = ["detail", "message", "error", "non_field_errors"];

  for (const key of preferredKeys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }

    if (Array.isArray(value)) {
      const message = value.filter(Boolean).join(" ");

      if (message) {
        return message;
      }
    }
  }

  const fieldMessage = Object.values(record)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .find((value) => typeof value === "string" && value.trim());

  return typeof fieldMessage === "string" ? fieldMessage : fallback;
};

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [adminLogin, { isLoading }] = useAdminLoginMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!event.currentTarget.checkValidity()) {
      setError("Please enter valid admin credentials.");
      return;
    }

    setError("");

    try {
      const response = await adminLogin({
        email: trimmedEmail,
        password,
      }).unwrap();
      const accessToken = extractAdminAccessToken(response);
      const refreshToken = extractAdminRefreshToken(response);
      const sessionEmail = extractAdminEmail(response, trimmedEmail);

      if (!accessToken) {
        setError("Login succeeded, but no access token was returned.");
        return;
      }

      setAdminSession({
        accessToken,
        refreshToken,
        email: sessionEmail,
      });
      navigate("/dashboard", { replace: true });
    } catch (loginError) {
      setError(getLoginErrorMessage(loginError));
    }
  };

  useEffect(() => {
    const intent = searchParams.get("intent");
    if (intent) {
      if (intent === "terminated") {
        clearAdminSession();
        toast.custom(() => (
          <CustomToast
            type="error"
            title="Warning!"
            description="Session Expired, Please Login Again!"
          />
        ));
      }
    }

    if (!intent && isAdminAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <ThemeProvider>
      <div className="flex h-screen w-full items-center justify-center overflow-hidden bg-background p-5">
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:max-w-4xl">
          <div className="col-span-1 hidden md:flex">
            <img src={LoginImg} alt="login-img" />
          </div>
          <div className="relative col-span-1 flex flex-col items-center justify-center rounded-3xl bg-muted">
            <div className="absolute right-5 top-5">
              <ModeToggle />
            </div>
            <form
              className="mx-auto flex w-full flex-col items-center justify-center gap-5 p-5 lg:p-10"
              noValidate
              onSubmit={handleSubmit}
            >
              <img src={LoginIconImg} alt="login-icon-img" />
              <div className="flex flex-col items-center justify-center">
                <span className="w-full text-center text-4xl font-extrabold">
                  Welcome Back
                </span>
                <span className="w-full text-center text-xs font-light text-gray-600 dark:text-gray-400">
                  Log into your existing ChefQailo account
                </span>
              </div>
              <div className="flex w-full flex-col items-center justify-center gap-1.5">
                <Label className="w-full text-left">Email</Label>
                <div className="flex w-full items-center justify-center gap-2.5 rounded-md bg-white px-2.5 py-1.5 ring-offset-background transition-shadow focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
                  <Mail className="size-5 text-gray-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="johndoe@email.com"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "login-error" : undefined}
                    className="flex-1 border-none bg-transparent text-black shadow-none"
                  />
                </div>
              </div>
              <div className="flex w-full flex-col items-center justify-center gap-1.5">
                <Label className="w-full text-left">Password</Label>
                <div className="flex w-full items-center justify-center gap-2.5 rounded-md bg-white px-2.5 py-1.5 ring-offset-background transition-shadow focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
                  <Lock className="size-5 text-gray-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Admin password"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "login-error" : undefined}
                    className="flex-1 border-none bg-transparent text-black shadow-none"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    className="size-8 shrink-0 text-gray-500 hover:bg-transparent hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </Button>
                </div>
              </div>
              {error ? (
                <div
                  id="login-error"
                  role="alert"
                  className="flex w-full items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
                >
                  <AlertCircle className="mt-0.5 size-5 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">
                      We could not sign you in
                    </p>
                    <p className="text-sm leading-5">{error}</p>
                  </div>
                </div>
              ) : null}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white"
                size="lg"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Login;
