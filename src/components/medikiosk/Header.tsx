import { Link } from "@tanstack/react-router";
import { Activity, CalendarClock, Menu, Phone, Stethoscope, Tablet, UserCog } from "lucide-react";
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
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card">
      {/* Government identity strip */}
      <div className="bg-surface text-[11px] text-muted-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 lg:px-6">
          <span className="truncate font-medium">
            भारत सरकार | Government of India · Ministry of Health &amp; Family Welfare
          </span>
          <span className="hidden shrink-0 items-center gap-1 sm:flex">
            <Phone className="h-3 w-3" /> Emergency 108 · Helpline 104
          </span>
        </div>
      </div>
      <div className="h-0.5 tricolor-rule" />

      {/* Masthead */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center border-2 border-primary bg-primary text-primary-foreground">
            <Activity className="h-6 w-6" />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-lg font-bold tracking-tight text-foreground sm:text-xl">
              MediKiosk
            </div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              National Digital OPD Intake · ABDM aligned
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <AccessibilityToggle />
          <UserMenu />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="mt-6 flex flex-col gap-1">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 border-l-2 border-l-transparent px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-accent/15 hover:text-foreground"
                    activeProps={{ className: "border-l-accent bg-accent/15 text-foreground" }}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
                {!isStaff && (
                  <Link
                    to="/staff-auth"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 border-l-2 border-l-transparent px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-accent/15 hover:text-foreground"
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

      {/* Primary navigation bar */}
      <nav className="hidden bg-primary text-primary-foreground md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-0 px-4 lg:px-6">
          <Link
            to="/"
            className="px-4 py-2.5 text-sm font-medium text-primary-foreground/85 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-primary-foreground/15 text-primary-foreground" }}
          >
            Home
          </Link>
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="px-4 py-2.5 text-sm font-medium text-primary-foreground/85 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
              activeProps={{ className: "bg-primary-foreground/15 text-primary-foreground" }}
            >
              {item.label}
            </Link>
          ))}
          {!isStaff && (
            <Link
              to="/staff-auth"
              className="ml-auto px-4 py-2.5 text-sm font-medium text-primary-foreground/85 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              Staff Portal
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
