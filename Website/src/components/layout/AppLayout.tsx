import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, Boxes, Users, Building2, Tag, CalendarCheck, Wrench,
  ArrowLeftRight, BarChart3, Bell, LogOut, Moon, Sun,
  Menu, Search, ChevronRight, ShieldCheck,
} from "lucide-react";
import { useSession, type Role } from "@/lib/session";
import { cn } from "@/lib/utils";

interface NavItem {
  tab: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

// Helper function to generate URL based on role and tab
const generateRoleUrl = (role: string, tab: string): string => {
  return `/u/role/${role}/tab/${tab}`;
};

const NAV: NavItem[] = [
  { tab: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "asset_manager", "department_head", "employee"] },
  { tab: "assets", label: "Asset Registry", icon: Boxes, roles: ["admin", "asset_manager", "department_head", "employee"] },
  { tab: "allocations", label: "Allocations", icon: ArrowLeftRight, roles: ["admin", "asset_manager", "department_head"] },
  { tab: "bookings", label: "Bookings", icon: CalendarCheck, roles: ["admin", "asset_manager", "department_head", "employee"] },
  { tab: "maintenance", label: "Maintenance", icon: Wrench, roles: ["admin", "asset_manager", "department_head", "employee"] },
  { tab: "audits", label: "Audits", icon: ShieldCheck, roles: ["admin", "asset_manager"] },
  { tab: "departments", label: "Departments", icon: Building2, roles: ["admin"] },
  { tab: "categories", label: "Categories", icon: Tag, roles: ["admin", "asset_manager"] },
  { tab: "employees", label: "Employees", icon: Users, roles: ["admin"] },
  { tab: "reports", label: "Reports", icon: BarChart3, roles: ["admin", "asset_manager", "department_head"] },
  { tab: "notifications", label: "Notifications", icon: Bell, roles: ["admin", "asset_manager", "department_head", "employee"] },
];

const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin",
  asset_manager: "Asset Manager",
  department_head: "Department Head",
  employee: "Employee",
};

export function AppLayout() {
  const { user, logout, theme, toggleTheme, hydrated } = useSession();
  const navigate = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !user) navigate("/");
  }, [hydrated, user, navigate]);

  const items = useMemo(
    () => (user ? NAV.filter((n) => n.roles.includes(user.role)) : []),
    [user],
  );

  const unread = 0;
  const crumb = loc.pathname.split("/").filter(Boolean).slice(-1)[0] ?? "dashboard";
  const pageTitle = crumb.charAt(0).toUpperCase() + crumb.slice(1).replace(/-/g, " ");

  if (!hydrated || !user) return null;

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground">
      <div className="flex h-full w-full gap-5 p-4 md:p-6 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "neu fixed inset-y-4 left-4 z-40 flex h-[calc(100vh-2rem)] w-64 flex-col p-5 transition-transform md:static md:inset-auto md:translate-x-0 md:h-full md:shrink-0",
            open ? "translate-x-0" : "-translate-x-[110%]",
          )}
        >
          <div className="mb-6 flex items-center gap-3">
            <img src="/favicon.png" alt="AssetFlow Logo" className="h-10 w-10 rounded-xl object-contain shadow-sm" />
            <div>
              <div className="font-display text-lg font-semibold leading-tight">AssetFlow</div>
              <div className="text-xs text-muted-foreground">Resource OS</div>
            </div>
          </div>

          <div className="neu-inset mb-6 flex items-center gap-3 p-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/20 font-semibold text-primary">
              {user.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{user.name}</div>
              <div className="truncate text-xs text-muted-foreground">{ROLE_LABEL[user.role]}</div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
            {items.map((n) => {
              const currentUrl = generateRoleUrl(user.role, n.tab);
              const isDashboard = n.tab === "dashboard";
              const active =
                loc.pathname === currentUrl ||
                (!isDashboard && loc.pathname.startsWith(currentUrl));
              const Icon = n.icon;
              return (
                <Link
                  key={n.tab}
                  to={currentUrl}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                    active
                      ? "neu-accent text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{n.label}</span>
                  {active && <ChevronRight className="ml-auto h-4 w-4" />}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </aside>

        {open && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Right Section Container */}
        <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden">
          {/* Top Search Bar (Fixed) */}
          <header className="neu rounded-2xl flex shrink-0 items-center gap-3 p-3 md:p-4 mb-4 z-10">
            <button
              className="neu-sm grid h-10 w-10 place-items-center md:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="neu-inset flex flex-1 items-center gap-2 rounded-xl px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder={`Search ${pageTitle.toLowerCase()}…`}
              />
            </div>
            <button
              className="neu-sm grid h-10 w-10 place-items-center"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link to={generateRoleUrl(user.role, "notifications")} className="neu-sm relative grid h-10 w-10 place-items-center">
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {unread}
                </span>
              )}
            </Link>
          </header>

          {/* Scrollable Content Container */}
          <main className="flex-1 overflow-y-auto min-h-0 custom-scrollbar px-1 py-1 pr-3 space-y-6">
            <Outlet />

            <footer className="pb-6 pt-2 text-center text-xs text-muted-foreground">
              AssetFlow · Demo build · {ROLE_LABEL[user.role]} view
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
