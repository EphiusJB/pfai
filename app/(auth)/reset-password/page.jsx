"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useDesktopAutofocus } from "@/hooks/use-desktop-autofocus";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, KeyRound } from "lucide-react";
import {
  AuthCard, AuthHeading, FormField,
  PasswordInput, PasswordStrength, SubmitButton, AlertBanner,
} from "@/components/auth/AuthPrimitives";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

function ResetForm() {
  const router = useRouter();
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [ready,     setReady]     = useState(false);
  const [done,      setDone]      = useState(false);
  const [error,     setError]     = useState("");
  const [errors,    setErrors]    = useState({});
  const passwordRef = useRef(null);
  useDesktopAutofocus(passwordRef, ready && !done);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const validate = () => {
    const e = {};
    if (!password)                e.password = "Password is required";
    else if (password.length < 8) e.password = "Password must be at least 8 characters";
    if (confirm !== password)     e.confirm  = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;
      setDone(true);
      setTimeout(() => router.push("/sign-in"), 3000);
    } catch (err) {
      setError(err?.message ?? "Could not update password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  // ── Token not yet received ────────────────────────────────
  if (!ready && !done) {
    return (
      <AuthCard>
        <div className="flex flex-col items-center text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center"
            style={{ background: "var(--color-bg)" }}>
            <KeyRound size={28} style={{ color: "var(--color-text-muted)" }} className="motion-safe:animate-pulse" />
          </div>
          <p className="text-[14px]" style={{ color: "var(--color-text-secondary)" }}>
            Verifying your reset link…
          </p>
          <p className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
            If nothing happens, the link may have expired.{" "}
            <Link href="/forgot-password" className="font-medium hover:underline"
              style={{ color: "var(--color-accent)" }}>
              Request a new one
            </Link>
          </p>
        </div>
      </AuthCard>
    );
  }

  // ── Password updated ──────────────────────────────────────
  if (done) {
    return (
      <AuthCard>
        <div className="flex flex-col items-center text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center"
            style={{ background: "var(--color-success-bg)" }}>
            <CheckCircle2 size={32} style={{ color: "var(--color-success)" }} />
          </div>
          <div>
            <h2 className="text-[20px] font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>
              Password updated!
            </h2>
            <p className="text-[14px]" style={{ color: "var(--color-text-secondary)" }}>
              Redirecting you to sign in…
            </p>
          </div>
        </div>
      </AuthCard>
    );
  }

  // ── Reset form ────────────────────────────────────────────
  return (
    <AuthCard>
      <AuthHeading
        title="Set new password"
        subtitle="Choose a strong password for your account"
      />

      <AlertBanner type="error" message={error} />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField label="New password" error={errors.password}>
          <PasswordInput
            placeholder="Create a strong password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="new-password"
            ref={passwordRef}
          />
          <PasswordStrength password={password} />
        </FormField>

        <FormField label="Confirm new password" error={errors.confirm}>
          <PasswordInput
            placeholder="Repeat your new password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            error={errors.confirm}
            autoComplete="new-password"
          />
        </FormField>

        <SubmitButton loading={loading}>
          {loading ? "Updating password…" : "Update password"}
        </SubmitButton>
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
