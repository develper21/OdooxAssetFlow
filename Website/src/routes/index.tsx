import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSession, type Role } from "@/lib/session";
import { Moon, Sun, ShieldCheck, Boxes, LayoutDashboard, User, ChevronDown, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

const ROLES: { role: Role; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { role: "admin", label: "Admin", icon: ShieldCheck },
  { role: "asset_manager", label: "Asset Manager", icon: Boxes },
  { role: "department_head", label: "Department Head", icon: LayoutDashboard },
  { role: "employee", label: "Employee", icon: User },
];

function LoginPage() {
  const { login, user, hydrated, theme, toggleTheme } = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>("admin");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && user) navigate(`/u/role/${user.role}/tab/dashboard`);
  }, [hydrated, user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Real backend login
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      const userData = {
        id: response.user._id,
        name: `${response.user.firstName} ${response.user.lastName}`,
        email: response.user.email,
        role: response.user.role,
        department: response.user.department?.name || response.user.department,
        avatar: response.user.avatar,
      };
      login(userData, response.token);
      toast.success("Login successful");
      navigate(`/u/role/${userData.role}/tab/dashboard`);
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        {/* Left: brand */}
        <div className="neu relative flex flex-col justify-between p-8 md:p-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/favicon.png" alt="AssetFlow Logo" className="h-11 w-11 rounded-xl object-contain shadow-sm" />
              <div>
                <div className="font-display text-xl font-semibold">AssetFlow</div>
                <div className="text-xs text-muted-foreground">Resource OS</div>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="neu-sm grid h-10 w-10 place-items-center"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <div className="my-10 space-y-5">
            <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
              One workspace for every asset, booking, and audit.
            </h1>
            <p className="max-w-md text-muted-foreground">
              Register hardware, allocate to teams, book shared resources, track
              maintenance, and close audit cycles — from a single, calm interface.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { k: "Assets", v: "1,284" },
              { k: "Utilization", v: "87%" },
              { k: "Uptime", v: "99.9%" },
            ].map((s) => (
              <div key={s.k} className="neu-inset p-4">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.k}</div>
                <div className="mt-1 font-display text-xl font-semibold">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div className="neu p-8 md:p-12">
          <div className="mb-8">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Sign in</div>
            <h2 className="mt-1 font-display text-2xl font-semibold">Welcome back</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your credentials to sign in.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Role</span>
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as Role)}
                  className="neu-inset w-full appearance-none rounded-xl bg-transparent pl-4 pr-10 py-3 text-sm outline-none cursor-pointer text-foreground"
                >
                  {ROLES.map((r) => (
                    <option key={r.role} value={r.role} className="bg-white text-black dark:bg-zinc-800 dark:text-white font-medium">
                      {r.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="neu-inset w-full rounded-xl bg-transparent px-4 py-3 text-sm outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="neu-inset w-full rounded-xl bg-transparent pl-4 pr-10 py-3 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="neu-accent w-full rounded-xl px-4 py-3 text-sm font-semibold transition-transform active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <button 
                type="button" 
                onClick={() => navigate("/forgot-password")}
                className="hover:text-foreground"
              >
                Forgot password?
              </button>
              <button 
                type="button" 
                onClick={() => navigate("/signup")}
                className="hover:text-foreground"
              >
                Employee sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
