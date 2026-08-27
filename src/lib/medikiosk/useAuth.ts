import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "doctor" | "triage" | "staff" | "patient";

export const STAFF_ROLES: AppRole[] = ["admin", "doctor", "triage", "staff"];

export async function fetchRoles(userId: string): Promise<AppRole[]> {
  const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (error || !data) return [];
  return data.map((r) => r.role as AppRole);
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    function apply(next: Session | null) {
      if (!active) return;
      setSession(next);
      setLoading(false);
      if (!next?.user) {
        setRoles([]);
        return;
      }
      void fetchRoles(next.user.id).then((r) => {
        if (active) setRoles(r);
      });
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => apply(next));
    supabase.auth.getSession().then(({ data }) => apply(data.session));

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const user: User | null = session?.user ?? null;
  const isStaff = roles.some((r) => STAFF_ROLES.includes(r));

  return { session, user, roles, isStaff, loading };
}
