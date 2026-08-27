import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, User as UserIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/medikiosk/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const { user, roles, isStaff, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (loading) return null;

  if (!user) {
    return (
      <Button asChild size="sm">
        <Link to="/auth">Sign in</Link>
      </Button>
    );
  }

  async function handleSignOut() {
    const destination = isStaff ? "/staff-auth" : "/auth";
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: destination, replace: true });
  }

  const label = (user.user_metadata?.["full_name"] as string | undefined) ?? user.email ?? "Account";
  const primaryRole = isStaff ? (roles.find((r) => r !== "patient") ?? "staff") : "patient";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Account menu">
          <UserIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="space-y-2">
          <div className="truncate">{label}</div>
          <Badge variant={isStaff ? "default" : "secondary"} className="capitalize">
            {primaryRole}
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
