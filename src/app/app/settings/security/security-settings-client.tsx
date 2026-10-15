"use client";

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  startTwoFactorSetup,
  confirmTwoFactorSetup,
  disableTwoFactor,
  type ConfirmSetupResult,
  type Disable2FAResult,
} from "@/lib/two-factor-actions";

type Props = {
  enabled: boolean;
  enabledAt: string | null;
  backupCodeCount: number;
};

type FlowStep = "idle" | "showing-qr" | "showing-backup-codes";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function SecuritySettingsClient({
  enabled,
  enabledAt,
  backupCodeCount,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState<FlowStep>("idle");
  const [setupError, setSetupError] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [manualSecret, setManualSecret] = useState("");
  const [isStartingSetup, setIsStartingSetup] = useState(false);
  const [confirmedBackupCodes, setConfirmedBackupCodes] = useState<string[]>(
    []
  );
  const [codesCopied, setCodesCopied] = useState(false);

  const [confirmState, confirmAction, confirmPending] = useActionState(
    async (
      prev: ConfirmSetupResult | undefined,
      formData: FormData
    ): Promise<ConfirmSetupResult | undefined> => {
      const result = await confirmTwoFactorSetup(prev, formData);
      if (result.success) {
        setConfirmedBackupCodes(result.backupCodes);
        setStep("showing-backup-codes");
      }
      return result;
    },
    undefined
  );

  const [disableState, disableAction, disablePending] = useActionState<
    Disable2FAResult | undefined,
    FormData
  >(disableTwoFactor, undefined);

  async function handleStartSetup() {
    setIsStartingSetup(true);
    setSetupError("");

    const result = await startTwoFactorSetup();
    setIsStartingSetup(false);

    if (!result.success) {
      setSetupError(result.error);
      return;
    }

    setQrDataUrl(result.qrDataUrl);
    setManualSecret(result.secret);
    setStep("showing-qr");
  }

  function handleCopyCodes() {
    navigator.clipboard.writeText(confirmedBackupCodes.join("\n"));
    setCodesCopied(true);
  }

  function handleFinishSetup() {
    setStep("idle");
    setConfirmedBackupCodes([]);
    setCodesCopied(false);
    router.refresh();
  }

  // ---------------------------------------------------------------
  // 2FA is enabled — show status and disable form
  // ---------------------------------------------------------------
  if (enabled && step === "idle") {
    return (
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Two-factor authentication
        </h2>
        <p className="text-sm text-green-700 font-medium mb-6">
          ✓ Enabled{enabledAt ? ` since ${formatDate(enabledAt)}` : ""}
        </p>

        <p className="text-sm text-gray-600 mb-6">
          You have {backupCodeCount} unused backup code
          {backupCodeCount === 1 ? "" : "s"} remaining.
        </p>

        <hr className="border-gray-200 mb-6" />

        <h3 className="text-base font-semibold text-gray-900 mb-2">
          Disable two-factor authentication
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Enter your password to confirm. Your account will be less secure
          without 2FA.
        </p>

        <form action={disableAction} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {disableState?.success === false &&
              disableState.fieldErrors?.password && (
                <p className="mt-1 text-sm text-red-600">
                  {disableState.fieldErrors.password[0]}
                </p>
              )}
          </div>

          {disableState?.success === false &&
            !disableState.fieldErrors?.password && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                {disableState.error}
              </div>
            )}

          <button
            type="submit"
            disabled={disablePending}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 font-medium"
          >
            {disablePending ? "Disabling..." : "Disable 2FA"}
          </button>
        </form>
      </section>
    );
  }

  // ---------------------------------------------------------------
  // Just confirmed — show backup codes (once only)
  // ---------------------------------------------------------------
  if (step === "showing-backup-codes") {
    return (
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Two-factor authentication enabled
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Save these backup codes somewhere safe. Each code can be used once
          if you lose access to your authenticator app.
        </p>

        <div className="rounded-md bg-yellow-50 border border-yellow-200 p-4 mb-6">
          <p className="text-sm text-yellow-800 font-medium">
            ⚠️ These codes will not be shown again. Copy them now.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6 font-mono text-sm">
          <div className="grid grid-cols-2 gap-2">
            {confirmedBackupCodes.map((code, i) => (
              <div key={i} className="text-gray-900">
                {code}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCopyCodes}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 font-medium"
          >
            {codesCopied ? "✓ Copied" : "Copy all codes"}
          </button>
          <button
            type="button"
            onClick={handleFinishSetup}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
          >
            I&apos;ve saved them — done
          </button>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------
  // Showing QR code for setup
  // ---------------------------------------------------------------
  if (step === "showing-qr") {
    return (
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Set up two-factor authentication
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Scan this QR code with Google Authenticator, Authy, 1Password, or any
          TOTP-compatible app.
        </p>

        <div className="flex flex-col items-center mb-6">
          {qrDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrDataUrl}
              alt="Two-factor authentication QR code"
              className="border border-gray-200 rounded-md"
              width={256}
              height={256}
            />
          )}
        </div>

        <details className="mb-6">
          <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
            Can&apos;t scan? Enter this code manually
          </summary>
          <p className="mt-3 font-mono text-sm bg-gray-50 border border-gray-200 rounded px-3 py-2 break-all">
            {manualSecret}
          </p>
        </details>

        <form action={confirmAction} className="space-y-4">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Enter the 6-digit code from your app
            </label>
            <input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              required
              autoComplete="one-time-code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg tracking-widest text-center"
              placeholder="000000"
            />
            {confirmState?.success === false &&
              confirmState.fieldErrors?.code && (
                <p className="mt-1 text-sm text-red-600">
                  {confirmState.fieldErrors.code[0]}
                </p>
              )}
            {confirmState?.success === false &&
              !confirmState.fieldErrors?.code && (
                <p className="mt-1 text-sm text-red-600">
                  {confirmState.error}
                </p>
              )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={confirmPending}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {confirmPending ? "Verifying..." : "Confirm and enable"}
            </button>
            <button
              type="button"
              onClick={() => setStep("idle")}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    );
  }

  // ---------------------------------------------------------------
  // Default: not enabled
  // ---------------------------------------------------------------
  return (
    <section className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        Two-factor authentication
      </h2>
      <p className="text-sm text-yellow-700 font-medium mb-4">⚠️ Not enabled</p>
      <p className="text-sm text-gray-600 mb-6">
        Add an extra layer of security. After entering your password,
        you&apos;ll be asked for a 6-digit code from your authenticator app.
      </p>

      {setupError && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
          {setupError}
        </div>
      )}

      <button
        type="button"
        onClick={handleStartSetup}
        disabled={isStartingSetup}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
      >
        {isStartingSetup
          ? "Preparing..."
          : "Set up two-factor authentication"}
      </button>
    </section>
  );
}