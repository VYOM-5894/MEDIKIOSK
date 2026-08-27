import { useEffect, useState } from "react";
import { KeyRound, Loader2, Plus, ShieldCheck, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type StaffRole = "doctor" | "triage" | "admin" | "staff";

type CodeRow = {
  id: string;
  code: string;
  role: StaffRole;
  active: boolean;
  created_at: string;
};

const ROLES: StaffRole[] = ["doctor", "triage", "admin", "staff"];

export function StaffCodesPanel() {
  const [rows, setRows] = useState<CodeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState("");
  const [role, setRole] = useState<StaffRole>("doctor");

  async function load() {
    const { data, error } = await supabase
      .from("staff_access_codes")
      .select("id, code, role, active, created_at")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      setDenied(true);
      return;
    }
    setDenied(false);
    setRows((data ?? []) as CodeRow[]);
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const value = code.trim().toUpperCase();
    if (!value) return;
    setBusy(true);
    const { error } = await supabase.from("staff_access_codes").insert({ code: value, role });
    setBusy(false);
    if (error) {
      toast.error("Could not create that code. It may already exist.");
      return;
    }
    setCode("");
    toast.success(`Issued ${value} for ${role}.`);
    void load();
  }

  async function toggle(row: CodeRow) {
    const { error } = await supabase
      .from("staff_access_codes")
      .update({ active: !row.active })
      .eq("id", row.id);
    if (error) {
      toast.error("Could not update that code.");
      return;
    }
    toast.success(row.active ? "Code revoked." : "Code re-activated.");
    void load();
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <KeyRound className="h-4 w-4 text-primary" /> Staff access codes
        </CardTitle>
        <CardDescription>
          Issue or revoke the codes clinicians redeem on the staff portal to unlock their role.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center py-6 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading codes…
          </div>
        ) : denied ? (
          <p className="py-4 text-sm text-muted-foreground">
            Only hospital administrators can manage access codes.
          </p>
        ) : (
          <>
            <form className="flex flex-wrap items-end gap-3" onSubmit={handleCreate}>
              <div className="min-w-48 flex-1 space-y-2">
                <Label htmlFor="new-code">New code</Label>
                <Input
                  id="new-code"
                  placeholder="MEDIKIOSK-DOCTOR-2027"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-role">Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as StaffRole)}>
                  <SelectTrigger id="new-role" className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r} className="capitalize">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="gap-2" disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Issue code
              </Button>
            </form>

            <div className="mt-6 divide-y divide-border rounded-lg border border-border">
              {rows.map((row) => (
                <div key={row.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <span className="font-mono text-sm font-medium text-foreground">{row.code}</span>
                  <Badge variant="secondary" className="capitalize">
                    {row.role}
                  </Badge>
                  <Badge variant={row.active ? "default" : "outline"}>
                    {row.active ? "Active" : "Revoked"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto gap-2"
                    onClick={() => void toggle(row)}
                  >
                    {row.active ? (
                      <>
                        <ShieldOff className="h-4 w-4" /> Revoke
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" /> Re-activate
                      </>
                    )}
                  </Button>
                </div>
              ))}
              {rows.length === 0 && (
                <p className="px-4 py-6 text-sm text-muted-foreground">No codes issued yet.</p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
