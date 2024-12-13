import { useState } from "react";

import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Mail } from "lucide-react";

import LoginIconImg from "@/assets/img/login2.svg";
import LoginImg from "@/assets/img/login.svg";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const { login } = useKindeAuth();
  const [email, setEmail] = useState<string>("");

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
            <form className="mx-auto flex w-full flex-col items-center justify-center gap-5 p-5 lg:w-2/3 lg:p-0">
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="johndoe@email.com"
                    className="flex-1 border-none bg-transparent text-black shadow-none"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-white"
                size="lg"
                onClick={() =>
                  login({
                    authUrlParams: {
                      connection_id: `${import.meta.env.VITE_KINDE_EMAIL_CONNECTION_ID}`,
                      login_hint: email,
                    },
                  })
                }
              >
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Login;
