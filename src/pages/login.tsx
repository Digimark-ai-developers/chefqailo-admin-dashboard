import { type FormEvent, useEffect, useState } from "react";

import { Loader2, Lock, Mail } from "lucide-react";
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
  extractAdminEmail,
  extractAdminAccessToken,
  extractAdminRefreshToken,
  isAdminAuthenticated,
  setAdminSession,
} from "@/lib/admin-auth";
import { useAdminLoginMutation } from "@/store/services/auth";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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
      const message =
        loginError && typeof loginError === "object" && "data" in loginError
          ? JSON.stringify((loginError as { data?: unknown }).data)
          : "Unable to login. Please check your credentials and try again.";

      setError(message);
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
                <div className="flex w-full items-center justify-center gap-2.5 rounded-md bg-white px-2.5 py-1.5">
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
                    aria-describedby={error ? "login-email-error" : undefined}
                    className="flex-1 border-none bg-transparent text-black shadow-none"
                  />
                </div>
                {error ? (
                  <p
                    id="login-email-error"
                    className="w-full text-left text-sm text-destructive"
                  >
                    {error}
                  </p>
                ) : null}
              </div>
              <div className="flex w-full flex-col items-center justify-center gap-1.5">
                <Label className="w-full text-left">Password</Label>
                <div className="flex w-full items-center justify-center gap-2.5 rounded-md bg-white px-2.5 py-1.5">
                  <Lock className="size-5 text-gray-500" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Admin password"
                    aria-invalid={Boolean(error)}
                    className="flex-1 border-none bg-transparent text-black shadow-none"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Login;
