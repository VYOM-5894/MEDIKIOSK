import { Link } from "@tanstack/react-router";
import { Activity, CalendarClock, Menu, Stethoscope, Tablet, UserCog } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { AccessibilityToggle } from "./AccessibilityToggle";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/lib/medikiosk/useAuth";

const patientNav = [
  { to: "/intake", label: "Patient Intake", icon: Activity },
  { to: "/appointment", label: "My Appointment", icon: CalendarClock },
];

const staffNav = [
  { to: "/doctor", label: "Doctor", icon: Stethoscope },
  { to: "/triage", label: "Triage", icon: Tablet },
  { to: "/admin", label: "Admin", icon: UserCog },
  { to: "/demo", label: "Demo", icon: Activity },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { isStaff } = useAuth();
  const nav = isStaff ? [...patientNav, ...staffNav] : patientNav;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="h-5 w-5" />
          </div>
          <span>MediKiosk</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: "bg-primary/10 text-primary" }}
            >
              {item.label}
            </Link>
          ))}
          {!isStaff && (
            <Link
              to="/staff-auth"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Staff portal
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <AccessibilityToggle />
          <UserMenu />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="mt-6 flex flex-col gap-2">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    activeProps={{ className: "bg-primary/10 text-primary" }}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
                {!isStaff && (
                  <Link
                    to="/staff-auth"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <Stethoscope className="h-4 w-4" />
                    Staff portal
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
