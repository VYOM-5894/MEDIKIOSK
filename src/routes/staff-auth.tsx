import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { KeyRound, Loader2, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { STAFF_ROLES, fetchRoles } from "@/lib/medikiosk/useAuth";

type AuthSearch = { redirect?: string | undefined };

export const Route = createFileRoute("/staff-auth")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    redirect: typeof search['redirect'] === "string" ? search['redirect'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Staff Portal Sign In — MediKiosk" },
      {
        name: "description",
        content:
          "Secure staff portal for MediKiosk doctors, triage nurses and administrators. Sign in and unlock your clinical role with an access code.",
      },
      { property: "og:title", content: "Staff Portal Sign In — MediKiosk" },
      {
        property: "og:description",
        content: "Role-gated access to the MediKiosk triage queue and clinical dashboards.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StaffAuthPage,
});

function safePath(value: string | undefined) {
  if (!value) return "/doctor";
  if (!value.startsWith("/") || value.startsWith("//")) return "/doctor";
  return value;
}

function StaffAuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const destination = safePath(search.redirect);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [needsCode, setNeedsCode] = useState(false);
  const [checking, setChecking] = useState(true);

  const evaluate = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setNeedsCode(false);
      setChecking(false);
      return;
    }
    const roles = await fetchRoles(data.user.id);
    if (roles.some((r) => STAFF_ROLES.includes(r))) {
      navigate({ to: destination, replace: true });
      return;
    }
    setNeedsCode(true);
    setChecking(false);
  }, [destination, navigate]);

  useEffect(() => {
    void evaluate();
  }, [evaluate]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setBusy(false);
      toast.error(error.message);
      return;
    }
    await evaluate();
    setBusy(false);
  }

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.rpc("redeem_staff_code", { _code: code.toUpperCase() });
    setBusy(false);
    if (error) {
      toast.error("That access code is not valid.");
      return;
    }
    toast.success(`Access granted: ${String(data)}`);
    navigate({ to: destination, replace: true });
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-muted/50 to-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
            <Stethoscope className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Staff portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Doctors, triage nurses and administrators only.
          </p>
        </div>

        <Card>
          {checking ? (
            <CardContent className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Checking access…
            </CardContent>
          ) : needsCode ? (
            <>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Enter your clinical access code</CardTitle>
                <CardDescription>
                  Your account is signed in but has no clinical role yet. Ask your administrator for
                  a code.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleRedeem}>
                  <div className="space-y-2">
                    <Label htmlFor="staff-code">Access code</Label>
                    <Input
                      id="staff-code"
                      required
                      placeholder="MEDIKIOSK-DOCTOR-2026"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="font-mono uppercase"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <KeyRound className="mr-2 h-4 w-4" />
                    )}
                    Unlock staff access
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Clinical sign in</CardTitle>
                <CardDescription>Use your hospital account credentials.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSignIn}>
                  <div className="space-y-2">
                    <Label htmlFor="staff-email">Work email</Label>
                    <Input
                      id="staff-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staff-password">Password</Label>
                    <Input
                      id="staff-password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign in to staff portal
                  </Button>
                </form>
                <p className="mt-4 text-xs text-muted-foreground">
                  No hospital account yet? Create one on the{" "}
                  <Link to="/auth" className="text-primary hover:underline">
                    patient page
                  </Link>{" "}
                  and unlock it here with your clinical access code.
                </p>
              </CardContent>
            </>
          )}
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Looking for your own intake?{" "}
          <Link to="/auth" className="font-medium text-primary hover:underline">
            Patient sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
