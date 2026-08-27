import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { STAFF_ROLES, fetchRoles } from "@/lib/medikiosk/useAuth";

export const Route = createFileRoute("/_authenticated/_staff")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/staff-auth", search: { redirect: location.href } });
    }
    const roles = await fetchRoles(data.user.id);
    if (!roles.some((r) => STAFF_ROLES.includes(r))) {
      throw redirect({ to: "/staff-auth", search: { redirect: location.href } });
    }
    return { roles };
  },
  component: () => <Outlet />,
});
