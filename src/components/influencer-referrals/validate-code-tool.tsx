import { useState } from "react";

import { Loader2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useValidateReferralCodeMutation } from "@/store/services/referrals";

import { Field, toastMessage } from "./shared";
import { getApiError } from "./utils";

export const ValidateCodeTool = () => {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<ReferralValidationResponse | null>(null);
  const [validateReferralCode, { isLoading }] =
    useValidateReferralCodeMutation();

  const submit = async () => {
    if (!code.trim()) {
      toastMessage("error", "Error", "Enter a referral code to validate.");
      return;
    }

    try {
      const response = await validateReferralCode({
        code: code.trim().toUpperCase(),
      }).unwrap();

      setResult(response);
      toastMessage(
        response.valid ? "success" : "error",
        "Validation",
        response.message
      );
    } catch (error) {
      setResult(null);
      toastMessage("error", "Error", getApiError(error));
    }
  };

  return (
    <div className="grid max-w-xl gap-4 rounded-md border p-4">
      <Field label="Referral code">
        <Input
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
        />
      </Field>
      <div className="flex justify-end">
        <Button type="button" disabled={isLoading} onClick={submit}>
          {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
          Validate
        </Button>
      </div>
      {result ? (
        <div
          className={cn(
            "rounded-md border p-3 text-sm",
            result.valid
              ? "border-green-200 bg-green-50 text-green-700 dark:bg-green-500/10"
              : "border-red-200 bg-red-50 text-red-700 dark:bg-red-500/10"
          )}
        >
          <div className="font-medium">{result.message}</div>
          {result.valid ? (
            <div className="mt-2 text-muted-foreground">
              {result.discount_percentage}% discount from{" "}
              {result.influencer_name}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
